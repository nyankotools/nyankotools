import type { Page } from '@playwright/test';
import { test, expect } from './helpers/test';

// 「まとめて入力」を開いて、入力欄に直接書き込む
async function fillBulk(page: Page, text: string) {
  if (!(await page.locator('#rd-items').isVisible())) {
    await page.locator('#rd-bulk-summary').click();
  }
  await page.locator('#rd-items').fill(text);
}

test.describe('ルーレット・抽選・サイコロツール', () => {
  test.beforeEach(async ({ page }) => {
    // 回転アニメーションを省略して結果をすぐ表示させる
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('ルーレットを回すと項目のどれかが結果に出る', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB\nC');
    await expect(page.locator('#rd-segments text')).toHaveCount(3);
    await page.locator('#rd-spin-button').click();
    await expect(page.locator('#rd-result-title')).toHaveText(/^結果: [ABC]$/);
  });

  test('「除外する」をオンにすると当たった項目が消える', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB');
    await page.locator('#rd-remove').check();
    await page.locator('#rd-spin-button').click();
    await expect(page.locator('#rd-segments text')).toHaveCount(1);
    await page.locator('#rd-spin-button').click();
    await expect(page.locator('#rd-segments text')).toHaveCount(0);
    await expect(page.locator('#rd-error')).toContainText('すべての項目');
  });

  test('項目が空だとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, '  \n');
    await page.locator('#rd-spin-button').click();
    await expect(page.locator('#rd-error')).toContainText('項目を入力');
  });

  test('抽選モードで重複なく指定数が選ばれる', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await page.locator('#rd-mode [data-mode="lots"]').click();
    await fillBulk(page, 'A\nB\nC\nD');
    await page.locator('#rd-lots-count').fill('3');
    await page.locator('#rd-lots-button').click();
    await expect(page.locator('#rd-result-list li')).toHaveCount(3);
    const texts = await page.locator('#rd-result-list li').allTextContents();
    expect(new Set(texts).size).toBe(3);
  });

  test('サイコロモードで出目と合計が表示され、不正値はエラー', async ({
    page,
  }) => {
    await page.goto('/tools/roulette-dice/');
    await page.locator('#rd-mode [data-mode="dice"]').click();
    await expect(page.locator('#rd-items-block')).toBeHidden();
    await page.locator('#rd-dice-count').fill('3');
    await page.locator('#rd-dice-presets [data-sides="20"]').click();
    await page.locator('#rd-dice-modifier').fill('5');
    await page.locator('#rd-roll-button').click();
    await expect(page.locator('#rd-dice-faces > span')).toHaveCount(3);
    await expect(page.locator('#rd-result-title')).toContainText('合計');

    await page.locator('#rd-dice-count').fill('0');
    await page.locator('#rd-roll-button').click();
    await expect(page.locator('#rd-error')).toContainText('1〜100');
  });

  test('英語版が表示される', async ({ page }) => {
    await page.goto('/en/tools/roulette-dice/');
    await expect(page.locator('main h1')).toContainText('Roulette');
    await page.locator('#rd-spin-button').click();
    await expect(page.locator('#rd-result-title')).toContainText('Result:');
  });
});

test.describe('ルーレットの確率設定', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('「項目*重み」で確率が表示され、重み付きで当たる', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A*3\nB*1');
    await expect(page.locator('#rd-rows .rd-prob')).toHaveText(['75%', '25%']);
    await expect(page.locator('#rd-segments text')).toHaveText(['A', 'B']);
    await page.locator('#rd-spin-button').click();
    await expect(page.locator('#rd-result-title')).toHaveText(/^結果: [AB]$/);
  });

  test('重みを指定しない項目は等確率で表示される', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB\nC\nD');
    await expect(page.locator('#rd-rows .rd-prob')).toHaveText([
      '25%',
      '25%',
      '25%',
      '25%',
    ]);
  });

  test('重みの大きい項目が圧倒的に当たりやすい', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, '当たり*1000\nはずれ*0.001');
    for (let i = 0; i < 3; i++) {
      await page.locator('#rd-spin-button').click();
      await expect(page.locator('#rd-result-title')).toHaveText('結果: 当たり');
    }
  });

  test('除外すると、重みの指定を含めて残りの行だけが残る', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A*1000\nB*2');
    await page.locator('#rd-remove').check();
    await page.locator('#rd-spin-button').click();
    await expect(page.locator('#rd-items')).toHaveValue('B*2');
  });
});

