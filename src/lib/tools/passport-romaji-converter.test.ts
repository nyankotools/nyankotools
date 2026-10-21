import { describe, expect, it } from 'vitest';
import {
  joinName,
  toPassportRomaji,
  type PassportLongVowel,
} from './passport-romaji-converter';

const conv = (s: string, longVowel: PassportLongVowel = 'omit') =>
  toPassportRomaji(s, { longVowel }).romaji;

describe('toPassportRomaji', () => {
  it('基本の氏名をヘボン式の大文字にする', () => {
    expect(conv('さとう')).toBe('SATO');
    expect(conv('たなか')).toBe('TANAKA');
    expect(conv('しょうこ')).toBe('SHOKO');
    expect(conv('ちひろ')).toBe('CHIHIRO');
  });

  it('オ段・ウ段の長音は表記しない', () => {
    expect(conv('おおの')).toBe('ONO');
    expect(conv('いとう')).toBe('ITO');
    expect(conv('ゆうこ')).toBe('YUKO');
    expect(conv('くうた')).toBe('KUTA');
    expect(conv('ちょうじ')).toBe('CHOJI');
  });

  it('ア段・イ段・エ段の重なりは省略しない', () => {
    expect(conv('かあ')).toBe('KAA');
    expect(conv('みい')).toBe('MII');
    expect(conv('ええ')).toBe('EE');
  });

  it('OH 希望ではオ段の長音だけを OH にする', () => {
    expect(conv('おおの', 'oh')).toBe('OHNO');
    expect(conv('いとう', 'oh')).toBe('ITOH');
    expect(conv('ようこ', 'oh')).toBe('YOHKO');
    expect(conv('ゆうこ', 'oh')).toBe('YUKO');
  });

  it('カタカナの長音符も同じ規則で扱う', () => {
    expect(conv('ジョージ')).toBe('JOJI');
    expect(conv('ジョージ', 'oh')).toBe('JOHJI');
    expect(conv('ミーコ')).toBe('MIIKO');
    expect(conv('ユーキ')).toBe('YUKI');
  });

  it('「ん」は N、b・m・p の前では M、アポストロフィは付けない', () => {
    expect(conv('かんだ')).toBe('KANDA');
    expect(conv('なんば')).toBe('NAMBA');
    expect(conv('ほんま')).toBe('HOMMA');
    expect(conv('さんぺい')).toBe('SAMPEI');
    expect(conv('じゅんいち')).toBe('JUNICHI');
    expect(conv('しんや')).toBe('SHINYA');
    expect(conv('けん')).toBe('KEN');
  });

  it('促音は子音を重ね、ch の前は T にする', () => {
    expect(conv('はっとり')).toBe('HATTORI');
    expect(conv('こっこ')).toBe('KOKKO');
    expect(conv('まっちゃ')).toBe('MATCHA');
    expect(conv('かっぱ')).toBe('KAPPA');
  });

  it('漢字・英数字・記号は変換せず unsupported に集める', () => {
    const result = toPassportRomaji('佐藤たろう1', { longVowel: 'omit' });
    expect(result.romaji).toBe('佐藤TARO1');
    expect(result.unsupported).toEqual(['佐', '藤', '1']);
  });

  it('語頭の長音符・語末の促音は unsupported にする', () => {
    expect(toPassportRomaji('ーあ', { longVowel: 'omit' }).unsupported).toEqual(
      ['ー'],
    );
    expect(toPassportRomaji('あっ', { longVowel: 'omit' }).unsupported).toEqual(
      ['っ'],
    );
  });

  it('促音の直後が音節でなければ空白をまたいで持ち越さない', () => {
    const result = toPassportRomaji('あっ かさ', { longVowel: 'omit' });
    expect(result.romaji).toBe('A KASA');
    expect(result.unsupported).toEqual(['っ']);
  });

  it('空白は 1 つにそろえ、前後は取り除く', () => {
    expect(conv('  さとう　たろう ')).toBe('SATO TARO');
    expect(conv('')).toBe('');
  });
});

