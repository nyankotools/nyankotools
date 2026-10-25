import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

/** 0〜255 を繰り返す 10000 バイト。オフセット 0x1000 に目印の文字列を埋める */
function sample(): Buffer {
  const buf = Buffer.alloc(10000);
  for (let i = 0; i < buf.length; i++) buf[i] = i % 256;
  Buffer.from('NEEDLE').copy(buf, 0x1000);
  return buf;
}

const file = () => ({
  name: 'sample.bin',
  mimeType: 'application/octet-stream',
  buffer: sample(),
});

/** 表示領域（枠の内側）を描画行が隙間なく埋めているかを確認する（空白帯の検出） */
async function expectViewportFilled(page: import('@playwright/test').Page) {
  const gap = await page.locator('#hv-viewer').evaluate((viewer) => {
    const v = viewer.getBoundingClientRect();
    const c = viewer.querySelector('#hv-content')!.getBoundingClientRect();
    return {
      // 枠の上端からの描画の開始位置（上に空白があれば正の値になる）
      top: c.top - v.top,
      // 枠の上端からの描画の終端（下に空白があれば枠の高さより小さくなる）
      bottom: c.bottom - v.top,
      height: v.height,
    };
  });
  expect(gap.top, '上側に空白帯').toBeLessThanOrEqual(2);
  expect(gap.bottom, '下側に空白帯').toBeGreaterThanOrEqual(gap.height - 2);
}

