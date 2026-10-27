import { test, expect, type Page } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';
import { shindanThemes } from '../src/data/themes';
import { nekoCatImages, nekoTheme } from '../src/data/themes/neko';
import { nekoTextsJa } from '../src/i18n/shindan/neko';
import { diagnose } from '../src/lib/shindan/compose';

// 診断セクション（/shindan/）共通の検証（設計書16.7 #10）。
//   - 375px幅で表示され、h1が1つ・横スクロールなし・コンソールエラーなし
//   - ツール用サイドバー・コマンドパレットを出さない
//   - 日本語のみのため hreflang（<link rel="alternate">）を出さない
//   - axe（WCAG 2.x A/AA）の違反がない
// テーマ固有の流れ（質問 → 結果）は下の「猫タイプ診断」で検証する。

const pages = [
  '/shindan/',
  ...shindanThemes.map((theme) => `/shindan/${theme.spec.id}/`),
];

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

test.describe('診断セクション共通', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  for (const path of pages) {
    test(`${path}: 375px幅で表示され、ツール用の外枠とhreflangを出さない`, async ({
      page,
    }) => {
      const errors = collectErrors(page);
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect.soft(overflow).toBe(false);

      await expect.soft(page.locator('#sidebar')).toHaveCount(0);
      await expect.soft(page.locator('#command-palette')).toHaveCount(0);
      await expect
        .soft(page.locator('link[rel="alternate"][hreflang]'))
        .toHaveCount(0);
      await expect
        .soft(page.locator('link[rel="canonical"]'))
        .toHaveAttribute('href', `https://nyankotools.com${path}`);

      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect.soft(axe.violations.map((v) => v.id)).toEqual([]);
      expect.soft(errors).toEqual([]);
    });
  }

  test('ツール一覧（トップ）へ戻るリンクがある', async ({ page }) => {
    await page.goto('/shindan/');
    await page.getByRole('link', { name: 'ツール一覧へ' }).click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('猫タイプ診断', () => {
  /** 12問すべてで index 番目の選択肢を選ぶ */
  async function answerAll(page: Page, index: number) {
    for (let i = 1; i <= 12; i++) {
      await expect(page.locator('#shindan-progress-text')).toHaveText(
        `質問 ${i} / 12`,
      );
      await page.locator('#shindan-choices button').nth(index).click();
    }
  }

  test('質問に答えると結果が表示され、同じ回答なら同じ結果になる', async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.goto('/shindan/neko/');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await expect(page.locator('#shindan-question')).toBeFocused();
    await answerAll(page, 0);

    await expect(page.locator('#shindan-analyzing')).toBeVisible();
    await expect(page.locator('#shindan-analyzing')).toBeFocused();
    await expect(page.getByRole('status')).toHaveText('分析中…');
    const title = page.locator('#shindan-title');
    await expect(title).toBeVisible();
    await expect(title).toBeFocused();
    await expect(page.locator('#shindan-rarity')).toHaveText(
      /^(N|R|SR|SSR|UR|LR)$/,
    );
    await expect(page.locator('#shindan-strengths li')).toHaveCount(3);
    await expect(page.locator('#shindan-axes dt')).toHaveCount(4);
    await expect(page.locator('#shindan-cat')).toHaveAttribute(
      'src',
      /^\/shindan\/neko\/cats\/[a-z-]+\.svg$/,
    );
    const imageLoaded = await page
      .locator('#shindan-cat')
      .evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      );
    expect(imageLoaded).toBe(true);
    const firstTitle = await title.textContent();
    expect(firstTitle).toBeTruthy();

    // もう一度、同じ回答で診断する
    await page
      .getByRole('button', { name: '最初からもう一度診断する' })
      .click();
    await expect(
      page.getByRole('button', { name: '診断をはじめる' }),
    ).toBeVisible();
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerAll(page, 0);
    await expect(title).toBeVisible();
    await expect(title).toHaveText(firstTitle!);
    expect(errors).toEqual([]);
  });

  test('名前を入れると見出しに名前が出て、猫のタイプは変わらない', async ({
    page,
  }) => {
    await page.goto('/shindan/neko/');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerAll(page, 3);
    await expect(page.locator('#shindan-title')).toBeVisible();
    const type = await page.locator('#shindan-type').textContent();
    await expect(page.locator('#shindan-result-for')).toHaveText(
      'あなたの結果',
    );

    await page
      .getByRole('button', { name: '最初からもう一度診断する' })
      .click();
    await page.getByLabel('名前（任意）').fill('たま');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerAll(page, 3);
    await expect(page.locator('#shindan-title')).toBeVisible();
    await expect(page.locator('#shindan-result-for')).toHaveText(
      'たまさんの結果',
    );
    await expect(page.locator('#shindan-type')).toHaveText(type!);
  });

  test('「1つ前に戻る」で前の質問に戻り、1問目からは開始画面に戻る', async ({
    page,
  }) => {
    await page.goto('/shindan/neko/');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    const firstQuestion = await page.locator('#shindan-question').textContent();
    await page.locator('#shindan-choices button').first().click();
    await expect(page.locator('#shindan-progress-text')).toHaveText(
      '質問 2 / 12',
    );
    await expect(page.locator('#shindan-remaining')).toHaveText('あと11問');

    await page.getByRole('button', { name: '1つ前に戻る' }).click();
    await expect(page.locator('#shindan-progress-text')).toHaveText(
      '質問 1 / 12',
    );
    await expect(page.locator('#shindan-question')).toHaveText(firstQuestion!);

    await page.getByRole('button', { name: '1つ前に戻る' }).click();
    await expect(
      page.getByRole('button', { name: '診断をはじめる' }),
    ).toBeVisible();
  });

  test('16タイプの一覧と注意書きを静的に表示する', async ({ page }) => {
    await page.goto('/shindan/neko/');
    await expect(
      page.getByRole('heading', { name: '16タイプの猫' }),
    ).toBeVisible();
    await expect(
      page.locator('section:has(h2:text("16タイプの猫")) li'),
    ).toHaveCount(16);
    await expect(
      page.locator('li', { hasText: '医学的・心理学的な診断ではありません' }),
    ).toBeVisible();
  });

  test('16タイプ一覧の画像がすべて読み込める（遅延読み込み・CSP下）', async ({
    page,
  }) => {
    await page.goto('/shindan/neko/');
    const images = page.locator('section:has(h2:text("16タイプの猫")) li img');
    await expect(images).toHaveCount(16);
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
  });

  test('ヘッダーの英語版リンクとテーマ切替が動く', async ({ page }) => {
    await page.goto('/shindan/');
    await expect(page.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'href',
      '/en/',
    );
    const toggle = page.locator('#theme-toggle-shindan');
    for (
      let i = 0;
      i < 3 && (await toggle.getAttribute('data-theme-current')) !== 'dark';
      i++
    ) {
      await toggle.click();
    }
    await expect(toggle).toHaveAttribute('data-theme-current', 'dark');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });
});

/** 猫タイプ全16種 → それを出す回答（名前なし = variant 0） */
const answersByType = (() => {
  const map = new Map<string, number[]>();
  for (let mask = 0; mask < 16; mask++) {
    const answers = nekoTheme.scoring.questions.map((q) => {
      const axisIndex = nekoTheme.scoring.axes.findIndex(
        (a) => q.choices[0].effects[a.id] !== undefined,
      );
      const axisId = nekoTheme.scoring.axes[axisIndex].id;
      const target = (mask >> axisIndex) & 1 ? -2 : 2;
      return q.choices.findIndex((c) => c.effects[axisId] === target);
    });
    const result = diagnose(nekoTheme, answers, 0);
    if (result) map.set(result.typeId, answers);
  }
  return map;
})();

/** 全問を pick(質問番号) 番目の選択肢で答える */
async function answerWith(page: Page, pick: (questionIndex: number) => number) {
  const total = nekoTheme.scoring.questions.length;
  for (let i = 0; i < total; i++) {
    await expect(page.locator('#shindan-progress-text')).toHaveText(
      `質問 ${i + 1} / ${total}`,
    );
    await page.locator('#shindan-choices button').nth(pick(i)).click();
  }
}

test.describe('猫タイプ診断: 操作と入力の境界', () => {
  test('全16タイプの結果が画面に出て、画像が読み込める', async ({ page }) => {
    test.setTimeout(180_000);
    const errors = collectErrors(page);
    expect(answersByType.size).toBe(16);
    await page.goto('/shindan/neko/');
    for (const [typeId, answers] of answersByType) {
      await page.getByRole('button', { name: '診断をはじめる' }).click();
      await answerWith(page, (i) => answers[i]);
      await expect(page.locator('#shindan-type')).toHaveText(
        `あなたを猫に例えると「${nekoTextsJa.types[typeId].name}」タイプ`,
      );
      const cat = page.locator('#shindan-cat');
      await expect(cat).toHaveAttribute('src', nekoCatImages[typeId].src);
      await expect
        .poll(() =>
          cat.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await page
        .getByRole('button', { name: '最初からもう一度診断する' })
        .click();
    }
    expect(errors).toEqual([]);
  });

  test('質問を切り替えた直後の2回押しで、次の質問を答えたことにならない', async ({
    page,
  }) => {
    await page.goto('/shindan/neko/');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    // Q1 の選択肢も開始直後は一時無効なので、有効化を待ってから2回クリックする
    await expect(page.locator('#shindan-choices button').first()).toBeEnabled();
    // 同期的に2回クリックする（素早い2回タップの再現）
    const state = await page.evaluate(() => {
      const first = document.querySelector<HTMLButtonElement>(
        '#shindan-choices button',
      )!;
      first.click();
      const next = [
        ...document.querySelectorAll<HTMLButtonElement>(
          '#shindan-choices button',
        ),
      ];
      const allDisabled = next.every((b) => b.disabled);
      next[0].click();
      return {
        allDisabled,
        progress: document.getElementById('shindan-progress-text')!.textContent,
      };
    });
    expect(state).toEqual({ allDisabled: true, progress: '質問 2 / 12' });
    await expect(page.locator('#shindan-choices button').first()).toBeEnabled();
    await expect(page.locator('#shindan-progress-text')).toHaveText(
      '質問 2 / 12',
    );
    await page.locator('#shindan-choices button').first().click();
    await expect(page.locator('#shindan-progress-text')).toHaveText(
      '質問 3 / 12',
    );
  });

  test('「1つ前に戻る」の連打でも状態が壊れず、開始画面から最後まで進める', async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.goto('/shindan/neko/');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    for (let i = 0; i < 3; i++) {
      await page.locator('#shindan-choices button').first().click();
    }
    await expect(page.locator('#shindan-progress-text')).toHaveText(
      '質問 4 / 12',
    );
    // 4回連続で押す（3回で1問目に戻り、4回目は開始画面に戻る）
    await page.evaluate(() => {
      const back = document.getElementById('shindan-back')!;
      for (let i = 0; i < 4; i++) back.click();
    });
    await expect(
      page.getByRole('button', { name: '診断をはじめる' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: '1つ前に戻る' }),
    ).toBeHidden();

    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await expect(page.locator('#shindan-progress-text')).toHaveText(
      '質問 1 / 12',
    );
    await answerWith(page, () => 0);
    await expect(page.locator('#shindan-title')).toBeFocused();
  });

  test('名前が空白のみ・見えない文字だけなら「あなたの結果」になる', async ({
    page,
  }) => {
    test.setTimeout(90_000);
    for (const name of ['   ', ` ${String.fromCharCode(0x3000)} `]) {
      await page.goto('/shindan/neko/');
      await page.getByLabel('名前（任意）').fill(name);
      await page.getByRole('button', { name: '診断をはじめる' }).click();
      await answerWith(page, () => 0);
      await expect(page.locator('#shindan-result-for')).toHaveText(
        'あなたの結果',
      );
    }
  });

  // trim() では消えない見えない文字（ゼロ幅スペース等）だけの名前も、名前なしとして扱う
  test('見えない文字だけの名前も「あなたの結果」になる', async ({ page }) => {
    await page.goto('/shindan/neko/');
    await page.getByLabel('名前（任意）').fill('​‍﻿');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerWith(page, () => 0);
    await expect(page.locator('#shindan-result-for')).toHaveText(
      'あなたの結果',
      { timeout: 3000 },
    );
  });

  test('名前は30文字で打ち止めされ、HTMLとして解釈されない', async ({
    page,
  }) => {
    await page.goto('/shindan/neko/');
    const input = page.getByLabel('名前（任意）');
    await input.fill('あ'.repeat(40));
    await expect(input).toHaveValue('あ'.repeat(30));
    // 見た目の文字数で数えるので、絵文字（サロゲートペア・ZWJ結合）も30個まで入る
    await input.fill('🐱'.repeat(40));
    await expect(input).toHaveValue('🐱'.repeat(30));
    await input.fill('👨‍👩‍👧'.repeat(40));
    await expect(input).toHaveValue('👨‍👩‍👧'.repeat(30));

    await input.fill('<b>x</b>');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerWith(page, () => 1);
    await expect(page.locator('#shindan-result-for')).toHaveText(
      '<b>x</b>さんの結果',
    );
    await expect(page.locator('#shindan-result-for b')).toHaveCount(0);
  });

  test('キーボードだけで開始から結果まで進める', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto('/shindan/neko/');
    await page.getByLabel('名前（任意）').focus();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: '診断をはじめる' }),
    ).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#shindan-question')).toBeFocused();
    for (let i = 0; i < 12; i++) {
      // 切り替え直後の一時無効化が解けてから Tab で選択肢へ移る
      await expect(
        page.locator('#shindan-choices button').first(),
      ).toBeEnabled();
      await page.keyboard.press('Tab');
      await expect(
        page.locator('#shindan-choices button').first(),
      ).toBeFocused();
      await page.keyboard.press('Enter');
    }
    await expect(page.locator('#shindan-title')).toBeFocused();
  });

  test('明るい／ダークの結果画面で axe 違反がなく、375pxで横スクロールしない', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 375, height: 800 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/shindan/neko/');
      await page.getByRole('button', { name: '診断をはじめる' }).click();
      await answerWith(page, (i) => i % 4);
      await expect(page.locator('#shindan-title')).toBeFocused();
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect.soft(overflow, colorScheme).toBe(false);
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect
        .soft(
          axe.violations.map((v) => v.id),
          colorScheme,
        )
        .toEqual([]);
    }
  });
});
