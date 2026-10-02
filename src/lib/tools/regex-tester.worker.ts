/// <reference lib="webworker" />
import { runRegexJob, type RegexJobRequest } from './regex-tester';

// 利用者の正規表現をメインスレッドで実行すると、破滅的バックトラッキング（例: (a+)+$）で
// タブ全体が固まる。重い処理は Worker に隔離し、呼び出し側がタイムアウトで破棄できるようにする。
self.onmessage = (event: MessageEvent<RegexJobRequest>) => {
  self.postMessage(runRegexJob(event.data));
};
