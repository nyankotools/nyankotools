import { test, expect } from './helpers/test';

const SAMPLE = 'id,name,score\n1,Taro,30\n2,hanako,100\n3,Jiro,9';

function firstColumnTexts(page: import('@playwright/test').Page) {
  return page
    .locator('#csv-viewer-tbody tr')
    .evaluateAll((rows) =>
      rows.map((r) => r.querySelectorAll('td')[1]?.textContent ?? ''),
    );
}

test.describe('CSVビューア（日本語版）', () => {
  test('表示・ソート・絞り込み・列の削除ができる', async ({ page }) => {
    await page.goto('/tools/csv-viewer/');
    await expect(page.locator('main h1')).toHaveText(
      'CSVビューア（ソート・絞り込み・列抽出）',
    );
    await expect(page.locator('#csv-viewer-result')).toBeHidden();

    await page.locator('#csv-viewer-input').fill(SAMPLE);
    await expect(page.locator('#csv-viewer-summary')).toHaveText(
      '3 / 3 行・3 列',
    );
    expect(await firstColumnTexts(page)).toEqual(['1', '2', '3']);

    // 数値列は数値順（9 < 30 < 100）
    await page.getByRole('button', { name: 'score で並べ替え' }).click();
    expect(await firstColumnTexts(page)).toEqual(['3', '1', '2']);
    await page.getByRole('button', { name: 'score で並べ替え' }).click();
    expect(await firstColumnTexts(page)).toEqual(['2', '1', '3']);
    await page.getByRole('button', { name: 'score で並べ替え' }).click();
    expect(await firstColumnTexts(page)).toEqual(['1', '2', '3']);

    // 大文字小文字を区別しない絞り込み
    await page.locator('#csv-viewer-filter').fill('RO');
    await expect(page.locator('#csv-viewer-summary')).toHaveText(
      '2 / 3 行・3 列',
    );
    expect(await firstColumnTexts(page)).toEqual(['1', '3']);

    await page.locator('#csv-viewer-filter').fill('zzz');
    await expect(page.locator('#csv-viewer-empty')).toBeVisible();
  });

  test('列を外して並べ替えた結果をCSVとしてコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/csv-viewer/');
    await page.locator('#csv-viewer-input').fill(SAMPLE);

    await page.locator('#csv-viewer-result summary').click();
    await page.getByRole('button', { name: 'id を外す' }).click();
    await page.getByRole('button', { name: 'score を左へ' }).click();
    await page.getByRole('button', { name: 'score で並べ替え' }).click();
    await page.locator('#csv-viewer-filter').fill('o');

    await page.locator('#csv-viewer-copy-button').click();
    await expect(page.locator('#csv-viewer-status')).toHaveText(
      'コピーしました',
    );
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    // Jiro(9)・Taro(30) の順。hanako は "o" を含むが score 100 で末尾
    expect(copied.replace(/\r\n/g, '\n')).toBe(
      'score,name\n9,Jiro\n30,Taro\n100,hanako\n',
    );

    // 外した列は「すべて戻す」で復元できる
    await page.getByRole('button', { name: 'すべて戻す' }).click();
    await expect(page.locator('#csv-viewer-summary')).toContainText('3 列');
  });

  test('数千行でも描画する行は一部だけ（仮想スクロール）', async ({ page }) => {
    await page.goto('/tools/csv-viewer/');
    const lines = ['n,v'];
    for (let i = 1; i <= 5000; i++) lines.push(`${i},row${i}`);
    // 改行の多い巨大テキストは fill だと Chromium で極端に遅い（5000行で約25秒）ため、値を直接設定する
    await page.locator('#csv-viewer-input').evaluate((el, text) => {
      (el as HTMLTextAreaElement).value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, lines.join('\n'));
    await expect(page.locator('#csv-viewer-summary')).toHaveText(
      '5000 / 5000 行・2 列',
    );
    const rendered = await page.locator('#csv-viewer-tbody tr').count();
    expect(rendered).toBeLessThan(100);

    await page.locator('#csv-viewer-scroll').evaluate((el) => {
      el.scrollTop = 32 * 4000;
    });
    await expect(
      page.locator('#csv-viewer-tbody tr td', { hasText: 'row4001' }),
    ).toHaveCount(1);
  });

  test('タブ区切りを自動判定し、閉じていない引用符はエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/csv-viewer/');
    await page.locator('#csv-viewer-input').fill('a\tb\n1\t2');
    await expect(page.locator('#csv-viewer-summary')).toHaveText(
      '1 / 1 行・2 列',
    );

    await page.locator('#csv-viewer-input').fill('a,"b');
    await expect(page.locator('#csv-viewer-error')).toBeVisible();
    await expect(page.locator('#csv-viewer-result')).toBeHidden();
  });

  test('ヘッダーなし・引用符内の改行・全列削除の挙動', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/csv-viewer/');
    // 1行目を見出しにすると「"a\nb"」が見出しになり、データは1行だけ
    await page.locator('#csv-viewer-input').fill('"a\nb",2\n3,4');
    await expect(page.locator('#csv-viewer-summary')).toHaveText(
      '1 / 1 行・2 列',
    );
    await page.locator('#csv-viewer-has-header').uncheck();
    await expect(page.locator('#csv-viewer-summary')).toHaveText(
      '2 / 2 行・2 列',
    );
    expect(await firstColumnTexts(page)).toEqual(['a\nb', '3']);

    // 全列を外すと表示なし・コピーとダウンロードは無効（列の操作欄は details の中）
    await page.locator('#csv-viewer-result summary').click();
    await page
      .getByRole('button', { name: /を外す$/ })
      .first()
      .click();
    await page
      .getByRole('button', { name: /を外す$/ })
      .first()
      .click();
    await expect(page.locator('#csv-viewer-empty')).toBeVisible();
    await expect(page.locator('#csv-viewer-copy-button')).toBeDisabled();
    await expect(page.locator('#csv-viewer-download-button')).toBeDisabled();

    await page.getByRole('button', { name: 'すべて戻す' }).click();
    await expect(page.locator('#csv-viewer-copy-button')).toBeEnabled();
    await page.locator('#csv-viewer-copy-button').click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    // 引用符でエスケープされ、ヘッダーなしのまま出力される
    expect(copied.replace(/\r\n/g, '\n')).toBe('"a\nb",2\n3,4\n');
  });

  test('ファイルを選択して読み込める', async ({ page }) => {
    await page.goto('/tools/csv-viewer/');
    await page.locator('#csv-viewer-file').setInputFiles({
      name: 'sample.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(SAMPLE, 'utf-8'),
    });
    await expect(page.locator('#csv-viewer-summary')).toHaveText(
      '3 / 3 行・3 列',
    );
  });
});

test.describe('CSV Viewer（English）', () => {
  test('renders and sorts', async ({ page }) => {
    await page.goto('/en/tools/csv-viewer/');
    await expect(page.locator('main h1')).toHaveText(
      'CSV Viewer (Sort, Filter, Extract Columns)',
    );
    await page.locator('#csv-viewer-input').fill(SAMPLE);
    await expect(page.locator('#csv-viewer-summary')).toHaveText(
      '3 of 3 rows · 3 columns',
    );
    await page.getByRole('button', { name: 'Sort by score' }).click();
    expect(await firstColumnTexts(page)).toEqual(['3', '1', '2']);
  });
});
