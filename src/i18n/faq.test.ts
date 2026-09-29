import { describe, it, expect } from 'vitest';
import { tools } from '../data/tools';
import { getFaqItems } from './faq';

describe('FAQ dictionary', () => {
  for (const tool of tools) {
    for (const locale of ['ja', 'en'] as const) {
      it(`${tool.slug} (${locale}) has 3-5 non-empty, unique FAQ items`, () => {
        const items = getFaqItems(tool.slug, locale);
        expect(items.length).toBeGreaterThanOrEqual(3);
        expect(items.length).toBeLessThanOrEqual(5);
        for (const item of items) {
          expect(item.question.trim()).not.toBe('');
          expect(item.answer.trim()).not.toBe('');
          expect(item.answer).toBe(item.answer.trim());
        }
        const questions = items.map((i) => i.question);
        expect(new Set(questions).size).toBe(questions.length);
      });
    }
  }

  it('returns an empty list for unknown slugs', () => {
    expect(getFaqItems('no-such-tool', 'ja')).toEqual([]);
  });
});
