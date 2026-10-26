import { test, expect, type Page } from './helpers/test';
import { ANSWER_WORDS } from '../src/lib/tools/word-guess-game';

const PAGES = {
  ja: '/tools/word-guess-game/',
  en: '/en/tools/word-guess-game/',
} as const;

type Msg = Record<string, string>;

async function readMsg(page: Page): Promise<Msg> {
  return page
    .locator('#wg-root')
    .evaluate((el) => ({ ...(el as HTMLElement).dataset }) as Msg);
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in values ? String(values[k]) : m,
  );

async function row(page: Page, r: number): Promise<string> {
  const cells = await page.locator(`[data-row="${r}"]`).allTextContents();
  return cells.join('');
}

for (const lang of ['ja', 'en'] as const) {
  test.describe(`英単語5文字当て（${lang}）`, () => {
    test('初期表示は30マスが空で、キーボードが使える', async ({ page }) => {
      await page.goto(PAGES[lang]);
      await expect(page.locator('#wg-board [data-row]')).toHaveCount(30);
      expect(await row(page, 0)).toBe('');
      await expect(page.locator('[data-key]')).toHaveCount(28);
      await expect(page.locator('#wg-attempts')).toHaveText('0 / 6');
    });

    test('画面キーとキーボードで入力でき、削除もできる', async ({ page }) => {
      await page.goto(PAGES[lang]);
      await page.locator('[data-key="h"]').click();
      await page.locator('[data-key="o"]').click();
      await page.keyboard.press('u');
      await page.keyboard.press('1');
      expect((await row(page, 0)).toLowerCase()).toBe('hou');
      await page.keyboard.press('Backspace');
      expect((await row(page, 0)).toLowerCase()).toBe('ho');
      await page.locator('[data-key="back"]').click();
      expect((await row(page, 0)).toLowerCase()).toBe('h');
    });

    test('画面キーで入力して Enter を1回押すと1回だけ送信され、フォーカスは残らない', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      for (const k of ['h', 'o', 'u', 's', 'e']) {
        await page.locator(`[data-key="${k}"]`).click();
      }
      await page.locator('[data-key="enter"]').click();
      await expect(page.locator('#wg-attempts')).toHaveText('1 / 6');
      // 送信後も Enter を押し直すと、フォーカスの残ったキーが再度押されない
      await page.keyboard.press('Enter');
      await expect(page.locator('#wg-attempts')).toHaveText('1 / 6');
      expect((await row(page, 1)).trim()).toBe('');
      await expect(page.locator('[data-key="h"]')).not.toBeFocused();
    });

    test('文字数不足とリスト外の単語はエラーで、回数に数えない', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await page.keyboard.type('ab');
      await page.keyboard.press('Enter');
      await expect(page.locator('#wg-error')).toHaveText(m.errorLength);
      await page.keyboard.type('xyz');
      await page.keyboard.press('Enter');
      await expect(page.locator('#wg-error')).toHaveText(m.errorUnknown);
      await expect(page.locator('#wg-attempts')).toHaveText('0 / 6');
      await page.keyboard.press('Backspace');
      await expect(page.locator('#wg-error')).toBeHidden();
    });

    test('ギブアップで答えが表示され、新しいゲームで再開できる', async ({
      page,
    }) => {
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      await page.locator('#wg-giveup-button').click();
      const status = (await page.locator('#wg-status').textContent()) ?? '';
      const word = ANSWER_WORDS.find(
        (w) => status === fill(m.gaveUp, { word: w.toUpperCase() }),
      );
      expect(word).toBeTruthy();
      await expect(page.locator('#wg-giveup-button')).toBeDisabled();
      await expect(page.locator('[data-key="a"]')).toBeDisabled();

      await page.locator('#wg-new-button').click();
      await expect(page.locator('#wg-giveup-button')).toBeEnabled();
      await expect(page.locator('[data-key="a"]')).toBeEnabled();
      await expect(page.locator('#wg-status')).toHaveText(m.started);
    });

    test('6回外すとゲームオーバーになり、結果をコピーできる', async ({
      page,
      context,
    }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.goto(PAGES[lang]);
      const m = await readMsg(page);
      // 答えと異なる単語を使うため、答えが「house」の場合に備えて2語を用意する
      for (let i = 0; i < 6; i++) {
        await page.keyboard.type(i % 2 === 0 ? 'house' : 'about');
        await page.keyboard.press('Enter');
        if (await page.locator('#wg-giveup-button').isDisabled()) break;
      }
      await expect(page.locator('#wg-giveup-button')).toBeDisabled();
      const status = (await page.locator('#wg-status').textContent()) ?? '';
      const lost = ANSWER_WORDS.some(
        (w) => status === fill(m.lost, { word: w.toUpperCase() }),
      );
      const won =
        /\d/.test(status) &&
        status === fill(m.won, { n: status.match(/\d+/)?.[0] ?? '' });
      expect(lost || won).toBe(true);

      await page.locator('#wg-copy-button').click();
      await expect(page.locator('#wg-status')).toHaveText(m.copied);
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied).toMatch(/^[🟩🟨⬛\r\n]+$/u);
    });
  });
}
