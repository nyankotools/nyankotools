import { rarityRank } from './rarity';
import { isCandidate } from './select';
import {
  RARITIES,
  type AxisResult,
  type Pole,
  type Rarity,
  type ScoringTable,
  type ThemeSpec,
} from './types';

/** 2回以上出てくるIDの一覧 */
function duplicates(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dup.add(id);
    seen.add(id);
  }
  return [...dup];
}

function validateScoring(table: ScoringTable, label: string): string[] {
  const errors: string[] = [];
  const axisIds = new Set(table.axes.map((a) => a.id));

  for (const id of duplicates(table.axes.map((a) => a.id))) {
    errors.push(`${label}: 軸IDが重複: ${id}`);
  }
  for (const id of duplicates(table.questions.map((q) => q.id))) {
    errors.push(`${label}: 設問IDが重複: ${id}`);
  }
  for (const q of table.questions) {
    if (q.choices.length < 2 || q.choices.length > 4) {
      errors.push(`${label}: 設問 ${q.id} の選択肢は2〜4個`);
    }
    for (const id of duplicates(q.choices.map((c) => c.id))) {
      errors.push(`${label}: 設問 ${q.id} の選択肢IDが重複: ${id}`);
    }
    for (const c of q.choices) {
      for (const [axisId, value] of Object.entries(c.effects)) {
        if (!axisIds.has(axisId)) {
          errors.push(`${label}: ${q.id}/${c.id} が未知の軸を参照: ${axisId}`);
        }
        if (!Number.isInteger(value)) {
          errors.push(`${label}: ${q.id}/${c.id} の配点は整数`);
        }
      }
    }
  }
  for (const axis of table.axes) {
    const [two, three] = axis.stars;
    if (!(
      Number.isFinite(two) &&
      Number.isFinite(three) &&
      0 < two &&
      two < three
    )) {
      errors.push(`${label}: 軸 ${axis.id} の★閾値は 0 < ★2 < ★3`);
      continue;
    }
    // どちらかの極で★3に届くこと
    const reach = (sign: number) =>
      table.questions.reduce(
        (sum, q) =>
          sum +
          Math.max(
            ...q.choices.map((c) => sign * (c.effects[axis.id] ?? 0)),
            0,
          ),
        0,
      );
    if (Math.max(reach(1), reach(-1)) < three) {
      errors.push(`${label}: 軸 ${axis.id} の★3に届く回答がない`);
    }
  }

  // 全ての極の組み合わせにちょうど1タイプ
  for (const id of duplicates(table.types.map((t) => t.id))) {
    errors.push(`${label}: タイプIDが重複: ${id}`);
  }
  for (const type of table.types) {
    for (const axisId of Object.keys(type.poles)) {
      if (!axisIds.has(axisId)) {
        errors.push(`${label}: タイプ ${type.id} が未知の軸を参照: ${axisId}`);
      }
    }
  }
  const keyOf = (poles: Record<string, Pole>) =>
    table.axes.map((a) => poles[a.id] ?? '?').join('');
  const typeKeys = table.types.map((t) => keyOf(t.poles));
  for (const key of duplicates(typeKeys)) {
    errors.push(`${label}: 極の組み合わせ ${key} に複数のタイプ`);
  }
  for (let mask = 0; mask < 2 ** table.axes.length; mask++) {
    const key = table.axes
      .map((_, i) => ((mask >> i) & 1 ? '-' : '+'))
      .join('');
    if (!typeKeys.includes(key)) {
      errors.push(`${label}: 極の組み合わせ ${key} にタイプがない`);
    }
  }

  const rates = RARITIES.map((r) => table.rarityRates[r]);
  if (
    rates.some((r) => !Number.isInteger(r) || r < 0) ||
    rates.reduce((s, r) => s + r, 0) !== 1000
  ) {
    errors.push(`${label}: 出現率は0以上の整数で合計1000`);
  }
  return errors;
}

/** 全ての極の組み合わせ（スコアは使わないので0） */
function allPoleCombos(axisIds: readonly string[]) {
  const combos: Record<string, AxisResult>[] = [];
  for (let mask = 0; mask < 2 ** axisIds.length; mask++) {
    const axes: Record<string, AxisResult> = {};
    axisIds.forEach((id, i) => {
      axes[id] = { score: 0, pole: (mask >> i) & 1 ? '-' : '+', stars: 1 };
    });
    combos.push(axes);
  }
  return combos;
}

