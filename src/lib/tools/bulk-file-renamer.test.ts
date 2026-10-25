import { describe, expect, it } from 'vitest';
import {
  DEFAULT_OPTIONS,
  MAX_FILES,
  formatNumber,
  planRenames,
  sortNatural,
  splitName,
  type RenameOptions,
} from './bulk-file-renamer';

function opts(patch: Partial<RenameOptions> = {}): RenameOptions {
  return { ...DEFAULT_OPTIONS, ...patch };
}
function numbering(patch: Partial<RenameOptions['numbering']>) {
  return { ...DEFAULT_OPTIONS.numbering, enabled: true, ...patch };
}
const renamed = (names: string[], o: RenameOptions) =>
  planRenames(names, o).rows.map((r) => r.renamed);

describe('splitName', () => {
  it('最後のドットで本体と拡張子に分ける', () => {
    expect(splitName('a.tar.gz')).toEqual({ stem: 'a.tar', ext: 'gz' });
    expect(splitName('photo.JPG')).toEqual({ stem: 'photo', ext: 'JPG' });
  });
  it('先頭のみ・末尾のみのドットは拡張子扱いしない', () => {
    expect(splitName('.bashrc')).toEqual({ stem: '.bashrc', ext: '' });
    expect(splitName('name.')).toEqual({ stem: 'name.', ext: '' });
    expect(splitName('noext')).toEqual({ stem: 'noext', ext: '' });
  });
});

describe('planRenames: 連番', () => {
  it('末尾に連番を付ける', () => {
    expect(
      renamed(['a.txt', 'b.txt'], opts({ numbering: numbering({}) })),
    ).toEqual(['a_001.txt', 'b_002.txt']);
  });
  it('先頭・名前置き換え・開始値・増分・桁数', () => {
    const n = numbering({ position: 'replace', start: 10, step: 5, digits: 2 });
    expect(
      renamed(['x.png', 'y.png', 'z.png'], opts({ numbering: n })),
    ).toEqual(['10.png', '15.png', '20.png']);
    const p = numbering({ position: 'prefix', separator: '-', digits: 1 });
    expect(renamed(['x.png'], opts({ numbering: p }))).toEqual(['1-x.png']);
  });
  it('桁数より大きい数はそのまま桁が増える', () => {
    expect(formatNumber(1234, 3)).toBe('1234');
    expect(formatNumber(7, 4)).toBe('0007');
  });
  it('不正な桁数・開始値・増分は error になる', () => {
    for (const patch of [
      { digits: 11 },
      { digits: 0 },
      { digits: 1.5 },
      { start: -1 },
      { start: 1e12 },
      { step: 0 },
      { step: Number.NaN },
    ]) {
      const plan = planRenames(['a'], opts({ numbering: numbering(patch) }));
      expect(plan.error, JSON.stringify(patch)).toBe('invalid-number');
      expect(plan.rows).toEqual([]);
    }
  });
  it('連番が無効なら数値の検証だけでなく連番自体も付かない', () => {
    expect(
      renamed(
        ['a.txt'],
        opts({ numbering: { ...numbering({}), enabled: false } }),
      ),
    ).toEqual(['a.txt']);
  });
});

describe('planRenames: 置換', () => {
  it('通常文字列は全て置換し、$ を特別扱いしない', () => {
    expect(
      renamed(['a.b.a.txt'], opts({ find: 'a', replaceWith: '$&$1' })),
    ).toEqual(['$&$1.b.$&$1.txt']);
  });
  it('正規表現とキャプチャグループ', () => {
    expect(
      renamed(
        ['IMG_001.jpg'],
        opts({ find: 'IMG_(\\d+)', replaceWith: 'photo-$1', useRegex: true }),
      ),
    ).toEqual(['photo-001.jpg']);
  });
  it('大文字小文字を区別しない指定', () => {
    expect(
      renamed(
        ['ABC.txt'],
        opts({ find: 'b', replaceWith: 'x', ignoreCase: true }),
      ),
    ).toEqual(['AxC.txt']);
    expect(renamed(['ABC.txt'], opts({ find: 'b', replaceWith: 'x' }))).toEqual(
      ['ABC.txt'],
    );
  });
  it('拡張子は置換の対象にならない', () => {
    expect(
      renamed(['a.txt'], opts({ find: 'txt', replaceWith: 'md' })),
    ).toEqual(['a.txt']);
  });
  it('不正な正規表現・長すぎるパターンは error', () => {
    expect(planRenames(['a'], opts({ find: '(', useRegex: true })).error).toBe(
      'invalid-regex',
    );
    expect(
      planRenames(['a'], opts({ find: 'a'.repeat(201), useRegex: true })).error,
    ).toBe('pattern-too-long');
    expect(planRenames(['a'], opts({ prefix: 'x'.repeat(101) })).error).toBe(
      'text-too-long',
    );
  });
  it('( を通常文字列として置換できる', () => {
    expect(
      renamed(['a(1).txt'], opts({ find: '(1)', replaceWith: '' })),
    ).toEqual(['a.txt']);
  });
});

