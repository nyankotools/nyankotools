import { test, expect } from './helpers/test';

test.describe('関数電卓（日本語版）', () => {
  test('式を入力してEnterで計算し、履歴に残る', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('0.1+0.2');
    await input.press('Enter');

    await expect(page.locator('#scicalc-result')).toHaveText('0.3');
    await expect(page.locator('#scicalc-history li')).toHaveCount(1);
  });

  test('ボタンでカーソル位置に挿入し、ansで直前の結果を使える', async ({
    page,
  }) => {
    await page.goto('/tools/scientific-calculator/');
    await page.locator('#scicalc-key-7').click();
    await page.locator('#scicalc-key-mul').click();
    await page.locator('#scicalc-key-6').click();
    await page.locator('#scicalc-key-eq').click();
    await expect(page.locator('#scicalc-result')).toHaveText('42');

    await page.locator('#scicalc-key-clear').click();
    await page.locator('#scicalc-key-ans').click();
    await page.locator('#scicalc-key-div').click();
    await page.locator('#scicalc-key-2').click();
    await page.locator('#scicalc-key-eq').click();
    await expect(page.locator('#scicalc-result')).toHaveText('21');
  });

  test('度とラジアンを切り替えられる', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('sin(30)');
    await expect(page.locator('#scicalc-result')).toHaveText('0.5');

    await page.locator('#scicalc-rad').click();
    await expect(page.locator('#scicalc-result')).toHaveText('-0.988031624093');
  });

  test('0除算はエラー文言を表示する', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('1/0');
    await input.press('Enter');

    await expect(page.locator('#scicalc-error')).toContainText(
      '計算できません',
    );
    await expect(page.locator('#scicalc-result')).toHaveText('');
  });

  test('履歴をクリックして式を再利用し、消去できる', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('2^10');
    await input.press('Enter');
    await page.locator('#scicalc-key-clear').click();
    await expect(input).toHaveValue('');

    await page.locator('[data-history-expr="2^10"]').click();
    await expect(input).toHaveValue('2^10');

    await page.locator('#scicalc-history-clear').click();
    await expect(page.locator('#scicalc-history li')).toHaveCount(0);
  });

  test('コピーボタンで結果をコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('5!');
    await input.press('Enter');
    await page.locator('#scicalc-copy-button').click();

    await expect(page.locator('#scicalc-status')).toHaveText('コピーしました');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toBe('120');
  });
});

test.describe('Scientific Calculator (English)', () => {
  test('calculates and shows an English error', async ({ page }) => {
    await page.goto('/en/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('sqrt(16)');
    await input.press('Enter');
    await expect(page.locator('#scicalc-result')).toHaveText('4');

    await input.fill('(1+2');
    await input.press('Enter');
    await expect(page.locator('#scicalc-error')).toContainText(
      'parentheses do not match',
    );
  });
});

test.describe('関数電卓の数式補完（日本語版）', () => {
  test('英字の前方一致で候補を出し、関数は括弧付きで表示する', async ({
    page,
  }) => {
    await page.goto('/tools/scientific-calculator/');
    await page.locator('#scicalc-input').fill('si');
    const list = page.getByRole('listbox');
    await expect(list).toBeVisible();
    await expect(list.getByRole('option')).toHaveText([
      'sin(…)',
      'sinh(…)',
      'sign(…)',
    ]);
  });

  test('Tab で先頭候補を確定し、関数は開き括弧まで入る', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('si');
    await input.press('Tab');
    await expect(input).toHaveValue('sin(');
    await expect(input).toBeFocused();
    await expect(page.getByRole('listbox')).toBeHidden();
  });

  test('↑↓で選んだ候補をEnterで確定しても、電卓は計算しない', async ({
    page,
  }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('si');
    await input.press('ArrowDown');
    await input.press('ArrowDown');
    await input.press('Enter');
    await expect(input).toHaveValue('sinh(');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(page.locator('#scicalc-error')).toBeEmpty();
    await expect(page.locator('#scicalc-history li')).toHaveCount(0);
  });

  test('候補を選ばずにEnterを押すと、リストが出ていても電卓が計算する', async ({
    page,
  }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('2*pi');
    // 末尾の単語 pi は入力済みなので候補は出ない。カーソルを p の後ろへ動かして
    // 「候補が出ている＋未選択」の状態を作る（クリックでカーソル位置を再計算させる）
    await input.evaluate((el: HTMLInputElement) => {
      el.setSelectionRange(3, 3);
      el.dispatchEvent(new Event('click'));
    });
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('option')).toHaveText(['pi', 'pow(…)']);
    await input.press('Enter');
    await expect(page.locator('#scicalc-result')).toHaveText(/^6\.283185/);
    await expect(page.locator('#scicalc-history li')).toHaveCount(1);
  });

  test('Escで候補を閉じ、続けて入力すると再び出る', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('si');
    await expect(page.getByRole('listbox')).toBeVisible();
    await input.press('Escape');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(input).toHaveValue('si');
    await input.press('n');
    await expect(page.getByRole('listbox')).toBeVisible();
  });

  test('候補数より多く↓を押しても（循環しても）閉じない', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('a');
    const list = page.getByRole('listbox');
    // 変数 ans を含めて6件（上限8件には届かない）
    await expect(list.getByRole('option')).toHaveCount(6);
    for (let i = 0; i < 8; i++) await input.press('ArrowDown');
    await expect(list).toBeVisible();
  });

  test('変数 ans の候補を出し、確定後の式を計算できる', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('2+3');
    await input.press('Enter');
    await expect(page.locator('#scicalc-result')).toHaveText('5');

    await input.fill('4*an');
    await expect(page.getByRole('option')).toHaveText(['ans']);
    await input.press('Tab');
    await expect(input).toHaveValue('4*ans');
    await input.press('Enter');
    await expect(page.locator('#scicalc-result')).toHaveText('20');
  });

  test('マウスクリックで候補を確定できる', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('si');
    await page.getByRole('option', { name: 'sinh(…)' }).click();
    await expect(input).toHaveValue('sinh(');
    await expect(input).toBeFocused();
  });

  test('IME変換中は候補を出さず、確定後に出る', async ({ page }) => {
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.focus();
    await input.evaluate((el) =>
      el.dispatchEvent(new CompositionEvent('compositionstart', { data: '' })),
    );
    await input.fill('si');
    await expect(page.getByRole('listbox')).toBeHidden();
    await input.evaluate((el) =>
      el.dispatchEvent(new CompositionEvent('compositionend', { data: 'si' })),
    );
    await expect(page.getByRole('listbox')).toBeVisible();
  });

  test('375pxでも候補リストが画面外にはみ出さない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/scientific-calculator/');
    await page.locator('#scicalc-input').fill('a');
    const list = page.getByRole('listbox');
    await expect(list).toBeVisible();
    const box = (await list.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
  });

  test('補完の操作でCSP違反もコンソールエラーも出ない（本番ビルドのCSP下）', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('si');
    await input.press('ArrowDown');
    await input.press('Tab');
    await input.fill('a');
    await expect(page.getByRole('listbox')).toBeVisible();
    await input.press('Escape');
    expect(errors).toEqual([]);
  });
});

test.describe('Scientific Calculator autocomplete (English)', () => {
  test('suggests functions and completes with Tab', async ({ page }) => {
    await page.goto('/en/tools/scientific-calculator/');
    const input = page.locator('#scicalc-input');
    await input.fill('si');
    await expect(page.getByRole('listbox')).toBeVisible();
    await input.press('Tab');
    await expect(input).toHaveValue('sin(');
  });
});