test.describe('16進ダンプビューア（日本語版）', () => {
  test('ファイルを選ぶと先頭が16進とASCIIで表示される', async ({ page }) => {
    await page.goto('/tools/hex-viewer/');
    await expect(page.locator('main h1')).toHaveText(
      '16進ダンプビューア（バイナリビューア）',
    );
    await page.locator('#hv-file-input').setInputFiles(file());

    await expect(page.locator('#hv-info')).toContainText('sample.bin');
    const first = page.locator('#hv-content > div').first();
    await expect(first).toContainText('00000000  00 01 02 03 04 05 06 07');
    await expect(first).toContainText('|................|');
  });

  test('オフセットへ移動すると該当行が表示され強調される', async ({ page }) => {
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles(file());
    await page.locator('#hv-jump-input').fill('0x1000');
    await page.locator('#hv-jump-button').click();

    await expect(page.locator('#hv-message')).toContainText('0x00001000');
    await expect(page.locator('#hv-content')).toContainText('00001000');
    await expect(page.locator('#hv-content mark').first()).toBeVisible();
  });

  test('範囲外・不正なオフセットはエラーになる', async ({ page }) => {
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles(file());
    await page.locator('#hv-jump-input').fill('99999');
    await page.locator('#hv-jump-button').click();
    await expect(page.locator('#hv-message')).toContainText('範囲外');
    await page.locator('#hv-jump-input').fill('zz');
    await page.locator('#hv-jump-button').click();
    await expect(page.locator('#hv-message')).toContainText('10進数');
  });

  test('16進で検索して次・前へ移動できる', async ({ page }) => {
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles(file());
    // 0x10 0x11 0x12 は 256 バイトごとに現れる
    await page.locator('#hv-search-input').fill('10 11 12');
    await page.locator('#hv-next-button').click();
    await expect(page.locator('#hv-message')).toContainText('0x00000010');
    await page.locator('#hv-next-button').click();
    await expect(page.locator('#hv-message')).toContainText('0x00000110');
    await page.locator('#hv-prev-button').click();
    await expect(page.locator('#hv-message')).toContainText('0x00000010');
  });

  test('テキストで検索すると該当位置が強調される', async ({ page }) => {
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles(file());
    await page.locator('#hv-mode-text').check();
    await page.locator('#hv-search-input').fill('NEEDLE');
    await page.locator('#hv-next-button').click();
    await expect(page.locator('#hv-message')).toContainText('0x00001000');
    await expect(page.locator('#hv-content')).toContainText('NEEDLE');
  });

  test('見つからない場合と不正な16進入力のメッセージ', async ({ page }) => {
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles(file());
    await page.locator('#hv-search-input').fill('ABC');
    await page.locator('#hv-next-button').click();
    await expect(page.locator('#hv-message')).toContainText('奇数');
    await page.locator('#hv-search-input').fill('FF FF FF');
    await page.locator('#hv-next-button').click();
    await expect(page.locator('#hv-message')).toContainText(
      '見つかりませんでした',
    );
  });

  test('スクロールすると表示範囲が更新される', async ({ page }) => {
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles(file());
    await expect(page.locator('#hv-content > div').first()).toContainText(
      '00000000',
    );
    await page.locator('#hv-viewer').evaluate((el) => {
      el.scrollTop = 20 * 100;
    });
    await expect(page.locator('#hv-content > div').first()).toContainText(
      '00000640',
    );
  });

  test('375px幅でファイルを開いてもページ全体が横にはみ出さない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles(file());
    await expect(page.locator('#hv-content > div').first()).toBeVisible();
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('ファイル読み込み後の表示に axe の違反がない', async ({ page }) => {
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles(file());
    await expect(page.locator('#hv-content > div').first()).toBeVisible();
    const violations = (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations.map((v) => v.id);
    expect(violations).toEqual([]);
  });

  test('小さなファイルの末尾へオフセット移動しても空白帯が出ない', async ({
    page,
  }) => {
    // 3000 バイト（約188行）は縮小なしモード。末尾の行へ移動する
    const buf = Buffer.alloc(3000, 0x41);
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles({
      name: 'small.bin',
      mimeType: 'application/octet-stream',
      buffer: buf,
    });
    await page.locator('#hv-jump-input').fill('2999');
    await page.locator('#hv-jump-button').click();
    await expect(page.locator('#hv-message')).toContainText('0x00000BB7');
    await expect(page.locator('#hv-content')).toContainText('00000BB0');
    await expectViewportFilled(page);
  });

  test('小さなファイルで末尾付近のテキストを検索しても空白帯が出ない', async ({
    page,
  }) => {
    const buf = Buffer.alloc(3000, 0x2e);
    Buffer.from('TAILMARK').copy(buf, 2980);
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles({
      name: 'tail.bin',
      mimeType: 'application/octet-stream',
      buffer: buf,
    });
    await page.locator('#hv-mode-text').check();
    await page.locator('#hv-search-input').fill('TAILMARK');
    await page.locator('#hv-next-button').click();
    await expect(page.locator('#hv-message')).toContainText('0x00000BA4');
    await expect(page.locator('#hv-content mark').first()).toBeVisible();
    await expectViewportFilled(page);
  });

  test('巨大なファイル（縮小モード）の末尾へ移動しても空白帯が出ない', async ({
    page,
  }) => {
    // 約7MB（約46万行）はスペーサー高さが上限を超え、スクロール量が縮小される
    const size = 7 * 1024 * 1024;
    const buf = Buffer.alloc(size, 0x41);
    await page.goto('/tools/hex-viewer/');
    await page.locator('#hv-file-input').setInputFiles({
      name: 'large.bin',
      mimeType: 'application/octet-stream',
      buffer: buf,
    });
    await page.locator('#hv-jump-input').fill(String(size - 1));
    await page.locator('#hv-jump-button').click();
    await expect(page.locator('#hv-message')).toContainText('0x006FFFFF');
    await expect(page.locator('#hv-content')).toContainText('006FFFF0');
    await expectViewportFilled(page);
  });
});

test.describe('Hex Viewer (English)', () => {
  test('shows the dump and finds hex bytes', async ({ page }) => {
    await page.goto('/en/tools/hex-viewer/');
    await expect(page.locator('main h1')).toHaveText(
      'Hex Viewer (Binary File Dump)',
    );
    await page.locator('#hv-file-input').setInputFiles(file());
    await expect(page.locator('#hv-content > div').first()).toContainText(
      '00000000  00 01 02 03',
    );
    await page.locator('#hv-search-input').fill('0x4E,0x45,0x45');
    await page.locator('#hv-next-button').click();
    await expect(page.locator('#hv-message')).toContainText(
      'Found 3 bytes at offset 0x00001000.',
    );
  });
});
