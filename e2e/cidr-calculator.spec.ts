import { test, expect } from '@playwright/test';

test.describe('CIDR/サブネット計算機（日本語版）', () => {
  test('直接アクセスして正しく表示され、デフォルトで192.168.1.10/24の結果が表示される', async ({
    page,
  }) => {
    await page.goto('/tools/cidr-calculator/');

    await expect(page.locator('main h1')).toHaveText('CIDR/サブネット計算機');
    await expect(page.locator('#cidr-input')).toHaveValue('192.168.1.10/24');

    await expect(page.locator('#cidr-network-address')).toHaveText(
      '192.168.1.0',
    );
    await expect(page.locator('#cidr-broadcast-address')).toHaveText(
      '192.168.1.255',
    );
    await expect(page.locator('#cidr-subnet-mask')).toHaveText('255.255.255.0');
    await expect(page.locator('#cidr-wildcard-mask')).toHaveText('0.0.0.255');
    await expect(page.locator('#cidr-first-host')).toHaveText('192.168.1.1');
    await expect(page.locator('#cidr-last-host')).toHaveText('192.168.1.254');
    await expect(page.locator('#cidr-usable-host-count')).toHaveText('254');
    await expect(page.locator('#cidr-total-address-count')).toHaveText('256');
    await expect(page.locator('#cidr-error')).toBeEmpty();
  });

  test('CIDRプレフィックスを変更すると結果が連動更新される', async ({
    page,
  }) => {
    await page.goto('/tools/cidr-calculator/');

    await page.locator('#cidr-input').fill('10.0.0.5/30');

    await expect(page.locator('#cidr-network-address')).toHaveText('10.0.0.4');
    await expect(page.locator('#cidr-broadcast-address')).toHaveText(
      '10.0.0.7',
    );
    await expect(page.locator('#cidr-first-host')).toHaveText('10.0.0.5');
    await expect(page.locator('#cidr-last-host')).toHaveText('10.0.0.6');
    await expect(page.locator('#cidr-usable-host-count')).toHaveText('2');
    await expect(page.locator('#cidr-total-address-count')).toHaveText('4');
    await expect(page.locator('#cidr-error')).toBeEmpty();
  });

  test('サブネットマスク指定の入力でも同じ結果になる', async ({ page }) => {
    await page.goto('/tools/cidr-calculator/');

    await page.locator('#cidr-input').fill('192.168.1.10/255.255.255.0');

    await expect(page.locator('#cidr-network-address')).toHaveText(
      '192.168.1.0',
    );
    await expect(page.locator('#cidr-subnet-mask')).toHaveText('255.255.255.0');
    await expect(page.locator('#cidr-usable-host-count')).toHaveText('254');
    await expect(page.locator('#cidr-error')).toBeEmpty();
  });

  test('不正な入力でエラーメッセージが表示される', async ({ page }) => {
    await page.goto('/tools/cidr-calculator/');

    await page.locator('#cidr-input').fill('999.999.999.999/24');

    await expect(page.locator('#cidr-error')).toHaveText(
      '形式が正しくありません（例: 192.168.1.10/24 または 192.168.1.10/255.255.255.0）',
    );
    await expect(page.locator('#cidr-result')).toBeHidden();
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/cidr-calculator/');

    await page.locator('#cidr-copy-button').click();

    await expect(page.locator('#cidr-status')).toHaveText('コピーしました');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toContain('ネットワークアドレス: 192.168.1.0');
    expect(clipboardText).toContain('ブロードキャストアドレス: 192.168.1.255');
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    await page
      .locator('#sidebar details[data-category="開発"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'CIDR/サブネット計算機' })
      .click();

    await expect(page).toHaveURL(/\/tools\/cidr-calculator\/?$/);
    await expect(page.locator('main h1')).toHaveText('CIDR/サブネット計算機');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/cidr-calculator/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('CIDR / Subnet Calculator (English)', () => {
  test('英語版が正しく表示され、デフォルト値の計算結果が表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/cidr-calculator/');

    await expect(page.locator('main h1')).toHaveText(
      'CIDR / Subnet Calculator',
    );
    await expect(page.locator('#cidr-input')).toHaveValue('192.168.1.10/24');
    await expect(page.locator('#cidr-network-address')).toHaveText(
      '192.168.1.0',
    );
    await expect(page.locator('#cidr-broadcast-address')).toHaveText(
      '192.168.1.255',
    );
    await expect(page.locator('#cidr-usable-host-count')).toHaveText('254');
    await expect(page.locator('#cidr-error')).toBeEmpty();
  });

  test('入力を変更すると結果が連動更新される', async ({ page }) => {
    await page.goto('/en/tools/cidr-calculator/');

    await page.locator('#cidr-input').fill('10.0.0.4/31');

    await expect(page.locator('#cidr-network-address')).toHaveText('10.0.0.4');
    await expect(page.locator('#cidr-broadcast-address')).toHaveText(
      '10.0.0.5',
    );
    await expect(page.locator('#cidr-first-host')).toHaveText('10.0.0.4');
    await expect(page.locator('#cidr-last-host')).toHaveText('10.0.0.5');
    await expect(page.locator('#cidr-usable-host-count')).toHaveText('2');
    await expect(page.locator('#cidr-total-address-count')).toHaveText('2');
  });

  test('不正な入力でエラーメッセージが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/cidr-calculator/');

    await page.locator('#cidr-input').fill('not-an-ip/24');

    await expect(page.locator('#cidr-error')).toHaveText(
      'Invalid format (e.g. 192.168.1.10/24 or 192.168.1.10/255.255.255.0)',
    );
    await expect(page.locator('#cidr-result')).toBeHidden();
  });

  test('コピーボタンで結果をクリップボードにコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/cidr-calculator/');

    await page.locator('#cidr-copy-button').click();

    await expect(page.locator('#cidr-status')).toHaveText('Copied');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toContain('Network address: 192.168.1.0');
  });

  test('サイドバーからツールページへ遷移できる', async ({ page }) => {
    await page.goto('/en/');

    await page
      .locator('#sidebar details[data-category="Development"] summary')
      .click();
    await page
      .locator('#sidebar')
      .getByRole('link', { name: 'CIDR / Subnet Calculator' })
      .click();

    await expect(page).toHaveURL(/\/en\/tools\/cidr-calculator\/?$/);
    await expect(page.locator('main h1')).toHaveText(
      'CIDR / Subnet Calculator',
    );
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/tools/cidr-calculator/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
