export interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface ParsedCron {
  fields: CronFields;
  minute: Set<number>;
  hour: Set<number>;
  dayOfMonth: Set<number>;
  month: Set<number>;
  dayOfWeek: Set<number>;
  dayOfMonthRestricted: boolean;
  dayOfWeekRestricted: boolean;
  /** 日と曜日をORで判定するか（両方が '*' で始まらない場合のみ。それ以外はAND） */
  dayFieldsOr: boolean;
  monthRestricted: boolean;
}

export type ParseCronResult =
  { ok: true; cron: ParsedCron } | { ok: false; error: string };

/** よく使われる特殊文字列（Vixie cron由来のエイリアス） */
const ALIASES: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

export const FIELD_RANGES = {
  minute: [0, 59] as const,
  hour: [0, 23] as const,
  dayOfMonth: [1, 31] as const,
  month: [1, 12] as const,
  dayOfWeek: [0, 7] as const,
};

/** カンマ区切りの1項目を表す構造化データ（数値のみで言語に依存しない） */
export interface CronFieldItem {
  isWildcard: boolean;
  start: number;
  end: number;
  step?: number;
}

/** 1フィールドをカンマ区切りの各項目に分解する。不正な形式はnull */
export function parseFieldItems(
  raw: string,
  min: number,
  max: number,
): CronFieldItem[] | null {
  const items: CronFieldItem[] = [];

  for (const rawItem of raw.split(',')) {
    const item = rawItem.trim();
    if (item === '') return null;

    const slashParts = item.split('/');
    if (slashParts.length > 2) return null;
    const [rangeToken, stepToken] = slashParts;

    let step: number | undefined;
    if (stepToken !== undefined) {
      if (!/^\d+$/.test(stepToken)) return null;
      step = Number(stepToken);
      if (step <= 0) return null;
    }

    if (rangeToken === '*') {
      items.push({ isWildcard: true, start: min, end: max, step });
      continue;
    }

    const rangeMatch = rangeToken.match(/^(\d+)(?:-(\d+))?$/);
    if (!rangeMatch) return null;
    const start = Number(rangeMatch[1]);
    const end =
      rangeMatch[2] !== undefined
        ? Number(rangeMatch[2])
        : step !== undefined
          ? max
          : start;

    if (start < min || start > max || end < min || end > max || end < start) {
      return null;
    }

    items.push({ isWildcard: false, start, end, step });
  }

  return items;
}

function expandFieldItems(items: CronFieldItem[]): Set<number> {
  const values = new Set<number>();
  for (const item of items) {
    const step = item.step ?? 1;
    for (let v = item.start; v <= item.end; v += step) {
      values.add(v);
    }
  }
  return values;
}

function parseFieldValues(
  raw: string,
  min: number,
  max: number,
): Set<number> | null {
  const items = parseFieldItems(raw, min, max);
  if (!items) return null;
  const values = expandFieldItems(items);
  return values.size > 0 ? values : null;
}

/** cron式（5フィールド、または@dailyなどのエイリアス）をパースする */
export function parseCronExpression(input: string): ParseCronResult {
  const trimmed = input.trim();
  if (trimmed === '') {
    return { ok: false, error: 'empty' };
  }

  const normalized = ALIASES[trimmed.toLowerCase()] ?? trimmed;
  const rawFields = normalized.split(/\s+/);
  if (rawFields.length !== 5) {
    return { ok: false, error: 'field-count' };
  }

  const [minuteRaw, hourRaw, domRaw, monthRaw, dowRaw] = rawFields;

  const minute = parseFieldValues(minuteRaw, ...FIELD_RANGES.minute);
  if (!minute) return { ok: false, error: 'minute' };
  const hour = parseFieldValues(hourRaw, ...FIELD_RANGES.hour);
  if (!hour) return { ok: false, error: 'hour' };
  const dayOfMonth = parseFieldValues(domRaw, ...FIELD_RANGES.dayOfMonth);
  if (!dayOfMonth) return { ok: false, error: 'dayOfMonth' };
  const month = parseFieldValues(monthRaw, ...FIELD_RANGES.month);
  if (!month) return { ok: false, error: 'month' };
  const dowValues = parseFieldValues(dowRaw, ...FIELD_RANGES.dayOfWeek);
  if (!dowValues) return { ok: false, error: 'dayOfWeek' };

  // 7(日曜)は0と同じ扱いにする
  const dayOfWeek = new Set<number>(
    [...dowValues].map((v) => (v === 7 ? 0 : v)),
  );

  return {
    ok: true,
    cron: {
      fields: {
        minute: minuteRaw,
        hour: hourRaw,
        dayOfMonth: domRaw,
        month: monthRaw,
        dayOfWeek: dowRaw,
      },
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
      dayOfMonthRestricted: domRaw !== '*',
      dayOfWeekRestricted: dowRaw !== '*',
      // Vixie cron / cronie は、どちらかの先頭が '*' なら（`*/2` も）OR ではなく AND で判定する
      dayFieldsOr: !domRaw.startsWith('*') && !dowRaw.startsWith('*'),
      monthRestricted: monthRaw !== '*',
    },
  };
}

/** 指定した日時がcron式に一致するか判定する（分単位） */
export function cronMatchesDate(cron: ParsedCron, date: Date): boolean {
  if (!cron.minute.has(date.getMinutes())) return false;
  if (!cron.hour.has(date.getHours())) return false;
  if (!cron.month.has(date.getMonth() + 1)) return false;

  const domMatch = cron.dayOfMonth.has(date.getDate());
  const dowMatch = cron.dayOfWeek.has(date.getDay());

  // 日と曜日の両方が '*' で始まらない場合のみOR。それ以外はAND（'*' は全日・全曜日なのでAND でよい）
  return cron.dayFieldsOr ? domMatch || dowMatch : domMatch && dowMatch;
}

export interface NextRunOptions {
  count?: number;
  from?: Date;
  maxYears?: number;
}

/** cron式に一致する次回実行日時を、指定件数まで列挙する */
export function getNextRunTimes(
  cron: ParsedCron,
  options: NextRunOptions = {},
): Date[] {
  const count = options.count ?? 5;
  const from = options.from ?? new Date();
  const maxYears = options.maxYears ?? 4;

  const candidate = new Date(from);
  candidate.setSeconds(0, 0);
  if (candidate.getTime() < from.getTime()) {
    candidate.setMinutes(candidate.getMinutes() + 1);
  }

  const limit = new Date(candidate);
  limit.setFullYear(limit.getFullYear() + maxYears);

  // 存在しない日付（2月30日等）を指定した場合に無限ループしないための安全弁
  const maxIterations = (maxYears + 1) * 366 * 24 * 60;

  const results: Date[] = [];
  let iterations = 0;
  while (
    results.length < count &&
    candidate.getTime() <= limit.getTime() &&
    iterations < maxIterations
  ) {
    if (cronMatchesDate(cron, candidate)) {
      results.push(new Date(candidate));
    }
    candidate.setMinutes(candidate.getMinutes() + 1);
    iterations++;
  }

  return results;
}
