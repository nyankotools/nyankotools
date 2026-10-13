import { describe, expect, it } from 'vitest';
import {
  LIGHT_MAX_WPM,
  UNKNOWN_MARK,
  buildTimeline,
  clampFrequency,
  clampWpm,
  decodeMorse,
  effectiveWpm,
  encodeMorse,
  formatMorse,
  maxFlashesPerSecond,
  normalizeMorseSymbols,
  timelineSeconds,
  unitSeconds,
} from './morse-code-converter';

const intl = { code: 'international', wordSeparator: 'slash' } as const;
const wabun = { code: 'wabun', wordSeparator: 'slash' } as const;

describe('encodeMorse（欧文）', () => {
  it('SOS を符号にする', () => {
    expect(encodeMorse('SOS', intl).morse).toBe('... --- ...');
  });

  it('小文字・全角英数字も扱い、単語を / で区切る', () => {
    expect(encodeMorse('hello ＷＯＲＬＤ', intl).morse).toBe(
      '.... . .-.. .-.. --- / .-- --- .-. .-.. -..',
    );
  });

  it('数字と約物を変換する', () => {
    expect(encodeMorse('2025.', intl).morse).toBe(
      '..--- ----- ..--- ..... .-.-.-',
    );
    expect(encodeMorse('?', intl).morse).toBe('..--..');
    expect(encodeMorse('@', intl).morse).toBe('.--.-.');
  });

  it('単語区切りを空白3つにできる', () => {
    expect(
      encodeMorse('A B', { code: 'international', wordSeparator: 'space' })
        .morse,
    ).toBe('.-   -...');
  });

  it('改行を保ち、空行も残す', () => {
    expect(encodeMorse('E\n\nT', intl).morse).toBe('.\n\n-');
  });

  it('変換できない文字は □ にして一覧に出す', () => {
    const result = encodeMorse('A あ B あ ß', intl);
    expect(result.morse).toBe(
      `.- / ${UNKNOWN_MARK} / -... / ${UNKNOWN_MARK} / ${UNKNOWN_MARK}`,
    );
    expect(result.unsupported).toEqual(['あ', 'ß']);
  });

  it('空文字は空を返す', () => {
    expect(encodeMorse('', intl)).toEqual({ morse: '', unsupported: [] });
    expect(encodeMorse('   ', intl).morse).toBe('');
  });
});

describe('encodeMorse（和文）', () => {
  it('カタカナ・ひらがなを同じ符号にする', () => {
    expect(encodeMorse('イロハ', wabun).morse).toBe('.- .-.- -...');
    expect(encodeMorse('いろは', wabun).morse).toBe('.- .-.- -...');
  });

  it('濁点・半濁点を別の符号として付ける', () => {
    // ガ = カ + 濁点
    expect(encodeMorse('ガ', wabun).morse).toBe('.-.. ..');
    // パ = ハ + 半濁点
    expect(encodeMorse('ぱ', wabun).morse).toBe('-... ..--.');
    // ヴ = ウ + 濁点
    expect(encodeMorse('ヴ', wabun).morse).toBe('..- ..');
  });

  it('半角カナ・単独の濁点記号を扱う', () => {
    expect(encodeMorse('ｶﾞ', wabun).morse).toBe('.-.. ..');
    expect(encodeMorse('カ゛', wabun).morse).toBe('.-.. ..');
  });

  it('長音・句読点・括弧・数字', () => {
    expect(encodeMorse('ラーメン', wabun).morse).toBe('... .--.- -...- .-.-.');
    expect(encodeMorse('、。', wabun).morse).toBe('.-.-.- .-.-..');
    expect(encodeMorse('(ア)', wabun).morse).toBe('-.--.- --.-- .-..-.');
    expect(encodeMorse('1', wabun).morse).toBe('.----');
  });

  it('小書き文字は大きい文字として送る', () => {
    expect(encodeMorse('ッ', wabun).morse).toBe(encodeMorse('ツ', wabun).morse);
    expect(encodeMorse('ャ', wabun).morse).toBe(encodeMorse('ヤ', wabun).morse);
  });

  it('漢字や英字は変換できない文字として示す', () => {
    const result = encodeMorse('猫 A', wabun);
    expect(result.morse).toBe(`${UNKNOWN_MARK} / ${UNKNOWN_MARK}`);
    expect(result.unsupported).toEqual(['猫', 'A']);
  });
});

