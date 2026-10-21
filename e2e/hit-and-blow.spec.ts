import { test, expect, type Page } from './helpers/test';
import { evaluate } from '../src/lib/tools/hit-and-blow';

const PAGES = {
  ja: '/tools/hit-and-blow/',
  en: '/en/tools/hit-and-blow/',
} as const;

type Msg = Record<string, string>;

async function readMsg(page: Page): Promise<Msg> {
  return page
    .locator('#hb-root')
    .evaluate((el) => ({ ...(el as HTMLElement).dataset }) as Msg);
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in values ? String(values[k]) : m,
  );

async function guess(page: Page, text: string) {
  await page.locator('#hb-guess').fill(text);
  await page.locator('#hb-guess-button').click();
}

async function lastRow(page: Page) {
  const cells = await page
    .locator('#hb-history tr')
    .last()
    .locator('td')
    .allTextContents();
  return { text: cells[1], hit: Number(cells[2]), blow: Number(cells[3]) };
}

/** 重複なし4桁の全候補 */
function allCandidates(): number[][] {
  const out: number[][] = [];
  for (let n = 0; n < 10000; n++) {
    const d = String(n).padStart(4, '0').split('').map(Number);
    if (new Set(d).size === 4) out.push(d);
  }
  return out;
}

for (const lang of ['ja', 'en'] as const) {
  test.describe(`数当て Hit & Blow（${lang}）`, () => {
    test('初期表示は4桁・重複なしで、履歴は空', async ({ page }) => {
      await page.goto(PAGES[lang]);
      await expect(page.locator('[data-digits="4"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.locator('#hb-repeat')).not.toBeChecked();
      await expect(page.locator('#hb-answer')).toHaveText('????');
      await expect(page.locator('#hb-empty')).toBeVisible();
      await expect(page.locator('#hb-history tr')).toHaveCount(0);
    });

    test('入力エラーが表示され、履歴は増えない', async ({ page }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      const error = page.locator('#hb-error');

      await guess(page, '');
      await expect(error).toHaveText(m.errorEmpty);
      await guess(page, 'abcd');
      await expect(error).toHaveText(m.errorNonDigit);
      await guess(page, '123');
      await expect(error).toHaveText(fill(m.errorLength, { digits: 4 }));
      await guess(page, '1123');
      await expect(error).toHaveText(m.errorRepeat);
      await expect(page.locator('#hb-history tr')).toHaveCount(0);

      await guess(page, '1234');
      await expect(error).toBeHidden();
      await expect(page.locator('#hb-history tr')).toHaveCount(1);
    });

    test('Hit/Blow が答えと一致し、ギブアップで答えが表示される', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await guess(page, '0123');
      await guess(page, '4567');
      const r1 = await page
        .locator('#hb-history tr')
        .nth(0)
        .locator('td')
        .allTextContents();
      const r2 = await lastRow(page);

      await page.locator('#hb-giveup-button').click();
      const answer = (await page.locator('#hb-answer').textContent()) ?? '';
      expect(answer).toMatch(/^\d{4}$/);
      await expect(page.locator('#hb-status')).toHaveText(
        fill(m.gaveUp, { answer }),
      );
      const digits = answer.split('').map(Number);
      const e1 = evaluate(digits, [0, 1, 2, 3]);
      const e2 = evaluate(digits, [4, 5, 6, 7]);
      expect([Number(r1[2]), Number(r1[3])]).toEqual([e1.hit, e1.blow]);
      expect([r2.hit, r2.blow]).toEqual([e2.hit, e2.blow]);

      // 終了後は入力できない
      await expect(page.locator('#hb-guess')).toBeDisabled();
      await expect(page.locator('#hb-guess-button')).toBeDisabled();
    });

    test('絞り込みを続けると正解でき、新しいゲームで戻る', async ({ page }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      let candidates = allCandidates();
      let count = 0;
      for (let i = 0; i < 12; i++) {
        const g = candidates[0];
        await guess(page, g.join(''));
        count++;
        const row = await lastRow(page);
        if (row.hit === 4) break;
        candidates = candidates.filter((c) => {
          const e = evaluate(c, g);
          return e.hit === row.hit && e.blow === row.blow;
        });
        expect(candidates.length).toBeGreaterThan(0);
      }
      await expect(page.locator('#hb-status')).toHaveText(
        fill(m.won, { n: count }),
      );
      await expect(page.locator('#hb-answer')).toHaveText(/^\d{4}$/);
      await expect(page.locator('#hb-guess')).toBeDisabled();

      await page.locator('#hb-new-button').click();
      await expect(page.locator('#hb-history tr')).toHaveCount(0);
      await expect(page.locator('#hb-guess')).toBeEnabled();
      await expect(page.locator('#hb-answer')).toHaveText('????');
    });

    test('桁数と重複の設定で入力の検証が変わり、設定変更で新しいゲームになる', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await guess(page, '1234');
      await expect(page.locator('#hb-history tr')).toHaveCount(1);

      await page.locator('[data-digits="3"]').click();
      await expect(page.locator('#hb-history tr')).toHaveCount(0);
      await expect(page.locator('#hb-answer')).toHaveText('???');
      // 入力欄は maxlength=3 なので、4桁は入力できず切り詰められる。桁不足で検証する
      await guess(page, '12');
      await expect(page.locator('#hb-error')).toHaveText(
        fill(m.errorLength, { digits: 3 }),
      );

      await page.locator('[data-digits="5"]').click();
      await page.locator('#hb-repeat').check();
      await expect(page.locator('#hb-answer')).toHaveText('?????');
      await guess(page, '11111');
      await expect(page.locator('#hb-error')).toBeHidden();
      await expect(page.locator('#hb-history tr')).toHaveCount(1);
      const row = await lastRow(page);
      expect(row.text).toBe('11111');
      expect(row.blow).toBe(0);
    });
  });
}
