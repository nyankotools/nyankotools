import { describe, expect, it } from 'vitest';
import {
  MIME_ENTRIES,
  PARTIAL_LIMIT,
  buildContentType,
  detectQueryKind,
  formatExtensions,
  lookup,
  normalizeExtension,
  normalizeMime,
} from './mime-type-lookup';

describe('normalizeExtension', () => {
  it('ドット・ワイルドカード・ファイル名・大文字を正規化する', () => {
    expect(normalizeExtension('.PNG')).toBe('png');
    expect(normalizeExtension('*.jpg')).toBe('jpg');
    expect(normalizeExtension('photo.JPEG')).toBe('jpeg');
    expect(normalizeExtension('archive.tar.gz')).toBe('gz');
    expect(normalizeExtension('  pdf  ')).toBe('pdf');
    expect(normalizeExtension('.')).toBe('');
  });
});

describe('normalizeMime', () => {
  it('パラメータとヘッダー名を取り除く', () => {
    expect(normalizeMime('Text/HTML; charset=UTF-8')).toBe('text/html');
    expect(normalizeMime('Content-Type: application/json')).toBe(
      'application/json',
    );
    expect(normalizeMime('  image/png ')).toBe('image/png');
  });
});

describe('detectQueryKind', () => {
  it('スラッシュの有無で判別する', () => {
    expect(detectQueryKind('image/png')).toBe('mime');
    expect(detectQueryKind('png')).toBe('extension');
    expect(detectQueryKind('.png')).toBe('extension');
  });
});

describe('lookup', () => {
  it('拡張子からMIMEタイプを引ける', () => {
    const r = lookup('.JPG');
    expect(r.kind).toBe('extension');
    expect(r.query).toBe('jpg');
    expect(r.exact.map((e) => e.mime)).toEqual(['image/jpeg']);
  });

  it('1つの拡張子が複数のMIMEに対応する場合はすべて返す', () => {
    const r = lookup('xml');
    expect(r.exact.map((e) => e.mime)).toEqual(['application/xml', 'text/xml']);
    const ts = lookup('ts');
    expect(ts.exact.map((e) => e.mime)).toContain('video/mp2t');
    expect(ts.exact.map((e) => e.mime)).toContain('text/typescript');
  });

  it('MIMEタイプから拡張子を引ける（パラメータ付きも可）', () => {
    const r = lookup('text/html; charset=utf-8');
    expect(r.kind).toBe('mime');
    expect(r.exact).toHaveLength(1);
    expect(r.exact[0].extensions).toEqual(['html', 'htm', 'shtml']);
  });

  it('拡張子が空のMIMEタイプも完全一致で返す', () => {
    const r = lookup('multipart/form-data');
    expect(r.exact).toHaveLength(1);
    expect(r.exact[0].extensions).toEqual([]);
    expect(formatExtensions(r.exact[0])).toBe('');
  });

  it('type/* で分類全体を返す', () => {
    const r = lookup('font/*');
    expect(r.wildcard).toBe(true);
    expect(r.exact.length).toBeGreaterThanOrEqual(5);
    expect(r.exact.every((e) => e.mime.startsWith('font/'))).toBe(true);
    expect(r.partial).toEqual([]);
  });

  it('部分一致を返し、完全一致は含めない', () => {
    const r = lookup('json');
    expect(r.exact.map((e) => e.mime)).toEqual(['application/json']);
    const partial = r.partial.map((e) => e.mime);
    expect(partial).toContain('application/ld+json');
    expect(partial).not.toContain('application/json');
  });

  it('手動モードでは入力の判別をしない', () => {
    const asMime = lookup('png', 'mime');
    expect(asMime.kind).toBe('mime');
    expect(asMime.exact).toEqual([]);
    expect(asMime.partial.map((e) => e.mime)).toContain('image/png');

    const asExt = lookup('image/png', 'extension');
    expect(asExt.kind).toBe('extension');
    expect(asExt.exact).toEqual([]);
  });

  it('未登録のMIMEで構造化サフィックスを示す', () => {
    const r = lookup('application/vnd.foo+json');
    expect(r.exact).toEqual([]);
    expect(r.structuredSuffix).toBe('json');
    expect(lookup('application/vnd.foo').structuredSuffix).toBeUndefined();
  });

  it('見つからない場合は空の結果を返す', () => {
    const r = lookup('zzzzqq');
    expect(r.exact).toEqual([]);
    expect(r.partial).toEqual([]);
  });

  it('空入力は分類未指定なら空、指定すればその一覧を返す', () => {
    expect(lookup('').exact).toEqual([]);
    expect(lookup('').partial).toEqual([]);
    const r = lookup('', 'auto', 'font');
    expect(r.partial.length).toBeGreaterThan(0);
    expect(r.partial.every((e) => e.category === 'font')).toBe(true);
  });

  it('分類で絞り込める', () => {
    const r = lookup('p', 'auto', 'audio');
    expect(r.partial.every((e) => e.category === 'audio')).toBe(true);
    expect(lookup('png', 'auto', 'audio').exact).toEqual([]);
  });

  it('部分一致の件数に上限がある', () => {
    const r = lookup('/', 'mime');
    expect(r.partial.length).toBeLessThanOrEqual(PARTIAL_LIMIT);
    expect(r.partialTotal).toBeGreaterThanOrEqual(r.partial.length);
  });

  it('前方一致を先に並べる', () => {
    const r = lookup('mp', 'extension');
    const first = r.partial[0];
    expect(
      first.extensions.some((e) => e.startsWith('mp')) ||
        first.mime.includes('/mp'),
    ).toBe(true);
  });
});

