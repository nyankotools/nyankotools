import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('ルビHTMLタグ生成ツール', () => {
  test('漢字《よみ》からrubyタグとプレビューを生成する', async ({ page }) => {
    await page.goto('/tools/ruby-tag-generator/');

    await page.locator('#ruby-tag-generator-input').fill('漢字《かんじ》です');
    await expect(page.locator('#ruby-tag-generator-output')).toHaveValue(
      '<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>です',
    );
    await expect(
      page.locator('#ruby-tag-generator-preview ruby rt'),
    ).toHaveText('かんじ');
  });

  test('選択範囲に《》を挿入し、カーソルを括弧の中に置く', async ({ page }) => {
    await page.goto('/tools/ruby-tag-generator/');

    const input = page.locator('#ruby-tag-generator-input');
    await input.fill('漢字です');
    await input.evaluate((el: HTMLTextAreaElement) =>
      el.setSelectionRange(0, 2),
    );
    await page.locator('#ruby-tag-generator-insert').click();
    await expect(input).toHaveValue('漢字《》です');
    await page.keyboard.type('かんじ');
    await expect(input).toHaveValue('漢字《かんじ》です');
    await expect(
      page.locator('#ruby-tag-generator-preview ruby rt'),
    ).toHaveText('かんじ');
  });

  test('｜《》ボタンは選択範囲の前に｜も付ける', async ({ page }) => {
    await page.goto('/tools/ruby-tag-generator/');

    const input = page.locator('#ruby-tag-generator-input');
    await input.fill('東京タワー');
    await input.evaluate((el: HTMLTextAreaElement) =>
      el.setSelectionRange(0, 5),
    );
    await page.locator('#ruby-tag-generator-insert-bar').click();
    await expect(input).toHaveValue('｜東京タワー《》');
  });

  test('rpをオフにするとrpなしのタグになる', async ({ page }) => {
    await page.goto('/tools/ruby-tag-generator/');

    await page.locator('#ruby-tag-generator-rp').uncheck();
    await page
      .locator('#ruby-tag-generator-input')
      .fill('｜東京タワー《とうきょうタワー》');
    await expect(page.locator('#ruby-tag-generator-output')).toHaveValue(
      '<ruby>東京タワー<rt>とうきょうタワー</rt></ruby>',
    );
  });

  test('HTML特殊文字はエスケープされ、プレビューで要素にならない', async ({
    page,
  }) => {
    await page.goto('/tools/ruby-tag-generator/');

    await page
      .locator('#ruby-tag-generator-input')
      .fill('<img src=x onerror=alert(1)>');
    await expect(page.locator('#ruby-tag-generator-output')).toHaveValue(
      '&lt;img src=x onerror=alert(1)&gt;',
    );
    await expect(page.locator('#ruby-tag-generator-preview img')).toHaveCount(
      0,
    );
  });

  test('コピーボタンでHTMLをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/ruby-tag-generator/');

    await page.locator('#ruby-tag-generator-rp').uncheck();
    await page.locator('#ruby-tag-generator-input').fill('漢字《かんじ》');
    await page.locator('#ruby-tag-generator-copy-button').click();
    await expect(page.locator('#ruby-tag-generator-status')).toHaveText(
      'コピーしました',
    );
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toBe('<ruby>漢字<rt>かんじ</rt></ruby>');
  });
});

test.describe('Ruby Tag Generator (English)', () => {
  test('英語版で変換でき、コピーメッセージが英語になる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/ruby-tag-generator/');

    await page.locator('#ruby-tag-generator-input').fill('漢字《かんじ》');
    await expect(page.locator('#ruby-tag-generator-output')).toHaveValue(
      '<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>',
    );
    await page.locator('#ruby-tag-generator-copy-button').click();
    await expect(page.locator('#ruby-tag-generator-status')).toHaveText(
      'Copied',
    );
  });

  test('変換結果とプレビューが表示された状態でもaxeの違反がない', async ({
    page,
  }) => {
    await page.goto('/en/tools/ruby-tag-generator/');
    await page.locator('#ruby-tag-generator-input').fill('漢字《かんじ》です');
    await expect(
      page.locator('#ruby-tag-generator-preview ruby rt'),
    ).toHaveText('かんじ');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
      ),
    ).toEqual([]);
  });
});
