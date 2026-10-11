import { test, expect, type Page } from './helpers/test';

/**
 * ブラウザのCanvas APIでテスト用PNGを生成し、Bufferとして返す。
 * - half: 左半分が黒・右半分が白
 * - transparent: すべて透過（alpha=0）
 */
async function createPng(
  page: Page,
  width: number,
  height: number,
  mode: 'half' | 'transparent' = 'half',
): Promise<Buffer> {
  const dataUrl = await page.evaluate(
    ({ w, h, m }) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      if (m === 'half') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w / 2, h);
      }
      return canvas.toDataURL('image/png');
    },
    { w: width, h: height, m: mode },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

/** 1×1 の GIF（Base64）。GIF入力が受け付けられ、変換できることを確認する */
const GIF_1X1 = Buffer.from(
  'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64',
);

async function uploadPng(page: Page, buffer: Buffer, name = 'test.png') {
  await page
    .locator('#aa-file-input')
    .setInputFiles({ name, mimeType: 'image/png', buffer });
}

test('画像→ASCIIアート変換（日本語）が正しく表示される', async ({ page }) => {
  await page.goto('/tools/image-ascii-art/');
  await expect(page.locator('main h1')).toHaveText(
    '画像→ASCIIアート変換ツール',
  );
  await expect(page.locator('#aa-dropzone')).toBeVisible();
  await expect(page.locator('#aa-results-section')).toBeHidden();
  // 画像未選択時は「横の文字数」の既定値だけが表示される
  await expect(page.locator('#aa-columns-value')).toHaveText('80文字');
});

test('画像→ASCIIアート変換（英語）が正しく表示される', async ({ page }) => {
  await page.goto('/en/tools/image-ascii-art/');
  await expect(page.locator('main h1')).toHaveText(
    'Image to ASCII Art Converter',
  );
});

test('画像を選択するとASCIIアートが表示され、明暗反転で文字が入れ替わる', async ({
  page,
}) => {
  await page.goto('/tools/image-ascii-art/');
  await uploadPng(page, await createPng(page, 200, 100));

  await expect(page.locator('#aa-source-info')).toContainText('200×100px');
  await expect(page.locator('#aa-results-section')).toBeVisible();

  await page.locator('#aa-charset').selectOption('mono');
  const output = page.locator('#aa-output');
  const normal = (await output.textContent()) ?? '';
  const lines = normal.split('\n');
  // 80文字×(100/200*80*0.5=20)行。左半分が黒（#）、右半分が白（空白）
  expect(lines).toHaveLength(20);
  expect(lines[0]).toHaveLength(80);
  expect(lines[0].startsWith('#')).toBe(true);
  expect(lines[0].endsWith(' ')).toBe(true);

  await page.locator('#aa-invert').check();
  const inverted = (await output.textContent()) ?? '';
  expect(inverted.split('\n')[0].startsWith(' ')).toBe(true);
  expect(inverted.split('\n')[0].endsWith('#')).toBe(true);
});

test('横の文字数を変更すると行の長さと表示値が変わる', async ({ page }) => {
  await page.goto('/tools/image-ascii-art/');
  await uploadPng(page, await createPng(page, 200, 100));
  await expect(page.locator('#aa-results-section')).toBeVisible();

  await page.locator('#aa-columns').fill('40');
  await expect(page.locator('#aa-columns-value')).toContainText('40文字');
  await expect
    .poll(async () => {
      const text = (await page.locator('#aa-output').textContent()) ?? '';
      return text.split('\n')[0].length;
    })
    .toBe(40);
});

test('透過PNGは白背景として扱われ、標準の文字セットでは空白だけになる', async ({
  page,
}) => {
  await page.goto('/tools/image-ascii-art/');
  await uploadPng(page, await createPng(page, 100, 100, 'transparent'));
  await expect(page.locator('#aa-results-section')).toBeVisible();

  const text = (await page.locator('#aa-output').textContent()) ?? '';
  expect(text.length).toBeGreaterThan(0);
  expect(text.replace(/\s/g, '')).toBe('');
});

test('GIF画像も受け付けて変換できる', async ({ page }) => {
  await page.goto('/tools/image-ascii-art/');
  await page.locator('#aa-file-input').setInputFiles({
    name: 'anim.gif',
    mimeType: 'image/gif',
    buffer: GIF_1X1,
  });
  await expect(page.locator('#aa-results-section')).toBeVisible();
  await expect(page.locator('#aa-source-info')).toContainText('1×1px');
  // 1×1 の元画像は 横80文字×(1/1*80*0.5=40)行
  const lines = ((await page.locator('#aa-output').textContent()) ?? '').split(
    '\n',
  );
  expect(lines).toHaveLength(40);
  expect(lines[0]).toHaveLength(80);
});

