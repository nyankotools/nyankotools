import { test, expect } from './helpers/test';

test.describe('Markdown⇔HTML変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/tools/markdown-preview/');
    await expect(page.locator('main h1')).toHaveText(
      'Markdown⇔HTML変換ツール（プレビュー付き）',
    );
  });

  test('Markdownをプレビューに変換できる', async ({ page }) => {
    await page.goto('/tools/markdown-preview/');

    const input = page.locator('#markdown-preview-input');
    const render = page.locator('#markdown-preview-render');

    // 初期状態はMDからHTMLモード
    await expect(
      page.locator('#markdown-preview-mode [data-mode="mdToHtml"]'),
    ).toHaveAttribute('aria-pressed', 'true');

    // H1を入力
    await input.fill('# Hello World\n\nThis is a paragraph.');

    // プレビューにHTMLが表示されることを確認
    await expect(render.locator('h1')).toHaveText('Hello World');
    await expect(render.locator('p')).toHaveText('This is a paragraph.');
  });

  test('HTMLからMarkdownへの変換ができる', async ({ page }) => {
    await page.goto('/tools/markdown-preview/');

    // HTMLからMarkdownモードに切り替え
    await page.locator('#markdown-preview-mode [data-mode="htmlToMd"]').click();

    const input = page.locator('#markdown-preview-input');
    const output = page.locator('#markdown-preview-output');

    await input.fill('<h1>Hello</h1><p>World</p>');

    const outputText = await output.inputValue();
    expect(outputText).toContain('Hello');
    expect(outputText).toContain('World');
  });

  test('DOMPurifyが<script>タグをサニタイズしてXSSを防ぐ', async ({ page }) => {
    await page.goto('/tools/markdown-preview/');

    const input = page.locator('#markdown-preview-input');
    const render = page.locator('#markdown-preview-render');

    // スクリプトタグを含むMarkdown
    await input.fill('# Test\n\n<script>alert("XSS")</script>\n\nContent');

    // renderエレメント内に<script>タグが存在しないことを確認
    const scripts = await render.locator('script').count();
    expect(scripts).toBe(0);

    // renderの子孫にscriptタグがないことを確認
    const renderedHtml = await render.innerHTML();
    expect(renderedHtml).not.toContain('<script');
    expect(renderedHtml).not.toContain('</script>');
  });

  test('DOMPurifyがonerror属性をサニタイズしてXSSを防ぐ', async ({ page }) => {
    await page.goto('/tools/markdown-preview/');

    const input = page.locator('#markdown-preview-input');
    const render = page.locator('#markdown-preview-render');

    // onerror属性を含むMarkdown
    await input.fill('<img src=x onerror="alert(\'XSS\')" />\n\nSafe content');

    // renderの子孫にonrror属性がないことを確認
    const renderedHtml = await render.innerHTML();
    expect(renderedHtml).not.toContain('onerror');
    expect(renderedHtml).not.toContain('alert');

    // img要素は存在するかもしれないが、onerrorハンドラは削除されている
    const imgs = await render.locator('img').count();
    if (imgs > 0) {
      const firstImg = render.locator('img').first();
      const onError = await firstImg.getAttribute('onerror');
      expect(onError).toBeNull();
    }
  });

  test('DOMPurifyがjavascript:リンクをサニタイズしてXSSを防ぐ', async ({
    page,
  }) => {
    await page.goto('/tools/markdown-preview/');

    const input = page.locator('#markdown-preview-input');
    const render = page.locator('#markdown-preview-render');

    // javascript:を含むリンク
    await input.fill('[Click me](javascript:alert("XSS"))\n\nSafe link');

    // renderの子孫にjavascript:URLがないことを確認
    const renderedHtml = await render.innerHTML();
    expect(renderedHtml).not.toContain('javascript:');

    // <a>タグの href が javascript: で始まっていないことを確認
    const links = await render.locator('a').count();
    for (let i = 0; i < links; i++) {
      const link = render.locator('a').nth(i);
      const href = await link.getAttribute('href');
      if (href) {
        expect(href).not.toMatch(/^javascript:/i);
      }
    }
  });

  test('Markdownのリスト・テーブル・コードブロックが正しくレンダリングされる', async ({
    page,
  }) => {
    await page.goto('/tools/markdown-preview/');

    const input = page.locator('#markdown-preview-input');
    const render = page.locator('#markdown-preview-render');

    const markdown = `
# Title

- Item 1
- Item 2

1. First
2. Second

\`\`\`
code block
\`\`\`

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
    `.trim();

    await input.fill(markdown);

    // リスト
    await expect(render.locator('ul li')).toHaveCount(2);
    await expect(render.locator('ol li')).toHaveCount(2);

    // コードブロック
    await expect(render.locator('pre code')).toHaveCount(1);

    // テーブル
    const table = render.locator('table');
    await expect(table).toBeVisible();
  });

  test('空入力で出力も空になる', async ({ page }) => {
    await page.goto('/tools/markdown-preview/');

    const input = page.locator('#markdown-preview-input');
    const render = page.locator('#markdown-preview-render');

    await input.fill('# Test');
    // 何かレンダリングされる
    let html = await render.innerHTML();
    expect(html.length).toBeGreaterThan(0);

    // 入力をクリア
    await input.fill('');
    // 出力も空になる
    html = await render.innerHTML();
    expect(html).toBe('');
  });
});

test.describe('HTML→Markdown変換オプション', () => {
  test('HTML→Markdownモードでだけオプションが表示され、書式を切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/markdown-preview/');
    const options = page.locator('#markdown-preview-html-options');
    await expect(options).toBeHidden();

    await page.locator('#markdown-preview-mode [data-mode="htmlToMd"]').click();
    await expect(options).toBeVisible();

    await page
      .locator('#markdown-preview-input')
      .fill(
        '<h1>Title</h1><ul><li>one</li></ul><table><tr><th>A</th></tr><tr><td>1</td></tr></table>',
      );
    const output = page.locator('#markdown-preview-output');
    await expect(output).toHaveValue(/^# Title/);
    await expect(output).toHaveValue(/\| A \|\n\| --- \|\n\| 1 \|/);

    await page.locator('#markdown-preview-heading').selectOption('setext');
    await expect(output).toHaveValue(/^Title\n=====/);
    await page.locator('#markdown-preview-bullet').selectOption('*');
    await expect(output).toHaveValue(/\* {3}one/);
  });
});

test.describe('Markdown⇔HTML Converter (English)', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/markdown-preview/');
    await expect(page.locator('main h1')).toHaveText(
      'Markdown to HTML Converter (with Live Preview)',
    );
  });

  test('英語版でMarkdownがプレビューされる', async ({ page }) => {
    await page.goto('/en/tools/markdown-preview/');

    const input = page.locator('#markdown-preview-input');
    const render = page.locator('#markdown-preview-render');

    await input.fill('# Hello\n\nWorld');

    await expect(render.locator('h1')).toHaveText('Hello');
  });

  test('英語版でもDOMPurifyがXSSを防ぐ', async ({ page }) => {
    await page.goto('/en/tools/markdown-preview/');

    const input = page.locator('#markdown-preview-input');
    const render = page.locator('#markdown-preview-render');

    await input.fill('<script>alert("XSS")</script>');

    const scripts = await render.locator('script').count();
    expect(scripts).toBe(0);

    const renderedHtml = await render.innerHTML();
    expect(renderedHtml).not.toContain('<script');
  });
});
