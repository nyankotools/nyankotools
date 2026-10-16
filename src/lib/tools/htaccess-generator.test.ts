import { describe, it, expect } from 'vitest';
import {
  analyzeHtaccess,
  buildHtaccess,
  emptyInput,
  escapeRegex,
  isValidDomain,
  normalizeDomain,
  parseRedirects,
  type HtaccessInput,
} from './htaccess-generator';

const input = (over: Partial<HtaccessInput> = {}): HtaccessInput => ({
  ...emptyInput(),
  ...over,
});
const codes = (i: HtaccessInput) => analyzeHtaccess(i).map((x) => x.code);

describe('normalizeDomain / isValidDomain', () => {
  it('スキーム・パス・ポート・www.・末尾ドットを取り除いて小文字にする', () => {
    expect(normalizeDomain(' HTTPS://WWW.Example.com:8080/path?x=1 ')).toBe(
      'example.com',
    );
    expect(normalizeDomain('example.com.')).toBe('example.com');
  });

  it('妥当なドメインだけを受け付ける', () => {
    expect(isValidDomain('example.com')).toBe(true);
    expect(isValidDomain('sub.example.co.jp')).toBe(true);
    expect(isValidDomain('xn--eckwd4c7c.jp')).toBe(true);
    expect(isValidDomain('localhost')).toBe(false);
    expect(isValidDomain('日本語.jp')).toBe(false);
    expect(isValidDomain('exa mple.com')).toBe(false);
    expect(isValidDomain('-bad.com')).toBe(false);
    expect(isValidDomain('')).toBe(false);
  });
});

describe('escapeRegex', () => {
  it('正規表現の特殊文字をエスケープする', () => {
    expect(escapeRegex('/a.b(c)+d')).toBe('/a\\.b\\(c\\)\\+d');
  });
});

describe('parseRedirects', () => {
  it('2〜3トークンの行を解析し、ステータスの既定は301', () => {
    const { rules, issues } = parseRedirects(
      '/old /new\n/a https://example.com/b 302\n\n# コメント\n',
    );
    expect(issues).toEqual([]);
    expect(rules).toEqual([
      { from: '/old', to: '/new', status: 301, line: 1 },
      { from: '/a', to: 'https://example.com/b', status: 302, line: 2 },
    ]);
  });

  it('形式・元パス・転送先・ステータスの誤りを行番号付きで返す', () => {
    const { rules, issues } = parseRedirects(
      [
        '/only-one',
        'old /new',
        '/old /new?x=1 extra extra',
        '/q?x=1 /new',
        '/old "bad"',
        '/old //evil.example',
        '/old javascript:alert(1)',
        '/old /new 999',
        '/日本語 /new',
        '/c /d$1',
      ].join('\n'),
    );
    expect(rules).toEqual([]);
    expect(issues.map((i) => [i.code, i.line])).toEqual([
      ['invalidRedirectFormat', 1],
      ['invalidFrom', 2],
      ['invalidRedirectFormat', 3],
      ['invalidFrom', 4],
      ['invalidTo', 5],
      ['invalidTo', 6],
      ['invalidTo', 7],
      ['invalidStatus', 8],
      ['invalidFrom', 9],
      ['invalidTo', 10],
    ]);
  });

  it('CRLFでも解析できる', () => {
    expect(parseRedirects('/a /b\r\n/c /d\r\n').rules).toHaveLength(2);
  });
});

