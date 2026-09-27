import { describe, it, expect } from 'vitest';
import { tools } from './tools';

describe('tools registry - category consistency', () => {
  // Define the expected 10 categories for ja and en
  const VALID_JA_CATEGORIES = [
    'テキスト',
    'データ変換',
    'エンコード/デコード',
    '日付・時間',
    '画像・デザイン',
    'PDF',
    '計算',
    '開発',
    '生成',
    'カメラ',
  ];

  const VALID_EN_CATEGORIES = [
    'Text',
    'Data Formats',
    'Encode/Decode',
    'Date & Time',
    'Image & Design',
    'PDF',
    'Calculate',
    'Development',
    'Generate',
    'Camera',
  ];

  it('all tools should have valid ja category from the 10 categories', () => {
    const invalidTools: string[] = [];
    for (const tool of tools) {
      const jaCategory = tool.translations.ja.category;
      if (!VALID_JA_CATEGORIES.includes(jaCategory)) {
        invalidTools.push(
          `Tool "${tool.slug}" has invalid ja category: "${jaCategory}"`,
        );
      }
    }
    expect(invalidTools).toHaveLength(0);
  });

  it('all tools should have valid en category from the 10 categories', () => {
    const invalidTools: string[] = [];
    for (const tool of tools) {
      const enCategory = tool.translations.en.category;
      if (!VALID_EN_CATEGORIES.includes(enCategory)) {
        invalidTools.push(
          `Tool "${tool.slug}" has invalid en category: "${enCategory}"`,
        );
      }
    }
    expect(invalidTools).toHaveLength(0);
  });

  it('ja and en categories should be consistently paired (no orphaned categories)', () => {
    const categoryMapping: Record<string, Set<string>> = {};

    for (const tool of tools) {
      const jaCategory = tool.translations.ja.category;
      const enCategory = tool.translations.en.category;

      if (!categoryMapping[jaCategory]) {
        categoryMapping[jaCategory] = new Set();
      }
      categoryMapping[jaCategory].add(enCategory);
    }

    // Each ja category should map to exactly one en category
    const inconsistentMappings: string[] = [];
    for (const [jaCategory, enCategories] of Object.entries(categoryMapping)) {
      if (enCategories.size > 1) {
        inconsistentMappings.push(
          `JA category "${jaCategory}" maps to multiple EN categories: ${Array.from(enCategories).join(', ')}`,
        );
      }
    }
    expect(inconsistentMappings).toHaveLength(0);
  });

  it('should not contain old categories (変換, Convert)', () => {
    const oldJACategories = ['変換'];
    const oldENCategories = ['Convert'];
    const toolsWithOldCategories: string[] = [];

    for (const tool of tools) {
      if (oldJACategories.includes(tool.translations.ja.category)) {
        toolsWithOldCategories.push(
          `Tool "${tool.slug}" still uses old JA category: "${tool.translations.ja.category}"`,
        );
      }
      if (oldENCategories.includes(tool.translations.en.category)) {
        toolsWithOldCategories.push(
          `Tool "${tool.slug}" still uses old EN category: "${tool.translations.en.category}"`,
        );
      }
    }
    expect(toolsWithOldCategories).toHaveLength(0);
  });

  it('every tool should belong to exactly one category', () => {
    const emptyOrInvalidCategories: string[] = [];
    for (const tool of tools) {
      const jaCategory = tool.translations.ja.category;
      const enCategory = tool.translations.en.category;

      if (!jaCategory) {
        emptyOrInvalidCategories.push(
          `Tool "${tool.slug}" has empty ja category`,
        );
      }
      if (!enCategory) {
        emptyOrInvalidCategories.push(
          `Tool "${tool.slug}" has empty en category`,
        );
      }
      if (typeof jaCategory !== 'string') {
        emptyOrInvalidCategories.push(
          `Tool "${tool.slug}" has non-string ja category`,
        );
      }
      if (typeof enCategory !== 'string') {
        emptyOrInvalidCategories.push(
          `Tool "${tool.slug}" has non-string en category`,
        );
      }
    }
    expect(emptyOrInvalidCategories).toHaveLength(0);
  });

  it('all tools count should be 68', () => {
    // Verify total tool count
    expect(tools.length).toBe(68);
  });

  it('category mapping should be consistent (ja -> en)', () => {
    const expectedMapping: Record<string, string> = {
      テキスト: 'Text',
      データ変換: 'Data Formats',
      'エンコード/デコード': 'Encode/Decode',
      '日付・時間': 'Date & Time',
      '画像・デザイン': 'Image & Design',
      PDF: 'PDF',
      計算: 'Calculate',
      開発: 'Development',
      生成: 'Generate',
      カメラ: 'Camera',
    };

    const inconsistentMappings: string[] = [];
    for (const tool of tools) {
      const jaCategory = tool.translations.ja.category;
      const enCategory = tool.translations.en.category;
      const expectedEnCategory = expectedMapping[jaCategory];

      if (!expectedEnCategory) {
        inconsistentMappings.push(
          `No mapping defined for JA category "${jaCategory}"`,
        );
      } else if (enCategory !== expectedEnCategory) {
        inconsistentMappings.push(
          `Tool "${tool.slug}": JA category "${jaCategory}" should map to EN "${expectedEnCategory}", but got "${enCategory}"`,
        );
      }
    }
    expect(inconsistentMappings).toHaveLength(0);
  });
});
