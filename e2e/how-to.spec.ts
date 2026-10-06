import { test, expect } from './helpers/test';
import { tools } from '../src/data/tools';

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
  'curl-converter',
  'file-hash-calculator',
  'svg-to-png',
  'ogp-image-generator',
  'image-cropper',
  'image-background-remover',
  'mic-tester',
  'dead-pixel-checker',
  'timezone-converter',
  'business-day-calculator',
  'qr-code-reader',
  'heic-converter',
  'pdf-redactor',
  'image-merger',
  'image-text-overlay',
  'gif-maker',
  'pdf-page-number-watermark',
  'pdf-metadata-editor',
  'id-photo-maker',
  'camera-color-picker',
  'zip-tool',
  'screen-recorder',
  'text-merge-tool',
  'keypair-generator',
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

// 対象外のツールには「使い方」を出さない（手順が自明なツールに冗長な見出しを足さない）
for (const { prefix } of locales) {
  for (const { slug } of tools.filter((t) => !slugs.includes(t.slug))) {
    test(`${prefix || '/ja'}/${slug}: 使い方セクションが表示されない`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/tools/${slug}/`);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('[data-howto]')).toHaveCount(0);
    });
  }
}
