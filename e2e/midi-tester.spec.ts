import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

const FAKE_MIDI = `
  (() => {
    const input = {
      id: 'in1', name: 'Fake Keyboard', manufacturer: 'Acme', type: 'input',
      state: 'connected', onmidimessage: null,
    };
    const sent = [];
    const output = {
      id: 'out1', name: 'Fake Synth', manufacturer: 'Acme', type: 'output',
      state: 'connected', send: (d) => sent.push(Array.from(d)),
    };
    const access = {
      inputs: new Map([['in1', input]]),
      outputs: new Map([['out1', output]]),
      onstatechange: null,
    };
    window.__fakeMidi = {
      input, sent,
      emit: (bytes) => input.onmidimessage({ data: new Uint8Array(bytes) }),
    };
    navigator.requestMIDIAccess = () => Promise.resolve(access);
  })();
`;

test.describe('MIDIデバイステスター', () => {
  test('初期表示: 案内・空のログ・送信欄は非表示', async ({ page }) => {
    await page.goto('/tools/midi-tester/');
    await expect(page.locator('#mt-connect-button')).toBeVisible();
    await expect(page.locator('#mt-status')).toContainText('MIDI機器に接続');
    await expect(page.locator('#mt-log-empty')).toBeVisible();
    await expect(page.locator('#mt-send')).toBeHidden();
    await expect(page.locator('#mt-error')).toBeHidden();
  });

  test('Web MIDI未対応のブラウザでは未対応の旨を表示する', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        value: undefined,
        configurable: true,
      });
    });
    await page.goto('/tools/midi-tester/');
    await page.locator('#mt-connect-button').click();
    await expect(page.locator('#mt-error')).toContainText('Web MIDI');
  });

  test('擬似MIDI機器: ポート表示・メッセージのログ・テストノート送信', async ({
    page,
  }) => {
    await page.addInitScript(FAKE_MIDI);
    await page.goto('/tools/midi-tester/');
    await page.locator('#mt-connect-button').click();
    await expect(page.locator('#mt-inputs')).toContainText('Fake Keyboard');
    await expect(page.locator('#mt-outputs')).toContainText('Fake Synth');
    await expect(page.locator('#mt-send')).toBeVisible();

    await page.evaluate(() => {
      const m = (
        window as unknown as { __fakeMidi: { emit: (b: number[]) => void } }
      ).__fakeMidi;
      m.emit([0x90, 60, 100]);
      m.emit([0xb0, 64, 127]);
      m.emit([0xf8]);
    });
    const rows = page.locator('#mt-log li');
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText('CC64');
    await expect(rows.nth(1)).toContainText('C4');
    await expect(rows.nth(1)).toContainText('90 3C 64');

    await page.locator('#mt-show-clock').check();
    await page.evaluate(() => {
      (
        window as unknown as { __fakeMidi: { emit: (b: number[]) => void } }
      ).__fakeMidi.emit([0xf8]);
    });
    await expect(rows).toHaveCount(3);

    await page.locator('#mt-send-button').click();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as unknown as { __fakeMidi: { sent: number[][] } })
              .__fakeMidi.sent.length,
        ),
      )
      .toBe(2);

    await page.locator('#mt-clear-button').click();
    await expect(rows).toHaveCount(0);
    await expect(page.locator('#mt-log-empty')).toBeVisible();
  });

  test('ログは200件で頭打ちになる', async ({ page }) => {
    await page.addInitScript(FAKE_MIDI);
    await page.goto('/tools/midi-tester/');
    await page.locator('#mt-connect-button').click();
    await expect(page.locator('#mt-send')).toBeVisible();
    await page.evaluate(() => {
      const m = (
        window as unknown as { __fakeMidi: { emit: (b: number[]) => void } }
      ).__fakeMidi;
      for (let i = 0; i < 250; i++) m.emit([0x90, i % 128, 1 + (i % 100)]);
    });
    await expect(page.locator('#mt-log li')).toHaveCount(200);
  });

  test('初期表示と接続後の表示でaxeの違反がない', async ({ page }) => {
    await page.addInitScript(FAKE_MIDI);
    await page.goto('/tools/midi-tester/');
    const check = async () =>
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
      ).violations.map((v) => v.id);
    expect(await check()).toEqual([]);
    await page.locator('#mt-connect-button').click();
    await expect(page.locator('#mt-send')).toBeVisible();
    expect(await check()).toEqual([]);
  });
});

test.describe('MIDI Device Tester (English)', () => {
  test('English page shows the h1 and the empty log', async ({ page }) => {
    await page.goto('/en/tools/midi-tester/');
    await expect(page.locator('main h1')).toContainText('MIDI Device Tester');
    await expect(page.locator('#mt-log-empty')).toBeVisible();
    await expect(page.locator('#mt-send')).toBeHidden();
  });
});
