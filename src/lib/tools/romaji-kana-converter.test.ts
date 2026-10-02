import { describe, expect, it } from 'vitest';
import {
  kanaToRomaji,
  romajiToKana,
  type KanaToRomajiOptions,
} from './romaji-kana-converter';

const hira = (s: string) => romajiToKana(s, { script: 'hiragana' });
const kata = (s: string) => romajiToKana(s, { script: 'katakana' });
const roma = (s: string, o: Partial<KanaToRomajiOptions> = {}) =>
  kanaToRomaji(s, {
    style: 'hepburn',
    longVowel: 'macron',
    letterCase: 'lower',
    ...o,
  });

describe('romajiToKana', () => {
  it('基本の音をひらがな・カタカナに変換する', () => {
    expect(hira('sakura')).toBe('さくら');
    expect(kata('sakura')).toBe('サクラ');
    expect(hira('nihongo')).toBe('にほんご');
  });

  it('ヘボン式・訓令式のどちらの綴りも受け付ける', () => {
    expect(hira('shi chi tsu fu ji')).toBe('し ち つ ふ じ');
    expect(hira('si ti tu hu zi')).toBe('し ち つ ふ じ');
  });

  it('拗音・促音・外来音に対応する', () => {
    expect(hira('kyouto')).toBe('きょうと');
    expect(hira('gakkou')).toBe('がっこう');
    expect(hira('matcha')).toBe('まっちゃ');
    expect(kata('fainaru fantajii')).toBe('ファイナル ファンタジイ');
    expect(kata('thi-')).toBe('ティー');
    expect(kata('wi-n')).toBe('ウィーン');
  });

  it('ん: n の後が子音・語末・アポストロフィ・nn の場合を区別する', () => {
    expect(hira('shinbun')).toBe('しんぶん');
    expect(hira('kan')).toBe('かん');
    expect(hira("kan'i")).toBe('かんい');
    expect(hira('konnichiwa')).toBe('こんにちわ');
    expect(hira('onna')).toBe('おんな');
    expect(hira('nn')).toBe('ん');
    expect(hira('shimbun kampai')).toBe('しんぶん かんぱい');
    expect(hira('kannpai')).toBe('かんぱい');
  });

  it('長音: ハイフンは直前がかなのときだけ ー にする', () => {
    expect(kata('ra-men')).toBe('ラーメン');
    expect(hira('ra-men')).toBe('らーめん');
    expect(hira('x-y')).toBe('x-y');
  });

  it('マクロン付き母音を長音にする', () => {
    expect(kata('tōkyō')).toBe('トーキョー');
    expect(hira('tōkyō')).toBe('とうきょう');
    expect(hira('Rāmen')).toBe('らあめん');
  });

  it('大文字は小文字として読み、変換できない文字はそのまま残す', () => {
    expect(hira('SAKURA')).toBe('さくら');
    expect(hira('Tokyo 123 東京')).toBe('ときょ 123 東京');
    expect(hira('k')).toBe('k');
  });

  it('空文字は空文字を返す', () => {
    expect(hira('')).toBe('');
  });
});

describe('kanaToRomaji', () => {
  it('ひらがな・カタカナをヘボン式にする', () => {
    expect(roma('さくら')).toBe('sakura');
    expect(roma('サクラ')).toBe('sakura');
    expect(roma('しゃしん')).toBe('shashin');
    expect(roma('ちゃ')).toBe('cha');
    expect(roma('じゅう')).toBe('juu');
  });

  it('訓令式にできる', () => {
    expect(roma('しんぶん', { style: 'kunrei' })).toBe('sinbun');
    expect(roma('しゃしん', { style: 'kunrei' })).toBe('syasin');
    expect(roma('ちゃ', { style: 'kunrei' })).toBe('tya');
    expect(roma('ぢ', { style: 'kunrei' })).toBe('zi');
  });

  it('促音は次の子音を重ねる（ch は tch）', () => {
    expect(roma('がっこう')).toBe('gakkou');
    expect(roma('まっちゃ')).toBe('matcha');
    expect(roma('あっ')).toBe('at');
  });

  it("ん は母音・y の前で n' にする", () => {
    expect(roma('かんい')).toBe("kan'i");
    expect(roma('こんにちは')).toBe('konnichiha');
    expect(roma('ほんや')).toBe("hon'ya");
  });

  it('ー の表記を切り替えられる', () => {
    expect(roma('ラーメン')).toBe('rāmen');
    expect(roma('ラーメン', { longVowel: 'double' })).toBe('raamen');
    expect(roma('ラーメン', { longVowel: 'dash' })).toBe('ra-men');
    expect(roma('ラーメン', { longVowel: 'omit' })).toBe('ramen');
  });

  it('外来音を変換する', () => {
    expect(roma('ファイル')).toBe('fairu');
    expect(roma('ティーカップ')).toBe('tīkappu');
    expect(roma('ヴァイオリン')).toBe('vaiorin');
    expect(roma('シェフ')).toBe('shefu');
  });

  it('大文字小文字の指定ができる', () => {
    expect(roma('さくら たろう', { letterCase: 'capitalize' })).toBe(
      'Sakura Tarou',
    );
    expect(roma('さくら', { letterCase: 'upper' })).toBe('SAKURA');
    expect(roma('しんいち', { letterCase: 'capitalize' })).toBe("Shin'ichi");
  });

  it('かな以外はそのまま残す', () => {
    expect(roma('東京タワー 2024')).toBe('東京tawā 2024');
  });

  it('ローマ字→かな→ローマ字で元に戻る', () => {
    const word = 'konnichiha';
    expect(roma(hira(word), { longVowel: 'double' })).toBe(word);
  });
});
