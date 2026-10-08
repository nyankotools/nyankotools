import { describe, expect, it } from 'vitest';
import {
  EN_PROMPTS,
  JA_PROMPTS,
  advance,
  calcStats,
  expectedChar,
  guideFor,
  keyLabel,
  normalizeKana,
  parseKana,
  pickPrompts,
  romajiGuide,
  weakKeys,
} from './typing-test';

/** kana を romaji で最後まで打てるか */
function types(kana: string, romaji: string): boolean {
  return parseKana(kana, romaji).complete;
}

describe('parseKana: 表記ゆれ', () => {
  it('し/ち/つ/ふ/じ の複数表記', () => {
    for (const r of ['si', 'shi', 'ci']) expect(types('し', r)).toBe(true);
    for (const r of ['ti', 'chi']) expect(types('ち', r)).toBe(true);
    for (const r of ['tu', 'tsu']) expect(types('つ', r)).toBe(true);
    for (const r of ['hu', 'fu']) expect(types('ふ', r)).toBe(true);
    for (const r of ['zi', 'ji']) expect(types('じ', r)).toBe(true);
  });

  it('ん は文末で nn/xn、子音の前では n 1回でよい', () => {
    expect(types('ほん', 'honn')).toBe(true);
    expect(types('ほん', 'hon')).toBe(false);
    expect(types('ほん', 'hoxn')).toBe(true);
    expect(types('かんさい', 'kansai')).toBe(true);
    expect(types('かんさい', 'kannsai')).toBe(true);
    expect(types('かんさい', 'kanxsai')).toBe(false);
  });

  it('ん の後ろが母音・な行・や行のときは n 1回では足りない', () => {
    expect(types('こんや', 'konya')).toBe(false);
    expect(types('こんや', 'konnya')).toBe(true);
    expect(types('こんいん', 'konin')).toBe(false);
    expect(types('こんいん', 'konnin')).toBe(false);
    expect(types('こんいん', 'konninn')).toBe(true);
    expect(types('さんねん', 'sannnenn')).toBe(true);
    expect(types('さんねん', 'sanen')).toBe(false);
  });

  it('っ は子音重ね・xtu・ltu・xtsu', () => {
    expect(types('がっこう', 'gakkou')).toBe(true);
    expect(types('がっこう', 'gaxtuko' + 'u')).toBe(true);
    expect(types('がっこう', 'galtukou')).toBe(true);
    expect(types('がっこう', 'gaxtsukou')).toBe(true);
    expect(types('いっぽ', 'ippo')).toBe(true);
    expect(types('まっち', 'matchi')).toBe(true);
    expect(types('まっち', 'macchi')).toBe(true);
    expect(types('まっち', 'matti')).toBe(true);
    expect(types('まっち', 'madchi')).toBe(false);
  });

  it('っ の後ろが母音・n のときは子音重ねできない', () => {
    expect(types('あっあ', 'aaa')).toBe(false);
    expect(types('あっあ', 'axtua')).toBe(true);
    expect(types('いっな', 'innna')).toBe(false);
  });

  it('小書き文字と拗音は一括でも分割でも打てる', () => {
    for (const r of ['kya', 'kixya', 'kilya'])
      expect(types('きゃ', r)).toBe(true);
    for (const r of ['sha', 'sya', 'sixya'])
      expect(types('しゃ', r)).toBe(true);
    for (const r of ['ja', 'zya', 'jya', 'jixya']) {
      expect(types('じゃ', r)).toBe(true);
    }
    for (const r of ['cha', 'tya', 'cya']) expect(types('ちゃ', r)).toBe(true);
    expect(types('ふぁ', 'fa')).toBe(true);
    expect(types('ふぁ', 'fuxa')).toBe(true);
    expect(types('てぃ', 'thi')).toBe(true);
    expect(types('うぃ', 'wi')).toBe(true);
    expect(types('あぁ', 'axa')).toBe(true);
    expect(types('あぁ', 'ala')).toBe(true);
  });

  it('長音・句読点・英数字・スペース', () => {
    expect(types('らーめん', 'ra-menn')).toBe(true);
    expect(types('あ、い。', 'a,i.')).toBe(true);
    expect(types('abc 1', 'abc 1')).toBe(true);
  });

  it('カタカナと大文字入力も受け付ける', () => {
    expect(normalizeKana('カタカナー')).toBe('かたかなー');
    expect(types('カタカナ', 'katakana')).toBe(true);
    expect(types('か', 'KA')).toBe(true);
  });
});

describe('parseKana: valid / complete', () => {
  it('途中までは valid だが complete ではない', () => {
    expect(parseKana('か', '')).toEqual({ valid: true, complete: false });
    expect(parseKana('かき', 'k')).toEqual({ valid: true, complete: false });
    expect(parseKana('かき', 'ka')).toEqual({ valid: true, complete: false });
    expect(parseKana('かき', 'kaki')).toEqual({ valid: true, complete: true });
  });

  it('矛盾する入力は invalid', () => {
    expect(parseKana('か', 'x').valid).toBe(false);
    expect(parseKana('か', 'kb').valid).toBe(false);
    expect(parseKana('か', 'kaa').valid).toBe(false);
  });

  it('1文字分打ち終えた直後は次の文字待ちで valid', () => {
    expect(parseKana('かき', 'ka').valid).toBe(true);
    expect(parseKana('かき', 'kak').valid).toBe(true);
    expect(parseKana('かき', 'kakk').valid).toBe(false);
  });
});

