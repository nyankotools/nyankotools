import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

// 1x1 の透明PNG
const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);

test.describe('履歴書作成', () => {
  test('基本情報と生年月日・年齢がプレビューに反映される', async ({ page }) => {
    await page.goto('/tools/resume-maker/');
    await page.locator('#rm-date').fill('2026-10-23');
    await page.locator('#rm-name').fill('山田 太郎');
    await page.locator('#rm-name-kana').fill('やまだ たろう');
    await page.locator('#rm-birth').fill('1990-04-01');
    await page.locator('#rm-gender').selectOption('male');
    await page.locator('#rm-postal').fill('1000001');
    await page.locator('#rm-address').fill('東京都千代田区千代田1-1');
    await expect(page.locator('#rm-p-name')).toHaveText('山田 太郎');
    await expect(page.locator('#rm-p-date')).toHaveText('令和8年10月23日現在');
    await expect(page.locator('#rm-p-birth')).toHaveText(
      '平成2年4月1日生　（満36歳）　男',
    );
    await expect(page.locator('#rm-p-postal')).toHaveText('〒100-0001');
  });

  test('学歴・職歴の行が年月欄に入り、西暦に切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/resume-maker/');
    await page.locator('#rm-education').fill('2010-04 ○○高等学校 入学');
    await page.locator('#rm-work').fill('2014-04 株式会社テスト 入社');
    const history = page.locator('#rm-p-history');
    await expect(history).toContainText('平成22');
    await expect(history).toContainText('株式会社テスト 入社');
    await expect(history).toContainText('以上');
    await page.locator('#rm-era').selectOption('seireki');
    await expect(history).toContainText('2014');
    await expect(history).not.toContainText('平成22');
  });

  test('欄に収まらないとエラーが出て印刷ボタンが無効になる', async ({
    page,
  }) => {
    await page.goto('/tools/resume-maker/');
    const lines = Array.from({ length: 25 }, (_, i) => `2020-04 項目${i}`);
    await page.locator('#rm-work').fill(lines.join('\n'));
    await expect(page.locator('#rm-error')).toContainText('収まりません');
    await expect(page.locator('#rm-print-button')).toBeDisabled();
    await page.locator('#rm-work').fill('2020-04 入社');
    await expect(page.locator('#rm-error')).toBeEmpty();
    await expect(page.locator('#rm-print-button')).toBeEnabled();
  });

  test('証明写真を読み込み、外せる', async ({ page }) => {
    await page.goto('/tools/resume-maker/');
    await expect(page.locator('#rm-p-photo')).toBeHidden();
    await page.locator('#rm-photo-file').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: PNG_1PX,
    });
    await expect(page.locator('#rm-p-photo')).toBeVisible();
    await expect(page.locator('#rm-p-photo')).toHaveAttribute('src', /^blob:/);
    await page.locator('#rm-photo-remove').click();
    await expect(page.locator('#rm-p-photo')).toBeHidden();
  });

  test('画像でないファイルはエラーになる', async ({ page }) => {
    await page.goto('/tools/resume-maker/');
    await page.locator('#rm-photo-file').setInputFiles({
      name: 'x.png',
      mimeType: 'image/png',
      buffer: Buffer.from('not an image'),
    });
    await expect(page.locator('#rm-photo-error')).toBeVisible();
    await expect(page.locator('#rm-p-photo')).toBeHidden();
  });

  test('保存は押したときだけ行われ、再読み込みで復元・消去できる', async ({
    page,
  }) => {
    await page.goto('/tools/resume-maker/');
    await page.locator('#rm-name').fill('山田 太郎');
    const before = await page.evaluate(() =>
      localStorage.getItem('nyankotools:resume-maker'),
    );
    expect(before).toBeNull();

    await page.locator('#rm-save-button').click();
    await expect(page.locator('#rm-save-status')).toContainText('保存しました');
    await page.reload();
    await expect(page.locator('#rm-name')).toHaveValue('山田 太郎');
    await expect(page.locator('#rm-p-name')).toHaveText('山田 太郎');

    await page.locator('#rm-clear-button').click();
    await expect(page.locator('#rm-save-status')).toContainText('消去しました');
    const after = await page.evaluate(() =>
      localStorage.getItem('nyankotools:resume-maker'),
    );
    expect(after).toBeNull();
    await page.reload();
    await expect(page.locator('#rm-name')).toHaveValue('');
  });

  test('入力は sessionStorage に残らず、URLクエリからも入らない（個人情報）', async ({
    page,
  }) => {
    await page.goto('/tools/resume-maker/?text=秘密');
    await expect(page.locator('#rm-motivation')).toHaveValue('');
    await page.locator('#rm-name').fill('山田');
    const stored = await page.evaluate(() =>
      JSON.stringify({ ...sessionStorage }),
    );
    expect(stored).not.toContain('山田');
  });

  test('印刷時は書類だけが残り、PDFはA4の2ページになる', async ({ page }) => {
    await page.goto('/tools/resume-maker/');
    await page.locator('#rm-name').fill('山田 太郎');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('h1')).toBeHidden();
    await expect(page.locator('[data-faq]')).toBeHidden();
    await expect(page.locator('#rm-name')).toBeHidden();
    await expect(page.locator('#rm-p-name')).toBeVisible();

    const pdf = await page.pdf({ preferCSSPageSize: true });
    const text = pdf.toString('latin1');
    const pageCount = (text.match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;
    expect(pageCount).toBe(2);
    const box = /\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/.exec(text);
    expect(box).not.toBeNull();
    const toMm = (pt: string) => (Number(pt) * 25.4) / 72;
    expect(toMm(box![1])).toBeCloseTo(210, 0);
    expect(toMm(box![2])).toBeCloseTo(297, 0);
  });

  test('CSP違反もコンソールエラーも出ない（本番ビルドのCSP下）', async ({
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

    await page.goto('/tools/resume-maker/');
    await page.locator('#rm-photo-file').setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: PNG_1PX,
    });
    await expect(page.locator('#rm-p-photo')).toBeVisible();
    await page.locator('#rm-motivation').fill('志望動機のテスト');
    await expect(page.locator('#rm-p-motivation')).toContainText(
      '志望動機のテスト',
    );
    const cspEvents = await page.evaluate(
      () => (window as unknown as { __csp?: string[] }).__csp ?? [],
    );
    expect(cspEvents).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('英語版でも動作する', async ({ page }) => {
    await page.goto('/en/tools/resume-maker/');
    await page.locator('#rm-name').fill('Taro Yamada');
    await expect(page.locator('#rm-p-name')).toHaveText('Taro Yamada');
    const lines = Array.from({ length: 25 }, (_, i) => `2020-04 Item ${i}`);
    await page.locator('#rm-work').fill(lines.join('\n'));
    await expect(page.locator('#rm-error')).toContainText('do not fit');
    await expect(page.locator('#rm-print-button')).toBeDisabled();
  });
});

test.describe('履歴書作成（アクセシビリティ）', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない', async ({ page }) => {
    await page.goto('/tools/resume-maker/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
