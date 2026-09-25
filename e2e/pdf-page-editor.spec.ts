import { test, expect } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

async function createTestPdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300]);
  return Buffer.from(await doc.save());
}

async function createEncryptedTestPdf(
  pageCount: number,
  password: string,
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300]);
  // 暗号化フラグを付ける
  doc.context.trailerInfo.Encrypt = doc.context.register(
    doc.context.obj({
      Filter: 'Standard',
      V: 1,
      R: 2,
      O: password, // 簡易的な暗号化（実際の暗号化ではなくヘッダーのみ）
      U: password,
      P: -4,
    }),
  );
  return Buffer.from(await doc.save());
}

for (const [locale, base] of [
  ['ja', '/tools/pdf-page-editor/'],
  ['en', '/en/tools/pdf-page-editor/'],
] as const) {
  test.describe(`PDFページ操作 (${locale})`, () => {
    test('ページ一覧が表示され、削除・回転して保存できる', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pe-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(3),
      });
      const rows = page.locator('#pe-list li');
      await expect(rows).toHaveCount(3);
      // NOTE: ボタンセレクタは nth() に依存している。
      // 実装のボタン順が変更されるとテストが壊れる可能性。
      // 実装側でデータ属性を付与すれば解決できる。
      await rows.nth(0).locator('button').nth(1).click(); // 右へ回転
      await expect(rows.nth(0)).toContainText('90');
      await rows.nth(2).locator('button').nth(4).click(); // 削除
      await expect(rows).toHaveCount(2);
      await page.locator('#pe-run').click();
      const link = page.locator('#pe-result-list a');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('download', 'doc_edited.pdf');
    });

    test('全ページ削除して実行するとエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pe-file').setInputFiles({
        name: 'doc.pdf',
        mimeType: 'application/pdf',
        buffer: await createTestPdf(1),
      });
      await page
        .locator('#pe-list li')
        .first()
        .locator('button')
        .nth(4)
        .click();
      await page.locator('#pe-run').click();
      await expect(page.locator('#pe-error')).toBeVisible();
    });

    test('壊れたPDF・PDF以外・未選択はエラー', async ({ page }) => {
      await page.goto(base);
      await page.locator('#pe-run').click();
      await expect(page.locator('#pe-error')).toBeVisible();
      await page.locator('#pe-file').setInputFiles({
        name: 'bad.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('not a pdf'),
      });
      await expect(page.locator('#pe-error')).toBeVisible();
      await page.locator('#pe-file').setInputFiles({
        name: 'a.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello'),
      });
      await expect(page.locator('#pe-error')).toBeVisible();
    });

    test('暗号化PDFを選択するとパスワード入力セクションが表示される', async ({
      page,
    }) => {
      await page.goto(base);
      const passwordSection = page.locator('#pe-password-section');
      const editorSection = page.locator('#pe-editor');
      await expect(passwordSection).toBeHidden();
      await expect(editorSection).toBeHidden();
      await page.locator('#pe-file').setInputFiles({
        name: 'encrypted.pdf',
        mimeType: 'application/pdf',
        buffer: await createEncryptedTestPdf(2, 'password'),
      });
      // 暗号化されたPDFなので、エラーが表示され、パスワード入力セクションが見える
      await expect(page.locator('#pe-error')).toBeVisible();
      await expect(passwordSection).toBeVisible();
      await expect(editorSection).toBeHidden();
    });
  });
}
