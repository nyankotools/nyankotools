import { describe, expect, it } from 'vitest';
import {
  addHistory,
  buildBulk,
  buildUtmUrl,
  emptyUtm,
  extractUtm,
  findMissingRecommended,
  joinSuccessUrls,
  parseHistory,
  serializeHistory,
} from './utm-builder';

const utm = {
  ...emptyUtm(),
  source: 'newsletter',
  medium: 'email',
  campaign: 'spring_sale',
};

describe('buildUtmUrl', () => {
  it('UTMパラメータを付ける', () => {
    const r = buildUtmUrl('https://example.com/', utm);
    expect(r).toEqual({
      success: true,
      url: 'https://example.com/?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale',
      replaced: [],
    });
  });

  it('既存クエリとフラグメントを保持する', () => {
    const r = buildUtmUrl('https://example.com/p?a=1&b=%E3%81%82#top', utm);
    expect(r.success && r.url).toBe(
      'https://example.com/p?a=1&b=%E3%81%82&utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale#top',
    );
  });

  it('既存の utm_* は置き換え、他は残す', () => {
    const r = buildUtmUrl(
      'https://example.com/?utm_source=old&x=1&utm_source=dup',
      {
        ...emptyUtm(),
        source: 'new',
      },
    );
    expect(r).toEqual({
      success: true,
      url: 'https://example.com/?x=1&utm_source=new',
      replaced: ['utm_source'],
    });
  });

  it('空欄の項目は既存の値に触れない', () => {
    const r = buildUtmUrl('https://example.com/?utm_term=keep', {
      ...emptyUtm(),
      source: 's',
    });
    expect(r.success && r.url).toBe(
      'https://example.com/?utm_term=keep&utm_source=s',
    );
  });

  it('値は前後の空白を除き、特殊文字をエンコードする', () => {
    const r = buildUtmUrl('https://example.com/', {
      ...emptyUtm(),
      term: '  red shoes&bags ',
      content: '春 セール',
    });
    expect(r.success && r.url).toBe(
      'https://example.com/?utm_term=red%20shoes%26bags&utm_content=%E6%98%A5%20%E3%82%BB%E3%83%BC%E3%83%AB',
    );
  });

  it('小文字化オプション', () => {
    const r = buildUtmUrl(
      'https://example.com',
      { ...emptyUtm(), source: 'Google' },
      { lowercase: true },
    );
    expect(r.success && r.url).toBe('https://example.com/?utm_source=google');
  });

  it('空のクエリ "?" だけのURLでも正しく付く', () => {
    const r = buildUtmUrl('https://example.com/?#x', {
      ...emptyUtm(),
      source: 'a',
    });
    expect(r.success && r.url).toBe('https://example.com/?utm_source=a#x');
  });

  it('エラーを返す', () => {
    expect(buildUtmUrl('  ', utm)).toEqual({ success: false, error: 'empty' });
    expect(buildUtmUrl('example.com/page', utm)).toEqual({
      success: false,
      error: 'missingScheme',
    });
    expect(buildUtmUrl('not a url', utm)).toEqual({
      success: false,
      error: 'invalid',
    });
    expect(buildUtmUrl('ftp://example.com/', utm)).toEqual({
      success: false,
      error: 'unsupportedScheme',
    });
    expect(buildUtmUrl('https://example.com/', emptyUtm())).toEqual({
      success: false,
      error: 'noParams',
    });
  });
});

describe('findMissingRecommended', () => {
  it('source/medium/campaign の未入力を返す', () => {
    expect(findMissingRecommended(emptyUtm())).toEqual([
      'source',
      'medium',
      'campaign',
    ]);
    expect(findMissingRecommended(utm)).toEqual([]);
  });
});

describe('extractUtm', () => {
  it('URLからUTMを取り出す', () => {
    expect(
      extractUtm('https://example.com/?utm_source=a&utm_term=b+c&z=1'),
    ).toEqual({ ...emptyUtm(), source: 'a', term: 'b c' });
    expect(extractUtm('bad')).toBeNull();
  });
});

describe('buildBulk', () => {
  it('複数行を処理し、空行を飛ばし、エラー行も報告する', () => {
    const items = buildBulk(
      'https://a.example/\n\nbad\r\nhttps://b.example/x?y=1\n',
      utm,
    );
    expect(items.map((i) => i.line)).toEqual([1, 3, 4]);
    expect(items[1].result).toEqual({ success: false, error: 'invalid' });
    expect(joinSuccessUrls(items).split('\n')).toEqual([
      'https://a.example/?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale',
      'https://b.example/x?y=1&utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale',
    ]);
  });
});

