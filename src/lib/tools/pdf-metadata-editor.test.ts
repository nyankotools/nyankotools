import { PDFDocument, PDFName } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  dateToLocalInput,
  emptyMetadata,
  localInputToDate,
  metadataFileName,
  readMetadata,
  writeMetadata,
} from './pdf-metadata-editor';

async function makePdf(
  setup?: (doc: PDFDocument) => void,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage();
  doc.addPage();
  setup?.(doc);
  return doc.save();
}

describe('dateToLocalInput / localInputToDate', () => {
  it('相互に変換できる', () => {
    const d = new Date(2026, 9, 3, 14, 5);
    expect(dateToLocalInput(d)).toBe('2026-10-03T14:05');
    expect(localInputToDate('2026-10-03T14:05')?.getTime()).toBe(d.getTime());
  });
  it('空文字・未定義は「なし」', () => {
    expect(localInputToDate('')).toBeUndefined();
    expect(dateToLocalInput(undefined)).toBe('');
    expect(dateToLocalInput(new Date(NaN))).toBe('');
  });
  it('不正な日付は例外', () => {
    expect(() => localInputToDate('2026-13-01T00:00')).toThrow();
    expect(() => localInputToDate('2026-02-30T00:00')).toThrow();
    expect(() => localInputToDate('yesterday')).toThrow();
  });
});

describe('readMetadata', () => {
  it('設定済みの文書情報を読む', async () => {
    const bytes = await makePdf((doc) => {
      doc.setTitle('日本語タイトル');
      doc.setAuthor('Taro');
      doc.setKeywords(['a', 'b']);
      doc.setProducer('MyProducer');
      doc.setCreationDate(new Date(2026, 0, 2, 3, 4));
    });
    const { metadata, pageCount } = await readMetadata(bytes);
    expect(pageCount).toBe(2);
    expect(metadata.title).toBe('日本語タイトル');
    expect(metadata.author).toBe('Taro');
    expect(metadata.keywords).toBe('a b');
    expect(metadata.producer).toBe('MyProducer');
    expect(metadata.creationDate).toBe('2026-01-02T03:04');
  });

  it('壊れたPDFは invalid', async () => {
    await expect(
      readMetadata(new TextEncoder().encode('nope')),
    ).rejects.toMatchObject({ code: 'invalid' });
  });
});

describe('writeMetadata', () => {
  it('値を書き込み、再読込で一致する（日本語を含む）', async () => {
    const out = await writeMetadata(
      await makePdf(),
      {
        ...emptyMetadata(),
        title: '報告書',
        author: 'にゃんこ',
        keywords: 'x, y',
        producer: 'P',
        creationDate: '2026-10-03T09:30',
      },
      { removeXmp: true },
    );
    const { metadata } = await readMetadata(out);
    expect(metadata.title).toBe('報告書');
    expect(metadata.author).toBe('にゃんこ');
    expect(metadata.keywords).toBe('x, y');
    expect(metadata.producer).toBe('P');
    expect(metadata.creationDate).toBe('2026-10-03T09:30');
    expect(metadata.modificationDate).toBe('');
  });

  it('空欄の項目は削除する', async () => {
    const bytes = await makePdf((doc) => {
      doc.setTitle('old');
      doc.setAuthor('old');
      doc.setModificationDate(new Date());
    });
    const out = await writeMetadata(bytes, emptyMetadata(), {
      removeXmp: false,
    });
    const doc = await PDFDocument.load(out, { updateMetadata: false });
    expect(doc.getTitle()).toBeUndefined();
    expect(doc.getAuthor()).toBeUndefined();
    expect(doc.getModificationDate()).toBeUndefined();
  });

  it('removeXmp でXMPメタデータを削除する', async () => {
    const withXmp = await makePdf((doc) => {
      doc.catalog.set(
        PDFName.of('Metadata'),
        doc.context.register(doc.context.stream('<x>SECRET-XMP</x>')),
      );
    });
    const kept = await writeMetadata(withXmp, emptyMetadata(), {
      removeXmp: false,
    });
    expect(
      (await PDFDocument.load(kept)).catalog.get(PDFName.of('Metadata')),
    ).toBeDefined();
    const removed = await writeMetadata(withXmp, emptyMetadata(), {
      removeXmp: true,
    });
    expect(
      (await PDFDocument.load(removed)).catalog.get(PDFName.of('Metadata')),
    ).toBeUndefined();
    expect(Buffer.from(kept).toString('latin1')).toContain('SECRET-XMP');
    expect(Buffer.from(removed).toString('latin1')).not.toContain('SECRET-XMP');
  });

  it('ページ数は変わらない', async () => {
    const out = await writeMetadata(
      await makePdf(),
      { ...emptyMetadata(), title: 't' },
      { removeXmp: true },
    );
    expect((await PDFDocument.load(out)).getPageCount()).toBe(2);
  });

  it('不正な日付は badDate', async () => {
    await expect(
      writeMetadata(
        await makePdf(),
        { ...emptyMetadata(), creationDate: 'bad' },
        { removeXmp: true },
      ),
    ).rejects.toMatchObject({ code: 'badDate' });
  });

  it('壊れたPDFは invalid', async () => {
    await expect(
      writeMetadata(new TextEncoder().encode('nope'), emptyMetadata(), {
        removeXmp: true,
      }),
    ).rejects.toMatchObject({ code: 'invalid' });
  });
});

describe('metadataFileName', () => {
  it('_metadata を付ける', () => {
    expect(metadataFileName('doc.pdf')).toBe('doc_metadata.pdf');
    expect(metadataFileName('.pdf')).toBe('document_metadata.pdf');
  });
});
