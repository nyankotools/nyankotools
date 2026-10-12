import { test, expect, type Page } from './helpers/test';
import { deflateSync } from 'node:zlib';

const PAGES = {
  ja: '/tools/picross/',
  en: '/en/tools/picross/',
} as const;

/** 唯一解になる 5×5 の絵（'#' が黒） */
const UNIQUE_5 = ['#.#.#', '.###.', '##.##', '.#.#.', '#...#'];
/** 斜めの2マスだけの 5×5 は解が2通り */
const MULTIPLE_5 = ['#....', '.#...', '.....', '.....', '.....'];

// --- PNG を Buffer で組み立てる（テスト用画像。外部ファイルに依存しない） ---
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
/** dark(x, y) が true の画素を黒（0,0,0）、それ以外を白にした RGB の PNG */
function makePng(
  w: number,
  h: number,
  dark: (x: number, y: number) => boolean,
) {
  const raw = Buffer.alloc(h * (1 + w * 3));
  for (let y = 0; y < h; y++) {
    const rowStart = y * (1 + w * 3);
    for (let x = 0; x < w; x++) {
      const v = dark(x, y) ? 0 : 255;
      raw[rowStart + 1 + x * 3] = v;
      raw[rowStart + 2 + x * 3] = v;
      raw[rowStart + 3 + x * 3] = v;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

/** 絵の各行（列）の黒マスの連続数の最大個数（ヒント欄の深さ）。描画計算と同じ規則 */
function runCount(line: string[]): number {
  const runs = line
    .join('')
    .split('.')
    .filter((s) => s.length > 0);
  return Math.max(1, runs.length);
}
function clueDepths(picture: string[]) {
  const size = picture.length;
  const rowDepth = Math.max(...picture.map((r) => runCount([...r])));
  const colDepth = Math.max(
    ...Array.from({ length: size }, (_, x) =>
      runCount(picture.map((r) => r[x])),
    ),
  );
  return { rowDepth, colDepth };
}

/**
 * 盤面のセル (x, y) の中心のページ座標を求める。
 * 作るモード: 盤面は左上に 2px の余白のみ。遊ぶモード: 左と上にヒント欄の分だけ余白がある。
 * canvas の内部サイズ（width/height）から描画計算を逆算する。
 */
async function cellPoint(
  page: Page,
  x: number,
  y: number,
  layout: 'draft' | { rowDepth: number; colDepth: number },
  size: number,
) {
  const canvas = page.locator('#pc-canvas');
  // 盤面が表示域の外だとクリックが届かないので、先にスクロールする
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  const dims = await canvas.evaluate((c: HTMLCanvasElement) => [
    c.width,
    c.height,
  ]);
  if (!box) throw new Error('canvas not found');
  const [W, H] = dims;
  let cx: number;
  let cy: number;
  let ox: number;
  let oy: number;
  if (layout === 'draft') {
    cx = (W - 4) / size;
    cy = (H - 4) / size;
    ox = 2;
    oy = 2;
  } else {
    cx = (W - 4) / (size + layout.rowDepth);
    cy = (H - 4) / (size + layout.colDepth);
    ox = layout.rowDepth * cx + 2;
    oy = layout.colDepth * cy + 2;
  }
  const px = ox + (x + 0.5) * cx;
  const py = oy + (y + 0.5) * cy;
  return { x: box.x + (px / W) * box.width, y: box.y + (py / H) * box.height };
}

/** 作るモードで絵（'#' が黒）を描く。既存の黒は触らない前提（描画は白からの反転） */
async function drawDraft(page: Page, picture: string[]) {
  const size = picture.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (picture[y][x] !== '#') continue;
      const p = await cellPoint(page, x, y, 'draft', size);
      await page.mouse.click(p.x, p.y);
    }
  }
}

/** 遊ぶ盤面で、指定マスをクリック（button: 'left' で塗る、'right' で×印） */
async function clickPlay(
  page: Page,
  picture: string[],
  cells: [number, number][],
  button: 'left' | 'right' = 'left',
) {
  const size = picture.length;
  const layout = clueDepths(picture);
  for (const [x, y] of cells) {
    const p = await cellPoint(page, x, y, layout, size);
    await page.mouse.click(p.x, p.y, { button });
  }
}

const blackCells = (picture: string[]) => {
  const out: [number, number][] = [];
  picture.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === '#') out.push([x, y]);
    }),
  );
  return out;
};
const whiteCells = (picture: string[]) => {
  const out: [number, number][] = [];
  picture.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '#') out.push([x, y]);
    }),
  );
  return out;
};

