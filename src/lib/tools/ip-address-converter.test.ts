import { describe, expect, it } from 'vitest';
import {
  compressIPv6,
  convertIpAddress,
  ipv4ToBinaryDotted,
  ipv4ToHex,
  parseIPv4Flexible,
  parseIPv6,
} from './ip-address-converter';

function row(input: string, key: string): string | undefined {
  return convertIpAddress(input)?.rows.find((r) => r.key === key)?.value;
}

describe('parseIPv4Flexible', () => {
  it('各表記から同じ値を読み取る', () => {
    const expected = 3232235777;
    expect(parseIPv4Flexible('192.168.1.1')).toEqual({
      value: expected,
      format: 'ipv4-dotted',
    });
    expect(parseIPv4Flexible('3232235777')?.value).toBe(expected);
    expect(parseIPv4Flexible('0xC0A80101')?.value).toBe(expected);
    expect(parseIPv4Flexible('0xc0a80101')?.format).toBe('ipv4-hex');
    expect(parseIPv4Flexible('11000000101010000000000100000001')?.value).toBe(
      expected,
    );
    expect(parseIPv4Flexible('0b11000000101010000000000100000001')?.value).toBe(
      expected,
    );
    expect(parseIPv4Flexible('11000000.10101000.00000001.00000001')).toEqual({
      value: expected,
      format: 'ipv4-binary-dotted',
    });
  });

  it('範囲外・不正な入力はnull', () => {
    expect(parseIPv4Flexible('4294967296')).toBeNull();
    expect(parseIPv4Flexible('256.0.0.1')).toBeNull();
    expect(parseIPv4Flexible('0x1FFFFFFFF')).toBeNull();
    expect(parseIPv4Flexible('abc')).toBeNull();
    expect(parseIPv4Flexible('')).toBeNull();
    expect(parseIPv4Flexible('1.2.3')).toBeNull();
  });

  it('境界値', () => {
    expect(parseIPv4Flexible('0')?.value).toBe(0);
    expect(parseIPv4Flexible('4294967295')?.value).toBe(4294967295);
    expect(parseIPv4Flexible('0xFFFFFFFF')?.value).toBe(4294967295);
  });
});

describe('IPv4 の出力', () => {
  it('ドット・10進・16進・2進・IPv4射影アドレスを返す', () => {
    expect(row('192.168.1.1', 'ipv4')).toBe('192.168.1.1');
    expect(row('192.168.1.1', 'decimal')).toBe('3232235777');
    expect(row('192.168.1.1', 'hex')).toBe('0xC0A80101');
    expect(row('192.168.1.1', 'binary')).toBe(
      '11000000.10101000.00000001.00000001',
    );
    expect(row('192.168.1.1', 'ipv4-mapped-ipv6')).toBe('::ffff:c0a8:101');
  });

  it('10進整数から変換できる', () => {
    expect(row('2130706433', 'ipv4')).toBe('127.0.0.1');
  });

  it('ヘルパー', () => {
    expect(ipv4ToHex(1)).toBe('0x00000001');
    expect(ipv4ToBinaryDotted(0)).toBe('00000000.00000000.00000000.00000000');
  });

  it('種別を判定する', () => {
    expect(convertIpAddress('10.1.2.3')?.type).toBe('private');
    expect(convertIpAddress('172.16.0.1')?.type).toBe('private');
    expect(convertIpAddress('172.32.0.1')?.type).toBe('public');
    expect(convertIpAddress('127.0.0.1')?.type).toBe('loopback');
    expect(convertIpAddress('169.254.1.1')?.type).toBe('link-local');
    expect(convertIpAddress('100.64.0.1')?.type).toBe('shared');
    expect(convertIpAddress('224.0.0.1')?.type).toBe('multicast');
    expect(convertIpAddress('0.0.0.0')?.type).toBe('unspecified');
    expect(convertIpAddress('255.255.255.255')?.type).toBe('broadcast');
    expect(convertIpAddress('8.8.8.8')?.type).toBe('public');
    expect(convertIpAddress('192.0.2.1')?.type).toBe('documentation');
  });
});

