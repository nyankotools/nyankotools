import { test as base } from '@playwright/test';
import { blockAnalytics } from './block-analytics';

export * from '@playwright/test';

// 全E2Eで共通の test。本番ビルドに入っている実IDの Google Analytics へ、
// CI やローカルのテスト由来のアクセスが送られて計測データが汚れるのを防ぐ。
// 注意: browser.newContext() で独自にコンテキストを作る spec にはこの fixture が効かないため、
// 必要なら spec 側で blockAnalytics(context) を明示的に呼ぶこと。
// あわせて、外部通信が無い環境でも「コンソールエラー0件」系のテストが落ちないようにする。
export const test = base.extend({
  context: async ({ context }, use) => {
    await blockAnalytics(context);
    await use(context);
  },
});
