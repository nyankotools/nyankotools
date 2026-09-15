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
    'footer.privacy': 'プライバシーポリシー',
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
      'ブラウザだけで完結する便利ツール集です。データはどれもサーバーに送信されません。',
    'home.search.label': 'ツールを検索',
    'home.search.placeholder': 'ツールを検索（例: 文字数、変換）',
    'home.category.all': 'すべて',
    'home.category.groupLabel': 'カテゴリで絞り込み',
    'home.noResults': '条件に一致するツールが見つかりませんでした。',
    'home.meta.description':
      'にゃんこツールは、開発者やクリエイターに役立つブラウザ上で動作する便利Webツール集です。',
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
    'footer.privacy': 'Privacy Policy',
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
      'A collection of handy tools that run entirely in your browser. None of your data is ever sent to a server.',
    'home.search.label': 'Search tools',
    'home.search.placeholder': 'Search tools (e.g. character count, convert)',
    'home.category.all': 'All',
    'home.category.groupLabel': 'Filter by category',
    'home.noResults': 'No tools match your search.',
    'home.meta.description':
      'NyankoTools is a collection of handy browser-based web tools for developers and creators.',
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