describe('buildHtaccess', () => {
  it('既定（HTTPS強制のみ）', () => {
    expect(buildHtaccess(input())).toBe(
      [
        '<IfModule mod_rewrite.c>',
        'RewriteEngine On',
        '',
        '# Force HTTPS',
        'RewriteCond %{HTTPS} off',
        'RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
        '</IfModule>',
        '',
      ].join('\n'),
    );
  });

  it('何も選ばなければ空文字', () => {
    expect(buildHtaccess(input({ forceHttps: false }))).toBe('');
  });

  it('プロキシ配下では X-Forwarded-Proto も条件に加える', () => {
    const out = buildHtaccess(input({ behindProxy: true }));
    expect(out).toContain('RewriteCond %{HTTPS} off\n');
    expect(out).toContain('RewriteCond %{HTTP:X-Forwarded-Proto} !https');
  });

  it('wwwなし→wwwありに統一（HTTPSと同時でも1回のリダイレクトで済む順序）', () => {
    const out = buildHtaccess(input({ www: 'add', domain: 'example.com' }));
    const wwwAt = out.indexOf('RewriteCond %{HTTP_HOST} ^example\\.com$ [NC]');
    const httpsAt = out.indexOf('RewriteCond %{HTTPS} off');
    expect(wwwAt).toBeGreaterThan(-1);
    expect(httpsAt).toBeGreaterThan(wwwAt);
    expect(out).toContain(
      'RewriteRule ^ https://www.example.com%{REQUEST_URI} [L,R=301]',
    );
  });

  it('www付き→wwwなしに統一。ドメインにwww.を付けて入力してもよい', () => {
    const out = buildHtaccess(
      input({ www: 'remove', domain: 'https://www.Example.com/' }),
    );
    expect(out).toContain(
      'RewriteCond %{HTTP_HOST} ^www\\.example\\.com$ [NC]',
    );
    expect(out).toContain(
      'RewriteRule ^ https://example.com%{REQUEST_URI} [L,R=301]',
    );
  });

  it('HTTPS強制なしのwww統一は現在のスキームを引き継ぐ', () => {
    const out = buildHtaccess(
      input({ forceHttps: false, www: 'add', domain: 'example.com' }),
    );
    expect(out).toContain(
      'RewriteRule ^ %{REQUEST_SCHEME}://www.example.com%{REQUEST_URI} [L,R=301]',
    );
  });

  it('ドメインが不正ならwwwルールを出力しない', () => {
    const out = buildHtaccess(input({ www: 'add', domain: '' }));
    expect(out).not.toContain('HTTP_HOST} ^');
    expect(out).toContain('# Force HTTPS');
  });

  it('末尾スラッシュの付与はディレクトリだけが対象', () => {
    const out = buildHtaccess(
      input({ forceHttps: false, trailingSlash: 'add' }),
    );
    expect(out).toContain('RewriteCond %{REQUEST_FILENAME} -d');
    expect(out).toContain('RewriteRule [^/]$');
  });

  it('末尾スラッシュの除去は実在ディレクトリを除外する', () => {
    const out = buildHtaccess(
      input({ forceHttps: false, trailingSlash: 'remove' }),
    );
    expect(out).toContain('RewriteCond %{REQUEST_FILENAME} !-d');
    expect(out).toContain(
      'RewriteRule ^(.+)/$ %{REQUEST_SCHEME}://%{HTTP_HOST}/$1 [L,R=301]',
    );
  });

  it('index.html の除去は THE_REQUEST で内部リクエストとのループを防ぐ', () => {
    const out = buildHtaccess(input({ forceHttps: false, removeIndex: true }));
    expect(out).toContain('RewriteCond %{THE_REQUEST} ');
    expect(out).toContain('index\\.(?:html?|php)');
  });

  it('個別リダイレクト（完全一致）は RedirectMatch で元パスをエスケープする', () => {
    const out = buildHtaccess(
      input({
        forceHttps: false,
        redirectsText: '/old.html /new\n/a https://example.com/b 302',
      }),
    );
    expect(out).toContain('<IfModule mod_alias.c>');
    expect(out).toContain('RedirectMatch 301 "^/old\\.html$" "/new"');
    expect(out).toContain('RedirectMatch 302 "^/a$" "https://example.com/b"');
  });

  it('個別リダイレクト（前方一致）は Redirect を使う', () => {
    const out = buildHtaccess(
      input({
        forceHttps: false,
        redirectMatch: 'prefix',
        redirectsText: '/blog /articles',
      }),
    );
    expect(out).toContain('Redirect 301 "/blog" "/articles"');
    expect(out).not.toContain('RedirectMatch');
  });

  it('自己ループのリダイレクトは出力しない', () => {
    expect(
      buildHtaccess(
        input({ forceHttps: false, redirectsText: '/a /a\n/b /c' }),
      ),
    ).not.toContain('"^/a$"');
    expect(
      buildHtaccess(
        input({
          forceHttps: false,
          redirectMatch: 'prefix',
          redirectsText: '/a /a/b',
        }),
      ),
    ).toBe('');
  });

  it('Options -Indexes と ErrorDocument', () => {
    const out = buildHtaccess(
      input({
        forceHttps: false,
        disableIndexes: true,
        errorDoc404: ' /404.html ',
        errorDoc500: '/error.html',
      }),
    );
    expect(out).toContain('Options -Indexes');
    expect(out).toContain('ErrorDocument 404 /404.html');
    expect(out).toContain('ErrorDocument 500 /error.html');
    expect(out).not.toContain('ErrorDocument 403');
  });

  it('不正なErrorDocument（URL・引用符）は出力しない', () => {
    const out = buildHtaccess(
      input({
        forceHttps: false,
        errorDoc403: 'https://example.com/403',
        errorDoc404: '/a" b',
      }),
    );
    expect(out).toBe('');
  });

  it('改行を含む入力でも別のディレクティブを注入できない', () => {
    const out = buildHtaccess(
      input({
        forceHttps: false,
        errorDoc404: '/404.html\nOptions +ExecCGI',
        redirectsText: '/a /b\nOptions +ExecCGI',
      }),
    );
    expect(out).not.toContain('ExecCGI');
  });

  it('IfModule で囲み、モジュールが無くても500にならない形で出力する', () => {
    const out = buildHtaccess(
      input({ www: 'add', domain: 'example.com', redirectsText: '/a /b' }),
    );
    expect(out.match(/<IfModule /g)).toHaveLength(2);
    expect(out.match(/<\/IfModule>/g)).toHaveLength(2);
    expect(out.endsWith('\n')).toBe(true);
  });
});

