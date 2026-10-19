import { describe, expect, it } from 'vitest';
import {
  EPOCH_DISCORD,
  EPOCH_TWITTER,
  MAX_LINES,
  decodeId,
  decodeMany,
  resultsToTsv,
  toDecodedTime,
  type DecodeOptions,
} from './snowflake-id-decoder';

const twitter: DecodeOptions = { epochPreset: 'twitter', customEpochMs: 0 };
const discord: DecodeOptions = { epochPreset: 'discord', customEpochMs: 0 };

function field(r: ReturnType<typeof decodeId>, key: string) {
  if (!r.ok) throw new Error('not ok');
  return r.fields.find((f) => f.key === key)?.value;
}

describe('Snowflake', () => {
  it('Twitter形式で時刻と構成要素をデコードする', () => {
    const ms = 1700000000000;
    const id =
      (BigInt(ms - EPOCH_TWITTER) << 22n) | (3n << 17n) | (7n << 12n) | 99n;
    const r = decodeId(id.toString(), twitter);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.kind).toBe('snowflake');
    expect(r.time?.unixMs).toBe(ms);
    expect(r.time?.iso).toBe('2023-11-14T22:13:20.000Z');
    expect(r.time?.jst).toBe('2023-11-15T07:13:20.000+09:00');
    expect(field(r, 'datacenter')).toBe('3');
    expect(field(r, 'worker')).toBe('7');
    expect(field(r, 'sequence')).toBe('99');
  });

  it('Discordエポックと項目名を切り替える', () => {
    const ms = 1700000000000;
    const id =
      (BigInt(ms - EPOCH_DISCORD) << 22n) | (1n << 17n) | (2n << 12n) | 3n;
    const r = decodeId(id.toString(), discord);
    if (!r.ok) throw new Error('not ok');
    expect(r.time?.unixMs).toBe(ms);
    expect(field(r, 'discordWorker')).toBe('1');
    expect(field(r, 'discordProcess')).toBe('2');
    expect(field(r, 'increment')).toBe('3');
  });

  it('カスタムエポックを使える', () => {
    const r = decodeId('4194304', {
      epochPreset: 'custom',
      customEpochMs: 1000,
    });
    if (!r.ok) throw new Error('not ok');
    expect(r.time?.unixMs).toBe(1001);
  });

  it('53bitを超える値も精度を保つ', () => {
    const r = decodeId('18446744073709551615', twitter);
    if (!r.ok) throw new Error('not ok');
    expect(field(r, 'sequence')).toBe('4095');
    expect(field(r, 'datacenter')).toBe('31');
  });

  it('64bitを超える数値はエラー', () => {
    const r = decodeId('18446744073709551616', twitter);
    expect(r).toMatchObject({ ok: false, error: 'overflow' });
  });
});

describe('ObjectID', () => {
  it('時刻・random・counterを取り出す', () => {
    const r = decodeId('507f1f77bcf86cd799439011', twitter);
    if (!r.ok) throw new Error('not ok');
    expect(r.kind).toBe('objectid');
    expect(r.time?.iso).toBe('2012-10-17T21:13:27.000Z');
    expect(field(r, 'random')).toBe('bcf86cd799');
    expect(field(r, 'counter')).toBe(String(0x439011));
  });
});

describe('UUID', () => {
  it('v1の時刻を取り出す', () => {
    const r = decodeId('c232ab00-9414-11ec-b3c8-9f6bdeced846', twitter);
    if (!r.ok) throw new Error('not ok');
    expect(r.kind).toBe('uuid');
    expect(r.time?.iso).toBe('2022-02-22T19:22:22.000Z');
    expect(field(r, 'version')).toBe('1');
    expect(field(r, 'variant')).toBe('RFC 9562');
    expect(field(r, 'node')).toBe('9f6bdeced846');
  });

  it('v6の時刻を取り出す', () => {
    const r = decodeId('1ec9414c-232a-6b00-b3c8-9f6bdeced846', twitter);
    if (!r.ok) throw new Error('not ok');
    expect(r.time?.iso).toBe('2022-02-22T19:22:22.000Z');
  });

  it('v7の時刻を取り出す', () => {
    const r = decodeId('017f22e2-79b0-7cc3-98c4-dc0c0c07398f', twitter);
    if (!r.ok) throw new Error('not ok');
    expect(r.time?.unixMs).toBe(1645557742000);
    expect(field(r, 'version')).toBe('7');
  });

  it('v4は時刻なしでversionだけ示す', () => {
    const r = decodeId('550e8400-e29b-41d4-a716-446655440000', twitter);
    if (!r.ok) throw new Error('not ok');
    expect(r.time).toBeNull();
    expect(field(r, 'version')).toBe('4');
  });

  it('ハイフンなし・波括弧・大文字も受け付ける', () => {
    expect(decodeId('017F22E279B07CC398C4DC0C0C07398F', twitter).ok).toBe(true);
    expect(decodeId('{017f22e2-79b0-7cc3-98c4-dc0c0c07398f}', twitter).ok).toBe(
      true,
    );
  });
});

describe('ULID', () => {
  it('時刻をデコードする', () => {
    const r = decodeId('01ARZ3NDEKTSV4RRFFQ69G5FAV', twitter);
    if (!r.ok) throw new Error('not ok');
    expect(r.kind).toBe('ulid');
    expect(r.time?.unixMs).toBe(1469922850259);
    expect(field(r, 'random')).toBe('TSV4RRFFQ69G5FAV');
  });

  it('先頭が8以上は範囲外でエラー', () => {
    expect(decodeId('81ARZ3NDEKTSV4RRFFQ69G5FAV', twitter)).toMatchObject({
      ok: false,
      error: 'invalidUlid',
    });
  });
});

describe('エラー・一括', () => {
  it('判別できない入力はunknown', () => {
    expect(decodeId('hello', twitter)).toMatchObject({
      ok: false,
      error: 'unknown',
    });
  });

  it('複数行を空行を除いてデコードする', () => {
    const { results, truncated } = decodeMany(
      '507f1f77bcf86cd799439011\r\n\r\n  hello  \n',
      twitter,
    );
    expect(results).toHaveLength(2);
    expect(results[1].ok).toBe(false);
    expect(truncated).toBe(false);
  });

  it('行数上限で切り捨てる', () => {
    const text = Array(MAX_LINES + 5)
      .fill('507f1f77bcf86cd799439011')
      .join('\n');
    const { results, truncated } = decodeMany(text, twitter);
    expect(results).toHaveLength(MAX_LINES);
    expect(truncated).toBe(true);
  });

  it('範囲外の日時はtimeがnull', () => {
    expect(toDecodedTime(9e15)).toBeNull();
  });

  it('TSVを出力する', () => {
    const { results } = decodeMany('507f1f77bcf86cd799439011\nx', twitter);
    const tsv = resultsToTsv(results).split('\n');
    expect(tsv[0]).toBe(
      '507f1f77bcf86cd799439011\tobjectid\t2012-10-17T21:13:27.000Z\t2012-10-18T06:13:27.000+09:00\t1350508407000',
    );
    expect(tsv[1]).toBe('x\t\t\t\t');
  });
});
