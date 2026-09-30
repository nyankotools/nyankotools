import { test, expect } from './helpers/test';

// Step 5: 入力欄まわり共通機能（No.169）・入力状態の保持（No.176）・印刷CSS（No.178）

test.describe('入力欄の共通機能（No.169）', () => {
  test('サンプル入力・クリア・文字数が使え、ツールの結果に反映される', async ({
    page,
  }) => {
    await page.goto('/tools/text-case-converter/');
    const input = page.locator('#text-case-input');
    const bar = page.locator('[data-input-helpers]');

    await expect(bar).toContainText('0文字');

    await bar.getByRole('button', { name: 'サンプル入力' }).click();
    await expect(input).toHaveValue('hello world sample_text');
    await expect(bar).toContainText('23文字');
    await expect(page.locator('[data-case="camelCase"]')).toHaveValue(
      'helloWorldSampleText',
    );

    await bar.getByRole('button', { name: 'クリア' }).click();
    await expect(input).toHaveValue('');
    await expect(bar).toContainText('0文字');
  });

  test('英語版はラベルが英語になる', async ({ page }) => {
    await page.goto('/en/tools/text-case-converter/');
    const bar = page.locator('[data-input-helpers]');
    await expect(
      bar.getByRole('button', { name: 'Insert sample' }),
    ).toBeVisible();
    await expect(bar.getByRole('button', { name: 'Clear' })).toBeVisible();
    await expect(bar).toContainText('0 chars');
  });

  test('貼り付けボタンでクリップボードの内容が入力される', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName !== 'chromium',
      'clipboard 権限の付与は chromium のみ',
    );
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/text-case-converter/');
    await page.evaluate(() => navigator.clipboard.writeText('from clipboard'));
    await page
      .locator('[data-input-helpers]')
      .getByRole('button', { name: '貼り付け' })
      .click();
    await expect(page.locator('#text-case-input')).toHaveValue(
      'from clipboard',
    );
  });

  test('文字数ツールでは文字数表示が重複しない（data-no-count）', async ({
    page,
  }) => {
    await page.goto('/tools/char-counter/');
    await expect(page.locator('[data-input-helpers]')).toBeVisible();
    await expect(page.locator('[data-input-helpers]')).not.toContainText(
      '文字',
    );
  });

  test('機微ツールには入力補助を出さない', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');
    await expect(page.locator('[data-tool-page]')).toBeVisible();
    await expect(page.locator('[data-input-helpers]')).toHaveCount(0);
  });
});

test.describe('入力状態の保持（No.176）', () => {
  test('再読み込みと言語切替で入力が引き継がれる', async ({ page }) => {
    await page.goto('/tools/text-case-converter/');
    await page.locator('#text-case-input').fill('keep me');
    // 保存はデバウンスされるので、反映を待ってから再読み込みする（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:text-case-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('keep me');

    await page.reload();
    await expect(page.locator('#text-case-input')).toHaveValue('keep me');
    await expect(page.locator('[data-case="camelCase"]')).toHaveValue('keepMe');

    await page.goto('/en/tools/text-case-converter/');
    await expect(page.locator('#text-case-input')).toHaveValue('keep me');
  });

  test('数値入力も復元される', async ({ page }) => {
    await page.goto('/tools/px-rem-converter/');
    await page.locator('#px-rem-px-input').fill('32');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:px-rem-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('32');
    await page.reload();
    await expect(page.locator('#px-rem-px-input')).toHaveValue('32');
  });

  test('?text= の初期値は保存された値より優先される', async ({ page }) => {
    await page.goto('/tools/text-case-converter/');
    await page.locator('#text-case-input').fill('saved');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:text-case-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('saved');

    await page.goto('/tools/text-case-converter/?text=from-url');
    await expect(page.locator('#text-case-input')).toHaveValue('from-url');
  });

  test('機微ツールの入力は保存も復元もされない', async ({ page }) => {
    await page.goto('/tools/jwt-decoder/');
    await page.locator('#jwt-input').fill('secret.token.value');
    // デバウンス時間を待つ（保存されないことを確認）
    await page.waitForTimeout(500);

    const stored = await page.evaluate(() =>
      Object.keys(sessionStorage).filter((k) => k.startsWith('nyanko:input:')),
    );
    expect(stored).toEqual([]);

    await page.reload();
    await expect(page.locator('#jwt-input')).toHaveValue('');
  });
});

