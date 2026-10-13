import { test, expect } from './helpers/test';

test.describe('CSSアニメーションジェネレーター（日本語版）', () => {
  test('初期状態で@keyframesとanimationが生成される', async ({ page }) => {
    await page.goto('/tools/css-animation-generator/');

    const output = page.locator('#ca-css-output');
    await expect(output).toHaveValue(/@keyframes bounce/);
    await expect(output).toHaveValue(
      /animation: bounce 1s ease 0s infinite normal none;/,
    );
    await expect(output).toHaveValue(/prefers-reduced-motion: reduce/);
  });

  test('プリセットを変更すると名前とキーフレームが更新される', async ({
    page,
  }) => {
    await page.goto('/tools/css-animation-generator/');

    await page.locator('#ca-preset').selectOption('spin');

    await expect(page.locator('#ca-name')).toHaveValue('spin');
    await expect(page.locator('#ca-css-output')).toHaveValue(
      /rotate\(360deg\)/,
    );
  });

  test('継続時間・遅延・繰り返し・方向・fill-modeが反映される', async ({
    page,
  }) => {
    await page.goto('/tools/css-animation-generator/');

    await page.locator('#ca-duration').fill('2.5');
    await page.locator('#ca-delay').fill('0.5');
    await page.locator('#ca-infinite').uncheck();
    await page.locator('#ca-iterations').fill('3');
    await page.locator('#ca-direction').selectOption('alternate');
    await page.locator('#ca-fill-mode').selectOption('both');

    await expect(page.locator('#ca-css-output')).toHaveValue(
      /animation: bounce 2\.5s ease 0\.5s 3 alternate both;/,
    );
  });

  test('イージング選択でcubic-bezierの値が入り、数値編集でカスタムになる', async ({
    page,
  }) => {
    await page.goto('/tools/css-animation-generator/');

    await page.locator('#ca-easing').selectOption('ease-out-back');
    await expect(page.locator('#ca-y1')).toHaveValue('1.56');
    await expect(page.locator('#ca-css-output')).toHaveValue(
      /cubic-bezier\(0\.34, 1\.56, 0\.64, 1\)/,
    );

    await page.locator('#ca-x1').fill('0.1');
    await expect(page.locator('#ca-easing')).toHaveValue('custom');
    await expect(page.locator('#ca-css-output')).toHaveValue(
      /cubic-bezier\(0\.1, 1\.56, 0\.64, 1\)/,
    );
  });

  test('範囲外のcubic-bezier xはクランプされる', async ({ page }) => {
    await page.goto('/tools/css-animation-generator/');

    const x1 = page.locator('#ca-x1');
    await x1.fill('5');
    await x1.blur();

    await expect(x1).toHaveValue('1');
  });

  test('アニメーション名が不正でも安全な名前に補正される', async ({ page }) => {
    await page.goto('/tools/css-animation-generator/');

    await page.locator('#ca-name').fill('1 my anim');

    await expect(page.locator('#ca-css-output')).toHaveValue(
      /@keyframes my-anim \{/,
    );
  });

  test('prefers-reduced-motionをオフにすると出力から消える', async ({
    page,
  }) => {
    await page.goto('/tools/css-animation-generator/');

    await page.locator('#ca-reduced-motion').uncheck();

    await expect(page.locator('#ca-css-output')).not.toHaveValue(
      /prefers-reduced-motion/,
    );
  });

  test('プレビューにアニメーションが適用される', async ({ page }) => {
    await page.goto('/tools/css-animation-generator/');

    await expect
      .poll(async () =>
        page.locator('#ca-preview').evaluate((el) => el.getAnimations().length),
      )
      .toBe(1);
  });

  // 既知の不具合: プレビューがOSのprefers-reduced-motionを無視して自動再生する（実装側の修正待ち）
  test.fixme('OSがreduced-motionのときプレビューは自動再生しない', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/css-animation-generator/');

    await expect
      .poll(async () =>
        page.locator('#ca-preview').evaluate((el) => el.getAnimations().length),
      )
      .toBe(0);
  });

  test('コピーボタンでCSSをコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-animation-generator/');

    const css = await page.locator('#ca-css-output').inputValue();
    await page.locator('#ca-copy-button').click();

    await expect(page.locator('#ca-status')).toHaveText('コピーしました');
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    // Windows のクリップボードは LF を CRLF に変換するため正規化して比較する
    expect(clipboard.replace(/\r\n/g, '\n')).toBe(css);
  });
});

test.describe('CSS Animation Generator (English)', () => {
  test('displays and generates CSS in English', async ({ page }) => {
    await page.goto('/en/tools/css-animation-generator/');

    await expect(page.locator('main h1')).toHaveText('CSS Animation Generator');
    await expect(page.locator('#ca-css-output')).toHaveValue(
      /animation: bounce 1s ease 0s infinite normal none;/,
    );
  });
});
