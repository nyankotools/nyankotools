import { describe, expect, it } from 'vitest';
import { shindanUiJa } from '../../i18n/shindan/ui';
import { parseShareHash } from './codec';
import { diagnose } from './compose';
import {
  buildShareText,
  buildShareUrl,
  cardFileName,
  isInAppBrowser,
  lineShareUrl,
  xIntentUrl,
} from './share';
import { testTheme } from './test-theme';
import { RARITIES, type Rarity } from './types';

const templates: Record<Rarity, string[]> = {
  N: ['N1 {title}', 'N2 {type}', 'N3 {label}'],
  R: ['R {rarity}'],
  SR: ['SR {rate}%'],
  SSR: ['SSR'],
  UR: ['UR {unknown}'],
  LR: ['LR'],
};
const values = {
  title: '夜更かし好きの社交派ロシアンブルー',
  type: 'ロシアンブルー',
  rarity: 'N' as Rarity,
  label: '王道',
  rate: 40,
};

describe('buildShareUrl', () => {
  it('テーマページのURLに #r=<共有コード> を付ける', () => {
    const r = diagnose(testTheme, Array(12).fill(1), 5)!;
    const url = buildShareUrl('https://nyankotools.com', 'neko', r.code);
    expect(url).toBe(`https://nyankotools.com/shindan/neko/#r=${r.code}`);
    expect(parseShareHash(new URL(url).hash)).toEqual({ self: r.code });
  });
});

describe('buildShareText', () => {
  it('レア度の候補からテンプレートを選び、値とハッシュタグを入れる', () => {
    const text = buildShareText(templates, values, '1.1.AAAAAA', [
      'にゃんこ診断',
      '猫タイプ診断',
    ]);
    const [body, tags] = text.split('\n');
    expect([
      'N1 夜更かし好きの社交派ロシアンブルー',
      'N2 ロシアンブルー',
      'N3 王道',
    ]).toContain(body);
    expect(tags).toBe('#にゃんこ診断 #猫タイプ診断');
  });

  it('同じ共有コードなら同じ文面、コードが違えば文面がばらける', () => {
    const a = buildShareText(templates, values, '1.1.AAAAAA', []);
    expect(buildShareText(templates, values, '1.1.AAAAAA', [])).toBe(a);
    const bodies = new Set(
      Array.from({ length: 50 }, (_, i) =>
        buildShareText(templates, values, `1.1.code${i}`, []),
      ),
    );
    expect(bodies.size).toBe(3);
  });

  it('ハッシュタグが無ければ本文だけ。未知の置換キーはそのまま残す', () => {
    expect(
      buildShareText(templates, { ...values, rarity: 'SR' }, 'x', []),
    ).toBe('SR 40%');
    expect(
      buildShareText(templates, { ...values, rarity: 'UR' }, 'x', []),
    ).toBe('UR {unknown}');
  });

  it('共通の投稿文テンプレート: 全レア度にあり、置換キーは既知のものだけ・禁止語なし', () => {
    const known = new Set(['title', 'type', 'rarity', 'label', 'rate']);
    for (const rarity of RARITIES) {
      const list = shindanUiJa.shareTexts[rarity];
      expect(list.length).toBeGreaterThanOrEqual(3);
      for (const template of list) {
        for (const [, key] of template.matchAll(/\{(\w+)\}/g)) {
          expect(known.has(key)).toBe(true);
        }
        expect(template).toContain('{title}');
        expect(template).not.toMatch(/排出率|ハズレ|残念|下位/);
        // 出現率を書くときは設計値であることを添える（P6）
        if (template.includes('{rate}')) expect(template).toContain('設計上');
      }
    }
  });
});

describe('共有先のURL', () => {
  const text = '猫タイプ診断の結果 #にゃんこ診断\n2行目 & ?';
  const url = 'https://nyankotools.com/shindan/neko/#r=1.1.AbC-_9';

  it('X: text と url を別のパラメータで渡す（# や & もエンコードする）', () => {
    const x = new URL(xIntentUrl(text, url));
    expect(x.origin + x.pathname).toBe('https://x.com/intent/post');
    expect(x.searchParams.get('text')).toBe(text);
    expect(x.searchParams.get('url')).toBe(url);
  });

  it('LINE: 本文の後ろにURLを付けて1つの text にする', () => {
    const line = new URL(lineShareUrl(text, url));
    expect(line.origin + line.pathname).toBe('https://line.me/R/share');
    expect(line.searchParams.get('text')).toBe(`${text}\n${url}`);
  });
});

describe('isInAppBrowser', () => {
  it.each([
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/13.17.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Twitter for iPhone/10.0',
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36 [FBAN/EMA;FBAV/400.0]',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Instagram 300.0',
  ])('アプリ内ブラウザ: %s', (ua) => {
    expect(isInAppBrowser(ua)).toBe(true);
  });

  it.each([
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
    'Pipeline/1.0',
  ])('通常のブラウザ: %s', (ua) => {
    expect(isInAppBrowser(ua)).toBe(false);
  });
});

describe('cardFileName', () => {
  it('テーマ・タイプ・形をファイル名に入れる', () => {
    expect(cardFileName('neko', 'russian-blue', 'portrait')).toBe(
      'nyanko-shindan-neko-russian-blue-portrait.png',
    );
  });
});
