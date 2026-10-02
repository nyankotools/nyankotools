import { describe, expect, it } from 'vitest';
import {
  convertEnglishToKatakana,
  type EnglishKatakanaOptions,
} from './english-katakana-converter';

const defaults: EnglishKatakanaOptions = { vSound: 'b', spellAcronyms: true };
const conv = (s: string, o: Partial<EnglishKatakanaOptions> = {}) =>
  convertEnglishToKatakana(s, { ...defaults, ...o }).output;

describe('convertEnglishToKatakana', () => {
  it('辞書にある語・不規則な語を正しく変換する', () => {
    expect(conv('knife')).toBe('ナイフ');
    expect(conv('computer')).toBe('コンピューター');
    expect(conv('Hello world')).toBe('ハロー ワールド');
  });

  it('綴りのルールで変換する', () => {
    expect(conv('school')).toBe('スクール');
    expect(conv('think')).toBe('シンク');
    expect(conv('ring')).toBe('リング');
    expect(conv('night')).toBe('ナイト');
    expect(conv('happy')).toBe('ハッピー');
    expect(conv('sweet')).toBe('スウィート');
    expect(conv('queen')).toBe('クイーン');
  });

  it('マジックe（語末の e で母音を長く読む）', () => {
    expect(conv('nice')).toBe('ナイス');
    expect(conv('cute')).toBe('キュート');
    expect(conv('tune')).toBe('チューン');
    expect(conv('home')).toBe('ホーム');
  });

  it('短母音＋語末の子音は促音を入れる', () => {
    expect(conv('cut')).toBe('カット');
    expect(conv('bed')).toBe('ベッド');
    expect(conv('fish')).toBe('フィッシュ');
    expect(conv('match')).toBe('マッチ');
    expect(conv('box')).toBe('ボックス');
    expect(conv('sunset')).toBe('サンセット');
  });

  it('ヴの扱いを切り替えられる', () => {
    expect(conv('van')).toBe('バン');
    expect(conv('van', { vSound: 'vu' })).toBe('ヴァン');
  });

  it('全て大文字の短い語は文字読みにできる', () => {
    expect(conv('USB')).toBe('ユーエスビー');
    expect(conv('USB', { spellAcronyms: false })).not.toBe('ユーエスビー');
  });

  it('英字以外はそのまま残し、文中の英単語だけを変換する', () => {
    expect(conv('これは cat です。')).toBe('これは キャット です。');
    expect(conv('123 !?')).toBe('123 !?');
    expect(conv('')).toBe('');
  });

  it('変換した語の方法（辞書・ルール・文字読み）を返す', () => {
    const { words } = convertEnglishToKatakana('cat nice USB', defaults);
    expect(words.map((w) => w.method)).toEqual([
      'dictionary',
      'rules',
      'acronym',
    ]);
  });

  it('constructor などオブジェクトのプロパティ名と同じ語も通常の語として扱う', () => {
    const { words } = convertEnglishToKatakana(
      'constructor toString',
      defaults,
    );
    expect(words.every((w) => w.method === 'rules')).toBe(true);
    expect(conv('constructor')).not.toContain('function');
  });

  it('英語圏の一般的な名前を辞書で変換する', () => {
    expect(conv('John Smith')).toBe('ジョン スミス');
    expect(conv('Mary James Michael David')).toBe(
      'メアリー ジェームズ マイケル デビッド',
    );
    expect(conv('Thomas Sarah Daniel Alice Peter')).toBe(
      'トーマス サラ ダニエル アリス ピーター',
    );
  });

  it('ページのサンプル文が正しい表記になる', () => {
    expect(
      conv('Hello world, this is a nice school.\nUSB cable, night light'),
    ).toBe(
      'ハロー ワールド, ディス イズ ア ナイス スクール.\nユーエスビー ケーブル, ナイト ライト',
    );
  });

  it('アポストロフィを含む語は部分ごとに変換する', () => {
    expect(conv("don't")).toBe('ドント');
  });
});
