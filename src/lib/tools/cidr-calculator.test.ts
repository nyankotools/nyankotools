import { describe, expect, it } from 'vitest';
import {
  calculateCidr,
  formatIPv4,
  maskIntToPrefix,
  parseCidrNotation,
  parseIPv4,
  prefixToMaskInt,
} from './cidr-calculator';

describe('parseIPv4', () => {
  it('正常なIPv4文字列を整数に変換する', () => {
    expect(parseIPv4('192.168.1.1')).toBe(3232235777);
    expect(parseIPv4('0.0.0.0')).toBe(0);
    expect(parseIPv4('255.255.255.255')).toBe(4294967295);
  });

  it('前後の空白は無視する', () => {
    expect(parseIPv4('  192.168.1.1  ')).toBe(3232235777);
  });

  it('不正な形式はnull', () => {
    expect(parseIPv4('')).toBeNull();
    expect(parseIPv4('192.168.1')).toBeNull(); // 桁数不足
    expect(parseIPv4('192.168.1.1.1')).toBeNull(); // 桁数超過
    expect(parseIPv4('256.0.0.1')).toBeNull(); // 範囲外
    expect(parseIPv4('192.168.01.1')).toBeNull(); // 先頭ゼロ
    expect(parseIPv4('192.168.-1.1')).toBeNull(); // 負数
    expect(parseIPv4('192.168.a.1')).toBeNull(); // 数字以外
    expect(parseIPv4('１９２.168.1.1')).toBeNull(); // 全角数字
  });
});

describe('formatIPv4', () => {
  it('整数をドット区切り表記に変換する', () => {
    expect(formatIPv4(3232235777)).toBe('192.168.1.1');
    expect(formatIPv4(0)).toBe('0.0.0.0');
    expect(formatIPv4(4294967295)).toBe('255.255.255.255');
  });
});

describe('prefixToMaskInt / maskIntToPrefix', () => {
  it('プレフィックス長をサブネットマスクの整数に変換する', () => {
    expect(formatIPv4(prefixToMaskInt(24))).toBe('255.255.255.0');
    expect(formatIPv4(prefixToMaskInt(0))).toBe('0.0.0.0');
    expect(formatIPv4(prefixToMaskInt(32))).toBe('255.255.255.255');
    expect(formatIPv4(prefixToMaskInt(30))).toBe('255.255.255.252');
  });

  it('サブネットマスクの整数をプレフィックス長に変換する', () => {
    expect(maskIntToPrefix(parseIPv4('255.255.255.0')!)).toBe(24);
    expect(maskIntToPrefix(parseIPv4('0.0.0.0')!)).toBe(0);
    expect(maskIntToPrefix(parseIPv4('255.255.255.255')!)).toBe(32);
  });

  it('連続した1のビット列でないマスクはnull', () => {
    expect(maskIntToPrefix(parseIPv4('255.0.255.0')!)).toBeNull();
    expect(maskIntToPrefix(parseIPv4('0.255.255.255')!)).toBeNull();
  });
});

describe('parseCidrNotation', () => {
  it('プレフィックス長指定の形式をパースする', () => {
    expect(parseCidrNotation('192.168.1.10/24')).toEqual({
      ipInt: parseIPv4('192.168.1.10'),
      prefix: 24,
    });
  });

  it('サブネットマスク指定の形式をパースする', () => {
    expect(parseCidrNotation('192.168.1.10/255.255.255.0')).toEqual({
      ipInt: parseIPv4('192.168.1.10'),
      prefix: 24,
    });
  });

  it('前後の空白は無視する', () => {
    expect(parseCidrNotation('  192.168.1.10/24  ')).toEqual({
      ipInt: parseIPv4('192.168.1.10'),
      prefix: 24,
    });
  });

  it('不正な形式はnull', () => {
    expect(parseCidrNotation('')).toBeNull();
    expect(parseCidrNotation('192.168.1.10')).toBeNull(); // スラッシュなし
    expect(parseCidrNotation('192.168.1.10/33')).toBeNull(); // 範囲外プレフィックス
    expect(parseCidrNotation('192.168.1.10/-1')).toBeNull();
    expect(parseCidrNotation('192.168.1.10/255.0.255.0')).toBeNull(); // 不正なマスク
    expect(parseCidrNotation('999.168.1.10/24')).toBeNull(); // 不正なIP
    expect(parseCidrNotation('192.168.1.10/abc')).toBeNull();
  });

  it('IPv6アドレスは非対応としてnullを返す', () => {
    expect(parseCidrNotation('::1/64')).toBeNull();
    expect(parseCidrNotation('2001:db8::/32')).toBeNull();
  });

  it('全角数字のプレフィックスはnullを返す', () => {
    expect(parseCidrNotation('192.168.1.10/２４')).toBeNull();
  });

  it('スラッシュの前後に空白があっても許容する', () => {
    expect(parseCidrNotation('192.168.1.10 / 24')).toEqual({
      ipInt: parseIPv4('192.168.1.10'),
      prefix: 24,
    });
  });

  it('スラッシュが複数ある場合はnullを返す', () => {
    expect(parseCidrNotation('192.168.1.10/24/8')).toBeNull();
  });

  it('絵文字など数値以外の入力でも例外を投げずnullを返す', () => {
    expect(() => parseCidrNotation('🐱/24')).not.toThrow();
    expect(parseCidrNotation('🐱/24')).toBeNull();
  });
});

