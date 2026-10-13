import { describe, it, expect } from 'vitest';
import {
  calculateGpa,
  formatGpa,
  formatNumber,
  getScale,
  parseCredits,
  SCALES,
  type CourseRow,
} from './gpa-calculator';

const row = (credits: string, grade: string, name = ''): CourseRow => ({
  name,
  credits,
  grade,
});

describe('SCALES', () => {
  it('各尺度の評価記号は尺度内で一意', () => {
    for (const s of SCALES) {
      const labels = s.grades.map((x) => x.label);
      expect(new Set(labels).size).toBe(labels.length);
    }
  });

  it('F・不可はポイント0かつ単位未取得', () => {
    for (const s of SCALES) {
      for (const x of s.grades) {
        if (!x.earned) expect(x.point).toBe(0);
      }
    }
  });

  it('未知の尺度IDは undefined', () => {
    expect(getScale('nope')).toBeUndefined();
  });
});

describe('parseCredits', () => {
  it('数値・全角・小数を読める', () => {
    expect(parseCredits('2')).toBe(2);
    expect(parseCredits(' ４ ')).toBe(4);
    expect(parseCredits('1.5')).toBe(1.5);
    expect(parseCredits('0')).toBe(0);
  });
  it('空は blank', () => {
    expect(parseCredits('')).toBe('blank');
    expect(parseCredits('   ')).toBe('blank');
  });
  it('負数・文字・範囲外は invalid', () => {
    expect(parseCredits('-1')).toBe('invalid');
    expect(parseCredits('abc')).toBe('invalid');
    expect(parseCredits('1e3')).toBe('invalid');
    expect(parseCredits('1.')).toBe('invalid');
    expect(parseCredits('1000')).toBe('invalid');
  });
});

