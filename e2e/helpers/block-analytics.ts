import type { BrowserContext, Page } from '@playwright/test';

// 本番ビルドは Google Analytics を読み込むため、外部通信が遮断された環境（CI のプロキシ等）では
// 接続エラーがコンソールエラーになり、「コンソールエラー0件」を確認するテストが落ちる。
// 計測系のリクエストだけを空の 200 応答で差し替え、接続の可否に依存しないようにする。
// トレードオフ: GA由来の connect-src / img-src 等のCSP違反は、この差し替え下では検出できない。
export async function blockAnalytics(target: Page | BrowserContext) {
  await target.route(
    /^https:\/\/(www\.googletagmanager\.com|www\.google-analytics\.com|[a-z0-9-]+\.google-analytics\.com|analytics\.google\.com)\//,
    (route) =>
      route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
  );
}
