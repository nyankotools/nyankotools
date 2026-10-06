// ===== SRI（Subresource Integrity） =====

export const SRI_ALGORITHMS = ['sha256', 'sha384', 'sha512'] as const;
export type SriAlgorithm = (typeof SRI_ALGORITHMS)[number];

/** ファイル1つあたりの上限（全体をメモリに読み込んで計算するため） */
export const MAX_SRI_FILE_SIZE = 64 * 1024 * 1024;

const WEB_CRYPTO_NAME: Record<SriAlgorithm, string> = {
  sha256: 'SHA-256',
  sha384: 'SHA-384',
  sha512: 'SHA-512',
};

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** 指定アルゴリズムの `sha384-<base64>` 形式のハッシュを計算する */
export async function computeSri(
  data: Uint8Array<ArrayBuffer>,
  algorithms: readonly SriAlgorithm[],
): Promise<Record<SriAlgorithm, string>> {
  const entries = await Promise.all(
    algorithms.map(async (algorithm) => {
      const digest = await crypto.subtle.digest(
        WEB_CRYPTO_NAME[algorithm],
        data,
      );
      return [
        algorithm,
        `${algorithm}-${toBase64(new Uint8Array(digest))}`,
      ] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<SriAlgorithm, string>;
}

export type SriTagKind = 'script' | 'stylesheet';

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const SRI_PLACEHOLDER_URL: Record<SriTagKind, string> = {
  script: 'https://example.com/app.js',
  stylesheet: 'https://example.com/style.css',
};

/** integrity / crossorigin 付きの `<script>` / `<link>` タグを組み立てる。URLが空ならサンプルURLを使う */
export function buildSriTag(
  kind: SriTagKind,
  url: string,
  integrity: string,
): string {
  const src = escapeHtmlAttribute(url.trim() || SRI_PLACEHOLDER_URL[kind]);
  const attrs = `integrity="${escapeHtmlAttribute(integrity)}" crossorigin="anonymous"`;
  return kind === 'script'
    ? `<script src="${src}" ${attrs}></script>`
    : `<link rel="stylesheet" href="${src}" ${attrs}>`;
}

// ===== CSP（Content-Security-Policy） =====

export const CSP_DIRECTIVES = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'media-src',
  'frame-src',
  'worker-src',
  'manifest-src',
  'object-src',
  'base-uri',
  'form-action',
  'frame-ancestors',
] as const;
export type CspDirective = (typeof CSP_DIRECTIVES)[number];

/** 入力欄ごとの生テキスト（空白・カンマ・改行区切りの送信元リスト） */
export type CspInput = Partial<Record<CspDirective, string>>;

const KEYWORDS = new Set([
  'self',
  'none',
  'unsafe-inline',
  'unsafe-eval',
  'unsafe-hashes',
  'strict-dynamic',
  'wasm-unsafe-eval',
  'report-sample',
]);

/**
 * 送信元リストを正規化する。空白・カンマ・セミコロンで区切り、重複を除く。
 * `self` などのキーワードや `nonce-…` / `sha256-…` は引用符が無ければ自動で付ける。
 * ディレクティブを分断する `;` や、ヘッダーを壊す改行・引用符は取り除く。
 */
export function parseSources(text: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of text.split(/[\s,;]+/)) {
    const bare = raw.replace(/^'+|'+$/g, '').replace(/['"]/g, '');
    if (!bare) continue;
    const lower = bare.toLowerCase();
    const token = KEYWORDS.has(lower)
      ? `'${lower}'`
      : /^(nonce|sha256|sha384|sha512)-[A-Za-z0-9+/_-]+={0,2}$/i.test(bare)
        ? `'${bare}'`
        : bare;
    if (!seen.has(token)) {
      seen.add(token);
      result.push(token);
    }
  }
  return result;
}

export interface CspOptions {
  upgradeInsecureRequests: boolean;
}

/** ディレクティブごとの入力から、ポリシー文字列を作る（空欄のディレクティブは出力しない） */
export function buildPolicy(input: CspInput, options: CspOptions): string {
  const parts: string[] = [];
  for (const directive of CSP_DIRECTIVES) {
    const sources = parseSources(input[directive] ?? '');
    if (sources.length > 0) parts.push(`${directive} ${sources.join(' ')}`);
  }
  if (options.upgradeInsecureRequests) parts.push('upgrade-insecure-requests');
  return parts.join('; ');
}

export type CspFormat = 'header' | 'meta' | 'nginx' | 'apache' | 'headers-file';
export const CSP_FORMATS: readonly CspFormat[] = [
  'header',
  'meta',
  'nginx',
  'apache',
  'headers-file',
];

/** `<meta>` 経由では無視されるディレクティブ */
export const META_IGNORED_DIRECTIVES: readonly CspDirective[] = [
  'frame-ancestors',
];

export interface FormattedPolicy {
  text: string;
  /** meta形式で無視されるディレクティブが含まれているか */
  metaIgnored: boolean;
  /** meta形式でReport-Onlyが指定されているか（metaでは使えない） */
  metaReportOnly: boolean;
}

/** ポリシーを、各設定形式の貼り付け用テキストに整形する */
export function formatPolicy(
  policy: string,
  format: CspFormat,
  reportOnly: boolean,
): FormattedPolicy {
  const name = reportOnly
    ? 'Content-Security-Policy-Report-Only'
    : 'Content-Security-Policy';
  const metaIgnored = META_IGNORED_DIRECTIVES.some((d) =>
    policy.split('; ').some((part) => part.startsWith(`${d} `)),
  );
  let text: string;
  switch (format) {
    case 'header':
      text = `${name}: ${policy}`;
      break;
    case 'meta':
      text = `<meta http-equiv="Content-Security-Policy" content="${escapeHtmlAttribute(policy)}">`;
      break;
    case 'nginx':
      text = `add_header ${name} "${policy.replace(/(["\\$])/g, '\\$1')}" always;`;
      break;
    case 'apache':
      text = `Header always set ${name} "${policy.replace(/(["\\])/g, '\\$1')}"`;
      break;
    case 'headers-file':
      text = `/*\n  ${name}: ${policy}`;
      break;
  }
  return {
    text,
    metaIgnored: format === 'meta' && metaIgnored,
    metaReportOnly: format === 'meta' && reportOnly,
  };
}

export type CspWarningCode =
  | 'no-default-src'
  | 'unsafe-inline-script'
  | 'unsafe-eval'
  | 'wildcard'
  | 'data-script'
  | 'http-source'
  | 'no-object-src'
  | 'none-mixed';

export interface CspWarning {
  code: CspWarningCode;
  /** 該当するディレクティブ（ポリシー全体に関わる警告は undefined） */
  directive?: CspDirective;
}

const SCRIPT_DIRECTIVES: readonly CspDirective[] = [
  'default-src',
  'script-src',
  'worker-src',
];

/** ポリシーの弱い設定・不足を検出する */
export function analyzePolicy(input: CspInput): CspWarning[] {
  const warnings: CspWarning[] = [];
  const parsed = new Map<CspDirective, string[]>();
  for (const directive of CSP_DIRECTIVES) {
    const sources = parseSources(input[directive] ?? '');
    if (sources.length > 0) parsed.set(directive, sources);
  }
  if (parsed.size === 0) return warnings;

  if (!parsed.has('default-src')) warnings.push({ code: 'no-default-src' });

  for (const [directive, sources] of parsed) {
    const isScript = SCRIPT_DIRECTIVES.includes(directive);
    if (isScript && sources.includes(`'unsafe-inline'`)) {
      warnings.push({ code: 'unsafe-inline-script', directive });
    }
    if (isScript && sources.includes(`'unsafe-eval'`)) {
      warnings.push({ code: 'unsafe-eval', directive });
    }
    if (sources.includes('*')) warnings.push({ code: 'wildcard', directive });
    if (isScript && sources.includes('data:')) {
      warnings.push({ code: 'data-script', directive });
    }
    if (
      directive !== 'frame-ancestors' &&
      sources.some((s) => /^http:/i.test(s))
    ) {
      warnings.push({ code: 'http-source', directive });
    }
    if (sources.includes(`'none'`) && sources.length > 1) {
      warnings.push({ code: 'none-mixed', directive });
    }
  }

  const objectSources = parsed.get('object-src') ?? parsed.get('default-src');
  if (!objectSources?.includes(`'none'`)) {
    warnings.push({ code: 'no-object-src' });
  }
  return warnings;
}

export type CspPresetId = 'strict' | 'basic' | 'blank';
export const CSP_PRESET_IDS: readonly CspPresetId[] = [
  'blank',
  'basic',
  'strict',
];

export const CSP_PRESETS: Record<CspPresetId, CspInput> = {
  basic: {
    'default-src': `'self'`,
    'script-src': `'self'`,
    'style-src': `'self' 'unsafe-inline'`,
    'img-src': `'self' data: https:`,
    'font-src': `'self' https:`,
    'connect-src': `'self'`,
    'object-src': `'none'`,
    'base-uri': `'self'`,
    'form-action': `'self'`,
    'frame-ancestors': `'self'`,
  },
  strict: {
    'default-src': `'none'`,
    'script-src': `'self'`,
    'style-src': `'self'`,
    'img-src': `'self'`,
    'font-src': `'self'`,
    'connect-src': `'self'`,
    'object-src': `'none'`,
    'base-uri': `'none'`,
    'form-action': `'self'`,
    'frame-ancestors': `'none'`,
  },
  blank: {},
};
