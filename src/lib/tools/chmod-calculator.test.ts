import { describe, expect, it } from 'vitest';
import {
  type ChmodPermissions,
  octalToPermissions,
  permissionsToChmodCommand,
  permissionsToOctal,
  permissionsToSymbolic,
  symbolicToPermissions,
} from './chmod-calculator';

const rwxr_xr_x: ChmodPermissions = {
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: true },
  other: { read: true, write: false, execute: true },
  setuid: false,
  setgid: false,
  sticky: false,
};

describe('permissionsToOctal', () => {
  it('rwxr-xr-x を755に変換する', () => {
    expect(permissionsToOctal(rwxr_xr_x)).toBe('755');
  });

  it('全権限なしは000', () => {
    expect(
      permissionsToOctal({
        owner: { read: false, write: false, execute: false },
        group: { read: false, write: false, execute: false },
        other: { read: false, write: false, execute: false },
        setuid: false,
        setgid: false,
        sticky: false,
      }),
    ).toBe('000');
  });

  it('全権限ありは777', () => {
    expect(
      permissionsToOctal({
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: true, execute: true },
        other: { read: true, write: true, execute: true },
        setuid: false,
        setgid: false,
        sticky: false,
      }),
    ).toBe('777');
  });

  it('特殊権限（setuid/setgid/sticky）があれば4桁になる', () => {
    expect(permissionsToOctal({ ...rwxr_xr_x, setuid: true })).toBe('4755');
    expect(permissionsToOctal({ ...rwxr_xr_x, setgid: true })).toBe('2755');
    expect(permissionsToOctal({ ...rwxr_xr_x, sticky: true })).toBe('1755');
    expect(
      permissionsToOctal({
        ...rwxr_xr_x,
        setuid: true,
        setgid: true,
        sticky: true,
      }),
    ).toBe('7755');
  });
});

describe('octalToPermissions', () => {
  it('3桁の8進数をパースする（例: 755）', () => {
    expect(octalToPermissions('755')).toEqual(rwxr_xr_x);
  });

  it('4桁の8進数（先頭0）は特殊権限なしとしてパースする', () => {
    expect(octalToPermissions('0755')).toEqual(rwxr_xr_x);
  });

  it('4桁の8進数の特殊権限ビットをパースする', () => {
    expect(octalToPermissions('4755')).toEqual({ ...rwxr_xr_x, setuid: true });
    expect(octalToPermissions('2755')).toEqual({ ...rwxr_xr_x, setgid: true });
    expect(octalToPermissions('1755')).toEqual({ ...rwxr_xr_x, sticky: true });
  });

  it('前後の空白は無視する', () => {
    expect(octalToPermissions('  755  ')).toEqual(rwxr_xr_x);
  });

  it('不正な形式はnull', () => {
    expect(octalToPermissions('')).toBeNull();
    expect(octalToPermissions('75')).toBeNull(); // 桁数不足
    expect(octalToPermissions('75589')).toBeNull(); // 桁数超過
    expect(octalToPermissions('789')).toBeNull(); // 0-7の範囲外
    expect(octalToPermissions('abc')).toBeNull();
    expect(octalToPermissions('rwx')).toBeNull();
    expect(octalToPermissions('全角')).toBeNull();
    expect(octalToPermissions('７５５')).toBeNull(); // 全角数字は不可
    expect(octalToPermissions('+755')).toBeNull(); // 符号付きは不可
    expect(octalToPermissions('7.5.5')).toBeNull();
    expect(octalToPermissions('7'.repeat(1000))).toBeNull(); // 極端に長い入力
  });

  it('改行やタブを含む前後の空白も無視する', () => {
    expect(octalToPermissions('\n755\t')).toEqual(rwxr_xr_x);
  });

  it('0000（権限なし）をパースする', () => {
    expect(octalToPermissions('0000')).toEqual({
      owner: { read: false, write: false, execute: false },
      group: { read: false, write: false, execute: false },
      other: { read: false, write: false, execute: false },
      setuid: false,
      setgid: false,
      sticky: false,
    });
  });

  it('7777（全権限＋全特殊権限）をパースする', () => {
    expect(octalToPermissions('7777')).toEqual({
      owner: { read: true, write: true, execute: true },
      group: { read: true, write: true, execute: true },
      other: { read: true, write: true, execute: true },
      setuid: true,
      setgid: true,
      sticky: true,
    });
  });
});

