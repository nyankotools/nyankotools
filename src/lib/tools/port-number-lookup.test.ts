import { describe, it, expect } from 'vitest';
import {
  PORTS,
  PORT_CATEGORIES,
  matchesPort,
  normalizeQuery,
  parseRange,
} from './port-number-lookup';

const ssh = { port: 22, protocols: ['tcp'], category: 'remote' } as const;
const dns = {
  port: 53,
  protocols: ['tcp', 'udp'],
  category: 'network',
} as const;
const dev = { port: 8080, protocols: ['tcp'], category: 'web' } as const;

describe('PORTS', () => {
  it('ポート番号が昇順で重複せず、1〜65535 の範囲にある', () => {
    const ports = PORTS.map((p) => p.port);
    expect(new Set(ports).size).toBe(ports.length);
    expect([...ports].sort((a, b) => a - b)).toEqual(ports);
    expect(ports.every((p) => p >= 1 && p <= 65535)).toBe(true);
  });

  it('idが一意で、分類が定義済みで、プロトコルが空でない', () => {
    const ids = PORTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PORTS) {
      expect(PORT_CATEGORIES).toContain(p.category);
      expect(p.protocols.length).toBeGreaterThan(0);
    }
  });

  it('主要なポートを含む', () => {
    const ports: number[] = PORTS.map((p) => p.port);
    for (const n of [22, 25, 53, 80, 443, 3306, 5432, 6379, 27017]) {
      expect(ports).toContain(n);
    }
  });

  it('件数が想定範囲に収まる', () => {
    expect(PORTS.length).toBeGreaterThanOrEqual(80);
    expect(PORTS.length).toBeLessThanOrEqual(120);
  });
});

describe('normalizeQuery', () => {
  it('全角・大文字・空白を揃える', () => {
    expect(normalizeQuery('  ８０ SSH ')).toBe('80 ssh');
  });

  it('範囲記号まわりの空白と記号の種類を揃える', () => {
    expect(normalizeQuery('8000 - 8100')).toBe('8000-8100');
    expect(normalizeQuery('８０００〜８１００')).toBe('8000-8100');
    expect(normalizeQuery('8000～8100')).toBe('8000-8100');
  });
});

describe('parseRange', () => {
  it('範囲を解析し、逆順は入れ替える', () => {
    expect(parseRange('8000-8100')).toEqual([8000, 8100]);
    expect(parseRange('8100-8000')).toEqual([8000, 8100]);
    expect(parseRange('80-80')).toEqual([80, 80]);
  });

  it('範囲でない文字列は null', () => {
    expect(parseRange('80')).toBeNull();
    expect(parseRange('80-')).toBeNull();
    expect(parseRange('a-b')).toBeNull();
    expect(parseRange('1-2-3')).toBeNull();
  });
});

describe('matchesPort', () => {
  it('空クエリは全件一致', () => {
    expect(matchesPort(ssh, 'SSH', '')).toBe(true);
    expect(matchesPort(ssh, 'SSH', '   ')).toBe(true);
  });

  it('数字はポート番号の完全一致（前方一致しない）', () => {
    expect(matchesPort(ssh, '', '22')).toBe(true);
    expect(matchesPort(ssh, '', '2')).toBe(false);
    expect(matchesPort(ssh, '', '222')).toBe(false);
    expect(matchesPort(ssh, '', '２２')).toBe(true);
  });

  it('範囲指定は両端を含む', () => {
    expect(matchesPort(dev, '', '8000-8100')).toBe(true);
    expect(matchesPort(dev, '', '8080-8080')).toBe(true);
    expect(matchesPort(dev, '', '8081-9000')).toBe(false);
    expect(matchesPort(dev, '', '8100 - 8000')).toBe(true);
  });

  it('サービス名・説明を大文字小文字無視の部分一致で検索する', () => {
    expect(matchesPort(ssh, 'SSH / SFTP リモート接続', 'sftp')).toBe(true);
    expect(matchesPort(ssh, 'SSH / SFTP リモート接続', 'リモート')).toBe(true);
    expect(matchesPort(ssh, 'SSH', 'mysql')).toBe(false);
  });

  it('複数語はAND条件（番号と名称の組み合わせ）', () => {
    expect(matchesPort(ssh, 'SSH', '22 ssh')).toBe(true);
    expect(matchesPort(ssh, 'SSH', '23 ssh')).toBe(false);
    expect(matchesPort(ssh, 'SSH', '20-30 ssh')).toBe(true);
  });

  it('プロトコルフィルタ', () => {
    expect(matchesPort(dns, '', '', 'all', 'udp')).toBe(true);
    expect(matchesPort(dns, '', '', 'all', 'tcp')).toBe(true);
    expect(matchesPort(ssh, '', '', 'all', 'udp')).toBe(false);
  });

  it('分類フィルタと検索語を組み合わせる', () => {
    expect(matchesPort(ssh, 'SSH', 'ssh', 'remote')).toBe(true);
    expect(matchesPort(ssh, 'SSH', 'ssh', 'database')).toBe(false);
    expect(matchesPort(ssh, 'SSH', '', 'mail')).toBe(false);
  });
});

describe('matchesPort（境界・特殊入力）', () => {
  it('正規表現の記号を含む検索語でも例外にならず文字として扱う', () => {
    expect(matchesPort(ssh, 'SSH', '(')).toBe(false);
    expect(() => matchesPort(ssh, 'SSH', '.*+?[')).not.toThrow();
  });

  it('桁あふれする巨大な数字でも例外にならず不一致', () => {
    expect(matchesPort(ssh, '', '9'.repeat(400))).toBe(false);
    expect(matchesPort(ssh, '', `1-${'9'.repeat(400)}`)).toBe(false);
  });

  it('長大な検索語・絵文字は不一致になる', () => {
    expect(matchesPort(ssh, 'SSH', 'a'.repeat(10_000))).toBe(false);
    expect(matchesPort(ssh, 'SSH', '🙂')).toBe(false);
  });

  it('ポート 0 や 65536 は一覧に存在しないので何も一致しない', () => {
    const ports: number[] = PORTS.map((p) => p.port);
    expect(ports).not.toContain(0);
    expect(PORTS.some((p) => matchesPort(p, p.name, '65536'))).toBe(false);
  });
});
