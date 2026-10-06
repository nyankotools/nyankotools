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
      // WebAssemblyのコンパイル・実行に必要（JSのeval等は許可しない）。
      // GA4計測タグ（gtag.js）の読み込みのため googletagmanager.com も許可する。
      // Cloudflare Web Analytics（Cloudflareダッシュボード側の設定で有効化されており、
      // コード側では制御できない）が自動挿入する beacon.min.js の読み込みのため
      // static.cloudflareinsights.com も許可する。
      scriptDirective: {
        resources: [
          "'self'",
          "'wasm-unsafe-eval'",
          'https://www.googletagmanager.com',
          'https://static.cloudflareinsights.com',
        ],
      },
      directives: [
        "default-src 'self'",
        // 'self' は blob: URLを許可しないため明示的に追加する。画像プレビュー系の
        // 複数ツール（favicon-generator, image-resizer, exif-viewer等）が
        // URL.createObjectURL()で生成したblob: URLを<img>に設定しており、
        // 'self'のみだと本番相当のCSP配信（astro build/preview, wrangler dev）
        // でのみ画像読み込みがブロックされる（astro devではCSP自体検証されず気づけない）。
        // GA4がトラッキングピクセルをgoogletagmanager.comに送信するため許可する。
        "img-src 'self' blob: https://www.googletagmanager.com",
        "font-src 'self'",
        // mic-testerが録音をblob: URLで<audio>に設定して再生するため。省略するとdefault-src 'self'
        // が適用され、本番相当のCSP配信でのみ録音の再生がブロックされる。
        "media-src 'self' blob:",
        // ツール本体はサーバーに一切データを送らない完全ローカル処理を維持しているが、
        // アクセス解析向けの通信（GA4、およびCloudflare Web Analytics）のみ例外として許可する。
        // prefetch機能は <link rel="prefetch"> 非対応ブラウザ（旧Safari等）では fetch()
        // フォールバックがCSPでブロックされ、コンソールに違反警告が出るが、
        // prefetchが効かなくなるだけでサイト機能への実害はないため許容する。
        // wasmをfetchで読み込むツール（pdf-password-protectorのqpdf-wasm等）のため
        // 同一オリジンのみ許可する。GA4以外の外部サーバーへの通信は引き続きブロックされる。
        // gtag.jsは初期化時にリモート設定をgoogletagmanager.comへfetchで取得するため、
        // これも合わせて許可しないと初回のCSP違反が発生しうる。
        // Cloudflare Web Analyticsの計測ビーコン（beacon.min.jsがcloudflareinsights.comへ送信）
        // のため cloudflareinsights.com も許可する。
        "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://cloudflareinsights.com",
        // heic-to（libheif wasm）が変換用のWeb Workerを blob: URLから生成するため（CSPは全ページ共通のため、サイト全体に適用される。connect-src は変えていないので外部送信は引き続きブロックされる）。
        // worker-src を省略すると script-src にフォールバックして blob: が拒否される。
        "worker-src 'self' blob:",
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
        'bcryptjs',
        'fast-xml-parser',
        '@neslinesli93/qpdf-wasm',
        'csso',
        'dompurify',
        'exifr',
        'fflate',
        'heic-to/csp',
        'jsbarcode',
        'jsqr',
        'jsonpath-plus',
        'marked',
        'mediabunny',
        '@mediabunny/mp3-encoder',
        'pdf-lib',
        'pdfjs-dist/legacy/build/pdf.mjs',
        'prettier/standalone',
        'prettier/plugins/babel',
        'prettier/plugins/estree',
        'prettier/plugins/html',
        'prettier/plugins/postcss',
        'qrcode-generator',
        'smol-toml',
        'sql-formatter',
        'svgo/browser',
        'terser',
        'turndown',
        'yaml',
      ],
    },
  },
});
