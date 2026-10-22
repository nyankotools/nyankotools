import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './helpers/test';

test.describe('文章校正（表記ゆれ）ツール', () => {
  test('入力すると該当箇所がハイライトされ、推奨表記が表に出る', async ({
    page,
  }) => {
    await page.goto('/tools/notation-variants-checker/');
    await page.locator('#nvc-input').fill('資料の取扱いに御注意下さい。');

    await expect(page.locator('#nvc-status')).toHaveText(
      '3件の表記ゆれ候補が見つかりました',
    );
    await expect(page.locator('#nvc-highlight mark')).toHaveCount(3);
    await expect(page.locator('#nvc-body tr').first()).toContainText(
      '取り扱い',
    );
  });

  test('HTMLを入力してもタグとして解釈されない', async ({ page }) => {
    await page.goto('/tools/notation-variants-checker/');
    await page.locator('#nvc-input').fill('<img src=x onerror=alert(1)>行ない');

    await expect(page.locator('#nvc-highlight img')).toHaveCount(0);
    await expect(page.locator('#nvc-highlight')).toContainText('<img src=x');
    await expect(page.locator('#nvc-highlight mark')).toHaveCount(1);
  });

  test('項目のチェックを外すと検出されなくなる', async ({ page }) => {
    await page.goto('/tools/notation-variants-checker/');
    await page.locator('#nvc-input').fill('行ないます');
    await expect(page.locator('#nvc-highlight mark')).toHaveCount(1);

    await page.locator('input[data-kind="okurigana"]').uncheck();
    await expect(page.locator('#nvc-highlight mark')).toHaveCount(0);
    await expect(page.locator('#nvc-status')).toHaveText(
      '表記ゆれの候補は見つかりませんでした',
    );
  });

  test('独自ルールが検出される', async ({ page }) => {
    await page.goto('/tools/notation-variants-checker/');
    await page.locator('#nvc-input').fill('お客さまへ');
    await page.locator('#nvc-custom').fill('お客さま>お客様');

    await expect(page.locator('#nvc-highlight mark')).toHaveCount(1);
    await expect(page.locator('#nvc-body tr')).toContainText('お客様');
  });

  test('サンプル入力ボタンで結果が表示される', async ({ page }) => {
    await page.goto('/tools/notation-variants-checker/');
    await page.locator('#nvc-sample-button').click();

    expect(await page.locator('#nvc-highlight mark').count()).toBeGreaterThan(
      5,
    );
    await expect(page.locator('#nvc-copy-button')).toBeEnabled();
  });
});

test.describe('Japanese Notation Variants Checker (English)', () => {
  test('英語版でもステータスが英語で表示される', async ({ page }) => {
    await page.goto('/en/tools/notation-variants-checker/');
    await page.locator('#nvc-input').fill('行ないます');

    await expect(page.locator('#nvc-status')).toHaveText(
      'Possible inconsistencies found: 1',
    );
    await expect(page.locator('#nvc-body tr').first()).toContainText(
      'Okurigana',
    );
  });

  test('結果（ハイライト・表）が表示された状態でもaxeの違反がない', async ({
    page,
  }) => {
    await page.goto('/tools/notation-variants-checker/');
    await page.locator('#nvc-input').fill('資料の取扱いに御注意下さい。');
    await expect(page.locator('#nvc-highlight mark')).toHaveCount(3);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
      ),
    ).toEqual([]);
  });
});
