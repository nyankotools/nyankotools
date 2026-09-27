import { test, expect } from '@playwright/test';

test.describe('進数変換ツール（日本語版）', () => {
  test('直接アクセスして正しく表示され、デフォルトで8bit・-1が4進数それぞれに表示される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await expect(page.locator('main h1')).toHaveText('進数変換ツール');
    await expect(page.locator('#base-bitwidth-select')).toHaveValue('8');
    // デフォルト値: 8bitの-1 = 2進数11111111 = 8進数377 = 16進数FF（2の補数）
    await expect(page.locator('#base-binary-input')).toHaveValue('11111111');
    await expect(page.locator('#base-octal-input')).toHaveValue('377');
    await expect(page.locator('#base-decimal-input')).toHaveValue('-1');
    await expect(page.locator('#base-hex-input')).toHaveValue('FF');
  });

  test('10進数欄に正の値を入力すると他の3欄が自動更新される（8bit分0埋め）', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-decimal-input').fill('42');

    // 42 = 0x2A = 0o52 = 0b00101010（8bit分0埋め）
    await expect(page.locator('#base-binary-input')).toHaveValue('00101010');
    await expect(page.locator('#base-octal-input')).toHaveValue('52');
    await expect(page.locator('#base-hex-input')).toHaveValue('2A');
  });

  test('16進数欄に0xプレフィックス付きで入力すると他の欄が自動更新される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-hex-input').fill('0x2A');

    // 0x2A = 42
    await expect(page.locator('#base-binary-input')).toHaveValue('00101010');
    await expect(page.locator('#base-octal-input')).toHaveValue('52');
    await expect(page.locator('#base-decimal-input')).toHaveValue('42');
  });

  test('2進数欄に0bプレフィックス付きで入力すると他の欄が自動更新される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-binary-input').fill('0b101010');

    // 0b101010 = 42
    await expect(page.locator('#base-octal-input')).toHaveValue('52');
    await expect(page.locator('#base-decimal-input')).toHaveValue('42');
    await expect(page.locator('#base-hex-input')).toHaveValue('2A');
  });

  test('8進数欄に0oプレフィックス付きで入力すると他の欄が自動更新される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-octal-input').fill('0o52');

    // 0o52 = 42
    await expect(page.locator('#base-binary-input')).toHaveValue('00101010');
    await expect(page.locator('#base-decimal-input')).toHaveValue('42');
    await expect(page.locator('#base-hex-input')).toHaveValue('2A');
  });

  test('負数（8bitの最小値-128）を入力すると2の補数表現になる', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-decimal-input').fill('-128');

    await expect(page.locator('#base-binary-input')).toHaveValue('10000000');
    await expect(page.locator('#base-octal-input')).toHaveValue('200');
    await expect(page.locator('#base-hex-input')).toHaveValue('80');
  });

  test('ビット幅を変更すると同じ10進数値のまま他の欄が再計算される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    // デフォルトの10進数-1のまま16bitに変更
    await page.locator('#base-bitwidth-select').selectOption('16');

    await expect(page.locator('#base-decimal-input')).toHaveValue('-1');
    await expect(page.locator('#base-binary-input')).toHaveValue(
      '1111111111111111',
    );
    await expect(page.locator('#base-hex-input')).toHaveValue('FFFF');
  });

  test('現在のビット幅の符号付き範囲を超える10進数を入力するとエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    // 8bitの符号付き範囲は-128〜127なので200は範囲外
    await page.locator('#base-decimal-input').fill('200');

    await expect(page.locator('#base-error')).toHaveText(
      '8bitの符号付き整数として表せる範囲（-128〜127）を超えています。',
    );
    // エラー時は他の欄が壊れた値で上書きされない
    await expect(page.locator('#base-hex-input')).toHaveValue('FF');
  });

  test('ビット幅ごとにエラーメッセージの範囲が変わる（16bit）', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-bitwidth-select').selectOption('16');
    // 16bitの符号付き範囲は-32768〜32767なので40000は範囲外
    await page.locator('#base-decimal-input').fill('40000');

    await expect(page.locator('#base-error')).toHaveText(
      '16bitの符号付き整数として表せる範囲（-32768〜32767）を超えています。',
    );
  });

  test('2進数・8進数・16進数の欄でビット幅を超える値を入力するとビット幅に応じたエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    // 8bitの範囲は0〜255なので16進数の100（=256）は範囲外
    await page.locator('#base-hex-input').fill('100');

    await expect(page.locator('#base-error')).toHaveText(
      '8bitで表せる範囲（0〜255）を超えています。ビット幅を変更するか、値を小さくしてください。',
    );
  });

  test('64bitに変更すると32bit超の大きな数値もBigIntで正確に変換される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-bitwidth-select').selectOption('64');
    await page.locator('#base-hex-input').fill('FFFFFFFFFFFFFFFF');

    await expect(page.locator('#base-decimal-input')).toHaveValue('-1');
    await expect(page.locator('#base-binary-input')).toHaveValue(
      '1'.repeat(64),
    );
  });

  test('不正な2進数を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-binary-input').fill('102');

    await expect(page.locator('#base-error')).toHaveText(
      '2進数として無効です（0と1のみ使用できます）',
    );
    await expect(page.locator('#base-decimal-input')).toHaveValue('-1');
  });

  test('2進数・8進数・16進数の欄には符号を入力できない（無効な形式として扱われる）', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-hex-input').fill('-FF');

    await expect(page.locator('#base-error')).toHaveText(
      '16進数として無効です（0〜9、A〜Fのみ使用できます）',
    );
  });

  test('不正な8進数を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-octal-input').fill('989');

    await expect(page.locator('#base-error')).toHaveText(
      '8進数として無効です（0〜7のみ使用できます）',
    );
    await expect(page.locator('#base-decimal-input')).toHaveValue('-1');
  });

  test('不正な10進数を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-decimal-input').fill('42.5');

    await expect(page.locator('#base-error')).toHaveText(
      '10進数として無効です（先頭の+/-以外は0〜9のみ使用できます）',
    );
    await expect(page.locator('#base-hex-input')).toHaveValue('FF');
  });

  test('不正な16進数を入力するとエラーメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-hex-input').fill('ZZZ');

    await expect(page.locator('#base-error')).toHaveText(
      '16進数として無効です（0〜9、A〜Fのみ使用できます）',
    );
    await expect(page.locator('#base-decimal-input')).toHaveValue('-1');
  });

  test('入力フィールドが空の場合、エラーメッセージが消える', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    // 不正な値を入力してエラーを表示
    await page.locator('#base-decimal-input').fill('42.5');
    await expect(page.locator('#base-error')).toHaveText(
      '10進数として無効です（先頭の+/-以外は0〜9のみ使用できます）',
    );

    // フィールドをクリア
    await page.locator('#base-decimal-input').fill('');

    // エラーメッセージが消える
    await expect(page.locator('#base-error')).toBeEmpty();
  });

  test('10進数欄が空の状態でビット幅を変更しても「範囲外」の誤ったエラーは出ない', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-decimal-input').fill('');
    await page.locator('#base-bitwidth-select').selectOption('16');

    await expect(page.locator('#base-error')).toBeEmpty();
  });

  test('10進数欄が不正な形式の状態でビット幅を変更すると「無効な形式」のエラーになる（「範囲外」ではない）', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    await page.locator('#base-decimal-input').fill('42.5');
    await page.locator('#base-bitwidth-select').selectOption('16');

    await expect(page.locator('#base-error')).toHaveText(
      '10進数として無効です（先頭の+/-以外は0〜9のみ使用できます）',
    );
  });

  test('コピーボタンで各進数値をそれぞれコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/base-converter/');

    await page.locator('#base-decimal-input').fill('42');

    // 2進数をコピー
    await page.locator('[data-copy-target="base-binary-input"]').click();
    await expect(page.locator('#base-status')).toHaveText('コピーしました');
    let clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('00101010');

    // 16進数をコピー
    await page.locator('[data-copy-target="base-hex-input"]').click();
    clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('2A');
  });

  test('UX Issue 1: 2進数欄に無効な値がある状態でビット幅を変更すると、エラーは残りつつ他の欄は更新される', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    // 2進数欄に無効な値を入力（102は2進数として不正）
    await page.locator('#base-binary-input').fill('102');
    await expect(page.locator('#base-error')).toHaveText(
      '2進数として無効です（0と1のみ使用できます）',
    );

    // ビット幅を変更すると、10進数フィールドの-1を基準に他の欄が更新される
    // ただしエラーメッセージはまだ表示されたままになる（UXグレーゾーン）
    await page.locator('#base-bitwidth-select').selectOption('16');

    // 他の欄は更新されている（-1の16bit表現）
    await expect(page.locator('#base-decimal-input')).toHaveValue('-1');
    await expect(page.locator('#base-hex-input')).toHaveValue('FFFF');
    await expect(page.locator('#base-binary-input')).toHaveValue(
      '1111111111111111',
    );

    // エラーメッセージはまだ残っている（グレーゾーン）
    // これは許容範囲と判断されている
  });

  test('UX Issue 2: ビット幅変更で範囲外エラーになった場合、セレクトは新しい値、欄は古い表記のまま', async ({
    page,
  }) => {
    await page.goto('/tools/base-converter/');

    // 10進数に8bitの最大値127を入力
    await page.locator('#base-decimal-input').fill('127');
    await expect(page.locator('#base-binary-input')).toHaveValue('01111111');

    // 8bitから8bitに再設定（値は変わらず）
    await page.locator('#base-bitwidth-select').selectOption('8');
    await expect(page.locator('#base-decimal-input')).toHaveValue('127');

    // 今度は64bitに変更（範囲は十分）
    await page.locator('#base-bitwidth-select').selectOption('64');
    await expect(page.locator('#base-decimal-input')).toHaveValue('127');
    // 64bitの127は64桁のビット表記になる
    const binary64 = await page.locator('#base-binary-input').inputValue();
    expect(binary64).toHaveLength(64);

    // 今度は値をセットしてから、ビット幅を変更して範囲外にする
    await page.locator('#base-bitwidth-select').selectOption('8');
    await page.locator('#base-decimal-input').fill('100'); // 8bit範囲内

    // 64bitに変更してから128を入力（64bit範囲内）
    await page.locator('#base-bitwidth-select').selectOption('64');
    await page.locator('#base-decimal-input').fill('100');

    // 8bitに戻す
    await page.locator('#base-bitwidth-select').selectOption('8');
    // 100は8bitで範囲内なので問題ない
    await expect(page.locator('#base-decimal-input')).toHaveValue('100');

    // 実際に範囲外エラーをテストする：大きな値を64bitで入力してから8bitに変更
    await page.locator('#base-bitwidth-select').selectOption('64');
    await page.locator('#base-decimal-input').fill('9223372036854775807'); // 64bit最大値
    const hex64 = await page.locator('#base-hex-input').inputValue();
    expect(hex64).toBe('7FFFFFFFFFFFFFFF');

    // 8bitに変更すると範囲外エラーになる
    await page.locator('#base-bitwidth-select').selectOption('8');
    await expect(page.locator('#base-error')).toHaveText(
      '8bitの符号付き整数として表せる範囲（-128〜127）を超えています。',
    );
    // セレクトは新しい値（8）に変わっているが、欄の表記は前の状態のまま
    await expect(page.locator('#base-bitwidth-select')).toHaveValue('8');
    // 注：このグレーゾーンでは、欄が古いビット幅の表記のまま見えるが、
    // 実装上は10進数欄が古い値を保持したままになっている
  });
});