describe('エッジケース（追加）', () => {
  it('フラグメント内の ? は クエリとして扱わず、フラグメントを保持する', () => {
    const r = buildUtmUrl('https://a.com/#/route?x=1', {
      ...emptyUtm(),
      source: 'a',
    });
    expect(r.success && r.url).toBe('https://a.com/?utm_source=a#/route?x=1');
  });

  it('パーセントエンコードされたキー（utm%5Fsource）も既存として置き換える', () => {
    const r = buildUtmUrl('https://a.com/?utm%5Fsource=old&y=1', {
      ...emptyUtm(),
      source: 'new',
    });
    expect(r).toEqual({
      success: true,
      url: 'https://a.com/?y=1&utm_source=new',
      replaced: ['utm_source'],
    });
  });

  it('値の無いフラグ形式（?utm_source）も既存として置き換える', () => {
    const r = buildUtmUrl('https://a.com/?utm_source', {
      ...emptyUtm(),
      source: 'new',
    });
    expect(r).toEqual({
      success: true,
      url: 'https://a.com/?utm_source=new',
      replaced: ['utm_source'],
    });
  });

  it('既存の utm_* の大文字キー（UTM_SOURCE）は別キーとして残す', () => {
    const r = buildUtmUrl('https://a.com/?UTM_SOURCE=x', {
      ...emptyUtm(),
      source: 'new',
    });
    expect(r.success && r.url).toBe(
      'https://a.com/?UTM_SOURCE=x&utm_source=new',
    );
  });

  it('値の + は空白ではなく %2B としてエンコードする', () => {
    const r = buildUtmUrl('https://a.com/', { ...emptyUtm(), term: 'a+b' });
    expect(r.success && r.url).toBe('https://a.com/?utm_term=a%2Bb');
  });

  it('絵文字は UTF-8 のパーセントエンコードになる', () => {
    const r = buildUtmUrl('https://a.com/', { ...emptyUtm(), content: '🐱' });
    expect(r.success && r.url).toBe('https://a.com/?utm_content=%F0%9F%90%B1');
  });

  it('孤立サロゲートは U+FFFD に置換してエンコードし、例外を投げない', () => {
    const r = buildUtmUrl('https://a.com/', {
      ...emptyUtm(),
      content: 'x\uD800',
    });
    expect(r.success && r.url).toBe('https://a.com/?utm_content=x%EF%BF%BD');
  });

  it('javascript: や データURL は unsupportedScheme', () => {
    expect(buildUtmUrl('javascript:alert(1)', utm)).toEqual({
      success: false,
      error: 'unsupportedScheme',
    });
    expect(buildUtmUrl('data:text/html,hi', utm)).toEqual({
      success: false,
      error: 'unsupportedScheme',
    });
  });

  it('ホスト無しの https:// は invalid', () => {
    expect(buildUtmUrl('https://', utm)).toEqual({
      success: false,
      error: 'invalid',
    });
  });

  it('スキームと ホストは大文字でも正規化される', () => {
    const r = buildUtmUrl('HTTPS://EXAMPLE.COM/Path', {
      ...emptyUtm(),
      source: 'a',
    });
    expect(r.success && r.url).toBe('https://example.com/Path?utm_source=a');
  });

  it('同じ utm_* が複数あると extractUtm は最後の値を採る', () => {
    expect(extractUtm('https://a.com/?utm_source=a&utm_source=b')?.source).toBe(
      'b',
    );
  });

  it('大文字の UTM_SOURCE は抽出しない（キーは大小区別）', () => {
    expect(extractUtm('https://a.com/?UTM_SOURCE=a')?.source).toBe('');
  });

  it('数千文字の値・既存クエリでも処理できる', () => {
    const long = 'a'.repeat(5000);
    const r = buildUtmUrl(`https://a.com/?${'k=v&'.repeat(2000)}z=1`, {
      ...emptyUtm(),
      term: long,
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.url.endsWith(`&utm_term=${long}`)).toBe(true);
    }
  });

  it('履歴追加は同一バッチ内の重複を1件にまとめる', () => {
    expect(addHistory([], ['a', 'a'], 1)).toEqual([{ url: 'a', at: 1 }]);
  });

  it('履歴の復元は上限で切る', () => {
    const json = JSON.stringify(
      Array.from({ length: 30 }, (_, i) => ({ url: `u${i}`, at: i })),
    );
    expect(parseHistory(json)).toHaveLength(20);
    expect(parseHistory(json, 5)).toHaveLength(5);
  });

  it('一括処理の CRLF 行でも入力行番号を数える', () => {
    const items = buildBulk('a\r\n\r\nhttps://b.example/', utm);
    expect(items.map((i) => i.line)).toEqual([1, 3]);
  });
});

describe('history', () => {
  it('追加時に重複を先頭へ移動し、上限で切る', () => {
    let h = addHistory([], ['a', 'b'], 1);
    expect(h.map((e) => e.url)).toEqual(['b', 'a']);
    h = addHistory(h, ['a'], 2);
    expect(h).toEqual([
      { url: 'a', at: 2 },
      { url: 'b', at: 1 },
    ]);
    expect(addHistory(h, ['c', 'd'], 3, 3).map((e) => e.url)).toEqual([
      'd',
      'c',
      'a',
    ]);
  });

  it('壊れた保存データは捨てる', () => {
    expect(parseHistory(null)).toEqual([]);
    expect(parseHistory('{oops')).toEqual([]);
    expect(parseHistory('{"a":1}')).toEqual([]);
    expect(
      parseHistory('[{"url":"x","at":1},{"url":3},null,{"url":"","at":1}]'),
    ).toEqual([{ url: 'x', at: 1 }]);
  });

  it('シリアライズして復元できる', () => {
    const h = [{ url: 'u', at: 5 }];
    expect(parseHistory(serializeHistory(h))).toEqual(h);
  });
});