describe('permissionsToSymbolic', () => {
  it('rwxr-xr-x のシンボル表記を返す', () => {
    expect(permissionsToSymbolic(rwxr_xr_x)).toBe('rwxr-xr-x');
  });

  it('setuidが有効かつ所有者実行権限ありなら小文字s', () => {
    expect(permissionsToSymbolic({ ...rwxr_xr_x, setuid: true })).toBe(
      'rwsr-xr-x',
    );
  });

  it('setuidが有効でも所有者実行権限が無ければ大文字S', () => {
    expect(
      permissionsToSymbolic({
        ...rwxr_xr_x,
        owner: { ...rwxr_xr_x.owner, execute: false },
        setuid: true,
      }),
    ).toBe('rwSr-xr-x');
  });

  it('setgidが有効かつグループ実行権限ありなら小文字s', () => {
    expect(permissionsToSymbolic({ ...rwxr_xr_x, setgid: true })).toBe(
      'rwxr-sr-x',
    );
  });

  it('stickyが有効かつその他実行権限ありなら小文字t', () => {
    expect(permissionsToSymbolic({ ...rwxr_xr_x, sticky: true })).toBe(
      'rwxr-xr-t',
    );
  });

  it('stickyが有効でもその他実行権限が無ければ大文字T', () => {
    expect(
      permissionsToSymbolic({
        ...rwxr_xr_x,
        other: { ...rwxr_xr_x.other, execute: false },
        sticky: true,
      }),
    ).toBe('rwxr-xr-T');
  });

  it('setgidが有効でもグループ実行権限が無ければ大文字S', () => {
    expect(
      permissionsToSymbolic({
        ...rwxr_xr_x,
        group: { ...rwxr_xr_x.group, execute: false },
        setgid: true,
      }),
    ).toBe('rwxr-Sr-x');
  });

  it('全権限なし（000）は---------', () => {
    expect(
      permissionsToSymbolic({
        owner: { read: false, write: false, execute: false },
        group: { read: false, write: false, execute: false },
        other: { read: false, write: false, execute: false },
        setuid: false,
        setgid: false,
        sticky: false,
      }),
    ).toBe('---------');
  });

  it('実行権限が無い状態で特殊権限3つとも有効なら全て大文字（S/S/T）', () => {
    expect(
      permissionsToSymbolic({
        owner: { read: true, write: true, execute: false },
        group: { read: true, write: true, execute: false },
        other: { read: true, write: true, execute: false },
        setuid: true,
        setgid: true,
        sticky: true,
      }),
    ).toBe('rwSrwSrwT');
  });

  it('全権限＋全特殊権限（7777）はrwsrwsrwt', () => {
    expect(
      permissionsToSymbolic({
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: true, execute: true },
        other: { read: true, write: true, execute: true },
        setuid: true,
        setgid: true,
        sticky: true,
      }),
    ).toBe('rwsrwsrwt');
  });
});