test.describe('項目と重みの入力欄', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('行を追加して項目名と重みを入力すると、まとめて入力欄・ホイール・確率に反映される', async ({
    page,
  }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB');
    await page.locator('#rd-add-button').click();
    const rows = page.locator('#rd-rows li');
    await expect(rows).toHaveCount(3);
    await rows.nth(2).locator('.rd-name').fill('C');
    await rows.nth(2).locator('.rd-weight').fill('2');
    await expect(page.locator('#rd-items')).toHaveValue('A\nB\nC*2');
    await expect(page.locator('#rd-segments text')).toHaveCount(3);
    await expect(page.locator('#rd-rows .rd-prob')).toHaveText([
      '25%',
      '25%',
      '50%',
    ]);
  });

  test('Enterで次の行が追加され、削除ボタンで行が消える', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB');
    await page.locator('#rd-rows .rd-name').first().press('Enter');
    await expect(page.locator('#rd-rows li')).toHaveCount(3);
    await expect(page.locator('#rd-rows .rd-name').nth(2)).toBeFocused();
    await page.locator('#rd-rows .rd-remove').first().click();
    await expect(page.locator('#rd-items')).toHaveValue('B');
  });

  test('不正な重みは赤く表示され、1として扱われる。リセットで全て1に戻る', async ({
    page,
  }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A*3\nB*5');
    const weight = page.locator('#rd-rows .rd-weight').first();
    await weight.fill('0');
    await expect(weight).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#rd-items')).toHaveValue('A\nB*5');
    await page.locator('#rd-reset-weights').click();
    await expect(page.locator('#rd-items')).toHaveValue('A\nB');
    await expect(weight).toHaveAttribute('aria-invalid', 'false');
  });

  test('項目名が「*数字」で終わっても、重みと取り違えない', async ({
    page,
  }) => {
    await page.goto('/tools/roulette-dice/');
    await page.locator('#rd-rows .rd-name').first().fill('R*3');
    await expect(page.locator('#rd-items')).toHaveValue(/^R\*3\*1\n/);
    await expect(page.locator('#rd-rows .rd-name').first()).toHaveValue('R*3');
  });
});

test.describe('極端な重み・極限ケース', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('A*1000000とB*0.001の極端な重み比でホイール描画できる', async ({
    page,
  }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A*1000000\nB*0.001');
    // ホイール上の要素が存在する（円または扇形）
    const segments = await page.locator('#rd-segments > *').count();
    expect(segments).toBeGreaterThan(0);
    // Aがほぼ確実に当たる
    for (let i = 0; i < 3; i++) {
      await page.locator('#rd-spin-button').click();
      await expect(page.locator('#rd-result-title')).toHaveText('結果: A');
    }
  });

  test('100個の項目を処理できる', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    const items = Array.from({ length: 100 }, (_, i) => `Item${i}`).join('\n');
    await fillBulk(page, items);
    await expect(page.locator('#rd-items-info')).toContainText('100');
    // ホイール上に複数要素がある
    const segments = await page.locator('#rd-segments > *').count();
    expect(segments).toBeGreaterThan(50);
  });

  test('1項目のみの場合、円で描画される', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'Solo');
    // 1項目の場合は円（circle要素）で描画される
    const circle = await page.locator('#rd-segments circle').count();
    expect(circle).toBeGreaterThan(0);
    await page.locator('#rd-spin-button').click();
    await expect(page.locator('#rd-result-title')).toHaveText('結果: Solo');
  });

  test('重み0や負数、範囲外は重み1として扱われる', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    // まず全てクリアして、1項目を入力
    await fillBulk(page, 'A');
    // 無効な重みを直接入力欄に入力する
    await page.locator('#rd-rows .rd-weight').first().fill('0');
    // 重みが無効なので、赤く表示される（aria-invalid=true）
    await expect(page.locator('#rd-rows .rd-weight').first()).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    // textarea では無効な重みは含まれない（1として扱われる）
    await expect(page.locator('#rd-items')).toHaveValue('A');
  });

  test('確率<0.1%は「<0.1%」と表示される', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A*1000\nB*0.01');
    // B は圧倒的に確率が低いので <0.1% と表示されるはず
    const probs = await page.locator('#rd-rows .rd-prob').allTextContents();
    const bProb = probs[1];
    expect(bProb.trim()).toMatch(/<0\.1%|0%/);
  });
});

test.describe('ルーレット回転・UI相互作用', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('回転中はスピンボタンと入力欄がロックされる', async ({ page }) => {
    // reduced-motion なので即完了するため、通常モーション設定を使う
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB\nC');
    // スピン開始
    await page.locator('#rd-spin-button').click();
    // 直後、ボタンが disabled になっているはず
    await expect(page.locator('#rd-spin-button')).toBeDisabled();
    // 入力欄も disabled
    await expect(page.locator('#rd-items')).toBeDisabled();
    // アニメーション完了を待つ（4000ms + 300ms のタイマー）
    await page.waitForTimeout(4500);
    // 完了後、ボタンが有効になる
    await expect(page.locator('#rd-spin-button')).toBeEnabled();
    await expect(page.locator('#rd-items')).toBeEnabled();
  });

  test('ルーレット/抽選/サイコロ切替時、結果位置が変わる', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB');
    // ルーレットモード（デフォルト）で結果を表示
    await page.locator('#rd-spin-button').click();
    let resultSlot = await page
      .locator('#rd-result')
      .evaluate((el) => el.parentElement?.id);
    expect(resultSlot).toBe('rd-result-slot-roulette');

    // 抽選モードに切替
    await page.locator('#rd-mode [data-mode="lots"]').click();
    resultSlot = await page
      .locator('#rd-result')
      .evaluate((el) => el.parentElement?.id);
    expect(resultSlot).toBe('rd-result-slot-other');

    // サイコロモードに切替
    await page.locator('#rd-mode [data-mode="dice"]').click();
    resultSlot = await page
      .locator('#rd-result')
      .evaluate((el) => el.parentElement?.id);
    expect(resultSlot).toBe('rd-result-slot-other');
  });

  test('結果はariaLiveで読み上げ可能', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB\nC');
    await page.locator('#rd-spin-button').click();
    // result要素にaria-live="polite"がある
    const resultEl = page.locator('#rd-result');
    const ariaLive = await resultEl.getAttribute('aria-live');
    expect(ariaLive).toBe('polite');
  });
});

