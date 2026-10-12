import { test, expect, type Page } from './helpers/test';

const PAGES = {
  ja: '/tools/game-of-life/',
  en: '/en/tools/game-of-life/',
} as const;

/** 盤面（標準 50×30）のセル (x, y) の中心をクリックする */
async function clickCell(page: Page, x: number, y: number) {
  const box = await page.locator('#gl-canvas').boundingBox();
  if (!box) throw new Error('canvas not found');
  await page.mouse.click(
    box.x + ((x + 0.5) / 50) * box.width,
    box.y + ((y + 0.5) / 30) * box.height,
  );
}

const population = (page: Page) =>
  page.locator('#gl-population').innerText().then(Number);
const generation = (page: Page) =>
  page.locator('#gl-generation').innerText().then(Number);

for (const locale of ['ja', 'en'] as const) {
  test.describe(`ライフゲーム (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(PAGES[locale]);
      await expect(page.locator('#gl-canvas')).toBeVisible();
    });

    test('初期状態は空の盤面で、世代0・生きているセル0', async ({ page }) => {
      expect(await generation(page)).toBe(0);
      expect(await population(page)).toBe(0);
      await expect(page.locator('#gl-canvas')).toHaveAttribute(
        'aria-label',
        /50/,
      );
    });

    test('クリックでセルが生き、もう一度クリックすると消える', async ({
      page,
    }) => {
      await clickCell(page, 10, 10);
      expect(await population(page)).toBe(1);
      await clickCell(page, 10, 10);
      expect(await population(page)).toBe(0);
    });

    test('ドラッグで連続してセルを置ける', async ({ page }) => {
      const box = await page.locator('#gl-canvas').boundingBox();
      if (!box) throw new Error('canvas not found');
      const y = box.y + (10.5 / 30) * box.height;
      await page.mouse.move(box.x + (5.5 / 50) * box.width, y);
      await page.mouse.down();
      await page.mouse.move(box.x + (9.5 / 50) * box.width, y, { steps: 10 });
      await page.mouse.up();
      expect(await population(page)).toBe(5);
    });

    test('生きたセルの上からドラッグすると、通ったセルが消える', async ({
      page,
    }) => {
      const box = await page.locator('#gl-canvas').boundingBox();
      if (!box) throw new Error('canvas not found');
      const y = box.y + (10.5 / 30) * box.height;
      await page.mouse.move(box.x + (5.5 / 50) * box.width, y);
      await page.mouse.down();
      await page.mouse.move(box.x + (9.5 / 50) * box.width, y, { steps: 10 });
      await page.mouse.up();
      expect(await population(page)).toBe(5);
      await page.mouse.move(box.x + (5.5 / 50) * box.width, y);
      await page.mouse.down();
      await page.mouse.move(box.x + (9.5 / 50) * box.width, y, { steps: 10 });
      await page.mouse.up();
      expect(await population(page)).toBe(0);
    });

    test('プリセットを置いて1コマ進めると世代が進む', async ({ page }) => {
      await page.locator('#gl-preset').selectOption('blinker');
      expect(await population(page)).toBe(3);
      await expect(page.locator('#gl-preset')).toHaveValue('');
      await page.locator('#gl-step-button').click();
      expect(await generation(page)).toBe(1);
      expect(await population(page)).toBe(3);
    });

    test('再生すると世代が進み、一時停止で止まる', async ({ page }) => {
      await page.locator('#gl-preset').selectOption('glider');
      const play = page.locator('#gl-play-button');
      const labelBefore = await play.innerText();
      await play.click();
      expect(await play.innerText()).not.toBe(labelBefore);
      await expect.poll(() => generation(page)).toBeGreaterThan(2);
      await play.click();
      expect(await play.innerText()).toBe(labelBefore);
      const stopped = await generation(page);
      await page.waitForTimeout(400);
      expect(await generation(page)).toBe(stopped);
    });

    test('全滅すると再生が自動で止まり、メッセージが出る', async ({ page }) => {
      await clickCell(page, 10, 10);
      const play = page.locator('#gl-play-button');
      const label = await play.innerText();
      await play.click();
      await expect(page.locator('#gl-status')).not.toHaveText('');
      expect(await play.innerText()).toBe(label);
      expect(await population(page)).toBe(0);
    });

    test('変化しなくなると再生が自動で止まる', async ({ page }) => {
      // 2×2 のブロック（静物）
      await clickCell(page, 10, 10);
      await clickCell(page, 11, 10);
      await clickCell(page, 10, 11);
      await clickCell(page, 11, 11);
      await page.locator('#gl-play-button').click();
      await expect(page.locator('#gl-status')).not.toHaveText('');
      expect(await population(page)).toBe(4);
      expect(await generation(page)).toBe(0);
    });

    test('クリアで盤面と世代がリセットされる', async ({ page }) => {
      await page.locator('#gl-preset').selectOption('pulsar');
      await page.locator('#gl-step-button').click();
      await page.locator('#gl-clear-button').click();
      expect(await generation(page)).toBe(0);
      expect(await population(page)).toBe(0);
    });

    test('ランダム配置でセルが置かれる', async ({ page }) => {
      await page.locator('#gl-random-button').click();
      expect(await population(page)).toBeGreaterThan(0);
    });

    test('盤面サイズを変えると盤面が空になり、aria-labelに反映される', async ({
      page,
    }) => {
      await page.locator('#gl-preset').selectOption('glider');
      await page.locator('[data-size="large"]').click();
      await expect(page.locator('[data-size="large"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(await population(page)).toBe(0);
      await expect(page.locator('#gl-canvas')).toHaveAttribute(
        'aria-label',
        /80/,
      );
    });

    test('小さい盤面にガンを置くと標準に広げられる', async ({ page }) => {
      await page.locator('[data-size="small"]').click();
      await page.locator('#gl-preset').selectOption('gosperGun');
      await expect(page.locator('[data-size="medium"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.locator('#gl-canvas')).toHaveAttribute(
        'aria-label',
        /50/,
      );
      expect(await population(page)).toBe(36);
    });

    test('速さを変えると表示が更新される', async ({ page }) => {
      const out = page.locator('#gl-speed-out');
      const before = await out.innerText();
      await page.locator('#gl-speed').fill('20');
      expect(await out.innerText()).not.toBe(before);
      expect(await out.innerText()).toContain('20');
    });

    test('端をつなげると壁際のパターンが反対側に現れる', async ({ page }) => {
      // 左端の縦3つ（ブリンカー）。ループありなら右端 (49, 10) にもセルが生まれる
      for (const y of [9, 10, 11]) await clickCell(page, 0, y);
      await page.locator('#gl-wrap').check();
      await page.locator('#gl-step-button').click();
      expect(await population(page)).toBe(3);
      await page.locator('#gl-clear-button').click();
      for (const y of [9, 10, 11]) await clickCell(page, 0, y);
      await page.locator('#gl-wrap').uncheck();
      await page.locator('#gl-step-button').click();
      // 壁ありでは左端の縦3つは (0,10) と (1,10) の2つになる
      expect(await population(page)).toBe(2);
    });
  });
}