/** テーマ定義の整合性を検査し、問題の一覧を返す（空なら正常） */
export function validateTheme(theme: ThemeSpec): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9-]+$/.test(theme.id)) {
    errors.push('テーマIDは英小文字・数字・ハイフンのみ');
  }
  if (!Number.isInteger(theme.version) || theme.version < 1) {
    errors.push('version は1以上の整数');
  }

  // 現行と旧版の採点表（旧版の結果にも現行の部品を使うので、部品の検査は全ての表に対して行う）
  const tables: [string, ScoringTable][] = [
    [`v${theme.version}`, theme.scoring],
  ];
  for (const [key, table] of Object.entries(theme.legacyScoring ?? {})) {
    const version = Number(key);
    if (!/^[1-9]\d*$/.test(key) || version >= theme.version) {
      errors.push(`旧版 v${key} は現行より小さい1以上の整数`);
    }
    tables.push([`v${key}`, table]);
  }
  for (const [label, table] of tables) {
    errors.push(...validateScoring(table, label));
  }

  const axisIds = theme.scoring.axes.map((a) => a.id);
  const isRarity = (r: string): r is Rarity =>
    (RARITIES as readonly string[]).includes(r);

  for (const id of duplicates(theme.slots.map((s) => s.id))) {
    errors.push(`スロットIDが重複: ${id}`);
  }
  for (const slot of theme.slots) {
    for (const id of duplicates(slot.parts.map((p) => p.id))) {
      errors.push(`${slot.id}: 部品IDが重複: ${id}`);
    }
    if (!Number.isInteger(slot.count) || slot.count < 1) {
      errors.push(`${slot.id}: count は1以上の整数`);
    }
    if (slot.rarityMin && !isRarity(slot.rarityMin)) {
      errors.push(`${slot.id}: 未知のレア度 ${slot.rarityMin}`);
    }
    for (const part of slot.parts) {
      for (const cond of part.when ?? []) {
        if (!axisIds.includes(cond.axis)) {
          errors.push(`${slot.id}/${part.id}: 未知の軸を参照: ${cond.axis}`);
        }
        if (cond.pole !== '+' && cond.pole !== '-') {
          errors.push(`${slot.id}/${part.id}: 極は + か -: ${cond.pole}`);
        }
      }
      if (
        part.weight !== undefined &&
        !(Number.isFinite(part.weight) && part.weight > 0)
      ) {
        errors.push(`${slot.id}/${part.id}: weight は正の数`);
      }
      if (part.rarityMin && !isRarity(part.rarityMin)) {
        errors.push(`${slot.id}/${part.id}: 未知のレア度 ${part.rarityMin}`);
      }
    }
    // 全ての表の極×レア度で候補が足りること
    for (const [label, table] of tables) {
      const tableAxisIds = table.axes.map((a) => a.id);
      for (const axes of allPoleCombos(tableAxisIds)) {
        for (const rarity of RARITIES) {
          if (
            slot.rarityMin &&
            rarityRank(rarity) < rarityRank(slot.rarityMin)
          ) {
            continue;
          }
          const n = slot.parts.filter((p) =>
            isCandidate(p, axes, rarity),
          ).length;
          if (n < slot.count) {
            const key = tableAxisIds.map((id) => axes[id].pole).join('');
            errors.push(
              `${label}/${slot.id}: ${key}/${rarity} の候補が ${n} 件（${slot.count} 件以上必要）`,
            );
          }
        }
      }
    }
  }

  if (theme.compat.bands.length !== axisIds.length + 1) {
    errors.push('相性の bands は「軸数+1」個');
  }
  for (const [min, max] of theme.compat.bands) {
    if (!(Number.isInteger(min) && Number.isInteger(max))) {
      errors.push('相性の bands は整数');
    } else if (!(0 < min && min <= max && max <= 99)) {
      errors.push(`相性の bands [${min}, ${max}] は 0 < min ≤ max ≤ 99`);
    }
  }
  const partners = theme.compat.partners;
  if (partners) {
    const typeIds = new Set(theme.scoring.types.map((t) => t.id));
    for (const id of typeIds) {
      if (!typeIds.has(partners[id])) {
        errors.push(`タイプ ${id} のベストパートナーが未定義か未知のタイプ`);
      }
    }
    for (const id of Object.keys(partners)) {
      if (!typeIds.has(id))
        errors.push(`ベストパートナーに未知のタイプ: ${id}`);
    }
  }
  return errors;
}
