import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('名刺作成', () => {
  test('既定ではA4に10面の横向き名刺が並び、名前付きページが指定される', async ({
    page,
  }) => {
    await page.goto('/tools/business-card-maker/');
    const output = page.locator('#bc-output');
    await expect(output.locator('.bc-card')).toHaveCount(10);
    await expect(output).toHaveCSS('page', 'bc-a4p');
    await expect(page.locator('#bc-print-button')).toBeDisabled();
    await expect(page.locator('#bc-empty')).toBeVisible();
  });

  test('入力が名刺に反映され、QRコードが描画される', async ({ page }) => {
    await page.goto('/tools/business-card-maker/');
    await page.locator('#bc-family').fill('山田');
    await page.locator('#bc-given').fill('太郎');
    await page.locator('#bc-company').fill('株式会社サンプル');
    await page.locator('#bc-postal').fill('100-0001');
    await page.locator('#bc-phone').fill('03-1234-5678');
    await page.locator('#bc-email').fill('taro@example.com');
    const first = page.locator('#bc-output .bc-card').first();
    await expect(first).toContainText('山田 太郎');
    await expect(first).toContainText('株式会社サンプル');
    await expect(first).toContainText('〒100-0001');
    await expect(first).toContainText('taro@example.com');
    await expect(first.locator('.bc-qr svg path')).toHaveCount(1);
    await expect(page.locator('#bc-print-button')).toBeEnabled();
    await expect(page.locator('#bc-empty')).toBeHidden();
  });

  test('QRを「入れない」にするとQRが消え、URLのみで空なら警告が出る', async ({
    page,
  }) => {
    await page.goto('/tools/business-card-maker/');
    await page.locator('#bc-family').fill('山田');
    await expect(page.locator('#bc-output .bc-qr')).toHaveCount(10);
    await page.locator('#bc-qr').selectOption('url');
    await expect(page.locator('#bc-output .bc-qr')).toHaveCount(0);
    await expect(page.locator('#bc-warnings')).toContainText('QRコード');
    await page.locator('#bc-url').fill('example.com');
    await expect(page.locator('#bc-output .bc-qr')).toHaveCount(10);
    await page.locator('#bc-qr').selectOption('none');
    await expect(page.locator('#bc-output .bc-qr')).toHaveCount(0);
    await expect(page.locator('#bc-warnings')).toBeEmpty();
  });

  test('枚数と印刷方法・向きが面付けに反映される', async ({ page }) => {
    await page.goto('/tools/business-card-maker/');
    await page.locator('#bc-family').fill('山田');
    await page.locator('#bc-count').fill('3');
    await expect(page.locator('#bc-output .bc-card')).toHaveCount(3);
    await page.locator('#bc-orientation').selectOption('portrait');
    await expect(page.locator('#bc-output')).toHaveCSS('page', 'bc-a4l');
    await page.locator('#bc-mode').selectOption('single');
    await expect(page.locator('#bc-output .bc-card')).toHaveCount(1);
    await expect(page.locator('#bc-output')).toHaveCSS('page', 'bc-single-v');
    await expect(page.locator('#bc-count')).toBeDisabled();
  });

  test('範囲外の値はエラーになり、印刷ボタンが無効になる', async ({ page }) => {
    await page.goto('/tools/business-card-maker/');
    await page.locator('#bc-family').fill('山田');
    await page.locator('#bc-qr-size').fill('50');
    await expect(page.locator('#bc-error')).toContainText('QRコードの大きさ');
    await expect(page.locator('#bc-print-button')).toBeDisabled();
    await page.locator('#bc-qr-size').fill('20');
    await expect(page.locator('#bc-error')).toBeEmpty();
    await expect(page.locator('#bc-print-button')).toBeEnabled();
  });

  test('入力値は sessionStorage に保存されず、URLクエリでも入らない（個人情報）', async ({
    page,
  }) => {
    await page.goto('/tools/business-card-maker/?text=秘密');
    await expect(page.locator('#bc-family')).toHaveValue('');
    await page.locator('#bc-family').fill('山田');
    const stored = await page.evaluate(() =>
      JSON.stringify({ ...sessionStorage }),
    );
    expect(stored).not.toContain('山田');
  });

  test('印刷時は名刺の面だけが残る', async ({ page }) => {
    await page.goto('/tools/business-card-maker/');
    await page.locator('#bc-family').fill('山田');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#bc-family')).toBeHidden();
    await expect(page.locator('#bc-output')).toBeVisible();
  });

  test('印刷PDFが実寸で1ページに収まる（A4縦・名刺1枚）', async ({ page }) => {
    await page.goto('/tools/business-card-maker/');
    await page.locator('#bc-family').fill('山田');
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
    await checkPdf(210, 297);
    await page.locator('#bc-mode').selectOption('single');
    await expect(page.locator('#bc-output')).toHaveCSS('page', 'bc-single-h');
    await checkPdf(91, 55);
  });

  test('CSP違反もコンソールエラーも出ず、操作しても動作する（本番ビルドのCSP下）', async ({
    page,
  }) => {
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
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/tools/business-card-maker/');
    await page.locator('#bc-family').fill('山田');
    await page.locator('#bc-layout').selectOption('band');
    await page.locator('#bc-font').selectOption('serif');
    await page.locator('#bc-orientation').selectOption('portrait');
    await expect(page.locator('#bc-output .bc-band')).toHaveCount(10);
    const cspEvents = await page.evaluate(
      () => (window as unknown as { __csp?: string[] }).__csp ?? [],
    );
    expect(cspEvents).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('英語版でも動作する', async ({ page }) => {
    await page.goto('/en/tools/business-card-maker/');
    await page.locator('#bc-family').fill('Smith');
    await page.locator('#bc-given').fill('Alex');
    await expect(page.locator('#bc-output .bc-name').first()).toHaveText(
      'Alex Smith',
    );
    await page.locator('#bc-name-size').fill('20');
    await expect(page.locator('#bc-error')).toContainText('between 3 and 9');
  });
});

test.describe('名刺作成（アクセシビリティ）', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない', async ({ page }) => {
    await page.goto('/tools/business-card-maker/');
    await page.locator('#bc-family').fill('山田');
    await page.locator('#bc-company').fill('株式会社サンプル');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
