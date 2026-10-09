import { test, expect } from './helpers/test';

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

test('Xの文字数が重み付き（全角2・半角1・URL23）で表示され、上限超過で表示が切り替わる', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const input = page.locator('#char-counter-input');
  await input.fill('あいう abc https://example.com/very/long/path');

  // 6 + 1 + 3 + 1 + 23
  await expect(page.locator('#char-counter-x-count')).toHaveText('34');
  await expect(page.locator('#char-counter-x-remaining')).toHaveText('246');

  await page.locator('#char-counter-x-limit').fill('30');
  await expect(page.locator('#char-counter-x-remaining')).toHaveText('4');
  await expect(page.locator('#char-counter-x-remaining-label')).toHaveText(
    '超過',
  );
});

test('英語版でもXの文字数が表示される', async ({ page }) => {
  await page.goto('/en/tools/char-counter/');

  await page.locator('#char-counter-input').fill('hello');
  await expect(page.locator('#char-counter-x-count')).toHaveText('5');
  await expect(page.locator('#char-counter-x-remaining')).toHaveText('275');
});

test('上限欄に不正な値（空・0・負・1e999）を入れても既定の280で計算される', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const input = page.locator('#char-counter-input');
  await input.fill('abc');
  const limit = page.locator('#char-counter-x-limit');
  const remaining = page.locator('#char-counter-x-remaining');

  for (const value of ['', '0', '-5', '1e999']) {
    await limit.fill(value);
    await expect(remaining).toHaveText('277');
    await expect(page.locator('#char-counter-x-remaining-label')).toHaveText(
      '残り',
    );
  }
});

test('英語版で上限を超えると「Over by」と超過分が表示される', async ({
  page,
}) => {
  await page.goto('/en/tools/char-counter/');

  await page.locator('#char-counter-input').fill('a'.repeat(281));
  await expect(page.locator('#char-counter-x-count')).toHaveText('281');
  await expect(page.locator('#char-counter-x-remaining')).toHaveText('1');
  await expect(page.locator('#char-counter-x-remaining-label')).toHaveText(
    'Over by',
  );
});

test('©と®は1文字として数えられる（Xの文字数）', async ({ page }) => {
  await page.goto('/tools/char-counter/');

  await page.locator('#char-counter-input').fill('©®');
  await expect(page.locator('#char-counter-x-count')).toHaveText('2');
});

test('アカウント選択で上限が280と25,000に切り替わり、上限欄の手入力で「上限を指定」になる', async ({
  page,
}) => {
  await page.goto('/tools/char-counter/');

  const plan = page.locator('#char-counter-x-plan');
  const limit = page.locator('#char-counter-x-limit');
  await page.locator('#char-counter-input').fill('あ'.repeat(200));

  await expect(limit).toHaveValue('280');
  await expect(page.locator('#char-counter-x-remaining-label')).toHaveText(
    '超過',
  );

  await plan.selectOption('25000');
  await expect(limit).toHaveValue('25000');
  await expect(page.locator('#char-counter-x-remaining')).toHaveText('24600');

  await limit.fill('100');
  await expect(plan).toHaveValue('custom');
});
