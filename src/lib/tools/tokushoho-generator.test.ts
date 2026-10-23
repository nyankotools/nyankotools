import { describe, expect, it } from 'vitest';
import {
  DISCLOSE_ON_REQUEST,
  PLACEHOLDER,
  TOKUSHOHO_FIELD_IDS,
  analyzeTokushoho,
  buildRows,
  buildTokushoho,
  emptyInput,
  fileExtension,
  isValidEmail,
  isValidPhone,
  parseExtraLines,
  type TokushohoInput,
} from './tokushoho-generator';

function filled(partial: Partial<TokushohoInput> = {}): TokushohoInput {
  const base = emptyInput();
  base.values = {
    seller: '猫野商店',
    representative: '猫野 太郎',
    address: '東京都千代田区1-1-1',
    phone: '03-1234-5678',
    email: 'info@example.com',
    price: '各商品ページに税込価格で表示',
    extraFees: '送料 500円',
    payment: 'クレジットカード',
    paymentTiming: '注文時',
    delivery: '3営業日以内',
    returns: '不良品のみ',
  };
  return { ...base, ...partial };
}

describe('buildTokushoho', () => {
  it('テキスト形式で項目を【】見出しで並べる', () => {
    const out = buildTokushoho(filled(), 'text');
    expect(out.startsWith('【販売業者】\n猫野商店\n\n【運営責任者】')).toBe(
      true,
    );
    expect(out.endsWith('不良品のみ\n')).toBe(true);
    expect(out).toContain('【返品・交換・キャンセル】');
  });

  it('未入力の必須項目は【要記入】で残す', () => {
    const out = buildTokushoho(emptyInput(), 'text');
    expect(out.split(PLACEHOLDER).length - 1).toBe(TOKUSHOHO_FIELD_IDS.length);
  });

  it('住所・電話番号の非公開で定型文になる', () => {
    const rows = buildRows(filled({ hideAddress: true, hidePhone: true }));
    expect(rows.find((r) => r.label === '所在地')?.value).toBe(
      DISCLOSE_ON_REQUEST,
    );
    expect(rows.find((r) => r.label === '電話番号')?.value).toBe(
      DISCLOSE_ON_REQUEST,
    );
  });

  it('受付時間は電話番号の下に付く（非公開のときは付かない）', () => {
    const shown = buildRows(filled({ phoneHours: '平日10:00-18:00' }));
    expect(shown.find((r) => r.label === '電話番号')?.value).toBe(
      '03-1234-5678\n受付時間: 平日10:00-18:00',
    );
    const hidden = buildRows(
      filled({ phoneHours: '平日10:00-18:00', hidePhone: true }),
    );
    expect(hidden.find((r) => r.label === '電話番号')?.value).toBe(
      DISCLOSE_ON_REQUEST,
    );
  });

  it('サイトURLは販売業者の直後、追加項目は末尾に入る', () => {
    const rows = buildRows(
      filled({
        url: 'https://example.com/',
        extraLines: '申込有効期限: 注文後7日以内\n不正な行',
      }),
    );
    expect(rows[1]).toEqual({
      label: 'サイトURL',
      value: 'https://example.com/',
    });
    expect(rows[rows.length - 1]).toEqual({
      label: '申込有効期限',
      value: '注文後7日以内',
    });
  });

  it('Markdownは表になり、| と改行をエスケープする', () => {
    const out = buildTokushoho(
      filled({
        values: { ...filled().values, seller: 'A|B', returns: '1行目\n2行目' },
      }),
      'markdown',
    );
    expect(out.startsWith('| 項目 | 内容 |\n| --- | --- |\n')).toBe(true);
    expect(out).toContain('| 販売業者 | A\\|B |');
    expect(out).toContain('1行目<br>2行目');
  });

  it('HTMLはエスケープされ、改行は<br>になる', () => {
    const out = buildTokushoho(
      filled({
        values: {
          ...filled().values,
          seller: '<b>"A" & B</b>',
          returns: '1行目\n2行目',
        },
      }),
      'html',
    );
    expect(out).toContain('&lt;b&gt;&quot;A&quot; &amp; B&lt;/b&gt;');
    expect(out).not.toContain('<b>');
    expect(out).toContain('1行目<br>2行目');
    expect(out.startsWith('<table>')).toBe(true);
  });

  it('CRLFと行末の空白を整える', () => {
    const out = buildTokushoho(
      filled({ values: { ...filled().values, returns: 'a  \r\nb' } }),
      'text',
    );
    expect(out).toContain('a\nb');
  });
});

