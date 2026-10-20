import { test, expect } from './helpers/test';

const HEADERS = [
  'Received: from mx.example.com (mx.example.com [203.0.113.5])',
  '        by mail.example.net with ESMTPS id abc;',
  '        Tue, 20 Oct 2026 10:10:30 +0900',
  'Received: from relay.sender.test (relay.sender.test [198.51.100.7])',
  '        by mx.example.com with SMTP id def;',
  '        Tue, 20 Oct 2026 10:00:00 +0900',
  'Authentication-Results: mx.example.com; spf=pass smtp.mailfrom=a.test; dkim=pass header.d=a.test; dmarc=pass header.from=a.test',
  'Return-Path: <x@a.test>',
  'From: A <a@a.test>',
  'Subject: =?UTF-8?B?44GT44KT44Gr44Gh44Gv?=',
  'Date: Tue, 20 Oct 2026 10:00:00 +0900',
  'Message-ID: <1@a.test>',
].join('\n');

test('メールヘッダー解析: 経路・遅延・認証結果・件名デコードが表示される', async ({
  page,
}) => {
  await page.goto('/tools/email-header-analyzer/');

  await page.locator('#eha-input').fill(HEADERS);
  await page.locator('#eha-analyze-button').click();

  await expect(page.locator('#eha-results')).toBeVisible();
  await expect(page.locator('#eha-summary')).toContainText('こんにちは');
  await expect(page.locator('#eha-hops')).toContainText('10m 30s');
  await expect(page.locator('#eha-auth')).toContainText('DMARC');
  await expect(page.locator('#eha-hops')).toContainText('198.51.100.7');
});

test('メールヘッダー解析: サンプルでなりすまし警告が出る', async ({ page }) => {
  await page.goto('/tools/email-header-analyzer/');

  await page.locator('#eha-sample-button').click();

  await expect(page.locator('#eha-warnings')).toContainText('DMARC');
  await expect(page.locator('#eha-warnings')).toContainText('Reply-To');
});

test('メールヘッダー解析: 空入力でエラーが表示される', async ({ page }) => {
  await page.goto('/tools/email-header-analyzer/');

  await page.locator('#eha-analyze-button').click();

  await expect(page.locator('#eha-error')).not.toHaveText('');
  await expect(page.locator('#eha-results')).toBeHidden();
});

test('メールヘッダー解析: クリアで入力と結果が消える', async ({ page }) => {
  await page.goto('/tools/email-header-analyzer/');

  await page.locator('#eha-sample-button').click();
  await page.locator('#eha-clear-button').click();

  await expect(page.locator('#eha-input')).toHaveValue('');
  await expect(page.locator('#eha-results')).toBeHidden();
});

test('メールヘッダー解析: 英語版で解析できる', async ({ page }) => {
  await page.goto('/en/tools/email-header-analyzer/');

  await page.locator('#eha-sample-button').click();

  await expect(page.locator('#eha-summary')).toContainText(
    'Please confirm your order',
  );
  await expect(page.locator('#eha-warnings')).toContainText('SPF softfail');
});
