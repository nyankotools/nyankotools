import { test, expect } from './helpers/test';
import { tools, type Locale } from '../src/data/tools';

const locales: { locale: Locale; prefix: string }[] = [
  { locale: 'ja', prefix: '' },
  { locale: 'en', prefix: '/en' },
];

// ツール別OGP画像: og:image が /ogp/ 以下のツール別画像を指し、その画像が実在する（PNGで返る）こと。
// ブラウザを使わず HTTP だけで確認するため軽い。画像は scripts/ogp/generate.mjs がビルド時に生成する。
for (const { locale, prefix } of locales) {
  test.describe(`ツール別OGP画像（${locale}）`, () => {
    for (const tool of tools) {
      test(`${tool.slug}: og:image がツール別画像を指し、実在する`, async ({
        request,
      }) => {
        const html = await (
          await request.get(`${prefix}/tools/${tool.slug}/`)
        ).text();
        const expected = `https://nyankotools.com/ogp/${locale === 'en' ? 'en/' : ''}${tool.slug}.png`;
        expect(html).toContain(`property="og:image" content="${expected}"`);
        expect(html).toContain(`name="twitter:image" content="${expected}"`);

        const image = await request.get(new URL(expected).pathname);
        expect(image.status()).toBe(200);
        expect(image.headers()['content-type']).toBe('image/png');
      });
    }
  });
}
