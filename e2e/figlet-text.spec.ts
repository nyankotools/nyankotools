import { readFile } from 'node:fs/promises';
import { test, expect } from './helpers/test';

const OUTPUT = '#fig-output';
const NOTICE = '#fig-notice';

test.describe('ASCIIアート文字（日本語版）', () => {
  test('直接アクセスで h1 が表示され、初期値 Nyanko がアート文字になる', async ({
    page,
  }) => {
    await page.goto('/tools/figlet-text/');

    await expect(page.locator('main h1')).toHaveText(
      'ASCIIアート文字（テキストバナー）生成',
    );
    await expect(page.locator('#fig-input')).toHaveValue('Nyanko');
    await expect(page.locator('#fig-font')).toHaveValue('standard');

    // 初期は standard 書体（既定で書体を遅延読込してから描画される）
    await expect(page.locator(OUTPUT)).toContainText('_|');
    const text = await page.locator(OUTPUT).textContent();
    expect(text).not.toContain('Nyanko');
    expect(text!.split('\n').length).toBeGreaterThanOrEqual(5);
    await expect(page.locator(NOTICE)).toBeHidden();
  });

  test('書体を切り替えると出力が変わり、Block は █ で描かれる', async ({
    page,
  }) => {
    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    const standardOutput = await page.locator(OUTPUT).textContent();

    await page.locator('#fig-font').selectOption('slant');
    await expect(page.locator(OUTPUT)).not.toHaveText(standardOutput!);
    const slantOutput = await page.locator(OUTPUT).textContent();
    expect(slantOutput).not.toBe(standardOutput);

    await page.locator('#fig-font').selectOption('block');
    await expect(page.locator(OUTPUT)).toContainText('█');
    await expect(page.locator(NOTICE)).toBeHidden();
  });

  test('書体の動的読込（doom など）が本番のCSP下で成功し、エラー通知が出ない', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');

    for (const font of ['small', 'slant', 'big', 'mini', 'doom']) {
      const before = await page.locator(OUTPUT).textContent();
      await page.locator('#fig-font').selectOption(font);
      await expect(page.locator(OUTPUT)).not.toHaveText(before!);
      await expect(page.locator(NOTICE)).toBeHidden();
    }
    expect(
      consoleErrors.filter((e) => /Content Security|CSP/i.test(e)),
    ).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('書体ファイルの読込に失敗すると、読込エラーの通知が出て出力は空になる', async ({
    page,
  }) => {
    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');

    // 初回表示後に、遅延読込される書体のチャンクだけを失敗させる
    await page.route('**/_astro/*.js', (route) => route.abort());
    await page.locator('#fig-font').selectOption('doom');

    await expect(page.locator(NOTICE)).toBeVisible();
    await expect(page.locator(NOTICE)).toContainText(
      '書体の読み込みに失敗しました',
    );
    // 古い結果は残さない（コピー・保存の対象も空になる）
    await expect(page.locator(OUTPUT)).toHaveText('');
    await page.locator('#fig-copy-button').click();
    await expect(page.locator('#fig-status')).toHaveText('');
  });

  test('字間を変えると出力が変わる（詰めない と 重ねて詰める）', async ({
    page,
  }) => {
    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');

    await page.locator('#fig-layout').selectOption('full');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    const fullOutput = await page.locator(OUTPUT).textContent();

    await page.locator('#fig-layout').selectOption('smush');
    await expect(page.locator(OUTPUT)).not.toHaveText(fullOutput!);
  });

  test('日本語を入力すると未対応の通知が出て、アートには含まれない', async ({
    page,
  }) => {
    await page.goto('/tools/figlet-text/');

    await page.locator('#fig-input').fill('にゃんこ');

    await expect(page.locator(NOTICE)).toBeVisible();
    await expect(page.locator(NOTICE)).toContainText(
      '選んだ書体に字形がない文字は表示していません',
    );
    await expect(page.locator(NOTICE)).toContainText('に');
    await expect(page.locator(OUTPUT)).toHaveText(
      'テキストを入力すると、ここにアート文字が表示されます。',
    );
  });

  test('コメント形式「// 行コメント」でコピーすると各行に // が付く', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    const plainLines = (await page.locator(OUTPUT).textContent())!.split('\n');

    await page.locator('#fig-comment').selectOption('slash');
    await expect(page.locator(OUTPUT)).toContainText('// ');
    await page.locator('#fig-copy-button').click();
    await expect(page.locator('#fig-status')).toHaveText('コピーしました');

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    // Windows のクリップボードは改行を CRLF で返すことがあるので正規化する
    const lines = clipboardText.replace(/\r\n/g, '\n').split('\n');
    expect(lines).toHaveLength(plainLines.length);
    for (const line of lines) {
      expect(line.startsWith('//')).toBe(true);
    }
    expect(lines[0]).toBe('// ' + plainLines[0]);
  });

  test('テキストファイルで保存すると ascii-banner.txt がダウンロードされ、内容が出力と一致する', async ({
    page,
  }) => {
    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    const shown = (await page.locator(OUTPUT).textContent())!;

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#fig-download-button').click(),
    ]);
    expect(download.suggestedFilename()).toBe('ascii-banner.txt');

    const path = await download.path();
    const saved = await readFile(path!, 'utf8');
    expect(saved).toBe(shown + '\n');
  });

  test('200文字を超えると先頭200文字だけ変換し、通知を出す', async ({
    page,
  }) => {
    await page.goto('/tools/figlet-text/');

    await page.locator('#fig-input').fill('A'.repeat(200));
    await expect(page.locator(NOTICE)).toBeHidden();
    const exact = await page.locator(OUTPUT).textContent();

    await page.locator('#fig-input').fill('A'.repeat(201));
    await expect(page.locator(NOTICE)).toBeVisible();
    await expect(page.locator(NOTICE)).toContainText('200');
    // 201文字目は描画されず、200文字の結果と一致する
    await expect(page.locator(OUTPUT)).toHaveText(exact!);
  });
});

