import { describe, it, expect } from 'vitest';
import {
  analyzeNginx,
  buildNginx,
  emptyInput,
  parseRedirects,
  type NginxInput,
} from './nginx-redirect-generator';

const input = (over: Partial<NginxInput> = {}): NginxInput => ({
  ...emptyInput(),
  ...over,
});
const codes = (i: NginxInput) => analyzeNginx(i).map((x) => x.code);

describe('buildNginx: HTTPS強制', () => {
  it('初期状態はHTTPのserverブロックでHTTPSへ301する', () => {
    const out = buildNginx(input());
    expect(out).toContain('listen 80;');
    expect(out).toContain('server_name _;');
    expect(out).toContain('return 301 https://$host$request_uri;');
  });

  it('プロキシ配下では X-Forwarded-Proto を見る if になる', () => {
    const out = buildNginx(input({ behindProxy: true }));
    expect(out).toContain('$http_x_forwarded_proto = "http"');
    expect(out).not.toContain('listen 80;');
  });

  it('何も選ばないと空', () => {
    const i = input({ forceHttps: false });
    expect(buildNginx(i)).toBe('');
    expect(codes(i)).toEqual(['noRules']);
  });
});

describe('buildNginx: www統一', () => {
  it('wwwなしに統一: wwwホストのserverブロックを出力し、HTTP側も正規ホストへ向ける', () => {
    const out = buildNginx(
      input({ www: 'remove', domain: 'https://WWW.Example.com/' }),
    );
    expect(out).toContain('server_name www.example.com;');
    expect(out).toContain('return 301 https://example.com$request_uri;');
    expect(out).toContain('server_name example.com www.example.com;');
    expect(out).toContain('ssl_certificate ');
  });

  it('wwwありに統一', () => {
    const out = buildNginx(
      input({ www: 'add', domain: 'example.com', forceHttps: false }),
    );
    expect(out).toContain('server_name example.com;');
    expect(out).toContain('return 301 $scheme://www.example.com$request_uri;');
    expect(out).not.toContain('ssl_certificate');
  });

  it('ドメイン未入力・不正だとエラーで出力されない', () => {
    const none = input({ www: 'add', forceHttps: false });
    expect(codes(none)).toContain('domainRequired');
    expect(buildNginx(none)).toBe('');
    const bad = input({ www: 'add', domain: 'a;b.com', forceHttps: false });
    expect(codes(bad)).toContain('invalidDomain');
    expect(buildNginx(bad)).toBe('');
  });

  it('証明書の注意を出す', () => {
    expect(codes(input({ www: 'remove', domain: 'example.com' }))).toContain(
      'certificateNeeded',
    );
  });
});

describe('buildNginx: パスの正規化', () => {
  it('末尾スラッシュを付ける・外す', () => {
    const add = buildNginx(input({ forceHttps: false, trailingSlash: 'add' }));
    expect(add).toContain(
      'rewrite ^([^.]*[^/])$ $scheme://$host$1/ permanent;',
    );
    const rm = buildNginx(
      input({ forceHttps: false, trailingSlash: 'remove' }),
    );
    expect(rm).toContain('if (!-d $request_filename)');
    expect(rm).toContain('rewrite ^/(.+)/$ $scheme://$host/$1 permanent;');
  });

  it('index.html の除去は $request_uri で判定する', () => {
    const out = buildNginx(input({ forceHttps: false, removeIndex: true }));
    expect(out).toContain(
      'if ($request_uri ~* "^(.*/)index\\.(?:html?|php)(?:\\?|$)")',
    );
    expect(out).toContain('return 301 $scheme://$host$1$is_args$args;');
  });
});

