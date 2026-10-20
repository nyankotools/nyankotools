import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('SPF・DMARC生成: SPFレコードを組み立てられる', async ({ page }) => {
  await page.goto('/tools/dmarc-spf-generator/');

  await page.locator('#dsg-domain').fill('example.com');
  await page.locator('#dsg-spf-include').fill('_spf.google.com');
  await page.locator('#dsg-spf-ip4').fill('192.0.2.10');
  await page.locator('#dsg-spf-mx').check();
  await page.locator('#dsg-spf-all').selectOption('~all');

  await expect(page.locator('#dsg-record')).toHaveValue(
    'v=spf1 mx ip4:192.0.2.10 include:_spf.google.com ~all',
  );
  await expect(page.locator('#dsg-host')).toHaveText('example.com');
});

test('SPF・DMARC生成: DMARCレコードとホスト名が表示される', async ({
  page,
}) => {
  await page.goto('/tools/dmarc-spf-generator/');

  await page.locator('#dsg-mode [data-mode="dmarc"]').click();
  await page.locator('#dsg-domain').fill('Example.com');
  await page.locator('#dsg-dmarc-p').selectOption('quarantine');
  await page.locator('#dsg-dmarc-pct').fill('50');
  await page.locator('#dsg-dmarc-rua').fill('dmarc@example.com');

  await expect(page.locator('#dsg-record')).toHaveValue(
    'v=DMARC1; p=quarantine; pct=50; rua=mailto:dmarc@example.com',
  );
  await expect(page.locator('#dsg-host')).toHaveText('_dmarc.example.com');
});

test('SPF・DMARC生成: +all を選ぶと警告が出る', async ({ page }) => {
  await page.goto('/tools/dmarc-spf-generator/');

  await page.locator('#dsg-spf-all').selectOption('+all');

  await expect(page.locator('#dsg-build-issues li')).toHaveCount(1);
});

test('SPF・DMARC生成: 既存SPFレコードのルックアップ数と問題を表示する', async ({
  page,
}) => {
  await page.goto('/tools/dmarc-spf-generator/');

  await page
    .locator('#dsg-check-input')
    .fill('v=spf1 include:a.example.com ptr ?all');

  await expect(page.locator('#dsg-lookups')).toContainText('2 / 10');
  await expect(page.locator('#dsg-check-results')).toContainText('ptr');
});

test('SPF・DMARC生成: 既存DMARCレコードのpct誤りを検出する', async ({
  page,
}) => {
  await page.goto('/tools/dmarc-spf-generator/');

  await page.locator('#dsg-check-input').fill('v=DMARC1; p=reject; pct=150');

  await expect(page.locator('#dsg-check-results')).toContainText('pct');
  await expect(page.locator('#dsg-lookups')).toBeHidden();
});

test('SPF・DMARC生成: コピーボタンが機能する', async ({ page }) => {
  await page.goto('/tools/dmarc-spf-generator/');

  await page.locator('#dsg-copy-button').click();

  await expect(page.locator('#dsg-copy-status')).not.toHaveText('');
});

test('SPF・DMARC生成: 英語版でサンプルをチェックできる', async ({ page }) => {
  await page.goto('/en/tools/dmarc-spf-generator/');

  await page.locator('#dsg-sample-button').click();

  await expect(page.locator('#dsg-check-results')).toContainText('deprecated');
});

test.describe('SPF・DMARC生成（アクセシビリティ）', () => {
  test('初期表示でaxeのWCAG 2.1 A/AA違反がない', async ({ page }) => {
    await page.goto('/tools/dmarc-spf-generator/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
