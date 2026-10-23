/** 特定商取引法に基づく表記（通信販売）の記載項目ID（表示順） */
export const TOKUSHOHO_FIELD_IDS = [
  'seller',
  'representative',
  'address',
  'phone',
  'email',
  'price',
  'extraFees',
  'payment',
  'paymentTiming',
  'delivery',
  'returns',
] as const;

export type TokushohoFieldId = (typeof TOKUSHOHO_FIELD_IDS)[number];

/** 出力に使う項目名（日本の法定表記なので出力言語は常に日本語） */
export const TOKUSHOHO_LABELS: Record<TokushohoFieldId, string> = {
  seller: '販売業者',
  representative: '運営責任者',
  address: '所在地',
  phone: '電話番号',
  email: 'メールアドレス',
  price: '販売価格',
  extraFees: '商品代金以外の必要料金',
  payment: 'お支払方法',
  paymentTiming: 'お支払時期',
  delivery: '商品の引渡時期',
  returns: '返品・交換・キャンセル',
};

/** 住所・電話番号を非公開にするときの定型文 */
export const DISCLOSE_ON_REQUEST = '請求があった場合には遅滞なく開示します。';

/** 未入力の必須項目に入れる目印 */
export const PLACEHOLDER = '【要記入】';

export type TokushohoFormat = 'text' | 'markdown' | 'html';

export interface TokushohoInput {
  values: Record<TokushohoFieldId, string>;
  /** 所在地を非公開にして「請求があれば開示」とする */
  hideAddress: boolean;
  /** 電話番号を非公開にして「請求があれば開示」とする */
  hidePhone: boolean;
  /** 電話の受付時間（任意） */
  phoneHours: string;
  /** サイトURL（任意） */
  url: string;
  /** 追加項目（1行に「項目名: 内容」） */
  extraLines: string;
}

export function emptyInput(): TokushohoInput {
  const values = {} as Record<TokushohoFieldId, string>;
  for (const id of TOKUSHOHO_FIELD_IDS) values[id] = '';
  return {
    values,
    hideAddress: false,
    hidePhone: false,
    phoneHours: '',
    url: '',
    extraLines: '',
  };
}

export interface TokushohoRow {
  label: string;
  value: string;
}

export type TokushohoIssueCode =
  | 'missing'
  | 'invalidEmail'
  | 'invalidPhone'
  | 'invalidUrl'
  | 'priceNoTax'
  | 'hiddenNeedsContact'
  | 'extraNoSeparator';

export interface TokushohoIssue {
  code: TokushohoIssueCode;
  severity: 'error' | 'warning';
  /** 対象の項目ID（追加項目・URLは undefined） */
  field?: TokushohoFieldId;
  /** 問題のある値（追加項目の行など） */
  value?: string;
}

/** 追加項目の行を {label, value} に分解する。区切りがない行は invalid に返す */
export function parseExtraLines(text: string): {
  rows: TokushohoRow[];
  invalid: string[];
} {
  const rows: TokushohoRow[] = [];
  const invalid: string[] = [];
  for (const raw of text.split(/\r\n|\r|\n/)) {
    const line = raw.trim();
    if (line === '') continue;
    const m = /^([^:：]+)[:：]\s*(.*)$/.exec(line);
    if (!m || m[1].trim() === '') {
      invalid.push(line);
      continue;
    }
    rows.push({ label: m[1].trim(), value: m[2].trim() });
  }
  return { rows, invalid };
}

function clean(s: string): string {
  return s
    .replace(/\r\n|\r/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim();
}

export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(s.trim());
}

/** 電話番号らしいか（数字が9〜15桁で、数字・ハイフン・括弧・+・空白のみ） */
export function isValidPhone(s: string): boolean {
  const t = s
    .trim()
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  if (!/^\+?[0-9\-\s()（）ー－]+$/.test(t)) return false;
  const digits = t.replace(/\D/g, '').length;
  return digits >= 9 && digits <= 15;
}

function isValidUrl(s: string): boolean {
  if (/\s/.test(s)) return false;
  try {
    const u = new URL(s);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.hostname;
  } catch {
    return false;
  }
}

