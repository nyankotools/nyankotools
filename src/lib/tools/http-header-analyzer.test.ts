import { describe, it, expect } from 'vitest';
import {
  analyzeHeaders,
  formatRecommendations,
  parseHeaders,
  type FindingId,
} from './http-header-analyzer';

function analyze(text: string) {
  return analyzeHeaders(parseHeaders(text).headers);
}

function find(text: string, id: FindingId) {
  return analyze(text).findings.filter((f) => f.id === id);
}

describe('parseHeaders', () => {
  it('ステータス行とヘッダーを分けて解析する', () => {
    const r = parseHeaders(
      'HTTP/2 200\r\nContent-Type: text/html\nServer: nginx',
    );
    expect(r.statusLine).toBe('HTTP/2 200');
    expect(r.headers).toEqual([
      { name: 'Content-Type', value: 'text/html' },
      { name: 'Server', value: 'nginx' },
    ]);
    expect(r.invalidCount).toBe(0);
  });

  it('値にコロンを含むヘッダーと空行を扱える', () => {
    const r = parseHeaders('Location: https://example.com:8080/a\n\n');
    expect(r.headers).toEqual([
      { name: 'Location', value: 'https://example.com:8080/a' },
    ]);
  });

  it('折り返し行を前のヘッダーに連結する', () => {
    const r = parseHeaders('X-Test: a\n  b');
    expect(r.headers[0].value).toBe('a b');
  });

  it('ヘッダーでない行は invalidCount に数える', () => {
    expect(parseHeaders('これはヘッダーではない\nA: 1').invalidCount).toBe(1);
  });
});

