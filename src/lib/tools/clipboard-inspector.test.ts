import { describe, expect, it } from 'vitest';
import {
  buildReport,
  classifyMime,
  describeEntry,
  formatBytes,
  parseUriList,
  prettyJson,
  summarizeHtml,
  summarizeText,
} from './clipboard-inspector';

describe('classifyMime', () => {
  it('主要なMIMEを分類する', () => {
    expect(classifyMime('text/plain')).toBe('text');
    expect(classifyMime('text/html')).toBe('html');
    expect(classifyMime('image/png')).toBe('image');
    expect(classifyMime('application/json')).toBe('json');
    expect(classifyMime('application/ld+json')).toBe('json');
    expect(classifyMime('text/uri-list')).toBe('uri-list');
    expect(classifyMime('text/rtf')).toBe('rtf');
    expect(classifyMime('Files')).toBe('file');
    expect(classifyMime('application/x-custom')).toBe('other');
  });
  it('パラメータと大文字小文字を無視する', () => {
    expect(classifyMime('TEXT/HTML; charset=utf-8')).toBe('html');
  });
  it('その他の text/* は text', () => {
    expect(classifyMime('text/csv')).toBe('text');
  });
});

describe('formatBytes', () => {
  it('単位を切り替える', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1023)).toBe('1023 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
    expect(formatBytes(5 * 1024 ** 3)).toBe('5.0 GB');
  });
  it('不正値は 0 B', () => {
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(NaN)).toBe('0 B');
  });
});

describe('summarizeText', () => {
  it('空文字列', () => {
    expect(summarizeText('')).toEqual({ characters: 0, lines: 0, bytes: 0 });
  });
  it('サロゲートペアを1文字と数え、UTF-8バイトを返す', () => {
    const s = summarizeText('a😀\nあ');
    expect(s.characters).toBe(4);
    expect(s.lines).toBe(2);
    expect(s.bytes).toBe(1 + 4 + 1 + 3);
  });
  it('CRLFを1改行と数える', () => {
    expect(summarizeText('a\r\nb\r\nc').lines).toBe(3);
  });
});

describe('summarizeHtml', () => {
  it('タグ数・画像・リンクを数える', () => {
    const s = summarizeHtml(
      '<!--StartFragment--><p>Hi <a href="x">l</a><img src="a.png"><IMG src="b"></p><!--EndFragment-->',
    );
    expect(s.tags).toBe(4);
    expect(s.images).toBe(2);
    expect(s.links).toBe(1);
    expect(s.hasFragmentMarker).toBe(true);
    expect(s.hasScript).toBe(false);
    expect(s.topTags[0]).toEqual({ name: 'img', count: 2 });
  });
  it('scriptを検出するが実行はしない', () => {
    expect(summarizeHtml('<script>alert(1)</script>').hasScript).toBe(true);
  });
  it('タグが無ければ 0', () => {
    const s = summarizeHtml('plain 1 < 2 > 0');
    expect(s.tags).toBe(0);
    expect(s.topTags).toEqual([]);
  });
});

describe('prettyJson', () => {
  it('整形する', () => {
    expect(prettyJson('{"a":1}')).toBe('{\n  "a": 1\n}');
  });
  it('不正なら null', () => {
    expect(prettyJson('{a:1}')).toBeNull();
  });
});

describe('parseUriList', () => {
  it('コメントと空行を除く', () => {
    expect(
      parseUriList('# c\r\nhttps://a.example/\n\nhttps://b.example/'),
    ).toEqual(['https://a.example/', 'https://b.example/']);
  });
});

describe('describeEntry / buildReport', () => {
  it('文字列とファイルのサイズ', () => {
    expect(
      describeEntry({ type: 'text/plain', kind: 'string', text: 'あ' }),
    ).toMatchObject({ category: 'text', bytes: 3 });
    expect(
      describeEntry({
        type: 'image/png',
        kind: 'file',
        fileName: 'a.png',
        fileSize: 2048,
      }),
    ).toMatchObject({ category: 'image', bytes: 2048 });
  });
  it('レポートを組み立てる', () => {
    const r = buildReport(
      [
        { type: 'text/plain', kind: 'string', text: 'hi' },
        { type: 'image/png', kind: 'file', fileName: 'a.png', fileSize: 10 },
      ],
      { type: 'Type', size: 'Size', file: 'File' },
    );
    expect(r).toContain('Type: text/plain\nSize: 2 B (2 B)\n\nhi');
    expect(r).toContain('File: a.png');
    expect(r).toContain('----');
  });
});