describe('calculateCidr', () => {
  it('一般的な/24を計算する', () => {
    expect(calculateCidr('192.168.1.10/24')).toEqual({
      ipAddress: '192.168.1.10',
      prefixLength: 24,
      subnetMask: '255.255.255.0',
      wildcardMask: '0.0.0.255',
      networkAddress: '192.168.1.0',
      broadcastAddress: '192.168.1.255',
      firstUsableHost: '192.168.1.1',
      lastUsableHost: '192.168.1.254',
      usableHostCount: 254,
      totalAddressCount: 256,
    });
  });

  it('サブネットマスク指定でも同じ結果になる', () => {
    expect(calculateCidr('192.168.1.10/255.255.255.0')).toEqual(
      calculateCidr('192.168.1.10/24'),
    );
  });

  it('/30（4アドレス・2ホスト利用可能）を計算する', () => {
    const result = calculateCidr('10.0.0.5/30')!;
    expect(result.networkAddress).toBe('10.0.0.4');
    expect(result.broadcastAddress).toBe('10.0.0.7');
    expect(result.firstUsableHost).toBe('10.0.0.5');
    expect(result.lastUsableHost).toBe('10.0.0.6');
    expect(result.usableHostCount).toBe(2);
    expect(result.totalAddressCount).toBe(4);
  });

  it('/31はRFC3021のポイントツーポイントとして2アドレスとも利用可能', () => {
    const result = calculateCidr('10.0.0.4/31')!;
    expect(result.networkAddress).toBe('10.0.0.4');
    expect(result.broadcastAddress).toBe('10.0.0.5');
    expect(result.firstUsableHost).toBe('10.0.0.4');
    expect(result.lastUsableHost).toBe('10.0.0.5');
    expect(result.usableHostCount).toBe(2);
    expect(result.totalAddressCount).toBe(2);
  });

  it('/32は単一ホストとして1アドレスのみ利用可能', () => {
    const result = calculateCidr('10.0.0.4/32')!;
    expect(result.networkAddress).toBe('10.0.0.4');
    expect(result.broadcastAddress).toBe('10.0.0.4');
    expect(result.firstUsableHost).toBe('10.0.0.4');
    expect(result.lastUsableHost).toBe('10.0.0.4');
    expect(result.usableHostCount).toBe(1);
    expect(result.totalAddressCount).toBe(1);
  });

  it('/0は全アドレス空間を表す', () => {
    const result = calculateCidr('192.168.1.10/0')!;
    expect(result.subnetMask).toBe('0.0.0.0');
    expect(result.networkAddress).toBe('0.0.0.0');
    expect(result.broadcastAddress).toBe('255.255.255.255');
    expect(result.totalAddressCount).toBe(4294967296);
  });

  it('/16のクラスB相当を計算する', () => {
    const result = calculateCidr('172.16.5.200/16')!;
    expect(result.networkAddress).toBe('172.16.0.0');
    expect(result.broadcastAddress).toBe('172.16.255.255');
    expect(result.firstUsableHost).toBe('172.16.0.1');
    expect(result.lastUsableHost).toBe('172.16.255.254');
    expect(result.usableHostCount).toBe(65534);
    expect(result.totalAddressCount).toBe(65536);
  });

  it('不正な入力はnullを返す', () => {
    expect(calculateCidr('')).toBeNull();
    expect(calculateCidr('999.999.999.999/24')).toBeNull();
    expect(calculateCidr('192.168.1.10/40')).toBeNull();
  });

  it('IPv6アドレスの入力はnullを返す', () => {
    expect(calculateCidr('2001:db8::/32')).toBeNull();
  });

  it('/1（大規模なネットワーク）を計算する', () => {
    const result = calculateCidr('128.0.0.1/1')!;
    expect(result.networkAddress).toBe('128.0.0.0');
    expect(result.broadcastAddress).toBe('255.255.255.255');
    expect(result.usableHostCount).toBe(2147483646);
    expect(result.totalAddressCount).toBe(2147483648);
  });
});
