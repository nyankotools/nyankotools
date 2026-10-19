import { describe, it, expect } from 'vitest';
import {
  FORMAT_IDS,
  TOKEN_IDS,
  TOKEN_STRINGS,
  detectFromSample,
  formatSegments,
  getDateParts,
  parseFormat,
  renderAll,
  renderSegments,
} from './date-format-builder';

const iso = 'yyyy-MM-dd HH:mm:ss';

describe('parseFormat / renderSegments', () => {
  it('各書式の同等の指定が同じ結果になる', () => {
    const segs = parseFormat(iso, 'java');
    expect(renderSegments(segs, 'strftime').text).toBe('%Y-%m-%d %H:%M:%S');
    expect(renderSegments(segs, 'php').text).toBe('Y-m-d H:i:s');
    expect(renderSegments(segs, 'moment').text).toBe('YYYY-MM-DD HH:mm:ss');
    expect(renderSegments(segs, 'dotnet').text).toBe('yyyy-MM-dd HH:mm:ss');
    expect(renderSegments(segs, 'java').text).toBe(iso);
  });

  it('strftime の %F %T %D %R を展開する', () => {
    expect(renderSegments(parseFormat('%F %T', 'strftime'), 'java').text).toBe(
      iso,
    );
    expect(renderSegments(parseFormat('%D', 'strftime'), 'php').text).toBe(
      'm/d/y',
    );
    expect(renderSegments(parseFormat('%R', 'strftime'), 'php').text).toBe(
      'H:i',
    );
  });

  it('strftime の %-d・%#d はゼロ埋めなしになる', () => {
    const a = renderSegments(parseFormat('%-m/%-d', 'strftime'), 'php').text;
    const b = renderSegments(parseFormat('%#m/%#d', 'strftime'), 'php').text;
    expect(a).toBe('n/j');
    expect(b).toBe('n/j');
  });

  it('リテラルをエスケープする（Java / PHP / Moment / .NET）', () => {
    const segs = parseFormat('%Y-%m-%dT%H:%M:%S', 'strftime');
    expect(renderSegments(segs, 'java').text).toBe("yyyy-MM-dd'T'HH:mm:ss");
    expect(renderSegments(segs, 'php').text).toBe('Y-m-d\\TH:i:s');
    expect(renderSegments(segs, 'moment').text).toBe('YYYY-MM-DD[T]HH:mm:ss');
    expect(renderSegments(segs, 'dotnet').text).toBe("yyyy-MM-dd'T'HH:mm:ss");
  });

  it('引用されたリテラルを読み込める', () => {
    const java = parseFormat("yyyy'年'MM'月' 'o''clock'", 'java');
    expect(renderSegments(java, 'strftime').text).toBe("%Y年%m月 o'clock");
    const moment = parseFormat('[Today is] dddd', 'moment');
    expect(renderSegments(moment, 'strftime').text).toBe('Today is %A');
    const php = parseFormat('Y\\年m\\月', 'php');
    expect(renderSegments(php, 'java').text).toBe('yyyy年MM月');
    const net = parseFormat('yyyy\\/MM "at" HH', 'dotnet');
    expect(renderSegments(net, 'strftime').text).toBe('%Y/%m at %H');
  });

  it('strftime の % リテラルを %% にする', () => {
    const segs = parseFormat('100%% %Y', 'strftime');
    expect(renderSegments(segs, 'strftime').text).toBe('100%% %Y');
    expect(renderSegments(segs, 'java').text).toBe('100% yyyy');
  });

  it('Java の連続する % はそのままリテラル扱い', () => {
    const segs = parseFormat('%Y%%', 'strftime');
    expect(renderSegments(segs, 'java').text).toBe('yyyy%');
    expect(renderSegments(segs, 'strftime').text).toBe('%Y%%');
  });

  it('月名・曜日名・午前午後・時刻の区別', () => {
    const segs = parseFormat('EEEE, MMMM d, yyyy h:mm a', 'java');
    expect(renderSegments(segs, 'strftime').text).toBe(
      '%A, %B %-d, %Y %-I:%M %p',
    );
    expect(renderSegments(segs, 'php').text).toBe('l, F j, Y g:i A');
    expect(renderSegments(segs, 'moment').text).toBe(
      'dddd, MMMM D, YYYY h:mm A',
    );
    expect(renderSegments(segs, 'dotnet').text).toBe(
      'dddd, MMMM d, yyyy h:mm tt',
    );
  });

  it('ミリ秒・タイムゾーン', () => {
    const segs = parseFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", 'java');
    expect(renderSegments(segs, 'php').text).toBe('Y-m-d\\TH:i:s.vP');
    expect(renderSegments(segs, 'moment').text).toBe(
      'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
    );
    expect(renderSegments(segs, 'dotnet').text).toBe(
      "yyyy-MM-dd'T'HH:mm:ss.fffzzz",
    );
    expect(renderSegments(segs, 'strftime').text).toBe(
      '%Y-%m-%dT%H:%M:%S.%L%:z',
    );
  });

  it('その書式で表せない項目は省略して unsupported に載せる', () => {
    const segs = parseFormat('%Y-%j', 'strftime');
    const php = renderSegments(segs, 'php');
    expect(php.text).toBe('Y-');
    expect(php.unsupported).toEqual(['dayOfYear3']);
    const net = renderSegments(parseFormat('Z', 'java'), 'dotnet');
    expect(net.unsupported).toEqual(['tzOffset']);
    expect(net.text).toBe('');
  });

  it('解釈できない指定は dropped に載せる', () => {
    const r = renderSegments(parseFormat('%Y %Z %U', 'strftime'), 'java');
    expect(r.text).toBe('yyyy  ');
    expect(r.dropped).toEqual(['%Z', '%U']);
    const j = renderSegments(parseFormat('yyyy QQQ', 'java'), 'php');
    expect(j.dropped).toEqual(['QQQ']);
  });

  it('.NET は 1 文字だけの書式に % を付ける', () => {
    expect(renderSegments(parseFormat('%d', 'strftime'), 'dotnet').text).toBe(
      'dd',
    );
    expect(renderSegments(parseFormat('%-d', 'strftime'), 'dotnet').text).toBe(
      '%d',
    );
    expect(renderSegments(parseFormat('%-m', 'strftime'), 'dotnet').text).toBe(
      '%M',
    );
  });

  it('.NET の % プレフィックスを読み込める', () => {
    expect(renderSegments(parseFormat('%d', 'dotnet'), 'php').text).toBe('j');
  });

  it('空文字は空文字を返す', () => {
    for (const f of FORMAT_IDS) {
      expect(renderSegments(parseFormat('', f), f).text).toBe('');
    }
  });

  it('未終端の引用・末尾の % でも例外を出さない', () => {
    expect(() => parseFormat("yyyy 'abc", 'java')).not.toThrow();
    expect(() => parseFormat('yyyy "abc', 'dotnet')).not.toThrow();
    expect(() => parseFormat('Y\\', 'php')).not.toThrow();
    expect(() => parseFormat('YYYY [abc', 'moment')).not.toThrow();
    expect(renderSegments(parseFormat('%Y%', 'strftime'), 'java').text).toBe(
      'yyyy%',
    );
  });

  it('全書式でトークン→書式→トークンの往復が一致する', () => {
    for (const f of FORMAT_IDS) {
      for (const token of TOKEN_IDS) {
        const str = TOKEN_STRINGS[f][token];
        if (str === undefined) continue;
        const segs = parseFormat(str, f);
        expect(segs, `${f}:${token}`).toEqual([{ kind: 'token', token }]);
      }
    }
  });

  it('renderAll は全書式を返す', () => {
    const all = renderAll(parseFormat('yyyy', 'java'));
    expect(Object.keys(all)).toEqual([...FORMAT_IDS]);
  });
});

