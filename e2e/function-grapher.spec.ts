import { test, expect } from './helpers/test';

test.describe('関数グラフ描画', () => {
  test('既定の2本が描画され、本数が表示される', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    await expect(page.locator('#fg-status')).toHaveText('2本の関数を描画中');
    await expect(page.locator('#fg-canvas')).toBeVisible();
    // キャンバスに白以外のピクセルが描かれている
    const drawn = await page.evaluate(() => {
      const c = document.getElementById('fg-canvas') as HTMLCanvasElement;
      const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] < 250 || d[i + 1] < 250 || d[i + 2] < 250) return true;
      }
      return false;
    });
    expect(drawn).toBe(true);
  });

  test('式を増やすと本数が変わり、エラーはその欄に表示される', async ({
    page,
  }) => {
    await page.goto('/tools/function-grapher/');
    await page.locator('#fg-expr-2').fill('y=tan(x)');
    await expect(page.locator('#fg-status')).toHaveText('3本の関数を描画中');
    await page.locator('#fg-expr-3').fill('foo(x)');
    await expect(page.locator('#fg-error-3')).toContainText('未知の名前');
    await expect(page.locator('#fg-status')).toHaveText('3本の関数を描画中');
    await page.locator('#fg-expr-3').fill('sin(');
    await expect(page.locator('#fg-error-3')).toContainText('括弧');
    await page.locator('#fg-expr-3').fill('');
    await expect(page.locator('#fg-error-3')).toBeEmpty();
  });

  test('全部の式を消すと案内が出てPNG保存が無効になる', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    await page.locator('#fg-expr-0').fill('');
    await page.locator('#fg-expr-1').fill('');
    await expect(page.locator('#fg-status')).toHaveText(
      'グラフにする式を入力してください',
    );
    await expect(page.locator('#fg-download-button')).toBeDisabled();
  });

  test('拡大・縮小・リセットで表示範囲が変わる', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    await page.locator('#fg-zoom-in').click();
    await expect(page.locator('#fg-xmin')).toHaveValue('-8');
    await expect(page.locator('#fg-xmax')).toHaveValue('8');
    await page.locator('#fg-zoom-out').click();
    await page.locator('#fg-zoom-out').click();
    await expect(page.locator('#fg-xmax')).toHaveValue('12.5');
    await page.locator('#fg-reset').click();
    await expect(page.locator('#fg-xmin')).toHaveValue('-10');
    await expect(page.locator('#fg-ymax')).toHaveValue('6');
  });

  test('ドラッグで表示範囲が移動し、ホイールでズームする', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    const canvas = page.locator('#fg-canvas');
    // 既定のビューポート(720px)ではキャンバスが折り返し下にあるため、先にスクロールする
    await canvas.scrollIntoViewIfNeeded();
    const box = (await canvas.boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + box.width / 4, cy, { steps: 5 });
    await page.mouse.up();
    // 右へ1/4幅ドラッグ → x範囲は左へ 20/4 = 5 動く
    await expect(page.locator('#fg-xmin')).toHaveValue('-15');
    await expect(page.locator('#fg-xmax')).toHaveValue('5');

    await page.locator('#fg-reset').click();
    // リセットのクリックで位置が変わりうるため、キャンバスを改めて測って合わせる
    await canvas.scrollIntoViewIfNeeded();
    await canvas.hover();
    await page.mouse.wheel(0, -300);
    await expect(async () => {
      const w =
        Number(await page.locator('#fg-xmax').inputValue()) -
        Number(await page.locator('#fg-xmin').inputValue());
      expect(w).toBeLessThan(20);
    }).toPass();
  });

  test('表示範囲の入力エラーが表示される', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    await page.locator('#fg-xmin').fill('20');
    await expect(page.locator('#fg-view-error')).toContainText('最大値');
    await page.locator('#fg-xmin').fill('-5');
    await expect(page.locator('#fg-view-error')).toBeEmpty();
  });

  test('度/ラジアンを切り替えられる', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    const deg = page.locator('#fg-angle [data-angle="deg"]');
    await deg.click();
    await expect(deg).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#fg-angle [data-angle="rad"]')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('PNGを保存でき、CSP違反もコンソールエラーも出ない（本番ビルドのCSP下）', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('/tools/function-grapher/');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#fg-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('function-graph-2.png');
    await expect(page.locator('#fg-status')).toHaveText('PNGを保存しました');
    expect(errors).toEqual([]);
  });

  test('英語版でも動作する', async ({ page }) => {
    await page.goto('/en/tools/function-grapher/');
    await expect(page.locator('#fg-status')).toHaveText(
      'Plotting 2 function(s)',
    );
    await page.locator('#fg-expr-0').fill('1/');
    await expect(page.locator('#fg-error-0')).toContainText('not valid');
  });
});

