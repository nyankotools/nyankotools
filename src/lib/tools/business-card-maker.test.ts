import { describe, it, expect } from 'vitest';
import {
  DEFAULT_OPTIONS,
  buildCardContent,
  cardSize,
  hasContent,
  isQrModuleTooSmall,
  normalizeUrl,
  qrModuleMm,
  qrPayload,
  qrSvgPath,
  qrViewSize,
  sheetLayout,
  singleLine,
  toVCardInput,
  validateOptions,
  type CardOptions,
} from './business-card-maker';
import { generateQrMatrix } from './qr-generator';

const opts = (o: Partial<CardOptions> = {}): CardOptions => ({
  ...DEFAULT_OPTIONS,
  ...o,
});

describe('cardSize', () => {
  it('横向きは91×55mm、縦向きは55×91mm', () => {
    expect(cardSize('landscape')).toEqual({ widthMm: 91, heightMm: 55 });
    expect(cardSize('portrait')).toEqual({ widthMm: 55, heightMm: 91 });
  });
});

describe('sheetLayout', () => {
  it('横向き名刺は縦向きA4に2×5の10面で、中央に寄る', () => {
    const s = sheetLayout('landscape', 'a4', 10);
    expect(s.pageName).toBe('bc-a4p');
    expect([s.widthMm, s.heightMm]).toEqual([210, 297]);
    expect([s.cols, s.rows]).toEqual([2, 5]);
    expect(s.slots).toHaveLength(10);
    expect(s.slots[0]).toEqual({ xMm: 14, yMm: 11 });
    expect(s.slots[1]).toEqual({ xMm: 105, yMm: 11 });
    expect(s.slots[2]).toEqual({ xMm: 14, yMm: 66 });
    expect(s.slots[9]).toEqual({ xMm: 105, yMm: 11 + 4 * 55 });
  });

  it('縦向き名刺は横向きA4に5×2の10面', () => {
    const s = sheetLayout('portrait', 'a4', 10);
    expect(s.pageName).toBe('bc-a4l');
    expect([s.widthMm, s.heightMm]).toEqual([297, 210]);
    expect([s.cols, s.rows]).toEqual([5, 2]);
    expect(s.slots).toHaveLength(10);
    expect(s.slots[0]).toEqual({ xMm: 11, yMm: 14 });
    expect(s.slots[5]).toEqual({ xMm: 11, yMm: 14 + 91 });
  });

  it('全ての面が用紙内に収まり、重ならない', () => {
    for (const o of ['landscape', 'portrait'] as const) {
      const s = sheetLayout(o, 'a4', 10);
      const c = cardSize(o);
      for (const slot of s.slots) {
        expect(slot.xMm).toBeGreaterThanOrEqual(0);
        expect(slot.yMm).toBeGreaterThanOrEqual(0);
        expect(slot.xMm + c.widthMm).toBeLessThanOrEqual(s.widthMm);
        expect(slot.yMm + c.heightMm).toBeLessThanOrEqual(s.heightMm);
      }
      const keys = new Set(s.slots.map((p) => `${p.xMm},${p.yMm}`));
      expect(keys.size).toBe(s.slots.length);
    }
  });

  it('枚数は先頭から数え、0以下は空、面数超過は面数まで', () => {
    expect(sheetLayout('landscape', 'a4', 3).slots).toHaveLength(3);
    expect(sheetLayout('landscape', 'a4', 0).slots).toHaveLength(0);
    expect(sheetLayout('landscape', 'a4', 99).slots).toHaveLength(10);
  });

  it('1枚印刷は名刺と同じ寸法の用紙で1面', () => {
    const h = sheetLayout('landscape', 'single', 10);
    expect(h.pageName).toBe('bc-single-h');
    expect([h.widthMm, h.heightMm]).toEqual([91, 55]);
    expect(h.slots).toEqual([{ xMm: 0, yMm: 0 }]);
    const v = sheetLayout('portrait', 'single', 10);
    expect(v.pageName).toBe('bc-single-v');
    expect([v.widthMm, v.heightMm]).toEqual([55, 91]);
  });
});

