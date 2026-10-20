import { describe, expect, it } from 'vitest';
import {
  autoColors,
  avatarFileName,
  clampSize,
  contrastColor,
  hashString,
  hexToRgb,
  hslToHex,
  identiconGrid,
  initialsFontSize,
  isHexColor,
  makeInitials,
  shapeGeometry,
} from './avatar-generator';

describe('makeInitials', () => {
  it('英語の名前は先頭と末尾の語の頭文字を大文字にする', () => {
    expect(makeInitials('john ronald reuel tolkien', 2)).toBe('JT');
    expect(makeInitials('Ada Lovelace', 1)).toBe('A');
  });
  it('1語だけなら先頭から指定文字数', () => {
    expect(makeInitials('nyanko', 2)).toBe('NY');
    expect(makeInitials('nyanko', 1)).toBe('N');
  });
  it('日本語は空白（全角含む）で語を分ける', () => {
    expect(makeInitials('山田　太郎', 2)).toBe('山太');
    expect(makeInitials('山田太郎', 2)).toBe('山田');
  });
  it('絵文字を1文字として数える', () => {
    expect(makeInitials('👨‍👩‍👧 Family', 2)).toBe('👨‍👩‍👧F');
  });
  it('空や空白だけなら空文字', () => {
    expect(makeInitials('', 2)).toBe('');
    expect(makeInitials('  　 ', 1)).toBe('');
  });
});

describe('hashString / autoColors', () => {
  it('同じ入力は同じ値、違う入力は違う値', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abd'));
    expect(hashString('')).toBe(0x811c9dc5);
  });
  it('自動配色は決定的で、文字色は背景とコントラストが取れる', () => {
    const a = autoColors('Taro', 'initials');
    expect(a).toEqual(autoColors('Taro', 'initials'));
    expect(isHexColor(a.background)).toBe(true);
    expect(isHexColor(a.foreground)).toBe(true);
    expect(a.foreground).toBe(contrastColor(a.background));
  });
});

describe('colors', () => {
  it('hslToHex', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
    expect(hslToHex(120, 100, 50)).toBe('#00ff00');
    expect(hslToHex(0, 0, 100)).toBe('#ffffff');
  });
  it('hexToRgb は不正値で黒', () => {
    expect(hexToRgb('#ff8000')).toEqual([255, 128, 0]);
    expect(hexToRgb('red')).toEqual([0, 0, 0]);
  });
  it('contrastColor', () => {
    expect(contrastColor('#000000')).toBe('#ffffff');
    expect(contrastColor('#ffff00')).toBe('#111827');
  });
});

describe('identiconGrid', () => {
  it('5x5で左右対称、決定的', () => {
    const g = identiconGrid('octocat');
    expect(g).toHaveLength(5);
    for (const row of g) {
      expect(row).toHaveLength(5);
      expect(row[0]).toBe(row[4]);
      expect(row[1]).toBe(row[3]);
    }
    expect(identiconGrid('octocat')).toEqual(g);
  });
  it('シードが違えば模様が変わる（多くのシードで）', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 20; i++)
      seen.add(JSON.stringify(identiconGrid(`s${i}`)));
    expect(seen.size).toBeGreaterThan(10);
  });
  it('空文字でも塗りが1つ以上ある', () => {
    expect(identiconGrid('').some((r) => r.some(Boolean))).toBe(true);
  });
});

describe('misc', () => {
  it('shapeGeometry', () => {
    expect(shapeGeometry('circle', 100)).toEqual({ kind: 'ellipse' });
    expect(shapeGeometry('square', 100)).toEqual({ kind: 'rect', radius: 0 });
    expect(shapeGeometry('rounded', 100)).toEqual({ kind: 'rect', radius: 20 });
  });
  it('initialsFontSize は文字数が増えると小さくなる', () => {
    expect(initialsFontSize(1, 100)).toBeGreaterThan(initialsFontSize(2, 100));
  });
  it('clampSize', () => {
    expect(clampSize(Number.NaN)).toBe(512);
    expect(clampSize(1)).toBe(16);
    expect(clampSize(99999)).toBe(2048);
  });
  it('avatarFileName は使えない文字を除く', () => {
    expect(avatarFileName('identicon', 'a/b c', 256)).toBe(
      'identicon-a-b-c-256.png',
    );
    expect(avatarFileName('initials', '  ', 128)).toBe(
      'initials-avatar-128.png',
    );
  });
});