test.describe('関数グラフの数式補完（日本語版）', () => {
  test('英字の前方一致で候補を出し、Tab で関数の開き括弧まで入る', async ({
    page,
  }) => {
    await page.goto('/tools/function-grapher/');
    const input = page.locator('#fg-expr-2');
    await input.fill('si');
    await expect(page.getByRole('option')).toHaveText([
      'sin(…)',
      'sinh(…)',
      'sign(…)',
    ]);
    await input.press('Tab');
    await expect(input).toHaveValue('sin(');
    await expect(page.getByRole('listbox')).toBeHidden();
  });

  test('↑↓で選んだ候補をEnterで確定できる', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    const input = page.locator('#fg-expr-2');
    await input.fill('si');
    await input.press('ArrowDown');
    await input.press('ArrowDown');
    await input.press('Enter');
    await expect(input).toHaveValue('sinh(');
    await expect(page.getByRole('listbox')).toBeHidden();
  });

  test('Escで候補を閉じる', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    const input = page.locator('#fg-expr-2');
    await input.fill('si');
    await expect(page.getByRole('listbox')).toBeVisible();
    await input.press('Escape');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(input).toHaveValue('si');
  });

  test('候補数より多く↓を押しても（循環しても）閉じない', async ({ page }) => {
    await page.goto('/tools/function-grapher/');
    const input = page.locator('#fg-expr-2');
    await input.fill('a');
    const list = page.getByRole('listbox');
    // 現行の関数名では前方一致は最大5件（上限8件には届かない）
    await expect(list.getByRole('option')).toHaveCount(5);
    for (let i = 0; i < 8; i++) await input.press('ArrowDown');
    await expect(list).toBeVisible();
  });

  test('変数 x は入力済みの1文字と一致するため候補に出ない', async ({
    page,
  }) => {
    // 仕様上の確認: 変数候補 x は前方一致で「x」だけになり、完全一致として除外される
    await page.goto('/tools/function-grapher/');
    await page.locator('#fg-expr-2').fill('x');
    await expect(page.getByRole('listbox')).toBeHidden();
  });

  test('375pxでも候補リストが画面外にはみ出さない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/function-grapher/');
    await page.locator('#fg-expr-2').fill('a');
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
    await page.goto('/tools/function-grapher/');
    const input = page.locator('#fg-expr-2');
    await input.fill('si');
    await input.press('ArrowDown');
    await input.press('Tab');
    await input.fill('a');
    await expect(page.getByRole('listbox')).toBeVisible();
    await input.press('Escape');
    expect(errors).toEqual([]);
  });
});

test.describe('Function grapher autocomplete (English)', () => {
  test('suggests functions in English page', async ({ page }) => {
    await page.goto('/en/tools/function-grapher/');
    const input = page.locator('#fg-expr-2');
    await input.fill('co');
    await expect(page.getByRole('listbox')).toBeVisible();
    await input.press('Tab');
    await expect(input).toHaveValue(/^co/);
    await expect(input).toHaveValue(/\($/);
  });
});
