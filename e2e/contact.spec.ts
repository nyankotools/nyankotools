import { test, expect } from '@playwright/test';
import type { CDPSession } from '@playwright/test';

/**
 * mailto: はカスタムスキームのためPlaywrightの通常のnavigationイベントでは
 * 検知できない。CDPの `Page.frameRequestedNavigation` はブラウザが
 * 外部プロトコルハンドラに委譲する前のナビゲーション要求そのものを
 * 捕捉できるため、これを使って実際に生成された mailto リンクの中身を検証する。
 */
async function captureMailtoNavigation(
  client: CDPSession,
  action: () => Promise<void>,
): Promise<string> {
  await client.send('Page.enable');
  const navPromise = new Promise<string>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('navigation timeout')),
      3000,
    );
    client.on('Page.frameRequestedNavigation', (params) => {
      clearTimeout(timer);
      resolve(params.url as string);
    });
  });
  await action();
  return navPromise;
}

test.describe('お問い合わせページ（日本語版）', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/contact/');

    await expect(page.locator('main h1')).toHaveText('お問い合わせ');
    await expect(page).toHaveTitle('お問い合わせ | にゃんこツール');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /お問い合わせ/,
    );
  });

  test('h1は1つだけ存在する', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('お名前欄でEnterキーを押してもページがリロードされず入力内容が消えない', async ({
    page,
  }) => {
    await page.goto('/contact/');

    await page.locator('#contact-message').fill('消えたら困る本文');
    await page.locator('#contact-name').fill('にゃんこ太郎');
    await page.locator('#contact-name').press('Enter');

    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page.locator('#contact-message')).toHaveValue(
      '消えたら困る本文',
    );
    await expect(page.locator('#contact-name')).toHaveValue('にゃんこ太郎');
  });

  test('未入力で送信しようとするとエラーメッセージが赤色で表示される', async ({
    page,
  }) => {
    await page.goto('/contact/');

    await page.locator('#contact-mailto').click();

    const status = page.locator('#contact-status');
    await expect(status).toHaveText('お問い合わせ内容を入力してください');
    await expect(status).toHaveClass(/text-red-600/);
    await expect(page.locator('#contact-message')).toBeFocused();
  });

  test('種別・お名前・本文を入力して送信すると内容を反映したmailtoリンクが生成される', async ({
    page,
    context,
  }) => {
    await page.goto('/contact/');
    const client = await context.newCDPSession(page);

    await page
      .locator('#contact-category')
      .selectOption('ツールについての質問');
    await page.locator('#contact-name').fill('にゃんこ太郎');
    await page
      .locator('#contact-message')
      .fill('文字数カウントツールの動作について質問です。');

    const url = await captureMailtoNavigation(client, () =>
      page.locator('#contact-mailto').click(),
    );

    expect(url.startsWith('mailto:nyankotools@gmail.com?')).toBe(true);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain(
      'subject=【にゃんこツールお問い合わせ】ツールについての質問',
    );
    expect(decoded).toContain('種別: ツールについての質問');
    expect(decoded).toContain('お名前: にゃんこ太郎');
    expect(decoded).toContain('文字数カウントツールの動作について質問です。');
  });

  test('お名前を入力しない場合はmailto本文にお名前行が含まれない', async ({
    page,
    context,
  }) => {
    await page.goto('/contact/');
    const client = await context.newCDPSession(page);

    await page.locator('#contact-message').fill('不具合の報告です。');

    const url = await captureMailtoNavigation(client, () =>
      page.locator('#contact-mailto').click(),
    );

    const decoded = decodeURIComponent(url);
    expect(decoded).not.toContain('お名前:');
  });

  test('「本文をコピー」でクリップボードに本文がコピーされ成功メッセージが緑色で表示される', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();
    await page.goto('/contact/');

    await page.locator('#contact-category').selectOption('ご要望');
    await page.locator('#contact-message').fill('新しいツールが欲しいです。');
    await page.locator('#contact-copy').click();

    const status = page.locator('#contact-status');
    await expect(status).toHaveText('コピーしました');
    await expect(status).toHaveClass(/text-green-600/);

    // OSのクリップボード実装（特にWindows）はテキスト書き込み時に改行コードを
    // CRLFへ正規化することがあるため、比較前にLFへ正規化して環境差を吸収する。
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe(
      '種別: ご要望\n\n新しいツールが欲しいです。',
    );

    await context.close();
  });

  test('「コピー」ボタンでメールアドレスがクリップボードにコピーされる', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();
    await page.goto('/contact/');

    await page.locator('#contact-email-copy').click();

    const status = page.locator('#contact-status');
    await expect(status).toHaveText('メールアドレスをコピーしました');
    await expect(status).toHaveClass(/text-green-600/);

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('nyankotools@gmail.com');

    await context.close();
  });

  test('フッターの「お問い合わせ」リンクから遷移できる', async ({ page }) => {
    await page.goto('/tools/char-counter/');

    await page.locator('footer a', { hasText: 'お問い合わせ' }).click();

    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page.locator('main h1')).toHaveText('お問い合わせ');
  });

  test('言語切り替えで英語版に遷移できる', async ({ page }) => {
    await page.goto('/contact/');

    await page.locator('#sidebar a[hreflang="en"]').click();

    await expect(page).toHaveURL(/\/en\/contact\/?$/);
    await expect(page.locator('main h1')).toHaveText('Contact');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/contact/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});

test.describe('Contact page (English)', () => {
  test('直接アクセスして正しく表示される', async ({ page }) => {
    await page.goto('/en/contact/');

    await expect(page.locator('main h1')).toHaveText('Contact');
    await expect(page).toHaveTitle('Contact | NyankoTools');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /contact/i,
    );
  });

  test('種別・本文を入力して送信すると内容を反映したmailtoリンクが生成される', async ({
    page,
    context,
  }) => {
    await page.goto('/en/contact/');
    const client = await context.newCDPSession(page);

    await page.locator('#contact-category').selectOption('Bug report');
    await page
      .locator('#contact-message')
      .fill('The download button does not work.');

    const url = await captureMailtoNavigation(client, () =>
      page.locator('#contact-mailto').click(),
    );

    expect(url.startsWith('mailto:nyankotools@gmail.com?')).toBe(true);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('subject=[NyankoTools Contact] Bug report');
    expect(decoded).toContain('Category: Bug report');
    expect(decoded).toContain('The download button does not work.');
  });

  test('未入力で送信しようとするとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/en/contact/');

    await page.locator('#contact-mailto').click();

    const status = page.locator('#contact-status');
    await expect(status).toHaveText('Please enter a message');
    await expect(status).toHaveClass(/text-red-600/);
  });

  test('フッターの「Contact」リンクから遷移できる', async ({ page }) => {
    await page.goto('/en/tools/char-counter/');

    await page.locator('footer a', { hasText: 'Contact' }).click();

    await expect(page).toHaveURL(/\/en\/contact\/?$/);
    await expect(page.locator('main h1')).toHaveText('Contact');
  });

  test('言語切り替えで日本語版に遷移できる', async ({ page }) => {
    await page.goto('/en/contact/');

    await page.locator('#sidebar a[hreflang="ja"]').click();

    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page.locator('main h1')).toHaveText('お問い合わせ');
  });

  test('375px幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/contact/');

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
});