test.describe('ASCII Art Text Generator (English)', () => {
  test('直接アクセスで英語の h1 が表示され、初期出力がアート文字になる', async ({
    page,
  }) => {
    await page.goto('/en/tools/figlet-text/');

    await expect(page.locator('main h1')).toHaveText(
      'ASCII Art Text Generator (Text Banner)',
    );
    await expect(page.locator(OUTPUT)).toContainText('_|');
    await expect(page.locator(NOTICE)).toBeHidden();
  });

  test('英語版でも書体切替・コメント付きコピーが動く', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/en/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    const standardOutput = await page.locator(OUTPUT).textContent();

    await page.locator('#fig-font').selectOption('doom');
    await expect(page.locator(OUTPUT)).not.toHaveText(standardOutput!);

    await page.locator('#fig-comment').selectOption('hash');
    await page.locator('#fig-copy-button').click();
    await expect(page.locator('#fig-status')).toHaveText('Copied');
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    for (const line of clipboardText.split('\n')) {
      expect(line.startsWith('#')).toBe(true);
    }
  });

  test('英語版で日本語を入力すると英語の未対応通知が出る', async ({ page }) => {
    await page.goto('/en/tools/figlet-text/');

    await page.locator('#fig-input').fill('猫');

    await expect(page.locator(NOTICE)).toBeVisible();
    await expect(page.locator(NOTICE)).toContainText(
      'The selected font has no shapes for these characters',
    );
  });

  test('英語版で200文字を超えると英語の通知が出る', async ({ page }) => {
    await page.goto('/en/tools/figlet-text/');

    await page.locator('#fig-input').fill('B'.repeat(250));

    await expect(page.locator(NOTICE)).toContainText(
      'only the first 200 characters are converted',
    );
  });
});

// 日本語ドット書体（misaki）。漢字データは misaki-kanji.*.js として別チャンクで配信される
const KANJI_CHUNK = 'misaki-kanji';
const CSP_PATTERN = /Content Security|CSP|Refused to/i;