describe('toPassportRomaji 追加のエッジケース', () => {
  it('長音符（カタカナ・ひらがな）のオ段・ウ段・ア段・イ段', () => {
    expect(conv('おー')).toBe('O');
    expect(conv('おー', 'oh')).toBe('OH');
    expect(conv('こーこー')).toBe('KOKO');
    expect(conv('オーサカ', 'oh')).toBe('OHSAKA');
    expect(conv('スーパー')).toBe('SUPAA');
    expect(conv('えいご')).toBe('EIGO');
    expect(conv('ああ')).toBe('AA');
    expect(conv('あい')).toBe('AI');
  });

  it('拗音を含む長音（とうきょう・きょう）', () => {
    expect(conv('とうきょう')).toBe('TOKYO');
    expect(conv('とうきょう', 'oh')).toBe('TOHKYOH');
    expect(conv('きょう')).toBe('KYO');
  });

  it('濁音・特殊な仮名（づ・ぢ・を・ヴ）', () => {
    expect(conv('づ')).toBe('ZU');
    expect(conv('ぢ')).toBe('JI');
    expect(conv('を')).toBe('O');
    expect(conv('ヲ')).toBe('O');
    expect(conv('ヴィ')).toBe('VI');
  });

  it('促音はサ行・タ行・ハ行・ヤ行でも重ねる（sh・ch・ts・f・y）', () => {
    expect(conv('ざっし')).toBe('ZASSHI');
    expect(conv('きって')).toBe('KITTE');
    expect(conv('ちっち')).toBe('CHITCHI');
    expect(conv('ぶっふ')).toBe('BUFFU');
    expect(conv('ざっきょ')).toBe('ZAKKYO');
  });

  it('「ん」の直後が長音・促音のときの扱い', () => {
    expect(conv('かんぱい')).toBe('KAMPAI');
    expect(conv('ぶんや')).toBe('BUNYA');
    const result = toPassportRomaji('んー', { longVowel: 'omit' });
    expect(result.romaji).toBe('Nー');
    expect(result.unsupported).toEqual(['ー']);
  });

  it('促音の直後が母音・長音・記号のときは unsupported に集める', () => {
    const vowel = toPassportRomaji('っあ', { longVowel: 'omit' });
    expect(vowel.romaji).toBe('A');
    expect(vowel.unsupported).toEqual(['っ']);
    expect(toPassportRomaji('っ', { longVowel: 'omit' })).toEqual({
      romaji: '',
      unsupported: ['っ'],
    });
  });

  it('漢字は 1 文字ずつ unsupported に入り、重複は除かれる', () => {
    const result = toPassportRomaji('東京東', { longVowel: 'omit' });
    expect(result.romaji).toBe('東京東');
    expect(result.unsupported).toEqual(['東', '京']);
  });

  it('全角英数字・半角カナは変換されず unsupported になる', () => {
    expect(toPassportRomaji('ＡＢ', { longVowel: 'omit' }).unsupported).toEqual(
      ['Ａ', 'Ｂ'],
    );
    expect(toPassportRomaji('ﾄｳ', { longVowel: 'omit' })).toEqual({
      romaji: 'ﾄｳ',
      unsupported: ['ﾄ', 'ｳ'],
    });
  });

  it('改行・タブは空白として扱い、1 つにまとめる', () => {
    expect(conv('さとう\nたろう')).toBe('SATO TARO');
    expect(conv('\tさとう\t\tたろう\t')).toBe('SATO TARO');
  });

  it('長い入力（5000 文字）でも変換できる', () => {
    const long = 'あ'.repeat(5000);
    const out = conv(long);
    expect(out).toBe('A'.repeat(5000));
  });
});

describe('joinName', () => {
  it('順序を切り替えて結合する', () => {
    expect(joinName('SATO', 'TARO', 'surname-first')).toBe('SATO TARO');
    expect(joinName('SATO', 'TARO', 'given-first')).toBe('TARO SATO');
  });

  it('片方が空ならもう片方だけ返す', () => {
    expect(joinName('SATO', '', 'given-first')).toBe('SATO');
    expect(joinName('', 'TARO', 'surname-first')).toBe('TARO');
  });
});
