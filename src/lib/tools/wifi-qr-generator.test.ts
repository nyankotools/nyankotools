import { describe, expect, it } from 'vitest';
import {
  buildWifiPayload,
  checkPasswordLength,
  escapeWifiValue,
} from './wifi-qr-generator';
import { generateQrMatrix } from './qr-generator';

describe('escapeWifiValue', () => {
  it('特殊文字をエスケープする', () => {
    expect(escapeWifiValue('a;b,c:d"e')).toBe('a\\;b\\,c\\:d\\"e');
  });

  it('バックスラッシュ自体を先にエスケープする', () => {
    expect(escapeWifiValue('a\\b')).toBe('a\\\\b');
    expect(escapeWifiValue('\\;')).toBe('\\\\\\;');
  });

  it('特殊文字がなければそのまま返す', () => {
    expect(escapeWifiValue('MyWifi-2.4G 日本語')).toBe('MyWifi-2.4G 日本語');
  });
});

describe('buildWifiPayload', () => {
  it('WPAの基本形式を作る', () => {
    expect(
      buildWifiPayload({
        ssid: 'home',
        password: 'secret123',
        security: 'WPA',
        hidden: false,
      }),
    ).toEqual({ ok: true, payload: 'WIFI:T:WPA;S:home;P:secret123;;' });
  });

  it('WEPと隠しSSIDを反映する', () => {
    expect(
      buildWifiPayload({
        ssid: 'old',
        password: '12345',
        security: 'WEP',
        hidden: true,
      }),
    ).toEqual({ ok: true, payload: 'WIFI:T:WEP;S:old;P:12345;H:true;;' });
  });

  it('パスワードなし(nopass)ではPを出力しない', () => {
    expect(
      buildWifiPayload({
        ssid: 'cafe',
        password: 'ignored',
        security: 'nopass',
        hidden: false,
      }),
    ).toEqual({ ok: true, payload: 'WIFI:T:nopass;S:cafe;;' });
  });

  it('SSIDとパスワードの特殊文字をエスケープする', () => {
    const result = buildWifiPayload({
      ssid: 'a;b',
      password: 'p:w,"\\',
      security: 'WPA',
      hidden: false,
    });
    expect(result).toEqual({
      ok: true,
      payload: 'WIFI:T:WPA;S:a\\;b;P:p\\:w\\,\\"\\\\;;',
    });
  });

  it('SSIDが空ならエラー', () => {
    expect(
      buildWifiPayload({
        ssid: '',
        password: 'x',
        security: 'WPA',
        hidden: false,
      }),
    ).toEqual({ ok: false, reason: 'ssid-empty' });
  });

  it('パスワード必須の方式で空ならエラー、nopassなら不要', () => {
    expect(
      buildWifiPayload({
        ssid: 's',
        password: '',
        security: 'WEP',
        hidden: false,
      }),
    ).toEqual({ ok: false, reason: 'password-empty' });
    expect(
      buildWifiPayload({
        ssid: 's',
        password: '',
        security: 'nopass',
        hidden: false,
      }).ok,
    ).toBe(true);
  });

  it('生成した文字列をQRコード化できる', () => {
    const result = buildWifiPayload({
      ssid: '自宅Wi-Fi',
      password: 'パスワード12345',
      security: 'WPA',
      hidden: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(generateQrMatrix(result.payload).ok).toBe(true);
  });
});

describe('checkPasswordLength', () => {
  it('WPAで8文字未満は too-short', () => {
    expect(checkPasswordLength('WPA', 'abcdefg')).toBe('too-short');
  });

  it('WPAで8〜63文字は ok', () => {
    expect(checkPasswordLength('WPA', 'abcdefgh')).toBe('ok');
    expect(checkPasswordLength('WPA', 'a'.repeat(63))).toBe('ok');
  });

  it('WPAで64文字以上は too-long', () => {
    expect(checkPasswordLength('WPA', 'a'.repeat(64))).toBe('too-long');
  });

  it('文字数はUTF-16長ではなくコードポイントで数える（サロゲートペア）', () => {
    expect(checkPasswordLength('WPA', '😀'.repeat(8))).toBe('ok');
    expect(checkPasswordLength('WPA', '😀'.repeat(7))).toBe('too-short');
    expect(checkPasswordLength('WPA', 'あ'.repeat(8))).toBe('ok');
  });

  it('空・WPA以外は常に ok', () => {
    expect(checkPasswordLength('WPA', '')).toBe('ok');
    expect(checkPasswordLength('WEP', 'a')).toBe('ok');
    expect(checkPasswordLength('nopass', 'a')).toBe('ok');
  });
});
