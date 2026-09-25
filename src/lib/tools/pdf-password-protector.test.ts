import createModule from '@neslinesli93/qpdf-wasm';
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { PdfToolError } from './pdf-merge-split';
import {
  buildQpdfArgs,
  encryptPdf,
  PasswordToolError,
  protectedFileName,
  randomOwnerPassword,
  type EncryptOptions,
  type QpdfRunner,
} from './pdf-password-protector';

const base: EncryptOptions = {
  userPassword: 'open-pw',
  ownerPassword: 'owner-pw',
  allowPrint: true,
  allowCopy: true,
  allowModify: true,
};

async function makePdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage([200, 300]);
  return doc.save();
}

async function realQpdf(): Promise<QpdfRunner> {
  const q = await createModule({
    locateFile: () => 'node_modules/@neslinesli93/qpdf-wasm/dist/qpdf.wasm',
    noInitialRun: true,
  } as never);
  return q as unknown as QpdfRunner;
}

describe('buildQpdfArgs', () => {
  it('AES-256 と全許可の引数を作る', () => {
    const args = buildQpdfArgs(base);
    expect(args.slice(0, 4)).toEqual([
      '--encrypt',
      'open-pw',
      'owner-pw',
      '256',
    ]);
    expect(args).toContain('--print=full');
    expect(args).toContain('--extract=y');
    expect(args).toContain('--modify=all');
  });

  it('制限を指定できる', () => {
    const args = buildQpdfArgs({
      ...base,
      allowPrint: false,
      allowCopy: false,
      allowModify: false,
    });
    expect(args).toContain('--print=none');
    expect(args).toContain('--extract=n');
    expect(args).toContain('--modify=none');
  });

  it('オーナーパスワードが空ならランダム値を使う', () => {
    const args = buildQpdfArgs({ ...base, ownerPassword: '' });
    expect(args[2]).toMatch(/^[A-Za-z0-9]{16}$/);
    expect(args[2]).not.toBe(args[1]);
  });

  it('開くパスワードが空ならエラー', () => {
    expect(() => buildQpdfArgs({ ...base, userPassword: '' })).toThrow(
      PasswordToolError,
    );
  });
});

describe('randomOwnerPassword', () => {
  it('毎回異なる16文字を返す', () => {
    expect(randomOwnerPassword()).not.toBe(randomOwnerPassword());
  });
});

describe('encryptPdf', () => {
  it('暗号化されたPDFを出力し、パスワードなしでは読めない', async () => {
    const out = await encryptPdf(await makePdf(), base, await realQpdf());
    expect(Buffer.from(out).toString('latin1')).toMatch(/\/Encrypt/);
    await expect(PDFDocument.load(out)).rejects.toThrow(/is encrypted/);
  });

  it('暗号化済みPDFは encrypted エラー', async () => {
    const q = await realQpdf();
    const once = await encryptPdf(await makePdf(), base, q);
    await expect(
      encryptPdf(once, base, await realQpdf()),
    ).rejects.toMatchObject({ code: 'encrypted' });
  });

  it('壊れたPDFは invalid エラー', async () => {
    await expect(
      encryptPdf(new Uint8Array([1, 2, 3]), base, await realQpdf()),
    ).rejects.toBeInstanceOf(PdfToolError);
  });

  it('qpdf が失敗コードを返したら encryptFailed', async () => {
    const fake: QpdfRunner = {
      callMain: () => 2,
      FS: { writeFile: () => {}, readFile: () => new Uint8Array() },
    };
    await expect(encryptPdf(await makePdf(), base, fake)).rejects.toMatchObject(
      { code: 'encryptFailed' },
    );
  });
});

describe('protectedFileName', () => {
  it('_protected を付ける', () => {
    expect(protectedFileName('doc.pdf')).toBe('doc_protected.pdf');
    expect(protectedFileName('.pdf')).toBe('document_protected.pdf');
  });

  it('大文字 PDF 拡張子にも対応', () => {
    expect(protectedFileName('doc.PDF')).toBe('doc_protected.pdf');
    expect(protectedFileName('doc.Pdf')).toBe('doc_protected.pdf');
  });

  it('複数の拡張子がある場合は最後の .pdf だけを除去', () => {
    expect(protectedFileName('archive.tar.pdf')).toBe(
      'archive.tar_protected.pdf',
    );
  });

  it('pdf 拡張子がない場合も名前を保持する', () => {
    expect(protectedFileName('noext')).toBe('noext_protected.pdf');
  });

  it('空の名前の場合は document を使う', () => {
    expect(protectedFileName('')).toBe('document_protected.pdf');
  });
});

describe('buildQpdfArgs with various passwords', () => {
  it('日本語パスワードを指定できる', () => {
    const args = buildQpdfArgs({
      ...base,
      userPassword: 'パスワード123',
      ownerPassword: 'オーナー',
    });
    expect(args[1]).toBe('パスワード123');
    expect(args[2]).toBe('オーナー');
  });

  it('特殊文字を含むパスワード', () => {
    const args = buildQpdfArgs({
      ...base,
      userPassword: 'P@ssw0rd!#$%',
      ownerPassword: 'O!@#$%^&*()',
    });
    expect(args[1]).toBe('P@ssw0rd!#$%');
    expect(args[2]).toBe('O!@#$%^&*()');
  });

  it('非常に長いパスワード', () => {
    const longPass = 'a'.repeat(1000);
    const args = buildQpdfArgs({
      ...base,
      userPassword: longPass,
    });
    expect(args[1]).toBe(longPass);
  });

  it('スペースを含むパスワード', () => {
    const args = buildQpdfArgs({
      ...base,
      userPassword: 'pass word with spaces',
    });
    expect(args[1]).toBe('pass word with spaces');
  });

  it('絵文字を含むパスワード（サロゲートペア）', () => {
    const args = buildQpdfArgs({
      ...base,
      userPassword: 'password🔒emoji',
    });
    expect(args[1]).toBe('password🔒emoji');
  });
});

describe('encryptPdf with various passwords', () => {
  it('日本語パスワードで暗号化', async () => {
    const out = await encryptPdf(
      await makePdf(),
      {
        ...base,
        userPassword: 'テストパスワード',
        ownerPassword: 'オーナーパス',
      },
      await realQpdf(),
    );
    expect(Buffer.from(out).toString('latin1')).toMatch(/\/Encrypt/);
  });

  it('特殊文字パスワードで暗号化', async () => {
    const out = await encryptPdf(
      await makePdf(),
      {
        ...base,
        userPassword: 'P@ss!#2024$',
        ownerPassword: 'O!@#%^',
      },
      await realQpdf(),
    );
    expect(Buffer.from(out).toString('latin1')).toMatch(/\/Encrypt/);
  });
});
