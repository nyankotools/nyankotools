import { describe, expect, it } from 'vitest';
import {
  compareVersions,
  diffVersions,
  evaluateVersionList,
  formatRange,
  formatVersion,
  parseRange,
  parseVersion,
  satisfies,
} from './semver-calculator';

function sat(version: string, range: string, includePrerelease = false) {
  const v = parseVersion(version);
  const r = parseRange(range);
  if (!v || !r) throw new Error(`invalid: ${version} / ${range}`);
  return satisfies(v, r, { includePrerelease });
}

function norm(range: string) {
  const r = parseRange(range);
  return r ? formatRange(r) : null;
}

function cmpStr(a: string, b: string) {
  return compareVersions(parseVersion(a)!, parseVersion(b)!);
}

describe('parseVersion', () => {
  it('基本・prerelease・build を解析する', () => {
    const v = parseVersion('1.2.3-beta.1+build.5');
    expect(v).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: ['beta', 1],
      build: ['build', '5'],
    });
    expect(formatVersion(v!)).toBe('1.2.3-beta.1+build.5');
  });

  it('先頭の v / = と前後の空白を許容する', () => {
    expect(formatVersion(parseVersion('  v1.2.3 ')!)).toBe('1.2.3');
    expect(formatVersion(parseVersion('=1.2.3')!)).toBe('1.2.3');
  });

  it('不正な形式は null', () => {
    for (const s of [
      '',
      '1',
      '1.2',
      '1.2.3.4',
      '01.2.3',
      '1.2.03',
      '1.2.3-',
      '1.2.3-01',
      '1.2.3-a..b',
      'a.b.c',
      '1.2.x',
      '99999999999999999999.0.0',
    ]) {
      expect(parseVersion(s), s).toBeNull();
    }
  });

  it('ハイフンや英数字混在の prerelease 識別子を許容する', () => {
    expect(parseVersion('1.0.0-alpha-1')).not.toBeNull();
    expect(parseVersion('1.0.0-0a')).not.toBeNull();
    expect(parseVersion('1.0.0-x.7.z.92')).not.toBeNull();
  });
});

describe('compareVersions', () => {
  it('semver.org の優先順位例の通りに並ぶ', () => {
    const order = [
      '1.0.0-alpha',
      '1.0.0-alpha.1',
      '1.0.0-alpha.beta',
      '1.0.0-beta',
      '1.0.0-beta.2',
      '1.0.0-beta.11',
      '1.0.0-rc.1',
      '1.0.0',
    ];
    for (let i = 0; i < order.length - 1; i++) {
      expect(cmpStr(order[i], order[i + 1]), order[i]).toBe(-1);
      expect(cmpStr(order[i + 1], order[i])).toBe(1);
    }
  });

  it('数値は桁ではなく数値として比較する', () => {
    expect(cmpStr('1.10.0', '1.9.0')).toBe(1);
    expect(cmpStr('2.0.0', '10.0.0')).toBe(-1);
  });

  it('build メタデータは無視する', () => {
    expect(cmpStr('1.0.0+a', '1.0.0+b')).toBe(0);
  });
});

describe('diffVersions', () => {
  it('最も上位の差異を返す', () => {
    const d = (a: string, b: string) =>
      diffVersions(parseVersion(a)!, parseVersion(b)!);
    expect(d('1.0.0', '2.0.0')).toBe('major');
    expect(d('1.1.0', '1.2.0')).toBe('minor');
    expect(d('1.1.1', '1.1.2')).toBe('patch');
    expect(d('1.1.1-a', '1.1.1')).toBe('prerelease');
    expect(d('1.1.1+a', '1.1.1+b')).toBe('same');
  });
});