test.describe('ASCIIアート文字（ドット書体・日本語）', () => {
  test('ドット書体はかな・カタカナを変換でき、漢字を入力したときだけ漢字データを読み込む（CSP違反なし）', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));
    const kanjiRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes(KANJI_CHUNK)) kanjiRequests.push(req.url());
    });

    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    await page.locator('#fig-font').selectOption('misaki');
    await expect(page.locator(OUTPUT)).toContainText('█');
    // 初期値（Nyanko）は漢字を含まないので、漢字データはまだ読まれない
    expect(kanjiRequests).toEqual([]);

    // かな・カタカナだけでは未対応通知は出ず、漢字データも読まない
    const beforeKana = await page.locator(OUTPUT).textContent();
    await page.locator('#fig-input').fill('にゃんこ ネコ');
    await expect(page.locator(OUTPUT)).not.toHaveText(beforeKana!);
    await expect(page.locator(OUTPUT)).toContainText('█');
    await expect(page.locator(NOTICE)).toBeHidden();
    expect(kanjiRequests).toEqual([]);

    // 漢字を入力すると漢字データが追加で読み込まれ、未対応通知は出ない
    const kanjiResponse = page.waitForResponse((res) =>
      res.url().includes(KANJI_CHUNK),
    );
    const beforeKanji = await page.locator(OUTPUT).textContent();
    await page.locator('#fig-input').fill('猫の道具');
    expect((await kanjiResponse).ok()).toBe(true);
    await expect(page.locator(OUTPUT)).not.toHaveText(beforeKanji!);
    await expect(page.locator(OUTPUT)).toContainText('█');
    await expect(page.locator(NOTICE)).toBeHidden();
    // ドット書体は8行の高さで描画される（先頭・末尾の空行は除かれるので上限で見る）
    const dotRows = (await page.locator(OUTPUT).textContent())!.split('\n');
    expect(dotRows.length).toBeGreaterThanOrEqual(6);
    expect(dotRows.length).toBeLessThanOrEqual(8);
    expect(kanjiRequests).toHaveLength(1);

    expect(consoleErrors.filter((e) => CSP_PATTERN.test(e))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('ドット書体で字形のない文字（𠮟・絵文字）を入れると、未対応の通知が出る', async ({
    page,
  }) => {
    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    await page.locator('#fig-font').selectOption('misaki');
    await expect(page.locator(OUTPUT)).toContainText('█');

    const before = await page.locator(OUTPUT).textContent();
    await page.locator('#fig-input').fill('猫𠮟');
    await expect(page.locator(NOTICE)).toBeVisible();
    await expect(page.locator(NOTICE)).toContainText(
      '選んだ書体に字形がない文字は表示していません: 𠮟',
    );
    // 字形のある「猫」は描画され、出力は変わる
    await expect(page.locator(OUTPUT)).not.toHaveText(before!);
    await expect(page.locator(OUTPUT)).toContainText('█');

    await page.locator('#fig-input').fill('猫😺');
    await expect(page.locator(NOTICE)).toContainText('😺');
    await expect(page.locator(NOTICE)).not.toContainText('𠮟');
  });

  test('ドット以外の書体では、日本語は従来どおり未対応の通知になり漢字データは読まない', async ({
    page,
  }) => {
    const kanjiRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes(KANJI_CHUNK)) kanjiRequests.push(req.url());
    });
    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');

    for (const font of ['standard', 'slant', 'block']) {
      // 前回の通知が残って誤判定しないよう、いったん空にしてから入力する
      await page.locator('#fig-input').fill('');
      await expect(page.locator(NOTICE)).toBeHidden();
      await page.locator('#fig-font').selectOption(font);
      await page.locator('#fig-input').fill('猫の道具');
      await expect(page.locator(NOTICE)).toBeVisible();
      await expect(page.locator(NOTICE)).toContainText(
        '選んだ書体に字形がない文字は表示していません: 猫 の 道 具',
      );
    }
    expect(kanjiRequests).toEqual([]);
  });

  test('375px幅で全角8文字のドット出力は #fig-output 内で横スクロールになり、ページははみ出さない', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    await page.locator('#fig-font').selectOption('misaki');
    await expect(page.locator(OUTPUT)).toContainText('█');

    const before = await page.locator(OUTPUT).textContent();
    await page.locator('#fig-input').fill('猫の道具猫の道具');
    await expect(page.locator(OUTPUT)).not.toHaveText(before!);

    const metrics = await page.locator(OUTPUT).evaluate((el) => ({
      overflowX: getComputedStyle(el).overflowX,
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
      right: el.getBoundingClientRect().right,
      longest: Math.max(...el.textContent!.split('\n').map((l) => l.length)),
      pageOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    // 全角8文字 × 8セル = 64桁（行末の空白は除くため、余裕を見て下限を置く）
    expect(metrics.longest).toBeGreaterThanOrEqual(56);
    expect(metrics.overflowX).toBe('auto');
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
    expect(metrics.right).toBeLessThanOrEqual(375);
    expect(metrics.pageOverflow).toBe(false);

    // 出力の中で横にスクロールして末尾まで見られる
    const scrolled = await page.locator(OUTPUT).evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
      return el.scrollLeft;
    });
    expect(scrolled).toBeGreaterThan(0);
  });
});

test.describe('ASCII Art Text Generator (English, dot font)', () => {
  test('英語版でもドット書体の未対応通知は英語で出る', async ({ page }) => {
    await page.goto('/en/tools/figlet-text/');
    await expect(page.locator(OUTPUT)).toContainText('_|');
    await page.locator('#fig-font').selectOption('misaki');
    await expect(page.locator(OUTPUT)).toContainText('█');

    await page.locator('#fig-input').fill('Cat😺');
    await expect(page.locator(NOTICE)).toBeVisible();
    await expect(page.locator(NOTICE)).toContainText(
      'The selected font has no shapes for these characters',
    );
    await expect(page.locator(NOTICE)).toContainText('😺');
    await expect(page.locator(OUTPUT)).toContainText('█');
  });
});