describe('decodeMorse', () => {
  it('欧文を文字に戻す', () => {
    expect(decodeMorse('... --- ...', 'international')).toEqual({
      text: 'SOS',
      unknown: [],
    });
    expect(decodeMorse('.... .. / - .... . .-. .', 'international').text).toBe(
      'HI THERE',
    );
  });

  it('全角の・－や空白3つの単語区切りを受け付ける', () => {
    expect(decodeMorse('・・・ －－－ ・・・', 'international').text).toBe(
      'SOS',
    );
    expect(decodeMorse('.-   -...', 'international').text).toBe('A B');
  });

  it('解読できない符号は □ にして一覧に出す', () => {
    const result = decodeMorse('.- ........ -...', 'international');
    expect(result.text).toBe(`A${UNKNOWN_MARK}B`);
    expect(result.unknown).toEqual(['........']);
  });

  it('符号以外の文字も解読不能として扱う', () => {
    const result = decodeMorse('.- x', 'international');
    expect(result.text).toBe(`A${UNKNOWN_MARK}`);
    expect(result.unknown).toEqual(['x']);
  });

  it('和文では濁点・半濁点を直前のかなに合成する', () => {
    expect(decodeMorse('.-.. ..', 'wabun').text).toBe('ガ');
    expect(decodeMorse('-... ..--.', 'wabun').text).toBe('パ');
    expect(decodeMorse('..- ..', 'wabun').text).toBe('ヴ');
  });

  it('合成できない濁点は記号のまま残す', () => {
    expect(decodeMorse('..', 'wabun').text).toBe('゛');
    expect(decodeMorse('.- ..', 'wabun').text).toBe('イ゛');
  });

  it('和文の長音・句読点を戻す', () => {
    expect(decodeMorse('... .--.- -...- .-.-.', 'wabun').text).toBe('ラーメン');
    expect(decodeMorse('.-.-.- .-.-..', 'wabun').text).toBe('、。');
  });

  it('同じ符号でも欧文と和文で意味が変わる', () => {
    expect(decodeMorse('.-', 'international').text).toBe('A');
    expect(decodeMorse('.-', 'wabun').text).toBe('イ');
  });

  it('往復で元に戻る', () => {
    const text = 'HELLO, WORLD 123';
    expect(
      decodeMorse(encodeMorse(text, intl).morse, 'international').text,
    ).toBe(text);
    const kana = 'ガッコウ ノ ハンバーガー、ペン。';
    const back = decodeMorse(encodeMorse(kana, wabun).morse, 'wabun').text;
    // 小書き文字は大きい文字として送られる
    expect(back).toBe('ガツコウ ノ ハンバーガー、ペン。');
  });

  it('空入力は空', () => {
    expect(decodeMorse('', 'international')).toEqual({ text: '', unknown: [] });
  });
});

describe('formatMorse / normalizeMorseSymbols', () => {
  it('全角表記に切り替え、正規化で戻せる', () => {
    const morse = '... --- ...';
    const formatted = formatMorse(morse, 'fullwidth');
    expect(formatted).toBe('・・・ －－－ ・・・');
    expect(normalizeMorseSymbols(formatted)).toBe(morse);
    expect(formatMorse(morse, 'ascii')).toBe(morse);
  });
});

