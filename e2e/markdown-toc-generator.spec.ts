import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('Markdown目次生成', () => {
  test('日本語版: 見出しから目次を作り、コードブロック内の # は無視する', async ({
    page,
  }) => {
    await page.goto('/tools/markdown-toc-generator/');
    await page
      .locator('#toc-input')
      .fill('# A\n## B\n```\n# x\n```\n## B\n### C');
    await expect(page.locator('#toc-output')).toHaveValue(
      '- [A](#a)\n  - [B](#b)\n  - [B](#b-1)\n    - [C](#c)',
    );
    await expect(page.locator('#toc-summary')).toHaveText(
      '見出し4件から目次を作成しました',
    );
  });

  test('深さ・形式・リンクの切り替え', async ({ page }) => {
    await page.goto('/tools/markdown-toc-generator/');
    await page.locator('#toc-input').fill('# A\n## B\n### C');
    await page.locator('#toc-max').selectOption('2');
    await page.locator('#toc-style').selectOption('number');
    await page.locator('#toc-links').uncheck();
    await expect(page.locator('#toc-output')).toHaveValue('1. A\n   1. B');
  });

  test('英語版も動作する', async ({ page }) => {
    await page.goto('/en/tools/markdown-toc-generator/');
    await page.locator('#toc-input').fill('Title\n=====\n');
    await expect(page.locator('#toc-output')).toHaveValue('- [Title](#title)');
    await expect(page.locator('#toc-summary')).toHaveText(
      'Built a table of contents from 1 heading(s)',
    );
  });
});

test.describe('markdown-toc-generator: アクセシビリティ', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない（ja/en）', async ({ page }) => {
    for (const path of [
      '/tools/markdown-toc-generator/',
      '/en/tools/markdown-toc-generator/',
    ]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        path,
      ).toEqual([]);
    }
  });
});
