import { describe, expect, it } from 'vitest';
import { buildShareHash, encodePayload, parseShareHash } from './codec';
import { compat } from './compat';
import {
  diagnose,
  ENGINE_VERSION,
  restore,
  resultFingerprint,
} from './compose';
import { cyrb53 } from './hash';
import { randomInput, testRandom, testTheme } from './test-theme';
import type { ThemeSpec } from './types';

/** v2 で配点を反転した改訂（部品は現行と同じ）。旧版 v1 の採点表は legacyScoring に保持する */
const revised: ThemeSpec = {
  ...testTheme,
  version: 2,
  scoring: {
    ...testTheme.scoring,
    questions: testTheme.scoring.questions.map((q) => ({
      ...q,
      choices: [...q.choices].reverse(),
    })),
  },
  legacyScoring: { 1: testTheme.scoring },
};

describe('diagnose', () => {
  it('同じ入力なら同じ結果（1,000件のスナップショット）', () => {
    const rand = testRandom(2026);
    const fingerprints: string[] = [];
    for (let i = 0; i < 1000; i++) {
      const { answers, variant } = randomInput(rand);
      const result = diagnose(testTheme, answers, variant)!;
      expect(diagnose(testTheme, answers, variant)).toEqual(result);
      fingerprints.push(`${result.code}:${resultFingerprint(result)}`);
    }
    expect(cyrb53(fingerprints.join('\n'))).toMatchInlineSnapshot(
      `4194002285144923`,
    );
  });

  it('結果の形', () => {
    const result = diagnose(testTheme, Array(12).fill(0), 0)!;
    expect(result.themeId).toBe('test');
    expect(result.themeVersion).toBe(1);
    expect(result.typeId).toBe('type0');
    expect(result.code).toBe(`${ENGINE_VERSION}.1.AAAAAA`);
    expect(result.parts.strength).toHaveLength(3);
    expect(result.axes.energy.pole).toBe('+');
    expect(result.axes.energy.stars).toBe(3);
  });

  it('variant（名前）を変えてもタイプと★は変わらない', () => {
    const rand = testRandom(3);
    for (let i = 0; i < 200; i++) {
      const { answers } = randomInput(rand);
      const a = diagnose(testTheme, answers, 0)!;
      const b = diagnose(testTheme, answers, 1234)!;
      expect(b.typeId).toBe(a.typeId);
      expect(b.axes).toEqual(a.axes);
    }
  });

  it('不正な入力は null', () => {
    expect(diagnose(testTheme, Array(11).fill(0), 0)).toBeNull();
    expect(diagnose(testTheme, Array(12).fill(4), 0)).toBeNull();
    expect(diagnose(testTheme, Array(12).fill(0), 4096)).toBeNull();
    expect(diagnose(testTheme, Array(12).fill(0), -1)).toBeNull();
    expect(diagnose(testTheme, Array(12).fill(0), 0, 99)).toBeNull();
  });

  it('variant が整数でない（NaN・小数）と null', () => {
    expect(diagnose(testTheme, Array(12).fill(0), NaN)).toBeNull();
    expect(diagnose(testTheme, Array(12).fill(0), 1.5)).toBeNull();
    expect(diagnose(testTheme, Array(12).fill(0), 4095.5)).toBeNull();
  });

  it('10万件で結果のかぶり率が0.1%未満', () => {
    const rand = testRandom(100);
    const seen = new Set<string>();
    const n = 100000;
    let collisions = 0;
    for (let i = 0; i < n; i++) {
      const { answers, variant } = randomInput(rand);
      const key = resultFingerprint(diagnose(testTheme, answers, variant)!);
      if (seen.has(key)) collisions++;
      seen.add(key);
    }
    expect(collisions / n).toBeLessThan(0.001);
  }, 60000);

  it('回答が偏っても（60%が選択肢1）10万件のかぶり率が0.1%未満', () => {
    // 偏った回答では同じ入力（回答+variant）が偶然重なるので、重複入力は除いて数える。
    // 同じ入力は同じ結果になるのが正しく、衝突とは呼ばない
    const rand = testRandom(101);
    const seenInputs = new Set<string>();
    const seenResults = new Set<string>();
    const n = 100000;
    let collisions = 0;
    let distinct = 0;
    for (let i = 0; i < n; i++) {
      const answers = Array.from({ length: 12 }, () =>
        rand() < 0.6 ? 0 : Math.floor(rand() * 4),
      );
      const variant = Math.floor(rand() * 4096);
      const input = `${answers.join(',')}|${variant}`;
      if (seenInputs.has(input)) continue;
      seenInputs.add(input);
      distinct++;
      const key = resultFingerprint(diagnose(testTheme, answers, variant)!);
      if (seenResults.has(key)) collisions++;
      seenResults.add(key);
    }
    expect(distinct).toBeGreaterThan(n * 0.99);
    expect(collisions / distinct).toBeLessThan(0.001);
  }, 60000);
});