describe('validateOptions', () => {
  it('既定値は有効', () => {
    expect(validateOptions(DEFAULT_OPTIONS)).toBeNull();
  });

  it('範囲外・NaN を検出する', () => {
    expect(validateOptions(opts({ nameSizeMm: 2 }))).toBe('nameSize');
    expect(validateOptions(opts({ nameSizeMm: 9.5 }))).toBe('nameSize');
    expect(validateOptions(opts({ nameSizeMm: NaN }))).toBe('nameSize');
    expect(validateOptions(opts({ bodySizeMm: 1.9 }))).toBe('bodySize');
    expect(validateOptions(opts({ qrSizeMm: 11 }))).toBe('qrSize');
    expect(validateOptions(opts({ qrSizeMm: 31 }))).toBe('qrSize');
  });

  it('境界値は有効', () => {
    expect(validateOptions(opts({ nameSizeMm: 3 }))).toBeNull();
    expect(validateOptions(opts({ nameSizeMm: 9 }))).toBeNull();
    expect(validateOptions(opts({ qrSizeMm: 12, bodySizeMm: 4 }))).toBeNull();
  });

  it('枚数は1〜10の整数', () => {
    expect(validateOptions(opts({ count: 0 }))).toBe('count');
    expect(validateOptions(opts({ count: 11 }))).toBe('count');
    expect(validateOptions(opts({ count: 2.5 }))).toBe('count');
    expect(validateOptions(opts({ count: 1 }))).toBeNull();
    expect(validateOptions(opts({ count: 10 }))).toBeNull();
  });

  it('色は #rrggbb のみ', () => {
    expect(validateOptions(opts({ accent: 'red' }))).toBe('accent');
    expect(validateOptions(opts({ accent: '#fff' }))).toBe('accent');
    expect(validateOptions(opts({ accent: '#FFaa00' }))).toBeNull();
  });
});

describe('buildCardContent', () => {
  it('姓名の並びは fnOrder に従う', () => {
    const o = opts({ familyName: '山田', givenName: '太郎' });
    expect(buildCardContent(o, 'family-given', '〒').name).toBe('山田 太郎');
    expect(buildCardContent(o, 'given-family', '').name).toBe('太郎 山田');
  });

  it('郵便番号に接頭辞を付け、空なら付けない', () => {
    const o = opts({ postal: '100-0001' });
    expect(buildCardContent(o, 'family-given', '〒').postal).toBe('〒100-0001');
    expect(buildCardContent(o, 'family-given', '').postal).toBe('100-0001');
    expect(buildCardContent(opts(), 'family-given', '〒').postal).toBe('');
  });

  it('部署と役職を連結し、連絡先は入力のあるものだけ並ぶ', () => {
    const c = buildCardContent(
      opts({
        department: '開発部',
        title: '部長',
        phone: '03-1234-5678',
        email: ' a@example.com ',
      }),
      'family-given',
      '〒',
    );
    expect(c.role).toBe('開発部　部長');
    expect(c.contacts).toEqual([
      { label: 'TEL', value: '03-1234-5678' },
      { label: 'E-mail', value: 'a@example.com' },
    ]);
  });

  it('改行や制御文字は空白にして1行にする', () => {
    expect(singleLine('a\nb\r\nc\u0000d')).toBe('a b c d');
    const c = buildCardContent(
      opts({ address: '東京都\n千代田区' }),
      'family-given',
      '',
    );
    expect(c.address).toBe('東京都 千代田区');
  });

  it('姓名が空のとき name は空（組織名にフォールバックしない）', () => {
    const c = buildCardContent(
      opts({ company: '株式会社サンプル' }),
      'family-given',
      '',
    );
    expect(c.name).toBe('');
    expect(c.company).toBe('株式会社サンプル');
  });
});

describe('hasContent', () => {
  it('何も入力がなければ false', () => {
    expect(hasContent(buildCardContent(opts(), 'family-given', '〒'))).toBe(
      false,
    );
  });
  it('空白だけでも false', () => {
    expect(
      hasContent(
        buildCardContent(
          opts({ company: '   ', phone: ' ' }),
          'family-given',
          '',
        ),
      ),
    ).toBe(false);
  });
  it('どれか1つあれば true', () => {
    expect(
      hasContent(buildCardContent(opts({ phone: '1' }), 'family-given', '')),
    ).toBe(true);
    expect(
      hasContent(
        buildCardContent(opts({ reading: 'Taro' }), 'family-given', ''),
      ),
    ).toBe(true);
  });
});