describe('範囲式の正規化', () => {
  it.each([
    ['^1.2.3', '>=1.2.3 <2.0.0-0'],
    ['^0.2.3', '>=0.2.3 <0.3.0-0'],
    ['^0.0.3', '>=0.0.3 <0.0.4-0'],
    ['^0.0', '>=0.0.0 <0.1.0-0'],
    ['^0.x', '>=0.0.0 <1.0.0-0'],
    ['^1.2.x', '>=1.2.0 <2.0.0-0'],
    ['^1.2.3-beta.2', '>=1.2.3-beta.2 <2.0.0-0'],
    ['~1.2.3', '>=1.2.3 <1.3.0-0'],
    ['~1.2', '>=1.2.0 <1.3.0-0'],
    ['~1', '>=1.0.0 <2.0.0-0'],
    ['~>1.2.3', '>=1.2.3 <1.3.0-0'],
    ['1.x', '>=1.0.0 <2.0.0-0'],
    ['1.2.x', '>=1.2.0 <1.3.0-0'],
    ['1.2.*', '>=1.2.0 <1.3.0-0'],
    ['*', '*'],
    ['', '*'],
    ['x', '*'],
    ['1.2.3', '1.2.3'],
    ['=1.2.3', '1.2.3'],
    ['>1.2', '>=1.3.0'],
    ['>1', '>=2.0.0'],
    ['<=1.2', '<1.3.0-0'],
    ['<1.2', '<1.2.0-0'],
    ['>=1.2', '>=1.2.0'],
    ['>= 1.2.3   < 2.0.0', '>=1.2.3 <2.0.0'],
    ['1.2.3 - 2.3.4', '>=1.2.3 <=2.3.4'],
    ['1.2.3 - 2.3', '>=1.2.3 <2.4.0-0'],
    ['1.2 - 2.3.4', '>=1.2.0 <=2.3.4'],
    ['1 - 2', '>=1.0.0 <3.0.0-0'],
    ['^1.2.3 || ~2.0.0', '>=1.2.3 <2.0.0-0 || >=2.0.0 <2.1.0-0'],
  ])('%s → %s', (input, expected) => {
    expect(norm(input)).toBe(expected);
  });

  it('不正な式は null', () => {
    for (const s of [
      'abc',
      '^',
      '>=',
      '1.2.3 -',
      '1.2.3.4',
      '~a.b',
      '>>1.0.0',
    ]) {
      expect(parseRange(s), s).toBeNull();
    }
  });
});

