import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { nekoTextsJa } from '../../i18n/shindan/neko';
import { shindanUiJa } from '../../i18n/shindan/ui';
import { diagnose } from '../../lib/shindan/compose';
import { scoreAxes } from '../../lib/shindan/scoring';
import { validateTheme } from '../../lib/shindan/validate';
import { buildResultView } from '../../lib/shindan/view';
import { NEKO_TYPE_IDS, nekoCatImages, nekoTheme } from './neko';
import { shindanThemes } from '.';

/** 結果に出る文言で使わない語（設計書16.8・16.10） */
const FORBIDDEN = [
  'ハズレ',
  'はずれ',
  '残念',
  '下位',
  '不幸',
  'すべき',
  '別れ',
  '病気',
  '彼氏',
  '彼女',
  // 性別の決めつけ（16.10）
  '紳士',
  '淑女',
  'お姫さま',
  '王子さま',
];

const allPartTexts = Object.values(nekoTextsJa.parts).flatMap((slot) =>
  Object.values(slot),
);

describe('猫タイプ診断のテーマ定義', () => {
  it('整合性検査に通る', () => {
    expect(validateTheme(nekoTheme)).toEqual([]);
  });

  it('登録簿に載っている', () => {
    expect(shindanThemes.map((t) => t.spec.id)).toContain('neko');
  });

  it('全ての設問・選択肢に文言がある', () => {
    for (const q of nekoTheme.scoring.questions) {
      expect(nekoTextsJa.questions[q.id]?.text, q.id).toBeTruthy();
      for (const c of q.choices) {
        expect(
          nekoTextsJa.questions[q.id].choices[c.id],
          `${q.id}/${c.id}`,
        ).toBeTruthy();
      }
    }
  });

  it('全ての部品に文言があり、文言だけの余分なIDがない', () => {
    for (const slot of nekoTheme.slots) {
      const ids = slot.parts.map((p) => p.id).sort();
      expect(
        Object.keys(nekoTextsJa.parts[slot.id] ?? {}).sort(),
        slot.id,
      ).toEqual(ids);
      for (const id of ids) {
        expect(nekoTextsJa.parts[slot.id][id], `${slot.id}/${id}`).toBeTruthy();
      }
    }
    expect(Object.keys(nekoTextsJa.parts).sort()).toEqual(
      nekoTheme.slots.map((s) => s.id).sort(),
    );
  });

  it('全ての軸・タイプに文言と画像がある', () => {
    for (const axis of nekoTheme.scoring.axes) {
      const t = nekoTextsJa.axes[axis.id];
      expect(t?.label && t.plus && t.minus, axis.id).toBeTruthy();
    }
    expect(Object.keys(nekoTextsJa.types).sort()).toEqual(
      [...NEKO_TYPE_IDS].sort(),
    );
    for (const id of NEKO_TYPE_IDS) {
      const t = nekoTextsJa.types[id];
      expect(t.name && t.shortName && t.description, id).toBeTruthy();
      const image = nekoCatImages[id];
      expect(image, id).toBeDefined();
      expect(
        existsSync(join(process.cwd(), 'public', image.src)),
        image.src,
      ).toBe(true);
    }
  });

  it('称号・前半は8文字以内', () => {
    for (const text of Object.values(nekoTextsJa.parts.titlePrefix)) {
      expect([...text].length, text).toBeLessThanOrEqual(8);
    }
  });

  it('禁止語を含まない', () => {
    const texts = [
      ...allPartTexts,
      ...Object.values(nekoTextsJa.types).map((t) => t.description),
      ...Object.values(shindanUiJa.rarityLabels),
    ];
    for (const text of texts) {
      for (const word of FORBIDDEN) {
        expect(text.includes(word), `「${word}」: ${text}`).toBe(false);
      }
    }
  });

  it('タイプ解説・強み・隠れた一面は「です・ます」で終わる', () => {
    const texts = [
      ...Object.values(nekoTextsJa.types).map((t) => t.description),
      ...Object.values(nekoTextsJa.parts.strength),
      ...Object.values(nekoTextsJa.parts.hiddenSide),
    ];
    for (const text of texts) {
      expect(text, text).toMatch(/(です|ます|ません)。$/);
    }
  });

  it('一様な回答で★3は2〜3割程度（16.4）', () => {
    // 1軸3問 × 4択 = 64通りを全列挙する（他の軸の回答は結果に影響しない）
    const axis = nekoTheme.scoring.axes[0].id;
    const axisQuestions = nekoTheme.scoring.questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.choices.some((c) => c.effects[axis]));
    expect(axisQuestions).toHaveLength(3);
    let star3 = 0;
    for (let mask = 0; mask < 64; mask++) {
      const answers = Array<number>(12).fill(0);
      axisQuestions.forEach(({ i }, k) => {
        answers[i] = (mask >> (k * 2)) & 3;
      });
      if (scoreAxes(nekoTheme.scoring, answers)[axis].stars === 3) star3++;
    }
    expect(star3 / 64).toBeGreaterThanOrEqual(0.2);
    expect(star3 / 64).toBeLessThanOrEqual(0.3);
  });

  it('全16タイプに到達でき、結果の文言が空にならない', () => {
    const reached = new Set<string>();
    // 各軸の3問を同じ向き（+2 か −2 の選択肢）に揃えて16通りを作る
    for (let mask = 0; mask < 16; mask++) {
      const answers = nekoTheme.scoring.questions.map((q) => {
        const axisIndex = nekoTheme.scoring.axes.findIndex(
          (a) => q.choices[0].effects[a.id] !== undefined,
        );
        const axisId = nekoTheme.scoring.axes[axisIndex].id;
        const target = (mask >> axisIndex) & 1 ? -2 : 2;
        return q.choices.findIndex((c) => c.effects[axisId] === target);
      });
      const result = diagnose(nekoTheme, answers, mask * 100);
      expect(result).not.toBeNull();
      reached.add(result!.typeId);
      const view = buildResultView(nekoTheme, nekoTextsJa, result!);
      expect(
        view.title.endsWith(nekoTextsJa.types[result!.typeId].shortName),
      ).toBe(true);
      expect(view.strengths).toHaveLength(3);
      for (const text of [
        view.typeName,
        view.hiddenSide,
        view.quote,
        view.luckyItem,
        view.luckyAction,
        ...view.strengths,
      ]) {
        expect(text).not.toBe('');
      }
    }
    expect(reached.size).toBe(16);
  });
});
