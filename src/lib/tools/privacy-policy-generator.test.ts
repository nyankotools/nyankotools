import { describe, expect, it } from 'vitest';
import {
  buildPrivacyPolicy,
  emptyPolicyInput,
  formatDate,
  parseDate,
  validatePolicy,
  type PolicyInput,
} from './privacy-policy-generator';

function input(partial: Partial<PolicyInput> = {}): PolicyInput {
  return {
    ...emptyPolicyInput(),
    siteName: 'テストサイト',
    operator: '山田太郎',
    contact: 'info@example.com',
    enactedDate: '2026-10-23',
    ...partial,
  };
}

describe('parseDate / formatDate', () => {
  it('正しい日付を解釈する', () => {
    expect(parseDate('2026-10-23')).toEqual({ y: 2026, m: 10, d: 23 });
    expect(parseDate('2024-02-29')).not.toBeNull();
  });

  it('存在しない日付や形式違いは null', () => {
    expect(parseDate('2026-02-30')).toBeNull();
    expect(parseDate('2025-02-29')).toBeNull();
    expect(parseDate('2026/10/23')).toBeNull();
    expect(parseDate('')).toBeNull();
  });

  it('ロケールごとに整形する', () => {
    expect(formatDate('2026-10-03', 'ja')).toBe('2026年10月3日');
    expect(formatDate('2026-10-03', 'en')).toBe('October 3, 2026');
    expect(formatDate('bad', 'en')).toBe('');
  });
});

describe('validatePolicy', () => {
  it('必須項目が揃っていれば問題なし', () => {
    expect(validatePolicy(input())).toEqual([]);
  });

  it('未入力・不正な日付を検出する', () => {
    expect(validatePolicy(emptyPolicyInput())).toEqual([
      'noSiteName',
      'noOperator',
      'noContact',
      'invalidEnactedDate',
    ]);
    expect(validatePolicy(input({ revisedDate: '2026-13-01' }))).toEqual([
      'invalidRevisedDate',
    ]);
  });

  it('改定日が制定日より前なら指摘する', () => {
    expect(validatePolicy(input({ revisedDate: '2026-01-01' }))).toEqual([
      'revisedBeforeEnacted',
    ]);
    expect(validatePolicy(input({ revisedDate: '2026-10-23' }))).toEqual([]);
  });
});

describe('buildPrivacyPolicy (ja)', () => {
  it('基本項目と制定日・運営者を含む', () => {
    const out = buildPrivacyPolicy(input(), 'ja');
    expect(out).toContain('「テストサイト」');
    expect(out).toContain('山田太郎');
    expect(out).toContain('制定日: 2026年10月23日');
    expect(out).toContain('info@example.com');
    expect(out).toContain('個人情報保護法');
    expect(out).not.toContain('Google');
    expect(out).not.toContain('最終改定日');
  });

  it('未入力はプレースホルダーになる', () => {
    const out = buildPrivacyPolicy(emptyPolicyInput(), 'ja');
    expect(out).toContain('【サイト名】');
    expect(out).toContain('【運営者名】');
    expect(out).toContain('【連絡先】');
    expect(out).not.toContain('制定日');
  });

  it('お問い合わせフォームの有無で取得項目が変わる', () => {
    expect(buildPrivacyPolicy(input({ contactForm: true }), 'ja')).toContain(
      'メールアドレス、お問い合わせ内容',
    );
    expect(buildPrivacyPolicy(input(), 'ja')).toContain(
      '直接取得することはありません',
    );
  });

  it('GA で Cookie 節も自動的に入る', () => {
    const out = buildPrivacyPolicy(input({ analytics: true }), 'ja');
    expect(out).toContain('Cookie（クッキー）について');
    expect(out).toContain('Google アナリティクス');
    expect(out).toContain('gaoptout');
  });

  it('AdSense の定型文を含む', () => {
    const out = buildPrivacyPolicy(input({ adsense: true }), 'ja');
    expect(out).toContain('Google AdSense');
    expect(out).toContain('https://adssettings.google.com/');
    expect(out).toContain('パーソナライズ広告を無効');
  });

  it('アフィリエイトとAmazonアソシエイト', () => {
    const out = buildPrivacyPolicy(input({ amazon: true }), 'ja');
    expect(out).toContain('Amazonアソシエイト・プログラム');
    expect(out).not.toContain('アフィリエイトプログラムに参加しており');
    const both = buildPrivacyPolicy(
      input({ affiliate: true, amazon: true }),
      'ja',
    );
    expect(both).toContain('アフィリエイトプログラムに参加しており');
  });

  it('見出し番号が連番になる', () => {
    const out = buildPrivacyPolicy(
      input({ analytics: true, adsense: true, affiliate: true }),
      'ja',
    );
    const nums = [...out.matchAll(/^(\d+)\. /gm)].map((m) => Number(m[1]));
    expect(nums).toEqual(nums.map((_, i) => i + 1));
    expect(nums.length).toBeGreaterThanOrEqual(7);
  });

  it('改定日を出力する', () => {
    const out = buildPrivacyPolicy(input({ revisedDate: '2026-12-01' }), 'ja');
    expect(out).toContain('最終改定日: 2026年12月1日');
  });
});

describe('buildPrivacyPolicy (en)', () => {
  it('英語で出力し日本法ベースであることを含む', () => {
    const out = buildPrivacyPolicy(
      input({
        siteName: 'Test Site',
        operator: 'Taro Yamada',
        adsense: true,
        analytics: true,
      }),
      'en',
    );
    expect(out).toContain('"Test Site"');
    expect(out).toContain('Act on the Protection of Personal Information');
    expect(out).toContain('Enacted: October 23, 2026');
    expect(out).toContain('Google AdSense');
    expect(out).toContain('Google Analytics');
    expect(out).not.toMatch(/[ぁ-んァ-ヶ一-龠]/);
  });

  it('プレースホルダーも英語', () => {
    const out = buildPrivacyPolicy(emptyPolicyInput(), 'en');
    expect(out).toContain('[Site name]');
    expect(out).toContain('[Operator name]');
  });
});