const status = (page: Page) => page.locator('#pc-status').innerText();

/** data-* に入った文言（{size} などを置換）を取る */
async function rootText(page: Page, attr: string) {
  return (await page.locator('#pc-root').getAttribute(attr)) ?? '';
}

for (const locale of ['ja', 'en'] as const) {
  test.describe(`お絵かきロジック (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#pc-canvas')).toBeVisible();
    });

    test('初期状態は遊ぶモード・10×10で、ステータスは空', async ({ page }) => {
      await expect(page.locator('[data-mode="play"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.locator('[data-size="10"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(await status(page)).toBe('');
      const label = (await rootText(page, 'data-play-board-label')).replaceAll(
        '{size}',
        '10',
      );
      await expect(page.locator('#pc-canvas')).toHaveAttribute(
        'aria-label',
        label,
      );
    });

    test('盤面サイズを変えると盤面が作り直され、aria-label に反映される', async ({
      page,
    }) => {
      for (const size of [5, 15]) {
        await page.locator(`[data-size="${size}"]`).click();
        await expect(page.locator(`[data-size="${size}"]`)).toHaveAttribute(
          'aria-pressed',
          'true',
        );
        const label = (
          await rootText(page, 'data-play-board-label')
        ).replaceAll('{size}', String(size));
        await expect(page.locator('#pc-canvas')).toHaveAttribute(
          'aria-label',
          label,
        );
        expect(await status(page)).toBe('');
      }
    });

    test('作るモードに切り替えると作成用の操作が出て、遊ぶ用の操作は隠れる', async ({
      page,
    }) => {
      await expect(page.locator('#pc-make-button')).toBeHidden();
      await page.locator('[data-mode="create"]').click();
      await expect(page.locator('#pc-make-button')).toBeVisible();
      await expect(page.locator('#pc-file-input')).toBeAttached();
      await expect(page.locator('#pc-new-button')).toBeHidden();
      await page.locator('[data-mode="play"]').click();
      await expect(page.locator('#pc-new-button')).toBeVisible();
      await expect(page.locator('#pc-make-button')).toBeHidden();
    });

    test('作るモードで絵が空だと「黒マスがない」と表示され、この絵で遊ぶは無効', async ({
      page,
    }) => {
      await page.locator('[data-mode="create"]').click();
      await expect(page.locator('#pc-status')).toHaveText(
        await rootText(page, 'data-unique-empty'),
      );
      await expect(page.locator('#pc-make-button')).toBeDisabled();
    });

    test('作るモードの判定が唯一解・複数解で切り替わる（5×5）', async ({
      page,
    }) => {
      await page.locator('[data-size="5"]').click();
      await page.locator('[data-mode="create"]').click();
      await drawDraft(page, UNIQUE_5);
      await expect(page.locator('#pc-status')).toHaveText(
        await rootText(page, 'data-unique-ok'),
      );
      await expect(page.locator('#pc-make-button')).toBeEnabled();
      // 斜めの2マスは解が2通り
      await page.locator('#pc-clear-button').click();
      await drawDraft(page, MULTIPLE_5);
      await expect(page.locator('#pc-status')).toHaveText(
        await rootText(page, 'data-unique-multiple'),
      );
    });

    test('作った絵を「この絵で遊ぶ」で問題にし、正解を塗ると完成メッセージが出る', async ({
      page,
    }) => {
      await page.locator('[data-size="5"]').click();
      await page.locator('[data-mode="create"]').click();
      await drawDraft(page, UNIQUE_5);
      await page.locator('#pc-make-button').click();
      await expect(page.locator('[data-mode="play"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(await status(page)).toBe('');

      const cells = blackCells(UNIQUE_5);
      // 最後の1マス以外を塗った時点では完成しない
      await clickPlay(page, UNIQUE_5, cells.slice(0, -1));
      expect(await status(page)).toBe('');
      await clickPlay(page, UNIQUE_5, cells.slice(-1));
      await expect(page.locator('#pc-status')).toHaveText(
        await rootText(page, 'data-solved'),
      );
    });

    test('×印は黒として数えない（黒を×にすると完成せず、塗り直すと完成する）', async ({
      page,
    }) => {
      await page.locator('[data-size="5"]').click();
      await page.locator('[data-mode="create"]').click();
      await drawDraft(page, UNIQUE_5);
      await page.locator('#pc-make-button').click();

      const cells = blackCells(UNIQUE_5);
      const last = cells[cells.length - 1];
      // 白マスに×印を付けても完成しない（黒がまだ足りない）
      await clickPlay(page, UNIQUE_5, whiteCells(UNIQUE_5), 'right');
      await clickPlay(page, UNIQUE_5, cells.slice(0, -1));
      // 最後の黒マスを×印にする → 黒が足りないので完成しない
      await clickPlay(page, UNIQUE_5, [last], 'right');
      expect(await status(page)).toBe('');
      // 同じマスを左クリックで塗ると完成する
      await clickPlay(page, UNIQUE_5, [last]);
      await expect(page.locator('#pc-status')).toHaveText(
        await rootText(page, 'data-solved'),
      );
    });

    test('塗り方を「×印」にすると左クリックでも×印になる', async ({ page }) => {
      await page.locator('[data-size="5"]').click();
      await page.locator('[data-tool="mark"]').click();
      await expect(page.locator('[data-tool="mark"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await clickPlay(page, UNIQUE_5, whiteCells(UNIQUE_5));
      expect(await status(page)).toBe('');
    });

    test('答えを見るで完成扱いになり、リセットでクリアされる', async ({
      page,
    }) => {
      await page.locator('#pc-solution-button').click();
      await expect(page.locator('#pc-status')).toHaveText(
        await rootText(page, 'data-solution-shown'),
      );
      await page.locator('#pc-reset-button').click();
      expect(await status(page)).toBe('');
    });

    test('画像を読み込むと、暗い部分が黒マスになり唯一解と判定される', async ({
      page,
    }) => {
      await page.locator('[data-mode="create"]').click();
      // 10×10（既定）。左半分だけ黒い PNG
      const png = makePng(10, 10, (x) => x < 5);
      await page.locator('#pc-file-input').setInputFiles({
        name: 'half.png',
        mimeType: 'image/png',
        buffer: png,
      });
      await expect(page.locator('#pc-status')).toHaveText(
        await rootText(page, 'data-unique-ok'),
      );
      const label = (await rootText(page, 'data-draft-board-label'))
        .replaceAll('{size}', '10')
        .replace('{filled}', '50');
      await expect(page.locator('#pc-canvas')).toHaveAttribute(
        'aria-label',
        label,
      );
      await expect(page.locator('#pc-make-button')).toBeEnabled();
    });

    test('画像として読めないファイルは読み込み失敗を表示する', async ({
      page,
    }) => {
      await page.locator('[data-mode="create"]').click();
      await page.locator('#pc-file-input').setInputFiles({
        name: 'note.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('これは画像ではありません'),
      });
      await expect(page.locator('#pc-status')).toHaveText(
        await rootText(page, 'data-image-load-failed'),
      );
    });

    test('375px 幅でも盤面が画面内に収まる', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.locator('[data-size="15"]').click();
      const box = await page.locator('#pc-canvas').boundingBox();
      if (!box) throw new Error('canvas not found');
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(375);
    });
  });
}