describe('normalizeUrl', () => {
  it('スキームが無ければ https:// を補う', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com');
    expect(normalizeUrl('http://example.com/a')).toBe('http://example.com/a');
  });
  it('空・空白入り・http以外は null', () => {
    expect(normalizeUrl('')).toBeNull();
    expect(normalizeUrl('exa mple.com')).toBeNull();
    expect(normalizeUrl('ftp://example.com')).toBeNull();
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
  });
});

describe('qrPayload', () => {
  const base = {
    familyName: '山田',
    givenName: '太郎',
    company: '株式会社サンプル',
    phone: '03-1234-5678',
    mobile: '090-1111-2222',
    email: 'taro@example.com',
    url: 'example.com',
    postal: '100-0001',
    address: '東京都千代田区千代田1-1',
  };

  it('none は QR なし', () => {
    expect(qrPayload(opts({ ...base, qr: 'none' }), 'family-given')).toEqual({
      ok: false,
      reason: 'none',
    });
  });

  it('vcard は vCard 3.0 のテキスト', () => {
    const r = qrPayload(opts({ ...base, qr: 'vcard' }), 'family-given');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.text).toContain('BEGIN:VCARD');
      expect(r.text).toContain('FN:山田 太郎');
      expect(r.text).toContain('ORG:株式会社サンプル');
      expect(r.text).toContain('TEL;TYPE=WORK:03-1234-5678');
      expect(r.text).toContain('TEL;TYPE=CELL:090-1111-2222');
      expect(r.text).toContain('EMAIL;TYPE=INTERNET:taro@example.com');
      expect(r.text).toContain('URL:https://example.com');
      expect(r.text).toContain('END:VCARD');
    }
  });

  it('vcard で何も入力がなければ empty', () => {
    expect(qrPayload(opts({ qr: 'vcard' }), 'family-given')).toEqual({
      ok: false,
      reason: 'empty',
    });
  });

  it('url はURLだけ。URLが無効なら empty', () => {
    expect(qrPayload(opts({ ...base, qr: 'url' }), 'family-given')).toEqual({
      ok: true,
      text: 'https://example.com',
    });
    expect(
      qrPayload(opts({ ...base, url: '', qr: 'url' }), 'family-given'),
    ).toEqual({ ok: false, reason: 'empty' });
  });

  it('toVCardInput は部署と役職をスペースで連結する', () => {
    const v = toVCardInput(opts({ department: '開発部', title: '部長' }));
    expect(v.title).toBe('開発部 部長');
    expect(v.address.type).toBe('WORK');
  });
});

describe('QR の描画用ヘルパー', () => {
  it('viewBox は余白込みのモジュール数', () => {
    expect(qrViewSize(21)).toBe(25);
  });

  it('パスは暗いモジュールだけを余白分ずらして並べる', () => {
    const dark = new Set(['0,0', '1,2']);
    const path = qrSvgPath(3, (r, c) => dark.has(`${r},${c}`));
    expect(path).toBe('M2 2h1v1h-1zM4 3h1v1h-1z');
  });

  it('暗いモジュールが無ければ空文字', () => {
    expect(qrSvgPath(3, () => false)).toBe('');
  });

  it('実際のQRでパスが生成でき、モジュール寸法を計算できる', () => {
    const r = generateQrMatrix('https://example.com', 'M');
    expect(r.ok).toBe(true);
    if (r.ok) {
      const path = qrSvgPath(r.matrix.moduleCount, r.matrix.isDark);
      expect(path.startsWith('M')).toBe(true);
      expect(path.length).toBeGreaterThan(100);
      expect(qrModuleMm(20, r.matrix.moduleCount)).toBeCloseTo(
        20 / (r.matrix.moduleCount + 4),
        6,
      );
      expect(isQrModuleTooSmall(20, r.matrix.moduleCount)).toBe(false);
    }
  });

  it('モジュールが細かすぎると警告対象になる', () => {
    expect(isQrModuleTooSmall(12, 77)).toBe(true);
    expect(isQrModuleTooSmall(30, 77)).toBe(false);
  });
});
