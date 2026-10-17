import { test, expect } from './helpers/test';

test.describe('請求書・見積書・領収書・納品書作成', () => {
  test('明細を入力すると税率ごとの集計と合計がプレビューに出る', async ({
    page,
  }) => {
    await page.goto('/tools/invoice-generator/');

    await page.locator('#inv-item-1-name').fill('制作費');
    await page.locator('#inv-item-1-price').fill('10000');
    await expect(page.locator('#inv-item-1-price')).toHaveValue('10,000');
    await page.locator('#inv-item-1-qty').fill('3');

    await page.locator('#inv-add-item').click();
    await page.locator('#inv-item-2-name').fill('お菓子');
    await page.locator('#inv-item-2-price').fill('500');
    await page.locator('#inv-item-2-rate').selectOption('8');

    await expect(page.locator('#inv-item-1-name')).toHaveValue('制作費');
    const paper = page.locator('#inv-paper');
    await expect(paper).toContainText('10%対象');
    await expect(paper).toContainText('￥30,000');
    await expect(paper).toContainText('消費税（10%）');
    await expect(paper).toContainText('￥3,000');
    await expect(paper).toContainText('8%対象');
    await expect(paper).toContainText('￥40');
    await expect(paper).toContainText('※は軽減税率（8%）対象です。');
    await expect(page.locator('#inv-p-head')).toContainText('￥33,540');
  });

  test('書類の種類を切り替えると表題と項目が変わる', async ({ page }) => {
    await page.goto('/tools/invoice-generator/');

    await expect(page.locator('#inv-p-title')).toHaveText('請求書');
    await expect(page.locator('#inv-bank-field')).toBeVisible();

    await page.locator('#inv-type-quote').click();
    await expect(page.locator('#inv-p-title')).toHaveText('御見積書');
    await expect(page.locator('#inv-bank-field')).toBeHidden();
    await expect(page.locator('#inv-due-field')).toBeVisible();

    await page.locator('#inv-type-receipt').click();
    await expect(page.locator('#inv-p-title')).toHaveText('領収書');
    await expect(page.locator('#inv-due-field')).toBeHidden();

    await page.locator('#inv-type-delivery').click();
    await expect(page.locator('#inv-p-title')).toHaveText('納品書');
  });

  test('税込入力・端数処理・値引き行が反映される', async ({ page }) => {
    await page.goto('/tools/invoice-generator/');

    await page.locator('#inv-item-1-name').fill('商品');
    await page.locator('#inv-item-1-price').fill('1100');
    await page
      .locator('input[name="inv-price-mode"][value="inclusive"]')
      .check();
    await expect(page.locator('#inv-p-head')).toContainText('￥1,100');
    await expect(page.locator('#inv-p-summary')).toContainText('￥1,000');

    await page.locator('#inv-add-item').click();
    await page.locator('#inv-item-2-name').fill('値引き');
    await page.locator('#inv-item-2-price').fill('-110');
    await expect(page.locator('#inv-p-head')).toContainText('￥990');
  });

  test('登録番号の形式エラーが表示され、印刷を止める', async ({ page }) => {
    await page.goto('/tools/invoice-generator/');

    await page.locator('#inv-item-1-name').fill('商品');
    await page.locator('#inv-item-1-price').fill('100');
    await page.locator('#inv-registration').fill('T123');
    await expect(page.locator('#inv-registration-error')).toContainText(
      'T」に続く13桁',
    );

    await page.locator('#inv-registration').fill('T1234567890123');
    await expect(page.locator('#inv-registration-error')).toBeEmpty();
    await expect(page.locator('#inv-p-registration')).toHaveText(
      '登録番号: T1234567890123',
    );
  });

  test('不正な明細ではエラーが出る', async ({ page }) => {
    await page.goto('/tools/invoice-generator/');

    await page.locator('#inv-item-1-name').fill('商品');
    await expect(page.locator('#inv-error')).toContainText('1行目');
    await page.locator('#inv-item-1-price').fill('100');
    await expect(page.locator('#inv-error')).toBeEmpty();
  });

  test('印刷時は書類だけが表示され、入力欄は隠れる', async ({ page }) => {
    await page.goto('/tools/invoice-generator/');
    await page.locator('#inv-item-1-name').fill('商品');
    await page.locator('#inv-item-1-price').fill('100');
    await page.locator('#inv-recipient').fill('サンプル株式会社');

    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('#inv-form')).toBeHidden();
    await expect(page.locator('#inv-paper')).toBeVisible();
    await expect(page.locator('main h1')).toBeHidden();
    await expect(page.locator('#inv-p-recipient')).toContainText(
      'サンプル株式会社 御中',
    );
  });

  test('発行者情報をこのブラウザに保存・削除できる', async ({ page }) => {
    await page.goto('/tools/invoice-generator/');

    await page.locator('#inv-issuer-name').fill('にゃんこ制作所');
    await page.locator('#inv-issuer-save').click();
    await expect(page.locator('#inv-issuer-status')).toContainText(
      '保存しました',
    );

    await page.reload();
    await expect(page.locator('#inv-issuer-name')).toHaveValue(
      'にゃんこ制作所',
    );

    await page.locator('#inv-issuer-clear').click();
    await page.reload();
    await expect(page.locator('#inv-issuer-name')).toHaveValue('');
  });

  test('英語版でも表示される', async ({ page }) => {
    await page.goto('/en/tools/invoice-generator/');
    await expect(page.locator('main h1')).toContainText('Invoice');
    await expect(page.locator('#inv-p-title')).toHaveText('INVOICE');
    await page.locator('#inv-item-1-name').fill('Item');
    await page.locator('#inv-item-1-price').fill('1000');
    await expect(page.locator('#inv-p-head')).toContainText('¥1,100');
  });

  test('小数の単価は小数のまま表示され、金額は端数処理される', async ({
    page,
  }) => {
    await page.goto('/tools/invoice-generator/');

    await page.locator('#inv-item-1-name').fill('部品');
    await page.locator('#inv-item-1-price').fill('12.5');
    await page.locator('#inv-item-1-qty').fill('3');

    await expect(page.locator('#inv-item-1-price')).toHaveValue('12.5');
    const firstRow = page.locator('#inv-p-tbody tr').first();
    await expect(firstRow.locator('td').nth(2)).toHaveText('￥12.5');
    await expect(firstRow.locator('td').nth(4)).toHaveText('￥37');
    // 税抜37円＋消費税3円（10%・切り捨て）＝税込40円
    await expect(page.locator('#inv-p-head')).toContainText('￥40');
  });

  test('品名も単価も空の状態で印刷を押すとエラーになり、印刷は開かない', async ({
    page,
  }) => {
    await page.goto('/tools/invoice-generator/');
    await page.evaluate(() => {
      const w = window as unknown as { print: () => void; printed?: boolean };
      w.print = () => {
        w.printed = true;
      };
    });

    await page.locator('#inv-print-button').click();

    await expect(page.locator('#inv-error')).toContainText(
      '明細を1行以上入力してください',
    );
    const printed = await page.evaluate(
      () => (window as unknown as { printed?: boolean }).printed,
    );
    expect(printed).toBeFalsy();
  });

  test('明細は50行まで追加でき、51行目の追加はエラーになる', async ({
    page,
  }) => {
    await page.goto('/tools/invoice-generator/');
    for (let i = 0; i < 49; i++) {
      await page.locator('#inv-add-item').click();
    }
    await expect(page.locator('[data-item-row]')).toHaveCount(50);

    await page.locator('#inv-add-item').click();
    await expect(page.locator('[data-item-row]')).toHaveCount(50);
    await expect(page.locator('#inv-error')).toContainText('50行まで');
  });

  test('金額の上限（1e10円）を超えるとエラーが出る', async ({ page }) => {
    await page.goto('/tools/invoice-generator/');

    await page.locator('#inv-item-1-name').fill('高額');
    await page.locator('#inv-item-1-price').fill('10,000,000,001');
    await expect(page.locator('#inv-error')).toContainText(
      '金額が大きすぎます',
    );
  });

  test('ダークテーマでも書類プレビューは白地で表示される', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/tools/invoice-generator/');
    await expect(page.locator('html')).toHaveClass(/(^|\s)dark(\s|$)/);

    await page.locator('#inv-item-1-name').fill('商品');
    await page.locator('#inv-item-1-price').fill('100');

    await expect(page.locator('#inv-paper')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    );
  });
});
