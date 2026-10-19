import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UtmBuilderPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  urlsLabel: string;
  urlsHint: string;
  urlsPlaceholder: string;
  presetHeading: string;
  campaignPresetHeading: string;
  sourceLabel: string;
  mediumLabel: string;
  campaignLabel: string;
  termLabel: string;
  contentLabel: string;
  sourcePlaceholder: string;
  mediumPlaceholder: string;
  campaignPlaceholder: string;
  termPlaceholder: string;
  contentPlaceholder: string;
  lowercase: string;
  missingNotice: string;
  replacedNotice: string;
  outputLabel: string;
  summary: string;
  copy: string;
  copied: string;
  copyFailed: string;
  errorEmpty: string;
  errorInvalid: string;
  errorMissingScheme: string;
  errorUnsupportedScheme: string;
  errorNoParams: string;
  lineLabel: string;
  historyHeading: string;
  historyEmpty: string;
  historyLoad: string;
  historyClear: string;
  historyUnavailable: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const utmBuilderContent: Record<Locale, UtmBuilderPageContent> = {
  ja: {
    title: 'UTMビルダー｜UTMパラメータ付きURL作成（一括対応）',
    description:
      'UTMパラメータ（source・medium・campaign・term・content）付きのURLを作成する無料ツールです。プリセット、複数URLの一括生成、既存クエリ・ハッシュの保持に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'UTMビルダー（UTMパラメータ付きURL作成）',
    introHtml:
      '広告・メルマガ・SNS投稿のリンクに付ける utm_source・utm_medium・utm_campaign などを入力すると、計測用のURLを作成します。URLは1行に1つずつ並べて一括生成でき、既存のクエリやハッシュはそのまま残ります。URLの中身を確認・編集したいときは <a href="/tools/url-parser/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URLパーサー・クエリ編集</a> も使えます。',
    urlsLabel: 'リンク先URL',
    urlsHint:
      '複数ある場合は1行に1つずつ入力します。http または https のURLに対応します。',
    urlsPlaceholder: 'https://example.com/lp\nhttps://example.com/blog/post-1',
    presetHeading: '参照元・メディアのプリセット',
    campaignPresetHeading: 'キャンペーン名のプリセット',
    sourceLabel: 'utm_source（参照元）',
    mediumLabel: 'utm_medium（メディア）',
    campaignLabel: 'utm_campaign（キャンペーン名）',
    termLabel: 'utm_term（キーワード・任意）',
    contentLabel: 'utm_content（広告・リンクの識別・任意）',
    sourcePlaceholder: 'google, newsletter',
    mediumPlaceholder: 'cpc, email, social',
    campaignPlaceholder: 'spring_sale',
    termPlaceholder: 'running_shoes',
    contentPlaceholder: 'banner_a',
    lowercase: '値をすべて小文字にそろえる',
    missingNotice:
      '次の項目が未入力です。GA4 などでキャンペーンを集計するには通常これらが必要です: ',
    replacedNotice: '既存の同名パラメータを置き換えました: ',
    outputLabel: '生成したURL',
    summary: '{ok} 件を生成（エラー {ng} 件）',
    copy: 'コピー',
    copied: 'コピーしました（履歴に保存）',
    copyFailed: 'コピーに失敗しました',
    errorEmpty: 'リンク先URLを入力してください。',
    errorInvalid: 'URLとして解釈できません。',
    errorMissingScheme:
      '先頭に https:// などのプロトコルがありません。https:// を付けて入力してください。',
    errorUnsupportedScheme: 'http または https 以外のURLには対応していません。',
    errorNoParams:
      'UTMの値がすべて空です。少なくとも utm_source を入力してください。',
    lineLabel: '行',
    historyHeading: '履歴',
    historyEmpty: '履歴はまだありません。コピーしたURLがここに保存されます。',
    historyLoad: '読み込む',
    historyClear: '履歴を消去',
    historyUnavailable:
      'このブラウザでは履歴を保存できません（保存が無効になっています）。',
    howToHeading: '使い方',
    howToSteps: [
      '「リンク先URL」にURLを入力します。複数ある場合は1行に1つずつ並べます。',
      'プリセットを選ぶか、utm_source・utm_medium・utm_campaign などを入力します。',
      '「生成したURL」を確認し、「コピー」で取り出します。コピーしたURLは履歴に残ります。',
    ],
    notesHeading: '注意事項',
    notes: [
      '履歴はこのブラウザのlocalStorageにのみ保存され、サーバーには送信されません。共有PCでは履歴を消去してください。',
      'GA4 などではパラメータの値は大文字と小文字が区別されます。Google と google は別のものとして集計されるため、表記は統一してください。',
      '既存の同名 utm_* パラメータは新しい値で置き換えます。空欄にした項目は、元のURLの値をそのまま残します。',
      'utm_ を付けた内部リンクは、サイト内の遷移でセッションが切り替わり、正しい流入元が分からなくなることがあります。外部からの流入リンクにだけ使ってください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'UTMパラメータ',
        description:
          'URLの末尾に付けて、どの広告やメールからの訪問かを計測ツールに伝えるパラメータです。utm_source・utm_medium・utm_campaign・utm_term・utm_content の5種類があります。',
      },
      {
        term: 'source と medium',
        description:
          'source は流入元（google・newsletter など）、medium は手段の種類（cpc・email・social など）を表します。この2つの組み合わせでチャネルが分類されます。',
      },
      {
        term: 'フラグメント（ハッシュ）',
        description:
          'URLの「#」以降の部分です。UTMパラメータは、ハッシュの手前のクエリ部分に付ける必要があります。',
      },
    ],
  },
  en: {
    title: 'UTM Builder - Campaign URL Generator with Bulk Mode',
    description:
      'Build URLs with UTM parameters (source, medium, campaign, term, content). Presets, bulk URLs, existing query and hash kept. Runs in your browser.',
    h1: 'UTM Builder: Campaign URL Generator',
    introHtml:
      'Enter utm_source, utm_medium, utm_campaign and the rest to tag links for ads, newsletters and social posts. Paste one URL per line to tag many at once; existing query parameters and the hash are left intact. To inspect or edit a URL further, try the <a href="/en/tools/url-parser/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">URL Parser & Query Editor</a>.',
    urlsLabel: 'Destination URLs',
    urlsHint:
      'One URL per line if you have several. http and https URLs are supported.',
    urlsPlaceholder: 'https://example.com/lp\nhttps://example.com/blog/post-1',
    presetHeading: 'Source / medium presets',
    campaignPresetHeading: 'Campaign name presets',
    sourceLabel: 'utm_source (traffic source)',
    mediumLabel: 'utm_medium (marketing medium)',
    campaignLabel: 'utm_campaign (campaign name)',
    termLabel: 'utm_term (keyword, optional)',
    contentLabel: 'utm_content (ad or link variant, optional)',
    sourcePlaceholder: 'google, newsletter',
    mediumPlaceholder: 'cpc, email, social',
    campaignPlaceholder: 'spring_sale',
    termPlaceholder: 'running_shoes',
    contentPlaceholder: 'banner_a',
    lowercase: 'Lowercase all values',
    missingNotice:
      'These fields are empty. Campaign reports in GA4 and similar tools usually need them: ',
    replacedNotice: 'Replaced existing parameters with the same name: ',
    outputLabel: 'Tagged URLs',
    summary: '{ok} generated ({ng} with errors)',
    copy: 'Copy',
    copied: 'Copied (saved to history)',
    copyFailed: 'Copy failed',
    errorEmpty: 'Enter a destination URL.',
    errorInvalid: 'This is not a valid URL.',
    errorMissingScheme:
      'The URL has no scheme such as https://. Add it at the start.',
    errorUnsupportedScheme: 'Only http and https URLs are supported.',
    errorNoParams: 'All UTM values are empty. Fill in at least utm_source.',
    lineLabel: 'Line',
    historyHeading: 'History',
    historyEmpty: 'No history yet. Copied URLs are saved here.',
    historyLoad: 'Load',
    historyClear: 'Clear history',
    historyUnavailable:
      'This browser cannot save history (storage is disabled).',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter your links in "Destination URLs", one per line.',
      'Pick a preset or fill in utm_source, utm_medium, utm_campaign and the rest.',
      'Check the "Tagged URLs" and press "Copy". Copied URLs are kept in history.',
    ],
    notesHeading: 'Notes',
    notes: [
      'History is stored only in this browser (localStorage) and never sent to a server. Clear it on a shared computer.',
      'GA4 and similar tools treat parameter values as case-sensitive: Google and google are reported separately, so keep your naming consistent.',
      'An existing utm_* parameter with the same name is replaced by the new value. A field you leave empty keeps whatever the original URL had.',
      'Do not put UTM parameters on internal links. Clicking them can start a new session and overwrite the real traffic source. Use them for inbound links only.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'UTM parameters',
        description:
          'Query parameters added to a link to tell analytics which ad or email a visit came from. There are five: utm_source, utm_medium, utm_campaign, utm_term and utm_content.',
      },
      {
        term: 'Source and medium',
        description:
          'Source is where traffic comes from (google, newsletter). Medium is the kind of channel (cpc, email, social). Together they decide how a visit is grouped into a channel.',
      },
      {
        term: 'Fragment (hash)',
        description:
          'The part of a URL after "#". UTM parameters must go in the query, before the hash.',
      },
    ],
  },
};
