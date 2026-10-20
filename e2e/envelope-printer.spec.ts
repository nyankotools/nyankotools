import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('封筒の宛名印刷', () => {
  test('既定では長形3号の実寸プレビューと7つずつの郵便番号枠が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/envelope-printer/');
    const output = page.locator('#ep-output');
    await expect(output).toBeVisible();
    await expect(output.locator('.ep-frame')).toHaveCount(14);
    await expect(output).toHaveCSS('page', 'ep-nagagata3');
  });

  test('郵便番号・住所・宛名・敬称がプレビューに反映される', async ({
    page,
  }) => {
    await page.goto('/tools/envelope-printer/');
    await page.locator('#ep-recipient-postal').fill('100-0001');
    await page
      .locator('#ep-recipient-address')
      .fill('東京都千代田区千代田1-1\nサンプルビル2階');
    await page.locator('#ep-recipient-name').fill('山田 太郎');
    const output = page.locator('#ep-output');
    const digits = await output
      .locator('.ep-frame')
      .evaluateAll((els) => els.slice(0, 7).map((e) => e.textContent));
    expect(digits.join('')).toBe('1000001');
    await expect(output).toContainText('山田 太郎　様');
    // 縦書き: 1-1 は縦中横の「1」「ー」「1」になる
    await expect(output.locator('.ep-tcy')).toHaveCount(3);
  });

  test('漢数字を選ぶと数字が漢数字になる', async ({ page }) => {
    await page.goto('/tools/envelope-printer/');
    await page.locator('#ep-recipient-address').fill('千代田1-2');
    await page.locator('#ep-numerals').selectOption('kanji');
    await expect(page.locator('#ep-output')).toContainText('千代田一ー二');
    await expect(page.locator('#ep-output .ep-tcy')).toHaveCount(0);
  });

  test('郵便番号枠をオフにすると枠線が消える', async ({ page }) => {
    await page.goto('/tools/envelope-printer/');
    await expect(page.locator('#ep-output .ep-frame-line')).toHaveCount(14);
    await page.locator('#ep-show-frames').uncheck();
    await expect(page.locator('#ep-output .ep-frame-line')).toHaveCount(0);
  });

  test('郵便番号が7桁でないとエラーになり、印刷ボタンが無効になる', async ({
    page,
  }) => {
    await page.goto('/tools/envelope-printer/');
    await page.locator('#ep-recipient-postal').fill('123');
    await expect(page.locator('#ep-error')).toContainText('7桁');
    await expect(page.locator('#ep-print-button')).toBeDisabled();
    await page.locator('#ep-recipient-postal').fill('123-4567');
    await expect(page.locator('#ep-error')).toBeEmpty();
    await expect(page.locator('#ep-print-button')).toBeEnabled();
  });

  test('入力値は sessionStorage に保存されず、URLクエリでも入らない（個人情報）', async ({
    page,
  }) => {
    await page.goto('/tools/envelope-printer/?text=秘密');
    await expect(page.locator('#ep-recipient-address')).toHaveValue('');
    await page.locator('#ep-recipient-name').fill('山田');
    const stored = await page.evaluate(() =>
      JSON.stringify({ ...sessionStorage }),
    );
    expect(stored).not.toContain('山田');
  });

  test('印刷時は封筒の面だけが残る', async ({ page }) => {
    await page.goto('/tools/envelope-printer/');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#ep-recipient-address')).toBeHidden();
    await expect(page.locator('#ep-output')).toBeVisible();
  });

  test('封筒サイズが名前付き@pageで指定され、印刷PDFが実寸・1ページに収まる', async ({
    page,
  }) => {
    await page.goto('/tools/envelope-printer/');
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
    await checkPdf(235, 120);
    await page.locator('#ep-envelope').selectOption('youkei2');
    await expect(page.locator('#ep-output')).toHaveCSS('page', 'ep-youkei2');
    await checkPdf(162, 114);
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

    await page.goto('/tools/envelope-printer/');
    await page.locator('#ep-writing').selectOption('horizontal');
    await page.locator('#ep-envelope').selectOption('youkei4');
    await page.locator('#ep-recipient-name').fill('株式会社テスト');
    await page.locator('#ep-honorific').selectOption('onchu');
    await expect(page.locator('#ep-output')).toContainText(
      '株式会社テスト　御中',
    );
    const cspEvents = await page.evaluate(
      () => (window as unknown as { __csp?: string[] }).__csp ?? [],
    );
    expect(cspEvents).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('英語版でも動作する', async ({ page }) => {
    await page.goto('/en/tools/envelope-printer/');
    await page.locator('#ep-recipient-postal').fill('12');
    await expect(page.locator('#ep-error')).toContainText('7-digit');
    await page.locator('#ep-recipient-postal').fill('1234567');
    await expect(page.locator('#ep-error')).toBeEmpty();
  });
});

test.describe('封筒の宛名印刷（アクセシビリティ）', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない', async ({ page }) => {
    await page.goto('/tools/envelope-printer/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
