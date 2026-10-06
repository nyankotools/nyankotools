import { test, expect } from './helpers/test';

test.describe('多段エンコード/デコード・ハッシュ変換チェーン（日本語版）', () => {
  test('手順を追加して連続変換でき、並べ替え・削除もできる', async ({
    page,
  }) => {
    await page.goto('/tools/data-recipe-builder/');
    await page.locator('#recipe-input').fill('Hello');

    await page.locator('#recipe-op').selectOption('base64-encode');
    await page.locator('#recipe-add-button').click();
    await expect(page.locator('#recipe-output')).toHaveValue('SGVsbG8=');

    await page.locator('#recipe-op').selectOption('hex-encode');
    await page.locator('#recipe-add-button').click();
    await expect(page.locator('#recipe-output')).toHaveValue(
      '534756736247383d',
    );
    await expect(page.locator('#recipe-steps li')).toHaveCount(2);

    // 入力を変えると追従する
    await page.locator('#recipe-input').fill('Hi');
    await expect(page.locator('#recipe-output')).toHaveValue('53476b3d');

    // 先頭の手順を削除すると、残った手順だけが適用される
    await page
      .locator('#recipe-steps li')
      .first()
      .getByRole('button', { name: '削除' })
      .click();
    await expect(page.locator('#recipe-steps li')).toHaveCount(1);
    await expect(page.locator('#recipe-output')).toHaveValue('4869');
  });

  test('不正な手順ではエラーに手順番号が出る', async ({ page }) => {
    await page.goto('/tools/data-recipe-builder/');
    await page.locator('#recipe-input').fill('***');
    await page.locator('#recipe-op').selectOption('base64-decode');
    await page.locator('#recipe-add-button').click();
    await expect(page.locator('#recipe-error')).toBeVisible();
    await expect(page.locator('#recipe-error')).toContainText('手順1');
    await expect(page.locator('#recipe-output')).toHaveValue('');
  });

  test('SHA-256ハッシュを計算できる', async ({ page }) => {
    await page.goto('/tools/data-recipe-builder/');
    await page.locator('#recipe-input').fill('abc');
    await page.locator('#recipe-op').selectOption('sha256');
    await page.locator('#recipe-add-button').click();
    await expect(page.locator('#recipe-output')).toHaveValue(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  test('20手順の制限を守る', async ({ page }) => {
    await page.goto('/tools/data-recipe-builder/');
    await page.locator('#recipe-input').fill('test');

    // 20手順追加
    for (let i = 0; i < 20; i++) {
      await page.locator('#recipe-op').selectOption('uppercase');
      await page.locator('#recipe-add-button').click();
    }
    await expect(page.locator('#recipe-steps li')).toHaveCount(20);

    // 21個目は追加されず、エラーが出る
    await page.locator('#recipe-op').selectOption('lowercase');
    await page.locator('#recipe-add-button').click();
    await expect(page.locator('#recipe-steps li')).toHaveCount(20);
    await expect(page.locator('#recipe-error')).toBeVisible();
    await expect(page.locator('#recipe-error')).toContainText('20');
  });
});

test.describe('Multi-Step Encode/Decode & Hash Chain (English)', () => {
  test('applies steps in order', async ({ page }) => {
    await page.goto('/en/tools/data-recipe-builder/');
    await expect(page.locator('main h1')).toContainText('Recipe Builder');
    await page.locator('#recipe-input').fill('Hello');
    await page.locator('#recipe-op').selectOption('base64-encode');
    await page.locator('#recipe-add-button').click();
    await page.locator('#recipe-op').selectOption('url-encode');
    await page.locator('#recipe-add-button').click();
    await expect(page.locator('#recipe-output')).toHaveValue('SGVsbG8%3D');
  });
});
