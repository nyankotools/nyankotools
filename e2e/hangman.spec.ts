import { test, expect, type Page } from './helpers/test';
import { WORDS } from '../src/lib/tools/hangman';

const PAGES = {
  ja: '/tools/hangman/',
  en: '/en/tools/hangman/',
} as const;

type Msg = Record<string, string>;

async function readMsg(page: Page): Promise<Msg> {
  return page
    .locator('#hm-root')
    .evaluate((el) => ({ ...(el as HTMLElement).dataset }) as Msg);
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in values ? String(values[k]) : m,
  );

async function pattern(page: Page): Promise<string[]> {
  const cells = await page.locator('#hm-word > span').allTextContents();
  return cells.map((c) => c.trim().toLowerCase());
}

for (const lang of ['ja', 'en'] as const) {
  test.describe(`ハングマン（${lang}）`, () => {
    test('初期表示は未回答で、26個のキーが押せる', async ({ page }) => {
      await page.goto(PAGES[lang]);
      await expect(page.locator('[data-letter]')).toHaveCount(26);
      await expect(page.locator('[data-letter]:disabled')).toHaveCount(0);
      await expect(page.locator('#hm-misses')).toHaveText('0 / 6');
      const cells = await pattern(page);
      expect(cells.length).toBeGreaterThanOrEqual(3);
      expect(cells.every((c) => c === '')).toBe(true);
    });

    test('キーを押すと使用済みになり、キーボード入力も使える', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      await page.locator('[data-letter="e"]').click();
      await expect(page.locator('[data-letter="e"]')).toBeDisabled();
      await page.keyboard.press('a');
      await expect(page.locator('[data-letter="a"]')).toBeDisabled();
      await page.keyboard.press('1');
      await expect(page.locator('[data-letter]:disabled')).toHaveCount(2);
    });

    test('ギブアップで答えが表示され、操作できなくなる', async ({ page }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await page.locator('#hm-giveup-button').click();
      const cells = await pattern(page);
      const word = cells.join('');
      expect(word).toMatch(/^[a-z]{3,}$/);
      await expect(page.locator('#hm-status')).toHaveText(
        fill(m.gaveUp, { word: word.toUpperCase() }),
      );
      await expect(page.locator('[data-letter]:disabled')).toHaveCount(26);
      await expect(page.locator('#hm-giveup-button')).toBeDisabled();
      if (lang === 'ja')
        await expect(page.locator('#hm-meaning')).not.toBeEmpty();
      else await expect(page.locator('#hm-meaning-row')).toBeHidden();

      await page.locator('#hm-new-button').click();
      await expect(page.locator('[data-letter]:disabled')).toHaveCount(0);
      await expect(page.locator('#hm-misses')).toHaveText('0 / 6');
    });

    test('カテゴリ内の単語を絞り込んで進めると終了状態になる', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await page.locator('#hm-category').selectOption('food');
      let candidates = WORDS.food.map((e) => e.word);
      const wrong: string[] = [];
      for (let i = 0; i < 26; i++) {
        const cells = await pattern(page);
        candidates = candidates.filter(
          (w) =>
            w.length === cells.length &&
            cells.every((c, k) =>
              c === '' ? !cells.includes(w[k]) : w[k] === c,
            ) &&
            !wrong.some((l) => w.includes(l)),
        );
        expect(candidates.length).toBeGreaterThan(0);
        const known = new Set(cells.filter((c) => c !== ''));
        const counts = new Map<string, number>();
        for (const w of candidates)
          for (const l of new Set(w))
            if (!known.has(l)) counts.set(l, (counts.get(l) ?? 0) + 1);
        const next = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
        if (!next) break;
        await page.locator(`[data-letter="${next}"]`).click();
        const after = await pattern(page);
        if (!after.includes(next)) wrong.push(next);
        if (await page.locator('#hm-giveup-button').isDisabled()) break;
      }
      await expect(page.locator('#hm-giveup-button')).toBeDisabled();
      const word = (await pattern(page)).join('');
      expect(WORDS.food.map((e) => e.word)).toContain(word);
      const status = await page.locator('#hm-status').textContent();
      const wonText = fill(m.won, {
        word: word.toUpperCase(),
        n: wrong.length,
      });
      const lostText = fill(m.lost, { word: word.toUpperCase() });
      expect([wonText, lostText]).toContain(status);
    });
  });
}