test('極端に縦長の画像は行数が上限（1000行）で止まる', async ({ page }) => {
  await page.goto('/tools/image-ascii-art/');
  await uploadPng(page, await createPng(page, 1, 1000));
  await expect(page.locator('#aa-results-section')).toBeVisible();

  await page.locator('#aa-columns').fill('10');
  await expect(page.locator('#aa-columns-value')).toHaveText('10文字 × 1000行');
  // 結果の再描画はスライダー操作から100msのデバウンス後に行われるため、ポーリングで待つ
  await expect
    .poll(async () => {
      const text = (await page.locator('#aa-output').textContent()) ?? '';
      const lines = text.split('\n');
      return [lines.length, lines[0].length];
    })
    .toEqual([1000, 10]);
});

test('極端に横長の画像でも1行にまとまる', async ({ page }) => {
  await page.goto('/tools/image-ascii-art/');
  await uploadPng(page, await createPng(page, 2000, 10));
  await expect(page.locator('#aa-results-section')).toBeVisible();

  const lines = ((await page.locator('#aa-output').textContent()) ?? '').split(
    '\n',
  );
  expect(lines).toHaveLength(1);
  expect(lines[0]).toHaveLength(80);
});

test('2枚連続で選ぶと、後から選んだ画像の結果だけが残る', async ({ page }) => {
  await page.goto('/tools/image-ascii-art/');
  const first = await createPng(page, 200, 100);
  const second = await createPng(page, 100, 300);
  // 1枚目の読み込みを待たずに2枚目を選ぶ
  await uploadPng(page, first, 'first.png');
  await uploadPng(page, second, 'second.png');

  await expect(page.locator('#aa-source-info')).toContainText('100×300px');
  await expect(page.locator('#aa-results-section')).toBeVisible();
  // 2枚目の 80文字×(300/100*80*0.5=120)行
  await expect
    .poll(async () => {
      const text = (await page.locator('#aa-output').textContent()) ?? '';
      return text.split('\n').length;
    })
    .toBe(120);
});

test('上限（25MB）を超えるファイルはエラーになり、結果は表示されない', async ({
  page,
}) => {
  await page.goto('/tools/image-ascii-art/');
  await uploadPng(page, Buffer.alloc(26 * 1024 * 1024, 0));
  await expect(page.locator('#aa-error')).toBeVisible();
  await expect(page.locator('#aa-error')).toContainText('25.0 MB');
  await expect(page.locator('#aa-results-section')).toBeHidden();
});

test('ダウンロードで .txt が保存され、クリアで結果が消える', async ({
  page,
}) => {
  await page.goto('/tools/image-ascii-art/');
  await uploadPng(page, await createPng(page, 100, 100), 'photo.png');
  await expect(page.locator('#aa-results-section')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#aa-download-button').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('photo.txt');

  await page.locator('#aa-clear-button').click();
  await expect(page.locator('#aa-results-section')).toBeHidden();
});

test('コピーボタンで変換結果がクリップボードに入る', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tools/image-ascii-art/');
  await uploadPng(page, await createPng(page, 200, 100));
  await expect(page.locator('#aa-results-section')).toBeVisible();

  await page.locator('#aa-copy-button').click();
  await expect(page.locator('#aa-copy-status')).toHaveText('コピーしました');
  const output = (await page.locator('#aa-output').textContent()) ?? '';
  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  // Windowsのクリップボードは改行をCRLFに変換するため、LFに正規化して比較する
  expect(clipboardText.replace(/\r\n/g, '\n')).toBe(output);
});

test('ダークモードでも結果の表示領域が見える', async ({ page }) => {
  await page.goto('/tools/image-ascii-art/');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await uploadPng(page, await createPng(page, 200, 100));
  await expect(page.locator('#aa-output')).toBeVisible();
  // 出力欄は白い紙の見た目で固定されており、暗いテーマでも文字色と背景色のコントラストが保たれる
  const bg = await page
    .locator('#aa-output')
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe('rgb(255, 255, 255)');
});

test('画像以外のファイルはエラーになる', async ({ page }) => {
  await page.goto('/tools/image-ascii-art/');
  await page.locator('#aa-file-input').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello'),
  });
  await expect(page.locator('#aa-error')).toBeVisible();
  await expect(page.locator('#aa-results-section')).toBeHidden();
});
