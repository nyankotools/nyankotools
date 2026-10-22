import { describe, it, expect } from 'vitest';
import {
  clamp,
  filterLocalVoices,
  sortVoices,
  splitIntoChunks,
  type VoiceLike,
} from './text-to-speech';

const voice = (
  name: string,
  lang: string,
  localService: boolean,
): VoiceLike => ({ name, lang, voiceURI: name, localService });

describe('filterLocalVoices', () => {
  it('localService=true の音声だけを残す', () => {
    const voices = [
      voice('Haruka', 'ja-JP', true),
      voice('Google 日本語', 'ja-JP', false),
      voice('Online (Natural)', 'en-US', false),
    ];
    expect(filterLocalVoices(voices).map((v) => v.name)).toEqual(['Haruka']);
  });

  it('ローカル音声が無ければ空配列', () => {
    expect(filterLocalVoices([voice('Google', 'ja-JP', false)])).toEqual([]);
  });
});

describe('sortVoices', () => {
  it('優先言語を先頭にし、残りは言語・名前順', () => {
    const voices = [
      voice('Zira', 'en-US', true),
      voice('Ayumi', 'ja-JP', true),
      voice('Alex', 'en-US', true),
      voice('Haruka', 'ja-JP', true),
    ];
    expect(sortVoices(voices, 'ja').map((v) => v.name)).toEqual([
      'Ayumi',
      'Haruka',
      'Alex',
      'Zira',
    ]);
  });

  it('元の配列を変更しない', () => {
    const voices = [voice('B', 'en', true), voice('A', 'ja', true)];
    sortVoices(voices, 'ja');
    expect(voices[0].name).toBe('B');
  });
});

describe('clamp', () => {
  it('範囲内はそのまま、範囲外は丸める', () => {
    expect(clamp(1, 0.5, 2)).toBe(1);
    expect(clamp(5, 0.5, 2)).toBe(2);
    expect(clamp(-1, 0.5, 2)).toBe(0.5);
  });

  it('NaN・Infinity は最小値', () => {
    expect(clamp(NaN, 0.5, 2)).toBe(0.5);
    expect(clamp(Infinity, 0.5, 2)).toBe(0.5);
  });
});

describe('splitIntoChunks', () => {
  it('空文字・空白だけは空配列', () => {
    expect(splitIntoChunks('')).toEqual([]);
    expect(splitIntoChunks('  \n \n')).toEqual([]);
  });

  it('文末記号で区切る', () => {
    expect(splitIntoChunks('こんにちは。元気ですか？はい！')).toEqual([
      'こんにちは。',
      '元気ですか？',
      'はい！',
    ]);
  });

  it('改行でも区切り、CRLFも扱う', () => {
    expect(splitIntoChunks('a\r\nb\rc')).toEqual(['a', 'b', 'c']);
  });

  it('英語の文を区切る', () => {
    expect(splitIntoChunks('Hello world. How are you?')).toEqual([
      'Hello world.',
      'How are you?',
    ]);
  });

  it('句点が無い長文は maxLength で分割する', () => {
    const chunks = splitIntoChunks('あ'.repeat(25), 10);
    expect(chunks.map((c) => c.length)).toEqual([10, 10, 5]);
  });

  it('サロゲートペアを壊さない', () => {
    const chunks = splitIntoChunks('😀'.repeat(5), 2);
    expect(chunks).toEqual(['😀😀', '😀😀', '😀']);
  });

  it('末尾に文末記号が無くても最後の文を含める', () => {
    expect(splitIntoChunks('一つ目。二つ目')).toEqual(['一つ目。', '二つ目']);
  });

  it('全角スペースだけのチャンクは捨てる', () => {
    expect(splitIntoChunks('一つ目。　\n　二つ目。')).toEqual([
      '一つ目。',
      '二つ目。',
    ]);
  });

  it('CR のみの改行も区切りとして扱う', () => {
    expect(splitIntoChunks('a\rb\r\rc')).toEqual(['a', 'b', 'c']);
  });

  it('非常に長い入力（10万文字・句点なし）でも全文を欠落させずに分割する', () => {
    const text = '読'.repeat(100_000);
    const chunks = splitIntoChunks(text);
    expect(chunks.length).toBe(Math.ceil(100_000 / 160));
    expect(chunks.join('')).toBe(text);
    expect(chunks.every((c) => c.length <= 160)).toBe(true);
  });

  it('句点の多い長文でも全文を欠落させない', () => {
    const text = '文。'.repeat(20_000);
    const chunks = splitIntoChunks(text);
    expect(chunks.join('')).toBe(text);
  });
});

describe('sortVoices（追加）', () => {
  it('空配列は空配列を返す', () => {
    expect(sortVoices([], 'ja')).toEqual([]);
  });

  it('言語コードがアンダースコア区切り（en_US）でも優先言語として扱う', () => {
    const voices = [voice('Zira', 'ja_JP', true), voice('Alex', 'en_US', true)];
    expect(sortVoices(voices, 'en').map((v) => v.name)).toEqual([
      'Alex',
      'Zira',
    ]);
  });
});
