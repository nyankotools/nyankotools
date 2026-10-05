import { test, expect } from './helpers/test';

test.describe('あみだくじ生成ツール', () => {
  test.beforeEach(async ({ page }) => {
    // 経路のアニメーションを省略して結果をすぐ表示させる
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('作成すると結果は「？」で隠れ、名前をタップすると結果が出る', async ({
    page,
  }) => {
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    await expect(page.locator('#ag-board')).toBeVisible();
    await expect(page.locator('#ag-svg [data-col]')).toHaveCount(4);
    await expect(page.locator('#ag-svg text', { hasText: '？' })).toHaveCount(
      0,
    );
    await expect(page.locator('#ag-svg text', { hasText: '?' })).toHaveCount(4);

    await page.locator('#ag-svg [data-col="0"]').click();
    await expect(page.locator('#ag-result-list li')).toHaveCount(1);
    await expect(page.locator('#ag-result-list li')).toContainText('Aさん →');
    // 線を選んだ人の名前が線の上に出る
    await expect(page.locator('#ag-svg [data-col="0"] text')).toHaveText(
      'Aさん',
    );
    await expect(page.locator('#ag-svg text', { hasText: '?' })).toHaveCount(3);
  });

  test('好きな線を選べる。名前を選んで3番目の線をタップするとその線に入る', async ({
    page,
  }) => {
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    await page.locator('#ag-chips button', { hasText: 'Cさん' }).click();
    await page.locator('#ag-svg [data-col="2"]').click();
    await expect(page.locator('#ag-svg [data-col="2"] text')).toHaveText(
      'Cさん',
    );
    await expect(page.locator('#ag-svg [data-col="0"] text')).toHaveText('1');
    await expect(page.locator('#ag-result-list li')).toContainText('Cさん →');
    // 選び終えた名前は押せなくなる
    await expect(
      page.locator('#ag-chips button', { hasText: 'Cさん' }),
    ).toBeDisabled();
  });

  test('結果の位置は作成のたびにランダムに並ぶ', async ({ page }) => {
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-hide').uncheck();
    await page.locator('#ag-players').fill('A\nB\nC\nD\nE\nF');
    await page.locator('#ag-results').fill('1\n2\n3\n4\n5\n6');
    const orders = new Set<string>();
    for (let i = 0; i < 12; i++) {
      await page.locator('#ag-generate-button').click();
      orders.add(
        (await page.locator('#ag-svg text[data-end]').allTextContents()).join(),
      );
    }
    expect(orders.size).toBeGreaterThan(1);
  });

  test('全員分を表示すると全員の結果が並び、結果は重複しない配置になる', async ({
    page,
  }) => {
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-players').fill('A\nB\nC');
    await page.locator('#ag-results').fill('1\n2\n3');
    await page.locator('#ag-generate-button').click();
    await page.locator('#ag-reveal-button').click();
    const items = await page.locator('#ag-result-list li').allTextContents();
    expect(items).toHaveLength(3);
    const results = items.map((s) => s.split('→')[1].trim()).sort();
    expect(results).toEqual(['1', '2', '3']);
  });

  test('参加者と結果の数が違うとエラーを表示する', async ({ page }) => {
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-results').fill('当たり\nはずれ');
    await page.locator('#ag-generate-button').click();
    await expect(page.locator('#ag-error')).toContainText('同じに');
    await expect(page.locator('#ag-board')).toBeHidden();
  });

  test('参加者が1人だけだとエラーを表示する', async ({ page }) => {
    await page.goto('/en/tools/amidakuji-generator/');
    await page.locator('#ag-players').fill('Solo');
    await page.locator('#ag-results').fill('Prize');
    await page.locator('#ag-generate-button').click();
    await expect(page.locator('#ag-error')).toContainText('2 to 20');
  });

  test('「結果を隠す」をオフにすると結果が最初から見える', async ({ page }) => {
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-hide').uncheck();
    await page.locator('#ag-generate-button').click();
    await expect(
      page.locator('#ag-svg text', { hasText: '当たり' }),
    ).toHaveCount(1);
  });

  test('画像として保存でPNGがダウンロードされる', async ({ page }) => {
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#ag-save-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('amidakuji.png');
  });
});

test('印刷用に保存すると結果表示・色なしのPNGがダウンロードされる', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tools/amidakuji-generator/');
  await page.locator('#ag-generate-button').click();
  await page.locator('#ag-svg [data-col="0"]').click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#ag-print-button').click(),
  ]);
  expect(download.suggestedFilename()).toBe('amidakuji-print.png');
  // 画面側の表示（辿った経路・隠した結果）は変わらない
  await expect(page.locator('#ag-svg polyline')).toHaveCount(1);
});