describe('planRenames: 大小変換・接頭辞・拡張子', () => {
  it('本体のみ大小変換し、拡張子は extMode で決まる', () => {
    expect(renamed(['Photo.JPG'], opts({ caseMode: 'lower' }))).toEqual([
      'photo.JPG',
    ]);
    expect(
      renamed(['Photo.JPG'], opts({ caseMode: 'upper', extMode: 'lower' })),
    ).toEqual(['PHOTO.jpg']);
    expect(renamed(['a.txt'], opts({ extMode: 'upper' }))).toEqual(['a.TXT']);
  });
  it('拡張子の変更・削除。変更先の先頭ドットは無視', () => {
    expect(
      renamed(['a.txt'], opts({ extMode: 'change', newExt: '.md' })),
    ).toEqual(['a.md']);
    expect(renamed(['a.txt'], opts({ extMode: 'remove' }))).toEqual(['a']);
    expect(renamed(['a'], opts({ extMode: 'change', newExt: 'md' }))).toEqual([
      'a.md',
    ]);
  });
  it('接頭辞・接尾辞は本体の前後に付く', () => {
    expect(
      renamed(['a.txt'], opts({ prefix: '2026_', suffix: '_v2' })),
    ).toEqual(['2026_a_v2.txt']);
  });
});

describe('planRenames: 問題の検出', () => {
  it('結果が同じ名前は大小文字を区別せず duplicate になりブロックされる', () => {
    const plan = planRenames(
      ['a.txt', 'b.txt', 'c.txt'],
      opts({ find: 'a', replaceWith: 'B' }),
    );
    expect(plan.rows[0].issues).toContain('duplicate');
    expect(plan.rows[1].issues).toContain('duplicate');
    expect(plan.rows[2].issues).not.toContain('duplicate');
    expect(plan.blocked).toBe(true);
  });
  it('入力に同名が2つあれば、変更しなくても duplicate', () => {
    expect(planRenames(['a.txt', 'a.txt'], opts()).blocked).toBe(true);
  });
  it('禁止文字とパス区切りは _ になり sanitized が付く', () => {
    const plan = planRenames(
      ['a.txt'],
      opts({ suffix: '/b:c*d', find: '', replaceWith: '' }),
    );
    expect(plan.rows[0].renamed).toBe('a_b_c_d.txt');
    expect(plan.rows[0].issues).toContain('sanitized');
    expect(plan.blocked).toBe(false);
  });
  it('置換で ../ を作っても親ディレクトリには出られない', () => {
    const plan = planRenames(
      ['a.txt'],
      opts({ find: 'a', replaceWith: '../x' }),
    );
    expect(plan.rows[0].renamed).toBe('.._x.txt');
    expect(plan.rows[0].renamed).not.toContain('/');
  });
  it('空・ドットだけの結果はブロックされる', () => {
    const plan = planRenames(
      ['a.txt'],
      opts({ find: 'a', replaceWith: '', extMode: 'remove' }),
    );
    expect(plan.rows[0].renamed).toBe('');
    expect(plan.rows[0].issues).toContain('empty');
    expect(plan.blocked).toBe(true);
    expect(
      planRenames(['a'], opts({ find: 'a', replaceWith: '..' })).rows[0].issues,
    ).toContain('empty');
  });
  it('末尾のドットと空白は取り除かれる', () => {
    const plan = planRenames(
      ['a.txt'],
      opts({ extMode: 'change', newExt: ' ' }),
    );
    expect(plan.rows[0].renamed).toBe('a');
    expect(plan.rows[0].issues).toContain('sanitized');
  });
  it('Windows の予約名は警告のみ', () => {
    const plan = planRenames(
      ['a.txt'],
      opts({ find: 'a', replaceWith: 'CON' }),
    );
    expect(plan.rows[0].issues).toContain('reserved');
    expect(plan.blocked).toBe(false);
  });
  it('255文字を超える名前はブロックされる', () => {
    const plan = planRenames(
      ['a.txt'],
      opts({
        prefix: 'x'.repeat(100),
        suffix: 'y'.repeat(100),
        find: 'a',
        replaceWith: 'z'.repeat(100),
      }),
    );
    expect(plan.rows[0].issues).toContain('too-long');
    expect(plan.blocked).toBe(true);
  });
  it('変更なしのファイルは changed が false', () => {
    const plan = planRenames(
      ['a.txt', 'b.txt'],
      opts({ find: 'a', replaceWith: 'c' }),
    );
    expect(plan.rows.map((r) => r.changed)).toEqual([true, false]);
    expect(plan.changedCount).toBe(1);
  });
  it('ファイル数が上限を超えると error', () => {
    const names = Array.from({ length: MAX_FILES + 1 }, (_, i) => `f${i}`);
    expect(planRenames(names, opts()).error).toBe('too-many-files');
    expect(
      planRenames(names.slice(0, MAX_FILES), opts()).error,
    ).toBeUndefined();
  });
  it('空の一覧は問題なし', () => {
    const plan = planRenames([], opts());
    expect(plan.rows).toEqual([]);
    expect(plan.blocked).toBe(false);
  });
});