test.describe('大きな入力（No.173）', () => {
  test('数万文字の貼り付けでも最終的に結果が反映される', async ({ page }) => {
    await page.goto('/tools/base64/');
    const big = 'a'.repeat(60_000);
    await page.locator('#base64-input').fill(big);
    await expect(page.locator('#base64-output')).not.toHaveValue('', {
      timeout: 5000,
    });
    const output = await page.locator('#base64-output').inputValue();
    expect(output.length).toBeGreaterThan(60_000);
  });
});

test.describe('印刷CSS（No.178）', () => {
  test('印刷時はサイドバー・フッター・シェア欄が消え、本文は残る', async ({
    page,
  }) => {
    await page.goto('/tools/bmi-calculator/');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('#sidebar')).toBeHidden();
    await expect(page.locator('footer')).toBeHidden();
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[data-local-badge]')).toBeHidden();
  });

  test('画面表示ではサイドバー（PC幅）が残る', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/tools/bmi-calculator/');
    await expect(page.locator('#sidebar')).toBeVisible();
  });
});

test.describe('入力状態の保持（連動欄・change・選択系）', () => {
  test('連動欄は、最後に入力した欄の値で復元される（px-rem）', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');
    await page.locator('#px-rem-rem-input').fill('2');
    await page.locator('#px-rem-px-input').fill('48');
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('3');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:px-rem-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('48');

    await page.reload();
    await expect(page.locator('#px-rem-px-input')).toHaveValue('48');
    await expect(page.locator('#px-rem-rem-input')).toHaveValue('3');
  });

  test('change でだけ再計算するツールも、復元後に結果が揃う（lorem-ipsum）', async ({
    page,
  }) => {
    await page.goto('/tools/lorem-ipsum/');
    await page.locator('#lorem-count').fill('7');
    await page.locator('#lorem-count').blur();
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:lorem-ipsum'),
          ),
        { timeout: 5000 },
      )
      .toContain('7');

    await page.reload();
    await expect(page.locator('#lorem-count')).toHaveValue('7');
    // 復元で change が発火し、件数 7 で再生成されている
    const output = await page.locator('#lorem-output').inputValue();
    expect(output.split(/\n+/).filter(Boolean)).toHaveLength(7);
  });

  test('ラジオ・チェックボックスの選択も復元される（lorem-ipsum）', async ({
    page,
  }) => {
    await page.goto('/tools/lorem-ipsum/');
    await page.locator('#lorem-unit-sentences').check();
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:lorem-ipsum'),
          ),
        { timeout: 5000 },
      )
      .toContain('lorem-unit-sentences');
    await page.reload();
    await expect(page.locator('#lorem-unit-sentences')).toBeChecked();
  });

  test('前回の復元が完了しなかった場合は、保存内容を使わず素の状態で開く', async ({
    page,
  }) => {
    await page.goto('/tools/text-case-converter/');
    await page.locator('#text-case-input').fill('boom');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:text-case-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('boom');
    await page.evaluate(() =>
      sessionStorage.setItem('nyanko:restoring:text-case-converter', '1'),
    );
    await page.reload();
    await expect(page.locator('#text-case-input')).toHaveValue('');
    // フラグは消え、次の読み込みからは通常どおり保存・復元される
    await page.locator('#text-case-input').fill('again');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:text-case-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('again');
    await page.reload();
    await expect(page.locator('#text-case-input')).toHaveValue('again');
  });

  test('QR生成の入力は保存しない', async ({ page }) => {
    await page.goto('/tools/qr-generator/');
    await page.locator('#qr-generator-input').fill('wifi-password');
    // デバウンス時間を待つ（保存されないことを確認）
    await page.waitForTimeout(500);
    await page.reload();
    await expect(page.locator('#qr-generator-input')).toHaveValue('');
  });
});

