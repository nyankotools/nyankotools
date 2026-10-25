import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  convertFrameRate,
  decodeSubtitleBytes,
  formatTimestamp,
  parseOffsetSeconds,
  parseSubtitle,
  serializeSrt,
  serializeVtt,
  shiftCues,
} from './subtitle-converter';

const SRT = `1
00:00:01,000 --> 00:00:03,500
こんにちは
世界

2
00:01:05,250 --> 00:01:08,000
二つ目
`;

describe('parseSubtitle', () => {
  it('SRT を解析する', () => {
    const r = parseSubtitle(SRT);
    expect(r.format).toBe('srt');
    expect(r.cues).toEqual([
      { start: 1000, end: 3500, text: 'こんにちは\n世界' },
      { start: 65250, end: 68000, text: '二つ目' },
    ]);
    expect(r.skipped).toBe(0);
  });

  it('CRLF と BOM を扱える', () => {
    const r = parseSubtitle('﻿' + SRT.replace(/\n/g, '\r\n'));
    expect(r.cues).toHaveLength(2);
    expect(r.cues[0].text).toBe('こんにちは\n世界');
  });

  it('VTT のヘッダ・NOTE・識別子・設定を扱う', () => {
    const vtt = `WEBVTT - title

NOTE これはコメント

intro
00:01.500 --> 00:03.000 line:90% align:center
Hello

01:00:00.000 --> 01:00:01.000
World
`;
    const r = parseSubtitle(vtt);
    expect(r.format).toBe('vtt');
    expect(r.cues).toEqual([
      {
        start: 1500,
        end: 3000,
        text: 'Hello',
        id: 'intro',
        settings: 'line:90% align:center',
      },
      { start: 3600000, end: 3601000, text: 'World' },
    ]);
  });

  it('ミリ秒の桁数が短くても補完する', () => {
    const r = parseSubtitle('1\n00:00:01,5 --> 00:00:02,25\nx');
    expect(r.cues[0].start).toBe(1500);
    expect(r.cues[0].end).toBe(2250);
  });

  it('解釈できないブロックは skipped に数える', () => {
    const r = parseSubtitle('1\nabc --> def\nx\n\nただの文章');
    expect(r.cues).toHaveLength(0);
    expect(r.skipped).toBe(2);
  });

  it('空文字は空の結果', () => {
    expect(parseSubtitle('')).toEqual({ format: 'srt', cues: [], skipped: 0 });
  });
});

describe('serialize', () => {
  it('SRT → VTT → SRT で内容が保たれる', () => {
    const cues = parseSubtitle(SRT).cues;
    const vtt = serializeVtt(cues);
    expect(vtt.startsWith('WEBVTT\n\n00:00:01.000 --> 00:00:03.500\n')).toBe(
      true,
    );
    const back = parseSubtitle(vtt);
    expect(back.format).toBe('vtt');
    expect(serializeSrt(back.cues)).toBe(SRT);
  });

  it('SRT 出力は連番を振り直し、設定を落とす', () => {
    const out = serializeSrt([
      { start: 0, end: 1000, text: 'a', id: 'x', settings: 'line:0' },
    ]);
    expect(out).toBe('1\n00:00:00,000 --> 00:00:01,000\na\n');
  });

  it('VTT 出力は識別子と設定を保つ', () => {
    const out = serializeVtt([
      { start: 0, end: 1000, text: 'a', id: 'x', settings: 'line:0' },
    ]);
    expect(out).toBe('WEBVTT\n\nx\n00:00:00.000 --> 00:00:01.000 line:0\na\n');
  });

  it('字幕がなくても VTT はヘッダを出す', () => {
    expect(serializeVtt([])).toBe('WEBVTT\n');
    expect(serializeSrt([])).toBe('');
  });

  it('1時間以上の時刻を整形する', () => {
    expect(formatTimestamp(3723456, ',')).toBe('01:02:03,456');
    expect(formatTimestamp(-5, '.')).toBe('00:00:00.000');
  });
});

