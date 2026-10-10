import { test, expect } from './helpers/test';

test.describe('メトロノーム・BPM測定', () => {
  test('初期表示: 120 BPM・4拍・停止中', async ({ page }) => {
    await page.goto('/tools/metronome-bpm/');

    await expect(page.locator('main h1')).toContainText('メトロノーム');
    await expect(page.locator('#met-bpm')).toHaveValue('120');
    await expect(page.locator('#met-beats')).toHaveValue('4');
    await expect(page.locator('#met-toggle-button')).toHaveText('開始');
    await expect(page.locator('#met-toggle-button')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(page.locator('#met-dots [data-dot]:visible')).toHaveCount(4);
  });

  test('テンポ入力・スライダー・±ボタンが連動し、範囲に収まる', async ({
    page,
  }) => {
    await page.goto('/tools/metronome-bpm/');
    const bpm = page.locator('#met-bpm');
    const slider = page.locator('#met-bpm-slider');

    await bpm.fill('90');
    await expect(slider).toHaveValue('90');

    await page.locator('#met-bpm-up').click();
    await expect(bpm).toHaveValue('91');
    await page.locator('#met-bpm-down').click();
    await page.locator('#met-bpm-down').click();
    await expect(bpm).toHaveValue('89');

    await bpm.fill('999');
    await bpm.blur();
    await expect(bpm).toHaveValue('300');
    await bpm.fill('3');
    await bpm.blur();
    await expect(bpm).toHaveValue('20');
  });

  test('拍子を変えると拍の表示数が変わる', async ({ page }) => {
    await page.goto('/tools/metronome-bpm/');
    await page.locator('#met-beats').selectOption('7');
    await expect(page.locator('#met-dots [data-dot]:visible')).toHaveCount(7);
  });

  test('開始・停止でボタン表記が切り替わり、拍がハイライトされる', async ({
    page,
  }) => {
    await page.goto('/tools/metronome-bpm/');
    const toggle = page.locator('#met-toggle-button');

    await toggle.click();
    await expect(toggle).toHaveText('停止');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#met-dots [data-active="true"]')).toHaveCount(1);

    await toggle.click();
    await expect(toggle).toHaveText('開始');
    await expect(page.locator('#met-dots [data-active="true"]')).toHaveCount(0);
  });

  test('再生中にBPMを打ち直しても音が止まらず、途中入力の値は反映されない', async ({
    page,
  }) => {
    await page.goto('/tools/metronome-bpm/');
    // 打音の生成回数を数えて、再生が続いているかを確かめる（実音は検証できないため）
    await page.evaluate(() => {
      const w = window as unknown as { __oscCount: number };
      w.__oscCount = 0;
      const original = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function (this: AudioContext) {
        w.__oscCount++;
        return original.call(this);
      };
    });
    const count = () =>
      page.evaluate(
        () => (window as unknown as { __oscCount: number }).__oscCount,
      );
    const toggle = page.locator('#met-toggle-button');
    const bpm = page.locator('#met-bpm');

    await toggle.click();
    await expect(toggle).toHaveText('停止');

    // 1桁・2桁の途中入力（"1" "15"）で 20 BPM に確定して止まらないこと
    await bpm.fill('');
    await bpm.pressSequentially('150');
    await expect(bpm).toHaveValue('150');
    await expect(page.locator('#met-term')).toContainText('Allegro');

    const before = await count();
    await page.waitForTimeout(1000);
    expect(await count()).toBeGreaterThan(before);
    await expect(toggle).toHaveText('停止');

    // 停止後は新しい打音が生成されない
    await toggle.click();
    await expect(toggle).toHaveText('開始');
    const stopped = await count();
    await page.waitForTimeout(500);
    expect(await count()).toBe(stopped);
  });

  test('タップテンポで BPM が測定され、リセットできる', async ({ page }) => {
    await page.goto('/tools/metronome-bpm/');
    const tap = page.locator('#met-tap');
    const result = page.locator('#met-tap-result');

    await expect(result).toContainText('まだタップされていません');
    await tap.click();
    await expect(result).toContainText('もう一度');

    // 約 500ms 間隔 = 約 120 BPM
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(500);
      await tap.click();
    }
    await expect(result).toContainText('4回の平均');
    const value = Number(await page.locator('#met-bpm').inputValue());
    expect(value).toBeGreaterThanOrEqual(100);
    expect(value).toBeLessThanOrEqual(130);

    await page.locator('#met-tap-reset').click();
    await expect(result).toContainText('まだタップされていません');
  });

  test('英語版で表示できる', async ({ page }) => {
    await page.goto('/en/tools/metronome-bpm/');
    await expect(page.locator('main h1')).toContainText('Metronome');
    await expect(page.locator('#met-toggle-button')).toHaveText('Start');
    await page.locator('#met-toggle-button').click();
    await expect(page.locator('#met-toggle-button')).toHaveText('Stop');
  });
});