describe('buildContentType', () => {
  it('text/* には charset を付ける', () => {
    expect(buildContentType('text/html')).toBe('text/html; charset=utf-8');
    expect(buildContentType('image/png')).toBe('image/png');
    expect(buildContentType('application/json')).toBe('application/json');
  });
});

describe('テーブルの整合性', () => {
  it('MIME・拡張子の形式が正しく、同じ組が重複しない', () => {
    const seen = new Set<string>();
    for (const e of MIME_ENTRIES) {
      expect(e.mime).toMatch(/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/);
      for (const x of e.extensions) expect(x).toMatch(/^[a-z0-9]+$/);
      expect(seen.has(e.mime)).toBe(false);
      seen.add(e.mime);
    }
  });
});

describe('detectQueryKind (Content-Type ヘッダー)', () => {
  it('スラッシュが無くても Content-Type: で始まれば MIME 扱い', () => {
    expect(detectQueryKind('Content-Type: json')).toBe('mime');
    expect(detectQueryKind('json')).toBe('extension');
  });
});

describe('lookup（境界・特殊入力）', () => {
  it('空白だけの入力は空の検索語として扱う', () => {
    expect(lookup('   ').query).toBe('');
    expect(lookup('   ').exact).toEqual([]);
  });

  it('ドットだけの入力は拡張子が空になり一致しない', () => {
    const r = lookup('.');
    expect(r.query).toBe('');
    expect(r.exact).toEqual([]);
  });

  it('日本語などの非ASCII入力でも例外にならず一致しない', () => {
    const r = lookup('画像');
    expect(r.exact).toEqual([]);
    expect(r.partial).toEqual([]);
  });

  it('長大な入力でも例外にならず一致しない', () => {
    const r = lookup('a'.repeat(10_000));
    expect(r.exact).toEqual([]);
    expect(r.partial).toEqual([]);
  });

  it('大文字・前後空白のMIMEタイプを正規化して一致させる', () => {
    expect(lookup('  IMAGE/PNG  ').exact.map((e) => e.mime)).toEqual([
      'image/png',
    ]);
  });

  it('wildcard と分類フィルタを組み合わせると分類内の型だけを返す', () => {
    const r = lookup('image/*', 'auto', 'image');
    expect(r.wildcard).toBe(true);
    expect(r.exact.length).toBeGreaterThan(0);
    expect(
      r.exact.every(
        (e) => e.category === 'image' && e.mime.startsWith('image/'),
      ),
    ).toBe(true);
  });
});
