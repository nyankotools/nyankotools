import { describe, it, expect } from 'vitest';
import {
  findRow,
  getColumns,
  getRows,
  getValues,
  sizeCategories,
} from './size-converter';

describe('size-converter', () => {
  it('全カテゴリで全行が全列の値を持つ（リングのUKは—可）', () => {
    for (const c of sizeCategories) {
      for (const row of getRows(c)) {
        for (const col of getColumns(c)) {
          expect(row[col]).toBeTruthy();
        }
      }
    }
  });

  it('女性服: 9号 = M = US 4 = UK 8 = EU 36', () => {
    expect(findRow('womens-clothing', 'jp', '9')).toMatchObject({
      alpha: 'M',
      us: '4',
      uk: '8',
      eu: '36',
    });
  });

  it('男性服: US/UK 38 = L = EU 48', () => {
    expect(findRow('mens-clothing', 'us', '38')).toMatchObject({
      alpha: 'L',
      eu: '48',
    });
  });

  it('女性靴: 24.0cm = US 7 = UK 5', () => {
    expect(findRow('womens-shoes', 'cm', '24.0')).toMatchObject({
      us: '7',
      uk: '5',
    });
  });

  it('男性靴: 26.0cm = US 8 = UK 7 = EU 41.5', () => {
    expect(findRow('mens-shoes', 'cm', '26.0')).toMatchObject({
      us: '8',
      uk: '7',
      eu: '41.5',
    });
  });

  it('指輪: 10号は外周約50mm・US 5.5・EU 50', () => {
    expect(findRow('ring', 'jp', '10')).toMatchObject({
      circumference: '50.0',
      us: '5.5',
      eu: '50',
    });
  });

  it('指輪: 日本9号 = US 5 = UK J', () => {
    expect(findRow('ring', 'jp', '9')).toMatchObject({ us: '5', uk: 'J' });
  });

  it('getValues は重複と「—」を除く', () => {
    const uk = getValues('ring', 'uk');
    expect(uk).not.toContain('—');
    expect(new Set(uk).size).toBe(uk.length);
  });

  it('存在しない値は null', () => {
    expect(findRow('ring', 'jp', '99')).toBeNull();
  });

  it('空文字・そのカテゴリに無い列での検索は null', () => {
    expect(findRow('ring', 'jp', '')).toBeNull();
    expect(findRow('ring', 'bust', '77')).toBeNull();
    expect(findRow('womens-shoes', 'jp', '9')).toBeNull();
  });

  it('全カテゴリの行数・列数（境界を含む）', () => {
    expect(getRows('womens-clothing')).toHaveLength(8);
    expect(getRows('mens-clothing')).toHaveLength(7);
    // 21.0〜26.0cm を0.5cm刻み = 11行
    expect(getRows('womens-shoes')).toHaveLength(11);
    // 24.0〜30.0cm を0.5cm刻み = 13行
    expect(getRows('mens-shoes')).toHaveLength(13);
    expect(getRows('ring')).toHaveLength(30);
    expect(getColumns('womens-clothing')).toHaveLength(6);
    expect(getColumns('mens-clothing')).toHaveLength(5);
    expect(getColumns('womens-shoes')).toHaveLength(4);
    expect(getColumns('mens-shoes')).toHaveLength(4);
    expect(getColumns('ring')).toHaveLength(6);
  });

  it('靴の足長範囲の両端', () => {
    expect(getValues('womens-shoes', 'cm')[0]).toBe('21.0');
    expect(getValues('womens-shoes', 'cm').at(-1)).toBe('26.0');
    expect(getValues('mens-shoes', 'cm')[0]).toBe('24.0');
    expect(getValues('mens-shoes', 'cm').at(-1)).toBe('30.0');
  });

  it('女性服: XS = 5号・バスト77cm、5L = 19号', () => {
    expect(findRow('womens-clothing', 'alpha', 'XS')).toMatchObject({
      jp: '5',
      bust: '77',
    });
    expect(findRow('womens-clothing', 'alpha', '5L')).toMatchObject({
      jp: '19',
    });
  });

  it('男性服: S = チェスト86cm（34inch）・EU 44', () => {
    expect(findRow('mens-clothing', 'alpha', 'S')).toMatchObject({
      chest: '86',
      us: '34',
      eu: '44',
    });
  });

  it('女性服・男性服の数値列は表の順に単調増加', () => {
    const jpList = getValues('womens-clothing', 'jp').map(Number);
    expect(jpList).toEqual([...jpList].sort((a, b) => a - b));
    const usMen = getValues('mens-clothing', 'us').map(Number);
    expect(usMen).toEqual([...usMen].sort((a, b) => a - b));
  });

  it('指輪: 1号の内周は41.0mm（JIS: 号数+40mm）', () => {
    expect(findRow('ring', 'jp', '1')).toMatchObject({
      circumference: '41.0',
      eu: '41',
    });
  });

  it('指輪: 号数ごとに内周・内径・US・EUが単調増加（UKは全号で文字あり）', () => {
    const rows = getRows('ring');
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1];
      const cur = rows[i];
      expect(Number(cur.circumference)).toBeGreaterThan(
        Number(prev.circumference),
      );
      expect(Number(cur.diameter)).toBeGreaterThan(Number(prev.diameter));
      expect(Number(cur.us)).toBeGreaterThanOrEqual(Number(prev.us));
      expect(Number(cur.eu)).toBeGreaterThan(Number(prev.eu));
    }
    for (const row of rows) {
      expect(row.uk).not.toBe('—');
    }
  });

  it('指輪: 内周は号数+40mm、内径は内周÷πと一致', () => {
    for (const row of getRows('ring')) {
      const jp = Number(row.jp);
      expect(Number(row.circumference)).toBeCloseTo(40 + jp, 1);
      expect(Number(row.diameter)).toBeCloseTo((40 + jp) / Math.PI, 1);
    }
  });
});
