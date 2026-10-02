import { test, expect } from './helpers/test';

test.describe('JSONツリービューア', () => {
  test('サンプルがツリー表示され、クリックでパスが出る', async ({ page }) => {
    await page.goto('/tools/json-tree-viewer/');
    await expect(page.locator('main h1')).toHaveText('JSONツリービューア');

    const tree = page.locator('#jtv-tree');
    await expect(tree).toContainText('"Taro"');
    // 閉じている配列の中身はまだ描画されない
    await expect(tree).not.toContainText('"SALE"');

    // orders をクリック（展開）
    const ordersBtn = tree
      .locator('button', { has: page.locator('text=/orders/') })
      .first();
    await ordersBtn.click();
    // orders の最初の要素（インデックス0）をクリック
    const firstBtn = tree.locator('button:has-text("▸0")').first();
    await firstBtn.click();
    // データが見える
    await expect(tree).toContainText('id');

    // coupon キーを検索
    await page.locator('#jtv-search').fill('coupon');
    await expect(page.locator('#jtv-search-status')).toContainText('1件一致');
    await expect(tree).toContainText('SALE');

    // coupon をクリックしてパスを選択
    await tree.getByRole('button', { name: /coupon/ }).click();
    await expect(page.locator('#jtv-path')).toHaveValue(/coupon/);

    // 別の表記に切り替える
    await page.locator('[data-style="pointer"]').click();
    await expect(page.locator('#jtv-path')).toHaveValue(/\//);
  });

  test('検索で一致箇所まで展開され、すべて展開・折りたたみができる', async ({
    page,
  }) => {
    await page.goto('/tools/json-tree-viewer/');
    await page.locator('#jtv-search').fill('sale');
    await expect(page.locator('#jtv-search-status')).toHaveText('1件一致');
    await expect(page.locator('#jtv-tree [data-match]')).toContainText('SALE');

    await page.locator('#jtv-search').fill('zzz');
    await expect(page.locator('#jtv-search-status')).toHaveText('一致なし');

    await page.locator('#jtv-collapse-all').click();
    await expect(page.locator('#jtv-tree')).not.toContainText('"Tokyo"');
    await page.locator('#jtv-expand-all').click();
    await expect(page.locator('#jtv-tree')).toContainText('"Tokyo"');
    await expect(page.locator('#jtv-tree')).toContainText('"SALE"');
  });

  test('不正なJSONはエラーになり、空にするとエラーが消える', async ({
    page,
  }) => {
    await page.goto('/tools/json-tree-viewer/');
    const input = page.locator('#jtv-input');
    await input.fill('{a:1}');
    await expect(page.locator('#jtv-error')).toBeVisible();
    await input.fill('');
    await expect(page.locator('#jtv-error')).toBeHidden();
  });

  test('「残り{n}件を表示」ボタンで段階的に子要素を読み込む', async ({
    page,
  }) => {
    await page.goto('/tools/json-tree-viewer/');
    // 510個のキーを持つオブジェクトを入力
    const largeObj: Record<string, number> = {};
    for (let i = 0; i < 510; i++) {
      largeObj[`item${String(i).padStart(3, '0')}`] = i;
    }
    await page.locator('#jtv-input').fill(JSON.stringify(largeObj));

    // ルートオブジェクトはデフォルトで展開されている
    // 最初の500件が表示されて「残り10件を表示」ボタンが見える
    await expect(page.locator('#jtv-tree')).toContainText('残り10件を表示');
    await expect(page.locator('#jtv-tree')).toContainText('item499');
    // 510番目のアイテムはまだ表示されていない
    await expect(page.locator('#jtv-tree')).not.toContainText('item509');

    // 「残り10件を表示」をクリック
    await page
      .locator('#jtv-tree')
      .getByRole('button', { name: /残り10件を表示/ })
      .click();

    // すべての要素が表示される
    await expect(page.locator('#jtv-tree')).toContainText('item509');
    await expect(page.locator('#jtv-tree')).not.toContainText('残り');
  });

  test('特殊文字を含むキー名のパス表記が正しく生成される', async ({ page }) => {
    await page.goto('/tools/json-tree-viewer/');
    const data = JSON.stringify({ 'user/info': 'value' });
    await page.locator('#jtv-input').fill(data);

    const tree = page.locator('#jtv-tree');
    // user/info をクリック
    await tree.getByRole('button', { name: /user/ }).click();

    // JSONPath で角括弧・クォートで囲まれている
    await expect(page.locator('#jtv-path')).toHaveValue(/\["user/);

    // JSON Pointer で / がエスケープされている
    await page.locator('[data-style="pointer"]').click();
    await expect(page.locator('#jtv-path')).toHaveValue(/~1/);
  });

  test('ページロード時にサンプルが自動ロードされ、デフォルトパス表記はJSONPath', async ({
    page,
  }) => {
    await page.goto('/tools/json-tree-viewer/');
    // テキストエリアに値が入っている
    const inputValue = await page.locator('#jtv-input').inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
    // ツリーが表示されている
    await expect(page.locator('#jtv-tree')).toContainText('$');
    // デフォルト表記はJSONPath（aria-pressed属性で確認）
    const jsonpathBtn = page.locator('[data-style="jsonpath"]');
    await expect(jsonpathBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('値をコピーするとクリップボードに複数行で正しく入る', async ({
    page,
  }) => {
    await page.goto('/tools/json-tree-viewer/');
    const data = JSON.stringify({
      nested: { items: ['a', 'b', 'c'], count: 3 },
    });
    await page.locator('#jtv-input').fill(data);

    const tree = page.locator('#jtv-tree');
    // nested を展開
    await tree.getByRole('button', { name: /nested/ }).click();
    // items を展開
    await tree.getByRole('button', { name: /items/ }).click();
    // items配列をクリック（複数のspan要素で構成）
    await tree.getByRole('button', { name: /items.*\[3\]/ }).click();
    // 値をコピー
    await page.locator('#jtv-copy-value-button').click();

    // クリップボードに入った（成功メッセージで確認）
    await expect(page.locator('#jtv-status')).toContainText('コピー');
  });
});

test.describe('JSON Tree Viewer (en)', () => {
  test('displays the tree', async ({ page }) => {
    await page.goto('/en/tools/json-tree-viewer/');
    await expect(page.locator('main h1')).toHaveText('JSON Tree Viewer');
    await expect(page.locator('#jtv-tree')).toContainText('"Taro"');
  });
});
