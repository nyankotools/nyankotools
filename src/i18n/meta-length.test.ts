import { describe, expect, it } from 'vitest';
import type { Locale } from '../data/tools';

interface Meta {
  title?: unknown;
  description?: unknown;
}

const modules = import.meta.glob('./tools/*.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

// 英語ページの meta description / title は検索結果で切れない長さに収める
const MAX_EN_DESCRIPTION = 160;
const MAX_EN_TITLE = 60;

describe('en の meta description / title の長さ', () => {
  for (const [file, exported] of Object.entries(modules)) {
    for (const value of Object.values(exported)) {
      const en = (value as Record<Locale, Meta> | undefined)?.en;
      if (!en || typeof en.description !== 'string') continue;
      it(`${file}`, () => {
        expect((en.description as string).length).toBeLessThanOrEqual(
          MAX_EN_DESCRIPTION,
        );
        if (typeof en.title === 'string') {
          expect(en.title.length).toBeLessThanOrEqual(MAX_EN_TITLE);
        }
      });
    }
  }
});
