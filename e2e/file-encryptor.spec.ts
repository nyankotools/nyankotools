import { readFileSync } from 'node:fs';
import { test, expect } from './helpers/test';

const id = (name: string) => `#file-encryptor-${name}`;

test.describe('ファイル暗号化・復号（日本語版）', () => {
  test('暗号化した.encファイルを復号して元の内容とファイル名に戻せる', async ({
    page,
  }, testInfo) => {
    await page.goto('/tools/file-encryptor/');
    await expect(page.locator('main h1')).toHaveText(
      'ファイル暗号化・復号（AES-256-GCM）',
    );

    const content = Buffer.from('こんにちは 🐱 secret\n'.repeat(1000));
    await page.locator(id('file')).setInputFiles({
      name: 'メモ.txt',
      mimeType: 'text/plain',
      buffer: content,
    });
    await expect(page.locator(id('selected'))).toContainText('メモ.txt');
    await page.locator(id('password')).fill('pass123');
    await page.locator(id('run-button')).click();
    await expect(page.locator(id('result'))).toBeVisible();
    await expect(page.locator(id('result-text'))).toContainText('メモ.txt.enc');

    const encPath = testInfo.outputPath('encrypted.enc');
    const [encDownload] = await Promise.all([
      page.waitForEvent('download'),
      page.locator(id('download-button')).click(),
    ]);
    expect(encDownload.suggestedFilename()).toBe('メモ.txt.enc');
    await encDownload.saveAs(encPath);
    expect(readFileSync(encPath).includes(content.subarray(0, 30))).toBe(false);

    await page.getByRole('button', { name: '復号', exact: true }).click();
    await expect(page.locator(id('result'))).toBeHidden();
    await page.locator(id('file')).setInputFiles(encPath);
    await page.locator(id('password')).fill('pass123');
    await page.locator(id('run-button')).click();
    await expect(page.locator(id('result'))).toBeVisible();

    const plainPath = testInfo.outputPath('plain.txt');
    const [decDownload] = await Promise.all([
      page.waitForEvent('download'),
      page.locator(id('download-button')).click(),
    ]);
    expect(decDownload.suggestedFilename()).toBe('メモ.txt');
    await decDownload.saveAs(plainPath);
    expect(readFileSync(plainPath).equals(content)).toBe(true);
  });

  test('未選択・パスワード未入力・パスワード違い・形式不正でエラーを表示する', async ({
    page,
  }, testInfo) => {
    await page.goto('/tools/file-encryptor/');
    const error = page.locator(id('error'));
    await page.locator(id('run-button')).click();
    await expect(error).toHaveText('ファイルを選択してください。');

    await page.locator(id('file')).setInputFiles({
      name: 'a.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('abc'),
    });
    await page.locator(id('run-button')).click();
    await expect(error).toHaveText('パスワードを入力してください。');

    await page.locator(id('password')).fill('right');
    await page.locator(id('run-button')).click();
    await expect(page.locator(id('result'))).toBeVisible();
    const encPath = testInfo.outputPath('a.enc');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator(id('download-button')).click(),
    ]);
    await download.saveAs(encPath);

    await page.getByRole('button', { name: '復号', exact: true }).click();
    await page.locator(id('file')).setInputFiles(encPath);
    await page.locator(id('password')).fill('wrong');
    await page.locator(id('run-button')).click();
    await expect(error).toContainText('復号できませんでした');

    await page.locator(id('file')).setInputFiles({
      name: 'plain.enc',
      mimeType: 'application/octet-stream',
      buffer: Buffer.alloc(100, 1),
    });
    await page.locator(id('run-button')).click();
    await expect(error).toContainText('暗号化したファイルではありません');
  });

  test('パスワードの表示切り替えができる', async ({ page }) => {
    await page.goto('/tools/file-encryptor/');
    const password = page.locator(id('password'));
    await expect(password).toHaveAttribute('type', 'password');
    await page.locator(id('show-password')).check();
    await expect(password).toHaveAttribute('type', 'text');
  });
});

test.describe('File Encryptor & Decryptor (English)', () => {
  test('英語版で暗号化できる', async ({ page }) => {
    await page.goto('/en/tools/file-encryptor/');
    await expect(page.locator('main h1')).toHaveText(
      'File Encryptor & Decryptor (AES-256-GCM)',
    );
    await page.locator(id('file')).setInputFiles({
      name: 'note.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await page.locator(id('password')).fill('pw');
    await page.locator(id('run-button')).click();
    await expect(page.locator(id('result-text'))).toContainText('note.txt.enc');
  });
});
