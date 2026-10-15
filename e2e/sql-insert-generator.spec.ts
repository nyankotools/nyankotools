import { test, expect } from './helpers/test';

test.describe('CSV/JSON→SQL INSERT文生成（日本語版）', () => {
  test('CSVからINSERT文を生成し、方言とCREATE TABLEを切り替えられる', async ({
    page,
  }) => {
    await page.goto('/tools/sql-insert-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'CSV/JSON→SQL INSERT文生成ツール',
    );

    await page.locator('#sql-insert-table-name').fill('users');
    await page.locator('#sql-insert-input').fill("id,name\n1,Taro\n2,O'Hara");
    const output = page.locator('#sql-insert-output');
    await expect(output).toHaveValue(
      "INSERT INTO `users` (`id`, `name`) VALUES\n  (1, 'Taro'),\n  (2, 'O''Hara');\n",
    );

    await page.locator('#sql-insert-dialect').selectOption('postgresql');
    await page.locator('#sql-insert-create-table').check();
    await expect(output).toHaveValue(
      /^CREATE TABLE "users" \(\n {2}"id" INTEGER,\n {2}"name" TEXT\n\);\n\nINSERT INTO "users"/,
    );
  });

  test('JSONモードで変換でき、不正な入力はエラー表示になる', async ({
    page,
  }) => {
    await page.goto('/tools/sql-insert-generator/');
    await page.locator('#sql-insert-mode [data-mode="json"]').click();
    await expect(page.locator('#sql-insert-delimiter-group')).toBeHidden();

    await page.locator('#sql-insert-input').fill('[{"a":1,"b":true}]');
    await expect(page.locator('#sql-insert-output')).toHaveValue(
      /\(`a`, `b`\) VALUES\n {2}\(1, TRUE\);/,
    );

    await page.locator('#sql-insert-input').fill('{');
    await expect(page.locator('#sql-insert-error')).toBeVisible();
    await expect(page.locator('#sql-insert-output')).toHaveValue('');
  });

  test('列数が揃わないCSVは行番号つきのエラーになる', async ({ page }) => {
    await page.goto('/tools/sql-insert-generator/');
    await page.locator('#sql-insert-input').fill('a,b\n1,2\n3');
    await expect(page.locator('#sql-insert-error')).toBeVisible();
    await expect(page.locator('#sql-insert-error')).toContainText('3');
    await expect(page.locator('#sql-insert-output')).toHaveValue('');
  });

  test('コピーボタンで生成されたSQLをクリップボードへコピーできる', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/sql-insert-generator/');
    await page.locator('#sql-insert-input').fill('a\n1');
    await page.locator('#sql-insert-copy-button').click();
    await expect(page.locator('#sql-insert-status')).toHaveText(
      'コピーしました',
    );
    // Windows のクリップボードは改行を CRLF に変換するので正規化して比較する
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.replace(/\r\n/g, '\n')).toBe(
      'INSERT INTO `my_table` (`a`) VALUES\n  (1);\n',
    );
  });
});

test.describe('CSV/JSON to SQL INSERT Generator（English）', () => {
  test('renders and generates SQL', async ({ page }) => {
    await page.goto('/en/tools/sql-insert-generator/');
    await expect(page.locator('main h1')).toHaveText(
      'CSV/JSON to SQL INSERT Generator',
    );
    await page.locator('#sql-insert-input').fill('a\n1');
    await expect(page.locator('#sql-insert-output')).toHaveValue(
      /INSERT INTO `my_table` \(`a`\)/,
    );
  });

  test('copy button shows the English status', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/sql-insert-generator/');
    await page.locator('#sql-insert-input').fill('a\n1');
    await page.locator('#sql-insert-copy-button').click();
    await expect(page.locator('#sql-insert-status')).toHaveText('Copied');
  });
});

test.describe('SQL Server / Oracle', () => {
  test('方言を切り替えると引用符とINSERT形式が変わる', async ({ page }) => {
    await page.goto('/tools/sql-insert-generator/');
    await page.locator('#sql-insert-table-name').fill('t');
    await page.locator('#sql-insert-input').fill('a,b\n1,太郎\n2,花子');
    const output = page.locator('#sql-insert-output');

    await page.locator('#sql-insert-dialect').selectOption('sqlserver');
    await expect(output).toHaveValue(
      /INSERT INTO \[t\] \(\[a\], \[b\]\) VALUES\n {2}\(1, N'太郎'\)/,
    );

    await page.locator('#sql-insert-dialect').selectOption('oracle');
    await expect(output).toHaveValue(/^INSERT ALL\n[\s\S]*SELECT 1 FROM DUAL;/);
  });
});

test.describe('カラム型の指定', () => {
  test('CREATE TABLE出力時に型を上書きでき、方言変更でリセットされる', async ({
    page,
  }) => {
    await page.goto('/tools/sql-insert-generator/');
    await page.locator('#sql-insert-table-name').fill('t');
    await page.locator('#sql-insert-input').fill('id,name\n1,Taro');
    await expect(page.locator('#sql-insert-types')).toBeHidden();

    await page.locator('#sql-insert-create-table').check();
    await expect(page.locator('#sql-insert-types')).toBeVisible();
    const idType = page.locator('#sql-insert-types-list input').first();
    await expect(idType).toHaveAttribute('placeholder', 'INT');

    await idType.fill('BIGINT UNSIGNED');
    await expect(page.locator('#sql-insert-output')).toHaveValue(
      /`id` BIGINT UNSIGNED,\n {2}`name` VARCHAR\(255\)/,
    );

    await page.locator('#sql-insert-dialect').selectOption('postgresql');
    await expect(idType).toHaveValue('');
    await expect(page.locator('#sql-insert-output')).toHaveValue(
      /"id" INTEGER,/,
    );
  });
});
