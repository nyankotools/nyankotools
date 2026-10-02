// 変更ツールの検証を一括実行する（`pnpm qa [slug ...]`）。
//
// 実行順: eslint/prettier(変更ファイルのみ) → vitest(関連テスト) → astro check → build
//         → Playwright(そのツールのspec + 共通spec の該当ツール分)
// 各ステップは「OK/NG」の1行だけを出し、失敗したステップのログ末尾だけを表示する
// （エージェントが何度もコマンドを叩く・長い出力を読むことによるトークン消費を避けるため）。
// slug を省略すると、git の変更ファイルからツールを推定する。
// ビルドは1回だけ実行し、Playwright の webServer には E2E_SKIP_BUILD=1 でビルドを省略させる
// （dist は直前の build で最新になっている）。全ログは tmp ディレクトリに残す。

import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const TAIL_LINES = 40;
const logDir = path.join(os.tmpdir(), 'nyankotools-qa');
mkdirSync(logDir, { recursive: true });

function run(cmd, env = {}) {
  return spawnSync(cmd, {
    shell: true,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, ...env },
  });
}

function lines(cmd) {
  return run(cmd)
    .stdout.split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

// 変更ファイル（未コミットの変更 + 未追跡）。削除されたファイルは除く。
const changedFiles = [
  ...new Set([
    ...lines('git diff --name-only HEAD'),
    ...lines('git ls-files --others --exclude-standard'),
  ]),
].filter((f) => existsSync(f));

// slug の決定: 引数 > 変更ファイルからの推定
let slugs = process.argv.slice(2);
if (slugs.length === 0) {
  const found = new Set();
  for (const f of changedFiles) {
    const m =
      f.match(/^src\/lib\/tools\/([^/]+?)(?:\.test)?\.ts$/) ??
      f.match(/^src\/pages\/(?:en\/)?tools\/([^/]+)\//) ??
      f.match(/^e2e\/([^/]+)\.spec\.ts$/);
    if (m) found.add(m[1]);
  }
  slugs = [...found];
}

const results = [];
function step(name, cmd, env) {
  const t0 = Date.now();
  const r = run(cmd, env);
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  const ok = r.status === 0;
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  const logFile = path.join(logDir, `${name.replace(/\W+/g, '_')}.log`);
  writeFileSync(logFile, out);
  results.push({ name, ok });
  console.log(`${ok ? 'OK ' : 'NG '} ${name} (${sec}s)`);
  if (!ok) {
    console.log(`--- ${name} ログ末尾（全文: ${logFile}）---`);
    console.log(out.trim().split('\n').slice(-TAIL_LINES).join('\n'));
    console.log('---');
  }
  return ok;
}

console.log(
  `対象ツール: ${slugs.length ? slugs.join(', ') : '(推定できず: 静的チェックと全単体テストのみ)'}`,
);
console.log(`変更ファイル: ${changedFiles.length}件`);

const quote = (files) => files.map((f) => `"${f}"`).join(' ');
const lintable = changedFiles.filter((f) => /\.(ts|mjs|js|astro)$/.test(f));

if (lintable.length) {
  step('eslint', `pnpm exec eslint --cache ${quote(lintable)}`);
}
if (changedFiles.length) {
  step(
    'prettier',
    `pnpm exec prettier --check --cache --ignore-unknown ${quote(changedFiles)}`,
  );
}

// 単体テスト: 対象ツールのテスト + レジストリ整合性など data/ 配下。slug不明なら全件。
const unitTargets = slugs
  .map((s) => `src/lib/tools/${s}.test.ts`)
  .filter((f) => existsSync(f));
const unitCmd =
  slugs.length === 0
    ? 'pnpm exec vitest run --reporter=dot'
    : `pnpm exec vitest run --reporter=dot src/data ${quote(unitTargets)}`;
step('vitest', unitCmd);

step('astro-check', 'pnpm exec astro check');
const built = step('build', 'pnpm build');

if (built && slugs.length) {
  const specs = ['e2e/tools-common.spec.ts'];
  for (const s of slugs) {
    if (existsSync(`e2e/${s}.spec.ts`)) specs.push(`e2e/${s}.spec.ts`);
  }
  // 共通specは全ツール分あるため、対象ツールのテスト名（"<slug>:"）と、
  // 全ツール横断の "sidebar:" テスト（軽量・数件）だけに絞る。
  // 固有specのテスト名は slug で始まるとは限らないので、-g は共通specにだけ効かせる。
  const escaped = slugs.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const common = `pnpm exec playwright test e2e/tools-common.spec.ts --reporter=dot -g "\\s(${escaped.join('|')}|sidebar):"`;
  const env = { E2E_SKIP_BUILD: '1' };
  step('e2e-common', common, env);
  const own = specs.slice(1);
  if (own.length) {
    step(
      'e2e-tool',
      `pnpm exec playwright test ${own.join(' ')} --reporter=dot`,
      env,
    );
  } else {
    console.log('--  e2e-tool: 固有specなし（新規ツールなら作成すること）');
  }
} else if (!built) {
  console.log('--  e2e: build失敗のためスキップ');
} else {
  console.log('--  e2e: 対象ツール不明のためスキップ（slugを引数に指定）');
}

const failed = results.filter((r) => !r.ok);
console.log(
  failed.length
    ? `\n結果: NG（${failed.map((r) => r.name).join(', ')}）`
    : '\n結果: 全てOK',
);
process.exit(failed.length ? 1 : 0);
