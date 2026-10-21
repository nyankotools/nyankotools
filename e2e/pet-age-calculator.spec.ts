import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test('犬・猫の年齢換算: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [
    '/tools/pet-age-calculator/',
    '/en/tools/pet-age-calculator/',
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => v.id),
      path,
    ).toEqual([]);
  }
});

test('犬・猫の年齢換算: 中型犬3歳は人間の29歳', async ({ page }) => {
  await page.goto('/tools/pet-age-calculator/');
  await page.locator('#pet-years-input').fill('3');
  await page.locator('#pet-months-input').fill('0');
  await expect(page.locator('#pet-result')).toHaveText('約29歳');
});

test('犬・猫の年齢換算: 猫に切り替えると体格が隠れ3歳は28歳', async ({
  page,
}) => {
  await page.goto('/tools/pet-age-calculator/');
  await page.locator('input[name="pet-species"][value="cat"]').click();
  await expect(page.locator('#pet-size-field')).toBeHidden();
  await page.locator('#pet-years-input').fill('3');
  await expect(page.locator('#pet-result')).toHaveText('約28歳');
});

test('犬・猫の年齢換算: 月を含む入力で年月が表示される', async ({ page }) => {
  await page.goto('/tools/pet-age-calculator/');
  await page.locator('input[name="pet-species"][value="cat"]').click();
  await page.locator('#pet-years-input').fill('1');
  await page.locator('#pet-months-input').fill('6');
  await expect(page.locator('#pet-result')).toHaveText('約19歳6ヶ月');
});

test('犬・猫の年齢換算: 不正な月はエラーを表示する', async ({ page }) => {
  await page.goto('/tools/pet-age-calculator/');
  await page.locator('#pet-months-input').fill('12');
  await expect(page.locator('#pet-error')).toContainText(
    '計算できませんでした',
  );
  await expect(page.locator('#pet-results')).toBeHidden();
});

test('犬・猫の年齢換算: 英語版で結果と早見表が表示される', async ({ page }) => {
  await page.goto('/en/tools/pet-age-calculator/');
  await page.locator('#pet-size-select').selectOption('large');
  await page.locator('#pet-years-input').fill('10');
  await expect(page.locator('#pet-result')).toHaveText('About 72 years old');
  await expect(page.locator('main table tbody tr')).toHaveCount(20);
});