describe('analyzeHtaccess', () => {
  it('wwwを選んでドメインが空・不正ならエラー', () => {
    expect(codes(input({ www: 'add' }))).toContain('domainRequired');
    expect(codes(input({ www: 'add', domain: 'localhost' }))).toContain(
      'invalidDomain',
    );
    expect(codes(input({ www: 'none', domain: 'localhost' }))).not.toContain(
      'invalidDomain',
    );
  });

  it('リダイレクト入力の誤りを返す', () => {
    const issues = analyzeHtaccess(input({ redirectsText: 'x\n/a /a' }));
    expect(issues.map((i) => i.code)).toEqual(
      expect.arrayContaining(['invalidRedirectFormat', 'redirectLoop']),
    );
    expect(issues.find((i) => i.code === 'redirectLoop')?.line).toBe(2);
  });

  it('完全一致での相互転送（A→B と B→A）はループとして出力しない', () => {
    const i = input({
      forceHttps: false,
      redirectsText: '/a /b\n/b /c\n/c /a\n/x /y',
    });
    expect(
      analyzeHtaccess(i).filter((x) => x.code === 'redirectLoop'),
    ).toHaveLength(3);
    const out = buildHtaccess(i);
    expect(out).toContain('"^/x$"');
    expect(out).not.toContain('"^/a$"');
  });

  it('前方一致での /a → /a/b はループ', () => {
    expect(
      codes(input({ redirectMatch: 'prefix', redirectsText: '/a /a/b' })),
    ).toContain('redirectLoop');
    expect(
      codes(input({ redirectMatch: 'exact', redirectsText: '/a /a/b' })),
    ).not.toContain('redirectLoop');
  });

  it('重複・チェーン・HTTP転送先の警告', () => {
    const c = codes(
      input({
        redirectsText: '/a /b\n/a /c\n/b /d\n/x http://example.com/y',
      }),
    );
    expect(c).toContain('duplicateRedirect');
    expect(c).toContain('redirectChain');
    expect(c).toContain('httpTarget');
  });

  it('HTTPS強制のみでプロキシ未指定なら、ループの恐れを知らせる', () => {
    expect(codes(input())).toContain('httpsLoopRisk');
    expect(codes(input({ behindProxy: true }))).not.toContain('httpsLoopRisk');
  });

  it('プロキシ配下でHTTPS強制なしのとき、スキームの注意を出す', () => {
    expect(
      codes(
        input({
          forceHttps: false,
          behindProxy: true,
          trailingSlash: 'add',
        }),
      ),
    ).toContain('proxyScheme');
  });

  it('何も出力されないときは noRules', () => {
    expect(codes(input({ forceHttps: false }))).toEqual(['noRules']);
  });

  it('不正なErrorDocumentを知らせる', () => {
    expect(
      codes(input({ forceHttps: false, errorDoc404: 'not-a-path' })),
    ).toContain('invalidErrorDoc');
  });
});