describe('restore', () => {
  it('共有コードから同じ結果を再現する', () => {
    const rand = testRandom(5);
    for (let i = 0; i < 500; i++) {
      const { answers, variant } = randomInput(rand);
      const result = diagnose(testTheme, answers, variant)!;
      expect(restore(testTheme, result.code)).toEqual(result);
    }
  });

  it('壊れた・未知の版のコードは例外を出さず null', () => {
    for (const bad of [
      '',
      'garbage',
      '1.1.AAAAA',
      '1.1.AAAAA!',
      '1.9.AAAAAA',
      `${ENGINE_VERSION + 1}.1.AAAAAA`,
    ]) {
      expect(restore(testTheme, bad)).toBeNull();
    }
  });

  it('前後の空白・改行・先頭ゼロ・現行より新しい版のコードは null', () => {
    for (const bad of [
      '1.1.AAAAAA\n',
      ' 1.1.AAAAAA',
      '1.1.AAAAAA ',
      '01.1.AAAAAA',
      '1.01.AAAAAA',
      '1.2.AAAAAA',
      '1.1.AAAAAAA',
    ]) {
      expect(restore(testTheme, bad)).toBeNull();
    }
  });

  it('設問の選択肢数より大きい値（範囲外の回答）を含むコードは null', () => {
    // 1問目を2択にしたテーマ。2bit の 2 や 3 は存在しない選択肢
    const narrow: ThemeSpec = {
      ...testTheme,
      scoring: {
        ...testTheme.scoring,
        questions: testTheme.scoring.questions.map((q, i) =>
          i === 0 ? { ...q, choices: q.choices.slice(0, 2) } : q,
        ),
      },
    };
    const ok = encodePayload([1, ...Array(11).fill(0)], 5);
    const bad = encodePayload([2, ...Array(11).fill(0)], 5);
    expect(restore(narrow, `1.1.${ok}`)).not.toBeNull();
    expect(restore(narrow, `1.1.${bad}`)).toBeNull();
  });

  it('旧版のコードは旧版の採点表でタイプを再現し、部品は現行版で決める', () => {
    const answers = Array(12).fill(0);
    const old = diagnose(testTheme, answers, 77)!;
    const restored = restore(revised, old.code)!;
    expect(restored.themeVersion).toBe(1);
    expect(restored.typeId).toBe(old.typeId);
    expect(restored.code).toBe(old.code);
    // themeVersion は seed に含めないので、同じ回答なら部品・レア度も同じ
    expect(restored.parts).toEqual(old.parts);
    expect(restored.rarity).toBe(old.rarity);
    // 現行版で同じ回答をすると配点が逆なので別のタイプ
    expect(diagnose(revised, answers, 77)!.typeId).not.toBe(old.typeId);
  });

  it('共有URLの自分と相手（vs）も同じ規則で復元でき、相性は対称になる', () => {
    const mine = diagnose(revised, Array(12).fill(0), 5)!;
    const friend = diagnose(testTheme, [...Array(11).fill(0), 1], 0)!;
    const parsed = parseShareHash(buildShareHash(mine.code, friend.code))!;
    const self = restore(revised, parsed.self)!;
    const vs = restore(revised, parsed.vs!)!;
    expect(self).toEqual(mine);
    expect(vs).toEqual(friend);
    expect(compat(revised, self, vs)).toEqual(compat(revised, vs, self));
    // 相手のコードが壊れていれば、相性は計算されない（復元が null）
    expect(restore(revised, 'broken')).toBeNull();
  });

  it('ランダムな文字列でも例外を出さず、復元できたものは入力と同じコードになる', () => {
    const rand = testRandom(77);
    const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)];
    const payloadChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const junk = '+/= .\n';
    let restored = 0;
    for (let i = 0; i < 20000; i++) {
      // 形式に近い入力を多く混ぜ、一部は壊す
      const engine = pick(['1', '1', '1', String(Math.floor(rand() * 10))]);
      const theme = pick(['1', '1', String(Math.floor(rand() * 10))]);
      const len = Math.floor(rand() * 9);
      let payload = '';
      for (let j = 0; j < len; j++) {
        payload += rand() < 0.05 ? pick([...junk]) : pick([...payloadChars]);
      }
      const code = `${engine}.${theme}.${payload}`;
      const result = restore(testTheme, code);
      if (result) {
        restored++;
        expect(result.code).toBe(code);
      }
    }
    expect(restored).toBeGreaterThan(0);
  });
});
