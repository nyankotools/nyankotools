import { test, expect } from './helpers/test';

test.describe('音名⇔周波数変換', () => {
  test('初期表示は A4 = 440Hz = MIDI 69', async ({ page }) => {
    await page.goto('/tools/note-frequency-converter/');
    await expect(page.locator('#nfc-note')).toHaveValue('A4');
    await expect(page.locator('#nfc-midi')).toHaveValue('69');
    await expect(page.locator('#nfc-frequency')).toHaveValue('440');
    await expect(page.locator('[data-midi="60"]')).toHaveText('261.63');
  });

  test('音名を入力するとMIDI番号と周波数が更新される', async ({ page }) => {
    await page.goto('/tools/note-frequency-converter/');
    await page.locator('#nfc-note').fill('C4');
    await expect(page.locator('#nfc-midi')).toHaveValue('60');
    await expect(page.locator('#nfc-frequency')).toHaveValue('261.63');
  });

  test('周波数から最も近い音名とセントが分かる', async ({ page }) => {
    await page.goto('/tools/note-frequency-converter/');
    await page.locator('#nfc-frequency').fill('442');
    await expect(page.locator('#nfc-note')).toHaveValue('A4');
    await expect(page.locator('#nfc-result')).toContainText('+7.9');
  });

  test('基準ピッチを変えると周波数と一覧表が変わる', async ({ page }) => {
    await page.goto('/tools/note-frequency-converter/');
    await page.locator('[data-a4-preset="442"]').click();
    await expect(page.locator('#nfc-frequency')).toHaveValue('442');
    await expect(page.locator('[data-midi="69"]')).toHaveText('442');
  });

  test('基準ピッチを1文字ずつ入力しても最終値で一覧表が更新される', async ({
    page,
  }) => {
    await page.goto('/tools/note-frequency-converter/');
    const a4 = page.locator('#nfc-a4');
    await a4.fill('');
    // 途中の「4」「44」は範囲外で一時的に補正されるが、確定値 442 で計算される
    await a4.pressSequentially('442');
    await expect(page.locator('[data-midi="69"]')).toHaveText('442');
    await a4.press('Tab');
    await expect(a4).toHaveValue('442');
    await expect(page.locator('#nfc-frequency')).toHaveValue('442');
  });

  test('フラット表記に切り替えられる', async ({ page }) => {
    await page.goto('/tools/note-frequency-converter/');
    await page.locator('#nfc-midi').fill('70');
    await expect(page.locator('#nfc-note')).toHaveValue('A#4');
    await page.locator('#nfc-accidental').selectOption('flat');
    await expect(page.locator('#nfc-note')).toHaveValue('Bb4');
  });

  test('不正な音名はエラー表示になる', async ({ page }) => {
    await page.goto('/tools/note-frequency-converter/');
    await page.locator('#nfc-note').fill('H9');
    await expect(page.locator('#nfc-error')).toBeVisible();
    await page.locator('#nfc-note').fill('G4');
    await expect(page.locator('#nfc-error')).toBeHidden();
  });

  test('一覧表の値のクリックでコピーされる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/note-frequency-converter/');
    await page.locator('[data-midi="69"]').click();
    await expect(page.locator('#nfc-table-status')).toContainText('コピー');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '440',
    );
  });

  test('英語版で表示できる', async ({ page }) => {
    await page.goto('/en/tools/note-frequency-converter/');
    await expect(page.locator('main h1')).toContainText('Frequency');
    await expect(page.locator('[data-midi="57"]')).toHaveText('220');
  });
});
