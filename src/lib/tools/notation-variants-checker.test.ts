import { describe, expect, it } from 'vitest';
import {
  applySuggestions,
  buildSegments,
  checkNotation,
  dictionarySize,
  listDictionary,
  parseCustomRules,
} from './notation-variants-checker';

describe('辞書', () => {
  it('数百語規模で、変更前と推奨が同じ項目や変更前の重複がない', () => {
    const items = listDictionary();
    expect(items.length).toBe(dictionarySize());
    expect(items.length).toBeGreaterThan(200);
    expect(new Set(items.map((i) => i.variant)).size).toBe(items.length);
    for (const i of items) expect(i.variant).not.toBe(i.preferred);
  });
});

describe('checkNotation: 辞書', () => {
  it('送り仮名のゆれを検出して推奨を返す', () => {
    const r = checkNotation('資料を取扱いに注意して行ないます。');
    expect(r.findings.map((f) => [f.text, f.suggestion, f.kind])).toEqual([
      ['取扱い', '取り扱い', 'okurigana'],
      ['行ない', '行い', 'okurigana'],
    ]);
  });

  it('位置を正しく返し、置換結果を作れる', () => {
    const text = '出来るだけ早く御連絡下さい。';
    const r = checkNotation(text);
    expect(r.findings.map((f) => f.text)).toEqual([
      '出来るだけ',
      '御連絡',
      '下さい',
    ]);
    expect(text.slice(r.findings[1].start, r.findings[1].end)).toBe('御連絡');
    expect(applySuggestions(text, r.findings)).toBe(
      'できるだけ早くご連絡ください。',
    );
  });

  it('「出来事」など別語は検出しない', () => {
    expect(checkNotation('今日の出来事と出来上がり').total).toBe(0);
  });

  it('後続条件つきのルール（尚早・是非を問う）は除外される', () => {
    expect(checkNotation('時期尚早で是非を問う').total).toBe(0);
    expect(checkNotation('是非お越しください').findings[0].suggestion).toBe(
      'ぜひ',
    );
  });

  it('推奨表記が同じ文章にもあれば mixed になる', () => {
    const r = checkNotation('確認を行い、別途行ないます。');
    expect(r.findings[0].mixed).toBe(true);
    expect(checkNotation('行ないます').findings[0].mixed).toBe(false);
  });

  it('カタカナ表記のゆれ', () => {
    const r = checkNotation('ソフトウエアのシュミレーション');
    expect(r.findings.map((f) => f.suggestion)).toEqual([
      'ソフトウェア',
      'シミュレーション',
    ]);
  });

  it('長音の有無は既定でオフ、オンにするとサーバーは対象外になる', () => {
    const text = 'サーバとユーザーとサーバー';
    expect(checkNotation(text).total).toBe(0);
    const r = checkNotation(text, { kinds: { longVowel: true } });
    expect(r.findings.map((f) => f.text)).toEqual(['サーバ']);
    expect(r.counts.longVowel).toBe(1);
  });

  it('種別をオフにすると検出されない', () => {
    expect(checkNotation('行ない', { kinds: { okurigana: false } }).total).toBe(
      0,
    );
  });

  it('同じ位置で長いルールが優先され、重複しない', () => {
    const r = checkNotation('ファイアーウォール');
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0].suggestion).toBe('ファイアウォール');
  });

  it('空文字は指摘なし', () => {
    const r = checkNotation('');
    expect(r.total).toBe(0);
    expect(buildSegments('', r.findings)).toEqual([]);
  });

  it('長音オン時も、後ろに別のカタカナが続く語は対象外', () => {
    const opts = { kinds: { longVowel: true } };
    expect(checkNotation('ユーザビリティ', opts).total).toBe(0);
    expect(checkNotation('モニタリング', opts).total).toBe(0);
    expect(checkNotation('メモリ', opts).findings[0].suggestion).toBe(
      'メモリー',
    );
  });
});

describe('checkNotation: 全角・半角', () => {
  it('半角カナは常に全角へ', () => {
    const r = checkNotation('ｶﾞｲﾄﾞを読む');
    expect(r.findings[0].suggestion).toBe('ガイド');
    expect(r.findings[0].kind).toBe('width');
  });

  it('全角数字は半角数字が混在するときだけ指摘する', () => {
    expect(checkNotation('１２３個').total).toBe(0);
    const r = checkNotation('12個と３４個');
    expect(r.findings.map((f) => [f.text, f.suggestion])).toEqual([
      ['３４', '34'],
    ]);
  });

  it('全角英字と半角英字の混在', () => {
    const r = checkNotation('Webと　ＡＢＣ');
    expect(r.findings.map((f) => f.suggestion)).toEqual(['ABC']);
  });

  it('括弧が混在していれば少数派を多数派に揃える', () => {
    const r = checkNotation('（注）参照(例)です（補足）');
    expect(r.findings.map((f) => [f.text, f.suggestion])).toEqual([
      ['(', '（'],
      [')', '）'],
    ]);
  });

  it('英文中の括弧やURLのクエリは対象にしない', () => {
    expect(checkNotation('see (this) page?a=1。（注）').total).toBe(0);
  });

  it('句読点の混在（、と，）', () => {
    const r = checkNotation('りんご、みかん、ぶどう，すいか');
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0].text).toBe('，');
    expect(r.findings[0].suggestion).toBe('、');
  });

  it('小数点やファイル名のピリオドは句点として数えない', () => {
    expect(checkNotation('値は3.14です。a.txtを開く。').total).toBe(0);
  });

  it('width をオフにすれば検出しない', () => {
    expect(checkNotation('ｶﾅ', { kinds: { width: false } }).total).toBe(0);
  });
});

describe('独自ルール', () => {
  it('parseCustomRules は不正行・同一表記・重複を無視する', () => {
    expect(parseCustomRules('a>b\r\nc\n>d\ne>\nf>f\na>z\n 　x > y ')).toEqual([
      { variant: 'a', preferred: 'b' },
      { variant: 'x', preferred: 'y' },
    ]);
  });

  it('正規表現の特殊文字をそのまま文字として扱う', () => {
    const r = checkNotation('a.b と a+b', { customRules: 'a.b>X\na+b>Y' });
    expect(r.findings.map((f) => f.suggestion)).toEqual(['X', 'Y']);
    expect(r.counts.custom).toBe(2);
  });

  it('辞書と重なるとき独自ルールが優先される', () => {
    const r = checkNotation('下さい', { customRules: '下さい>下さい。' });
    expect(r.findings[0].kind).toBe('custom');
  });
});

describe('buildSegments', () => {
  it('原文を欠落なく分割する', () => {
    const text = 'あ行ないい';
    const r = checkNotation(text);
    const segs = buildSegments(text, r.findings);
    expect(segs.map((s) => s.text).join('')).toBe(text);
    expect(segs.map((s) => s.finding)).toEqual([null, 0, null]);
  });

  it('HTMLを含む文章もそのまま文字列として保持する', () => {
    const text = '<b>行ない</b>';
    const segs = buildSegments(text, checkNotation(text).findings);
    expect(segs.map((s) => s.text).join('')).toBe(text);
  });
});