describe('parseIPv6', () => {
  it('短縮・完全表記を読み取る', () => {
    expect(parseIPv6('::1')).toEqual([0, 0, 0, 0, 0, 0, 0, 1]);
    expect(parseIPv6('::')).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    expect(parseIPv6('2001:db8::ff00:42:8329')).toEqual([
      0x2001, 0x0db8, 0, 0, 0, 0xff00, 0x42, 0x8329,
    ]);
    expect(parseIPv6('2001:0db8:0000:0000:0000:ff00:0042:8329')).toEqual(
      parseIPv6('2001:db8::ff00:42:8329'),
    );
    expect(parseIPv6('1::')).toEqual([1, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('IPv4埋め込み・括弧付きを読み取る', () => {
    expect(parseIPv6('::ffff:192.168.1.1')).toEqual([
      0, 0, 0, 0, 0, 0xffff, 0xc0a8, 0x0101,
    ]);
    expect(parseIPv6('[::1]')).toEqual([0, 0, 0, 0, 0, 0, 0, 1]);
  });

  it('不正な入力はnull', () => {
    expect(parseIPv6('1:2:3:4:5:6:7')).toBeNull();
    expect(parseIPv6('1:2:3:4:5:6:7:8:9')).toBeNull();
    expect(parseIPv6('1::2::3')).toBeNull();
    expect(parseIPv6(':::')).toBeNull();
    expect(parseIPv6('12345::1')).toBeNull();
    expect(parseIPv6('g::1')).toBeNull();
    expect(parseIPv6('fe80::1%eth0')).toBeNull();
    expect(parseIPv6('1:2:3:4:5:6:7::8')).toBeNull();
    expect(parseIPv6(':1:2:3:4:5:6:7')).toBeNull();
    expect(parseIPv6('::1.2.3')).toBeNull();
  });
});

describe('compressIPv6', () => {
  it('最長のゼロ連続を短縮する', () => {
    expect(compressIPv6([0x2001, 0xdb8, 0, 0, 0, 0xff00, 0x42, 0x8329])).toBe(
      '2001:db8::ff00:42:8329',
    );
    expect(compressIPv6([1, 0, 0, 2, 0, 0, 0, 3])).toBe('1:0:0:2::3');
  });

  it('同長なら先頭側、単独のゼロは短縮しない', () => {
    expect(compressIPv6([1, 0, 0, 2, 3, 0, 0, 4])).toBe('1::2:3:0:0:4');
    expect(compressIPv6([1, 0, 2, 3, 4, 5, 6, 7])).toBe('1:0:2:3:4:5:6:7');
    expect(compressIPv6([0, 0, 0, 0, 0, 0, 0, 0])).toBe('::');
    expect(compressIPv6([0, 0, 0, 0, 0, 0, 0, 1])).toBe('::1');
  });
});

describe('IPv6 の出力', () => {
  it('短縮・展開・完全展開・10進・16進を返す', () => {
    const input = '2001:db8::1';
    expect(row(input, 'ipv6-compressed')).toBe('2001:db8::1');
    expect(row(input, 'ipv6-expanded')).toBe('2001:db8:0:0:0:0:0:1');
    expect(row(input, 'ipv6-full')).toBe(
      '2001:0db8:0000:0000:0000:0000:0000:0001',
    );
    expect(row(input, 'hex')).toBe('0x20010db8000000000000000000000001');
    expect(row(input, 'decimal')).toBe(
      '42540766411282592856903984951653826561',
    );
  });

  it('大文字入力は小文字に正規化する', () => {
    expect(row('FE80:0:0:0:0:0:0:ABCD', 'ipv6-compressed')).toBe('fe80::abcd');
  });

  it('::1 の10進は1、:: は0', () => {
    expect(row('::1', 'decimal')).toBe('1');
    expect(row('::', 'decimal')).toBe('0');
  });

  it('IPv4射影アドレスから埋め込みIPv4を取り出す', () => {
    expect(row('::ffff:c0a8:101', 'ipv6-embedded-ipv4')).toBe('192.168.1.1');
    expect(row('2001:db8::1', 'ipv6-embedded-ipv4')).toBeUndefined();
  });

  it('種別を判定する', () => {
    expect(convertIpAddress('::1')?.type).toBe('loopback');
    expect(convertIpAddress('::')?.type).toBe('unspecified');
    expect(convertIpAddress('fe80::1')?.type).toBe('link-local');
    expect(convertIpAddress('fd00::1')?.type).toBe('unique-local');
    expect(convertIpAddress('ff02::1')?.type).toBe('multicast');
    expect(convertIpAddress('2001:db8::1')?.type).toBe('documentation');
    expect(convertIpAddress('::ffff:1.2.3.4')?.type).toBe('ipv4-mapped');
    expect(convertIpAddress('2606:4700::1111')?.type).toBe('public');
  });
});

describe('convertIpAddress', () => {
  it('空文字・不正はnull', () => {
    expect(convertIpAddress('')).toBeNull();
    expect(convertIpAddress('   ')).toBeNull();
    expect(convertIpAddress('hello')).toBeNull();
    expect(convertIpAddress('1:2')).toBeNull();
  });

  it('前後の空白を無視する', () => {
    expect(convertIpAddress('  8.8.8.8  ')?.version).toBe(4);
  });
});

describe('エッジケース（追加）', () => {
  it('IPv6 短縮: 同長のゼロ連続は先頭側を短縮し、後ろは残す', () => {
    expect(compressIPv6([0x2001, 0xdb8, 0, 0, 1, 0, 0, 1])).toBe(
      '2001:db8::1:0:0:1',
    );
  });

  it('IPv6 短縮: 全8グループ非ゼロは短縮しない', () => {
    expect(compressIPv6([1, 2, 3, 4, 5, 6, 7, 8])).toBe('1:2:3:4:5:6:7:8');
  });

  it('IPv6 短縮: 最大値 ffff:... は10進で 2^128-1', () => {
    const max = 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff';
    expect(row(max, 'ipv6-compressed')).toBe(max);
    expect(row(max, 'decimal')).toBe('340282366920938463463374607431768211455');
  });

  it('IPv6 非マップのIPv4埋め込み (64:ff9b::/96) は埋め込み行を出さない', () => {
    expect(row('64:ff9b::192.0.2.1', 'ipv6-compressed')).toBe(
      '64:ff9b::c000:201',
    );
    expect(row('64:ff9b::192.0.2.1', 'ipv6-embedded-ipv4')).toBeUndefined();
  });

  it('IPv6 埋め込みIPv4が不正なら null', () => {
    expect(convertIpAddress('::ffff:999.1.1.1')).toBeNull();
  });

  it('IPv4射影アドレスの埋め込みIPv4行は ::ffff:1.2.3.4 から取り出せる', () => {
    expect(row('::ffff:1.2.3.4', 'ipv6-embedded-ipv4')).toBe('1.2.3.4');
  });

  it('IPv6 の括弧付き入力は変換できる', () => {
    expect(row('[2001:db8::1]', 'ipv6-compressed')).toBe('2001:db8::1');
  });

  it('IPv4 の16進・2進の桁あふれは null', () => {
    expect(parseIPv4Flexible('0x100000000')).toBeNull();
    expect(parseIPv4Flexible('0x')).toBeNull();
    expect(parseIPv4Flexible('1' + '0'.repeat(32))).toBeNull();
    expect(parseIPv4Flexible('0b' + '1'.repeat(33))).toBeNull();
  });

  it('全角の数字・コロンは受け付けない', () => {
    expect(convertIpAddress('１.２.３.４')).toBeNull();
    expect(convertIpAddress('２００１：：１')).toBeNull();
  });

  it('ドットの間に空白が入ると null', () => {
    expect(convertIpAddress('1.2. 3.4')).toBeNull();
  });

  it('極端に長い入力は null（例外を投げない）', () => {
    expect(convertIpAddress('a'.repeat(100000))).toBeNull();
    expect(convertIpAddress(':'.repeat(100000))).toBeNull();
    expect(convertIpAddress('1'.repeat(100000))).toBeNull();
  });
});
