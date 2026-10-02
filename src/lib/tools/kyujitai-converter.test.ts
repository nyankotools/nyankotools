import { describe, it, expect } from 'vitest';
import { convertKyujitai, KYUJITAI_PAIRS } from './kyujitai-converter';

const toShin = { direction: 'toShinjitai', includeVariants: true } as const;
const toKyu = { direction: 'toKyujitai', includeVariants: true } as const;

describe('辞書の整合性', () => {
  it('新字体と旧字体が異なる1文字で、どちらも重複しない', () => {
    const shin = KYUJITAI_PAIRS.map(([s]) => s);
    const kyu = KYUJITAI_PAIRS.map(([, k]) => k);
    expect(new Set(shin).size).toBe(shin.length);
    expect(new Set(kyu).size).toBe(kyu.length);
    for (const [s, k] of KYUJITAI_PAIRS) {
      expect([...s].length).toBe(1);
      expect([...k].length).toBe(1);
      expect(s).not.toBe(k);
    }
    // 新字体と旧字体の集合が重ならない（往復が壊れない）
    expect(shin.filter((c) => kyu.includes(c))).toEqual([]);
  });
});

describe('convertKyujitai', () => {
  it('旧字体→新字体', () => {
    expect(convertKyujitai('國會議事堂 學校 體育館', toShin).output).toBe(
      '国会議事堂 学校 体育館',
    );
  });

  it('新字体→旧字体', () => {
    expect(convertKyujitai('国会 学校 体育館 万円', toKyu).output).toBe(
      '國會 學校 體育館 萬圓',
    );
  });

  it('旧字体が複数ある字（辨・辯・瓣）は新字体の「弁」にまとめる', () => {
    expect(convertKyujitai('辨當 辯護 花瓣', toShin).output).toBe(
      '弁当 弁護 花弁',
    );
    expect(convertKyujitai('弁', toKyu).output).toBe('弁');
  });

  it('意味が分かれる字（台・予・欠）は新字体→旧字体で変換しない', () => {
    expect(convertKyujitai('台風 予め 欠席', toKyu).output).toBe(
      '台風 予め 欠席',
    );
    expect(convertKyujitai('臺 豫 缺', toShin).output).toBe('台 予 欠');
  });

  it('異体字（髙・﨑）は設定で切り替える', () => {
    expect(convertKyujitai('髙﨑', toShin).output).toBe('高崎');
    expect(
      convertKyujitai('髙﨑', { ...toShin, includeVariants: false }).output,
    ).toBe('髙﨑');
    expect(convertKyujitai('高崎', toKyu).output).toBe('高崎');
  });

  it('変換した文字を内訳として数える', () => {
    const r = convertKyujitai('國と國と學', toShin);
    expect(r.total).toBe(3);
    expect(r.changes).toEqual([
      { from: '國', to: '国', count: 2 },
      { from: '學', to: '学', count: 1 },
    ]);
  });

  it('対象外の文字・サロゲートペアはそのまま', () => {
    expect(convertKyujitai('abc 𠮷野家 ひらがな', toShin).output).toBe(
      'abc 𠮷野家 ひらがな',
    );
  });

  it('往復して元に戻る（辞書にある字）', () => {
    const text = '国学体万円';
    const back = convertKyujitai(convertKyujitai(text, toKyu).output, toShin);
    expect(back.output).toBe(text);
  });
});