describe('parseRedirects', () => {
  it('空行とコメントを無視し、ステータスの既定は301', () => {
    const r = parseRedirects('# c\n\n/a /b\n/c https://x.com/d 302');
    expect(r.issues).toEqual([]);
    expect(r.rules.map((x) => [x.from, x.to, x.status])).toEqual([
      ['/a', '/b', 301],
      ['/c', 'https://x.com/d', 302],
    ]);
  });

  it('インジェクションになる文字を弾く', () => {
    const bad = [
      '/a /b;return 200',
      '/a;x /b',
      '/a{ /b',
      '/a /b"x',
      '/a /b$host',
      '/a /b\\x',
      '/a%20b /b',
      '/a?x=1 /b',
      'a /b',
      '/a //evil.com',
      '/a ftp://x.com',
      '/a /日本語',
      '/a /b 303',
      '/a',
      '/a /b 301 extra',
    ];
    for (const line of bad) {
      expect(parseRedirects(line).rules, line).toEqual([]);
      expect(parseRedirects(line).issues.length, line).toBe(1);
    }
  });

  it('改行を含む値は行ごとに分割され、設定行を足せない', () => {
    const r = parseRedirects('/a /b\n}\nserver {');
    expect(r.rules).toHaveLength(1);
    expect(r.issues).toHaveLength(2);
    const out = buildNginx(
      input({ forceHttps: false, redirectsText: '/a /b\n}\nserver {' }),
    );
    expect(out).not.toMatch(/^server \{$/m);
  });

  it('元パスの日本語はそのまま許可される', () => {
    expect(parseRedirects('/日本語 /ja').rules).toHaveLength(1);
  });
});

describe('buildNginx: 個別リダイレクト', () => {
  it('完全一致は location = を使う', () => {
    const out = buildNginx(
      input({
        forceHttps: false,
        redirectsText: '/old.html /new\n/a https://example.com/b?x=1 302',
      }),
    );
    expect(out).toContain('location = "/old.html" {');
    expect(out).toContain('return 301 "/new";');
    expect(out).toContain('return 302 "https://example.com/b?x=1";');
  });

  it('前方一致は名前付きキャプチャで配下を引き継ぐ', () => {
    const out = buildNginx(
      input({
        forceHttps: false,
        redirectMatch: 'prefix',
        redirectsText: '/old/ /new/',
      }),
    );
    expect(out).toContain('location ~ "^/old(?<rest>/.*)?$" {');
    expect(out).toContain('return 301 "/new$rest";');
  });

  it('前方一致で転送先がルートのとき', () => {
    const out = buildNginx(
      input({
        forceHttps: false,
        redirectMatch: 'prefix',
        redirectsText: '/old /',
      }),
    );
    expect(out).toContain('(?:/(?<rest>.*))?$');
    expect(out).toContain('return 301 "/$rest";');
  });

  it('正規表現の特殊文字をエスケープする', () => {
    const out = buildNginx(
      input({
        forceHttps: false,
        redirectMatch: 'prefix',
        redirectsText: '/a.b+c /x',
      }),
    );
    expect(out).toContain('^/a\\.b\\+c(?<rest>/.*)?$');
  });

  it('ループは出力せずエラーにする', () => {
    const i = input({
      forceHttps: false,
      redirectsText: '/x /x\n/a /b\n/b /a',
    });
    expect(codes(i).filter((c) => c === 'redirectLoop')).toHaveLength(3);
    expect(buildNginx(i)).toBe('');
  });

  it('前方一致では配下への転送がループ', () => {
    expect(
      codes(
        input({
          forceHttps: false,
          redirectMatch: 'prefix',
          redirectsText: '/a /a/b',
        }),
      ),
    ).toContain('redirectLoop');
  });

  it('重複・連鎖・http転送先を警告する', () => {
    const c = codes(
      input({
        redirectsText: '/a /b\n/a /c\n/b /d\n/e http://x.com/',
      }),
    );
    expect(c).toContain('duplicateRedirect');
    expect(c).toContain('redirectChain');
    expect(c).toContain('httpTarget');
  });
});

describe('analyzeNginx: 重複・末尾スラッシュ', () => {
  it('重複する元パスは最初の1件だけ出力する', () => {
    const out = buildNginx(input({ redirectsText: '/a /b\n/a /c' }));
    expect(out.match(/location = "\/a"/g)?.length).toBe(1);
    expect(out).toContain('"/b"');
    expect(out).not.toContain('"/c"');
  });

  it('末尾スラッシュ設定と個別リダイレクトの併用を警告する', () => {
    expect(
      codes(input({ trailingSlash: 'add', redirectsText: '/old /new' })),
    ).toContain('slashRedirectConflict');
    expect(codes(input({ redirectsText: '/old /new' }))).not.toContain(
      'slashRedirectConflict',
    );
  });
});

describe('analyzeNginx: プロキシ', () => {
  it('プロキシ配下でHTTPS強制なしの正規化は注意する', () => {
    expect(
      codes(input({ behindProxy: true, forceHttps: false, removeIndex: true })),
    ).toContain('proxyScheme');
  });
});
