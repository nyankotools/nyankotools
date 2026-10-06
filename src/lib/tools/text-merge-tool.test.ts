import { describe, expect, it } from 'vitest';
import {
  buildSegments,
  changeKey,
  countChanges,
  mergeSegments,
  type ChangeSegment,
} from './text-merge-tool';

describe('buildSegments', () => {
  it('同じテキストは一致区間1つだけになる', () => {
    const segments = buildSegments('a\nb', 'a\nb');
    expect(segments).toEqual([{ type: 'equal', lines: ['a', 'b'] }]);
    expect(countChanges(segments)).toBe(0);
  });

  it('連続する追加・削除行を1つのハンクにまとめる', () => {
    const segments = buildSegments('a\nx\ny\nd', 'a\nX\nd');
    expect(segments).toEqual([
      { type: 'equal', lines: ['a'] },
      { type: 'change', a: ['x', 'y'], b: ['X'] },
      { type: 'equal', lines: ['d'] },
    ]);
  });

  it('離れた差分は別々のハンクになる', () => {
    const segments = buildSegments('a\nb\nc\nd\ne', 'a\nB\nc\nD\ne');
    expect(countChanges(segments)).toBe(2);
  });

  it('CRLFとLFの違いは差分にしない', () => {
    expect(countChanges(buildSegments('a\r\nb', 'a\nb'))).toBe(0);
  });

  it('追加だけのハンクはaが空になる', () => {
    const segments = buildSegments('a', 'a\nb');
    expect(segments[1]).toEqual({ type: 'change', a: [], b: ['b'] });
  });
});

describe('mergeSegments', () => {
  const segments = buildSegments('a\nx\nc\ny', 'a\nX\nc\nY');

  it('すべてAを選ぶとAと同じ結果になる', () => {
    expect(mergeSegments(segments, ['a', 'a'])).toBe('a\nx\nc\ny');
  });

  it('すべてBを選ぶとBと同じ結果になる', () => {
    expect(mergeSegments(segments, ['b', 'b'])).toBe('a\nX\nc\nY');
  });

  it('ハンクごとに別々の選択ができる', () => {
    expect(mergeSegments(segments, ['a', 'b'])).toBe('a\nx\nc\nY');
  });

  it('両方を順番どおり／逆順で採用できる', () => {
    expect(mergeSegments(segments, ['ab', 'ba'])).toBe('a\nx\nX\nc\nY\ny');
  });

  it('noneはその箇所を取り除く', () => {
    expect(mergeSegments(segments, ['none', 'none'])).toBe('a\nc');
  });

  it('選択が足りないハンクはfallback（既定はB）を使う', () => {
    expect(mergeSegments(segments, [])).toBe('a\nX\nc\nY');
    expect(mergeSegments(segments, ['a'], 'a')).toBe('a\nx\nc\ny');
  });

  it('末尾の改行の有無もそのまま保たれる', () => {
    const s = buildSegments('a\n', 'a\n');
    expect(mergeSegments(s, [])).toBe('a\n');
  });
});

describe('changeKey', () => {
  it('同じ内容のハンクは同じキー、違えば別のキーになる', () => {
    const s1 = buildSegments('a\nx', 'a\nX')[1] as ChangeSegment;
    const s2 = buildSegments('q\nx', 'q\nX')[1] as ChangeSegment;
    const s3 = buildSegments('a\nx', 'a\nZ')[1] as ChangeSegment;
    expect(changeKey(s1)).toBe(changeKey(s2));
    expect(changeKey(s1)).not.toBe(changeKey(s3));
  });
});

describe('マルチバイト文字対応', () => {
  it('日本語テキストの差分を正しく検出できる', () => {
    const segments = buildSegments('こんにちは\n世界', 'こんにちは\n地球');
    expect(segments).toHaveLength(2);
    expect(segments[1]).toEqual({
      type: 'change',
      a: ['世界'],
      b: ['地球'],
    });
  });

  it('絵文字を含むテキストを正しく処理できる', () => {
    const segments = buildSegments('👋\nworld', '👋\n🌍');
    expect(countChanges(segments)).toBe(1);
    expect(mergeSegments(segments, ['a'])).toBe('👋\nworld');
  });

  it('混合言語のテキストを正しく処理できる', () => {
    const segments = buildSegments('Hello\n日本語', 'Hello\n世界');
    expect(countChanges(segments)).toBe(1);
    expect(mergeSegments(segments, ['b'])).toBe('Hello\n世界');
  });
});
