import { test, expect } from './helpers/test';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { blockAnalytics } from './helpers/block-analytics';

// サイドバーのカテゴリ開閉状態（localStorage: sidebar-open-categories）の復元が、
// 本番相当のCSP配信（Cloudflare Workers Static Assets = wrangler dev）下でも
// 正しく機能することを確認する。
//
// この復元は Layout.astro が </nav> 直後に読み込む外部スクリプト
// public/sidebar-category-init.js（<script src="..." is:inline> で配信）が担う。
// 過去に一度、このスクリプトをインライン埋め込みで実装した際、AstroのCSP自動
// ハッシュ化の対象外となってCSP違反でブロックされ、復元が一切機能しないという
// 重大バグが本番相当環境（wrangler dev）でのみ再現した。`pnpm dev`（Astro dev
// server）ではCSPヘッダー自体が送出されないためこのバグは検出できないので、
// csp-headers.spec.ts と同じ手法（`pnpm build` 済みdistをwrangler devで実配信）
// を用いる。

const PORT = 18789;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let serverProcess: ChildProcess | undefined;

async function waitForServer(url: string, timeoutMs = 45000) {
  const start = Date.now();
  let lastError: unknown;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(
    `wrangler dev server did not become ready within ${timeoutMs}ms: ${String(lastError)}`,
  );
}

// Windows では子プロセスツリーの末端（workerd）まで .kill() が届かないため、
// csp-headers.spec.ts と同様にプロセスツリーごと終了する。
function killServerTree(pid: number | undefined) {
  if (!pid) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(pid), '/T', '/F']);
  } else {
    try {
      process.kill(-pid, 'SIGKILL');
    } catch {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        // 既に終了している場合は何もしない
      }
    }
  }
}

test.describe('サイドバーのカテゴリ開閉状態の復元（wrangler dev 実配信での確認）', () => {
  // 固定ポートで wrangler dev を1つだけ起動して使い回すため直列実行に固定する。
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    serverProcess = spawn(
      'pnpm',
      [
        'exec',
        'wrangler',
        'dev',
        '-c',
        'e2e/wrangler.e2e.jsonc',
        '--port',
        String(PORT),
      ],
      {
        shell: true,
        stdio: 'ignore',
        detached: process.platform !== 'win32',
      },
    );
    await waitForServer(BASE_URL);
  });

  test.afterAll(() => {
    killServerTree(serverProcess?.pid);
  });

  test('複数カテゴリを開いた状態で別ツールへ遷移しても、開閉状態が復元される', async ({
    browser,
  }) => {
    const context = await browser.newContext({ baseURL: BASE_URL });
    await blockAnalytics(context);
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    // char-counter（category: text）はアクティブツールとして初期状態で
    // 「テキスト」カテゴリが開いている。追加で「データ変換」「エンコード/デコード」を
    // クリックで開く。
    await page.goto('/tools/char-counter/');

    const textCategory = page.locator(
      '#sidebar nav details[data-category="text"]',
    );
    const convertCategory = page.locator(
      '#sidebar nav details[data-category="data"]',
    );
    const encodeCategory = page.locator(
      '#sidebar nav details[data-category="encode"]',
    );

    await expect(textCategory).toHaveJSProperty('open', true);
    await expect(convertCategory).toHaveJSProperty('open', false);
    await expect(encodeCategory).toHaveJSProperty('open', false);

    await convertCategory.locator('summary').click();
    await encodeCategory.locator('summary').click();

    await expect(convertCategory).toHaveJSProperty('open', true);
    await expect(encodeCategory).toHaveJSProperty('open', true);

    // トグルのたびに localStorage へ保存される。'toggle' イベントの発火は
    // タスクとしてキューイングされ、クリック直後の同期処理では反映されている
    // 保証がないため、expect.poll で保存内容が安定するまで待つ。
    await expect
      .poll(async () => {
        const stored = await page.evaluate(() =>
          localStorage.getItem('sidebar-open-categories'),
        );
        return new Set(JSON.parse(stored ?? '[]'));
      })
      .toEqual(new Set(['text', 'data', 'encode']));

    // 別カテゴリ（日付・時間）に属するツールへ、フルページ遷移する。
    await page.goto('/tools/date-calculator/');

    const dateCalculatorTextCategory = page.locator(
      '#sidebar nav details[data-category="text"]',
    );
    const dateCalculatorConvertCategory = page.locator(
      '#sidebar nav details[data-category="data"]',
    );
    const dateCalculatorEncodeCategory = page.locator(
      '#sidebar nav details[data-category="encode"]',
    );
    const dateCalculatorDateCategory = page.locator(
      '#sidebar nav details[data-category="datetime"]',
    );
    const dateCalculatorGenerateCategory = page.locator(
      '#sidebar nav details[data-category="generate"]',
    );

    // 遷移前に開いていた3カテゴリは復元されて開いている。
    await expect(dateCalculatorTextCategory).toHaveJSProperty('open', true);
    await expect(dateCalculatorConvertCategory).toHaveJSProperty('open', true);
    await expect(dateCalculatorEncodeCategory).toHaveJSProperty('open', true);
    // 現在のアクティブツールが属するカテゴリも開いている。
    await expect(dateCalculatorDateCategory).toHaveJSProperty('open', true);
    // 一度も開いていないカテゴリは開かない。
    await expect(dateCalculatorGenerateCategory).toHaveJSProperty(
      'open',
      false,
    );

    expect(consoleErrors).toEqual([]);
    await context.close();
  });

  test('複数カテゴリが開いた状態は、初回ペイント前（DOMContentLoaded時点）に既に復元されている', async ({
    browser,
  }) => {
    // 前のテストと同じ手順で3カテゴリを開いた状態を作り、遷移先ページで
    // domcontentloaded 到達時点（layout-nav.tsの通常scriptより早いか同程度）で
    // 既に開閉状態が反映されていることを確認し、初回ペイント後にパッと開く
    // チラつきが起きていないことを裏付ける。
    const context = await browser.newContext({ baseURL: BASE_URL });
    await blockAnalytics(context);
    const page = await context.newPage();

    await page.goto('/tools/char-counter/');
    await page
      .locator('#sidebar nav details[data-category="data"] summary')
      .click();
    await page
      .locator('#sidebar nav details[data-category="encode"] summary')
      .click();
    // 'toggle' イベントの発火は非同期タスクのため、localStorage への保存が
    // 完了するまで待ってから遷移する。
    await expect
      .poll(async () => {
        const stored = await page.evaluate(() =>
          localStorage.getItem('sidebar-open-categories'),
        );
        return new Set(JSON.parse(stored ?? '[]'));
      })
      .toEqual(new Set(['text', 'data', 'encode']));

    // domcontentloaded まで待機した直後に評価することで、初回ペイント前後の
    // 復元状態をできるだけ早いタイミングで確認する。
    await page.goto('/tools/date-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    const openCategories = await page.evaluate(() =>
      Array.from(document.querySelectorAll('nav details[data-category]'))
        .filter((el) => (el as HTMLDetailsElement).open)
        .map((el) => (el as HTMLElement).dataset.category),
    );

    expect(new Set(openCategories)).toEqual(
      new Set(['text', 'data', 'encode', 'datetime']),
    );

    await context.close();
  });
});
