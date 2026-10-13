import { test, expect } from './helpers/test';

test.describe('モールス信号変換', () => {
  test('欧文: 文字をモールス信号に変換し、単語を / で区切る', async ({
    page,
  }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-input').fill('SOS HI');
    await expect(page.locator('#morse-output')).toHaveValue(
      '... --- ... / .... ..',
    );
  });

  test('表記と単語区切りを切り替えられる', async ({ page }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-input').fill('A B');
    await page.locator('#morse-symbol [data-value="fullwidth"]').click();
    await expect(page.locator('#morse-output')).toHaveValue('・－ / －・・・');
    await page.locator('#morse-separator [data-value="space"]').click();
    await expect(page.locator('#morse-output')).toHaveValue('・－   －・・・');
  });

  test('和文: 濁点を別の符号として付け、変換できない文字を明示する', async ({
    page,
  }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-code [data-value="wabun"]').click();
    await page.locator('#morse-input').fill('ガ猫');
    await expect(page.locator('#morse-output')).toHaveValue('.-.. .. □');
    await expect(page.locator('#morse-warning')).toContainText('猫');
  });

  test('解読: モールス信号を文字に戻し、解読できない符号を示す', async ({
    page,
  }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-mode [data-value="decode"]').click();
    await page.locator('#morse-input').fill('.... .. / .-.-.-.-.-');
    await expect(page.locator('#morse-output')).toHaveValue('HI □');
    await expect(page.locator('#morse-warning')).toContainText('.-.-.-.-.-');
  });

  test('入力と出力を入れ替えると、変換の向きが反転する', async ({ page }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-input').fill('SOS');
    await page.locator('#morse-swap-button').click();
    await expect(page.locator('#morse-input')).toHaveValue('... --- ...');
    await expect(page.locator('#morse-output')).toHaveValue('SOS');
  });

  test('再生ボタンで開始・停止が切り替わる', async ({ page }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-input').fill('SOS');
    const play = page.locator('#morse-play-button');
    await play.click();
    await expect(play).toHaveText('停止');
    await play.click();
    await expect(play).toHaveText('再生');
  });

  test('光で再生すると表示が点滅し、速度が抑えられる', async ({ page }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-input').fill('E');
    await page.locator('#morse-use-light').check();
    await expect(page.locator('#morse-lamp')).toBeVisible();
    await page.evaluate(() => {
      const lamp = document.getElementById('morse-lamp')!;
      const w = window as unknown as { __lampOn: boolean };
      w.__lampOn = false;
      new MutationObserver(() => {
        if (lamp.dataset.on === 'true') w.__lampOn = true;
      }).observe(lamp, { attributes: true });
    });
    await page.locator('#morse-play-button').click();
    await expect(page.locator('#morse-play-status')).toContainText('7 WPM');
    await page.waitForFunction(
      () => (window as unknown as { __lampOn: boolean }).__lampOn,
    );
  });

  test('音も光も選ばないと再生せずに案内する', async ({ page }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-input').fill('E');
    await page.locator('#morse-use-sound').uncheck();
    await page.locator('#morse-play-button').click();
    await expect(page.locator('#morse-play-status')).toContainText('選んで');
    await expect(page.locator('#morse-play-button')).toHaveText('再生');
  });

  test('英語版で表示できる', async ({ page }) => {
    await page.goto('/en/tools/morse-code-converter/');
    await expect(page.locator('main h1')).toContainText('Morse Code');
    await page.locator('#morse-input').fill('HELLO');
    await expect(page.locator('#morse-output')).toHaveValue(
      '.... . .-.. .-.. ---',
    );
  });
});

test.describe('モールス信号: 音・光・復元（追加）', () => {
  test('音の再生は AudioContext のオシレーターを開始し、既定の 600Hz で鳴らす', async ({
    page,
  }) => {
    // 実音は検証できないので、AudioContext を記録用の偽物に差し替える
    await page.addInitScript(() => {
      const audio = { oscillators: 0, freq: -1 };
      (window as unknown as { __audio: typeof audio }).__audio = audio;
      class Param {
        value = 0;
        setValueAtTime() {}
        linearRampToValueAtTime() {}
        setTargetAtTime() {}
      }
      class FreqParam {
        set value(v: number) {
          audio.freq = v;
        }
        get value() {
          return audio.freq;
        }
        setValueAtTime() {}
      }
      class Node {
        connect<T>(n: T) {
          return n;
        }
        disconnect() {}
      }
      class Gain extends Node {
        gain = new Param();
      }
      class Osc extends Node {
        frequency = new FreqParam();
        type = 'sine';
        constructor() {
          super();
          audio.oscillators++;
        }
        start() {}
        stop() {}
      }
      class FakeAudioContext {
        state = 'running';
        currentTime = 0;
        destination = new Node();
        createGain() {
          return new Gain();
        }
        createOscillator() {
          return new Osc();
        }
        resume() {
          return Promise.resolve();
        }
      }
      (window as unknown as { AudioContext: unknown }).AudioContext =
        FakeAudioContext;
    });
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-input').fill('SOS HELP');
    const play = page.locator('#morse-play-button');
    await play.click();
    await expect(play).toHaveText('停止');
    const audio = await page.evaluate(
      () =>
        (
          window as unknown as {
            __audio: { oscillators: number; freq: number };
          }
        ).__audio,
    );
    expect(audio.oscillators).toBe(1);
    expect(audio.freq).toBe(600);
    await play.click();
    await expect(play).toHaveText('再生');
  });

  test('入力は再読み込みで復元される', async ({ page }) => {
    await page.goto('/tools/morse-code-converter/');
    await page.locator('#morse-input').fill('SOS');
    await expect
      .poll(() =>
        page.evaluate(() =>
          sessionStorage.getItem('nyanko:input:morse-code-converter'),
        ),
      )
      .toContain('SOS');
    await page.reload();
    await expect(page.locator('#morse-input')).toHaveValue('SOS');
    await expect(page.locator('#morse-output')).toHaveValue('... --- ...');
  });
});

test.describe('モールス信号: 動きを減らす設定', () => {
  test.use({ reducedMotion: 'reduce' });

  test('光の選択が無効になり、注記が出る', async ({ page }) => {
    await page.goto('/tools/morse-code-converter/');
    await expect(page.locator('#morse-use-light')).toBeDisabled();
    await expect(page.locator('#morse-use-light')).not.toBeChecked();
    await expect(page.locator('#morse-reduced-motion')).toBeVisible();
  });
});