/** 出力する行を組み立てる（必須の未入力項目は【要記入】で残す） */
export function buildRows(input: TokushohoInput): TokushohoRow[] {
  const v = (id: TokushohoFieldId) => clean(input.values[id]);
  const rows: TokushohoRow[] = [];
  for (const id of TOKUSHOHO_FIELD_IDS) {
    let value = v(id);
    if (id === 'address' && input.hideAddress) value = DISCLOSE_ON_REQUEST;
    if (id === 'phone') {
      if (input.hidePhone) {
        value = DISCLOSE_ON_REQUEST;
      } else {
        const hours = clean(input.phoneHours);
        if (value !== '' && hours !== '') value += `\n受付時間: ${hours}`;
      }
    }
    rows.push({
      label: TOKUSHOHO_LABELS[id],
      value: value === '' ? PLACEHOLDER : value,
    });
  }
  const url = clean(input.url);
  if (url !== '') {
    // サイトURLは販売業者の直後に置く
    rows.splice(1, 0, { label: 'サイトURL', value: url });
  }
  rows.push(...parseExtraLines(input.extraLines).rows);
  return rows;
}

/** 入力の問題点（エラー: 必須の未入力・形式不正、警告: 書き方の注意） */
export function analyzeTokushoho(input: TokushohoInput): TokushohoIssue[] {
  const issues: TokushohoIssue[] = [];
  const v = (id: TokushohoFieldId) => clean(input.values[id]);

  for (const id of TOKUSHOHO_FIELD_IDS) {
    if (id === 'address' && input.hideAddress) continue;
    if (id === 'phone' && input.hidePhone) continue;
    if (v(id) === '')
      issues.push({
        code: 'missing',
        severity: id === 'representative' ? 'warning' : 'error',
        field: id,
      });
  }
  const email = v('email');
  if (email !== '' && !isValidEmail(email)) {
    issues.push({ code: 'invalidEmail', severity: 'error', field: 'email' });
  }
  const phone = v('phone');
  if (!input.hidePhone && phone !== '' && !isValidPhone(phone)) {
    issues.push({ code: 'invalidPhone', severity: 'warning', field: 'phone' });
  }
  const url = clean(input.url);
  if (url !== '' && !isValidUrl(url)) {
    issues.push({ code: 'invalidUrl', severity: 'error', value: url });
  }
  const price = v('price');
  if (price !== '' && !price.includes('税')) {
    issues.push({ code: 'priceNoTax', severity: 'warning', field: 'price' });
  }
  if (
    (input.hideAddress || input.hidePhone) &&
    (email === '' || !isValidEmail(email))
  ) {
    issues.push({
      code: 'hiddenNeedsContact',
      severity: 'warning',
      field: 'email',
    });
  }
  for (const line of parseExtraLines(input.extraLines).invalid) {
    issues.push({ code: 'extraNoSeparator', severity: 'warning', value: line });
  }
  return issues;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeMarkdownCell(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

/** 指定形式のテキストを組み立てる */
export function buildTokushoho(
  input: TokushohoInput,
  format: TokushohoFormat,
): string {
  const rows = buildRows(input);
  if (format === 'markdown') {
    const lines = ['| 項目 | 内容 |', '| --- | --- |'];
    for (const r of rows) {
      lines.push(
        `| ${escapeMarkdownCell(r.label)} | ${escapeMarkdownCell(r.value)} |`,
      );
    }
    return lines.join('\n') + '\n';
  }
  if (format === 'html') {
    const lines = ['<table>', '  <tbody>'];
    for (const r of rows) {
      lines.push(
        `    <tr><th scope="row">${escapeHtml(r.label)}</th><td>${escapeHtml(r.value).replace(/\n/g, '<br>')}</td></tr>`,
      );
    }
    lines.push('  </tbody>', '</table>');
    return lines.join('\n') + '\n';
  }
  return rows.map((r) => `【${r.label}】\n${r.value}`).join('\n\n') + '\n';
}

/** ダウンロード時の拡張子 */
export function fileExtension(format: TokushohoFormat): string {
  return format === 'markdown' ? 'md' : format === 'html' ? 'html' : 'txt';
}