describe('境界値・異常系（QA追加）', () => {
  it('空のリダイレクト入力は行を作らず、問題も出さない', () => {
    expect(parseRedirects('')).toEqual({ rules: [], issues: [] });
    expect(parseRedirects('\n\n  \n').rules).toEqual([]);
    expect(parseRedirects('\n\n  \n').issues).toEqual([]);
  });

  it('CR のみ・CRLF・LF 混在でも行番号が正しく振られる', () => {
    const text = '/a /x\r\n/b /y\r/c /z\n# comment\r\n/d bad';
    const { rules, issues } = parseRedirects(text);
    expect(rules.map((r) => [r.from, r.line])).toEqual([
      ['/a', 1],
      ['/b', 2],
      ['/c', 3],
    ]);
    expect(issues).toEqual([
      expect.objectContaining({ code: 'invalidTo', line: 5, value: 'bad' }),
    ]);
  });

  it('全角スラッシュや日本語のパス・転送先は受け付けない', () => {
    const { rules, issues } = parseRedirects(
      '／旧 /new\n/日本語 /new\n/old https://例え.jp/\n',
    );
    expect(rules).toEqual([]);
    expect(issues.map((i) => [i.code, i.line])).toEqual([
      ['invalidFrom', 1],
      ['invalidFrom', 2],
      ['invalidTo', 3],
    ]);
  });

  it('ステータスの小数・空白・誤値は不正扱い', () => {
    const { issues } = parseRedirects('/a /b 299\n/c /d 301.5\n/e /f abc');
    expect(issues.map((i) => i.code)).toEqual([
      'invalidStatus',
      'invalidStatus',
      'invalidStatus',
    ]);
  });

  it('改行・引用符・絵文字を含むドメインは不正で、wwwルールを出力しない', () => {
    for (const domain of [
      'example.com\nRewriteRule .* evil',
      'exa"mple.com',
      'example.com😀',
      '日本語.jp',
    ]) {
      const out = buildHtaccess(input({ domain, www: 'add' }));
      expect(out).not.toContain('Redirect to www');
      expect(out).not.toContain('evil');
    }
  });

  it('リダイレクトの転送先に引用符・$ を含めてもルールを注入できない', () => {
    const out = buildHtaccess(
      input({
        domain: 'example.com',
        redirectsText: '/a /b" Redirect 301 /x\n/c /d$1',
      }),
    );
    expect(out).not.toContain('Redirect 301 /x');
    expect(out).not.toContain('/d$1');
  });

  it('巨大入力（5,000行）でも解析・出力が完了し、件数が一致する', () => {
    const lines = Array.from({ length: 5000 }, (_, i) => `/p${i} /q${i}`);
    const text = lines.join('\n');
    const { rules, issues } = parseRedirects(text);
    expect(issues).toEqual([]);
    expect(rules).toHaveLength(5000);
    const out = buildHtaccess(
      input({ domain: 'example.com', redirectsText: text }),
    );
    expect(
      out.split('\n').filter((l) => l.startsWith('RedirectMatch')),
    ).toHaveLength(5000);
  });

  it('非常に長いドメイン（254文字以上）は不正', () => {
    const label = 'a'.repeat(63);
    const long = `${label}.${label}.${label}.${label}.com`;
    expect(long.length).toBeGreaterThan(253);
    expect(isValidDomain(normalizeDomain(long))).toBe(false);
  });

  it('ErrorDocument に改行・全角が混じると出力しない', () => {
    const out = buildHtaccess(
      input({ domain: 'example.com', errorDoc404: '/404.html\nDeny from all' }),
    );
    expect(out).not.toContain('ErrorDocument');
    expect(out).not.toContain('Deny from all');
  });
});