describe('analyzeTokushoho', () => {
  it('完全に入力されていれば問題なし', () => {
    expect(analyzeTokushoho(filled())).toEqual([]);
  });

  it('運営責任者の未入力は警告、それ以外の必須項目の未入力はエラー', () => {
    const issues = analyzeTokushoho(emptyInput());
    const missing = issues.filter((i) => i.code === 'missing');
    const rep = missing.find((i) => i.field === 'representative');
    expect(rep?.severity).toBe('warning');
    for (const issue of missing) {
      if (issue.field !== 'representative') {
        expect(issue.severity).toBe('error');
      }
    }
  });

  it('空の入力では全項目が missing になる', () => {
    const issues = analyzeTokushoho(emptyInput());
    expect(issues.filter((i) => i.code === 'missing')).toHaveLength(
      TOKUSHOHO_FIELD_IDS.length,
    );
  });

  it('非公開にした住所・電話は missing にならず、メール未入力で警告が出る', () => {
    const issues = analyzeTokushoho(
      filled({
        hideAddress: true,
        hidePhone: true,
        values: { ...filled().values, address: '', phone: '', email: '' },
      }),
    );
    expect(issues.map((i) => i.code)).toEqual([
      'missing',
      'hiddenNeedsContact',
    ]);
    expect(issues[0].field).toBe('email');
  });

  it('メール・電話・URLの形式を検査する', () => {
    const issues = analyzeTokushoho(
      filled({
        url: 'example.com',
        values: { ...filled().values, email: 'foo@bar', phone: 'abc' },
      }),
    );
    const codes = issues.map((i) => i.code);
    expect(codes).toContain('invalidEmail');
    expect(codes).toContain('invalidPhone');
    expect(codes).toContain('invalidUrl');
  });

  it('販売価格に「税」がなければ警告する', () => {
    const issues = analyzeTokushoho(
      filled({ values: { ...filled().values, price: '1,000円' } }),
    );
    expect(issues).toEqual([
      { code: 'priceNoTax', severity: 'warning', field: 'price' },
    ]);
  });

  it('区切りのない追加項目の行を警告する', () => {
    const issues = analyzeTokushoho(filled({ extraLines: 'ラベルのみ' }));
    expect(issues).toEqual([
      { code: 'extraNoSeparator', severity: 'warning', value: 'ラベルのみ' },
    ]);
  });
});

describe('helpers', () => {
  it('parseExtraLines は全角コロンも扱い、値中のコロンを保つ', () => {
    expect(parseExtraLines('動作環境：Windows 11\n時刻: 10:00\n\n: x')).toEqual(
      {
        rows: [
          { label: '動作環境', value: 'Windows 11' },
          { label: '時刻', value: '10:00' },
        ],
        invalid: [': x'],
      },
    );
  });

  it('isValidEmail / isValidPhone', () => {
    expect(isValidEmail('a@b.co.jp')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('a b@c.com')).toBe(false);
    expect(isValidPhone('０３－１２３４－５６７８')).toBe(true);
    expect(isValidPhone('+81 3 1234 5678')).toBe(true);
    expect(isValidPhone('12345')).toBe(false);
  });

  it('fileExtension', () => {
    expect(fileExtension('text')).toBe('txt');
    expect(fileExtension('markdown')).toBe('md');
    expect(fileExtension('html')).toBe('html');
  });
});
