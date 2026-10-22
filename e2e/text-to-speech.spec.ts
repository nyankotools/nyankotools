import { test, expect } from './helpers/test';

// 音声合成はヘッドレス環境依存のため、window.speechSynthesis を差し替えて検証する
// addInitScript は関数をソースとしてページへ送るため、外側の変数は参照できない（引数で渡す）
const mockSpeech = (withLocal: boolean) => {
  const voices = [
    {
      name: 'Cloud JA',
      lang: 'ja-JP',
      voiceURI: 'cloud-ja',
      localService: false,
    },
    ...(withLocal
      ? [
          {
            name: 'Local JA',
            lang: 'ja-JP',
            voiceURI: 'local-ja',
            localService: true,
          },
          {
            name: 'Local EN',
            lang: 'en-US',
            voiceURI: 'local-en',
            localService: true,
          },
        ]
      : []),
  ];
  const spoken: { text: string; voice: string | undefined }[] = [];
  (window as unknown as { __spoken: typeof spoken }).__spoken = spoken;
  class FakeUtterance {
    text: string;
    voice: { voiceURI: string } | null = null;
    onend: (() => void) | null = null;
    onerror: ((e: { error: string }) => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  }
  const fake = {
    speaking: false,
    getVoices: () => voices,
    addEventListener: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    speak: (u: FakeUtterance) => {
      spoken.push({ text: u.text, voice: u.voice?.voiceURI });
      const flags = window as unknown as { __hold?: boolean; __fail?: boolean };
      // __fail: エラー復帰の検証用 / __hold: 発話を終わらせず一時停止・停止の状態遷移を検証する
      if (flags.__fail) {
        u.onerror?.({ error: 'network' });
        return;
      }
      if (!flags.__hold) setTimeout(() => u.onend?.(), 0);
    },
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fake });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    value: FakeUtterance,
  });
};

test.describe('テキスト読み上げ', () => {
  test('ローカル音声だけが一覧に出て、選んだ声で文ごとに読み上げる', async ({
    page,
  }) => {
    await page.addInitScript(mockSpeech, true);
    await page.goto('/tools/text-to-speech/');

    const options = page.locator('#tts-voice option');
    await expect(options).toHaveCount(2);
    await expect(options.first()).toContainText('Local JA');
    await expect(page.locator('#tts-voice')).not.toContainText('Cloud JA');

    await page.locator('#tts-text').fill('一つ目。二つ目。');
    await page.locator('#tts-speak-button').click();

    await expect(page.locator('#tts-status')).toHaveText(
      '読み上げが終わりました',
    );
    const spoken = await page.evaluate(
      () => (window as unknown as { __spoken: unknown }).__spoken,
    );
    expect(spoken).toEqual([
      { text: '一つ目。', voice: 'local-ja' },
      { text: '二つ目。', voice: 'local-ja' },
    ]);
  });

  test('テキストが空ならエラーを表示して読み上げない', async ({ page }) => {
    await page.addInitScript(mockSpeech, true);
    await page.goto('/tools/text-to-speech/');
    await expect(page.locator('#tts-voice option')).toHaveCount(2);

    await page.locator('#tts-speak-button').click();
    await expect(page.locator('#tts-error')).toHaveText(
      'テキストを入力してください',
    );
  });

  test('ローカル音声が無い環境ではクラウド音声を使わず案内を出す', async ({
    page,
  }) => {
    await page.addInitScript(mockSpeech, false);
    await page.goto('/tools/text-to-speech/');

    await expect(page.locator('#tts-no-voice')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#tts-speak-button')).toBeDisabled();
    await expect(page.locator('#tts-voice')).not.toContainText('Cloud JA');
  });

  test('音声合成に未対応のブラウザでは案内を出す', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'speechSynthesis', { value: undefined });
      // 'speechSynthesis' in window を偽にするため削除を試みる
      delete (window as unknown as Record<string, unknown>).speechSynthesis;
    });
    await page.goto('/en/tools/text-to-speech/');
    await expect(page.locator('#tts-unsupported')).toBeVisible();
  });

  test('一時停止・再開・停止でボタンの有効/無効が遷移し、停止後も再度読み上げられる', async ({
    page,
  }) => {
    await page.addInitScript(mockSpeech, true);
    await page.goto('/tools/text-to-speech/');
    await expect(page.locator('#tts-voice option')).toHaveCount(2);

    const speakBtn = page.locator('#tts-speak-button');
    const pauseBtn = page.locator('#tts-pause-button');
    const resumeBtn = page.locator('#tts-resume-button');
    const stopBtn = page.locator('#tts-stop-button');

    await page.evaluate(() => {
      (window as unknown as { __hold: boolean }).__hold = true;
    });
    await page.locator('#tts-text').fill('一つ目。二つ目。');
    await speakBtn.click();
    await expect(speakBtn).toBeDisabled();
    await expect(pauseBtn).toBeEnabled();
    await expect(resumeBtn).toBeDisabled();
    await expect(stopBtn).toBeEnabled();

    await pauseBtn.click();
    await expect(pauseBtn).toBeDisabled();
    await expect(resumeBtn).toBeEnabled();

    await resumeBtn.click();
    await expect(pauseBtn).toBeEnabled();
    await expect(resumeBtn).toBeDisabled();

    await stopBtn.click();
    await expect(speakBtn).toBeEnabled();
    await expect(pauseBtn).toBeDisabled();
    await expect(resumeBtn).toBeDisabled();
    await expect(stopBtn).toBeDisabled();
    await expect(page.locator('#tts-status')).toBeEmpty();

    // 停止後に読み上げ直すと、最後まで読み上げて完了表示になる
    await page.evaluate(() => {
      (window as unknown as { __hold: boolean }).__hold = false;
    });
    await speakBtn.click();
    await expect(page.locator('#tts-status')).toHaveText(
      '読み上げが終わりました',
    );
    await expect(speakBtn).toBeEnabled();
  });

  test('読み上げ中のエラーはエラー表示にし、ボタンを読み上げ可能な状態へ戻す', async ({
    page,
  }) => {
    await page.addInitScript(mockSpeech, true);
    await page.goto('/tools/text-to-speech/');
    await expect(page.locator('#tts-voice option')).toHaveCount(2);

    await page.evaluate(() => {
      (window as unknown as { __fail: boolean }).__fail = true;
    });
    await page.locator('#tts-text').fill('エラーになる文。');
    await page.locator('#tts-speak-button').click();

    await expect(page.locator('#tts-error')).toHaveText(
      '読み上げ中にエラーが発生しました',
    );
    await expect(page.locator('#tts-speak-button')).toBeEnabled();
    await expect(page.locator('#tts-pause-button')).toBeDisabled();
    await expect(page.locator('#tts-stop-button')).toBeDisabled();
  });

  test('英語版が表示される', async ({ page }) => {
    await page.addInitScript(mockSpeech, true);
    await page.goto('/en/tools/text-to-speech/');
    await expect(page.locator('main h1')).toHaveText(
      'Text to Speech (Built-in Browser Voices)',
    );
    await expect(page.locator('#tts-voice option').first()).toContainText(
      'Local EN',
    );
  });
});
