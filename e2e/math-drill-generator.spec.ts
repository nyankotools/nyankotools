import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('計算ドリル作成', () => {
  test('既定で20問・1ページのプレビューが表示される', async ({ page }) => {
    await page.goto('/tools/math-drill-generator/');
    await expect(page.locator('.dr-cell')).toHaveCount(20);
    await expect(page.locator('#dr-summary')).toHaveText('20問 / 1ページ');
    await expect(page.locator('.dr-sheet')).toHaveCount(1);
  });

  test('問題数を増やすとページが増える（A4・横書き2列は36問/ページ）', async ({
    page,
  }) => {
    await page.goto('/tools/math-drill-generator/');
    await page.locator('#dr-count').fill('50');
    await expect(page.locator('.dr-sheet')).toHaveCount(2);
    await expect(page.locator('#dr-summary')).toHaveText('50問 / 2ページ');
  });

  test('同じシードなら同じ問題、答えモードで答えが入る', async ({ page }) => {
    await page.goto('/tools/math-drill-generator/');
    await page.locator('#dr-seed').fill('5');
    const first = await page.locator('.dr-cell').allInnerTexts();
    await page.locator('#dr-seed').fill('6');
    expect(await page.locator('.dr-cell').allInnerTexts()).not.toEqual(first);
    await page.locator('#dr-seed').fill('5');
    expect(await page.locator('.dr-cell').allInnerTexts()).toEqual(first);

    await expect(page.locator('.dr-blank').first()).toHaveText('');
    await page.locator('#dr-mode').selectOption('answers');
    const texts = await page.locator('.dr-cell').allInnerTexts();
    for (const text of texts) {
      const m = text.replace(/\s+/g, ' ').match(/(\d+) \+ (\d+) = (\d+)/);
      expect(m).not.toBeNull();
      expect(Number(m![1]) + Number(m![2])).toBe(Number(m![3]));
    }
    await expect(page.locator('.dr-title')).toContainText('（答え）');
  });

  test('わり算は割り切れる問題だけが出る', async ({ page }) => {
    await page.goto('/tools/math-drill-generator/');
    await page.locator('#dr-op-add').uncheck();
    await page.locator('#dr-op-div').check();
    await page.locator('#dr-mode').selectOption('answers');
    const texts = await page.locator('.dr-cell').allInnerTexts();
    expect(texts.length).toBe(20);
    for (const text of texts) {
      const m = text.replace(/\s+/g, ' ').match(/(\d+) ÷ (\d+) = (\d+)/);
      expect(m).not.toBeNull();
      expect(Number(m![1]) / Number(m![2])).toBe(Number(m![3]));
    }
  });

  test('筆算に切り替えると縦書きの式になる', async ({ page }) => {
    await page.goto('/tools/math-drill-generator/');
    await page.locator('#dr-layout').selectOption('vertical');
    await expect(page.locator('.dr-v').first()).toBeVisible();
    await expect(page.locator('.dr-blank')).toHaveCount(0);
  });

  test('「問題を作り直す」でシードが変わる', async ({ page }) => {
    await page.goto('/tools/math-drill-generator/');
    await page.locator('#dr-seed').fill('1');
    await page.locator('#dr-regenerate-button').click();
    await expect(page.locator('#dr-seed')).not.toHaveValue('1');
    await expect(page.locator('.dr-cell')).toHaveCount(20);
  });

  test('不正な値はエラーになり、印刷ボタンが無効になる', async ({ page }) => {
    await page.goto('/tools/math-drill-generator/');
    await page.locator('#dr-count').fill('0');
    await expect(page.locator('#dr-error')).toContainText('1〜100');
    await expect(page.locator('.dr-sheet')).toHaveCount(0);
    await expect(page.locator('#dr-print-button')).toBeDisabled();
    await page.locator('#dr-count').fill('10');
    await expect(page.locator('#dr-error')).toBeEmpty();
    await page.locator('#dr-op-add').uncheck();
    await expect(page.locator('#dr-error')).toContainText('1つ以上');
    await page.locator('#dr-op-mul').check();
    await expect(page.locator('#dr-print-button')).toBeEnabled();
  });

  test('印刷時は用紙だけが残る', async ({ page }) => {
    await page.goto('/tools/math-drill-generator/');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-howto]')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#dr-count')).toBeHidden();
    await expect(page.locator('.dr-sheet').first()).toBeVisible();
  });

  test('用紙は名前付き@pageで指定され、印刷PDFが用紙サイズ・ページ数どおりになる', async ({
    page,
  }) => {
    await page.goto('/tools/math-drill-generator/');
    const output = page.locator('#dr-output');
    await expect(output).toHaveCSS('page', 'dr-a4');
    const toMm = (pt: string) => (Number(pt) * 25.4) / 72;
    const checkPdf = async (pages: number, wMm: number, hMm: number) => {
      const pdf = await page.pdf({ preferCSSPageSize: true });
      const text = pdf.toString('latin1');
      const pageCount = (text.match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;
      const boxes = [
        ...text.matchAll(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/g),
      ];
      expect(pageCount).toBe(pages);
      expect(toMm(boxes[0][1])).toBeCloseTo(wMm, 0);
      expect(toMm(boxes[0][2])).toBeCloseTo(hMm, 0);
    };
    await checkPdf(1, 210, 297);
    await page.locator('#dr-count').fill('50');
    await checkPdf(2, 210, 297);
    await page.locator('#dr-paper').selectOption('b5');
    await expect(output).toHaveCSS('page', 'dr-b5');
    await page.locator('#dr-count').fill('20');
    await checkPdf(1, 182, 257);
  });

  test('CSP違反もコンソールエラーも出ない（本番ビルドのCSP下）', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('/tools/math-drill-generator/');
    await page.locator('#dr-layout').selectOption('vertical');
    await page.locator('#dr-op-div').check();
    await expect(page.locator('.dr-cell').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('英語版でも動作する', async ({ page }) => {
    await page.goto('/en/tools/math-drill-generator/');
    await expect(page.locator('#dr-summary')).toHaveText(
      'Problems: 20 / Pages: 1',
    );
    await page.locator('#dr-mode').selectOption('answers');
    await expect(page.locator('.dr-title')).toHaveText('Math Drill (Answers)');
  });
});

test.describe('計算ドリル作成（アクセシビリティ）', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない', async ({ page }) => {
    await page.goto('/tools/math-drill-generator/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
