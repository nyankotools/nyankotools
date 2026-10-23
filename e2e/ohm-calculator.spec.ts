import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const PATH = '/tools/ohm-calculator/';

test('オーム計算: 電圧と抵抗から電流と電力を求める', async ({ page }) => {
  await page.goto(PATH);

  await page.locator('#oh-v').fill('12');
  await page.locator('#oh-r').fill('4');

  await expect(page.locator('#oh-results')).not.toHaveClass(/hidden/);
  await expect(page.locator('#oh-res-i')).toHaveText('3 A');
  await expect(page.locator('#oh-res-p')).toHaveText('36 W');
});

test('オーム計算: SI接頭辞つきの入力を解釈する', async ({ page }) => {
  await page.goto(PATH);

  await page.locator('#oh-v').fill('5');
  await page.locator('#oh-r').fill('1k');

  await expect(page.locator('#oh-res-i')).toHaveText('5 mA');
  await expect(page.locator('#oh-res-p')).toHaveText('25 mW');
});

test('オーム計算: 3つ入力するとエラー、クリアで空になる', async ({ page }) => {
  await page.goto(PATH);

  await page.locator('#oh-v').fill('5');
  await page.locator('#oh-r').fill('220');
  await page.locator('#oh-i').fill('1');
  await expect(page.locator('#oh-error')).toContainText('2つだけ');
  await expect(page.locator('#oh-results')).toHaveClass(/hidden/);

  await page.locator('#oh-clear-button').click();
  await expect(page.locator('#oh-v')).toHaveValue('');
  await expect(page.locator('#oh-error')).toHaveText('');
});

test('オーム計算: 合成抵抗を直列・並列で求める', async ({ page }) => {
  await page.goto(PATH);

  await page.locator('#sp-input').fill('1k, 1k');
  await expect(page.locator('#sp-series')).toHaveText('2 kΩ');
  await expect(page.locator('#sp-parallel')).toHaveText('500 Ω');

  await page.locator('#sp-input').fill('100, abc');
  await expect(page.locator('#sp-error')).not.toHaveText('');
  await expect(page.locator('#sp-results')).toHaveClass(/hidden/);
});

test('オーム計算: LEDの抵抗値とE24値を求める', async ({ page }) => {
  await page.goto(PATH);

  await page.locator('#led-supply').fill('3.3');
  await page.locator('#led-forward').fill('2');
  await page.locator('#led-current').fill('20m');

  await expect(page.locator('#led-res-resistance')).toHaveText('65 Ω');
  await expect(page.locator('#led-res-standard')).toHaveText('68 Ω');

  await page.locator('#led-supply').fill('1.8');
  await expect(page.locator('#led-error')).toContainText('順電圧');
  await expect(page.locator('#led-results')).toHaveClass(/hidden/);
});

test('オーム計算: 英語版で初期値の結果が表示される', async ({ page }) => {
  await page.goto('/en/tools/ohm-calculator/');

  await expect(page.locator('#oh-res-i')).toHaveText('22.73 mA');
  await expect(page.locator('#sp-series')).toHaveText('650 Ω');
});

test('オーム計算: 初期表示でaxeの違反がない', async ({ page }) => {
  for (const path of [PATH, '/en/tools/ohm-calculator/']) {
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