describe('romajiGuide', () => {
  it('入力なしなら標準的な表記を返す', () => {
    expect(romajiGuide('しんかんせん', '')).toBe('shinkansenn');
    expect(romajiGuide('ほん', '')).toBe('honn');
    expect(romajiGuide('がっこう', '')).toBe('gakkou');
  });

  it('入力済みの表記に合わせて残りを案内する', () => {
    expect(romajiGuide('しち', 'si')).toBe('sichi');
    expect(romajiGuide('しち', 'sit')).toBe('siti');
    expect(romajiGuide('かんさい', 'kans')).toBe('kansai');
    expect(romajiGuide('かんさい', 'kann')).toBe('kannsai');
  });

  it('矛盾する入力では null', () => {
    expect(romajiGuide('か', 'z')).toBeNull();
  });

  it('guideFor / expectedChar', () => {
    expect(expectedChar({ text: 'x', kana: 'ち' }, '')).toBe('c');
    expect(expectedChar({ text: 'x', kana: 'ち' }, 't')).toBe('i');
    expect(guideFor({ text: 'Hi.', kana: null }, 'H')).toBe('Hi.');
    expect(expectedChar({ text: 'Hi.', kana: null }, 'Hi.')).toBeNull();
  });
});

describe('advance', () => {
  const ja = { text: '猫', kana: 'ねこ' };
  it('日本語: 受理・ミス・完了', () => {
    let r = advance(ja, '', 'n');
    expect(r).toEqual({
      accepted: true,
      typed: 'n',
      complete: false,
      expected: null,
    });
    r = advance(ja, 'n', 'x');
    expect(r.accepted).toBe(false);
    expect(r.typed).toBe('n');
    expect(r.expected).toBe('e');
    r = advance(ja, 'neko'.slice(0, 3), 'o');
    expect(r.complete).toBe(true);
  });

  it('日本語: 大文字入力は小文字として受理する', () => {
    expect(advance(ja, '', 'N').typed).toBe('n');
  });

  it('英語: 大文字小文字を区別する', () => {
    const en = { text: 'Hi.', kana: null };
    expect(advance(en, '', 'h').accepted).toBe(false);
    expect(advance(en, '', 'h').expected).toBe('H');
    expect(advance(en, '', 'H').typed).toBe('H');
    expect(advance(en, 'Hi', '.').complete).toBe(true);
  });

  it('全お題を標準表記で最後まで打てる', () => {
    for (const prompt of [...JA_PROMPTS, ...EN_PROMPTS]) {
      const guide = guideFor(prompt, '');
      expect(guide.length).toBeGreaterThan(0);
      let typed = '';
      let done = false;
      for (const ch of guide) {
        const r = advance(prompt, typed, ch);
        expect(r.accepted, `${prompt.text} @ ${typed}${ch}`).toBe(true);
        typed = r.typed;
        done = r.complete;
      }
      expect(done, prompt.text).toBe(true);
    }
  });

  it('日本語のお題の kana はひらがな・ー・句読点・半角のみ', () => {
    for (const p of JA_PROMPTS) {
      expect(p.kana).toMatch(/^[ぁ-ゖー、。 ]+$/);
    }
  });
});

describe('calcStats', () => {
  it('60秒で300打鍵なら 60 WPM / 300 CPM', () => {
    const s = calcStats(300, 0, 60000);
    expect(s.wpm).toBe(60);
    expect(s.cpm).toBe(300);
    expect(s.accuracy).toBe(100);
  });

  it('正確性はミスを含めた打鍵数に対する割合', () => {
    expect(calcStats(90, 10, 30000).accuracy).toBe(90);
    expect(calcStats(2, 1, 30000).accuracy).toBe(66.7);
  });

  it('時間0や打鍵0では0を返す', () => {
    const s = calcStats(0, 0, 0);
    expect(s).toMatchObject({ wpm: 0, cpm: 0, accuracy: 0 });
    expect(calcStats(10, 0, 0).wpm).toBe(0);
  });
});

describe('weakKeys', () => {
  it('ミス数の多い順、同数はキー順', () => {
    expect(weakKeys({ a: 1, b: 3, c: 3, d: 0 })).toEqual([
      { key: 'b', misses: 3 },
      { key: 'c', misses: 3 },
      { key: 'a', misses: 1 },
    ]);
  });

  it('limit で件数を絞り、空なら空配列', () => {
    expect(weakKeys({ a: 1, b: 2, c: 3 }, 2)).toHaveLength(2);
    expect(weakKeys({})).toEqual([]);
  });

  it('keyLabel はスペースだけ名前にする', () => {
    expect(keyLabel(' ')).toBe('Space');
    expect(keyLabel('k')).toBe('k');
  });
});

describe('pickPrompts', () => {
  it('重複なしで指定件数を返す', () => {
    const picked = pickPrompts('ja', 10);
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((p) => p.text)).size).toBe(10);
    expect(picked.every((p) => p.kana !== null)).toBe(true);
  });

  it('英語は kana なし、件数超過は全件に丸める', () => {
    const picked = pickPrompts('en', 999);
    expect(picked).toHaveLength(EN_PROMPTS.length);
    expect(picked.every((p) => p.kana === null)).toBe(true);
  });

  it('rng を差し替えると決定的になる', () => {
    expect(pickPrompts('ja', 3, () => 0)).toEqual(
      pickPrompts('ja', 3, () => 0),
    );
  });
});