describe('全角数字の例文', () => {
  it('全角数字は半角と同じ書式として検出し、区切り文字はそのまま残す', () => {
    const half = detectFromSample('2026-10-19 15:04:05');
    const full = detectFromSample('２０２６-１０-１９ １５:０４:０５');
    expect(full.tokenCount).toBe(half.tokenCount);
    expect(renderSegments(full.segments, 'strftime').text).toBe(
      '%Y-%m-%d %H:%M:%S',
    );
    expect(
      renderSegments(detectFromSample('２０２６／１０／１９').segments, 'java')
        .text,
    ).toBe('yyyy／MM／dd');
  });
});

describe('入力の堅牢性（長い入力・絵文字・改行）', () => {
  it('長い例文でも例外を出さず項目を検出する', () => {
    const r = detectFromSample('2026-10-19 15:04:05 '.repeat(5000));
    expect(r.tokenCount).toBeGreaterThan(0);
    expect(() => parseFormat('%Y-'.repeat(20000), 'strftime')).not.toThrow();
    expect(() => detectFromSample('1'.repeat(200000))).not.toThrow();
  });

  it('絵文字・サロゲートペアを含む書式でも崩れない', () => {
    expect(renderSegments(parseFormat('🎉%Y 🗓', 'strftime'), 'java').text).toBe(
      '🎉yyyy 🗓',
    );
    expect(
      renderSegments(detectFromSample('🎉 2026-10-19').segments, 'strftime')
        .text,
    ).toBe('🎉 %Y-%m-%d');
    expect(renderSegments(parseFormat('🎉yyyy', 'java'), 'php').text).toBe(
      '🎉Y',
    );
  });

  it('CRLF を含む書式は改行をリテラルとして保持する', () => {
    expect(
      renderSegments(parseFormat('%Y\r\n%m', 'strftime'), 'java').text,
    ).toBe('yyyy\r\nMM');
  });
});