describe('calculateGpa', () => {
  it('日本の大学4段階: 加重平均を計算する', () => {
    const r = calculateGpa(
      [row('2', 'S'), row('4', 'A'), row('2', 'B'), row('2', 'C')],
      'jp-4',
    );
    // (2*4 + 4*3 + 2*2 + 2*1) / 10 = 2.6
    expect(r.totalCredits).toBe(10);
    expect(r.earnedCredits).toBe(10);
    expect(r.gradePoints).toBe(26);
    expect(r.gpa).toBe(2.6);
    expect(r.countedCount).toBe(4);
  });

  it('不可は分母に入り、取得単位には入らない', () => {
    const r = calculateGpa([row('2', 'A'), row('2', 'D')], 'jp-4');
    expect(r.totalCredits).toBe(4);
    expect(r.earnedCredits).toBe(2);
    expect(r.gpa).toBe(1.5);
  });

  it('小数点2位に四捨五入する', () => {
    // (3*4 + 2*3) / 5 = 3.6
    expect(calculateGpa([row('3', 'A'), row('2', 'B')], 'us-4').gpa).toBe(3.6);
    // 3.7*1 + 4.0*2 = 11.7 / 3 = 3.9
    expect(calculateGpa([row('1', 'A-'), row('2', 'A')], 'us-4-plus').gpa).toBe(
      3.9,
    );
    // (4*1 + 3*1 + 2*1)/3 = 3 、 (3.3+4+4)/3 = 3.7667 → 3.77
    expect(
      calculateGpa([row('1', 'B+'), row('1', 'A'), row('1', 'A')], 'us-4-plus')
        .gpa,
    ).toBe(3.77);
  });

  it('ちょうど .005 は切り上げる（浮動小数点の誤差に左右されない）', () => {
    // A 4.0 + A- 3.7 + B+ 3.3 + B 3.0 + B- 2.7 + C 2.0 + C- 1.7 + D 1.0 = 21.4 / 8 = 2.675
    const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C', 'C-', 'D'];
    const r = calculateGpa(
      grades.map((x) => row('1', x)),
      'us-4-plus',
    );
    expect(r.gradePoints).toBe(21.4);
    expect(r.gpa).toBe(2.68);
  });

  it('4.3スケールは A+ が 4.3', () => {
    expect(calculateGpa([row('3', 'A+')], 'us-43').gpa).toBe(4.3);
    expect(calculateGpa([row('3', 'A+')], 'us-4-plus').gpa).toBe(4);
  });

  it('単位数0・空の行は除外される', () => {
    const r = calculateGpa(
      [row('0', 'A'), row('', 'B'), row('2', 'C')],
      'jp-4',
    );
    expect(r.rows.map((x) => x.status)).toEqual([
      'zero-credits',
      'zero-credits',
      'counted',
    ]);
    expect(r.totalCredits).toBe(2);
    expect(r.gpa).toBe(1);
  });

  it('評価未選択の行は GPA から除外し、単位数を別に集計する', () => {
    const r = calculateGpa(
      [row('2', 'A'), row('3', ''), row('1.5', '')],
      'jp-4',
    );
    expect(r.gpa).toBe(3);
    expect(r.totalCredits).toBe(2);
    expect(r.ungradedCount).toBe(2);
    expect(r.ungradedCredits).toBe(4.5);
    expect(r.rows[1].status).toBe('no-grade');
  });

  it('完全に空の行は empty', () => {
    const r = calculateGpa([row('', ''), row('2', 'A')], 'jp-4');
    expect(r.rows[0].status).toBe('empty');
    expect(r.countedCount).toBe(1);
  });

  it('科目名だけの行は zero-credits で除外', () => {
    const r = calculateGpa([row('', '', '数学')], 'jp-4');
    expect(r.rows[0].status).toBe('zero-credits');
    expect(r.gpa).toBeNull();
  });

  it('単位数が不正な行は除外してカウントする', () => {
    const r = calculateGpa(
      [row('abc', 'A'), row('-2', 'B'), row('2', 'A')],
      'jp-4',
    );
    expect(r.invalidCount).toBe(2);
    expect(r.gpa).toBe(3);
  });

  it('算入できる科目が無ければ GPA は null', () => {
    const r = calculateGpa([row('', ''), row('2', '')], 'jp-4');
    expect(r.gpa).toBeNull();
    expect(r.totalCredits).toBe(0);
    expect(formatGpa(r.gpa)).toBe('');
  });

  it('現在の尺度に無い評価は未評価扱い', () => {
    const r = calculateGpa([row('2', 'S')], 'us-4');
    expect(r.rows[0].status).toBe('unknown-grade');
    expect(r.gpa).toBeNull();
    expect(r.ungradedCredits).toBe(2);
  });

  it('全科目 F なら GPA 0.00・取得単位 0', () => {
    const r = calculateGpa([row('2', 'F'), row('4', 'F')], 'us-4');
    expect(r.gpa).toBe(0);
    expect(r.earnedCredits).toBe(0);
    expect(formatGpa(r.gpa)).toBe('0.00');
  });

  it('小数の単位数（0.5・1.5）を扱える', () => {
    const r = calculateGpa([row('0.5', 'S'), row('1.5', 'C')], 'jp-4');
    expect(r.totalCredits).toBe(2);
    // (0.5*4 + 1.5*1)/2 = 1.75
    expect(r.gpa).toBe(1.75);
  });

  it('未知の尺度IDは先頭の尺度で計算する', () => {
    expect(calculateGpa([row('2', 'S')], 'unknown').gpa).toBe(4);
  });
});

describe('formatting', () => {
  it('formatNumber は末尾の0を省く', () => {
    expect(formatNumber(10)).toBe('10');
    expect(formatNumber(4.5)).toBe('4.5');
    expect(formatNumber(2.6)).toBe('2.6');
  });
  it('formatGpa は小数点2位固定', () => {
    expect(formatGpa(3)).toBe('3.00');
    expect(formatGpa(3.77)).toBe('3.77');
  });
});
