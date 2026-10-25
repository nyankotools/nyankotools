import { describe, expect, it } from 'vitest';
import {
  MAX_SPACER_HEIGHT,
  byteToAscii,
  contentTop,
  encodeTextPattern,
  findInBytes,
  findLastInBytes,
  formatFileSize,
  formatOffset,
  formatRow,
  parseHexPattern,
  parseOffset,
  rowFromScroll,
  scrollFromRow,
  searchBackward,
  searchForward,
  spacerHeight,
  totalRows,
  type ReadRange,
} from './hex-viewer';

const bytes = (...v: number[]) => new Uint8Array(v);
const reader =
  (data: Uint8Array): ReadRange =>
  async (s, e) =>
    data.slice(s, e);

describe('表示整形', () => {
  it('オフセットを8桁16進にする', () => {
    expect(formatOffset(0)).toBe('00000000');
    expect(formatOffset(255)).toBe('000000FF');
    expect(formatOffset(0x123456789)).toBe('123456789');
  });

  it('表示できないバイトはドットにする', () => {
    expect(byteToAscii(0x41)).toBe('A');
    expect(byteToAscii(0x20)).toBe(' ');
    expect(byteToAscii(0x7f)).toBe('.');
    expect(byteToAscii(0x00)).toBe('.');
  });

  it('1行を16進部とASCII部にする', () => {
    const row = formatRow(bytes(0x48, 0x69, 0x00));
    expect(row.ascii).toBe('Hi.');
    expect(row.hex.startsWith('48 69 00 ')).toBe(true);
    // 16バイト分 (3文字x16) + 中央の区切り1文字
    expect(row.hex.length).toBe(49);
  });

  it('ファイルサイズを読みやすくする', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('行数は端数を切り上げる', () => {
    expect(totalRows(0)).toBe(0);
    expect(totalRows(16)).toBe(1);
    expect(totalRows(17)).toBe(2);
  });
});

describe('仮想スクロール', () => {
  const small = { rows: 1000, rowHeight: 20, viewportHeight: 400 };
  const huge = { rows: 100_000_000, rowHeight: 20, viewportHeight: 400 };

  it('小さいファイルでは行高さで素直に対応する', () => {
    expect(spacerHeight(small)).toBe(20000);
    expect(rowFromScroll(0, small)).toBe(0);
    expect(rowFromScroll(205, small)).toBe(10);
    expect(scrollFromRow(10, small)).toBe(200);
    expect(contentTop(205, 10, small)).toBe(200);
  });

  it('範囲外のスクロール位置を丸める', () => {
    expect(rowFromScroll(-50, small)).toBe(0);
    expect(rowFromScroll(10_000_000, small)).toBe(999);
    expect(scrollFromRow(5000, small)).toBe(999 * 20);
    expect(rowFromScroll(0, { ...small, rows: 0 })).toBe(0);
  });

  it('巨大なファイルではスペーサー高さを制限して比例させる', () => {
    expect(spacerHeight(huge)).toBe(MAX_SPACER_HEIGHT);
    expect(rowFromScroll(0, huge)).toBe(0);
    const end = MAX_SPACER_HEIGHT - huge.viewportHeight;
    expect(rowFromScroll(end, huge)).toBe(huge.rows - 20);
    expect(contentTop(1234, 5, huge)).toBe(1234);
  });

  it('小さいファイルでは、どの行へ移動しても描画行が表示範囲を覆う（末尾も含む）', () => {
    // ブラウザは scrollTop を最大値（スペーサー高さ - 表示高さ）で丸めるので、その条件で確認する
    const l = { rows: 1000, rowHeight: 20, viewportHeight: 478 };
    const maxScroll = spacerHeight(l) - l.viewportHeight;
    const visible = Math.ceil(l.viewportHeight / l.rowHeight) + 1;
    for (let row = 0; row < l.rows; row++) {
      const scrollTop = Math.min(
        scrollFromRow(Math.max(0, row - 3), l),
        maxScroll,
      );
      const first = rowFromScroll(scrollTop, l);
      const rendered = Math.min(l.rows, first + visible) - first;
      const top = contentTop(scrollTop, first, l);
      expect(top, `row ${row}`).toBeLessThanOrEqual(scrollTop);
      expect(top + rendered * l.rowHeight, `row ${row}`).toBeGreaterThanOrEqual(
        scrollTop + l.viewportHeight,
      );
    }
  });

  it('巨大なファイルで行→スクロール→行がほぼ往復する', () => {
    const row = 50_000_000;
    const back = rowFromScroll(scrollFromRow(row, huge), huge);
    // 1ピクセルあたり約12行なので誤差はそれ以内
    expect(Math.abs(back - row)).toBeLessThan(20);
  });
});

describe('parseOffset', () => {
  it('10進と0x付き16進を解釈する', () => {
    expect(parseOffset('255', 1000)).toEqual({ ok: true, offset: 255 });
    expect(parseOffset(' 0xFF ', 1000)).toEqual({ ok: true, offset: 255 });
    expect(parseOffset('0x1_00', 1000)).toEqual({ ok: true, offset: 256 });
    expect(parseOffset('1,000', 5000)).toEqual({ ok: true, offset: 1000 });
  });

  it('不正値と範囲外を区別する', () => {
    expect(parseOffset('', 10)).toEqual({ ok: false, reason: 'empty' });
    expect(parseOffset('ff', 10)).toEqual({ ok: false, reason: 'invalid' });
    expect(parseOffset('-1', 10)).toEqual({ ok: false, reason: 'invalid' });
    expect(parseOffset('10', 10)).toEqual({ ok: false, reason: 'range' });
    expect(parseOffset('0', 0)).toEqual({ ok: false, reason: 'range' });
    expect(parseOffset('9'.repeat(30), 10)).toEqual({
      ok: false,
      reason: 'range',
    });
  });
});

describe('parseHexPattern', () => {
  it('さまざまな区切りを受け付ける', () => {
    const expected = bytes(0xde, 0xad, 0xbe, 0xef);
    for (const s of [
      'DE AD BE EF',
      'deadbeef',
      '0xDE,0xAD,0xBE,0xEF',
      'de:ad-be ef',
    ]) {
      const r = parseHexPattern(s);
      expect(r.ok && Array.from(r.bytes)).toEqual(Array.from(expected));
    }
  });

  it('空・不正・奇数桁を弾く', () => {
    expect(parseHexPattern('  ')).toEqual({ ok: false, reason: 'empty' });
    expect(parseHexPattern('0x')).toEqual({ ok: false, reason: 'empty' });
    expect(parseHexPattern('GG')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseHexPattern('ABC')).toEqual({ ok: false, reason: 'odd' });
  });
});

describe('encodeTextPattern', () => {
  it('UTF-8 / UTF-16LE / Latin-1 に変換する', () => {
    const u8 = encodeTextPattern('あA', 'utf-8');
    expect(u8.ok && Array.from(u8.bytes)).toEqual([0xe3, 0x81, 0x82, 0x41]);
    const u16 = encodeTextPattern('あA', 'utf-16le');
    expect(u16.ok && Array.from(u16.bytes)).toEqual([0x42, 0x30, 0x41, 0x00]);
    const l1 = encodeTextPattern('é', 'latin1');
    expect(l1.ok && Array.from(l1.bytes)).toEqual([0xe9]);
  });

  it('空文字とLatin-1で表せない文字を弾く', () => {
    expect(encodeTextPattern('', 'utf-8')).toEqual({
      ok: false,
      reason: 'empty',
    });
    expect(encodeTextPattern('あ', 'latin1')).toEqual({
      ok: false,
      reason: 'unmappable',
    });
  });
});

describe('findInBytes / findLastInBytes', () => {
  const data = bytes(1, 2, 3, 1, 2, 4, 1, 2, 3);
  it('先頭から・途中からの一致を探す', () => {
    expect(findInBytes(data, bytes(1, 2, 3))).toBe(0);
    expect(findInBytes(data, bytes(1, 2, 3), 1)).toBe(6);
    expect(findInBytes(data, bytes(2, 4))).toBe(4);
    expect(findInBytes(data, bytes(9))).toBe(-1);
    expect(findInBytes(data, new Uint8Array(0))).toBe(-1);
    expect(findInBytes(bytes(1, 2), bytes(1, 2, 3))).toBe(-1);
  });

  it('末尾ぴったりの一致も見つける', () => {
    expect(findInBytes(data, bytes(2, 3), 7)).toBe(7);
  });

  it('後ろから探す', () => {
    expect(findLastInBytes(data, bytes(1, 2, 3))).toBe(6);
    expect(findLastInBytes(data, bytes(1, 2, 3), 5)).toBe(0);
    expect(findLastInBytes(data, bytes(1, 2, 3), -1)).toBe(-1);
    expect(findLastInBytes(data, bytes(7))).toBe(-1);
  });
});

describe('searchForward / searchBackward', () => {
  const size = 100;
  const data = new Uint8Array(size);
  const needle = bytes(0xaa, 0xbb, 0xcc);
  data.set(needle, 10);
  data.set(needle, 49); // チャンク境界(50)をまたぐ
  data.set(needle, 97); // 末尾ぴったり
  const opts = { chunkSize: 50 };

  it('前方検索でチャンク境界をまたぐ一致を見つける', async () => {
    const read = reader(data);
    expect(await searchForward(read, size, needle, 0, opts)).toEqual({
      status: 'found',
      offset: 10,
    });
    expect(await searchForward(read, size, needle, 11, opts)).toEqual({
      status: 'found',
      offset: 49,
    });
    expect(await searchForward(read, size, needle, 50, opts)).toEqual({
      status: 'found',
      offset: 97,
    });
    expect(await searchForward(read, size, needle, 98, opts)).toEqual({
      status: 'not-found',
    });
  });

  it('後方検索で現在位置より前の一致を見つける', async () => {
    const read = reader(data);
    expect(await searchBackward(read, size, needle, 100, opts)).toEqual({
      status: 'found',
      offset: 97,
    });
    expect(await searchBackward(read, size, needle, 97, opts)).toEqual({
      status: 'found',
      offset: 49,
    });
    expect(await searchBackward(read, size, needle, 49, opts)).toEqual({
      status: 'found',
      offset: 10,
    });
    expect(await searchBackward(read, size, needle, 10, opts)).toEqual({
      status: 'not-found',
    });
  });

  it('パターンが長すぎる・空の場合は見つからない', async () => {
    const read = reader(data);
    expect(await searchForward(read, 2, bytes(1, 2, 3), 0, opts)).toEqual({
      status: 'not-found',
    });
    expect(
      await searchBackward(read, size, new Uint8Array(0), 50, opts),
    ).toEqual({ status: 'not-found' });
  });

  it('進捗を通知し、キャンセルできる', async () => {
    const read = reader(new Uint8Array(1000));
    const progress: number[] = [];
    await searchForward(read, 1000, bytes(1), 0, {
      chunkSize: 250,
      onProgress: (r) => progress.push(r),
    });
    expect(progress).toEqual([0.25, 0.5, 0.75, 1]);
    expect(
      await searchForward(read, 1000, bytes(1), 0, {
        chunkSize: 250,
        isCancelled: () => true,
      }),
    ).toEqual({ status: 'cancelled' });
    expect(
      await searchBackward(read, 1000, bytes(1), 1000, {
        isCancelled: () => true,
      }),
    ).toEqual({ status: 'cancelled' });
  });
});
