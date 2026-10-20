import { test, expect } from './helpers/test';

// Chromium のフェイクデバイスで getUserMedia の実処理を通す。
test.use({
  permissions: ['microphone'],
  launchOptions: {
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
    ],
  },
});

/** マイクの代わりに、指定周波数の正弦波ストリームを返すようにする */
async function fakeMicTone(
  page: import('@playwright/test').Page,
  frequency: number,
) {
  await page.addInitScript((f) => {
    navigator.mediaDevices.getUserMedia = async () => {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      const gain = ctx.createGain();
      gain.gain.value = 0.5;
      const dest = ctx.createMediaStreamDestination();
      osc.connect(gain).connect(dest);
      osc.start();
      return dest.stream;
    };
  }, frequency);
}

test.describe('楽器チューナー', () => {
  test('初期表示: ギター標準・停止中で、開始するとパネルが出て停止で戻る', async ({
    page,
  }) => {
    await page.goto('/tools/instrument-tuner/');
    await expect(page.locator('main h1')).toContainText('楽器チューナー');
    await expect(page.locator('#tun-instrument')).toHaveValue('guitar');
    await expect(page.locator('#tun-a4')).toHaveValue('440');
    await expect(page.locator('#tun-panel')).toBeHidden();

    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-panel')).toBeVisible();
    await expect(page.locator('#tun-error')).toBeHidden();
    await expect(page.locator('#tun-strings button')).toHaveCount(6);

    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-panel')).toBeHidden();
  });

  test('110Hz（A2）の音を、A2の弦として検出し「合っています」と表示する', async ({
    page,
  }) => {
    await fakeMicTone(page, 110);
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-toggle').click();

    await expect(page.locator('#tun-note')).toHaveText('A2');
    await expect(page.locator('#tun-state')).toHaveText('合っています');
    await expect(
      page.locator('#tun-strings button[data-target="true"]'),
    ).toHaveText('A2');
  });

  test('少し高い音（115Hz）は A2 として「高い」と表示する', async ({
    page,
  }) => {
    // 115Hz は A2(110Hz) より約 +77 セント（A2 の弦が最も近い）
    await fakeMicTone(page, 115);
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-note')).toHaveText('A2');
    await expect(page.locator('#tun-state')).toContainText('高い');
  });

  test('楽器を切り替えると弦ボタンが変わり、半音階では弦が出ない', async ({
    page,
  }) => {
    await fakeMicTone(page, 110);
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-strings-wrap')).toBeVisible();

    await page.locator('#tun-instrument').selectOption('ukulele');
    await expect(page.locator('#tun-strings button')).toHaveText([
      'G4',
      'C4',
      'E4',
      'A4',
    ]);
    await page.locator('#tun-instrument').selectOption('chromatic');
    await expect(page.locator('#tun-strings-wrap')).toBeHidden();
    await expect(page.locator('#tun-panel')).toBeVisible();
  });

  test('半音階モードで 440Hz は A4', async ({ page }) => {
    await fakeMicTone(page, 440);
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-instrument').selectOption('chromatic');
    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-note')).toHaveText('A4');
    await expect(page.locator('#tun-state')).toHaveText('合っています');
  });

  test('基準ピッチ（A4）を変えると、同じ 440Hz のずれ表示が変わる', async ({
    page,
  }) => {
    await fakeMicTone(page, 440);
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-instrument').selectOption('chromatic');
    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-state')).toHaveText('合っています');

    // A4=442 にすると、440Hz は約 -8 セント（低い）になる
    await page.locator('#tun-a4').fill('442');
    await expect(page.locator('#tun-state')).toContainText('低い');
    // 理論値は約 -7.85 セント。検出の誤差を見込んで範囲で確認する
    const cents = Number(await page.locator('#tun-cents').textContent());
    expect(cents).toBeGreaterThan(-9);
    expect(cents).toBeLessThan(-5);
  });

  test('基準ピッチは範囲外の値を 410〜480 に収める', async ({ page }) => {
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-a4').fill('500');
    await page.locator('#tun-a4').dispatchEvent('change');
    await expect(page.locator('#tun-a4')).toHaveValue('480');
  });

  test('弦を手動で固定でき、もう一度押すと自動に戻る', async ({ page }) => {
    // 110Hz（A2）を弾いている状態で、D3 の弦を基準にする
    await fakeMicTone(page, 110);
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-note')).toHaveText('A2');

    const d3 = page.locator('#tun-strings button', { hasText: 'D3' });
    await d3.click();
    await expect(d3).toHaveAttribute('aria-pressed', 'true');
    // 110Hz は D3(146.8Hz) より約 -500 セント → 「低い」
    await expect(page.locator('#tun-note')).toHaveText('D3');
    await expect(page.locator('#tun-state')).toContainText('低い');

    await d3.click();
    await expect(d3).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#tun-note')).toHaveText('A2');
    await expect(page.locator('#tun-state')).toHaveText('合っています');
  });

  test('375px 幅でもパネルと弦ボタンが画面内に収まる', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await fakeMicTone(page, 110);
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-strings button')).toHaveCount(6);

    const meter = await page.locator('#tun-meter').boundingBox();
    expect(meter!.x + meter!.width).toBeLessThanOrEqual(375);
    for (const button of await page.locator('#tun-strings button').all()) {
      const box = await button.boundingBox();
      expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    }
  });

  test('マイクが拒否されるとエラーを表示する', async ({ page }) => {
    await page.addInitScript(() => {
      navigator.mediaDevices.getUserMedia = () =>
        Promise.reject(new DOMException('denied', 'NotAllowedError'));
    });
    await page.goto('/tools/instrument-tuner/');
    await page.locator('#tun-toggle').click();
    await expect(page.locator('#tun-error')).toBeVisible();
    await expect(page.locator('#tun-error')).toContainText('許可');
    await expect(page.locator('#tun-toggle')).toHaveText('マイクを開始');
  });

  test('英語版で表示できる', async ({ page }) => {
    await page.goto('/en/tools/instrument-tuner/');
    await expect(page.locator('main h1')).toContainText('Tuner');
    await expect(page.locator('#tun-toggle')).toHaveText('Start microphone');
  });
});
