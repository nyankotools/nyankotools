import { describe, expect, it } from 'vitest';
import {
  analyzeRobots,
  buildRobotsTxt,
  checkPath,
  emptyGroup,
  parseLines,
  parseUserAgents,
  presetGroups,
  type RobotsGroup,
} from './robots-txt-generator';

function g(partial: Partial<RobotsGroup>): RobotsGroup {
  return { ...emptyGroup(), ...partial };
}

describe('parseLines / parseUserAgents', () => {
  it('空行と前後の空白を除去する', () => {
    expect(parseLines(' /a \r\n\n/b\n  \n')).toEqual(['/a', '/b']);
  });

  it('User-agent をカンマ・空白区切りで分割し大文字小文字の重複を除く', () => {
    expect(parseUserAgents('GPTBot, ClaudeBot  gptbot\nCCBot')).toEqual([
      'GPTBot',
      'ClaudeBot',
      'CCBot',
    ]);
    expect(parseUserAgents('')).toEqual([]);
  });
});

describe('checkPath', () => {
  it('/ 始まりは ok', () => {
    expect(checkPath('/')).toBe('ok');
    expect(checkPath('/private/')).toBe('ok');
    expect(checkPath('/*.pdf$')).toBe('ok');
  });
  it('/ で始まらないパスを検出する', () => {
    expect(checkPath('private/')).toBe('noSlash');
    expect(checkPath('*.pdf')).toBe('noSlash');
  });
  it('完全なURLと空白を検出する', () => {
    expect(checkPath('https://example.com/a')).toBe('fullUrl');
    expect(checkPath('/a b')).toBe('hasSpace');
  });
});

describe('buildRobotsTxt', () => {
  it('基本のグループとSitemapを出力する', () => {
    const text = buildRobotsTxt({
      groups: [
        g({
          userAgents: ['*'],
          disallow: ['/admin/'],
          allow: ['/admin/public/'],
        }),
      ],
      sitemaps: ['https://example.com/sitemap.xml'],
    });
    expect(text).toBe(
      'User-agent: *\nDisallow: /admin/\nAllow: /admin/public/\n\nSitemap: https://example.com/sitemap.xml\n',
    );
  });

  it('ルールが無いグループは空の Disallow を出す', () => {
    expect(buildRobotsTxt({ groups: [g({})], sitemaps: [] })).toBe(
      'User-agent: *\nDisallow:\n',
    );
  });

  it('複数 User-agent と複数グループを空行で区切る', () => {
    const text = buildRobotsTxt({
      groups: [
        g({ userAgents: ['GPTBot', 'CCBot'], disallow: ['/'] }),
        g({ userAgents: ['*'], crawlDelay: '10' }),
      ],
      sitemaps: [],
    });
    expect(text).toBe(
      'User-agent: GPTBot\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: *\nDisallow:\nCrawl-delay: 10\n',
    );
  });

  it('User-agent が空のグループと不正な Crawl-delay は出力しない', () => {
    const text = buildRobotsTxt({
      groups: [
        g({ userAgents: [], disallow: ['/x'] }),
        g({ userAgents: ['Bingbot'], crawlDelay: 'abc' }),
      ],
      sitemaps: [],
    });
    expect(text).toBe('User-agent: Bingbot\nDisallow:\n');
  });

  it('何も無ければ空文字', () => {
    expect(buildRobotsTxt({ groups: [], sitemaps: [] })).toBe('');
  });

  it('Sitemap のみでも出力できる', () => {
    expect(
      buildRobotsTxt({ groups: [], sitemaps: ['https://a.example/s.xml'] }),
    ).toBe('Sitemap: https://a.example/s.xml\n');
  });
});

describe('presetGroups', () => {
  it('blockAi は AI ボットを全て含み Disallow: / を持つ', () => {
    const [grp] = presetGroups('blockAi');
    expect(grp.userAgents).toEqual(
      expect.arrayContaining([
        'GPTBot',
        'ClaudeBot',
        'CCBot',
        'Google-Extended',
      ]),
    );
    expect(grp.disallow).toEqual(['/']);
  });

  it('全プリセットがエラー無しで出力できる', () => {
    for (const id of [
      'allowAll',
      'blockAll',
      'blockAi',
      'wordpress',
      'blockQuery',
    ] as const) {
      const groups = presetGroups(id);
      const errors = analyzeRobots({ groups, sitemaps: [] }).filter(
        (i) => i.severity === 'error',
      );
      expect(errors, id).toEqual([]);
    }
  });
});