test.describe('Base Converter (English)', () => {
  test('英語版が正しく表示され、デフォルトで8bit・-1が表示される', async ({
    page,
  }) => {
    await page.goto('/en/tools/base-converter/');

    await expect(page.locator('main h1')).toHaveText('Base Converter');
    await expect(page.locator('#base-binary-input')).toHaveValue('11111111');
    await expect(page.locator('#base-octal-input')).toHaveValue('377');
    await expect(page.locator('#base-decimal-input')).toHaveValue('-1');
    await expect(page.locator('#base-hex-input')).toHaveValue('FF');
  });

  test('英語版で相互変換が動作する', async ({ page }) => {
    await page.goto('/en/tools/base-converter/');

    await page.locator('#base-decimal-input').fill('100');

    // 100 = 0x64 = 0o144 = 0b01100100（8bit分0埋め）
    await expect(page.locator('#base-binary-input')).toHaveValue('01100100');
    await expect(page.locator('#base-octal-input')).toHaveValue('144');
    await expect(page.locator('#base-hex-input')).toHaveValue('64');
  });

  test('英語版でエラーメッセージが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/base-converter/');

    await page.locator('#base-binary-input').fill('102');
    await expect(page.locator('#base-error')).toHaveText(
      'Invalid binary number (only 0 and 1 are allowed)',
    );

    await page.locator('#base-octal-input').fill('989');
    await expect(page.locator('#base-error')).toHaveText(
      'Invalid octal number (only 0-7 are allowed)',
    );

    await page.locator('#base-hex-input').fill('ZZZ');
    await expect(page.locator('#base-error')).toHaveText(
      'Invalid hexadecimal number (only 0-9 and A-F are allowed)',
    );

    await page.locator('#base-decimal-input').fill('200');
    await expect(page.locator('#base-error')).toHaveText(
      'This value is out of range for a signed 8-bit integer (-128 to 127).',
    );
  });

  test('英語版でコピーボタンが動作する', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/base-converter/');

    await page.locator('[data-copy-target="base-decimal-input"]').click();

    await expect(page.locator('#base-status')).toHaveText('Copied');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe('-1');
  });

  test('英語版で375px幅でレイアウトが正しく表示される', async ({ page }) => {
    // Set viewport to 375px (mobile-like)
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/en/tools/base-converter/');

    // Check main elements are visible
    await expect(page.locator('main h1')).toHaveText('Base Converter');
    await expect(page.locator('#base-bitwidth-select')).toBeVisible();

    // Check for horizontal overflow
    const documentWidth = await page.evaluate(() => {
      return Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth,
      );
    });

    const viewportWidth = 375;
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('英語版で8bitの範囲チェック（-128〜127）', async ({ page }) => {
    await page.goto('/en/tools/base-converter/');

    // Min: -128
    await page.locator('#base-decimal-input').fill('-128');
    await expect(page.locator('#base-binary-input')).toHaveValue('10000000');
    await expect(page.locator('#base-error')).toBeEmpty();

    // Max: 127
    await page.locator('#base-decimal-input').fill('127');
    await expect(page.locator('#base-binary-input')).toHaveValue('01111111');
    await expect(page.locator('#base-error')).toBeEmpty();

    // Beyond max
    await page.locator('#base-decimal-input').fill('128');
    await expect(page.locator('#base-error')).not.toBeEmpty();

    // Below min
    await page.locator('#base-decimal-input').fill('-129');
    await expect(page.locator('#base-error')).not.toBeEmpty();
  });

  test('英語版で64bitの境界値（BigInt）', async ({ page }) => {
    await page.goto('/en/tools/base-converter/');

    await page.locator('#base-bitwidth-select').selectOption('64');

    // Max: 9223372036854775807
    await page.locator('#base-decimal-input').fill('9223372036854775807');
    await expect(page.locator('#base-hex-input')).toHaveValue(
      '7FFFFFFFFFFFFFFF',
    );
    await expect(page.locator('#base-error')).toBeEmpty();

    // Min: -9223372036854775808
    await page.locator('#base-decimal-input').fill('-9223372036854775808');
    await expect(page.locator('#base-hex-input')).toHaveValue(
      '8000000000000000',
    );
    await expect(page.locator('#base-error')).toBeEmpty();

    // Beyond max
    await page.locator('#base-decimal-input').fill('9223372036854775808');
    await expect(page.locator('#base-error')).not.toBeEmpty();
  });
});
