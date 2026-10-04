import {
  EMAIL_DOMAINS,
  EN_AREA_CODES,
  EN_CITY_STATES,
  EN_COMPANY_SUFFIXES,
  EN_COMPANY_WORDS,
  EN_FIRST_NAMES,
  EN_LAST_NAMES,
  EN_STREETS,
  EN_STREET_SUFFIXES,
  JA_COMPANY_SUFFIXES,
  JA_COMPANY_WORDS,
  JA_FAMILY_NAMES,
  JA_GIVEN_NAMES,
  JA_PREF_CITIES,
  JA_TOWNS,
} from './dummy-data-generator-data';

export type DummyLocale = 'ja' | 'en';

/** 出力する項目（この並びで出力する） */
export const DUMMY_FIELDS = [
  'name',
  'kana',
  'email',
  'phone',
  'zip',
  'address',
  'birthday',
  'age',
  'company',
  'username',
] as const;

export type DummyField = (typeof DUMMY_FIELDS)[number];
export type DummyFormat = 'json' | 'csv' | 'tsv';
export type DummyRecord = Partial<Record<DummyField, string | number>>;

export const MAX_COUNT = 1000;

export type Rng = () => number;

/** 文字列シードから決定的な乱数列を作る（FNV-1a + mulberry32）。シード未指定時は暗号学的乱数で初期化する */
export function createRng(seed?: string): Rng {
  let state: number;
  if (seed === undefined || seed === '') {
    state = crypto.getRandomValues(new Uint32Array(1))[0];
  } else {
    state = 0x811c9dc5;
    for (let i = 0; i < seed.length; i++) {
      state ^= seed.charCodeAt(i);
      state = Math.imul(state, 0x01000193) >>> 0;
    }
  }
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clampCount(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_COUNT, Math.max(1, Math.floor(n)));
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

function int(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function digits(rng: Rng, length: number): string {
  let s = '';
  for (let i = 0; i < length; i++) s += String(int(rng, 0, 9));
  return s;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** 18〜80歳の範囲でランダムな生年月日を作り、基準日 now 時点の年齢とあわせて返す */
function birthdayAndAge(
  rng: Rng,
  now: Date,
): { birthday: string; age: number } {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  const start = Date.UTC(y - 81, m, d) + 86_400_000;
  const end = Date.UTC(y - 18, m, d);
  const born = new Date(start + Math.floor(rng() * (end - start + 1)));
  const by = born.getUTCFullYear();
  const bm = born.getUTCMonth();
  const bd = born.getUTCDate();
  let age = y - by;
  if (m < bm || (m === bm && d < bd)) age--;
  return { birthday: `${by}-${pad2(bm + 1)}-${pad2(bd)}`, age };
}

function generateOne(locale: DummyLocale, rng: Rng, now: Date): DummyRecord {
  const num = int(rng, 1, 99);
  const domain = pick(rng, EMAIL_DOMAINS);
  const { birthday, age } = birthdayAndAge(rng, now);

  if (locale === 'ja') {
    const family = pick(rng, JA_FAMILY_NAMES);
    const given = pick(rng, JA_GIVEN_NAMES);
    const [pref, city] = pick(rng, JA_PREF_CITIES);
    const mobile = pick(rng, ['070', '080', '090']);
    return {
      name: `${family[0]} ${given[0]}`,
      kana: `${family[1]} ${given[1]}`,
      email: `${given[2]}.${family[2]}${num}@${domain}`,
      phone: `${mobile}-${digits(rng, 4)}-${digits(rng, 4)}`,
      zip: `${digits(rng, 3)}-${digits(rng, 4)}`,
      address: `${pref}${city}${pick(rng, JA_TOWNS)}${int(rng, 1, 9)}-${int(rng, 1, 30)}-${int(rng, 1, 20)}`,
      birthday,
      age,
      company: `株式会社${pick(rng, JA_COMPANY_WORDS)}${pick(rng, JA_COMPANY_SUFFIXES)}`,
      username: `${family[2]}${given[2]}${num}`,
    };
  }

  const first = pick(rng, EN_FIRST_NAMES);
  const last = pick(rng, EN_LAST_NAMES);
  const [city, state] = pick(rng, EN_CITY_STATES);
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${num}@${domain}`,
    // 555-0100〜0199 は北米で架空の番号として予約されている
    phone: `${pick(rng, EN_AREA_CODES)}-555-01${digits(rng, 2)}`,
    zip: String(int(rng, 10000, 99999)),
    address: `${int(rng, 100, 9999)} ${pick(rng, EN_STREETS)} ${pick(rng, EN_STREET_SUFFIXES)}, ${city}, ${state} ${int(rng, 10000, 99999)}`,
    birthday,
    age,
    company: `${pick(rng, EN_COMPANY_WORDS)} ${pick(rng, EN_COMPANY_SUFFIXES)}`,
    username: `${first[0].toLowerCase()}${last.toLowerCase()}${num}`,
  };
}

export interface GenerateOptions {
  locale: DummyLocale;
  count: number;
  fields: readonly DummyField[];
  rng: Rng;
  /** 年齢計算の基準日（テストで固定できるよう引数にしている） */
  now?: Date;
}

/** 選択された項目だけを含むダミー個人データを生成する（英語版では kana は出力しない） */
export function generateRecords(options: GenerateOptions): DummyRecord[] {
  const now = options.now ?? new Date();
  const fields = DUMMY_FIELDS.filter(
    (f) =>
      options.fields.includes(f) && !(f === 'kana' && options.locale === 'en'),
  );
  const records: DummyRecord[] = [];
  for (let i = 0; i < clampCount(options.count); i++) {
    const full = generateOne(options.locale, options.rng, now);
    const record: DummyRecord = {};
    for (const f of fields) record[f] = full[f];
    records.push(record);
  }
  return records;
}

function csvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** 生成結果を JSON / CSV / TSV の文字列に整形する */
export function formatRecords(
  records: DummyRecord[],
  format: DummyFormat,
): string {
  if (format === 'json') return JSON.stringify(records, null, 2);
  if (records.length === 0) return '';
  const keys = Object.keys(records[0]) as DummyField[];
  const sep = format === 'csv' ? ',' : '\t';
  const cell = (v: string | number | undefined) =>
    format === 'csv' ? csvCell(String(v ?? '')) : String(v ?? '');
  return [
    keys.join(sep),
    ...records.map((r) => keys.map((k) => cell(r[k])).join(sep)),
  ].join('\n');
}