describe('analyzeRobots', () => {
  const codes = (groups: RobotsGroup[], sitemaps: string[] = []) =>
    analyzeRobots({ groups, sitemaps }).map((i) => i.code);

  it('全体Disallowを * に対して警告する', () => {
    expect(codes([g({ disallow: ['/'] })])).toContain('blockAll');
  });

  it('検索エンジンのボットに対する全体Disallowを警告する', () => {
    const issues = analyzeRobots({
      groups: [g({ userAgents: ['Googlebot'], disallow: ['/'] })],
      sitemaps: [],
    });
    expect(issues[0].code).toBe('blockAllSearch');
    expect(issues[0].value).toBe('Googlebot');
  });

  it('AIボットの全体Disallowは警告しない', () => {
    expect(codes([g({ userAgents: ['GPTBot'], disallow: ['/'] })])).toEqual([]);
  });

  it('全体Disallowと Allow の併用は別の警告にする', () => {
    const c = codes([g({ disallow: ['/'], allow: ['/public/'] })]);
    expect(c).toContain('allowOverridesBlockAll');
    expect(c).not.toContain('blockAll');
  });

  it('/ で始まらないパスはエラー', () => {
    const issues = analyzeRobots({
      groups: [g({ disallow: ['admin'], allow: ['https://x.example/a'] })],
      sitemaps: [],
    });
    expect(issues.map((i) => i.code)).toEqual(['pathNoSlash', 'pathFullUrl']);
    expect(issues.every((i) => i.severity === 'error')).toBe(true);
    expect(issues[0].group).toBe(1);
  });

  it('User-agent 未指定・不正文字をエラーにする', () => {
    expect(codes([g({ userAgents: [] })])).toContain('noUserAgent');
    expect(codes([g({ userAgents: ['Bad:Bot'] })])).toContain(
      'invalidUserAgent',
    );
  });

  it('グループ間の User-agent 重複を警告する', () => {
    expect(
      codes([g({ userAgents: ['GPTBot'] }), g({ userAgents: ['gptbot'] })]),
    ).toContain('duplicateUserAgent');
  });

  it('Sitemap は絶対 http(s) URL のみ許可する', () => {
    expect(codes([g({})], ['https://example.com/sitemap.xml'])).toEqual([]);
    expect(codes([g({})], ['/sitemap.xml'])).toContain('invalidSitemap');
    expect(codes([g({})], ['ftp://example.com/s.xml'])).toContain(
      'invalidSitemap',
    );
  });

  it('不正な Crawl-delay をエラーにする', () => {
    expect(codes([g({ crawlDelay: '-1' })])).toContain('invalidCrawlDelay');
    expect(codes([g({ crawlDelay: '1.5' })])).toEqual([]);
  });

  it('何も入力が無ければ noGroups', () => {
    expect(codes([])).toEqual(['noGroups']);
  });

  it('グループが複数あり中身が空のグループを警告する', () => {
    expect(
      codes([g({ disallow: ['/a'] }), g({ userAgents: ['Bingbot'] })]),
    ).toContain('emptyGroup');
  });
});

describe('追加の境界・特殊入力', () => {
  const issuesOf = (groups: RobotsGroup[], sitemaps: string[] = []) =>
    analyzeRobots({ groups, sitemaps });

  it('空白を含むパスを pathHasSpace としてエラーにする', () => {
    const issues = issuesOf([g({ disallow: ['/a b'] })]);
    expect(issues.map((i) => i.code)).toEqual(['pathHasSpace']);
    expect(issues[0].value).toBe('/a b');
  });

  it('数値でない Crawl-delay をエラーにする', () => {
    expect(issuesOf([g({ crawlDelay: 'abc' })]).map((i) => i.code)).toContain(
      'invalidCrawlDelay',
    );
  });

  it('ホスト名のない Sitemap URL（https://）をエラーにする', () => {
    expect(issuesOf([g({})], ['https://']).map((i) => i.code)).toContain(
      'invalidSitemap',
    );
  });

  it('日本語のパスは有効として扱う', () => {
    expect(checkPath('/日本語/')).toBe('ok');
  });

  it('複数の検索ボットへの全体Disallowは、まとめて1件の警告にする', () => {
    const issues = issuesOf([
      g({ userAgents: ['Googlebot', 'Bingbot'], disallow: ['/'] }),
    ]);
    expect(issues.map((i) => i.code)).toEqual(['blockAllSearch']);
    expect(issues[0].value).toBe('Googlebot, Bingbot');
  });

  it('Allow だけのグループは Disallow 行を追加しない', () => {
    expect(
      buildRobotsTxt({ groups: [g({ allow: ['/x'] })], sitemaps: [] }),
    ).toBe('User-agent: *\nAllow: /x\n');
  });

  it('Crawl-delay の前後の空白を除去して出力する', () => {
    expect(
      buildRobotsTxt({
        groups: [
          g({ userAgents: ['Bingbot'], disallow: ['/x'], crawlDelay: ' 5 ' }),
        ],
        sitemaps: [],
      }),
    ).toBe('User-agent: Bingbot\nDisallow: /x\nCrawl-delay: 5\n');
  });

  it('グループが多くても全て出力する', () => {
    const groups = Array.from({ length: 500 }, (_, i) =>
      g({ userAgents: [`Bot${i}`], disallow: [`/p${i}/`] }),
    );
    const text = buildRobotsTxt({ groups, sitemaps: [] });
    expect(
      text.split('\n').filter((l) => l.startsWith('User-agent:')),
    ).toHaveLength(500);
  });
});
