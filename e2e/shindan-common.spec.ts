import { test, expect, type Page } from './helpers/test';
import AxeBuilder from '@axe-core/playwright';
import { shindanThemes } from '../src/data/themes';
import { nekoCatImages, nekoTheme } from '../src/data/themes/neko';
import { nekoTextsJa } from '../src/i18n/shindan/neko';
import { diagnose } from '../src/lib/shindan/compose';
import { nameVariant } from '../src/lib/shindan/normalize';
import { RARITIES, type Rarity } from '../src/lib/shindan/types';

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

test.describe('猫タイプ診断: 共有', () => {
  /** 結果まで進め、Xリンクから共有URLを取り出す */
  async function finishAndGetShareUrl(page: Page, name = '') {
    await page.goto('/shindan/neko/');
    if (name) await page.getByLabel('名前（任意）').fill(name);
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerWith(page, (i) => (i * 3) % 4);
    await expect(page.locator('#shindan-title')).toBeVisible();
    const href = await page
      .getByRole('link', { name: 'Xでポスト' })
      .getAttribute('href');
    const shareUrl = new URL(href!).searchParams.get('url')!;
    return shareUrl;
  }

  test('結果画面でシェア用の画像・投稿文・URLが用意される', async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const shareUrl = await finishAndGetShareUrl(page);
    expect(shareUrl).toMatch(
      /^http:\/\/localhost:4322\/shindan\/neko\/#r=1\.1\.[A-Za-z0-9_-]{6}$/,
    );

    const x = new URL(
      (await page
        .getByRole('link', { name: 'Xでポスト' })
        .getAttribute('href'))!,
    );
    const title = (await page.locator('#shindan-title').textContent())!;
    expect(x.searchParams.get('text')).toContain(title);
    expect(x.searchParams.get('text')).toContain('#にゃんこ診断');
    const line = new URL(
      (await page
        .getByRole('link', { name: 'LINEで送る' })
        .getAttribute('href'))!,
    );
    expect(line.searchParams.get('text')).toContain(shareUrl);

    // カード画像（横長 1200×630）がブラウザ内で作られる
    const card = page.getByRole('img', { name: '結果のシェア用画像' });
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('src', /^blob:/);
    await expect
      .poll(() => card.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBe(1200);
    expect(
      await card.evaluate((img: HTMLImageElement) => img.naturalHeight),
    ).toBe(630);
    await expect(
      page.getByRole('button', { name: '画像を保存' }),
    ).toBeEnabled();

    // 縦長に切り替えると 1080×1350 で作り直す
    await page.getByLabel('縦長（スマホ向け）').check();
    await expect
      .poll(() => card.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBe(1080);
    expect(
      await card.evaluate((img: HTMLImageElement) => img.naturalHeight),
    ).toBe(1350);

    // 保存するとPNGがダウンロードされる
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: '画像を保存' }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(
      /^nyanko-shindan-neko-[a-z-]+-portrait\.png$/,
    );
    expect(errors).toEqual([]);
  });

  test('名前を入れたときだけ「画像に名前を載せる」が出る', async ({ page }) => {
    await finishAndGetShareUrl(page);
    await expect(page.getByLabel('画像に名前を載せる')).toBeHidden();
    await page
      .getByRole('button', { name: '最初からもう一度診断する' })
      .click();
    await page.getByLabel('名前（任意）').fill('たま');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerWith(page, () => 0);
    const checkbox = page.getByLabel('画像に名前を載せる');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(
      page.getByRole('img', { name: '結果のシェア用画像' }),
    ).toHaveAttribute('src', /^blob:/);
  });

  test('共有URLを開くと同じ結果が「友達の結果」として出て、URLからハッシュが消える', async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const shareUrl = await finishAndGetShareUrl(page, 'たま');
    const title = await page.locator('#shindan-title').textContent();
    const type = (await page.locator('#shindan-type').textContent())!;
    // 名前はURLに入らない
    expect(shareUrl).not.toContain(encodeURIComponent('たま'));

    await page.goto('about:blank');
    await page.goto(shareUrl);
    await expect(page.locator('#shindan-title')).toHaveText(title!);
    await expect(page.locator('#shindan-result-for')).toHaveText('友達の結果');
    await expect(page.locator('#shindan-type')).toHaveText(
      type.replace('あなたを猫に例えると', '猫に例えると'),
    );
    await expect(page.locator('#shindan-share')).toBeHidden();
    await expect(page).toHaveURL('http://localhost:4322/shindan/neko/');

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect.soft(axe.violations.map((v) => v.id)).toEqual([]);

    // 再読み込みしても友達の結果のまま（タブ内の sessionStorage）
    await page.reload();
    await expect(page.locator('#shindan-title')).toHaveText(title!);

    // 再読み込み以外で開き直すと持ち越さない（その後の再読み込みでも開始画面）
    await page.goto('/shindan/neko/');
    await expect(
      page.getByRole('button', { name: '診断をはじめる' }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('button', { name: '診断をはじめる' }),
    ).toBeVisible();

    // 共有URLから開き直し、「あなたも診断してみる」
    await page.goto(shareUrl);
    await expect(page.locator('#shindan-title')).toHaveText(title!);
    // 「あなたも診断してみる」で開始画面へ。以後は再読み込みしても開始画面
    await page
      .getByRole('button', { name: 'あなたも診断してみる' })
      .first()
      .click();
    await expect(
      page.getByRole('button', { name: '診断をはじめる' }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('button', { name: '診断をはじめる' }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('ページを開いたままハッシュが変わっても結果を表示する', async ({
    page,
  }) => {
    const code = diagnose(nekoTheme, Array(12).fill(1), 0)!.code;
    await page.goto('/shindan/neko/');
    await page.evaluate((c) => {
      location.hash = `r=${c}`;
    }, code);
    await expect(page.locator('#shindan-result-for')).toHaveText('友達の結果');
    await expect(page).toHaveURL('http://localhost:4322/shindan/neko/');
  });

  /** 表示中のシェア用画像のサイズを待つ（naturalWidth/Height で判定） */
  async function expectCardSize(page: Page, width: number, height: number) {
    const card = page.getByRole('img', { name: '結果のシェア用画像' });
    await expect
      .poll(() =>
        card.evaluate(
          (img: HTMLImageElement) => `${img.naturalWidth}x${img.naturalHeight}`,
        ),
      )
      .toBe(`${width}x${height}`);
  }

  /** 表示中のシェア用画像の画素をハッシュにする（同じ入力なら同じ値になる） */
  async function cardPixelHash(page: Page): Promise<string> {
    const card = page.getByRole('img', { name: '結果のシェア用画像' });
    return card.evaluate((img: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let h = 0;
      for (let i = 0; i < data.length; i++) {
        h = (Math.imul(h, 31) + data[i]) | 0;
      }
      return `${canvas.width}x${canvas.height}:${h}`;
    });
  }

  test('シェア画像の形と名前の選択を素早く切り替えても、最後の選択の画像になる', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const errors = collectErrors(page);
    await finishAndGetShareUrl(page, 'たま');
    const save = page.getByRole('button', { name: '画像を保存' });
    const portrait = page.getByLabel('縦長（スマホ向け）');
    const landscape = page.getByLabel('横長（X・LINE向け）');
    // 前の画像が描き終わる前に次の選択をする（古い描画が後から上書きしないこと）
    await portrait.check();
    await landscape.check();
    await portrait.check();
    await landscape.check();
    await portrait.check();
    await page.getByLabel('画像に名前を載せる').check();
    await expect(save).toBeEnabled();
    await expectCardSize(page, 1080, 1350);
    const rapid = await cardPixelHash(page);

    // 同じ結果を、選択を1回ずつにして作り直した画像と一致する
    await page.goto('/shindan/neko/');
    await page.getByLabel('名前（任意）').fill('たま');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerWith(page, (i) => (i * 3) % 4);
    await expect(page.locator('#shindan-title')).toBeVisible();
    await expect(save).toBeEnabled();
    await page.getByLabel('縦長（スマホ向け）').check();
    await page.getByLabel('画像に名前を載せる').check();
    await expect(save).toBeEnabled();
    await expectCardSize(page, 1080, 1350);
    expect(await cardPixelHash(page)).toBe(rapid);
    expect(errors).toEqual([]);
  });

  test('結果表示中に「最初からもう一度」を押しても、古い結果の画像は残らず、別の結果の画像に差し替わる', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const errors = collectErrors(page);
    await finishAndGetShareUrl(page, 'たま');
    // 画像の生成が終わる前にやり直す
    await page
      .getByRole('button', { name: '最初からもう一度診断する' })
      .click();
    // 非表示の要素は role で引けないので id で見る（src が外れていること）
    await expect(page.locator('#shindan-card')).not.toHaveAttribute('src');

    await page.getByLabel('名前（任意）').fill('');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerWith(page, () => 0);
    await expect(page.locator('#shindan-title')).toBeVisible();
    const save = page.getByRole('button', { name: '画像を保存' });
    await expect(save).toBeEnabled();
    await expectCardSize(page, 1200, 630);
    const afterRestart = await cardPixelHash(page);
    const x = new URL(
      (await page
        .getByRole('link', { name: 'Xでポスト' })
        .getAttribute('href'))!,
    );
    expect(x.searchParams.get('text')).toContain(
      (await page.locator('#shindan-title').textContent())!,
    );

    // 同じ回答・名前で最初から作った画像と一致する（古い結果の画像が混ざらない）
    await page.goto('/shindan/neko/');
    await page.getByRole('button', { name: '診断をはじめる' }).click();
    await answerWith(page, () => 0);
    await expect(save).toBeEnabled();
    await expectCardSize(page, 1200, 630);
    expect(await cardPixelHash(page)).toBe(afterRestart);
    expect(errors).toEqual([]);
  });

  test('名前の絵文字・30文字・空白のみでも画像が作れ、空白のみなら名前の選択肢は出ない', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const errors = collectErrors(page);
    const cases: { name: string; hasNameOption: boolean }[] = [
      { name: '🐱🐾', hasNameOption: true },
      { name: 'あ'.repeat(30), hasNameOption: true },
      { name: '👨‍👩‍👧'.repeat(10), hasNameOption: true },
      { name: '   ', hasNameOption: false },
      { name: '​‍', hasNameOption: false },
    ];
    for (const { name, hasNameOption } of cases) {
      await page.goto('/shindan/neko/');
      await page.getByLabel('名前（任意）').fill(name);
      await page.getByRole('button', { name: '診断をはじめる' }).click();
      await answerWith(page, () => 2);
      await expect(page.locator('#shindan-title')).toBeVisible();
      const checkbox = page.getByLabel('画像に名前を載せる');
      if (hasNameOption) {
        await expect(checkbox).toBeVisible();
        await checkbox.check();
      } else {
        await expect(checkbox).toBeHidden();
      }
      await expect(
        page.getByRole('button', { name: '画像を保存' }),
      ).toBeEnabled();
      await expectCardSize(page, 1200, 630);
      await page.getByLabel('縦長（スマホ向け）').check();
      await expectCardSize(page, 1080, 1350);
    }
    expect(errors).toEqual([]);
  });

  test('全レア度（N〜LR）× 横長・縦長で画像が作れる', async ({ page }) => {
    test.setTimeout(240_000);
    const errors = collectErrors(page);
    // 同じ回答でも名前で結果（レア度）が変わるので、レア度ごとに名前を探す
    const answers = Array.from({ length: 12 }, (_, i) => i % 4);
    const found = new Map<Rarity, string>();
    for (let k = 0; k < 5000 && found.size < RARITIES.length; k++) {
      const name = `テスト${k}`;
      const { rarity } = diagnose(nekoTheme, answers, nameVariant(name))!;
      if (!found.has(rarity)) found.set(rarity, name);
    }
    expect([...found.keys()].sort()).toEqual([...RARITIES].sort());

    for (const [rarity, name] of found) {
      await page.goto('/shindan/neko/');
      await page.getByLabel('名前（任意）').fill(name);
      await page.getByRole('button', { name: '診断をはじめる' }).click();
      await answerWith(page, (i) => i % 4);
      await expect(page.locator('#shindan-rarity')).toHaveText(rarity);
      await expect(
        page.getByRole('button', { name: '画像を保存' }),
      ).toBeEnabled();
      await expectCardSize(page, 1200, 630);
      await page.getByLabel('画像に名前を載せる').check();
      await expectCardSize(page, 1200, 630);
      await page.getByLabel('縦長（スマホ向け）').check();
      await expectCardSize(page, 1080, 1350);
      await expect(
        page.getByRole('button', { name: '画像を保存' }),
      ).toBeEnabled();
    }
    expect(errors).toEqual([]);
  });

  test('友達の結果画面を明るい／ダークで表示でき、axe違反がなく、375pxで横スクロールしない', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 375, height: 800 });
    const shareUrl = await finishAndGetShareUrl(page, 'たま');
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('about:blank');
      await page.goto(shareUrl);
      await expect(page.locator('#shindan-result-for')).toHaveText(
        '友達の結果',
      );
      await expect(page.locator('#shindan-shared-lead')).toBeVisible();
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

  test('共有URLのエンコード違い（%2E・キーの%72）も同じ結果を開き、余分な文字が付いたものは開始画面', async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const shareUrl = await finishAndGetShareUrl(page, 'たま');
    const title = (await page.locator('#shindan-title').textContent())!;
    const code = new URL(shareUrl).hash.replace(/^#r=/, '');
    const samePlace = [
      `#r=${code.replaceAll('.', '%2E')}`,
      `#%72=${code}`,
      `#r=${code}&`,
    ];
    for (const hash of samePlace) {
      await page.goto('about:blank');
      await page.goto(`/shindan/neko/${hash}`);
      await expect(page.locator('#shindan-result-for')).toHaveText(
        '友達の結果',
      );
      await expect(page.locator('#shindan-title')).toHaveText(title);
      await expect(page).toHaveURL('http://localhost:4322/shindan/neko/');
    }
    for (const hash of [`#r=${code}%0A`, `#r=${code}%20`]) {
      await page.goto('about:blank');
      await page.goto(`/shindan/neko/${hash}`);
      await expect(
        page.getByRole('button', { name: '診断をはじめる' }),
      ).toBeVisible();
      await expect(page.locator('[data-screen="result"]')).toBeHidden();
    }
    expect(errors).toEqual([]);
  });

  for (const hash of [
    '#r=garbage',
    '#r=1.1.AAAAA',
    '#r=9.1.AAAAAA',
    '#r=1.99.AAAAAA',
    '#r=1.1.%3Cscript%3E',
  ]) {
    test(`壊れた共有URL（${hash}）は開始画面を出し、エラーにならない`, async ({
      page,
    }) => {
      const errors = collectErrors(page);
      await page.goto(`/shindan/neko/${hash}`);
      await expect(
        page.getByRole('button', { name: '診断をはじめる' }),
      ).toBeVisible();
      await expect(page.locator('[data-screen="result"]')).toBeHidden();
      await expect(page).toHaveURL('http://localhost:4322/shindan/neko/');
      expect(errors).toEqual([]);
    });
  }
});