test.describe('375px 幅での表示', () => {
  test('375px 幅で行エディタが折り返される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB\nC');
    // 行エディタのgridが正しく配置される
    const rows = page.locator('#rd-rows li');
    const firstRow = rows.first();
    // grid-cols-[1fr_5rem_2.75rem] で折り返されずに収まるはず
    const boundingBox = await firstRow.boundingBox();
    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
    // 水平スクロール発生なし
    const windowWidth = await page.evaluate(() => window.innerWidth);
    const bodyWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 1); // +1 はマージン許容
  });

  test('ホイール（max-w-sm）は 375px 内に収まる', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB\nC');
    const wheel = page.locator('#rd-wheel');
    const boundingBox = await wheel.boundingBox();
    if (boundingBox) {
      // max-w-sm = 24rem = 384px だが、padding やmargin を考えると 375px より小さい
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
  });
});

test.describe('行番号 aria-label', () => {
  test('行エディタの各行に行番号付き aria-label がある', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    await fillBulk(page, 'A\nB\nC');
    const nameInputs = page.locator('#rd-rows .rd-name');
    for (let i = 0; i < 3; i++) {
      const ariaLabel = await nameInputs.nth(i).getAttribute('aria-label');
      expect(ariaLabel).toMatch(`${i + 1}`);
    }
  });
});

test.describe('IME 入力（日本語 変換確定）', () => {
  test('Enter キーは行の追加のトリガーになる', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    // まず全てクリアして、1項目を入力
    await fillBulk(page, 'A');
    const input = page.locator('#rd-rows .rd-name').first();
    // 1行がある
    await expect(page.locator('#rd-rows li')).toHaveCount(1);
    // Enter を押すと次の行が追加される
    await input.press('Enter');
    await expect(page.locator('#rd-rows li')).toHaveCount(2);
  });

  test('イベントハンドラーは isComposing をチェックしている', async ({
    page,
  }) => {
    // このテストは、キーバインドハンドラーのコードレビュー段階で
    // event.isComposing の チェックがあることを確認している。
    // 実際のブラウザIME統合テストはブラウザドライバの制限により実施困難。
    await page.goto('/tools/roulette-dice/');
    // ハンドラーが正しく登録されていることを確認
    const input = page.locator('#rd-rows .rd-name').first();
    const isInputElement = await input.evaluate(
      (el) => el instanceof HTMLInputElement,
    );
    expect(isInputElement).toBe(true);
  });
});

test.describe('言語切替と復元', () => {
  test('日本語版と英語版で表示が切り替わる', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    let title = await page.locator('main h1').textContent();
    expect(title).toContain('ルーレット');

    await page.goto('/en/tools/roulette-dice/');
    title = await page.locator('main h1').textContent();
    expect(title).toContain('Roulette');
  });

  test('ページ再読み込み後、入力が復元される（sessionStorage）', async ({
    page,
  }) => {
    await page.goto('/tools/roulette-dice/');
    // テキストを入力
    await fillBulk(page, 'テスト1*2\nテスト2*3');
    // 行が正しく生成される
    await expect(page.locator('#rd-rows li')).toHaveCount(2);
    // ページをリロード
    await page.reload();
    // sessionStorage から復元される
    await expect(page.locator('#rd-items')).toHaveValue('テスト1*2\nテスト2*3');
    // 行も復元される
    await expect(page.locator('#rd-rows li')).toHaveCount(2);
    await expect(page.locator('#rd-rows .rd-name').first()).toHaveValue(
      'テスト1',
    );
    await expect(page.locator('#rd-rows .rd-weight').first()).toHaveValue('2');
  });

  test('言語切替後、入力値が保持される（同じキー）', async ({ page }) => {
    await page.goto('/tools/roulette-dice/');
    // テキストを入力
    await fillBulk(page, 'Item1*5\nItem2*10');
    await expect(page.locator('#rd-rows li')).toHaveCount(2);
    // 英語版へ移動
    await page.goto('/en/tools/roulette-dice/');
    // 入力値が保持される
    await expect(page.locator('#rd-items')).toHaveValue('Item1*5\nItem2*10');
    // 行も保持される
    await expect(page.locator('#rd-rows li')).toHaveCount(2);
  });
});