test.describe('エッジケース・特殊文字・キーボード操作', () => {
  test('2人で作成できる', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-players').fill('Player1\nPlayer2');
    await page.locator('#ag-results').fill('結果1\n結果2');
    await page.locator('#ag-generate-button').click();
    await expect(page.locator('#ag-svg [data-col]')).toHaveCount(2);
    await expect(page.locator('#ag-chips button')).toHaveCount(2);
  });

  test('20人で作成できる', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    const players = Array.from({ length: 20 }, (_, i) => `P${i + 1}`).join(
      '\n',
    );
    const results = Array.from({ length: 20 }, (_, i) => `R${i + 1}`).join(
      '\n',
    );
    await page.locator('#ag-players').fill(players);
    await page.locator('#ag-results').fill(results);
    await page.locator('#ag-generate-button').click();
    await expect(page.locator('#ag-svg [data-col]')).toHaveCount(20);
    await expect(page.locator('#ag-chips button')).toHaveCount(20);
  });

  test('同じ名前の参加者を使用できる', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-players').fill('太郎\n太郎\n太郎');
    await page.locator('#ag-results').fill('当たり\nはずれ\n大当たり');
    await page.locator('#ag-generate-button').click();
    await expect(page.locator('#ag-svg [data-col]')).toHaveCount(3);
    // 最初の太郎を選ぶ
    await page.locator('#ag-chips button').first().click();
    await page.locator('#ag-svg [data-col="1"]').click();
    const resultText = await page
      .locator('#ag-result-list li')
      .first()
      .textContent();
    expect(resultText).toContain('太郎');
  });

  test('名前に$&と{result}を含む文字を使用できる', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-players').fill('Alice$&\nBob{result}');
    await page.locator('#ag-results').fill('Win\nLose');
    await page.locator('#ag-generate-button').click();
    // 特殊文字が正しく表示される（テンプレート置換されない）
    const chipTexts = await page.locator('#ag-chips button').allTextContents();
    expect(chipTexts).toContain('Alice$&');
    expect(chipTexts).toContain('Bob{result}');
  });

  test('再生成時に参加者を変更するとチップが更新される', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    const initialChips = await page
      .locator('#ag-chips button')
      .allTextContents();
    expect(initialChips).toEqual(['Aさん', 'Bさん', 'Cさん', 'Dさん']);

    // 参加者を変更して再生成
    await page.locator('#ag-players').fill('Alice\nBob\nCharlie');
    await page.locator('#ag-results').fill('1\n2\n3');
    await page.locator('#ag-generate-button').click();
    const updatedChips = await page
      .locator('#ag-chips button')
      .allTextContents();
    expect(updatedChips).toEqual(['Alice', 'Bob', 'Charlie']);
    // 横線の数も3に変わる
    await expect(page.locator('#ag-svg [data-col]')).toHaveCount(3);
  });

  test('キーボード(Enter)で線を選択できる', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    // 最初のチップをクリックで選択
    await page.locator('#ag-chips button').first().click();
    // 次は線をEnterキーで選択
    await page.locator('#ag-svg [data-col="1"]').focus();
    await page.keyboard.press('Enter');
    // 経路が描画されたか確認
    await expect(page.locator('#ag-svg polyline')).toHaveCount(1);
    await expect(page.locator('#ag-result-list li')).toHaveCount(1);
  });

  test('キーボード(Space)で線を選択できる', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    await page.locator('#ag-chips button').first().click();
    // Spaceキーで線を選択
    await page.locator('#ag-svg [data-col="2"]').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#ag-svg polyline')).toHaveCount(1);
  });

  test('アニメーション有り(reducedMotion: reduce なし)でもタップが機能する', async ({
    page,
  }) => {
    // reducedMotion を使用しない（アニメーション有り状態）
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    await page.locator('#ag-chips button').first().click();
    const startTime = Date.now();
    await page.locator('#ag-svg [data-col="0"]').click();
    // アニメーション完了待ち（最大2.5秒）
    await expect(page.locator('#ag-result-list li')).toHaveCount(1, {
      timeout: 3000,
    });
    const elapsed = Date.now() - startTime;
    // アニメーションが実行されているため、一定の時間がかかるはず
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  test('リセットボタンでアニメーション付きリセット後も再度タップできる', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    await page.locator('#ag-chips button').first().click();
    await page.locator('#ag-svg [data-col="0"]').click();
    await expect(page.locator('#ag-result-list li')).toHaveCount(1);
    // リセット
    await page.locator('#ag-reset-button').click();
    // 経路が消える
    await expect(page.locator('#ag-svg polyline')).toHaveCount(0);
    // 結果リストが空になる
    await expect(page.locator('#ag-result-list li')).toHaveCount(0);
    // チップが初期状態に戻り、最初のチップが自動選択される
    const firstChip = page.locator('#ag-chips button').first();
    await expect(firstChip).toHaveClass(/ring-2/);
    // 再度別の線を選択できる
    await page.locator('#ag-svg [data-col="2"]').click();
    await expect(page.locator('#ag-svg polyline')).toHaveCount(1);
  });

  test('375px幅で表示でもレイアウトが崩れない', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    // 横スクロールが発生しないか確認（SVGのmaxWidthが制限されているはず）
    const svg = page.locator('#ag-svg');
    const svgBox = await svg.boundingBox();
    const containerBox = await page.locator('.overflow-x-auto').boundingBox();
    expect(svgBox).toBeTruthy();
    expect(containerBox).toBeTruthy();
    if (svgBox && containerBox) {
      expect(svgBox.width).toBeLessThanOrEqual(containerBox.width + 10);
    }
  });
});

test.describe('多言語・CSP下のPNG生成', () => {
  test('英語ページで正常に動作する', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    // 英語のプレースホルダー・ラベルが表示される
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Amidakuji');
    await expect(page.locator('#ag-svg [data-col]')).toHaveCount(4);
  });

  test('通常保存PNGをCSP下で生成できる', async ({ page }) => {
    // preview buildは本番CSP設定を適用
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#ag-save-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('amidakuji.png');
  });

  test('印刷用保存PNGをCSP下で生成できる', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tools/amidakuji-generator/');
    await page.locator('#ag-generate-button').click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#ag-print-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('amidakuji-print.png');
  });
});
