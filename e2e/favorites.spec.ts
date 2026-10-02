import { test, expect } from './helpers/test';

test.describe('お気に入り機能', () => {
  test('トップページのツールカードでお気に入りボタンをクリックするとトグルされ、サイドバーに表示される', async ({
    page,
  }) => {
    await page.goto('/');

    // 初期状態：サイドバーのお気に入りセクションは表示されていない
    const favoritesSection = page.locator('#sidebar-favorites');
    await expect(favoritesSection).toHaveAttribute('hidden', '');

    // トップページの「文字数カウント」カードのお気に入りボタンをクリック
    const charCounterCard = page.locator('[data-tool-slug="char-counter"]');
    const charCounterFavButton = charCounterCard.locator(
      '[data-favorite-toggle="char-counter"]',
    );

    // ボタンの初期状態を確認
    await expect(charCounterFavButton).toHaveAttribute('aria-pressed', 'false');

    // クリックしてお気に入りに追加
    await charCounterFavButton.click();

    // ボタンの状態が変わる
    await expect(charCounterFavButton).toHaveAttribute('aria-pressed', 'true');

    // サイドバーのお気に入りセクションが表示される
    await expect(favoritesSection).not.toHaveAttribute('hidden', '');

    // サイドバーのお気に入りリストに「文字数カウント」が表示される
    const favoritesList = page.locator('#sidebar-favorites-list');
    const charCounterLink = favoritesList.locator('a', {
      hasText: '文字数カウント',
    });
    await expect(charCounterLink).toBeVisible();
  });

  test('ツールページ上部のお気に入りボタンをクリックするとサイドバーに反映される', async ({
    page,
  }) => {
    await page.goto('/tools/json-formatter/');

    // ツールページ上部のお気に入りボタンを確認（mainの中にあるものを選択）
    const toolPageFavButton = page.locator(
      'main [data-favorite-toggle="json-formatter"]',
    );

    // 初期状態
    await expect(toolPageFavButton).toHaveAttribute('aria-pressed', 'false');

    // クリックしてお気に入りに追加
    await toolPageFavButton.click();

    // ボタンの状態が変わる
    await expect(toolPageFavButton).toHaveAttribute('aria-pressed', 'true');

    // サイドバーのお気に入りセクションが表示される
    const favoritesSection = page.locator('#sidebar-favorites');
    await expect(favoritesSection).not.toHaveAttribute('hidden', '');

    // サイドバーのお気に入りリストに表示される
    const favoritesList = page.locator('#sidebar-favorites-list');
    const jsonFormatterLink = favoritesList.locator('a', {
      hasText: 'JSON整形',
    });
    await expect(jsonFormatterLink).toBeVisible();
  });

  test('複数の場所でお気に入りボタンをクリックすると、全ての同じslugのボタンが同期される', async ({
    page,
  }) => {
    await page.goto('/');

    // トップページのツールカード内のボタン
    const cardFavButton = page.locator(
      '[data-tool-slug="base64"].relative [data-favorite-toggle="base64"]',
    );

    // クリックしてお気に入りに追加
    await cardFavButton.click();
    await expect(cardFavButton).toHaveAttribute('aria-pressed', 'true');

    // そのツールのページへ遷移
    await page.goto('/tools/base64/');

    // ツールページのボタン状態も同じ（mainの中の一つを選択）
    const toolPageFavButton = page.locator(
      'main [data-favorite-toggle="base64"]',
    );
    await expect(toolPageFavButton).toHaveAttribute('aria-pressed', 'true');

    // サイドバーのボタンも同じ
    const sidebarFavButton = page.locator(
      '#sidebar [data-favorite-toggle="base64"]',
    );
    await expect(sidebarFavButton).toHaveAttribute('aria-pressed', 'true');

    // ツールページのボタンをクリックして解除
    await toolPageFavButton.click();
    await expect(toolPageFavButton).toHaveAttribute('aria-pressed', 'false');

    // サイドバーのボタンも解除される
    await expect(sidebarFavButton).toHaveAttribute('aria-pressed', 'false');

    // トップページに戻る
    await page.goto('/');

    // トップページのボタンも解除されている
    const cardFavButtonAgain = page.locator(
      '[data-tool-slug="base64"].relative [data-favorite-toggle="base64"]',
    );
    await expect(cardFavButtonAgain).toHaveAttribute('aria-pressed', 'false');
  });

  test('ページをリロードしてもlocalStorageからお気に入り状態が復元される', async ({
    page,
  }) => {
    await page.goto('/');

    // お気に入りに追加
    const favButton = page.locator(
      '[data-tool-slug="kana-converter"] [data-favorite-toggle="kana-converter"]',
    );
    await favButton.click();
    await expect(favButton).toHaveAttribute('aria-pressed', 'true');

    // ページをリロード
    await page.reload();

    // お気に入り状態が復元されている
    const favButtonAfterReload = page.locator(
      '[data-tool-slug="kana-converter"] [data-favorite-toggle="kana-converter"]',
    );
    await expect(favButtonAfterReload).toHaveAttribute('aria-pressed', 'true');

    // サイドバーにも表示される
    const favoritesList = page.locator('#sidebar-favorites-list');
    const kanaConverterLink = favoritesList.locator('a', {
      hasText: 'ひらがな/カタカナ変換',
    });
    await expect(kanaConverterLink).toBeVisible();
  });

  test('お気に入りが0件のとき、#sidebar-favoritesセクションは非表示（hidden）である', async ({
    page,
  }) => {
    await page.goto('/');

    // 初期状態：お気に入りセクションは hidden
    const favoritesSection = page.locator('#sidebar-favorites');
    await expect(favoritesSection).toHaveAttribute('hidden', '');

    // お気に入りに1つ追加
    const favButton = page.locator(
      '[data-tool-slug="password-generator"] [data-favorite-toggle="password-generator"]',
    );
    await favButton.click();

    // セクションが表示される
    await expect(favoritesSection).not.toHaveAttribute('hidden', '');

    // そのツールを解除
    await favButton.click();

    // セクションが非表示に戻る
    await expect(favoritesSection).toHaveAttribute('hidden', '');
  });

  test('英語版でもお気に入り機能が動作する', async ({ page }) => {
    await page.goto('/en/');

    // 英語版のトップページでお気に入りボタンをクリック
    const favButton = page.locator(
      '[data-tool-slug="char-counter"] [data-favorite-toggle="char-counter"]',
    );
    await favButton.click();

    // ボタンの状態が変わる
    await expect(favButton).toHaveAttribute('aria-pressed', 'true');

    // サイドバーに表示される
    const favoritesList = page.locator('#sidebar-favorites-list');
    const charCounterLink = favoritesList.locator('a', {
      hasText: 'Character Counter',
    });
    await expect(charCounterLink).toBeVisible();

    // ツールページへ遷移
    await charCounterLink.click();

    // ツールページのボタンも同期されている（mainの中の一つを選択）
    const toolPageFavButton = page.locator(
      'main [data-favorite-toggle="char-counter"]',
    );
    await expect(toolPageFavButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('お気に入り登録したツールのサイドバー項目をクリックして遷移できる', async ({
    page,
  }) => {
    await page.goto('/');

    // お気に入りに追加
    const favButton = page.locator(
      '[data-tool-slug="html-escape"] [data-favorite-toggle="html-escape"]',
    );
    await favButton.click();

    // サイドバーのお気に入りリンクをクリック
    const favoritesList = page.locator('#sidebar-favorites-list');
    const htmlEscapeLink = favoritesList.locator('a', {
      hasText: 'HTML/JS文字列エスケープ・アンエスケープ',
    });
    await htmlEscapeLink.click();

    // ツールページへ遷移する
    await expect(page).toHaveURL(/\/tools\/html-escape\/?$/);
    await expect(page.locator('main h1')).toContainText(
      'HTML/JavaScript文字列',
    );
  });

  test('サイドバーのお気に入り一覧で並び替えができる', async ({ page }) => {
    await page.goto('/');

    await page
      .locator(
        '[data-tool-slug="char-counter"] [data-favorite-toggle="char-counter"]',
      )
      .click();
    await page
      .locator(
        '[data-tool-slug="json-formatter"] [data-favorite-toggle="json-formatter"]',
      )
      .click();

    const favoritesList = page.locator('#sidebar-favorites-list');
    const items = favoritesList.locator('li');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0).locator('a')).toHaveText('文字数カウント');
    await expect(items.nth(1).locator('a')).toHaveText('JSON整形');

    // 2番目（JSON整形）を上に移動する
    await items.nth(1).getByLabel('上に移動').click();

    await expect(items.nth(0).locator('a')).toHaveText('JSON整形');
    await expect(items.nth(1).locator('a')).toHaveText('文字数カウント');

    // 先頭要素の「上に移動」は無効化されている
    await expect(items.nth(0).getByLabel('上に移動')).toBeDisabled();
  });

  test('並び替え後、操作したボタンにフォーカスが残る', async ({ page }) => {
    await page.goto('/');

    await page
      .locator(
        '[data-tool-slug="char-counter"] [data-favorite-toggle="char-counter"]',
      )
      .click();
    await page
      .locator(
        '[data-tool-slug="json-formatter"] [data-favorite-toggle="json-formatter"]',
      )
      .click();

    const favoritesList = page.locator('#sidebar-favorites-list');
    const downButton = favoritesList
      .locator('li')
      .nth(0)
      .getByLabel('下に移動');
    await downButton.focus();
    await downButton.click();

    // DOMが作り直されてもフォーカスが失われず、同じslugのボタンに残る。
    // char-counterは末尾に移動して「下に移動」が無効化されるため、
    // フォールバックで「上に移動」ボタンにフォーカスが移る。
    await expect(page.locator(':focus')).toHaveAttribute(
      'data-move-slug',
      'char-counter',
    );
    await expect(page.locator(':focus')).toHaveAttribute(
      'data-move-direction',
      'up',
    );
  });

  test('サイドバーのお気に入りは開閉トグル式で、デフォルトは開いた状態になる', async ({
    page,
  }) => {
    await page.goto('/');

    await page
      .locator(
        '[data-tool-slug="char-counter"] [data-favorite-toggle="char-counter"]',
      )
      .click();

    const favoritesSection = page.locator('#sidebar-favorites');
    const summary = favoritesSection.locator('summary');
    const list = page.locator('#sidebar-favorites-list');

    // デフォルトで開いた状態（お気に入り一覧が見えている）
    await expect(favoritesSection).toHaveJSProperty('open', true);
    await expect(list).toBeVisible();

    // クリックすると閉じる
    await summary.click();
    await expect(favoritesSection).toHaveJSProperty('open', false);
    await expect(list).toBeHidden();

    // もう一度クリックすると開く
    await summary.click();
    await expect(favoritesSection).toHaveJSProperty('open', true);
    await expect(list).toBeVisible();
  });

  test('トップページではお気に入り登録したツールが先頭に表示される', async ({
    page,
  }) => {
    await page.goto('/');

    const grid = page.locator('ul.grid');
    const firstCardSlugBefore = await grid
      .locator('[data-tool-slug]')
      .first()
      .getAttribute('data-tool-slug');
    expect(firstCardSlugBefore).not.toBe('password-generator');

    await page
      .locator(
        '[data-tool-slug="password-generator"] [data-favorite-toggle="password-generator"]',
      )
      .click();

    await expect(grid.locator('[data-tool-slug]').first()).toHaveAttribute(
      'data-tool-slug',
      'password-generator',
    );
  });

  test('ツールページ上部のお気に入りボタンがh1の右端に表示される', async ({
    page,
  }) => {
    await page.goto('/tools/json-formatter/');

    const h1 = page.locator('main h1');
    const button = page.locator('main [data-favorite-toggle="json-formatter"]');

    // ボタンが表示されている
    await expect(button).toBeVisible();

    // ボタンが絶対配置されている
    const position = await button.evaluate(
      (el) => window.getComputedStyle(el).position,
    );
    expect(position).toBe('absolute');

    // ボタンが右側に配置されている
    const right = await button.evaluate(
      (el) => window.getComputedStyle(el).right,
    );
    expect(right).not.toBe('auto');

    // ボタンがmainの直下のdivにあることを確認
    const buttonParentIsRelativeDiv = await button.evaluate((el) => {
      const parent = el.parentElement;
      if (!parent) return false;
      const style = window.getComputedStyle(parent);
      return (
        style.position === 'relative' &&
        parent.tagName === 'DIV' &&
        parent.parentElement?.tagName === 'MAIN'
      );
    });
    expect(buttonParentIsRelativeDiv).toBe(true);

    // h1もmainの直下のdivにあることを確認
    const h1IsInMainDiv = await h1.evaluate((el) => {
      const parent = el.parentElement;
      if (!parent) return false;
      return (
        parent.tagName === 'DIV' && parent.parentElement?.tagName === 'MAIN'
      );
    });
    expect(h1IsInMainDiv).toBe(true);
  });

  test('ツールページのお気に入りボタンをクリックするとaria-label、title、aria-pressedが全て切り替わる', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');

    const button = page.locator('main [data-favorite-toggle="char-counter"]');

    // 初期状態（未追加）
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    const initialLabel = await button.getAttribute('aria-label');
    const initialTitle = await button.getAttribute('title');

    // 両方のテキストが同じ（どちらも「お気に入りに追加」）
    expect(initialLabel).toBe(initialTitle);

    // クリックしてお気に入りに追加
    await button.click();

    // 全ての属性が切り替わる
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    const addedLabel = await button.getAttribute('aria-label');
    const addedTitle = await button.getAttribute('title');

    // ラベルとタイトルが同じ（どちらも「お気に入りから削除」）
    expect(addedLabel).toBe(addedTitle);
    // 初期状態と異なる
    expect(addedLabel).not.toBe(initialLabel);

    // クリックして削除
    await button.click();

    // 初期状態に戻る
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    const removedLabel = await button.getAttribute('aria-label');
    const removedTitle = await button.getAttribute('title');

    expect(removedLabel).toBe(initialLabel);
    expect(removedTitle).toBe(initialTitle);
  });

  test('長いh1のツールページでもお気に入りボタンがh1と重ならない（複数行の場合も）', async ({
    page,
  }) => {
    await page.goto('/tools/html-escape/');

    const parentDiv = page.locator('main > div');
    const h1 = page.locator('main h1');
    const button = page.locator('main [data-favorite-toggle="html-escape"]');

    // 親divが相対配置
    const parentPosition = await parentDiv.evaluate(
      (el) => window.getComputedStyle(el).position,
    );
    expect(parentPosition).toBe('relative');

    // h1が右側にパディングを持つ（pr-12 = padding-right: 3rem）
    const h1PaddingRight = await h1.evaluate(
      (el) => window.getComputedStyle(el).paddingRight,
    );
    expect(h1PaddingRight).toBe('48px'); // 3rem = 48px

    // ボタンが見える
    await expect(button).toBeVisible();

    // ボタンの右端がスクロールを引き起こさない
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