describe('shiftCues', () => {
  const cues = [
    { start: 1000, end: 2000, text: 'a' },
    { start: 5000, end: 6000, text: 'b' },
  ];
  it('遅らせる', () => {
    expect(shiftCues(cues, 1500).map((c) => c.start)).toEqual([2500, 6500]);
  });
  it('早めて負になる分は 0 に切り上げ、完全に前にある字幕は削除する', () => {
    const r = shiftCues(cues, -2500);
    expect(r).toEqual([{ start: 2500, end: 3500, text: 'b' }]);
    const r2 = shiftCues(cues, -1200);
    expect(r2[0]).toEqual({ start: 0, end: 800, text: 'a' });
  });
  it('0 のときはコピーを返す', () => {
    const r = shiftCues(cues, 0);
    expect(r).toEqual(cues);
    expect(r[0]).not.toBe(cues[0]);
  });
});

describe('convertFrameRate', () => {
  it('23.976 → 25 で時刻を縮める', () => {
    const r = convertFrameRate(
      [{ start: 25000, end: 50000, text: 'a' }],
      25,
      23.976,
    );
    expect(r[0].start).toBe(Math.round((25000 * 25) / 23.976));
  });
  it('同じ fps なら変わらない', () => {
    const r = convertFrameRate([{ start: 1234, end: 5678, text: 'a' }], 24, 24);
    expect(r[0]).toEqual({ start: 1234, end: 5678, text: 'a' });
  });
  it('0 以下の fps は例外', () => {
    expect(() => convertFrameRate([], 0, 24)).toThrow();
  });
});

describe('parseOffsetSeconds', () => {
  it('小数・符号・全角を受け付ける', () => {
    expect(parseOffsetSeconds('1.5')).toEqual({ ok: true, value: 1500 });
    expect(parseOffsetSeconds('-2')).toEqual({ ok: true, value: -2000 });
    expect(parseOffsetSeconds('－０．２５')).toEqual({ ok: true, value: -250 });
    expect(parseOffsetSeconds('')).toEqual({ ok: true, value: 0 });
  });
  it('不正値と範囲外を弾く', () => {
    expect(parseOffsetSeconds('abc')).toEqual({ ok: false, error: 'invalid' });
    expect(parseOffsetSeconds('100000')).toEqual({
      ok: false,
      error: 'outOfRange',
    });
  });
});

describe('decodeSubtitleBytes', () => {
  const sjis = new Uint8Array([
    0x82, 0xb1, 0x82, 0xf1, 0x82, 0xc9, 0x82, 0xbf, 0x82, 0xcd,
  ]); // こんにちは
  it('UTF-8 を自動判定する', () => {
    const r = decodeSubtitleBytes(new TextEncoder().encode('こんにちは'));
    expect(r).toEqual({
      text: 'こんにちは',
      encoding: 'utf-8',
      invalidCount: 0,
    });
  });
  it('Shift_JIS を自動判定する', () => {
    const r = decodeSubtitleBytes(sjis);
    expect(r.encoding).toBe('shift_jis');
    expect(r.text).toBe('こんにちは');
  });
  it('文字コードを指定すると UTF-8 で読むため文字化けを数える', () => {
    const r = decodeSubtitleBytes(sjis, 'utf-8');
    expect(r.invalidCount).toBeGreaterThan(0);
  });
  it('UTF-16LE の BOM を判定する', () => {
    const r = decodeSubtitleBytes(
      new Uint8Array([0xff, 0xfe, 0x41, 0x00, 0x42, 0x00]),
    );
    expect(r.encoding).toBe('utf-16le');
    expect(r.text.replace('﻿', '')).toBe('AB');
  });
});

describe('buildOutputFileName', () => {
  it('拡張子を差し替える', () => {
    expect(buildOutputFileName('movie.ja.srt', 'vtt')).toBe('movie.ja.vtt');
    expect(buildOutputFileName('.srt', 'srt')).toBe('subtitle.srt');
    expect(buildOutputFileName('noext', 'srt')).toBe('noext.srt');
  });
});

