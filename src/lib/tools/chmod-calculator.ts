export interface PermissionSet {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface ChmodPermissions {
  owner: PermissionSet;
  group: PermissionSet;
  other: PermissionSet;
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
}

function permissionSetToDigit(p: PermissionSet): number {
  return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
}

function digitToPermissionSet(digit: number): PermissionSet {
  return {
    read: (digit & 4) !== 0,
    write: (digit & 2) !== 0,
    execute: (digit & 1) !== 0,
  };
}

/** 特殊権限（setuid/setgid/sticky）が1つも無ければ3桁、あれば4桁の8進数文字列を返す */
export function permissionsToOctal(permissions: ChmodPermissions): string {
  const specialDigit =
    (permissions.setuid ? 4 : 0) +
    (permissions.setgid ? 2 : 0) +
    (permissions.sticky ? 1 : 0);
  const digits = [
    permissionSetToDigit(permissions.owner),
    permissionSetToDigit(permissions.group),
    permissionSetToDigit(permissions.other),
  ].join('');
  return specialDigit === 0 ? digits : `${specialDigit}${digits}`;
}

/** "755" "0755" "4755" のような3〜4桁の8進数文字列をパースする。不正な形式はnull */
export function octalToPermissions(input: string): ChmodPermissions | null {
  const trimmed = input.trim();
  if (!/^[0-7]{3,4}$/.test(trimmed)) return null;

  const digits = trimmed.length === 4 ? trimmed : `0${trimmed}`;
  const [specialDigit, ownerDigit, groupDigit, otherDigit] = digits
    .split('')
    .map(Number);

  return {
    owner: digitToPermissionSet(ownerDigit),
    group: digitToPermissionSet(groupDigit),
    other: digitToPermissionSet(otherDigit),
    setuid: (specialDigit & 4) !== 0,
    setgid: (specialDigit & 2) !== 0,
    sticky: (specialDigit & 1) !== 0,
  };
}

function permissionSetToSymbolic(
  p: PermissionSet,
  specialChars: { on: string; off: string } | null,
): string {
  const read = p.read ? 'r' : '-';
  const write = p.write ? 'w' : '-';
  const execute = specialChars
    ? p.execute
      ? specialChars.on
      : specialChars.off
    : p.execute
      ? 'x'
      : '-';
  return `${read}${write}${execute}`;
}

/** rwx形式（所有者・グループ・その他の9文字）を返す。setuid/setgid/stickyはs/S・tの慣例表記になる */
export function permissionsToSymbolic(permissions: ChmodPermissions): string {
  const owner = permissionSetToSymbolic(
    permissions.owner,
    permissions.setuid ? { on: 's', off: 'S' } : null,
  );
  const group = permissionSetToSymbolic(
    permissions.group,
    permissions.setgid ? { on: 's', off: 'S' } : null,
  );
  const other = permissionSetToSymbolic(
    permissions.other,
    permissions.sticky ? { on: 't', off: 'T' } : null,
  );
  return `${owner}${group}${other}`;
}

/**
 * "rwxr-xr-x" のような9文字のシンボル表記をパースする。
 * "-rwxr-xr-x" のように先頭にファイル種別文字が付く10文字の形式（ls -lの出力）も許容する。
 * 不正な形式はnull。
 */
export function symbolicToPermissions(input: string): ChmodPermissions | null {
  let trimmed = input.trim();
  if (trimmed.length === 10) trimmed = trimmed.slice(1);
  if (trimmed.length !== 9) return null;

  const [or, ow, ox, gr, gw, gx, othR, othW, othX] = trimmed.split('');

  if (or !== 'r' && or !== '-') return null;
  if (ow !== 'w' && ow !== '-') return null;
  if (!'xsS-'.includes(ox)) return null;
  if (gr !== 'r' && gr !== '-') return null;
  if (gw !== 'w' && gw !== '-') return null;
  if (!'xsS-'.includes(gx)) return null;
  if (othR !== 'r' && othR !== '-') return null;
  if (othW !== 'w' && othW !== '-') return null;
  if (!'xtT-'.includes(othX)) return null;

  return {
    owner: {
      read: or === 'r',
      write: ow === 'w',
      execute: ox === 'x' || ox === 's',
    },
    group: {
      read: gr === 'r',
      write: gw === 'w',
      execute: gx === 'x' || gx === 's',
    },
    other: {
      read: othR === 'r',
      write: othW === 'w',
      execute: othX === 'x' || othX === 't',
    },
    setuid: ox === 's' || ox === 'S',
    setgid: gx === 's' || gx === 'S',
    sticky: othX === 't' || othX === 'T',
  };
}

export function permissionsToChmodCommand(
  permissions: ChmodPermissions,
  target: string,
): string {
  return `chmod ${permissionsToOctal(permissions)} ${target}`;
}
