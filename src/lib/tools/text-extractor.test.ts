import { describe, expect, it } from 'vitest';
import {
  EXTRACT_TYPES,
  extractFromText,
  formatItems,
  trimUrl,
  type ExtractOptions,
  type ExtractType,
} from './text-extractor';

function opts(
  types: ExtractType[],
  extra: Partial<ExtractOptions> = {},
): ExtractOptions {
  return { types, unique: false, ignoreCase: true, sort: false, ...extra };
}

function values(text: string, types: ExtractType[], extra = {}) {
  return extractFromText(text, opts(types, extra)).items.map((i) => i.value);
}

describe('email', () => {
  it('メールアドレスを抽出する', () => {
    expect(
      values('連絡先: a.b+c@example.co.jp, x_y@test.com まで', ['email']),
    ).toEqual(['a.b+c@example.co.jp', 'x_y@test.com']);
  });

  it('@ のない文字列や不完全なドメインは対象外', () => {
    expect(values('foo@bar baz@ @qux a@b.c', ['email'])).toEqual([]);
  });
});

describe('url', () => {
  it('URLを抽出し、末尾の句読点を除く', () => {
    expect(
      values('見て https://example.com/a?b=1, と http://foo.bar/x.', ['url']),
    ).toEqual(['https://example.com/a?b=1', 'http://foo.bar/x']);
  });

  it('日本語の文字でURLが止まる', () => {
    expect(values('https://example.com/pathです', ['url'])).toEqual([
      'https://example.com/path',
    ]);
  });

  it('括弧の扱い', () => {
    expect(trimUrl('https://a.com/x)')).toBe('https://a.com/x');
    expect(trimUrl('https://a.com/x_(y)')).toBe('https://a.com/x_(y)');
  });

  it('URL内のメールアドレスは二重に抽出しない', () => {
    const r = extractFromText(
      'https://a.com/?m=u@b.com',
      opts(['url', 'email']),
    );
    expect(r.items).toHaveLength(1);
    expect(r.items[0].type).toBe('url');
  });
});

describe('phone / postal', () => {
  it('日本の電話番号を抽出する', () => {
    expect(
      values('03-1234-5678 / 090-1234-5678 / 09012345678 / 0120-123-456', [
        'phone',
      ]),
    ).toEqual(['03-1234-5678', '090-1234-5678', '09012345678', '0120-123-456']);
  });

  it('国際表記も抽出し、日付は電話番号にしない', () => {
    expect(values('+81 90-1234-5678 2026-10-18', ['phone'])).toEqual([
      '+81 90-1234-5678',
    ]);
  });

  it('郵便番号を〒付きでも記号なしで返す', () => {
    expect(values('〒150-0001 東京, 100-8111', ['postal'])).toEqual([
      '150-0001',
      '100-8111',
    ]);
  });

  it('電話番号の一部を郵便番号として拾わない', () => {
    expect(values('03-1234-5678', ['phone', 'postal'])).toEqual([
      '03-1234-5678',
    ]);
    expect(values('03-1234-5678', ['postal'])).toEqual([]);
  });
});

describe('date / ipv4 / hashtag', () => {
  it('日付の各表記を抽出する', () => {
    expect(
      values('2026-10-18, 2026/1/5, 2026.12.31 と 2026年10月18日', ['date']),
    ).toEqual(['2026-10-18', '2026/1/5', '2026.12.31', '2026年10月18日']);
  });

  it('存在しない月日は対象外', () => {
    expect(values('2026-13-01 2026-00-10 2026-10-32', ['date'])).toEqual([]);
  });

  it('IPv4を抽出する', () => {
    expect(values('192.168.0.1 と 256.1.1.1 と 10.0.0.255.', ['ipv4'])).toEqual(
      ['192.168.0.1', '10.0.0.255'],
    );
  });

  it('ハッシュタグを抽出し、数字だけのものは除く', () => {
    expect(values('#猫 #nyanko_1 #123 a#b', ['hashtag'])).toEqual([
      '#猫',
      '#nyanko_1',
    ]);
  });

  it('URLのフラグメントはハッシュタグにならない', () => {
    expect(values('https://a.com/#top', ['url', 'hashtag'])).toEqual([
      'https://a.com/#top',
    ]);
  });
});

describe('オプション', () => {
  const text = 'A@x.com b@x.com a@X.com a@x.com';

  it('重複除去（大小区別なし）は最初の出現を残す', () => {
    const r = extractFromText(text, opts(['email'], { unique: true }));
    expect(r.items.map((i) => i.value)).toEqual(['A@x.com', 'b@x.com']);
    expect(r.totalFound).toBe(4);
    expect(r.counts.email).toBe(2);
  });

  it('大小を区別する場合は別物として残す', () => {
    const r = extractFromText(
      text,
      opts(['email'], { unique: true, ignoreCase: false }),
    );
    expect(r.items).toHaveLength(4);
  });

  it('並べ替え', () => {
    expect(values(text, ['email'], { sort: true })).toEqual([
      'A@x.com',
      'a@X.com',
      'a@x.com',
      'b@x.com',
    ]);
  });

  it('種類ごとの件数', () => {
    const r = extractFromText(
      'a@b.com https://c.com 2026-01-01',
      opts([...EXTRACT_TYPES]),
    );
    expect(r.counts).toMatchObject({ email: 1, url: 1, date: 1, phone: 0 });
  });

  it('種類が空・入力が空なら結果は空', () => {
    expect(values('a@b.com', [])).toEqual([]);
    expect(values('', [...EXTRACT_TYPES])).toEqual([]);
  });
});

describe('formatItems', () => {
  it('区切り文字でつなぐ', () => {
    const items = extractFromText('a@b.com c@d.com', opts(['email'])).items;
    expect(formatItems(items, 'newline')).toBe('a@b.com\nc@d.com');
    expect(formatItems(items, 'comma')).toBe('a@b.com, c@d.com');
    expect(formatItems(items, 'tab')).toBe('a@b.com\tc@d.com');
    expect(formatItems([], 'newline')).toBe('');
  });
});

describe('改行コードと大量入力', () => {
  it('CRLF / CR で区切られた項目もそれぞれ抽出する', () => {
    const r = extractFromText(
      'a@b.com\r\nc@d.com\rhttps://example.com/x\r#tag',
      opts(['email', 'url', 'hashtag']),
    );
    expect(r.items.map((i) => i.value)).toEqual([
      'a@b.com',
      'c@d.com',
      'https://example.com/x',
      '#tag',
    ]);
  });

  it('大量の項目（2万件）を件数どおり抽出し、重複除去する', () => {
    const text = 'a@b.com '.repeat(20000);
    const r = extractFromText(text, { ...opts(['email']), unique: false });
    expect(r.totalFound).toBe(20000);
    const dedup = extractFromText(text, opts(['email'], { unique: true }));
    expect(dedup.items).toHaveLength(1);
    expect(dedup.totalFound).toBe(20000);
  });
});

describe('性能（ReDoS耐性）', () => {
  it('長い病的な入力でも短時間で終わる', () => {
    const inputs = [
      'a'.repeat(200000),
      'a.'.repeat(100000) + '@',
      'http://' + 'a'.repeat(200000),
      '0-'.repeat(100000),
      '1.'.repeat(100000),
      '#' + 'a'.repeat(200000),
    ];
    const start = Date.now();
    for (const input of inputs) {
      extractFromText(input, opts([...EXTRACT_TYPES]));
    }
    expect(Date.now() - start).toBeLessThan(3000);
  });
});