describe('formatSegments', () => {
  // 2026-10-19 (Mon) 15:04:05.007 UTC、+09:00 では 2026-10-20 00:04:05
  const date = new Date(Date.UTC(2026, 9, 19, 15, 4, 5, 7));

  it('UTC で整形する', () => {
    const p = getDateParts(date, 0);
    expect(
      formatSegments(parseFormat('%Y-%m-%d %H:%M:%S.%L', 'strftime'), p),
    ).toBe('2026-10-19 15:04:05.007');
    expect(
      formatSegments(parseFormat('dddd, MMM D, YYYY h:mm A', 'moment'), p),
    ).toBe('Monday, Oct 19, 2026 3:04 PM');
    expect(formatSegments(parseFormat('%j %y %z %:z', 'strftime'), p)).toBe(
      '292 26 +0000 +00:00',
    );
  });

  it('オフセットで日付が繰り上がる', () => {
    const p = getDateParts(date, 540);
    expect(
      formatSegments(parseFormat('yyyy/M/d H:mm EEE xxx', 'java'), p),
    ).toBe('2026/10/20 0:04 Tue +09:00');
    expect(formatSegments(parseFormat('hh a', 'java'), p)).toBe('12 AM');
  });

  it('負のオフセットと正午', () => {
    const noon = new Date(Date.UTC(2026, 0, 1, 12, 30));
    const p = getDateParts(noon, -330);
    expect(p.hour).toBe(7);
    expect(formatSegments(parseFormat('%z', 'strftime'), p)).toBe('-0530');
    expect(
      formatSegments(parseFormat('h A', 'moment'), getDateParts(noon, 0)),
    ).toBe('12 PM');
  });

  it('うるう年の通算日', () => {
    const p = getDateParts(new Date(Date.UTC(2024, 11, 31)), 0);
    expect(p.dayOfYear).toBe(366);
  });
});

