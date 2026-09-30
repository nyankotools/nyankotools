import { test, expect } from '@playwright/test';

test('文字数カウントツールでテキストを入力すると結果が更新される', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  await expect(page.locator('main h1')).toHaveText('文字数カウント');

  const input = page.locator('#char-counter-input');
  await input.fill('hello world\nsecond line');

  await expect(page.locator('#char-counter-characters')).toHaveText('23');
  await expect(page.locator('#char-counter-words')).toHaveText('4');
  await expect(page.locator('#char-counter-lines')).toHaveText('2');
});

test('フッターに公式Xアカウントへのリンクが表示される（日本語版）', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const footerXLink = page.locator('footer a', { hasText: '公式X' });
  await expect(footerXLink).toHaveAttribute(
    'href',
    'https://x.com/nyankotools',
  );
  await expect(footerXLink).toHaveAttribute('target', '_blank');
  await expect(footerXLink).toHaveAttribute('rel', 'noopener noreferrer');
});

test('フッターに公式Xアカウントへのリンクが表示される（英語版）', async ({
  page,
}) => {
  await page.goto('/en/tools/char-counter/');

  const footerXLink = page.locator('footer a', { hasText: 'Official X' });
  await expect(footerXLink).toHaveAttribute(
    'href',
    'https://x.com/nyankotools',
  );
  await expect(footerXLink).toHaveAttribute('target', '_blank');
  await expect(footerXLink).toHaveAttribute('rel', 'noopener noreferrer');
});

test('Xシェアボタンのリンクに公式アカウント紐付け・ハッシュタグのパラメータが含まれる', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const xShareLink = page.locator('[data-share-popup]', { hasText: 'X' });
  const href = await xShareLink.getAttribute('href');

  expect(href).toContain('https://x.com/intent/tweet?');
  expect(href).toContain('via=nyankotools');
  expect(href).toContain('hashtags=NyankoTools');
});

test('関連ツールセクションに他ツールへのリンクが表示され、遷移できる', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const relatedHeading = page.getByRole('heading', {
    level: 2,
    name: '関連ツール',
  });
  await expect(relatedHeading).toBeVisible();

  const relatedLinks = [
    { href: '/tools/zenkaku-hankaku/', name: '全角/半角変換' },
    { href: '/tools/line-ending-converter/', name: '改行コード変換' },
    {
      href: '/tools/text-list-tools/',
      name: '文字列の重複削除・ソート・シャッフル',
    },
    { href: '/tools/json-formatter/', name: 'JSON整形' },
    { href: '/tools/markdown-preview/', name: 'Markdown⇔HTML変換' },
    { href: '/tools/lorem-ipsum/', name: 'ダミーテキスト生成' },
    { href: '/tools/qr-generator/', name: 'QRコード生成' },
    { href: '/tools/unix-timestamp/', name: 'Unixタイムスタンプ変換' },
  ];

  // 導線文にも同名リンクがあるため、関連ツールのリスト内に範囲を絞る
  const relatedList = page.locator('main ul').filter({
    has: page.getByRole('link', { name: '全角/半角変換', exact: true }),
  });

  for (const { href, name } of relatedLinks) {
    await expect(
      relatedList.getByRole('link', { name, exact: true }),
    ).toHaveAttribute('href', href);
  }

  await relatedList
    .getByRole('link', { name: '全角/半角変換', exact: true })
    .click();

  await expect(page).toHaveURL(/\/tools\/zenkaku-hankaku\/?$/);
  await expect(page.locator('main h1')).toHaveText('全角/半角変換');
});
