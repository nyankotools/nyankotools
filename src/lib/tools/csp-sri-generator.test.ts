import { describe, it, expect } from 'vitest';
import {
  CSP_PRESETS,
  analyzePolicy,
  buildPolicy,
  buildSriTag,
  computeSri,
  formatPolicy,
  parseSources,
} from './csp-sri-generator';

const bytes = (text: string) =>
  new Uint8Array(new TextEncoder().encode(text)) as Uint8Array<ArrayBuffer>;

describe('computeSri', () => {
  it('既知のハッシュ値（"abc"）と一致する', async () => {
    const result = await computeSri(bytes('abc'), ['sha256', 'sha384']);
    expect(result.sha256).toBe(
      'sha256-ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=',
    );
    expect(result.sha384).toBe(
      'sha384-ywB1P0WjXou1oD1pmsZQBycsMqsO3tFjGotgWkP/W+2AhgcroefMI1i67KE0yCWn',
    );
    expect(result.sha512).toBeUndefined();
  });

  it('空データでも計算できる', async () => {
    const result = await computeSri(bytes(''), ['sha256']);
    expect(result.sha256).toBe(
      'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
    );
  });
});

describe('buildSriTag', () => {
  it('scriptタグを組み立てる', () => {
    expect(buildSriTag('script', 'https://cdn.example/a.js', 'sha384-xx')).toBe(
      '<script src="https://cdn.example/a.js" integrity="sha384-xx" crossorigin="anonymous"></script>',
    );
  });

  it('stylesheetはlinkタグになり、URLが空ならサンプルURLを使う', () => {
    expect(buildSriTag('stylesheet', '  ', 'sha256-yy')).toBe(
      '<link rel="stylesheet" href="https://example.com/style.css" integrity="sha256-yy" crossorigin="anonymous">',
    );
  });

  it('URLの引用符等をエスケープする', () => {
    expect(buildSriTag('script', 'a.js?x="1"&y=<2>', 'sha256-z')).toContain(
      'src="a.js?x=&quot;1&quot;&amp;y=&lt;2&gt;"',
    );
  });
});

describe('parseSources', () => {
  it('キーワードやハッシュに引用符を補い、重複を除く', () => {
    expect(
      parseSources(`self, https://a.example 'self' nonce-abc123 sha256-AAA=`),
    ).toEqual([
      `'self'`,
      'https://a.example',
      `'nonce-abc123'`,
      `'sha256-AAA='`,
    ]);
  });

  it('セミコロン・引用符・改行によるディレクティブ注入を防ぐ', () => {
    expect(parseSources(`a.example; script-src *\n"b.example"`)).toEqual([
      'a.example',
      'script-src',
      '*',
      'b.example',
    ]);
  });

  it('空入力は空配列', () => {
    expect(parseSources('  \n ')).toEqual([]);
  });
});

describe('buildPolicy', () => {
  it('空欄のディレクティブは出力せず、upgrade-insecure-requestsを末尾に付ける', () => {
    expect(
      buildPolicy(
        { 'default-src': 'self', 'img-src': '', 'script-src': 'self cdn.x' },
        { upgradeInsecureRequests: true },
      ),
    ).toBe(
      `default-src 'self'; script-src 'self' cdn.x; upgrade-insecure-requests`,
    );
  });

  it('すべて空なら空文字', () => {
    expect(buildPolicy({}, { upgradeInsecureRequests: false })).toBe('');
  });
});

describe('formatPolicy', () => {
  const policy = `default-src 'self'; frame-ancestors 'none'`;

  it('各形式に整形する', () => {
    expect(formatPolicy(policy, 'header', false).text).toBe(
      `Content-Security-Policy: ${policy}`,
    );
    expect(formatPolicy(policy, 'nginx', false).text).toBe(
      `add_header Content-Security-Policy "${policy}" always;`,
    );
    expect(formatPolicy(policy, 'apache', true).text).toBe(
      `Header always set Content-Security-Policy-Report-Only "${policy}"`,
    );
    expect(formatPolicy(policy, 'headers-file', false).text).toBe(
      `/*\n  Content-Security-Policy: ${policy}`,
    );
  });

  it('meta形式では frame-ancestors とReport-Onlyの非対応を知らせる', () => {
    const meta = formatPolicy(policy, 'meta', true);
    expect(meta.text).toContain('<meta http-equiv="Content-Security-Policy"');
    expect(meta.metaIgnored).toBe(true);
    expect(meta.metaReportOnly).toBe(true);
    expect(formatPolicy(policy, 'header', true).metaIgnored).toBe(false);
  });

  it('nginxで $ と " をエスケープする', () => {
    expect(formatPolicy('img-src a$b"c', 'nginx', false).text).toBe(
      'add_header Content-Security-Policy "img-src a\\$b\\"c" always;',
    );
  });
});

