import { describe, expect, it } from 'vitest';
import {
  applyUmask,
  calculateFromUmask,
  parseMode,
  parseUmask,
  reverseUmask,
  toOctal3,
  toSymbolic,
  toSymbolicClauses,
} from './umask-calculator';

describe('parseUmask', () => {
  it('1〜4桁の8進数を受け付ける', () => {
    expect(parseUmask('022')).toBe(0o22);
    expect(parseUmask('22')).toBe(0o22);
    expect(parseUmask('0022')).toBe(0o22);
    expect(parseUmask(' 077 ')).toBe(0o77);
    expect(parseUmask('0')).toBe(0);
  });

  it('不正な形式はnull', () => {
    expect(parseUmask('')).toBeNull();
    expect(parseUmask('088')).toBeNull();
    expect(parseUmask('abc')).toBeNull();
    expect(parseUmask('12345')).toBeNull();
    expect(parseUmask('4022')).toBeNull();
    expect(parseUmask('-022')).toBeNull();
  });
});

describe('parseMode', () => {
  it('3〜4桁の8進数を受け付ける', () => {
    expect(parseMode('644')).toBe(0o644);
    expect(parseMode('0644')).toBe(0o644);
  });

  it('不正な形式はnull', () => {
    expect(parseMode('64')).toBeNull();
    expect(parseMode('888')).toBeNull();
    expect(parseMode('4755')).toBeNull();
    expect(parseMode('')).toBeNull();
  });
});

describe('表記変換', () => {
  it('toOctal3は3桁にゼロ埋めする', () => {
    expect(toOctal3(0)).toBe('000');
    expect(toOctal3(0o22)).toBe('022');
    expect(toOctal3(0o777)).toBe('777');
  });

  it('toSymbolic', () => {
    expect(toSymbolic(0o644)).toBe('rw-r--r--');
    expect(toSymbolic(0o755)).toBe('rwxr-xr-x');
    expect(toSymbolic(0)).toBe('---------');
  });

  it('toSymbolicClauses（umask -S 形式）', () => {
    expect(toSymbolicClauses(0o755)).toBe('u=rwx,g=rx,o=rx');
    expect(toSymbolicClauses(0o700)).toBe('u=rwx,g=,o=');
    expect(toSymbolicClauses(0o777)).toBe('u=rwx,g=rwx,o=rwx');
  });
});

describe('applyUmask', () => {
  it('基準からumaskのビットを除く', () => {
    expect(applyUmask(0o022, 0o666)).toBe(0o644);
    expect(applyUmask(0o022, 0o777)).toBe(0o755);
  });
});

describe('calculateFromUmask', () => {
  it('022: ファイル644・ディレクトリ755', () => {
    const r = calculateFromUmask(0o022);
    expect(r.file.octal).toBe('644');
    expect(r.file.symbolic).toBe('rw-r--r--');
    expect(r.directory.octal).toBe('755');
    expect(r.directory.symbolic).toBe('rwxr-xr-x');
    expect(r.command).toBe('umask 022');
    expect(r.symbolicCommandOutput).toBe('u=rwx,g=rx,o=rx');
  });

  it('002: ファイル664・ディレクトリ775', () => {
    const r = calculateFromUmask(0o002);
    expect(r.file.octal).toBe('664');
    expect(r.directory.octal).toBe('775');
  });

  it('077: ファイル600・ディレクトリ700', () => {
    const r = calculateFromUmask(0o077);
    expect(r.file.octal).toBe('600');
    expect(r.directory.octal).toBe('700');
  });

  it('000: ファイル666（実行ビットは付かない）・ディレクトリ777', () => {
    const r = calculateFromUmask(0);
    expect(r.file.octal).toBe('666');
    expect(r.directory.octal).toBe('777');
  });

  it('777: すべて000', () => {
    const r = calculateFromUmask(0o777);
    expect(r.file.octal).toBe('000');
    expect(r.directory.octal).toBe('000');
    expect(r.file.symbolic).toBe('---------');
  });

  it('027: ファイル640・ディレクトリ750', () => {
    const r = calculateFromUmask(0o027);
    expect(r.file.octal).toBe('640');
    expect(r.directory.octal).toBe('750');
  });

  it('umaskに実行ビットが含まれてもファイル結果は666が上限', () => {
    expect(calculateFromUmask(0o001).file.octal).toBe('666');
    expect(calculateFromUmask(0o001).directory.octal).toBe('776');
  });
});

describe('reverseUmask', () => {
  it('ファイル644 → 022', () => {
    const r = reverseUmask(0o644, 'file');
    expect(r.umaskOctal).toBe('022');
    expect(r.achieved.octal).toBe('644');
    expect(r.hasUnreachable).toBe(false);
  });

  it('ディレクトリ750 → 027', () => {
    const r = reverseUmask(0o750, 'directory');
    expect(r.umaskOctal).toBe('027');
    expect(r.achieved.octal).toBe('750');
    expect(r.hasUnreachable).toBe(false);
  });

  it('ファイル600 → 066、ディレクトリ700 → 077', () => {
    expect(reverseUmask(0o600, 'file').umaskOctal).toBe('066');
    expect(reverseUmask(0o700, 'directory').umaskOctal).toBe('077');
  });

  it('ファイルに実行権限を指定すると到達不能ビットとして報告する', () => {
    const r = reverseUmask(0o755, 'file');
    expect(r.umaskOctal).toBe('022');
    expect(r.achieved.octal).toBe('644');
    expect(r.hasUnreachable).toBe(true);
    expect(r.unreachableOctal).toBe('111');
  });

  it('逆算したumaskを順方向に戻すと一致する（ディレクトリは全パターン）', () => {
    for (let d = 0; d <= 0o777; d++) {
      const r = reverseUmask(d, 'directory');
      expect(calculateFromUmask(r.umask).directory.mode).toBe(d);
    }
  });

  it('ファイルはxビットを除いたパターンで一致する', () => {
    for (let d = 0; d <= 0o777; d++) {
      const r = reverseUmask(d, 'file');
      expect(calculateFromUmask(r.umask).file.mode).toBe(d & 0o666);
    }
  });
});

describe('境界・入力パターン', () => {
  it('parseUmask の 4 桁は 0777 まで、0000 と 7777 は区別する', () => {
    expect(parseUmask('0000')).toBe(0);
    expect(parseUmask('0777')).toBe(0o777);
    expect(parseUmask('7777')).toBeNull();
  });

  it('parseMode は前後の空白を許容し、全角数字は不正', () => {
    expect(parseMode('  755 ')).toBe(0o755);
    expect(parseMode('７５５')).toBeNull();
    expect(parseUmask('０２２')).toBeNull();
  });

  it('toSymbolic は setuid などの特殊ビットを無視する', () => {
    expect(toSymbolic(0o4644)).toBe('rw-r--r--');
    expect(toSymbolic(0o1777)).toBe('rwxrwxrwx');
  });

  it('calculateFromUmask は 9 ビット超の値を 0o777 に丸める', () => {
    const r = calculateFromUmask(0o1022);
    expect(r.umask).toBe(0o022);
    expect(r.command).toBe('umask 022');
  });
});
