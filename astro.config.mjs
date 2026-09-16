// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nyankotools.com',
  build: {
    // scoped <style> をインライン化させず常に外部CSSに切り出す。
    // Content-Security-Policy の style-src 'self' でインラインstyleをブロックしているため必須。
    inlineStylesheets: 'never',
  },
  security: {
    // script-src/style-src は Astro が各ページのインラインscript/styleを
    // 実際にハッシュ化して <meta> タグで自動的に許可する。
    // frame-ancestors 等は <meta> では効かないため public/_headers 側で別途設定する。
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self'",
        "font-src 'self'",
        "connect-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: {
          ja: 'ja',
          en: 'en',
        },
      },
      // 404ページはインデックス対象外のためサイトマップから除外する
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
