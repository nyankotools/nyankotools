import { describe, expect, it } from 'vitest';
import { generateQrMatrix } from './qr-generator';
import {
  addToHistory,
  classifyContent,
  decodeQrFromImageData,
  parseWifi,
} from './qr-code-reader';

/** QRのマトリクスをRGBAピクセルに描画する（1モジュール=scale px、周囲にクワイエットゾーン付き）。 */
function renderQr(text: string, scale = 4, invert = false) {
  const result = generateQrMatrix(text, 'M');
  if (!result.ok) throw new Error('generate failed');
  const { moduleCount, isDark } = result.matrix;
  const quiet = 4;
  const size = (moduleCount + quiet * 2) * scale;
  const data = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const row = Math.floor(y / scale) - quiet;
      const col = Math.floor(x / scale) - quiet;
      const dark =
        row >= 0 &&
        col >= 0 &&
        row < moduleCount &&
        col < moduleCount &&
        isDark(row, col);
      const value = dark !== invert ? 0 : 255;
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 255;
    }
  }
  return { data, width: size, height: size };
}

describe('decodeQrFromImageData', () => {
  it('生成したQRコードを読み取れる', async () => {
    expect(await decodeQrFromImageData(renderQr('https://example.com/'))).toBe(
      'https://example.com/',
    );
  });

  it('日本語（UTF-8）も読み取れる', async () => {
    expect(await decodeQrFromImageData(renderQr('にゃんこツール'))).toBe(
      'にゃんこツール',
    );
  });

  it('白黒反転したQRコードも読み取れる', async () => {
    expect(await decodeQrFromImageData(renderQr('invert', 4, true))).toBe(
      'invert',
    );
  });

  it('QRコードが無い画像は null', async () => {
    const size = 100;
    const data = new Uint8ClampedArray(size * size * 4).fill(255);
    expect(
      await decodeQrFromImageData({ data, width: size, height: size }),
    ).toBeNull();
  });
});

describe('classifyContent', () => {
  it('http(s) のURLは url（正規化したURL付き）', () => {
    expect(classifyContent('https://example.com/a?b=1')).toEqual({
      kind: 'url',
      url: 'https://example.com/a?b=1',
    });
    expect(classifyContent(' http://example.com ').kind).toBe('url');
  });

  it('javascript: や data: はリンク扱いにしない', () => {
    expect(classifyContent('javascript:alert(1)').kind).toBe('text');
    expect(classifyContent('data:text/html,<b>x</b>').kind).toBe('text');
  });

  it('空白を含む文字列はURLではなくテキスト', () => {
    expect(classifyContent('https://example.com hello').kind).toBe('text');
  });

  it('各種スキームを判定する', () => {
    expect(classifyContent('mailto:a@example.com').kind).toBe('email');
    expect(classifyContent('TEL:0312345678').kind).toBe('tel');
    expect(classifyContent('smsto:0312345678:hi').kind).toBe('sms');
    expect(classifyContent('geo:35.68,139.76').kind).toBe('geo');
    expect(classifyContent('BEGIN:VCARD\nVERSION:3.0\nEND:VCARD').kind).toBe(
      'vcard',
    );
    expect(classifyContent('こんにちは').kind).toBe('text');
  });
});

describe('parseWifi', () => {
  it('SSID・パスワード・暗号化方式・隠しSSIDを取り出す', () => {
    expect(parseWifi('WIFI:T:WPA;S:MyNet;P:secret;H:true;;')).toEqual({
      ssid: 'MyNet',
      password: 'secret',
      security: 'WPA',
      hidden: true,
    });
  });

  it('エスケープされた区切り文字を元に戻す', () => {
    expect(parseWifi('WIFI:T:WPA;S:a\\;b\\:c;P:p\\\\w;;')).toMatchObject({
      ssid: 'a;b:c',
      password: 'p\\w',
    });
  });

  it('パスワード無し（nopass）や末尾の;;省略にも対応する', () => {
    expect(parseWifi('WIFI:T:nopass;S:Open')).toEqual({
      ssid: 'Open',
      password: '',
      security: 'nopass',
      hidden: false,
    });
  });

  it('WIFI: で始まらない・SSIDが無い場合は null', () => {
    expect(parseWifi('hello')).toBeNull();
    expect(parseWifi('WIFI:T:WPA;P:x;;')).toBeNull();
  });
});

describe('addToHistory', () => {
  it('新しいものを先頭に追加し、同じ内容が連続しても重複させない', () => {
    expect(addToHistory([], 'a')).toEqual(['a']);
    expect(addToHistory(['a'], 'a')).toEqual(['a']);
    expect(addToHistory(['a'], 'b')).toEqual(['b', 'a']);
  });

  it('過去に読んだ内容は先頭へ移動し、最大20件に制限する', () => {
    expect(addToHistory(['b', 'a'], 'a')).toEqual(['a', 'b']);
    const many = Array.from({ length: 20 }, (_, i) => String(i));
    expect(addToHistory(many, 'new')).toHaveLength(20);
    expect(addToHistory(many, 'new')[0]).toBe('new');
  });
});
