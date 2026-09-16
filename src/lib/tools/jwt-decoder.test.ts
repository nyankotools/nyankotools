import { describe, expect, it } from 'vitest';
import { decodeJwt, unixSecondsToDate } from './jwt-decoder';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJwt', () => {
  it('空文字列はisValid: falseかつエラーコードなし', () => {
    expect(decodeJwt('')).toEqual({
      isValid: false,
      errorCode: null,
      header: null,
      payload: null,
      signature: null,
    });
  });

  it('正しいJWTのヘッダー・ペイロード・署名を分解する', () => {
    const result = decodeJwt(SAMPLE_JWT);
    expect(result.isValid).toBe(true);
    expect(result.errorCode).toBeNull();
    expect(result.header?.json).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect(result.payload?.json).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    });
    expect(result.signature).toBe(
      'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    );
  });

  it('前後の空白を無視する', () => {
    const result = decodeJwt(`  ${SAMPLE_JWT}  `);
    expect(result.isValid).toBe(true);
  });

  it('ドット区切りが3つでない場合はinvalid-format', () => {
    expect(decodeJwt('abc.def').errorCode).toBe('invalid-format');
    expect(decodeJwt('abc.def.ghi.jkl').errorCode).toBe('invalid-format');
    expect(decodeJwt('abc..ghi').errorCode).toBe('invalid-format');
  });

  it('Base64URLとして不正なセグメントはinvalid-base64', () => {
    const result = decodeJwt('not base64!.eyJhIjoxfQ.sig');
    expect(result.isValid).toBe(true);
    expect(result.header?.errorCode).toBe('invalid-base64');
  });

  it('JSONとして不正なセグメントはinvalid-json', () => {
    // "not-json" をBase64URLエンコードした値
    const notJsonEncoded = 'bm90LWpzb24';
    const result = decodeJwt(`${notJsonEncoded}.eyJhIjoxfQ.sig`);
    expect(result.header?.errorCode).toBe('invalid-json');
    expect(result.payload?.json).toEqual({ a: 1 });
  });
});

describe('unixSecondsToDate', () => {
  it('UNIX秒を日時に変換する', () => {
    const date = unixSecondsToDate(1516239022);
    expect(date?.toISOString()).toBe('2018-01-18T01:30:22.000Z');
  });

  it('数値でない値はnullを返す', () => {
    expect(unixSecondsToDate('1516239022')).toBeNull();
    expect(unixSecondsToDate(undefined)).toBeNull();
    expect(unixSecondsToDate(NaN)).toBeNull();
  });
});
