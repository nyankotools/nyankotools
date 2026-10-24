import { describe, expect, it } from 'vitest';
import {
  argLabels,
  buildOverlaySvg,
  computeBounds,
  formatNumber,
  optimizePath,
  parsePath,
  SAMPLE_PATH,
  serializePath,
  updateSegmentArg,
} from './svg-path-viewer';

function ok(d: string) {
  const r = parsePath(d);
  expect(r.error).toBeNull();
  return r.segments;
}

describe('parsePath: 基本コマンド', () => {
  it('M / L / Z（絶対）', () => {
    const s = ok('M10 20 L30 40 Z');
    expect(s.map((x) => x.type)).toEqual(['M', 'L', 'Z']);
    expect(s[1].from).toEqual({ x: 10, y: 20 });
    expect(s[1].to).toEqual({ x: 30, y: 40 });
    expect(s[2].to).toEqual({ x: 10, y: 20 });
  });

  it('相対 m / l / z', () => {
    const s = ok('m10 20 l5 5 l-5 5 z');
    expect(s[1].to).toEqual({ x: 15, y: 25 });
    expect(s[2].to).toEqual({ x: 10, y: 30 });
    expect(s[3].to).toEqual({ x: 10, y: 20 });
    expect(s[1].relative).toBe(true);
    expect(s[1].absArgs).toEqual([15, 25]);
  });

  it('H / V（絶対と相対）', () => {
    const s = ok('M0 0 H10 V20 h-5 v5');
    expect(s[1].to).toEqual({ x: 10, y: 0 });
    expect(s[1].absArgs).toEqual([10]);
    expect(s[2].to).toEqual({ x: 10, y: 20 });
    expect(s[3].to).toEqual({ x: 5, y: 20 });
    expect(s[4].to).toEqual({ x: 5, y: 25 });
    expect(s[4].absArgs).toEqual([25]);
  });

  it('C / c の制御点', () => {
    const s = ok('M0 0 C10 0 20 10 30 10 c5 0 10 5 10 10');
    expect(s[1].controls).toHaveLength(2);
    expect(s[1].controls[0]).toMatchObject({ x: 10, y: 0, anchor: 'from' });
    expect(s[1].controls[1]).toMatchObject({ x: 20, y: 10, anchor: 'to' });
    expect(s[2].from).toEqual({ x: 30, y: 10 });
    expect(s[2].controls[0]).toMatchObject({ x: 35, y: 10 });
    expect(s[2].to).toEqual({ x: 40, y: 20 });
    expect(s[2].absArgs).toEqual([35, 10, 40, 15, 40, 20]);
  });

  it('S は直前の C の第2制御点を反転した制御点を持つ', () => {
    const s = ok('M0 0 C0 10 10 20 20 20 S40 10 40 0');
    const c = s[2].controls;
    expect(c[0]).toMatchObject({ x: 30, y: 20, implicit: true });
    expect(c[1]).toMatchObject({ x: 40, y: 10, implicit: false });
    expect(s[2].to).toEqual({ x: 40, y: 0 });
  });

  it('S が C / S の後でなければ第1制御点は現在点', () => {
    const s = ok('M5 5 L10 10 S20 20 30 10');
    expect(s[2].controls[0]).toMatchObject({ x: 10, y: 10, implicit: true });
  });

  it('s（相対）の制御点と終点', () => {
    const s = ok('M0 0 C0 10 10 20 20 20 s10 -5 20 -10');
    expect(s[2].controls[1]).toMatchObject({ x: 30, y: 15 });
    expect(s[2].to).toEqual({ x: 40, y: 10 });
  });

  it('Q / q の制御点', () => {
    const s = ok('M0 0 Q10 20 20 0 q5 -10 10 0');
    expect(s[1].controls).toHaveLength(1);
    expect(s[1].controls[0]).toMatchObject({ x: 10, y: 20 });
    expect(s[2].controls[0]).toMatchObject({ x: 25, y: -10 });
    expect(s[2].to).toEqual({ x: 30, y: 0 });
  });

  it('T は直前の Q の制御点を反転する。連続 T は前の暗黙制御点を使う', () => {
    const s = ok('M0 0 Q10 20 20 0 T40 0 T60 0');
    expect(s[2].controls[0]).toMatchObject({ x: 30, y: -20, implicit: true });
    expect(s[3].controls[0]).toMatchObject({ x: 50, y: 20, implicit: true });
    expect(s[3].to).toEqual({ x: 60, y: 0 });
  });

  it('t（相対）と、Q の後でない T は現在点が制御点', () => {
    const s = ok('M0 0 L10 10 t10 0');
    expect(s[2].controls[0]).toMatchObject({ x: 10, y: 10 });
    expect(s[2].to).toEqual({ x: 20, y: 10 });
  });

  it('A / a の引数と終点', () => {
    const s = ok('M0 0 A10 10 0 0 1 20 0 a5 5 30 1 0 10 5');
    expect(s[1].args).toEqual([10, 10, 0, 0, 1, 20, 0]);
    expect(s[1].to).toEqual({ x: 20, y: 0 });
    expect(s[1].controls).toEqual([]);
    expect(s[2].absArgs).toEqual([5, 5, 30, 1, 0, 30, 5]);
    expect(s[2].to).toEqual({ x: 30, y: 5 });
  });

  it('Z の後の相対コマンドはサブパス始点から始まる', () => {
    const s = ok('M10 10 L20 10 L20 20 Z l5 5');
    expect(s[4].from).toEqual({ x: 10, y: 10 });
    expect(s[4].to).toEqual({ x: 15, y: 15 });
  });

  it('複数サブパスでは直近の M が始点になる', () => {
    const s = ok('M0 0 L5 5 M20 20 l1 1 z');
    expect(s[4].to).toEqual({ x: 20, y: 20 });
  });
});