describe('再生タイミング', () => {
  it('短点1・長点3・符号間1・文字間3・単語間7の単位で並べる', () => {
    expect(buildTimeline('.- / .')).toEqual([
      { on: true, units: 1 },
      { on: false, units: 1 },
      { on: true, units: 3 },
      { on: false, units: 7 },
      { on: true, units: 1 },
    ]);
    expect(buildTimeline('. .')).toEqual([
      { on: true, units: 1 },
      { on: false, units: 3 },
      { on: true, units: 1 },
    ]);
  });

  it('全角表記・□・空入力に対応する', () => {
    expect(buildTimeline('・ －')).toEqual(buildTimeline('. -'));
    expect(buildTimeline(`. ${UNKNOWN_MARK} .`)).toEqual(buildTimeline('. .'));
    expect(buildTimeline('')).toEqual([]);
  });

  it('PARIS は 50 単位で、WPM から長さが決まる', () => {
    const paris = encodeMorse('PARIS', intl).morse;
    // 文字内の間・文字間まで数えた PARIS は 43 単位。語間 7 を足して 50 単位
    expect(timelineSeconds(buildTimeline(paris), 20)).toBeCloseTo(43 * 0.06);
    expect(unitSeconds(20)).toBeCloseTo(0.06);
  });

  it('光では速度を抑え、点滅は毎秒3回以下になる', () => {
    expect(effectiveWpm(30, true)).toBe(LIGHT_MAX_WPM);
    expect(effectiveWpm(30, false)).toBe(30);
    expect(effectiveWpm(5, true)).toBe(5);
    expect(maxFlashesPerSecond(LIGHT_MAX_WPM)).toBeLessThanOrEqual(3);
  });

  it('WPM と周波数を範囲に収める', () => {
    expect(clampWpm(1)).toBe(5);
    expect(clampWpm(999)).toBe(40);
    expect(clampWpm(Number.NaN)).toBe(15);
    expect(clampFrequency(50)).toBe(300);
    expect(clampFrequency(5000)).toBe(1000);
    expect(clampFrequency(Number.NaN)).toBe(600);
  });
});

describe('境界・多バイト文字（追加）', () => {
  it('サロゲートペアの絵文字は1文字の変換不能として扱う', () => {
    const result = encodeMorse('A😀', intl);
    expect(result.morse).toBe(`.- ${UNKNOWN_MARK}`);
    expect(result.unsupported).toEqual(['😀']);
  });

  it('和文でも絵文字・結合文字の単独濁点で壊れない', () => {
    expect(encodeMorse('😀', wabun).unsupported).toEqual(['😀']);
    expect(decodeMorse('.- ..', 'wabun').text).toBe('イ゛');
  });

  it('CRLF・CR の改行を保つ', () => {
    expect(encodeMorse('E\r\nT', intl).morse).toBe('.\n-');
    expect(decodeMorse('.\r\n-', 'international').text).toBe('E\nT');
  });

  it('大きな入力（約1万文字）も変換と往復で壊れない', () => {
    const text = 'SOS HELP '.repeat(1200);
    const morse = encodeMorse(text, intl).morse;
    expect(decodeMorse(morse, 'international').text).toBe(text.trimEnd());
  });

  it('大きな符号列の再生タイミングも単位数で計算できる', () => {
    const segments = buildTimeline(encodeMorse('E'.repeat(5000), intl).morse);
    expect(segments.length).toBeGreaterThan(0);
    expect(timelineSeconds(segments, 15)).toBeGreaterThan(0);
  });

  it('解読の空白だけの入力は空、和文の□は未解読として扱う', () => {
    // 空白だけの行は空行として残る（改行の数は保つ）
    expect(decodeMorse('   \n  ', 'wabun')).toEqual({
      text: '\n',
      unknown: [],
    });
    expect(decodeMorse('   ', 'wabun')).toEqual({ text: '', unknown: [] });
    expect(decodeMorse('□', 'wabun').unknown).toEqual(['□']);
  });
});