describe('satisfies', () => {
  it('caret', () => {
    expect(sat('1.2.3', '^1.2.3')).toBe(true);
    expect(sat('1.9.9', '^1.2.3')).toBe(true);
    expect(sat('2.0.0', '^1.2.3')).toBe(false);
    expect(sat('1.2.2', '^1.2.3')).toBe(false);
    expect(sat('0.2.9', '^0.2.3')).toBe(true);
    expect(sat('0.3.0', '^0.2.3')).toBe(false);
    expect(sat('0.0.3', '^0.0.3')).toBe(true);
    expect(sat('0.0.4', '^0.0.3')).toBe(false);
  });

  it('tilde', () => {
    expect(sat('1.2.9', '~1.2.3')).toBe(true);
    expect(sat('1.3.0', '~1.2.3')).toBe(false);
    expect(sat('1.9.0', '~1')).toBe(true);
    expect(sat('2.0.0', '~1')).toBe(false);
  });

  it('比較演算子と AND', () => {
    expect(sat('1.5.0', '>=1.2.3 <2.0.0')).toBe(true);
    expect(sat('2.0.0', '>=1.2.3 <2.0.0')).toBe(false);
    expect(sat('1.2.3', '>1.2.3')).toBe(false);
    expect(sat('1.2.4', '>1.2.3')).toBe(true);
    expect(sat('1.2.3', '<=1.2.3')).toBe(true);
  });

  it('x ワイルドカード', () => {
    expect(sat('1.2.7', '1.2.x')).toBe(true);
    expect(sat('1.3.0', '1.2.x')).toBe(false);
    expect(sat('7.0.0', '*')).toBe(true);
    expect(sat('3.4.5', '')).toBe(true);
    expect(sat('1.2.4', '>1.2')).toBe(false);
    expect(sat('1.3.0', '>1.2')).toBe(true);
  });

  it('ハイフン範囲', () => {
    expect(sat('2.3.4', '1.2.3 - 2.3.4')).toBe(true);
    expect(sat('2.3.5', '1.2.3 - 2.3.4')).toBe(false);
    expect(sat('2.3.9', '1.2.3 - 2.3')).toBe(true);
    expect(sat('2.4.0', '1.2.3 - 2.3')).toBe(false);
    expect(sat('1.2.2', '1.2.3 - 2.3.4')).toBe(false);
  });

  it('|| は OR', () => {
    expect(sat('1.5.0', '^1.0.0 || ^3.0.0')).toBe(true);
    expect(sat('2.5.0', '^1.0.0 || ^3.0.0')).toBe(false);
    expect(sat('3.1.0', '^1.0.0 || ^3.0.0')).toBe(true);
  });

  it('v 付きバージョン', () => {
    expect(sat('v1.2.3', '^v1.2.0')).toBe(true);
  });

  describe('prerelease', () => {
    it('既定では範囲に同じ major.minor.patch の prerelease 比較子が無ければ除外', () => {
      expect(sat('1.3.0-beta.1', '^1.2.3')).toBe(false);
      expect(sat('2.0.0-beta.1', '^1.2.3')).toBe(false);
      expect(sat('1.2.4-beta.1', '>=1.2.3')).toBe(false);
      expect(sat('1.0.0-beta', '*')).toBe(false);
    });

    it('同じ major.minor.patch の prerelease 比較子があれば許可', () => {
      expect(sat('1.2.3-beta.4', '^1.2.3-beta.2')).toBe(true);
      expect(sat('1.2.3-beta.1', '^1.2.3-beta.2')).toBe(false);
      expect(sat('1.2.3', '^1.2.3-beta.2')).toBe(true);
      // 別の major.minor.patch の prerelease は対象外
      expect(sat('1.2.4-beta.2', '^1.2.3-beta.2')).toBe(false);
    });

    it('上限の <X-0 により次のメジャーの prerelease は含まれない', () => {
      expect(sat('2.0.0-0', '^1.2.3', true)).toBe(false);
      expect(sat('2.0.0-alpha', '^1.2.3', true)).toBe(false);
    });

    it('includePrerelease で prerelease も判定対象にする', () => {
      expect(sat('1.3.0-beta.1', '^1.2.3', true)).toBe(true);
      expect(sat('1.0.0-beta', '*', true)).toBe(true);
      expect(sat('1.2.3-beta', '^1.2.3', true)).toBe(false);
    });

    it('別の AND セットの比較子は prerelease 許可に使われない', () => {
      expect(sat('1.2.3-beta', '^1.2.3-alpha || ^2.0.0')).toBe(true);
      expect(sat('2.0.0-beta', '^1.2.3-alpha || ^2.0.0')).toBe(false);
    });
  });
});

describe('evaluateVersionList', () => {
  const text = [
    '1.2.3',
    'v2.0.0',
    'bad',
    '',
    '1.10.0',
    '1.9.0-rc.1',
    '0.9.0',
  ].join('\n');

  it('範囲判定と最大・最小を返す', () => {
    const r = evaluateVersionList(text, '^1.0.0');
    expect(r.rangeInvalid).toBe(false);
    expect(r.rangeNormalized).toBe('>=1.0.0 <2.0.0-0');
    expect(r.rows.map((x) => x.input)).toEqual([
      '1.2.3',
      'v2.0.0',
      'bad',
      '1.10.0',
      '1.9.0-rc.1',
      '0.9.0',
    ]);
    expect(r.rows.map((x) => x.matches)).toEqual([
      true,
      false,
      null,
      true,
      false,
      false,
    ]);
    expect(r.highestMatch).toBe('1.10.0');
    expect(r.lowestMatch).toBe('1.2.3');
  });

  it('昇順・降順ソートで不正な行は末尾', () => {
    const asc = evaluateVersionList(text, '*', { sort: 'asc' });
    expect(asc.rows.map((x) => x.input)).toEqual([
      '0.9.0',
      '1.2.3',
      '1.9.0-rc.1',
      '1.10.0',
      'v2.0.0',
      'bad',
    ]);
    const desc = evaluateVersionList(text, '*', { sort: 'desc' });
    expect(desc.rows.map((x) => x.input)).toEqual([
      'v2.0.0',
      '1.10.0',
      '1.9.0-rc.1',
      '1.2.3',
      '0.9.0',
      'bad',
    ]);
  });

  it('範囲式が不正なら matches は全て null', () => {
    const r = evaluateVersionList('1.0.0', '^^');
    expect(r.rangeInvalid).toBe(true);
    expect(r.rows[0].matches).toBeNull();
    expect(r.highestMatch).toBeNull();
  });

  it('一致が無ければ最大・最小は null、空入力は空配列', () => {
    expect(evaluateVersionList('1.0.0', '>=2').highestMatch).toBeNull();
    expect(evaluateVersionList('', '*').rows).toEqual([]);
  });

  it('includePrerelease を反映する', () => {
    const r = evaluateVersionList('1.5.0-rc.1', '^1.0.0', {
      includePrerelease: true,
    });
    expect(r.rows[0].matches).toBe(true);
  });

  it('CRLF の改行を区切りとして扱う', () => {
    const r = evaluateVersionList('1.0.0\r\n2.0.0\r\n', '^1');
    expect(r.rows.map((x) => x.input)).toEqual(['1.0.0', '2.0.0']);
    expect(r.highestMatch).toBe('1.0.0');
  });

  it('大量行でも一致の最大・最小と件数が正しい', () => {
    const lines = Array.from({ length: 5000 }, (_, i) => `1.${i}.0`);
    const r = evaluateVersionList(lines.join('\n'), '^1.0.0', { sort: 'desc' });
    expect(r.rows).toHaveLength(5000);
    expect(r.rows[0].input).toBe('1.4999.0');
    expect(r.highestMatch).toBe('1.4999.0');
    expect(r.lowestMatch).toBe('1.0.0');
  });
});