describe('parsePath: 記法のバリエーション', () => {
  it('暗黙の繰り返し（M の後は L、l の後は l）', () => {
    const s = ok('M0 0 10 10 20 0 l1 1 2 2');
    expect(s.map((x) => x.command)).toEqual(['M', 'L', 'L', 'l', 'l']);
    expect(s[2].to).toEqual({ x: 20, y: 0 });
    expect(s[4].to).toEqual({ x: 23, y: 3 });
  });

  it('m の後ろの暗黙座標は相対 l', () => {
    const s = ok('m5 5 10 10');
    expect(s[1].command).toBe('l');
    expect(s[1].to).toEqual({ x: 15, y: 15 });
  });

  it('C の繰り返し', () => {
    const s = ok('M0 0 C1 1 2 2 3 3 4 4 5 5 6 6');
    expect(s).toHaveLength(3);
    expect(s[2].to).toEqual({ x: 6, y: 6 });
  });

  it('カンマ・改行・詰め書き・指数表記', () => {
    const s = ok('M1,2\nL3.5.5-4 1');
    expect(s[1].to).toEqual({ x: 3.5, y: 0.5 });
    expect(s[2].to).toEqual({ x: -4, y: 1 });
    const t = ok('M0 0L1e1,2E-1');
    expect(t[1].to).toEqual({ x: 10, y: 0.2 });
  });

  it('円弧フラグは区切りなしでも読める', () => {
    const s = ok('M0 0a10 10 0 0110 10');
    expect(s[1].args).toEqual([10, 10, 0, 0, 1, 10, 10]);
    const t = ok('M0 0A5 5 0 11-5 5');
    expect(t[1].args).toEqual([5, 5, 0, 1, 1, -5, 5]);
  });

  it('前後の空白、Z の連続も許容', () => {
    const s = ok('  M0 0 L1 1 Zz  ');
    expect(s.map((x) => x.type)).toEqual(['M', 'L', 'Z', 'Z']);
  });

  it('M だけでも1セグメント', () => {
    expect(ok('M3 4')).toHaveLength(1);
  });
});

