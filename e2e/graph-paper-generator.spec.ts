import { test, expect } from './helpers/test';

test.describe('方眼紙・罫線・原稿用紙の作成', () => {
  test('既定値でA4方眼のプレビューとマス数が表示される', async ({ page }) => {
    await page.goto('/tools/graph-paper-generator/');
    await expect(page.locator('#gp-output svg')).toBeVisible();
    await expect(page.locator('#gp-summary')).toHaveText('横38マス × 縦55マス');
  });

  test('用紙・向き・マス寸法を変えるとマス数が変わる', async ({ page }) => {
    await page.goto('/tools/graph-paper-generator/');
    await page.locator('#gp-orientation').selectOption('landscape');
    await page.locator('#gp-cell').fill('10');
    // 297-20=277 → 27、210-20=190 → 19
    await expect(page.locator('#gp-summary')).toHaveText('横27マス × 縦19マス');
    await expect(page.locator('#gp-output svg')).toHaveAttribute(
      'viewBox',
      '0 0 297 210',
    );
  });

  test('ドット方眼は円で描画される', async ({ page }) => {
    await page.goto('/tools/graph-paper-generator/');
    await page.locator('#gp-type').selectOption('dot');
    await expect(page.locator('#gp-output circle').first()).toBeAttached();
    await expect(page.locator('#gp-output path')).toHaveCount(0);
  });

  test('範囲外の値はエラーになり、印刷・保存ボタンが無効になる', async ({
    page,
  }) => {
    await page.goto('/tools/graph-paper-generator/');
    await page.locator('#gp-cell').fill('1');
    await expect(page.locator('#gp-error')).toContainText('2〜50mm');
    await expect(page.locator('#gp-output svg')).toHaveCount(0);
    await expect(page.locator('#gp-print-button')).toBeDisabled();
    await expect(page.locator('#gp-download-button')).toBeDisabled();
    await page.locator('#gp-cell').fill('5');
    await expect(page.locator('#gp-error')).toBeEmpty();
    await expect(page.locator('#gp-print-button')).toBeEnabled();
  });

  test('SVGを保存できる', async ({ page }) => {
    await page.goto('/tools/graph-paper-generator/');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#gp-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('grid-a4-5mm.svg');
  });

  test('印刷時は用紙だけが残る', async ({ page }) => {
    await page.goto('/tools/graph-paper-generator/');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-howto]')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#gp-cell')).toBeHidden();
    await expect(page.locator('#gp-output svg')).toBeVisible();
  });

  test('CSP違反もコンソールエラーも出ず、操作しても動作する（本番ビルドのCSP下）', async ({
    page,
  }) => {
    const violations: string[] = [];
    const consoleErrors: string[] = [];
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (e) => {
        (window as unknown as { __csp: string[] }).__csp ??= [];
        (window as unknown as { __csp: string[] }).__csp.push(
          e.violatedDirective,
        );
      });
    });
    page.on('console', (msg) => {
      const text = msg.text();
      if (/Content Security Policy|CSP/i.test(text)) violations.push(text);
      if (msg.type() === 'error') consoleErrors.push(text);
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/tools/graph-paper-generator/');
    await expect(page.locator('#gp-output svg')).toBeVisible();
    await page.locator('#gp-type').selectOption('manuscript');
    await page.locator('#gp-paper').selectOption('b5');
    await page.locator('#gp-line-width').fill('0.2');
    await page.locator('#gp-color').fill('#ff0000');
    await expect(
      page.locator('#gp-output svg rect[stroke="#ff0000"]'),
    ).toHaveCount(1);
    await page.locator('#gp-download-button').click();
    await expect(page.locator('#gp-summary')).toHaveText(/.+/);

    const cspEvents = await page.evaluate(
      () => (window as unknown as { __csp?: string[] }).__csp ?? [],
    );
    expect(cspEvents).toEqual([]);
    expect(violations).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('用紙サイズは名前付き@page（静的CSS）で指定され、印刷PDFが実寸・1ページに収まる', async ({
    page,
  }) => {
    await page.goto('/tools/graph-paper-generator/');
    const output = page.locator('#gp-output');
    await expect(output).toHaveCSS('page', 'gp-a4-portrait');

    // 1pt = 25.4/72 mm。PDFの MediaBox（pt）を mm に直して用紙サイズを確かめる
    const toMm = (pt: string) => (Number(pt) * 25.4) / 72;
    const checkPdf = async (wMm: number, hMm: number) => {
      const pdf = await page.pdf({ preferCSSPageSize: true });
      const text = pdf.toString('latin1');
      const pageCount = (text.match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;
      const boxes = [
        ...text.matchAll(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/g),
      ];
      expect(pageCount).toBe(1);
      expect(boxes.length).toBeGreaterThan(0);
      expect(toMm(boxes[0][1])).toBeCloseTo(wMm, 0);
      expect(toMm(boxes[0][2])).toBeCloseTo(hMm, 0);
    };

    // 既定の A4 縦
    await checkPdf(210, 297);

    await page.locator('#gp-paper').selectOption('b5');
    await page.locator('#gp-orientation').selectOption('landscape');
    await expect(output).toHaveCSS('page', 'gp-b5-landscape');
    // B5 横 = 257mm × 182mm
    await checkPdf(257, 182);
  });

  test('英語版でも動作する', async ({ page }) => {
    await page.goto('/en/tools/graph-paper-generator/');
    await expect(page.locator('#gp-summary')).toHaveText(
      '38 columns × 55 rows',
    );
    await page.locator('#gp-paper').selectOption('letter');
    await expect(page.locator('#gp-output svg')).toHaveAttribute(
      'viewBox',
      '0 0 215.9 279.4',
    );
  });
});