describe('エッジケース（追加）', () => {
  it('build 付き prerelease を解析する', () => {
    const v = parseVersion('1.0.0-alpha+001');
    expect(v).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: ['alpha'],
      build: ['001'],
    });
  });

  it('数値のみの prerelease 識別子（先頭0は禁止の例外 "0" は可）', () => {
    expect(parseVersion('1.0.0-0.3.7')?.prerelease).toEqual([0, 3, 7]);
    expect(parseVersion('1.0.0-01')).toBeNull();
  });

  it('prerelease の数値識別子が安全整数を超えると null', () => {
    expect(parseVersion('1.0.0-9007199254740992')).toBeNull();
    expect(parseVersion('1.0.0-9007199254740991')).not.toBeNull();
  });

  it('build のみで末尾が + の不正形式は null、全角数字も null', () => {
    expect(parseVersion('1.0.0-alpha+')).toBeNull();
    expect(parseVersion('１.２.３')).toBeNull();
    expect(parseVersion('1.0.0\u0000')).toBeNull();
  });

  it('数値 prerelease 識別子は英数字より小さい', () => {
    expect(cmpStr('1.0.0-1', '1.0.0-a')).toBe(-1);
    expect(cmpStr('1.0.0-a', '1.0.0-1')).toBe(1);
  });

  it('prerelease の識別子数が多い方が大きい（共通部分が同じ場合）', () => {
    expect(cmpStr('1.0.0-alpha', '1.0.0-alpha.0')).toBe(-1);
  });

  it('プレリリース比較は build を無視して同順位', () => {
    expect(cmpStr('1.0.0-rc.1+x', '1.0.0-rc.1+y')).toBe(0);
  });

  it('キャレットの下限が prerelease なら、より小さい prerelease は含めない（includePrerelease でも）', () => {
    expect(sat('1.2.3-alpha', '^1.2.3-beta', true)).toBe(false);
    expect(sat('1.2.3-beta', '^1.2.3-beta', true)).toBe(true);
  });

  it('チルダの prerelease 下限も同じ major.minor.patch の比較子として許可', () => {
    expect(sat('1.2.3-beta.1', '~1.2.3-beta.0')).toBe(true);
  });

  it('空の OR 条件は任意のバージョンに一致（npm と同じ）', () => {
    expect(norm('1.0.0 ||')).toBe('1.0.0 || *');
    expect(sat('9.9.9', '1.0.0 ||')).toBe(true);
  });

  it('範囲式の極端に長い入力でも例外を投げない', () => {
    expect(() => parseRange('1.0.0 || '.repeat(2000))).not.toThrow();
    expect(parseRange('>'.repeat(10000))).toBeNull();
  });

  it('長すぎるバージョン文字列は null', () => {
    expect(parseVersion('1.'.repeat(5000))).toBeNull();
    expect(parseVersion('1.0.0-' + 'a'.repeat(10000))).not.toBeNull();
  });
});