describe('analyzeHeaders', () => {
  it('空のヘッダーでは主要なセキュリティヘッダーが missing になる', () => {
    const a = analyze('');
    const status = (id: FindingId) =>
      a.findings.find((f) => f.id === id)!.status;
    expect(status('hsts')).toBe('missing');
    expect(status('csp')).toBe('missing');
    expect(status('xcto')).toBe('missing');
    expect(status('xfo')).toBe('missing');
    expect(status('referrer')).toBe('missing');
    expect(status('permissions')).toBe('missing');
    expect(status('coop')).toBe('info');
    expect(a.recommendations.map((r) => r.name)).toEqual([
      'Strict-Transport-Security',
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Permissions-Policy',
    ]);
  });

  it('HSTS: max-age が短いと warn、十分なら good', () => {
    expect(
      find('Strict-Transport-Security: max-age=300', 'hsts')[0].issues,
    ).toEqual(['hstsShort']);
    expect(
      find('Strict-Transport-Security: max-age=31536000', 'hsts')[0].status,
    ).toBe('good');
    expect(
      find('Strict-Transport-Security: includeSubDomains', 'hsts')[0].issues,
    ).toEqual(['hstsNoMaxAge']);
  });

  it('CSP: unsafe-inline / unsafe-eval / ワイルドカードを検出する', () => {
    const f = find(
      "Content-Security-Policy: script-src 'self' 'unsafe-inline' 'unsafe-eval' *",
      'csp',
    )[0];
    expect(f.issues).toEqual([
      'cspUnsafeInline',
      'cspUnsafeEval',
      'cspWildcard',
    ]);
  });

  it('CSP: nonce があれば unsafe-inline は指摘しない', () => {
    const f = find(
      "Content-Security-Policy: script-src 'nonce-abc' 'unsafe-inline'",
      'csp',
    )[0];
    expect(f.issues).toEqual([]);
  });

  it('CSP: default-src も script-src もなければ cspNoFallback', () => {
    expect(
      find("Content-Security-Policy: img-src 'self'", 'csp')[0].issues,
    ).toEqual(['cspNoFallback']);
  });

  it('CSP: Report-Only のみなら warn で推奨値を出す', () => {
    const a = analyze(
      "Content-Security-Policy-Report-Only: default-src 'self'",
    );
    expect(a.findings.find((f) => f.id === 'csp')!.issues).toEqual([
      'cspReportOnly',
    ]);
    expect(
      a.recommendations.some((r) => r.name === 'Content-Security-Policy'),
    ).toBe(true);
  });

  it('X-Frame-Options 未設定でも CSP の frame-ancestors があれば good', () => {
    const f = find(
      "Content-Security-Policy: default-src 'self'; frame-ancestors 'none'",
      'xfo',
    )[0];
    expect(f.status).toBe('good');
    expect(f.issues).toEqual(['xfoCoveredByCsp']);
  });

  it('X-Frame-Options: ALLOW-FROM は warn', () => {
    expect(
      find('X-Frame-Options: ALLOW-FROM https://a.example', 'xfo')[0].issues,
    ).toEqual(['xfoAllowFrom']);
  });

  it('X-Content-Type-Options: nosniff 以外は warn', () => {
    expect(find('X-Content-Type-Options: nosniff', 'xcto')[0].status).toBe(
      'good',
    );
    expect(find('X-Content-Type-Options: sniff', 'xcto')[0].issues).toEqual([
      'xctoInvalid',
    ]);
  });

  it('Referrer-Policy: unsafe-url は warn、複数指定は最後の値で判定', () => {
    expect(find('Referrer-Policy: unsafe-url', 'referrer')[0].issues).toEqual([
      'referrerWeak',
    ]);
    expect(
      find('Referrer-Policy: unsafe-url, strict-origin', 'referrer')[0].status,
    ).toBe('good');
  });

  it('Server にバージョンがあれば warn、X-Powered-By は常に warn', () => {
    expect(find('Server: Apache/2.4.41', 'server')[0].issues).toEqual([
      'serverVersion',
    ]);
    expect(find('Server: cloudflare', 'server')[0].status).toBe('info');
    expect(find('X-Powered-By: Express', 'poweredBy')[0].status).toBe('warn');
    expect(find('', 'server')).toEqual([]);
  });

  it('Set-Cookie: 属性の不足を検出し、値は結果に含めない', () => {
    const cookies = find(
      'Set-Cookie: sid=SECRET123; Path=/\nSet-Cookie: a=1; Secure; HttpOnly; SameSite=Lax',
      'cookie',
    );
    expect(cookies).toHaveLength(2);
    expect(cookies[0].value).toBe('sid');
    expect(cookies[0].issues).toEqual([
      'cookieNoSecure',
      'cookieNoHttpOnly',
      'cookieNoSameSite',
    ]);
    expect(cookies[1].status).toBe('good');
    expect(JSON.stringify(cookies)).not.toContain('SECRET123');
  });

  it('Set-Cookie: SameSite=None で Secure なしは warn', () => {
    expect(
      find('Set-Cookie: a=1; HttpOnly; SameSite=None', 'cookie')[0].issues,
    ).toContain('cookieSameSiteNoneInsecure');
  });

  it('CORS: * は info、認証情報付きの * は warn', () => {
    expect(find('Access-Control-Allow-Origin: *', 'cors')[0].status).toBe(
      'info',
    );
    const f = find(
      'Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true',
      'cors',
    )[0];
    expect(f.status).toBe('warn');
    expect(f.issues).toEqual(['corsWildcardCredentials']);
    expect(find('Access-Control-Allow-Origin: null', 'cors')[0].issues).toEqual(
      ['corsNull'],
    );
    expect(find('', 'cors')).toEqual([]);
  });

  it('ヘッダー名の大文字小文字を区別しない', () => {
    expect(find('x-content-type-options: nosniff', 'xcto')[0].status).toBe(
      'good',
    );
  });

  it('複数の折り返し行を複数のヘッダーから処理する', () => {
    const r = parseHeaders(
      'X-Custom-A: value1\n  continuation1\nX-Custom-B: value2\n  continuation2',
    );
    expect(r.headers).toHaveLength(2);
    expect(r.headers[0].value).toBe('value1 continuation1');
    expect(r.headers[1].value).toBe('value2 continuation2');
  });

  it('大量のヘッダーを処理できる', () => {
    const lines: string[] = [];
    for (let i = 0; i < 100; i++) {
      lines.push(`X-Custom-${i}: value${i}`);
    }
    const r = parseHeaders(lines.join('\n'));
    expect(r.headers).toHaveLength(100);
    expect(r.headers[0].name).toBe('X-Custom-0');
    expect(r.headers[99].name).toBe('X-Custom-99');
  });

  it('非常に長いヘッダー値を処理できる', () => {
    const longValue = 'a'.repeat(10000);
    const r = parseHeaders(`X-Long: ${longValue}`);
    expect(r.headers[0].value).toBe(longValue);
    expect(r.headers[0].value).toHaveLength(10000);
  });
});

describe('formatRecommendations', () => {
  const recs = [{ name: 'X-Frame-Options', value: 'SAMEORIGIN' }];

  it('各形式に整形する', () => {
    expect(formatRecommendations(recs, 'raw')).toBe(
      'X-Frame-Options: SAMEORIGIN',
    );
    expect(formatRecommendations(recs, 'nginx')).toBe(
      'add_header X-Frame-Options "SAMEORIGIN" always;',
    );
    expect(formatRecommendations(recs, 'apache')).toBe(
      'Header always set X-Frame-Options "SAMEORIGIN"',
    );
    expect(formatRecommendations(recs, 'headers-file')).toBe(
      '/*\n  X-Frame-Options: SAMEORIGIN',
    );
  });

  it('推奨が空なら空文字', () => {
    expect(formatRecommendations([], 'raw')).toBe('');
    expect(formatRecommendations([], 'headers-file')).toBe('');
  });
});