describe('planRenames: 追加の境界・多バイト文字', () => {
  it('日本語・絵文字（サロゲートペア）の名前を壊さず置換する', () => {
    expect(
      renamed(
        ['日本語.txt', '😀絵文字.png'],
        opts({ find: '絵文字', replaceWith: 'テスト' }),
      ),
    ).toEqual(['日本語.txt', '😀テスト.png']);
    expect(
      renamed(
        ['写真😀.jpg'],
        opts({ numbering: numbering({ position: 'prefix' }) }),
      ),
    ).toEqual(['001_写真😀.jpg']);
  });

  it('255文字ちょうどは許可され、256文字で too-long', () => {
    // 本体 + ".txt"（本体の長さ + 4文字）。接頭辞は100文字制限があるため入力名で作る
    const at255 = planRenames(['x'.repeat(251) + '.txt'], opts());
    expect(at255.rows[0].renamed.length).toBe(255);
    expect(at255.rows[0].issues).not.toContain('too-long');
    const at256 = planRenames(['x'.repeat(252) + '.txt'], opts());
    expect(at256.rows[0].renamed.length).toBe(256);
    expect(at256.rows[0].issues).toContain('too-long');
    expect(at256.blocked).toBe(true);
  });

  it('制御文字は _ になる', () => {
    const plan = planRenames(['a.txt'], opts({ suffix: '\u0001' }));
    expect(plan.rows[0].renamed).toBe('a_.txt');
    expect(plan.rows[0].issues).toContain('sanitized');
  });

  it('大小変換後に同じ名前になるものは大小文字を区別せず duplicate', () => {
    const plan = planRenames(
      ['a.txt', 'A.txt'],
      opts({ caseMode: 'lower', extMode: 'lower' }),
    );
    expect(plan.rows.map((r) => r.renamed)).toEqual(['a.txt', 'a.txt']);
    expect(plan.blocked).toBe(true);
  });
});

describe('sortNatural', () => {
  it('数字を数値として並べる', () => {
    expect(sortNatural(['f10', 'f2', 'f1'])).toEqual(['f1', 'f2', 'f10']);
  });
  it('元の配列を変更しない', () => {
    const src = ['b', 'a'];
    sortNatural(src);
    expect(src).toEqual(['b', 'a']);
  });
});
