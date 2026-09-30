import { test, expect } from '@playwright/test';

// Step 5: 入力欄まわり共通機能（No.169）・入力状態の保持（No.176）・印刷CSS（No.178）

test.describe('入力欄の共通機能（No.169）', () => {
  test('サンプル入力・クリア・文字数が使え、ツールの結果に反映される', async ({
    page,
  }) => {
    await page.goto('/tools/text-case-converter/');
    const input = page.locator('#text-case-input');
    const bar = page.locator('[data-input-helpers]');

    await expect(bar).toContainText('0文字');

    await bar.getByRole('button', { name: 'サンプル入力' }).click();
    await expect(input).toHaveValue('hello world sample_text');
    await expect(bar).toContainText('23文字');
    await expect(page.locator('[data-case="camelCase"]')).toHaveValue(
      'helloWorldSampleText',
    );

    await bar.getByRole('button', { name: 'クリア' }).click();
    await expect(input).toHaveValue('');
    await expect(bar).toContainText('0文字');
  });

  test('英語版はラベルが英語になる', async ({ page }) => {
    await page.goto('/en/tools/text-case-converter/');
    const bar = page.locator('[data-input-helpers]');
    await expect(
      bar.getByRole('button', { name: 'Insert sample' }),
    ).toBeVisible();
    await expect(bar.getByRole('button', { name: 'Clear' })).toBeVisible();
    await expect(bar).toContainText('0 chars');
  });

  test('貼り付けボタンでクリップボードの内容が入力される', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName !== 'chromium',
      'clipboard 権限の付与は chromium のみ',
    );
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/text-case-converter/');
    await page.evaluate(() => navigator.clipboard.writeText('from clipboard'));
    await page
      .locator('[data-input-helpers]')
      .getByRole('button', { name: '貼り付け' })
      .click();
    await expect(page.locator('#text-case-input')).toHaveValue(
      'from clipboard',
    );
  });

  test('文字数ツールでは文字数表示が重複しない（data-no-count）', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    await expect(page.locator('[data-input-helpers]')).toBeVisible();
    await expect(page.locator('[data-input-helpers]')).not.toContainText(
      '文字',
    );
  });

  test('機微ツールには入力補助を出さない', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');
    await expect(page.locator('[data-tool-page]')).toBeVisible();
    await expect(page.locator('[data-input-helpers]')).toHaveCount(0);
  });
});

test.describe('入力状態の保持（No.176）', () => {
  test('再読み込みと言語切替で入力が引き継がれる', async ({ page }) => {
    await page.goto('/tools/text-case-converter/');
    await page.locator('#text-case-input').fill('keep me');
    // 保存はデバウンスされるので、反映を待ってから再読み込みする
    await page.waitForTimeout(500);

    await page.reload();
    await expect(page.locator('#text-case-input')).toHaveValue('keep me');
    await expect(page.locator('[data-case="camelCase"]')).toHaveValue('keepMe');

    await page.goto('/en/tools/text-case-converter/');
    await expect(page.locator('#text-case-input')).toHaveValue('keep me');
  });

  test('数値入力も復元される', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');
    await page.locator('#px-rem-px-input').fill('32');
    await page.waitForTimeout(500);
    await page.reload();
    await expect(page.locator('#px-rem-px-input')).toHaveValue('32');
  });

  test('?text= の初期値は保存された値より優先される', async ({ page }) => {
    await page.goto('/tools/text-case-converter/');
    await page.locator('#text-case-input').fill('saved');
    await page.waitForTimeout(500);

    await page.goto('/tools/text-case-converter/?text=from-url');
    await expect(page.locator('#text-case-input')).toHaveValue('from-url');
  });

  test('機微ツールの入力は保存も復元もされない', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');
    await page.locator('#jwt-input').fill('secret.token.value');
    await page.waitForTimeout(500);

    const stored = await page.evaluate(() =>
      Object.keys(sessionStorage).filter((k) => k.startsWith('nyanko:input:')),
    );
    expect(stored).toEqual([]);

    await page.reload();
    await expect(page.locator('#jwt-input')).toHaveValue('');
  });
});

test.describe('大きな入力（No.173）', () => {
  test('数万文字の貼り付けでも最終的に結果が反映される', async ({ page }) => {
    await page.goto('/tools/base64/');
    const big = 'a'.repeat(60_000);
    await page.locator('#base64-input').fill(big);
    await expect(page.locator('#base64-output')).not.toHaveValue('', {
      timeout: 5000,
    });
    const output = await page.locator('#base64-output').inputValue();
    expect(output.length).toBeGreaterThan(60_000);
  });
});

test.describe('印刷CSS（No.178）', () => {
  test('印刷時はサイドバー・フッター・シェア欄が消え、本文は残る', async ({
    page,
  }) => {
    await page.goto('/tools/bmi-calculator/');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('#sidebar')).toBeHidden();
    await expect(page.locator('footer')).toBeHidden();
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[data-local-badge]')).toBeHidden();
  });

  test('画面表示ではサイドバー（PC幅）が残る', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/tools/bmi-calculator/');
    await expect(page.locator('#sidebar')).toBeVisible();
  });
});