describe('parsePath: エラー', () => {
  it('空文字・空白のみ', () => {
    expect(parsePath('').error?.code).toBe('empty');
    expect(parsePath('  ').error?.code).toBe('empty');
  });

  it('M / m 以外で始まる', () => {
    expect(parsePath('L10 10').error?.code).toBe('must-start-with-move');
  });

  it('未知の文字', () => {
    const r = parsePath('M0 0 X5 5');
    expect(r.error).toEqual({ code: 'invalid-char', position: 5 });
    expect(r.segments).toHaveLength(1);
  });

  it('引数が足りない', () => {
    expect(parsePath('M0 0 L10').error?.code).toBe('missing-args');
    expect(parsePath('M0 0 C1 2 3 4 5').error?.code).toBe('missing-args');
    expect(parsePath('M0').error?.code).toBe('missing-args');
  });

  it('円弧フラグが 0/1 以外', () => {
    expect(parsePath('M0 0 A5 5 0 2 1 10 10').error?.code).toBe('invalid-flag');
  });

  it('Z の後に数値', () => {
    expect(parsePath('M0 0 L1 1 Z 5').error?.code).toBe('unexpected-number');
  });

  it('コマンドなしで数値が続く（先頭）', () => {
    expect(parsePath('5 5').error?.code).toBe('unexpected-number');
  });
});

describe('parsePath: 入力の境界', () => {
  it('全角の数字・コマンドはエラーになる', () => {
    expect(parsePath('M０ 0').error?.code).toBe('missing-args');
    expect(parsePath('Ｍ0 0').error?.code).toBe('invalid-char');
  });

  it('全角スペースは区切りとして扱わない', () => {
    expect(parsePath('M0　0').error?.code).toBe('missing-args');
  });

  it('大量のコマンド（2万セグメント）も例外なく読める', () => {
    const d = 'M0 0' + ' L1 1'.repeat(20000);
    const r = parsePath(d);
    expect(r.error).toBeNull();
    expect(r.segments).toHaveLength(20001);
  });
});

describe('formatNumber', () => {
  it('丸めと末尾0・-0 の除去', () => {
    expect(formatNumber(1.23456, 2)).toBe('1.23');
    expect(formatNumber(1.5, 3)).toBe('1.5');
    expect(formatNumber(2, 3)).toBe('2');
    expect(formatNumber(-0.0004, 2)).toBe('0');
    expect(formatNumber(10, 0)).toBe('10');
    expect(formatNumber(100, 2)).toBe('100');
    expect(formatNumber(Number.NaN, 2)).toBe('0');
  });
});

describe('serializePath / optimizePath', () => {
  it('非 compact は読みやすい形で往復できる', () => {
    const d = serializePath(ok('M10 20 L30 40 Z'), { precision: 3 });
    expect(d).toBe('M10 20 L30 40 Z');
  });

  it('compact は文字省略・区切り省略・先頭0省略', () => {
    const r = optimizePath('M 0.5 0.25 L 10 -5 L 20 -5.5 L 0.5 0.75', {
      precision: 2,
    });
    expect(r?.d).toBe('M.5.25L10-5 20-5.5.5.75');
    expect(r!.after).toBeLessThan(r!.before);
  });

  it('小数桁を削減する', () => {
    const r = optimizePath('M0.123456 0.987654 L10.55555 20.11111', {
      precision: 1,
    });
    expect(r?.d).toBe('M.1 1L10.6 20.1');
  });

  it('M は繰り返しても文字を省略しない', () => {
    const r = optimizePath('M0 0 M5 5', { precision: 2 });
    expect(r?.d).toBe('M0 0M5 5');
  });

  it('absolute で相対コマンドを絶対座標へ変換', () => {
    const r = optimizePath('m10 10 l5 5 h5 v-5 z', {
      precision: 2,
      absolute: true,
    });
    expect(r?.d).toBe('M10 10L15 15H20V10Z');
  });

  it('相対のまま小数桁を削減しても全コマンドが再パースできる', () => {
    const r = optimizePath(SAMPLE_PATH, { precision: 1 });
    expect(r).not.toBeNull();
    const again = parsePath(r!.d);
    expect(again.error).toBeNull();
    expect(again.segments).toHaveLength(parsePath(SAMPLE_PATH).segments.length);
  });

  it('円弧のフラグは常に空白で区切る', () => {
    const r = optimizePath('M0 0 A5 5 0 1 0 -5 -5', { precision: 2 });
    expect(r?.d).toBe('M0 0A5 5 0 1 0 -5-5');
    expect(parsePath(r!.d).segments[1].args).toEqual([5, 5, 0, 1, 0, -5, -5]);
  });

  it('同じコマンドの連続は文字を省略し、再パースで同じ座標になる', () => {
    const src = 'M0 0 l1 1 l2 2 l-1 3 c1 1 2 2 3 3 c1 1 2 2 3 3';
    const r = optimizePath(src, { precision: 3 });
    expect(r?.d).toBe('M0 0l1 1 2 2-1 3c1 1 2 2 3 3 1 1 2 2 3 3');
    const a = parsePath(src).segments.map((s) => s.to);
    const b = parsePath(r!.d).segments.map((s) => s.to);
    expect(b).toEqual(a);
  });

  it('不正な d は null', () => {
    expect(optimizePath('L1 1', { precision: 2 })).toBeNull();
    expect(optimizePath('', { precision: 2 })).toBeNull();
  });
});

