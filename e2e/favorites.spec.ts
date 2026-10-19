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

  test('サイドバーのお気に入り一覧でドラッグして並び替えができる', async ({
    page,
  }) => {
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

    // 2番目（JSON整形）のハンドルを1番目の上半分までドラッグする
    const handle = favoritesList.locator('[data-move-slug="json-formatter"]');
    const handleBox = await handle.boundingBox();
    const firstBox = await items.nth(0).boundingBox();
    if (!handleBox || !firstBox) throw new Error('boundingBox not found');
    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(handleBox.x + handleBox.width / 2, firstBox.y + 2, {
      steps: 5,
    });
    await page.mouse.up();

    await expect(items.nth(0).locator('a')).toHaveText('JSON整形');
    await expect(items.nth(1).locator('a')).toHaveText('文字数カウント');

    // リロードしても並び順が保持される
    await page.reload();
    await expect(items.nth(0).locator('a')).toHaveText('JSON整形');
  });

  test('ドラッグで離した位置まで一度に複数段移動できる', async ({ page }) => {
    await page.goto('/');

    for (const slug of ['char-counter', 'json-formatter', 'html-escape']) {
      await page
        .locator(`[data-tool-slug="${slug}"] [data-favorite-toggle="${slug}"]`)
        .click();
    }

    const favoritesList = page.locator('#sidebar-favorites-list');
    const items = favoritesList.locator('li');
    await expect(items).toHaveCount(3);

    // 先頭（文字数カウント）のハンドルを末尾の下半分までドラッグする
    const handleBox = await favoritesList
      .locator('[data-move-slug="char-counter"]')
      .boundingBox();
    const lastBox = await items.nth(2).boundingBox();
    if (!handleBox || !lastBox) throw new Error('boundingBox not found');
    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      lastBox.y + lastBox.height - 2,
      { steps: 10 },
    );
    await page.mouse.up();

    await expect(items.nth(2).locator('a')).toHaveText('文字数カウント');
    await expect(items.nth(0).locator('a')).toHaveText('JSON整形');
  });

  test('ハンドルにフォーカスして上下キーで並び替えでき、フォーカスが残る', async ({
    page,
  }) => {
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
    const handle = favoritesList.locator('[data-move-slug="char-counter"]');
    await handle.focus();
    await page.keyboard.press('ArrowDown');

    // DOMが作り直されてもフォーカスが失われず、同じslugのハンドルに残る
    await expect(page.locator(':focus')).toHaveAttribute(
      'data-move-slug',
      'char-counter',
    );
    await expect(favoritesList.locator('li').nth(1).locator('a')).toHaveText(
      '文字数カウント',
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

  test('英語版では並び替えハンドルのラベルが英語になり、上下キーで並び替えできる', async ({
    page,
  }) => {
    await page.goto('/en/');

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
    const handle = favoritesList.locator('[data-move-slug="json-formatter"]');
    await expect(handle).toHaveAttribute(
      'aria-label',
      'Drag to reorder (or use the up/down arrow keys)',
    );

    await handle.focus();
    await page.keyboard.press('ArrowUp');

    await expect(items.nth(0).locator('a')).toHaveText('JSON Formatter');
    await expect(items.nth(1).locator('a')).toHaveText('Character Counter');
    await expect(page.locator(':focus')).toHaveAttribute(
      'data-move-slug',
      'json-formatter',
    );
  });

  test('旧の上下ボタン（data-move-direction）は残っておらず、ハンドルはタッチ操作を奪う設定（touch-action: none）になっている', async ({
    page,
  }) => {
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
    await expect(favoritesList.locator('li')).toHaveCount(2);
    await expect(favoritesList.locator('[data-move-direction]')).toHaveCount(0);
    await expect(favoritesList.locator('button')).toHaveCount(2);

    const touchAction = await favoritesList
      .locator('[data-move-slug="char-counter"]')
      .evaluate((el) => window.getComputedStyle(el).touchAction);
    expect(touchAction).toBe('none');
  });

  test('375px幅のサイドバーでもハンドルをドラッグして並び替えでき、並び順がリロード後も保持される', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
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

    // 小画面ではサイドバーは開閉式なので開いてから操作する。
    // スライドイン（transition 200ms）中の座標でドラッグすると位置がずれるため、位置が確定するまで待つ
    const toggle = page.locator('#sidebar-toggle');
    const openSidebarOnMobile = async () => {
      if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
        await toggle.click();
      }
      await page.waitForFunction(
        () =>
          document.getElementById('sidebar')?.getBoundingClientRect().left ===
          0,
      );
    };
    await openSidebarOnMobile();

    const favoritesList = page.locator('#sidebar-favorites-list');
    const items = favoritesList.locator('li');
    const handleBox = await favoritesList
      .locator('[data-move-slug="json-formatter"]')
      .boundingBox();
    const firstBox = await items.nth(0).boundingBox();
    if (!handleBox || !firstBox) throw new Error('boundingBox not found');
    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(handleBox.x + handleBox.width / 2, firstBox.y + 2, {
      steps: 5,
    });
    await page.mouse.up();

    await expect(items.nth(0).locator('a')).toHaveText('JSON整形');

    await page.reload();
    await openSidebarOnMobile();
    await expect(items.nth(0).locator('a')).toHaveText('JSON整形');
    await expect(items.nth(1).locator('a')).toHaveText('文字数カウント');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('トップのカテゴリ別セクションと「もっと見る」', () => {
  for (const { path, more } of [
    { path: '/', more: /もっと見る/ },
    { path: '/en/', more: /Show more/ },
  ]) {
    test(`${path}: カテゴリごとに分かれ、超過分は「もっと見る」で展開できる`, async ({
      page,
    }) => {
      await page.goto(path);

      const section = page
        .locator('[data-home-section]:not([data-home-section="favorites"])')
        .filter({ has: page.locator('[data-show-more]:not([hidden])') })
        .first();
      const cards = section.locator('[data-tool-slug]');
      const button = section.locator('[data-show-more]');
      await expect(button).toHaveText(more);
      await expect(cards.locator('visible=true')).toHaveCount(6);

      await button.click();
      expect(await cards.locator('visible=true').count()).toBeGreaterThan(6);
      await expect(button).toHaveAttribute('aria-expanded', 'true');

      await button.click();
      await expect(cards.locator('visible=true')).toHaveCount(6);
    });

    test(`${path}: 検索中は折りたたまれず、お気に入りがない間は先頭セクションが隠れる`, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator('#home-favorites')).toBeHidden();

      await page.locator('#tool-search').fill('json');
      await expect(page.locator('[data-show-more]:visible')).toHaveCount(0);
    });
  }

  test('お気に入りに追加したツールはお気に入りセクションに移り、解除でカテゴリに戻る', async ({
    page,
  }) => {
    await page.goto('/');
    const card = page.locator('[data-tool-slug="char-counter"]');
    await card.locator('[data-favorite-toggle]').click();

    const favorites = page.locator('#home-favorites');
    await expect(favorites).toBeVisible();
    await expect(
      favorites.locator('[data-tool-slug="char-counter"]'),
    ).toBeVisible();
    // 先頭のセクションがお気に入りで、カテゴリ側とは重複しない
    await expect(page.locator('[data-tool-slug="char-counter"]')).toHaveCount(
      1,
    );

    await card.locator('[data-favorite-toggle]').click();
    await expect(favorites).toBeHidden();
    await expect(
      page
        .locator('[data-home-section]:not([data-home-section="favorites"])')
        .locator('[data-tool-slug="char-counter"]'),
    ).toHaveCount(1);
  });
});
