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
        // 完全ローカル処理を保証するため 'none' を維持する。prefetch機能は
        // <link rel="prefetch"> 非対応ブラウザ（旧Safari等）では fetch()
        // フォールバックがCSPでブロックされ、コンソールに違反警告が出るが、
        // prefetchが効かなくなるだけでサイト機能への実害はないため許容する。
        "connect-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  // ページ遷移高速化: リンクをホバー（または taps/フォーカス）した時点で遷移先HTMLを先読みする。
  // <link rel="prefetch">（対応ブラウザ）または fetch()（フォールバック）を使用。
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
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
    // devサーバーはクライアントで使う外部ライブラリを初回アクセス時に遅延発見して再最適化する。
    // キャッシュのないCI環境では、この再最適化と並行して読み込まれたページで
    // `504 (Outdated Optimize Dep)` が発生してツールのスクリプトが動かず、E2Eが失敗した。
    // 起動時に先に最適化させて再最適化自体を起こさないよう、クライアントで import する
    // ライブラリを列挙する（本番ビルドには影響しない）。新しい外部ライブラリを使うツールを
    // 追加したらここにも追記すること。
    optimizeDeps: {
      include: [
        'csso',
        'dompurify',
        'exifr',
        'jsonpath-plus',
        'marked',
        'prettier/standalone',
        'prettier/plugins/babel',
        'prettier/plugins/estree',
        'prettier/plugins/html',
        'prettier/plugins/postcss',
        'qrcode-generator',
        'smol-toml',
        'sql-formatter',
        'terser',
        'turndown',
        'yaml',
      ],
    },
  },
});
