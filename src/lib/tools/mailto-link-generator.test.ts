import { describe, expect, it } from 'vitest';
import {
  buildAnchor,
  buildMailto,
  buildSms,
  buildTel,
  escapeHtml,
  isPlausibleEmail,
  normalizeCrlf,
  normalizePhone,
  splitList,
} from './mailto-link-generator';

const empty = { to: '', cc: '', bcc: '', subject: '', body: '' };

function href(r: ReturnType<typeof buildMailto>): string {
  if (!r.ok) throw new Error('not ok');
  return r.href;
}

describe('splitList', () => {
  it('カンマ・セミコロン・改行で分割し空要素を除く', () => {
    expect(splitList('a@x.com, b@x.com;\nc@x.com,, ')).toEqual([
      'a@x.com',
      'b@x.com',
      'c@x.com',
    ]);
    expect(splitList('')).toEqual([]);
  });
});

describe('normalizeCrlf', () => {
  it('改行をCRLFにそろえる', () => {
    expect(normalizeCrlf('a\nb\rc\r\nd')).toBe('a\r\nb\r\nc\r\nd');
  });
});

describe('buildMailto', () => {
  it('空入力でも mailto: を返す', () => {
    expect(href(buildMailto(empty))).toBe('mailto:');
  });

  it('宛先のみ', () => {
    expect(href(buildMailto({ ...empty, to: 'a@example.com' }))).toBe(
      'mailto:a@example.com',
    );
  });

  it('複数宛先はカンマ区切り、@は残す', () => {
    expect(href(buildMailto({ ...empty, to: 'a@x.com\nb@x.com' }))).toBe(
      'mailto:a@x.com,b@x.com',
    );
  });

  it('件名・本文・CC・BCCを付ける。スペースは%20、改行は%0D%0A', () => {
    const r = buildMailto({
      to: 'a@example.com',
      cc: 'c@example.com',
      bcc: 'b@example.com',
      subject: 'Hello World',
      body: 'line1\nline2',
    });
    expect(href(r)).toBe(
      'mailto:a@example.com?cc=c@example.com&bcc=b@example.com&subject=Hello%20World&body=line1%0D%0Aline2',
    );
  });

  it('日本語・記号・&・%をエンコードする', () => {
    const h = href(
      buildMailto({ ...empty, to: 'a@x.com', subject: 'A&B=100%' }),
    );
    expect(h).toBe('mailto:a@x.com?subject=A%26B%3D100%25');
    const j = href(buildMailto({ ...empty, subject: 'お問い合わせ' }));
    expect(j).toBe(`mailto:?subject=${encodeURIComponent('お問い合わせ')}`);
  });

  it('+ を含むアドレスは%2Bになる', () => {
    expect(href(buildMailto({ ...empty, to: 'a+b@x.com' }))).toBe(
      'mailto:a%2Bb@x.com',
    );
  });

  it('宛先なしで件名のみ', () => {
    expect(href(buildMailto({ ...empty, subject: 'x' }))).toBe(
      'mailto:?subject=x',
    );
  });

  it('不正なアドレスを警告する', () => {
    const r = buildMailto({ ...empty, to: 'abc, ok@x.com' });
    expect(r.ok && r.warnings).toEqual([
      { code: 'invalidEmail', values: ['abc'] },
    ]);
  });

  it('長すぎるURLを警告する', () => {
    const r = buildMailto({ ...empty, body: 'a'.repeat(2100) });
    expect(r.ok && r.warnings.some((w) => w.code === 'tooLong')).toBe(true);
  });

  it('デコードすると元の件名に戻る', () => {
    const subject = 'テスト #1 / 見積り?';
    const h = href(buildMailto({ ...empty, subject }));
    const value = h.split('subject=')[1];
    expect(decodeURIComponent(value)).toBe(subject);
  });
});

describe('isPlausibleEmail', () => {
  it('基本判定', () => {
    expect(isPlausibleEmail('a@example.com')).toBe(true);
    expect(isPlausibleEmail('a@example')).toBe(false);
    expect(isPlausibleEmail('a b@example.com')).toBe(false);
    expect(isPlausibleEmail('@example.com')).toBe(false);
  });
});

describe('normalizePhone', () => {
  it('全角を半角にし空白を除く', () => {
    expect(normalizePhone('０９０ー')).toBeNull();
    expect(normalizePhone('０９０－１２３４－５６７８')).toBe('090-1234-5678');
    expect(normalizePhone('+81 3 1234 5678')).toBe('+81312345678');
  });

  it('不正な文字・数字なしはnull', () => {
    expect(normalizePhone('abc')).toBeNull();
    expect(normalizePhone('---')).toBeNull();
    expect(normalizePhone('03+1234')).toBeNull();
    expect(normalizePhone('')).toBeNull();
  });
});

describe('buildTel', () => {
  it('tel リンクを作る', () => {
    const r = buildTel('+81 3-1234-5678', '');
    expect(r).toEqual({ ok: true, href: 'tel:+813-1234-5678', warnings: [] });
  });

  it('内線を付ける', () => {
    const r = buildTel('03-1234-5678', '123');
    expect(r.ok && r.href).toBe('tel:03-1234-5678;ext=123');
  });

  it('エラー', () => {
    expect(buildTel('', '')).toEqual({ ok: false, error: 'emptyPhone' });
    expect(buildTel('abc', '')).toEqual({ ok: false, error: 'invalidPhone' });
    expect(buildTel('0312345678', 'x1')).toEqual({
      ok: false,
      error: 'invalidExt',
    });
  });
});

describe('buildSms', () => {
  it('宛先と本文（標準は ?body=）', () => {
    const r = buildSms('+819012345678', 'こんにちは\nhi');
    expect(r.ok && r.href).toBe(
      `sms:+819012345678?body=${encodeURIComponent('こんにちは')}%0Ahi`,
    );
  });

  it('iOS形式は &body=', () => {
    const r = buildSms('09012345678', 'hi there', 'ios');
    expect(r.ok && r.href).toBe('sms:09012345678&body=hi%20there');
  });

  it('複数宛先はカンマ区切り', () => {
    const r = buildSms('090-1111-2222\n090-3333-4444', '');
    expect(r.ok && r.href).toBe('sms:090-1111-2222,090-3333-4444');
  });

  it('宛先なしでも作れる', () => {
    const r = buildSms('', 'x');
    expect(r.ok && r.href).toBe('sms:?body=x');
  });

  it('不正な番号はエラー', () => {
    expect(buildSms('abc', 'x')).toEqual({ ok: false, error: 'invalidPhone' });
  });
});

describe('buildAnchor / escapeHtml', () => {
  it('hrefの&と引用符をエスケープする', () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;',
    );
    expect(
      buildAnchor('mailto:a@x.com?cc=b@x.com&subject=s', 'メール<送信>'),
    ).toBe(
      '<a href="mailto:a@x.com?cc=b@x.com&amp;subject=s">メール&lt;送信&gt;</a>',
    );
  });
});