describe('symbolicToPermissions', () => {
  it('9文字のシンボル表記をパースする', () => {
    expect(symbolicToPermissions('rwxr-xr-x')).toEqual(rwxr_xr_x);
  });

  it('先頭にファイル種別文字が付く10文字（ls -l形式）も許容する', () => {
    expect(symbolicToPermissions('-rwxr-xr-x')).toEqual(rwxr_xr_x);
    expect(symbolicToPermissions('drwxr-xr-x')).toEqual(rwxr_xr_x);
  });

  it('小文字s（setuid・実行権限あり）をパースする', () => {
    expect(symbolicToPermissions('rwsr-xr-x')).toEqual({
      ...rwxr_xr_x,
      setuid: true,
    });
  });

  it('大文字S（setuid・実行権限なし）をパースする', () => {
    expect(symbolicToPermissions('rwSr-xr-x')).toEqual({
      ...rwxr_xr_x,
      owner: { ...rwxr_xr_x.owner, execute: false },
      setuid: true,
    });
  });

  it('小文字t（sticky・実行権限あり）をパースする', () => {
    expect(symbolicToPermissions('rwxr-xr-t')).toEqual({
      ...rwxr_xr_x,
      sticky: true,
    });
  });

  it('前後の空白は無視する', () => {
    expect(symbolicToPermissions('  rwxr-xr-x  ')).toEqual(rwxr_xr_x);
  });

  it('不正な形式はnull', () => {
    expect(symbolicToPermissions('')).toBeNull();
    expect(symbolicToPermissions('rwxr-xr-')).toBeNull(); // 桁数不足
    expect(symbolicToPermissions('rwxr-xr-xrwx')).toBeNull(); // 桁数超過
    expect(symbolicToPermissions('755')).toBeNull();
    expect(symbolicToPermissions('rwzr-xr-x')).toBeNull(); // 不正な文字
    expect(symbolicToPermissions('abc')).toBeNull();
    expect(symbolicToPermissions('RWXR-XR-X')).toBeNull(); // 大文字r/w/xは不可
    expect(symbolicToPermissions('ｒｗｘｒ-ｘｒ-ｘ')).toBeNull(); // 全角文字は不可
    expect(symbolicToPermissions('x'.repeat(1000))).toBeNull(); // 極端に長い入力
  });

  it('全て権限なし（---------）をパースする', () => {
    expect(symbolicToPermissions('---------')).toEqual({
      owner: { read: false, write: false, execute: false },
      group: { read: false, write: false, execute: false },
      other: { read: false, write: false, execute: false },
      setuid: false,
      setgid: false,
      sticky: false,
    });
  });

  it('全権限＋特殊権限（rwsrwsrwt）をパースする', () => {
    expect(symbolicToPermissions('rwsrwsrwt')).toEqual({
      owner: { read: true, write: true, execute: true },
      group: { read: true, write: true, execute: true },
      other: { read: true, write: true, execute: true },
      setuid: true,
      setgid: true,
      sticky: true,
    });
  });
});

describe('permissionsToOctal / symbolicToPermissions の往復変換', () => {
  it('755 -> パース -> symbolic -> パース で同じ結果になる', () => {
    const parsed = octalToPermissions('755')!;
    const symbolic = permissionsToSymbolic(parsed);
    expect(symbolicToPermissions(symbolic)).toEqual(parsed);
    expect(permissionsToOctal(symbolicToPermissions(symbolic)!)).toBe('755');
  });

  it('4750（setuid付き） の往復変換', () => {
    const parsed = octalToPermissions('4750')!;
    const symbolic = permissionsToSymbolic(parsed);
    expect(symbolic).toBe('rwsr-x---');
    expect(symbolicToPermissions(symbolic)).toEqual(parsed);
    expect(permissionsToOctal(symbolicToPermissions(symbolic)!)).toBe('4750');
  });

  it('0000（権限なし）の往復変換', () => {
    const parsed = octalToPermissions('0000')!;
    const symbolic = permissionsToSymbolic(parsed);
    expect(symbolic).toBe('---------');
    expect(symbolicToPermissions(symbolic)).toEqual(parsed);
    expect(permissionsToOctal(symbolicToPermissions(symbolic)!)).toBe('000');
  });

  it('7777（全権限＋全特殊権限）の往復変換', () => {
    const parsed = octalToPermissions('7777')!;
    const symbolic = permissionsToSymbolic(parsed);
    expect(symbolic).toBe('rwsrwsrwt');
    expect(symbolicToPermissions(symbolic)).toEqual(parsed);
    expect(permissionsToOctal(symbolicToPermissions(symbolic)!)).toBe('7777');
  });
});

describe('permissionsToChmodCommand', () => {
  it('chmodコマンド文字列を生成する', () => {
    expect(permissionsToChmodCommand(rwxr_xr_x, 'ファイル名')).toBe(
      'chmod 755 ファイル名',
    );
  });

  it('対象ファイル名を指定できる', () => {
    expect(permissionsToChmodCommand(rwxr_xr_x, 'script.sh')).toBe(
      'chmod 755 script.sh',
    );
  });

  it('特殊権限があれば4桁の8進数がコマンドに含まれる', () => {
    expect(
      permissionsToChmodCommand({ ...rwxr_xr_x, setuid: true }, 'script.sh'),
    ).toBe('chmod 4755 script.sh');
  });

  it('空文字のtargetでも末尾スペース付きの文字列を返す（呼び出し側の責務）', () => {
    expect(permissionsToChmodCommand(rwxr_xr_x, '')).toBe('chmod 755 ');
  });
});
