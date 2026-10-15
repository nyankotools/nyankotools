import { test, expect } from './helpers/test';

test.describe('CSS clip-pathジェネレーター（日本語版）', () => {
  test('初期状態は三角形のpolygonが生成される', async ({ page }) => {
    await page.goto('/tools/css-clip-path-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'CSS clip-pathジェネレーター',
    );
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);',
    );
    await expect(page.locator('#cp-handles button')).toHaveCount(3);
  });

  test('プリセット選択・頂点追加・削除ができる', async ({ page }) => {
    await page.goto('/tools/css-clip-path-generator/');
    await page.locator('#cp-preset').selectOption('hexagon');
    await expect(page.locator('#cp-handles button')).toHaveCount(6);
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);',
    );

    await page.getByRole('button', { name: '頂点を追加' }).click();
    await expect(page.locator('#cp-handles button')).toHaveCount(7);
    await expect(page.locator('#cp-preset')).toHaveValue('');

    await page.getByRole('button', { name: '削除' }).first().click();
    await expect(page.locator('#cp-handles button')).toHaveCount(6);
  });

  test('頂点をドラッグするとCSSが更新される', async ({ page }) => {
    await page.goto('/tools/css-clip-path-generator/');
    const stage = await page.locator('#cp-stage').boundingBox();
    const handle = page.locator('#cp-handles button').first();
    const box = (await handle.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      stage!.x + stage!.width * 0.25,
      stage!.y + stage!.height * 0.5,
      {
        steps: 4,
      },
    );
    await page.mouse.up();
    await expect(page.locator('#cp-css-output')).toHaveValue(
      /clip-path: polygon\(25% 50%, /,
    );
  });

  test('矢印キーで頂点を動かせる', async ({ page }) => {
    await page.goto('/tools/css-clip-path-generator/');
    const handle = page.locator('#cp-handles button').first();
    await handle.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#cp-css-output')).toHaveValue(
      /polygon\(51% 1%, /,
    );
  });

  test('circle・ellipse・insetの数値入力とprefix出力', async ({ page }) => {
    await page.goto('/tools/css-clip-path-generator/');
    await page.getByRole('button', { name: 'circle（円）' }).click();
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: circle(50% at 50% 50%);',
    );
    await page.locator('#cp-radius').fill('30');
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: circle(30% at 50% 50%);',
    );

    await page.getByRole('button', { name: 'ellipse（楕円）' }).click();
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: ellipse(50% 35% at 50% 50%);',
    );

    await page.getByRole('button', { name: 'inset（長方形）' }).click();
    await page.locator('#cp-round').fill('12');
    await page.locator('#cp-prefix').check();
    await expect(page.locator('#cp-css-output')).toHaveValue(
      '-webkit-clip-path: inset(10% 10% 10% 10% round 12%);\nclip-path: inset(10% 10% 10% 10% round 12%);',
    );
  });

  test('circleを選ぶとpolygon用のUIが隠れ、戻すと再表示される', async ({
    page,
  }) => {
    await page.goto('/tools/css-clip-path-generator/');
    await expect(page.locator('#cp-preset')).toBeVisible();
    await expect(page.locator('#cp-handles')).toBeVisible();
    await page.getByRole('button', { name: 'circle（円）' }).click();
    await expect(page.locator('#cp-preset')).toBeHidden();
    await expect(page.locator('#cp-handles')).toBeHidden();
    await expect(page.locator('#cp-radius')).toBeVisible();
    await page.getByRole('button', { name: 'polygon（多角形）' }).click();
    await expect(page.locator('#cp-preset')).toBeVisible();
    await expect(page.locator('#cp-handles')).toBeVisible();
  });

  test('頂点の数値入力・Shift+矢印・端での丸めが反映される', async ({
    page,
  }) => {
    await page.goto('/tools/css-clip-path-generator/');
    await page
      .locator('#cp-point-list input[data-index="1"][data-axis="x"]')
      .fill('10');
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: polygon(50% 0%, 10% 100%, 100% 100%);',
    );

    const handle = page.locator('#cp-handles button').first();
    await handle.focus();
    await page.keyboard.press('Shift+ArrowRight');
    await page.keyboard.press('Shift+ArrowUp');
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: polygon(55% 0%, 10% 100%, 100% 100%);',
    );
  });

  test('3点では削除できず、24点で頂点追加が無効になる', async ({ page }) => {
    await page.goto('/tools/css-clip-path-generator/');
    await expect(
      page.getByRole('button', { name: '削除' }).first(),
    ).toBeDisabled();
    const add = page.getByRole('button', { name: '頂点を追加' });
    for (let i = 0; i < 21; i++) await add.click();
    await expect(page.locator('#cp-handles button')).toHaveCount(24);
    await expect(add).toBeDisabled();
    await expect(
      page.getByRole('button', { name: '削除' }).first(),
    ).toBeEnabled();
  });

  test('スナップ有効時はドラッグ位置が5%刻みになる', async ({ page }) => {
    await page.goto('/tools/css-clip-path-generator/');
    await page.locator('#cp-snap').check();
    const stage = (await page.locator('#cp-stage').boundingBox())!;
    const box = (await page
      .locator('#cp-handles button')
      .first()
      .boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      stage.x + stage.width * 0.27,
      stage.y + stage.height * 0.5,
      { steps: 4 },
    );
    await page.mouse.up();
    await expect(page.locator('#cp-css-output')).toHaveValue(
      /clip-path: polygon\(25% 50%, /,
    );
  });

  test('リロード後に数値入力とプリセットが復元される（図形はpolygonに戻る）', async ({
    page,
  }) => {
    await page.goto('/tools/css-clip-path-generator/');
    await page.locator('#cp-preset').selectOption('hexagon');
    await page.getByRole('button', { name: 'circle（円）' }).click();
    await page.locator('#cp-radius').fill('30');
    await expect
      .poll(() =>
        page.evaluate(() =>
          (
            sessionStorage.getItem('nyanko:input:css-clip-path-generator') ?? ''
          ).includes('cp-radius'),
        ),
      )
      .toBe(true);

    await page.reload();
    await expect(page.locator('#cp-preset')).toHaveValue('hexagon');
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);',
    );
    await page.getByRole('button', { name: 'circle（円）' }).click();
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: circle(30% at 50% 50%);',
    );
  });

  test('コピーボタンで成功メッセージが出る', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-clip-path-generator/');
    await page.locator('#cp-copy-button').click();
    await expect(page.locator('#cp-status')).toHaveText('コピーしました');
  });
});

test.describe('CSS clip-path Generator (English)', () => {
  test('表示されプリセットが使える', async ({ page }) => {
    await page.goto('/en/tools/css-clip-path-generator/');
    await expect(page.locator('main h1')).toHaveText('CSS clip-path Generator');
    await page.locator('#cp-preset').selectOption('rhombus');
    await expect(page.locator('#cp-css-output')).toHaveValue(
      'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);',
    );
  });
});