describe('レビュー指摘の回帰', () => {
  it('空白だけの行で区切られたSRTも別cueとして解析する', () => {
    const srt =
      '1\n00:00:01,000 --> 00:00:02,000\nA\n  \n2\n00:00:03,000 --> 00:00:04,000\nB\n';
    expect(parseSubtitle(srt).cues).toHaveLength(2);
  });

  it('SRTの座標指定はVTT出力に含めない', () => {
    const srt = '1\n00:00:01,000 --> 00:00:02,000 X1:100 X2:200\nA\n';
    expect(serializeVtt(parseSubtitle(srt).cues)).not.toContain('X1');
  });
});

describe('追加のエッジケース', () => {
  it('CR のみ・LF と CRLF の混在でも別 cue として解析する', () => {
    const cr =
      '1\r00:00:01,000 --> 00:00:02,000\rA\r\r2\r00:00:03,000 --> 00:00:04,000\rB';
    expect(parseSubtitle(cr).cues.map((c) => c.text)).toEqual(['A', 'B']);
    const mixed =
      '1\r\n00:00:01,000 --> 00:00:02,000\nA\r\n\n2\r\n00:00:03,000 --> 00:00:04,000\nB\n';
    expect(parseSubtitle(mixed).cues).toHaveLength(2);
  });

  it('絵文字（サロゲートペア）を壊さず SRT/VTT の往復で保つ', () => {
    const srt = '1\n00:00:01,000 --> 00:00:02,000\n😀🎉 テスト\n';
    const cues = parseSubtitle(srt).cues;
    expect(cues[0].text).toBe('😀🎉 テスト');
    expect(serializeVtt(cues)).toContain('😀🎉 テスト');
    expect(serializeSrt(parseSubtitle(serializeVtt(cues)).cues)).toBe(srt);
  });

  it('空白のみ・空行だけの入力は cue なし', () => {
    expect(parseSubtitle('   \n\n  \n')).toEqual({
      format: 'srt',
      cues: [],
      skipped: 0,
    });
    expect(serializeSrt([])).toBe('');
  });

  it('100 時間を超える時刻も解析できる', () => {
    const r = parseSubtitle('1\n100:00:00,000 --> 100:00:01,000\nx');
    expect(r.cues[0].start).toBe(100 * 3600 * 1000);
  });

  it('大量の cue（5000件）でも解析・出力できる', () => {
    const cues = Array.from({ length: 5000 }, (_, i) => ({
      start: i * 2000,
      end: i * 2000 + 1500,
      text: `行 ${i}`,
    }));
    const srt = serializeSrt(cues);
    const back = parseSubtitle(srt);
    expect(back.cues).toHaveLength(5000);
    expect(back.cues[4999]).toEqual(cues[4999]);
    expect(back.skipped).toBe(0);
  });

  it('shiftCues で終了時刻がちょうど 0 の字幕は削除される', () => {
    const r = shiftCues([{ start: 0, end: 1000, text: 'a' }], -1000);
    expect(r).toEqual([]);
  });

  it('UTF-8 の BOM 付きバイト列は BOM を除いて読める', () => {
    const bytes = new Uint8Array([
      0xef,
      0xbb,
      0xbf,
      0xe3,
      0x81,
      0x82, // BOM + あ
    ]);
    const r = decodeSubtitleBytes(bytes);
    expect(r.encoding).toBe('utf-8');
    expect(r.text).toBe('あ');
  });

  it('空のバイト列は空文字（UTF-8扱い）', () => {
    expect(decodeSubtitleBytes(new Uint8Array(0))).toEqual({
      text: '',
      encoding: 'utf-8',
      invalidCount: 0,
    });
  });

  it('文字コードを shift_jis と明示すると Shift_JIS で読む', () => {
    const sjis = new Uint8Array([0x82, 0xa0]); // あ
    expect(decodeSubtitleBytes(sjis, 'shift_jis').text).toBe('あ');
  });
});
