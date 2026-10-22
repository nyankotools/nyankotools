export type CronFieldName =
  'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

export const CRON_FIELDS: readonly CronFieldName[] = [
  'minute',
  'hour',
  'dayOfMonth',
  'month',
  'dayOfWeek',
];

export const FIELD_RANGES: Record<CronFieldName, { min: number; max: number }> =
  {
    minute: { min: 0, max: 59 },
    hour: { min: 0, max: 23 },
    dayOfMonth: { min: 1, max: 31 },
    month: { min: 1, max: 12 },
    dayOfWeek: { min: 0, max: 7 },
  };

export type FieldMode = 'every' | 'single' | 'list' | 'range' | 'step';

export interface FieldSpec {
  mode: FieldMode;
  /** single: value / range: from / step: interval */
  a: string;
  /** range: to */
  b: string;
  /** list: comma separated values */
  list: string;
}

export type FieldErrorCode =
  'not-a-number' | 'out-of-range' | 'range-order' | 'step-zero' | 'empty-list';

export type FieldResult =
  { ok: true; value: string } | { ok: false; error: FieldErrorCode };

function parseIntStrict(text: string): number | null {
  const s = text.trim();
  if (!/^\d+$/.test(s)) return null;
  return Number(s);
}

export function buildField(name: CronFieldName, spec: FieldSpec): FieldResult {
  const { min, max } = FIELD_RANGES[name];
  const inRange = (n: number) => n >= min && n <= max;

  switch (spec.mode) {
    case 'every':
      return { ok: true, value: '*' };
    case 'single': {
      const n = parseIntStrict(spec.a);
      if (n === null) return { ok: false, error: 'not-a-number' };
      if (!inRange(n)) return { ok: false, error: 'out-of-range' };
      return { ok: true, value: String(n) };
    }
    case 'range': {
      const from = parseIntStrict(spec.a);
      const to = parseIntStrict(spec.b);
      if (from === null || to === null)
        return { ok: false, error: 'not-a-number' };
      if (!inRange(from) || !inRange(to))
        return { ok: false, error: 'out-of-range' };
      if (from > to) return { ok: false, error: 'range-order' };
      return { ok: true, value: from === to ? String(from) : `${from}-${to}` };
    }
    case 'step': {
      const n = parseIntStrict(spec.a);
      if (n === null) return { ok: false, error: 'not-a-number' };
      if (n === 0) return { ok: false, error: 'step-zero' };
      if (n > max) return { ok: false, error: 'out-of-range' };
      return { ok: true, value: n === 1 ? '*' : `*/${n}` };
    }
    case 'list': {
      const parts = spec.list
        .split(/[,\s、，]+/)
        .map((p) => p.trim())
        .filter((p) => p !== '');
      if (parts.length === 0) return { ok: false, error: 'empty-list' };
      const nums: number[] = [];
      for (const p of parts) {
        const n = parseIntStrict(p);
        if (n === null) return { ok: false, error: 'not-a-number' };
        if (!inRange(n)) return { ok: false, error: 'out-of-range' };
        nums.push(n);
      }
      const unique = [...new Set(nums)].sort((x, y) => x - y);
      return { ok: true, value: unique.join(',') };
    }
  }
}

export type CronBuildResult =
  | { ok: true; expression: string; fields: Record<CronFieldName, string> }
  | { ok: false; errors: Partial<Record<CronFieldName, FieldErrorCode>> };

export function buildCron(
  specs: Record<CronFieldName, FieldSpec>,
): CronBuildResult {
  const fields = {} as Record<CronFieldName, string>;
  const errors: Partial<Record<CronFieldName, FieldErrorCode>> = {};
  for (const name of CRON_FIELDS) {
    const r = buildField(name, specs[name]);
    if (r.ok) fields[name] = r.value;
    else errors[name] = r.error;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    expression: CRON_FIELDS.map((n) => fields[n]).join(' '),
    fields,
  };
}

// Expand a generated field value (star, star-slash-n, a-b, a,b, n) into numbers.
export function expandField(value: string, name: CronFieldName): number[] {
  const { min, max } = FIELD_RANGES[name];
  let out: number[] = [];
  if (value === '*') {
    for (let i = min; i <= max; i++) out.push(i);
  } else if (value.startsWith('*/')) {
    const step = Number(value.slice(2));
    for (let i = min; i <= max; i += step) out.push(i);
  } else {
    for (const part of value.split(',')) {
      const [from, to] = part.split('-').map(Number);
      const end = to ?? from;
      for (let i = from; i <= end; i++) out.push(i);
    }
  }
  if (name === 'dayOfWeek') out = out.map((n) => n % 7);
  return [...new Set(out)].sort((x, y) => x - y);
}

export type QuartzResult =
  { ok: true; expression: string } | { ok: false; reason: 'both-day-fields' };

/**
 * Convert a generated 5-field expression to Quartz (Spring) 6-field form:
 * seconds are prepended as 0, day-of-week is 1-7 (1 = Sunday), and one of
 * day-of-month / day-of-week must be `?`.
 */
export function toQuartz(fields: Record<CronFieldName, string>): QuartzResult {
  const domRestricted = fields.dayOfMonth !== '*';
  const dowRestricted = fields.dayOfWeek !== '*';
  if (domRestricted && dowRestricted) {
    return { ok: false, reason: 'both-day-fields' };
  }
  let dom = fields.dayOfMonth;
  let dow = '?';
  if (dowRestricted) {
    dom = '?';
    const days = expandField(fields.dayOfWeek, 'dayOfWeek');
    dow = days.map((d) => d + 1).join(',');
  } else if (!domRestricted) {
    dom = '*';
    dow = '?';
  }
  return {
    ok: true,
    expression: ['0', fields.minute, fields.hour, dom, fields.month, dow].join(
      ' ',
    ),
  };
}

export function defaultSpec(): FieldSpec {
  return { mode: 'every', a: '', b: '', list: '' };
}
