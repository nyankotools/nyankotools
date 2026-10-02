import { describe, expect, it } from 'vitest';
import { computeSshFingerprints } from './ssh-fingerprint';

// ssh-keygen で生成した鍵と、ssh-keygen -l の出力
const RSA =
  'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3NBRJDIxkqU9ViUD7WkCHvmusJg/cK/DaEXUoV0/Z/F/S4iOXD/UM10eSbiYVy8CJ4VwvPdmVHP7oV39rkSLIibvEhGQUxZ/1RimUgZ86C23RSOxbxPtQOhi5Ldk75MlRHMPuhQ844a+bhm32DhPK3R0T5DGGP6g1iWhAJ412RB2bmAdjcKwXKzj9qR2WlkknLyP3e5Js9nILpL6Gr/YPpmf942VMbbPmiLyvQ33erPu+RhgCacTjOtK+NYCEh5vcEVC74QN5Erj2BrYKIm/SNHBctua48niyxVUn1yCfs3jIWfgvlDVSWeBzK92LcGE81bV8/x5pBtldqN/JM7CR4hK3RuQj3VHCEc6j1g4kih0UbZr8Zo/ZOq3AGUZ7ZDRwXTvF+8D+iO49PKCwX/FLCeSmxRnSkHHNw2NAM3b+GDJjnSmtn5e0DLdQej9facEXoH4IiXRPrZJU+JDiFCyn+ssiaQoOMqcyOl+YT5C0nUCXDeo4E9JYTZB8HQyERUM= test@rsa';
const ED25519 =
  'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOO5oum+3qqVZlGjw8biKqsamenET2qniWYO1tcPZIjl test@ed25519';
const ECDSA =
  'ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBC8keAqhvVTWAwONj0ZvuoqjkSbwGAVcuYQWk1qTGIy2rcj0nwVjNSBrz7i4hm3FsERA7exRPV60VVzRj1GUbrk= test@ecdsa';
const ED25519_BLOB = ED25519.split(' ')[1];
const ED25519_SHA256 = 'SHA256:TQ9cFb19k0BLT9WpzmPuuhdvjzPcqLWmRsL3wGvC6YY';

async function one(input: string) {
  const [result] = await computeSshFingerprints(input);
  if (!result.success) throw new Error(result.error);
  return result.fingerprint;
}

describe('computeSshFingerprints', () => {
  it('RSA: SHA256・MD5・鍵長が ssh-keygen -l と一致する', async () => {
    const fp = await one(RSA);
    expect(fp.sha256).toBe(
      'SHA256:QYYuMJ4rjWRsKciHB47VdCwLNw5Fxz/QmmpOlgkh6+s',
    );
    expect(fp.md5).toBe('MD5:1e:5c:98:55:94:b3:4d:27:51:48:74:d8:e8:52:bb:90');
    expect(fp.bits).toBe(3072);
    expect(fp.algorithm).toBe('RSA');
    expect(fp.comment).toBe('test@rsa');
  });

  it('ED25519', async () => {
    const fp = await one(ED25519);
    expect(fp.sha256).toBe(ED25519_SHA256);
    expect(fp.md5).toBe('MD5:3e:ab:04:dc:04:d2:e7:0f:cb:44:d7:64:de:f3:34:b8');
    expect(fp.bits).toBe(256);
    expect(fp.algorithm).toBe('ED25519');
  });

  it('ECDSA', async () => {
    const fp = await one(ECDSA);
    expect(fp.sha256).toBe(
      'SHA256:ktCDDPA22relezj/jdEaXjUUekJAH95Sw+pdeViSJ/A',
    );
    expect(fp.md5).toBe('MD5:a6:42:ed:bb:b8:32:7e:60:d7:08:03:75:80:4f:6e:12');
    expect(fp.bits).toBe(256);
    expect(fp.algorithm).toBe('ECDSA');
  });

  it('authorized_keys の先頭オプションとコメント内の空白を扱える', async () => {
    const fp = await one(
      `command="echo hi",no-pty ssh-ed25519 ${ED25519_BLOB} my laptop key`,
    );
    expect(fp.sha256).toBe(ED25519_SHA256);
    expect(fp.comment).toBe('my laptop key');
  });

  it('known_hosts形式（行頭のホスト名）も読み取れる', async () => {
    const fp = await one(`github.com,192.0.2.1 ${ED25519}`);
    expect(fp.sha256).toBe(ED25519_SHA256);
  });

  it('複数行は行ごとに結果を返し、空行とコメント行は飛ばす', async () => {
    const results = await computeSshFingerprints(
      `# keys\n\n${RSA}\ngarbage\n${ED25519}`,
    );
    expect(results.map((r) => [r.line, r.success])).toEqual([
      [3, true],
      [4, false],
      [5, true],
    ]);
  });

  it('不正なBase64・鍵種別の不一致は invalid-format', async () => {
    const [bad] = await computeSshFingerprints('ssh-rsa !!!notbase64');
    expect(bad).toEqual({ success: false, line: 1, error: 'invalid-format' });
    const [mismatch] = await computeSshFingerprints(`ssh-rsa ${ED25519_BLOB}`);
    expect(mismatch).toEqual({
      success: false,
      line: 1,
      error: 'invalid-format',
    });
  });

  it('未知の鍵種別は unsupported-type', async () => {
    const [r] = await computeSshFingerprints('ssh-foo AAAA');
    expect(r).toEqual({ success: false, line: 1, error: 'unsupported-type' });
  });

  it('空入力は結果なし', async () => {
    expect(await computeSshFingerprints('  \n')).toEqual([]);
  });
});
