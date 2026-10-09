import { test, expect } from './helpers/test';

test.describe('JSON→型定義生成', () => {
  test('サンプルから型が生成され、オプションで切り替わる', async ({ page }) => {
    await page.goto('/tools/json-to-types/');
    await expect(page.locator('main h1')).toContainText('JSON→型定義生成');

    const output = page.locator('#j2ts-output');
    await expect(output).toHaveValue(/interface Root \{/);
    await expect(output).toHaveValue(/coupon\?: string;/);
    await expect(output).toHaveValue(/interface Orders \{/);

    await page.locator('[data-style="type"]').click();
    await expect(output).toHaveValue(/type Root = \{/);
    await page.locator('#j2ts-export').check();
    await expect(output).toHaveValue(/export type Root = \{/);
    await page.locator('#j2ts-root-name').fill('ApiResponse');
    await expect(output).toHaveValue(/export type ApiResponse = \{/);
  });

  test('言語を切り替えるとC#・Go・Python・Javaの型が生成され、TypeScript用の設定は隠れる', async ({
    page,
  }) => {
    await page.goto('/tools/json-to-types/');
    const output = page.locator('#j2ts-output');
    const styleGroup = page.locator('#j2ts-style');

    await page.locator('[data-language="csharp"]').click();
    await expect(output).toHaveValue(/public class Root/);
    await expect(output).toHaveValue(/public long Id \{ get; set; \}/);
    await expect(styleGroup).toBeHidden();

    await page.locator('[data-language="go"]').click();
    await expect(output).toHaveValue(/type Root struct/);
    await expect(output).toHaveValue(
      /Coupon \*string\s+`json:"coupon,omitempty"`/,
    );

    await page.locator('[data-language="python"]').click();
    await expect(output).toHaveValue(/@dataclass/);
    await expect(output).toHaveValue(/coupon: str \| None = None/);

    await page.locator('[data-language="java"]').click();
    await expect(output).toHaveValue(/record Root\(/);
    await expect(output).toHaveValue(/List<Long>|List<String>/);

    await page.locator('[data-language="typescript"]').click();
    await expect(output).toHaveValue(/interface Root \{/);
    await expect(styleGroup).toBeVisible();
  });

  test('不正なJSONはエラーになり、空にすると消える', async ({ page }) => {
    await page.goto('/tools/json-to-types/');
    const input = page.locator('#j2ts-input');
    await input.fill('{a:1}');
    await expect(page.locator('#j2ts-error')).toBeVisible();
    await expect(page.locator('#j2ts-output')).toHaveValue('');
    await input.fill('');
    await expect(page.locator('#j2ts-error')).toBeHidden();
  });
});

test.describe('JSON→型定義生成: 言語切替と入力エラー', () => {
  test('TS以外の言語でも不正なJSONはエラーになり、出力は空になる', async ({
    page,
  }) => {
    await page.goto('/tools/json-to-types/');
    await page.locator('[data-language="go"]').click();
    const input = page.locator('#j2ts-input');
    await input.fill('{a:1}');
    await expect(page.locator('#j2ts-error')).toBeVisible();
    await expect(page.locator('#j2ts-output')).toHaveValue('');
    await input.fill('{"a":1}');
    await expect(page.locator('#j2ts-error')).toBeHidden();
    await expect(page.locator('#j2ts-output')).toHaveValue(/type Root struct/);
  });

  test('TSに戻ると、直前のTSの設定（type・export）が残る', async ({ page }) => {
    await page.goto('/tools/json-to-types/');
    const output = page.locator('#j2ts-output');
    await page.locator('[data-style="type"]').click();
    await page.locator('#j2ts-export').check();
    await page.locator('[data-language="python"]').click();
    await expect(output).toHaveValue(/@dataclass/);
    await page.locator('[data-language="typescript"]').click();
    await expect(output).toHaveValue(/export type Root = \{/);
    await expect(page.locator('#j2ts-export')).toBeChecked();
  });

  test('ルート名の変更が他言語の出力にも反映される', async ({ page }) => {
    await page.goto('/tools/json-to-types/');
    await page.locator('[data-language="csharp"]').click();
    await page.locator('#j2ts-root-name').fill('ApiResponse');
    await expect(page.locator('#j2ts-output')).toHaveValue(
      /public class ApiResponse/,
    );
  });
});

test.describe('JSON→型定義生成: 375px', () => {
  test('言語・TS設定を切り替えても横スクロールが出ない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/json-to-types/');
    for (const id of ['java', 'csharp', 'typescript']) {
      await page.locator(`[data-language="${id}"]`).click();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow, `${id} で横スクロール`).toBe(false);
    }
  });
});

test.describe('JSON to Types Converter (en)', () => {
  test('displays and converts', async ({ page }) => {
    await page.goto('/en/tools/json-to-types/');
    await expect(page.locator('main h1')).toContainText(
      'JSON to Types Converter',
    );
    await expect(page.locator('#j2ts-output')).toHaveValue(/interface Root/);
  });
});