describe('analyzePolicy', () => {
  const codes = (input: Parameters<typeof analyzePolicy>[0]) =>
    analyzePolicy(input).map((w) => w.code);

  it('空なら警告なし', () => {
    expect(codes({})).toEqual([]);
  });

  it('strictプリセットは警告なし、basicはstyle-srcのunsafe-inlineを許容する', () => {
    expect(codes(CSP_PRESETS.strict)).toEqual([]);
    expect(codes(CSP_PRESETS.basic)).toEqual([]);
  });

  it('script-srcの unsafe-inline / unsafe-eval / ワイルドカード / data: を検出する', () => {
    expect(
      codes({
        'default-src': 'none',
        'script-src': `* 'unsafe-inline' 'unsafe-eval' data:`,
        'object-src': 'none',
      }),
    ).toEqual([
      'unsafe-inline-script',
      'unsafe-eval',
      'wildcard',
      'data-script',
    ]);
  });

  it('style-srcの unsafe-inline はスクリプト扱いしない', () => {
    expect(
      codes({
        'default-src': 'none',
        'style-src': `'unsafe-inline'`,
      }),
    ).toEqual([]);
  });

  it('default-src 無し・object-src未制限・http:・none混在を検出する', () => {
    expect(
      codes({
        'script-src': 'http://a.example',
        'img-src': `'none' self`,
      }),
    ).toEqual(['no-default-src', 'http-source', 'none-mixed', 'no-object-src']);
  });
});

describe('Edge cases: parseSources with hostname-like patterns', () => {
  it('sha256.example.com のようなプレフィックスを持つホスト名は引用符なしで通す', () => {
    expect(
      parseSources('sha256.example.com sha384.com https://sha512.example'),
    ).toEqual(['sha256.example.com', 'sha384.com', 'https://sha512.example']);
  });

  it('nonce-プレフィックスを含むURLは正規表現で識別される', () => {
    expect(
      parseSources("nonce-abc123 nonce-a1b2c3= 'nonce-already-quoted'"),
    ).toEqual([`'nonce-abc123'`, `'nonce-a1b2c3='`, `'nonce-already-quoted'`]);
  });

  it('無効なハッシュ形式（base64パターンに合致しない）は通常のホスト名として扱う', () => {
    expect(parseSources('sha256-invalid@chars sha256-OK123abc')).toEqual([
      'sha256-invalid@chars',
      `'sha256-OK123abc'`,
    ]);
  });
});

describe('Edge cases: multibyte characters in SRI', () => {
  it('日本語テキストのハッシュを計算できる', async () => {
    const result = await computeSri(bytes('こんにちは'), ['sha256', 'sha384']);
    expect(result.sha256).toBeDefined();
    expect(result.sha384).toBeDefined();
    expect(result.sha256).not.toBe('');
  });

  it('Emoji のハッシュを計算できる', async () => {
    const result = await computeSri(bytes('🎉🌟'), ['sha256']);
    expect(result.sha256).toBeDefined();
  });

  it('サロゲートペア (𝄞 U+1D11E) を含むテキストのハッシュ', async () => {
    const result = await computeSri(bytes('test𝄞data'), ['sha256']);
    expect(result.sha256).toBeDefined();
  });
});

describe('Edge cases: format-specific escaping', () => {
  it('Apache形式で複数の特殊文字をエスケープする', () => {
    const policy = 'script-src "a\\"b\\\\c"';
    const apache = formatPolicy(policy, 'apache', false);
    expect(apache.text).toContain('\\\\');
    expect(apache.text).toContain('\\"');
  });

  it('headers-file形式は /* のコメント開始で始まる', () => {
    const result = formatPolicy('default-src none', 'headers-file', false);
    expect(result.text.startsWith('/*\n')).toBe(true);
  });

  it('reportOnly がtrueでもheaders-file形式は適切なヘッダー名を使う', () => {
    const result = formatPolicy('img-src https:', 'headers-file', true);
    expect(result.text).toContain('Content-Security-Policy-Report-Only');
  });
});
