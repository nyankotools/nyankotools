import { describe, it, expect } from 'vitest';
import {
  bytesToDisplayText,
  isRecipeOp,
  isValidUtf8,
  runRecipe,
  RECIPE_OPS,
  type RecipeOp,
} from './data-recipe-builder';

async function run(input: string, steps: RecipeOp[]): Promise<string> {
  const result = await runRecipe(input, steps);
  if (!result.success) throw new Error(`failed at step ${result.step}`);
  return bytesToDisplayText(result.output);
}

describe('runRecipe', () => {
  it('手順が空なら入力をそのまま返す', async () => {
    expect(await run('hello', [])).toBe('hello');
  });

  it('Base64エンコード → デコードで元に戻る（日本語・絵文字）', async () => {
    expect(await run('こんにちは😀', ['base64-encode', 'base64-decode'])).toBe(
      'こんにちは😀',
    );
    expect(await run('Hello', ['base64-encode'])).toBe('SGVsbG8=');
  });

  it('Base64URL・改行・パディング無しも復号できる', async () => {
    expect(await run('SGVs\nbG8', ['base64-decode'])).toBe('Hello');
    expect(await run('4pyT', ['base64-decode'])).toBe('✓');
    expect(await run('-_8', ['base64-decode', 'hex-encode'])).toBe('fbff');
  });

  it('URLエンコード・デコード', async () => {
    expect(await run('a b&あ', ['url-encode'])).toBe('a%20b%26%E3%81%82');
    expect(await run('a%20b%26%E3%81%82', ['url-decode'])).toBe('a b&あ');
  });

  it('16進数エンコード・デコード（区切り・0xを許容）', async () => {
    expect(await run('Hi', ['hex-encode'])).toBe('4869');
    expect(await run('0x48, 0x69', ['hex-decode'])).toBe('Hi');
    expect(await run('48 69', ['hex-decode'])).toBe('Hi');
  });

  it('ハッシュ（MD5 / SHA-1 / SHA-256 / SHA-512）', async () => {
    expect(await run('abc', ['md5'])).toBe('900150983cd24fb0d6963f7d28e17f72');
    expect(await run('abc', ['sha1'])).toBe(
      'a9993e364706816aba3e25717850c26c9cd0d89d',
    );
    expect(await run('abc', ['sha256'])).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(await run('abc', ['sha512'])).toMatch(/^ddaf35a193617aba/);
  });

  it('多段: Base64エンコード → SHA-256', async () => {
    const direct = await run('SGVsbG8=', ['sha256']);
    expect(await run('Hello', ['base64-encode', 'sha256'])).toBe(direct);
  });

  it('Base64デコードでUTF-8にならない結果も、16進数へ繋げられる', async () => {
    const result = await runRecipe('/w==', ['base64-decode']);
    expect(result.success).toBe(true);
    if (result.success) expect(isValidUtf8(result.output)).toBe(false);
    expect(await run('/w==', ['base64-decode', 'hex-encode'])).toBe('ff');
  });

  it('HTMLエスケープ・Unicodeエスケープ', async () => {
    expect(await run('<a href="x">', ['html-escape'])).toBe(
      '&lt;a href=&quot;x&quot;&gt;',
    );
    expect(await run('&lt;b&gt;', ['html-unescape'])).toBe('<b>');
    expect(await run('あA', ['unicode-escape'])).toBe('\\u3042A');
    expect(await run('\\u3042', ['unicode-unescape'])).toBe('あ');
  });

  it('ROT13・反転・大文字小文字', async () => {
    expect(await run('Hello', ['rot13'])).toBe('Uryyb');
    expect(await run('Uryyb', ['rot13'])).toBe('Hello');
    expect(await run('ab😀c', ['reverse'])).toBe('c😀ba');
    expect(await run('aB', ['uppercase'])).toBe('AB');
    expect(await run('aB', ['lowercase'])).toBe('ab');
  });

  it('失敗した手順の位置と、それまでの出力を返す', async () => {
    const result = await runRecipe('Hello', [
      'base64-encode',
      'hex-decode',
      'md5',
    ]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.step).toBe(1);
      expect(result.reason).toBe('invalid-input');
      expect(result.outputs).toHaveLength(1);
    }
  });

  it('不正なBase64・URL・16進数はエラーになる', async () => {
    for (const [input, op] of [
      ['***', 'base64-decode'],
      ['A', 'base64-decode'],
      ['%E3%81', 'url-decode'],
      ['zz', 'hex-decode'],
      ['abc', 'hex-decode'],
    ] as [string, RecipeOp][]) {
      const result = await runRecipe(input, [op]);
      expect(result.success, `${op}: ${input}`).toBe(false);
    }
  });

  it('空入力でも各手順が動く', async () => {
    expect(await run('', ['base64-encode'])).toBe('');
    expect(await run('', ['md5'])).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });
});

describe('isRecipeOp', () => {
  it('定義済みの手順IDだけを受け付ける', () => {
    for (const op of RECIPE_OPS) expect(isRecipeOp(op)).toBe(true);
    expect(isRecipeOp('nope')).toBe(false);
  });
});
