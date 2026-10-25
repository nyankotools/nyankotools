import { describe, expect, it } from 'vitest';
import {
  buildDuplicateGroups,
  filesToHash,
  formatBytes,
  groupBySize,
  groupsToCsv,
  groupsToText,
  sha256Hex,
  summarizeGroups,
  type FileInfo,
} from './duplicate-file-finder';

const f = (id: number, path: string, size: number): FileInfo => ({
  id,
  path,
  size,
});

describe('groupBySize', () => {
  it('同サイズが2件以上のグループだけを返す', () => {
    const groups = groupBySize([f(1, 'a', 10), f(2, 'b', 10), f(3, 'c', 20)]);
    expect(groups).toHaveLength(1);
    expect(groups[0].map((x) => x.id)).toEqual([1, 2]);
  });

  it('空配列・全部異なるサイズでは空', () => {
    expect(groupBySize([])).toEqual([]);
    expect(filesToHash([f(1, 'a', 1), f(2, 'b', 2)])).toEqual([]);
  });

  it('filesToHash は候補ファイルをまとめて返す', () => {
    const list = filesToHash([
      f(1, 'a', 5),
      f(2, 'b', 5),
      f(3, 'c', 7),
      f(4, 'd', 7),
      f(5, 'e', 9),
    ]);
    expect(list.map((x) => x.id)).toEqual([1, 2, 3, 4]);
  });
});

describe('buildDuplicateGroups / summarizeGroups', () => {
  const files = [
    f(1, 'a.txt', 100),
    f(2, 'b.txt', 100),
    f(3, 'c.txt', 100),
    f(4, 'd.txt', 100),
    f(5, 'e.bin', 1000),
    f(6, 'f.bin', 1000),
  ];
  const hashes = new Map<number, string>([
    [1, 'aa'],
    [2, 'aa'],
    [3, 'aa'],
    [4, 'bb'], // 同サイズでも中身が違う
    [5, 'cc'],
    [6, 'cc'],
  ]);

  it('ハッシュ一致のみグループ化し、無駄容量の大きい順に並べる', () => {
    const groups = buildDuplicateGroups(files, hashes);
    expect(groups).toHaveLength(2);
    expect(groups[0].hash).toBe('cc');
    expect(groups[0].wastedBytes).toBe(1000);
    expect(groups[1].hash).toBe('aa');
    expect(groups[1].files).toHaveLength(3);
    expect(groups[1].wastedBytes).toBe(200);
  });

  it('集計できる', () => {
    const summary = summarizeGroups(buildDuplicateGroups(files, hashes));
    expect(summary).toEqual({ groupCount: 2, fileCount: 5, wastedBytes: 1200 });
  });

  it('ハッシュが無いファイルは無視し、重複が無ければ空', () => {
    expect(buildDuplicateGroups(files, new Map())).toEqual([]);
    expect(summarizeGroups([])).toEqual({
      groupCount: 0,
      fileCount: 0,
      wastedBytes: 0,
    });
  });

  it('サイズが違えばハッシュが同じでも別グループ（衝突対策）', () => {
    const groups = buildDuplicateGroups(
      [f(1, 'a', 1), f(2, 'b', 2)],
      new Map([
        [1, 'zz'],
        [2, 'zz'],
      ]),
    );
    expect(groups).toEqual([]);
  });
});

describe('formatBytes', () => {
  it('単位を切り替える', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1023)).toBe('1023 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB');
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(NaN)).toBe('0 B');
    expect(formatBytes(1024 * 1024 * 1024 * 1024 * 2)).toBe('2 TB');
  });
  // 既知の不具合: 1023.99… KB が「1024 KB」と表示される（本来は 1 MB）。
  // 修正されたら it.fails を it に変えること。
  it('単位の繰り上がり境界では次の単位で表示する', () => {
    expect(formatBytes(1024 * 1024 - 1)).toBe('1 MB');
  });
});

describe('sha256Hex', () => {
  it('既知のハッシュ値と一致する', async () => {
    expect(await sha256Hex(new TextEncoder().encode('hello'))).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
    expect(await sha256Hex(new Uint8Array(0))).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

describe('出力', () => {
  const groups = buildDuplicateGroups(
    [f(1, 'dir/a,1.txt', 3), f(2, '=cmd.txt', 3)],
    new Map([
      [1, 'h'],
      [2, 'h'],
    ]),
  );

  it('CSVはエスケープと式の無効化を行う', () => {
    const csv = groupsToCsv(groups, ['group', 'size', 'sha256', 'path']);
    expect(csv.split('\r\n')).toEqual([
      'group,size,sha256,path',
      '1,3,h,"dir/a,1.txt"',
      "1,3,h,'=cmd.txt",
    ]);
  });

  it('CSVはダブルクォートと改行を含むパスを正しくエスケープする', () => {
    const quoted = buildDuplicateGroups(
      [f(1, 'say "hi".txt', 1), f(2, 'line\nbreak.txt', 1)],
      new Map([
        [1, 'h'],
        [2, 'h'],
      ]),
    );
    const csv = groupsToCsv(quoted, ['group', 'size', 'sha256', 'path']);
    expect(csv.split('\r\n')).toEqual([
      'group,size,sha256,path',
      '1,1,h,"say ""hi"".txt"',
      '1,1,h,"line\nbreak.txt"',
    ]);
  });

  it('グループが無ければCSVはヘッダ行だけ', () => {
    expect(groupsToCsv([], ['g', 's', 'h', 'p'])).toBe('g,s,h,p');
  });

  it('テキストはグループごとに空行で区切る', () => {
    const text = groupsToText(groups, (n, g) => `#${n} ${g.size}`);
    expect(text).toBe('#1 3\ndir/a,1.txt\n=cmd.txt');
    expect(groupsToText([], () => '')).toBe('');
  });
});
