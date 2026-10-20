import { describe, it, expect } from 'vitest';
import {
  ADDRESS_SIZE_MAX,
  ADDRESS_SIZE_MIN,
  NAME_SIZE_MAX,
  NAME_SIZE_MIN,
  SENDER_SIZE_MAX,
  SENDER_SIZE_MIN,
  composeRecipientName,
  DEFAULT_OPTIONS,
  ENVELOPES,
  layoutEnvelope,
  parsePostal,
  splitLines,
  toKanjiDigits,
  validateOptions,
  verticalSegments,
  type Box,
  type EnvelopeOptions,
} from './envelope-printer';

const opts = (o: Partial<EnvelopeOptions> = {}): EnvelopeOptions => ({
  ...DEFAULT_OPTIONS,
  ...o,
});

describe('ENVELOPES', () => {
  it('JIS寸法（横向きの幅×高さ）', () => {
    expect(ENVELOPES.nagagata3).toEqual({ widthMm: 235, heightMm: 120 });
    expect(ENVELOPES.nagagata4).toEqual({ widthMm: 205, heightMm: 90 });
    expect(ENVELOPES.youkei2).toEqual({ widthMm: 162, heightMm: 114 });
    expect(ENVELOPES.youkei4).toEqual({ widthMm: 235, heightMm: 105 });
  });
});

describe('parsePostal', () => {
  it('ハイフン・〒・全角数字を許容する', () => {
    expect(parsePostal('100-0001')).toEqual({ digits: '1000001', valid: true });
    expect(parsePostal('〒１００－０００１')).toEqual({
      digits: '1000001',
      valid: true,
    });
    expect(parsePostal(' 1000001 ')).toEqual({
      digits: '1000001',
      valid: true,
    });
  });
  it('空欄は有効（枠のみ）', () => {
    expect(parsePostal('')).toEqual({ digits: '', valid: true });
    expect(parsePostal('〒 ')).toEqual({ digits: '', valid: true });
  });
  it('7桁でなければ無効', () => {
    expect(parsePostal('100-000').valid).toBe(false);
    expect(parsePostal('100-00011').valid).toBe(false);
    expect(parsePostal('abc-defg').valid).toBe(false);
  });
});

describe('toKanjiDigits', () => {
  it('位取りの漢数字にする', () => {
    expect(toKanjiDigits('10')).toBe('一〇');
    expect(toKanjiDigits('1丁目２番3号')).toBe('一丁目二番三号');
  });
});

describe('verticalSegments', () => {
  it('tcy: 1〜2桁は縦中横、3桁以上は正立', () => {
    expect(verticalSegments('千代田1丁目23番456号', 'tcy')).toEqual([
      { text: '千代田', kind: 'plain' },
      { text: '1', kind: 'tcy' },
      { text: '丁目', kind: 'plain' },
      { text: '23', kind: 'tcy' },
      { text: '番', kind: 'plain' },
      { text: '456', kind: 'upright' },
      { text: '号', kind: 'plain' },
    ]);
  });
  it('数字に挟まれたハイフンは「ー」にする', () => {
    expect(verticalSegments('1-2-3', 'tcy').map((s) => s.text)).toEqual([
      '1',
      'ー',
      '2',
      'ー',
      '3',
    ]);
    expect(verticalSegments('1－2', 'kanji')).toEqual([
      { text: '一ー二', kind: 'plain' },
    ]);
  });
  it('数字に挟まれないハイフンはそのまま', () => {
    expect(verticalSegments('A-B', 'tcy')).toEqual([
      { text: 'A-B', kind: 'plain' },
    ]);
  });
  it('全角数字も半角にして扱う', () => {
    expect(verticalSegments('１２', 'tcy')).toEqual([
      { text: '12', kind: 'tcy' },
    ]);
  });
  it('asis は変換しない・空文字は空配列', () => {
    expect(verticalSegments('1-2', 'asis')).toEqual([
      { text: '1-2', kind: 'plain' },
    ]);
    expect(verticalSegments('', 'tcy')).toEqual([]);
  });
});

describe('splitLines / composeRecipientName', () => {
  it('空行を除き前後の空白を削る', () => {
    expect(splitLines(' a \r\n\n b\n')).toEqual(['a', 'b']);
  });
  it('敬称を全角空白で付ける', () => {
    expect(composeRecipientName('山田 太郎', 'sama')).toBe('山田 太郎　様');
    expect(composeRecipientName('株式会社〇〇', 'onchu')).toBe(
      '株式会社〇〇　御中',
    );
    expect(composeRecipientName('山田', 'none')).toBe('山田');
    expect(composeRecipientName('  ', 'sama')).toBe('');
  });
});

