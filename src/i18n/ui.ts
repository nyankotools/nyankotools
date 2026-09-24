import type { Locale } from '../data/tools';

export const defaultLocale: Locale = 'ja';
export const locales: Locale[] = ['ja', 'en'];

export const languageNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
};

export const ogLocaleMap: Record<Locale, string> = {
  ja: 'ja_JP',
  en: 'en_US',
};

export const ui = {
  ja: {
    'site.name': 'にゃんこツール',
    'nav.menu.open': 'メニューを開く',
    'nav.language': '言語',
    'nav.theme': '表示テーマ',
    'nav.theme.light': 'ライト',
    'nav.theme.dark': 'ダーク',
    'nav.theme.system': 'システム',
    'nav.favorites': 'お気に入り',
    'favorite.add': 'お気に入りに追加',
    'favorite.remove': 'お気に入りから削除',
    'favorite.moveUp': '上に移動',
    'favorite.moveDown': '下に移動',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.contact': 'お問い合わせ',
    'footer.about': '運営者情報',
    'footer.faq': 'よくある質問',
    'footer.x': '公式X（旧Twitter）',
    'share.heading': 'このページをシェア',
    'share.x': 'Xでシェア',
    'share.facebook': 'Facebookでシェア',
    'share.line': 'LINEでシェア',
    'share.hatena': 'はてなブックマークに追加',
    'share.copy': 'リンクをコピー',
    'share.copied': 'コピーしました',
    'share.copyFailed': 'コピーに失敗しました',
    'share.native': '共有',
    'home.title': '🐾 にゃんこツール',
    'home.lead':
      'JSON整形やBase64変換などの定番ツールに加え、かな変換・全角/半角変換のような日本語特有の処理まで丁寧にカバー。ブラウザだけで完結し、入力したデータがサーバーに送信されることはありません。',
    'home.search.label': 'ツールを検索',
    'home.search.placeholder': 'ツールを検索（例: 文字数、変換）',
    'home.category.all': 'すべて',
    'home.category.groupLabel': 'カテゴリで絞り込み',
    'home.noResults': '条件に一致するツールが見つかりませんでした。',
    'home.meta.description':
      'にゃんこツールは、JSON整形やBase64変換などの定番ツールから、かな変換・全角半角変換など日本語処理まで揃った、ブラウザ完結・登録不要の無料Webツール集です。',
    '404.title': '404 - ページが見つかりません',
    '404.description':
      'お探しのページは見つかりませんでした。URLをご確認いただくか、トップページからツールをお探しください。',
    '404.backHome': 'トップページに戻る',
  },
  en: {
    'site.name': 'NyankoTools',
    'nav.menu.open': 'Open menu',
    'nav.language': 'Language',
    'nav.theme': 'Theme',
    'nav.theme.light': 'Light',
    'nav.theme.dark': 'Dark',
    'nav.theme.system': 'System',
    'nav.favorites': 'Favorites',
    'favorite.add': 'Add to favorites',
    'favorite.remove': 'Remove from favorites',
    'favorite.moveUp': 'Move up',
    'favorite.moveDown': 'Move down',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.about': 'About',
    'footer.faq': 'FAQ',
    'footer.x': 'Official X (Twitter)',
    'share.heading': 'Share this page',
    'share.x': 'Share on X',
    'share.facebook': 'Share on Facebook',
    'share.line': 'Share on LINE',
    'share.hatena': 'Add to Hatena Bookmark',
    'share.copy': 'Copy link',
    'share.copied': 'Copied',
    'share.copyFailed': 'Copy failed',
    'share.native': 'Share',
    'home.title': '🐾 NyankoTools',
    'home.lead':
      'Everyday tools like JSON formatting and Base64 conversion, plus careful support for Japanese-specific text processing like kana and full-width/half-width conversion — all running entirely in your browser. Nothing you type is ever sent to a server.',
    'home.search.label': 'Search tools',
    'home.search.placeholder': 'Search tools (e.g. character count, convert)',
    'home.category.all': 'All',
    'home.category.groupLabel': 'Filter by category',
    'home.noResults': 'No tools match your search.',
    'home.meta.description':
      'NyankoTools is a free, browser-only toolkit covering everyday developer tools like JSON formatting and Base64 conversion, plus careful support for Japanese text processing such as kana and full-width/half-width conversion.',
    '404.title': '404 - Page Not Found',
    '404.description':
      "The page you're looking for could not be found. Please check the URL or find a tool from the homepage.",
    '404.backHome': 'Back to homepage',
  },
} as const;

export type UiKey = keyof (typeof ui)['ja'];

export function useTranslations(locale: Locale) {
  return function t(key: UiKey): string {
    return ui[locale][key];
  };
}

/** ja版パスから対応するen版パス（またはその逆）を求める */
export function getAlternatePath(pathname: string, locale: Locale): string {
  if (locale === 'ja') {
    return `/en${pathname}`;
  }
  return pathname.replace(/^\/en\//, '/').replace(/^\/en$/, '/');
}
