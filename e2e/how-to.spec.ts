import { test, expect } from '@playwright/test';

// 複数ステップの操作が必要なツールに「使い方」セクション（HowTo.astro）が表示されること。
const slugs = [
  'pdf-merge-split',
  'pdf-page-editor',
  'pdf-compressor',
  'pdf-image-converter',
  'pdf-to-markdown',
  'pdf-password-protector',
  'image-converter',
  'image-resizer',
  'image-pixelart-converter',
  'favicon-generator',
  'image-palette-extractor',
  'exif-viewer',
];

const locales = [
  { prefix: '', heading: '使い方' },
  { prefix: '/en', heading: 'How to use' },
];

for (const { prefix, heading } of locales) {
  for (const slug of slugs) {
    test(`${prefix || '/ja'}/${slug}: 使い方セクションが表示される`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/tools/${slug}/`);

      await expect(
        page.getByRole('heading', { level: 2, name: heading, exact: true }),
      ).toHaveCount(1);
      const steps = page.locator('main [data-howto] li');
      expect(await steps.count()).toBeGreaterThanOrEqual(3);
    });
  }
}
