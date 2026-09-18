import { test, expect } from '@playwright/test';

test.describe('TOML⇔JSON/YAML変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、サンプルTOMLがJSONに変換される', async ({
    page,
  }) => {
    await page.goto('/tools/toml-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'TOML⇔JSON/YAML変換ツール',
    );

    // 初期状態は TOML → JSON で、サンプルTOMLが自動入力されている
    await expect(page.locator('#toml-converter-from')).toHaveValue('toml');
    await expect(page.locator('#toml-converter-to')).toHaveValue('json');
    await expect(page.locator('#toml-converter-input')).toHaveValue(
      /name = "Taro"/,
    );
    await expect(page.locator('#toml-converter-output')).toHaveValue(
      '{\n  "name": "Taro",\n  "hobbies": [\n    "reading",\n    "coding"\n  ]\n}',
    );
    await expect(page.locator('#toml-converter-error')).toBeHidden();
  });

  test('入力を変更すると結果がリアルタイムで更新される', async ({ page }) => {
    await page.goto('/tools/toml-converter/');

    await page.locator('#toml-converter-input').fill('title = "Sample"');

    await expect(page.locator('#toml-converter-output')).toHaveValue(
      '{\n  "title": "Sample"\n}',
    );
  });

  test('変換元を切り替えるとサンプルが自動入力される', async ({ page }) => {
    await page.goto('/tools/toml-converter/');

    await page.locator('#toml-converter-from').selectOption('yaml');

    await expect(page.locator('#toml-converter-input')).toHaveValue(
      'name: Taro\nhobbies:\n  - reading\n  - coding\n',
    );
    await expect(page.locator('#toml-converter-output')).toHaveValue(
      '{\n  "name": "Taro",\n  "hobbies": [\n    "reading",\n    "coding"\n  ]\n}',
    );
  });

  test('変換元と変換先が同じ場合はその場で整形し直される', async ({ page }) => {
    await page.goto('/tools/toml-converter/');

    await page.locator('#toml-converter-from').selectOption('toml');
    await page.locator('#toml-converter-to').selectOption('toml');
    await page.locator('#toml-converter-input').fill('name    =    "Taro"');

    await expect(page.locator('#toml-converter-output')).toHaveValue(
      'name = "Taro"\n',
    );
    // 変換先がTOMLのときはインデント幅の指定は無意味なので非表示になる
    await expect(page.locator('#toml-converter-indent-wrapper')).toBeHidden();
  });

  test('入れ替えボタンで変換元・変換先と入出力の内容が入れ替わる', async ({
    page,
  }) => {
    await page.goto('/tools/toml-converter/');

    // TOML→JSONの結果が出た状態から入れ替える
    await expect(page.locator('#toml-converter-output')).not.toHaveValue('');
    const outputBeforeSwap = await page
      .locator('#toml-converter-output')
      .inputValue();

    await page.locator('#toml-converter-swap-button').click();

    await expect(page.locator('#toml-converter-from')).toHaveValue('json');
    await expect(page.locator('#toml-converter-to')).toHaveValue('toml');
    await expect(page.locator('#toml-converter-input')).toHaveValue(
      outputBeforeSwap,
    );
  });

  test('TOMLのトップレベル制約に違反するとエラーが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/toml-converter/');

    await page.locator('#toml-converter-from').selectOption('json');
    await page.locator('#toml-converter-to').selectOption('toml');
    await page.locator('#toml-converter-input').fill('[1, 2, 3]');

    await expect(page.locator('#toml-converter-error')).toBeVisible();
    await expect(page.locator('#toml-converter-error')).toContainText(
      'オブジェクト',
    );
    await expect(page.locator('#toml-converter-output')).toHaveValue('');
  });

  test('不正なTOMLを入力するとエラーが表示される', async ({ page }) => {
    await page.goto('/tools/toml-converter/');

    await page.locator('#toml-converter-input').fill('key = ');

    await expect(page.locator('#toml-converter-error')).toBeVisible();
    await expect(page.locator('#toml-converter-error')).toContainText(
      '構文エラー',
    );
    await expect(page.locator('#toml-converter-output')).toHaveValue('');
  });

  test('インデント幅を変更するとJSON出力に反映される', async ({ page }) => {
    await page.goto('/tools/toml-converter/');

    await page.locator('#toml-converter-indent').selectOption('4');

    await expect(page.locator('#toml-converter-output')).toHaveValue(
      '{\n    "name": "Taro",\n    "hobbies": [\n        "reading",\n        "coding"\n    ]\n}',
    );
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/toml-converter/');

    await page.locator('#toml-converter-copy-button').click();

    await expect(page.locator('#toml-converter-status')).toHaveText(
      'コピーしました',
    );
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe(
      '{\n  "name": "Taro",\n  "hobbies": [\n    "reading",\n    "coding"\n  ]\n}',
    );
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    await page
      .locator('#sidebar details[data-category="変換"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'TOML⇔JSON/YAML変換' })
      .click();

    await expect(page).toHaveURL(/\/tools\/toml-converter\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'TOML⇔JSON/YAML変換ツール',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/toml-converter/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('TOML to JSON/YAML Converter (English)', () => {
  test('英語版が正しく表示され、サンプルTOMLがJSONに変換される', async ({
    page,
  }) => {
    await page.goto('/en/tools/toml-converter/');

    await expect(page.locator('main h1')).toHaveText(
      'TOML to JSON/YAML Converter',
    );
    await expect(page.locator('#toml-converter-output')).toHaveValue(
      '{\n  "name": "Taro",\n  "hobbies": [\n    "reading",\n    "coding"\n  ]\n}',
    );
  });

  test('TOMLのトップレベル制約違反時に英語のエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/toml-converter/');

    await page.locator('#toml-converter-from').selectOption('json');
    await page.locator('#toml-converter-to').selectOption('toml');
    await page.locator('#toml-converter-input').fill('[1, 2, 3]');

    await expect(page.locator('#toml-converter-error')).toContainText(
      'Syntax error',
    );
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/en/');

    await page
      .locator('#sidebar details[data-category="Convert"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'TOML to JSON/YAML Converter' })
      .click();

    await expect(page).toHaveURL(/\/en\/tools\/toml-converter\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'TOML to JSON/YAML Converter',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/tools/toml-converter/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
