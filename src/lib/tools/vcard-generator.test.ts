import { describe, it, expect } from 'vitest';
import {
  buildFormattedName,
  buildVCard,
  emptyAddress,
  escapeText,
  foldLine,
  vcardFileName,
  type VCardInput,
} from './vcard-generator';
import { generateQrMatrix } from './qr-generator';

function base(over: Partial<VCardInput> = {}): VCardInput {
  return {
    familyName: '',
    givenName: '',
    organization: '',
    title: '',
    phones: [],
    emails: [],
    urls: [],
    address: { ...emptyAddress },
    note: '',
    ...over,
  };
}

describe('escapeText', () => {
  it('バックスラッシュ・セミコロン・カンマ・改行をエスケープする', () => {
    expect(escapeText('a\\b;c,d\ne\r\nf')).toBe('a\\\\b\\;c\\,d\\ne\\nf');
  });
});

describe('foldLine', () => {
  it('75オクテット以下はそのまま', () => {
    const line = 'A'.repeat(75);
    expect(foldLine(line)).toBe(line);
  });
  it('長い行をCRLF+半角スペースで折り返し、各行が75オクテット以内', () => {
    const folded = foldLine('NOTE:' + 'x'.repeat(200));
    const lines = folded.split('\r\n');
    expect(lines.length).toBeGreaterThan(2);
    for (const l of lines) {
      expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    }
    expect(lines[1].startsWith(' ')).toBe(true);
    expect(folded.replace(/\r\n /g, '')).toBe('NOTE:' + 'x'.repeat(200));
  });
  it('マルチバイト文字の途中では切らない', () => {
    const text = 'NOTE:' + 'あ'.repeat(60);
    const folded = foldLine(text);
    for (const l of folded.split('\r\n')) {
      expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    }
    expect(folded.replace(/\r\n /g, '')).toBe(text);
    expect(folded).not.toContain('�');
  });
});

describe('buildFormattedName', () => {
  it('姓名の順序を切り替えられる', () => {
    const i = { familyName: '山田', givenName: '太郎', organization: '' };
    expect(buildFormattedName(i, 'family-given')).toBe('山田 太郎');
    expect(buildFormattedName(i, 'given-family')).toBe('太郎 山田');
  });
  it('姓名が無ければ組織名にフォールバックする', () => {
    expect(
      buildFormattedName({
        familyName: ' ',
        givenName: '',
        organization: ' ACME ',
      }),
    ).toBe('ACME');
  });
});

describe('buildVCard', () => {
  it('何も入力が無ければ empty', () => {
    expect(buildVCard(base())).toEqual({ ok: false, reason: 'empty' });
    expect(buildVCard(base({ note: '   ', emails: [' '] })).ok).toBe(false);
  });

  it('vCard 3.0 の基本項目をCRLFで出力する', () => {
    const r = buildVCard(
      base({
        familyName: 'Yamada',
        givenName: 'Taro',
        organization: 'ACME, Inc.',
        title: 'Engineer',
        phones: [
          { type: 'CELL', number: '090-1234-5678' },
          { type: 'WORK', number: '03-0000-0000' },
          { type: 'FAX', number: '  ' },
        ],
        emails: ['taro@example.com'],
        urls: ['https://example.com/'],
        address: {
          type: 'WORK',
          postalCode: '100-0001',
          region: 'Tokyo',
          city: 'Chiyoda',
          street: '1-1',
          country: 'Japan',
        },
        note: 'line1\nline2',
      }),
      { fnOrder: 'given-family' },
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings).toEqual([]);
    expect(r.vcard.split('\r\n')).toEqual([
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Yamada;Taro;;;',
      'FN:Taro Yamada',
      'ORG:ACME\\, Inc.',
      'TITLE:Engineer',
      'TEL;TYPE=CELL:090-1234-5678',
      'TEL;TYPE=WORK:03-0000-0000',
      'EMAIL;TYPE=INTERNET:taro@example.com',
      'URL:https://example.com/',
      'ADR;TYPE=WORK:;;1-1;Chiyoda;Tokyo;100-0001;Japan',
      'NOTE:line1\\nline2',
      'END:VCARD',
      '',
    ]);
    expect(r.vcard).not.toMatch(/[^\r]\n/);
    expect(r.qrText.endsWith('END:VCARD')).toBe(true);
  });

  it('組織名だけでもFNが入る', () => {
    const r = buildVCard(base({ organization: 'ACME' }));
    expect(r.ok && r.vcard).toContain('FN:ACME');
  });

  it('空白を含むURLは警告する', () => {
    const r = buildVCard(
      base({ givenName: 'A', urls: ['https://example.com/a b'] }),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings).toContain('url-invalid');
  });

  it('不正なメール・URLは警告する（出力はする）', () => {
    const r = buildVCard(
      base({ givenName: 'A', emails: ['bad'], urls: ['example.com'] }),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings).toEqual(['email-invalid', 'url-invalid']);
  });

  it('電話番号の改行や制御文字で行を注入できない', () => {
    const r = buildVCard(
      base({
        givenName: 'A',
        phones: [{ type: 'CELL', number: '1\r\nEND:VCARD\r\nBEGIN:VCARD' }],
      }),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const lines = r.vcard.split('\r\n').filter((l) => l !== '');
    expect(lines.filter((l) => l === 'END:VCARD')).toHaveLength(1);
    expect(lines.filter((l) => l === 'BEGIN:VCARD')).toHaveLength(1);
  });

  it('長いメモは.vcf側だけ折り返され、QR用は折り返さない', () => {
    const r = buildVCard(base({ givenName: 'A', note: 'メモ'.repeat(50) }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.vcard).toContain('\r\n ');
    expect(r.qrText).not.toContain('\r\n ');
  });

  it('QRに変換できる。極端に長いと too-long になる', () => {
    const ok = buildVCard(base({ familyName: '山田', givenName: '太郎' }));
    expect(ok.ok && generateQrMatrix(ok.qrText, 'M').ok).toBe(true);
    const big = buildVCard(base({ givenName: 'A', note: 'x'.repeat(4000) }));
    expect(big.ok && generateQrMatrix(big.qrText, 'M')).toEqual({
      ok: false,
      reason: 'too-long',
    });
  });
});

describe('vcardFileName', () => {
  it('使えない文字を除き、空なら contact', () => {
    expect(vcardFileName('山田 太郎')).toBe('山田_太郎.vcf');
    expect(vcardFileName('a/b:c')).toBe('abc.vcf');
    expect(vcardFileName('  ')).toBe('contact.vcf');
  });
});