describe('detectFromSample', () => {
  const detect = (s: string, f: (typeof FORMAT_IDS)[number] = 'java') =>
    renderSegments(detectFromSample(s).segments, f).text;

  it('ISO 風の日時', () => {
    expect(detect('2026-10-19 15:04:05')).toBe(iso);
    expect(detect('2026-10-19T15:04:05')).toBe("yyyy-MM-dd'T'HH:mm:ss");
  });

  it('ミリ秒とタイムゾーン', () => {
    expect(detect('2026-10-19T15:04:05.123+09:00')).toBe(
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    );
    expect(detect('2026-10-19 15:04:05 +0900', 'strftime')).toBe(
      '%Y-%m-%d %H:%M:%S %z',
    );
    expect(detect('2026-10-19T15:04:05,123', 'java')).toBe(
      "yyyy-MM-dd'T'HH:mm:ss,SSS",
    );
  });

  it('スラッシュ区切りは年が先なら年月日', () => {
    expect(detect('2026/10/19', 'strftime')).toBe('%Y/%m/%d');
    expect(detect('2026/1/9', 'php')).toBe('Y/n/j');
  });

  it('日本語の区切り', () => {
    expect(detect('2026年10月19日 15時04分')).toBe('yyyy年MM月dd日 HH時mm分');
  });

  it('月名・曜日名・午前午後', () => {
    expect(detect('Mon, Oct 19, 2026 3:04 PM')).toBe('EEE, MMM d, yyyy h:mm a');
    expect(detect('Monday, October 19, 2026')).toBe('EEEE, MMMM d, yyyy');
    expect(detect('19 October 2026', 'moment')).toBe('D MMMM YYYY');
    expect(detect('Oct 05, 2026', 'php')).toBe('M d, Y');
  });

  it('月/日/年と日.月.年の推測', () => {
    const us = detectFromSample('10/19/2026');
    expect(renderSegments(us.segments, 'strftime').text).toBe('%m/%d/%Y');
    expect(us.ambiguous).toBe(false);
    const eu = detectFromSample('19.10.2026');
    expect(renderSegments(eu.segments, 'strftime').text).toBe('%d.%m.%Y');
    expect(eu.ambiguous).toBe(false);
  });

  it('日月が両方 12 以下なら推測して ambiguous を立てる', () => {
    const a = detectFromSample('03/04/2026');
    expect(renderSegments(a.segments, 'strftime').text).toBe('%m/%d/%Y');
    expect(a.ambiguous).toBe(true);
    const b = detectFromSample('03.04.2026');
    expect(renderSegments(b.segments, 'strftime').text).toBe('%d.%m.%Y');
    expect(b.ambiguous).toBe(true);
  });

  it('年が先の場合は ambiguous にならない', () => {
    expect(detectFromSample('2026-03-04').ambiguous).toBe(false);
  });

  it('連続した数字（yyyyMMdd / yyyyMMddHHmmss）', () => {
    expect(detect('20261019')).toBe('yyyyMMdd');
    expect(detect('20261019150405')).toBe('yyyyMMddHHmmss');
    expect(detect('202610191504')).toBe('yyyyMMddHHmm');
  });

  it('時刻のみ・24 時間表記と 12 時間表記', () => {
    expect(detect('15:04')).toBe('HH:mm');
    expect(detect('9:05:07')).toBe('H:mm:ss');
    expect(detect('09:05 AM')).toBe('hh:mm a');
  });

  it('年が 2 桁の形式', () => {
    expect(detect('26-10-19')).toBe('yy-MM-dd');
    expect(detect('10/19/26', 'strftime')).toBe('%m/%d/%y');
  });

  it('月日のみ', () => {
    expect(detect('10/19', 'strftime')).toBe('%m/%d');
    expect(detect('19/10', 'strftime')).toBe('%d/%m');
  });

  it('日付を含まない文字列は項目 0 件', () => {
    const r = detectFromSample('hello world');
    expect(r.tokenCount).toBe(0);
    expect(r.ambiguous).toBe(false);
    expect(detectFromSample('').tokenCount).toBe(0);
  });

  it('範囲外の数字は日付として扱わない', () => {
    expect(detect('2026-13-45')).toBe('yyyy-13-45');
  });

  it('検出結果を書式で整形すると例文に戻る', () => {
    const samples = [
      '2026-10-19 15:04:05',
      '2026-10-19T15:04:05.123+09:00',
      'Mon, Oct 19, 2026 3:04 PM',
      '19.10.2026',
      '2026/01/09 07:08',
    ];
    for (const s of samples) {
      const r = detectFromSample(s);
      const p = getDateParts(
        s.includes('+09:00')
          ? new Date(Date.UTC(2026, 9, 19, 6, 4, 5, 123))
          : new Date(
              Date.UTC(
                2026,
                s.startsWith('2026/01') ? 0 : 9,
                s.startsWith('2026/01') ? 9 : 19,
                s.startsWith('2026/01') ? 7 : 15,
                s.startsWith('2026/01') ? 8 : 4,
                s.includes(':05') ? 5 : 0,
              ),
            ),
        s.includes('+09:00') ? 540 : 0,
      );
      if (s === '19.10.2026') continue;
      expect(formatSegments(r.segments, p), s).toBe(s);
    }
  });
});