test.describe('入力状態の保持（レビュー再指摘）', () => {
  test('丸めを伴う連動欄でも、最後に入力した値のまま復元される（基準14・px 13）', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');
    await page.locator('#px-rem-base-input').fill('14');
    await page.locator('#px-rem-px-input').fill('13');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:px-rem-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('13');

    await page.reload();
    await expect(page.locator('#px-rem-base-input')).toHaveValue('14');
    await expect(page.locator('#px-rem-px-input')).toHaveValue('13');
  });

  test('JSが入れる「現在時刻」の既定値は、触っていなければ保存されない（cron）', async ({
    page,
  }) => {
    await page.goto('/tools/cron-parser/');
    const base = page.locator('#cron-base-datetime');
    const initialBase = await base.inputValue();
    await page.locator('#cron-input').fill('*/5 * * * *');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:cron-parser'),
          ),
        { timeout: 5000 },
      )
      .toContain('cron-input');

    const saved = await page.evaluate(() =>
      sessionStorage.getItem('nyanko:input:cron-parser'),
    );
    expect(saved).toContain('cron-input');
    expect(saved).not.toContain('cron-base-datetime');
    expect(initialBase).not.toBe('');

    await page.reload();
    await expect(page.locator('#cron-input')).toHaveValue('*/5 * * * *');
  });

  test('id の無いラジオも復元される（ratio-calculator の未知数）', async ({
    page,
  }) => {
    await page.goto('/tools/ratio-calculator/');
    await page.locator('input[name="proportion-unknown"][value="a"]').check();
    await page.locator('#proportion-input-b').fill('2');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:ratio-calculator'),
          ),
        { timeout: 5000 },
      )
      .toContain('2');

    await page.reload();
    await expect(
      page.locator('input[name="proportion-unknown"][value="a"]'),
    ).toBeChecked();
    await expect(page.locator('#proportion-input-b')).toHaveValue('2');
  });

  test('復元中フラグは、通常の入力では読み込み後すぐに消える', async ({
    page,
  }) => {
    await page.goto('/tools/text-case-converter/');
    await page.locator('#text-case-input').fill('abc');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:text-case-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('abc');
    await page.reload();
    const flag = await page.evaluate(() =>
      sessionStorage.getItem('nyanko:restoring:text-case-converter'),
    );
    expect(flag).toBeNull();
  });
});

test.describe('入力状態の保持（QA再指摘）', () => {
  test('最後に打った値が既定値と同じでも、復元後にその値のまま（px-rem 基準14・px16）', async ({
    page,
  }) => {
    await page.goto('/tools/px-rem-converter/');
    await page.locator('#px-rem-base-input').fill('14');
    await page.locator('#px-rem-px-input').fill('16');
    // 保存されるまで待つ（自動リトライ）
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            sessionStorage.getItem('nyanko:input:px-rem-converter'),
          ),
        { timeout: 5000 },
      )
      .toContain('16');
    await page.reload();
    await expect(page.locator('#px-rem-px-input')).toHaveValue('16');
  });

  test('OSがダークでも、印刷ではフォーム部品がライトの配色になる', async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/tools/tax-calculator/');
    await page.emulateMedia({ media: 'print' });
    const scheme = await page.evaluate(
      () => getComputedStyle(document.documentElement).colorScheme,
    );
    expect(scheme).toBe('light');
    await context.close();
  });

  test('トップページのお気に入りボタンは印刷に出ない', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('[data-favorite-toggle]').first()).toBeHidden();
  });

  test('text-diff: 数万行同士で全行が違ってもエラートーストを出さない', async ({
    page,
  }) => {
    await page.goto('/tools/text-diff/');
    await page.evaluate(() => {
      const [a, b] = document.querySelectorAll<HTMLTextAreaElement>(
        '[data-tool-page] textarea',
      );
      const gen = (p: string) =>
        Array.from({ length: 40000 }, (_, i) => p + i).join('\n');
      a.value = gen('L');
      b.value = gen('R');
      a.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(page.locator('#error-toast')).toBeHidden();
    await expect(page.locator('main')).toContainText('40000');
  });
});