describe('validateOptions', () => {
  it('既定値は有効', () => {
    expect(validateOptions(opts())).toBeNull();
  });
  it('郵便番号・文字サイズの範囲外を検出する', () => {
    expect(validateOptions(opts({ recipientPostal: '123' }))).toBe(
      'recipientPostal',
    );
    expect(validateOptions(opts({ senderPostal: '12' }))).toBe('senderPostal');
    expect(validateOptions(opts({ addressSizeMm: 2 }))).toBe('addressSize');
    expect(validateOptions(opts({ nameSizeMm: 15 }))).toBe('nameSize');
    expect(validateOptions(opts({ senderSizeMm: Number.NaN }))).toBe(
      'senderSize',
    );
  });
});

describe('layoutEnvelope', () => {
  it('宛先郵便番号の枠は7つ・数字が入る', () => {
    const l = layoutEnvelope(opts({ recipientPostal: '100-0001' }));
    expect(l.recipientPostal).toHaveLength(7);
    expect(l.recipientPostal.map((f) => f.digit).join('')).toBe('1000001');
    expect(l.senderPostal.every((f) => f.digit === '')).toBe(true);
  });
  it('縦書き: 全要素が封筒の内側に収まる', () => {
    for (const env of Object.keys(ENVELOPES) as (keyof typeof ENVELOPES)[]) {
      const l = layoutEnvelope(opts({ envelope: env }));
      const { widthMm: w, heightMm: h } = ENVELOPES[env];
      for (const b of [l.recipientAddress, l.recipientName, l.sender]) {
        expect(b.leftMm).toBeGreaterThanOrEqual(0);
        expect(b.leftMm + b.widthMm).toBeLessThanOrEqual(w);
        expect(b.topMm + b.heightMm).toBeLessThanOrEqual(h);
        expect(b.widthMm).toBeGreaterThan(0);
        expect(b.heightMm).toBeGreaterThan(0);
      }
      for (const f of [...l.recipientPostal, ...l.senderPostal]) {
        expect(f.xMm).toBeGreaterThanOrEqual(0);
        expect(f.xMm + f.widthMm).toBeLessThanOrEqual(w);
        expect(f.yMm + f.heightMm).toBeLessThanOrEqual(h);
      }
    }
  });
  it('横書き: 全要素が封筒の内側に収まる', () => {
    for (const env of Object.keys(ENVELOPES) as (keyof typeof ENVELOPES)[]) {
      const l = layoutEnvelope(opts({ envelope: env, writing: 'horizontal' }));
      const { widthMm: w, heightMm: h } = ENVELOPES[env];
      for (const b of [l.recipientAddress, l.recipientName, l.sender]) {
        expect(b.leftMm + b.widthMm).toBeLessThanOrEqual(w);
        expect(b.topMm + b.heightMm).toBeLessThanOrEqual(h);
        expect(b.heightMm).toBeGreaterThan(0);
      }
      for (const f of [...l.recipientPostal, ...l.senderPostal]) {
        expect(f.xMm + f.widthMm).toBeLessThanOrEqual(w);
        expect(f.yMm + f.heightMm).toBeLessThanOrEqual(h);
      }
    }
  });
  it('文字サイズを最大・最小にしても全要素が封筒の内側に収まり、重ならない', () => {
    for (const env of Object.keys(ENVELOPES) as (keyof typeof ENVELOPES)[]) {
      for (const writing of ['vertical', 'horizontal'] as const) {
        for (const [address, name, sender] of [
          [ADDRESS_SIZE_MIN, NAME_SIZE_MIN, SENDER_SIZE_MIN],
          [ADDRESS_SIZE_MAX, NAME_SIZE_MAX, SENDER_SIZE_MAX],
        ]) {
          const l = layoutEnvelope(
            opts({
              envelope: env,
              writing,
              addressSizeMm: address,
              nameSizeMm: name,
              senderSizeMm: sender,
            }),
          );
          const { widthMm: w, heightMm: h } = ENVELOPES[env];
          const boxes = [l.recipientAddress, l.recipientName, l.sender];
          for (const b of boxes) {
            expect(b.leftMm).toBeGreaterThanOrEqual(0);
            expect(b.topMm).toBeGreaterThanOrEqual(0);
            expect(b.leftMm + b.widthMm).toBeLessThanOrEqual(w);
            expect(b.topMm + b.heightMm).toBeLessThanOrEqual(h);
          }
          const overlap = (p: Box, q: Box) =>
            p.leftMm < q.leftMm + q.widthMm &&
            q.leftMm < p.leftMm + p.widthMm &&
            p.topMm < q.topMm + q.heightMm &&
            q.topMm < p.topMm + p.heightMm;
          expect(overlap(l.sender, l.recipientName)).toBe(false);
          expect(overlap(l.sender, l.recipientAddress)).toBe(false);
          expect(overlap(l.recipientAddress, l.recipientName)).toBe(false);
        }
      }
    }
  });
  it('縦書き: 住所は宛名より右、宛名は封筒の中央', () => {
    const l = layoutEnvelope(opts());
    expect(l.recipientAddress.leftMm).toBeGreaterThan(
      l.recipientName.leftMm + l.recipientName.widthMm,
    );
    expect(l.recipientName.leftMm + l.recipientName.widthMm / 2).toBeCloseTo(
      117.5,
    );
  });
});
