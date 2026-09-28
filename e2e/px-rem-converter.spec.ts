import { test, expect } from '@playwright/test';

test.describe('px⇔rem変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、デフォルトでベースフォントサイズが16に設定される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    await expect(page.locator('main h1')).toHaveText('px⇔rem変換ツール');
    await expect(page.locator('#px-rem-base-input')).toHaveValue('16');
    // 初期値：px=16、rem=1（16pxの デフォルト値から1remに変換）
    await expect(page.locator('#px-rem-px-input')).toHaveValue('16');
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1');
  });

  test('px欄に16を入力するとrem欄に1が表示される', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    await page.locator('#px-rem-px-input').fill('16');

    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1');
  });

  test('px欄に24を入力するとrem欄に1.5が表示される', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    await page.locator('#px-rem-px-input').fill('24');

    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1.5');
  });

  test('rem欄に1を入力するとpx欄に16が表示される', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    await page.locator('#px-rem-rem-input').fill('1');

    await expect(page.locator('#px-rem-px-input')).toHaveValue('16');
  });

  test('rem欄に1.5を入力するとpx欄に24が表示される', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    await page.locator('#px-rem-rem-input').fill('1.5');

    await expect(page.locator('#px-rem-px-input')).toHaveValue('24');
  });

  test('小数計算：px欄に10を入力するとrem欄に0.625が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    await page.locator('#px-rem-px-input').fill('10');

    await expect(page.locator('#px-rem-rem-input')).toHaveValue('0.625');
  });

  test('負の値：px欄に-16を入力するとrem欄に-1が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    await page.locator('#px-rem-px-input').fill('-16');

    await expect(page.locator('#px-rem-rem-input')).toHaveValue('-1');
  });

  test('ベースフォントサイズを20に変更すると既入力の値が再計算される（px→rem）', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    // px欄に20を入力（ベースフォントサイズ16でrem欄に1.25が表示される）
    await page.locator('#px-rem-px-input').fill('20');
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1.25');

    // ベースフォントサイズを20に変更
    await page.locator('#px-rem-base-input').fill('20');

    // px欄の20はそのままで、rem欄が1に再計算される
    await expect(page.locator('#px-rem-px-input')).toHaveValue('20');
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1');
  });

  test('ベースフォントサイズを14に変更すると既入力の値が再計算される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    // 初期値でpx=16,rem=1が設定されている
    // ベースフォントサイズを14に変更
    await page.locator('#px-rem-base-input').fill('14');

    // px=16のまま、rem欄が16/14≈1.14286に再計算される
    await expect(page.locator('#px-rem-px-input')).toHaveValue('16');
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1.14286');
  });

  test('px欄に不正な値を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    await page.locator('#px-rem-px-input').fill('abc');

    await expect(page.locator('#px-rem-error')).toHaveText(
      'pxの値が数値として無効です',
    );
  });

  test('rem欄に不正な値を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    await page.locator('#px-rem-rem-input').fill('xyz');

    await expect(page.locator('#px-rem-error')).toHaveText(
      'remの値が数値として無効です',
    );
  });

  test('ベースフォントサイズに不正な値を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    // ベースフォントサイズを不正な値に変更
    await page.locator('#px-rem-base-input').fill('abc');

    // px欄に値を入力しようとするとエラーが出る
    await page.locator('#px-rem-px-input').fill('16');

    await expect(page.locator('#px-rem-error')).toHaveText(
      'ベースフォントサイズは0より大きい数値で指定してください',
    );
  });

  test('ベースフォントサイズに0を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    // ベースフォントサイズを0に変更
    await page.locator('#px-rem-base-input').fill('0');

    // px欄に値を入力しようとするとエラーが出る
    await page.locator('#px-rem-px-input').fill('16');

    await expect(page.locator('#px-rem-error')).toHaveText(
      'ベースフォントサイズは0より大きい数値で指定してください',
    );
  });

  test('ベースフォントサイズに負の値を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    // ベースフォントサイズを負の値に変更
    await page.locator('#px-rem-base-input').fill('-16');

    // px欄に値を入力しようとするとエラーが出る
    await page.locator('#px-rem-px-input').fill('16');

    await expect(page.locator('#px-rem-error')).toHaveText(
      'ベースフォントサイズは0より大きい数値で指定してください',
    );
  });

  test('入力フィールドが空の場合、エラーメッセージが消える', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    // 不正な値を入力してエラーを表示
    await page.locator('#px-rem-px-input').fill('abc');
    await expect(page.locator('#px-rem-error')).toHaveText(
      'pxの値が数値として無効です',
    );

    // フィールドをクリア
    await page.locator('#px-rem-px-input').fill('');

    // エラーメッセージが消える
    await expect(page.locator('#px-rem-error')).toBeEmpty();
  });

  test('pxコピーボタンをクリックするとクリップボードにコピーされ、ステータスメッセージが表示される', async ({
    page,
  }) => {
    // クリップボード権限を許可
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/tools/px-rem-converter/');

    // px欄に値を入力
    await page.locator('#px-rem-px-input').fill('24');

    // pxコピーボタンをクリック
    const pxCopyButton = page.locator(
      'button[data-copy-target="px-rem-px-input"]',
    );
    await pxCopyButton.click();

    // ステータスメッセージが表示される
    await expect(page.locator('#px-rem-status')).toHaveText('コピーしました');
  });

  test('remコピーボタンをクリックするとクリップボードにコピーされ、ステータスメッセージが表示される', async ({
    page,
  }) => {
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/tools/px-rem-converter/');

    // rem欄に値を入力
    await page.locator('#px-rem-rem-input').fill('1.5');

    // remコピーボタンをクリック
    const remCopyButton = page.locator(
      'button[data-copy-target="px-rem-rem-input"]',
    );
    await remCopyButton.click();

    // ステータスメッセージが表示される
    await expect(page.locator('#px-rem-status')).toHaveText('コピーしました');
  });

  test('空のフィールドをコピーしようとしてもステータスメッセージは表示されない', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    // px欄がまだ空の状態でコピーボタンをクリック
    const pxCopyButton = page.locator(
      'button[data-copy-target="px-rem-px-input"]',
    );
    await pxCopyButton.click();

    // ステータスメッセージは表示されない
    await expect(page.locator('#px-rem-status')).toBeEmpty();
  });

  test('小数第5位以上の割り切れない計算結果は丸められて表示される', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');

    // ベースフォントサイズを3に変更（10 / 3 = 3.333...）
    await page.locator('#px-rem-base-input').fill('3');

    // px欄に10を入力
    await page.locator('#px-rem-px-input').fill('10');

    // rem欄は小数第5位で丸められて3.33333が表示される
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('3.33333');
  });

  test('ベースフォントサイズの小数値にも対応する', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    // ベースフォントサイズを16.5に変更
    await page.locator('#px-rem-base-input').fill('16.5');

    // px欄に33を入力
    await page.locator('#px-rem-px-input').fill('33');

    // rem欄が正しく計算される（33 / 16.5 = 2）
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('2');
  });

  test('小数第5位で丸められた-0は0として表示される', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    // ベースフォントサイズを10に変更
    await page.locator('#px-rem-base-input').fill('10');

    // px欄に0を入力
    await page.locator('#px-rem-px-input').fill('0');

    // rem欄は0（-0ではなく）として表示される
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('0');
  });

  test('複数の変換を連続して実行できる', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    // 最初の変換
    await page.locator('#px-rem-px-input').fill('16');
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1');

    // 次の変換（px欄をクリア後、新しい値を入力）
    await page.locator('#px-rem-px-input').fill('32');
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('2');

    // rem欄から逆変換
    await page.locator('#px-rem-rem-input').fill('0.5');
    await expect(page.locator('#px-rem-px-input')).toHaveValue('8');
  });

  test('前後のスペースを含む数値を入力してもパースされる', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    // スペース付きで入力
    await page.locator('#px-rem-px-input').fill('  16  ');

    // 正しく計算される
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1');
  });

  test('符号付きの値にも対応する（+記号）', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    // +記号付きで入力
    await page.locator('#px-rem-px-input').fill('+32');

    // 正しく計算される
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('2');
  });

  test('小数点のみの値（.5など）にも対応する', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');

    // .5を入力
    await page.locator('#px-rem-px-input').fill('.5');

    // 正しく計算される（0.5 / 16 ≈ 0.03125）
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('0.03125');
  });
});

test.describe('px⇔rem変換ツール（英語版）', () => {
  test('英語版が正しく表示される', async ({ page }) => {
    await page.goto('/en/tools/px-rem-converter/');

    await expect(page.locator('main h1')).toHaveText('px to rem Converter');
    await expect(page.locator('#px-rem-base-input')).toHaveValue('16');
  });

  test('英語版で変換が機能する', async ({ page }) => {
    await page.goto('/en/tools/px-rem-converter/');

    await page.locator('#px-rem-px-input').fill('16');

    await expect(page.locator('#px-rem-rem-input')).toHaveValue('1');
  });

  test('英語版でエラーメッセージが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/px-rem-converter/');

    await page.locator('#px-rem-px-input').fill('abc');

    await expect(page.locator('#px-rem-error')).toHaveText(
      'The px value is not a valid number',
    );
  });

  test('英語版で「コピーしました」が英語で表示される', async ({ page }) => {
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/en/tools/px-rem-converter/');

    await page.locator('#px-rem-px-input').fill('16');

    const pxCopyButton = page.locator(
      'button[data-copy-target="px-rem-px-input"]',
    );
    await pxCopyButton.click();

    await expect(page.locator('#px-rem-status')).toHaveText('Copied');
  });
});