describe('updateSegmentArg', () => {
  it('指定した引数だけを書き換える', () => {
    expect(updateSegmentArg('M0 0 L10 10', 1, 0, 25)).toBe('M0 0 L25 10');
  });

  it('円弧のフラグは 0/1 に正規化', () => {
    const d = updateSegmentArg('M0 0 A5 5 0 0 1 10 10', 1, 3, 7);
    expect(parsePath(d!).segments[1].args[3]).toBe(1);
  });

  it('範囲外・不正値・不正な d は null', () => {
    expect(updateSegmentArg('M0 0 L10 10', 5, 0, 1)).toBeNull();
    expect(updateSegmentArg('M0 0 L10 10', 1, 2, 1)).toBeNull();
    expect(updateSegmentArg('M0 0 L10 10', 1, 0, Number.NaN)).toBeNull();
    expect(updateSegmentArg('L1', 0, 0, 1)).toBeNull();
  });
});

describe('可視化', () => {
  it('computeBounds は制御点を含む', () => {
    const b = computeBounds(ok('M0 0 C0 -50 100 150 100 100'));
    expect(b).toEqual({ minX: 0, minY: -50, maxX: 100, maxY: 150 });
    expect(computeBounds([])).toBeNull();
  });

  it('buildOverlaySvg は path・制御線・点を出力する', () => {
    const svg = buildOverlaySvg(ok('M0 0 C0 10 10 20 20 20'), {
      label: 'preview',
      selected: 1,
    });
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(svg).toContain('aria-label="preview"');
    expect(svg.match(/<line /g)).toHaveLength(2);
    expect(svg.match(/<circle /g)).toHaveLength(4);
    expect(svg).toContain('M0 0C0 10 10 20 20 20');
  });

  it('制御点を非表示にできる', () => {
    const svg = buildOverlaySvg(ok('M0 0 Q5 5 10 0'), {
      label: 'x',
      showControls: false,
    });
    expect(svg).not.toContain('<line');
  });

  it('ラベルはエスケープされる', () => {
    const svg = buildOverlaySvg(ok('M0 0 L1 1'), { label: '"><script>' });
    expect(svg).not.toContain('<script>');
  });

  it('点だけのパスでも壊れない', () => {
    expect(buildOverlaySvg(ok('M3 3'), { label: 'x' })).toContain('<svg');
    expect(buildOverlaySvg([], { label: 'x' })).toBe('');
  });

  it('サンプルは全コマンドを含みエラーなく読める', () => {
    const types = new Set(ok(SAMPLE_PATH).map((s) => s.type));
    for (const t of ['M', 'C', 'S', 'Q', 'T', 'A', 'H', 'V', 'L', 'Z']) {
      expect(types.has(t)).toBe(true);
    }
  });

  it('argLabels の個数がコマンドの引数数と一致', () => {
    expect(argLabels('C')).toHaveLength(6);
    expect(argLabels('A')).toHaveLength(7);
    expect(argLabels('Z')).toEqual([]);
  });
});
