import type { Locale } from '../../data/tools';
import type {
  AuthStatus,
  WarningCode,
} from '../../lib/tools/email-header-analyzer';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface EmailHeaderAnalyzerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  sampleButton: string;
  inputHint: string;
  analyzeButton: string;
  clearButton: string;
  emptyError: string;
  /** {count} を読み取れなかった行数に置き換える */
  invalidNotice: string;

  summaryHeading: string;
  summaryLabels: {
    subject: string;
    from: string;
    to: string;
    date: string;
    messageId: string;
    returnPath: string;
    replyTo: string;
    totalDelay: string;
  };
  none: string;

  warningsHeading: string;
  noWarnings: string;
  warnings: Record<WarningCode, string>;

  authHeading: string;
  authNone: string;
  authMethodLabel: string;
  authResultLabel: string;
  authDetailLabel: string;
  authStatusLabels: Record<AuthStatus, string>;

  hopsHeading: string;
  hopsNone: string;
  hopNumberLabel: string;
  hopFromLabel: string;
  hopByLabel: string;
  hopIpLabel: string;
  hopTimeLabel: string;
  hopDelayLabel: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const emailHeaderAnalyzerContent: Record<
  Locale,
  EmailHeaderAnalyzerPageContent
> = {
  ja: {
    title: 'メールヘッダー解析（Received経路・SPF/DKIM/DMARC判定）',
    description:
      'メールの生ヘッダーを貼り付けるだけで、Received の経路と各ホップの遅延、SPF・DKIM・DMARC の判定、From と Return-Path の不一致を確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'メールヘッダー解析（経路・遅延・認証結果）',
    introHtml:
      '迷惑メールの調査やメール遅延の原因特定に。メールソフトで表示した生のヘッダーを貼り付けると、Received の経路と各ホップの遅延時間、Authentication-Results の SPF・DKIM・DMARC 判定、From・Return-Path・Reply-To のドメイン不一致を一覧にします。折り返された行や、MIME エンコードされた件名・差出人名にも対応しています。貼り付けた内容はブラウザ内だけで処理され、サーバーに送信されることはありません。送信側のドメイン設定は <a href="/tools/dmarc-spf-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">SPF・DMARCレコード生成</a> で確認できます。',

    inputLabel: 'メールヘッダー',
    inputPlaceholder:
      'Received: from mx.example.com ...\nAuthentication-Results: ...\nFrom: ...\nSubject: ...',
    sampleText: [
      'Received: from mx.example.com (mx.example.com [203.0.113.5])',
      '        by mail.example.net with ESMTPS id abc123;',
      '        Tue, 20 Oct 2026 10:10:30 +0900 (JST)',
      'Received: from relay.sender.test (relay.sender.test [198.51.100.7])',
      '        by mx.example.com with SMTP id def456;',
      '        Tue, 20 Oct 2026 10:00:05 +0900',
      'Authentication-Results: mx.example.com;',
      '        spf=softfail (domain does not designate sender) smtp.mailfrom=bounce.sender.test;',
      '        dkim=pass header.d=sender.test;',
      '        dmarc=fail (p=REJECT) header.from=shop.test',
      'Return-Path: <bounce@bounce.sender.test>',
      'Reply-To: <support@other.test>',
      'From: "=?UTF-8?B?44K344On44OD44OXIOS6i+WLmeWxgA==?=" <info@shop.test>',
      'To: you@example.net',
      'Subject: =?UTF-8?B?44GU5rOo5paH44GE44Gf44Gg44GE44Gf5ZWG5ZOB44Gu44GU56K66KqN?=',
      'Date: Tue, 20 Oct 2026 10:00:00 +0900',
      'Message-ID: <20261020010000.1234@sender.test>',
    ].join('\n'),
    sampleButton: 'サンプルを入れる',
    inputHint:
      'ヘッダー部分だけを貼り付けてください（空行以降の本文は無視します）。複数の Received があっても構いません。',
    analyzeButton: '解析する',
    clearButton: 'クリア',
    emptyError: 'メールヘッダーを貼り付けてください',
    invalidNotice: 'ヘッダーとして読み取れなかった {count} 行を無視しました',

    summaryHeading: 'メッセージの概要',
    summaryLabels: {
      subject: '件名',
      from: 'From（差出人）',
      to: 'To（宛先）',
      date: 'Date（送信日時）',
      messageId: 'Message-ID',
      returnPath: 'Return-Path',
      replyTo: 'Reply-To',
      totalDelay: '配送にかかった時間',
    },
    none: '（なし）',

    warningsHeading: '注意点',
    noWarnings: '特に気になる点は見つかりませんでした。',
    warnings: {
      noAuthResults:
        'Authentication-Results や Received-SPF が見つかりません。受信側が認証結果を記録していないか、ヘッダーが一部しか貼られていない可能性があります。',
      spfFail: 'SPF が fail です。送信元IPがドメインの許可リストにありません。',
      spfSoftfail:
        'SPF が softfail です。送信元IPは許可されていませんが、拒否まではされていません。',
      dkimFail:
        'DKIM 署名の検証に失敗しています。署名後に本文やヘッダーが書き換えられたか、鍵が一致していません。',
      dmarcFail:
        'DMARC が fail です。From のドメインと SPF・DKIM の認証ドメインが一致していません。なりすましの可能性があります。',
      authNotPass: 'pass 以外の認証結果があります。',
      returnPathMismatch:
        'From と Return-Path のドメインが異なります。メーリングリストや配信代行でも起こりますが、なりすましでも見られるパターンです。',
      replyToMismatch:
        'From と Reply-To のドメインが異なります。返信が別のドメインへ送られます。',
      displayNameSpoof:
        '差出人名に実際のアドレスと異なるメールアドレスが書かれています。本物の送信者に見せかける手口として使われます。',
      noReceived: 'Received ヘッダーがありません。経路を追跡できません。',
      negativeDelay:
        'ホップの時刻が前のホップより過去になっています。サーバーの時計のずれ、または時刻の偽装が考えられます。',
      longDelay:
        'このホップに5分以上かかっています。遅延の原因はこの付近です。',
      noMessageId:
        'Message-ID がありません。正規のメールサーバーは通常付与します。',
      noDate: 'Date がありません。',
    },

    authHeading: '認証結果（SPF・DKIM・DMARC）',
    authNone: '認証結果は記録されていません。',
    authMethodLabel: '方式',
    authResultLabel: '結果',
    authDetailLabel: '詳細',
    authStatusLabels: { pass: '良好', warn: '注意', fail: '失敗' },

    hopsHeading: 'Received の経路（送信元に近い順）',
    hopsNone: 'Received ヘッダーが見つかりませんでした。',
    hopNumberLabel: '順',
    hopFromLabel: '送信元 (from)',
    hopByLabel: '受信側 (by)',
    hopIpLabel: 'IPアドレス',
    hopTimeLabel: '受信時刻',
    hopDelayLabel: '前のホップから',

    howToHeading: '使い方',
    howToSteps: [
      'メールソフトのメッセージソース表示（元のメッセージを表示など）から、メールの生ヘッダーをコピーします。',
      '「メールヘッダー」欄に貼り付け、「解析する」を押します。',
      '注意点・認証結果・Received の経路を上から順に確認します。遅延が大きいホップが原因箇所の目安です。',
    ],
    notesHeading: '注意事項',
    notes: [
      'Received ヘッダーは送信者が偽装できます。信頼できるのは、自分のメールサーバー（受信側）が付けた最も上の数段だけです。それより下の経路は参考程度にしてください。',
      '遅延時間は各サーバーが記録した時刻の差です。サーバーの時計がずれていると正確になりません。タイムゾーンは時刻表記の指定に従って換算しています。',
      'SPF・DKIM・DMARC の結果は、貼り付けたヘッダーに受信側が記録した内容をそのまま読み取ったものです。このツールが DNS に問い合わせて再検証することはありません。Authentication-Results は送信者が偽の行を紛れ込ませることもできるため、複数ある場合は最も上（自分のサーバーが付けたもの）だけを信頼してください。',
      '解析はすべてブラウザ内で行い、貼り付けた内容を保存・送信しません。ヘッダーには自分や相手のメールアドレスが含まれるため、第三者に共有する際は注意してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Received',
        description:
          'メールがサーバーを経由するたびに先頭へ追加される経路記録です。下にあるものほど送信元に近く、上にあるものほど受信側に近くなります。',
      },
      {
        term: 'SPF',
        description:
          '送信元IPアドレスが、そのドメインの許可リストに含まれているかを確かめる仕組みです。照合の対象は Return-Path（エンベロープ）のドメインです。',
      },
      {
        term: 'DKIM',
        description:
          '送信側サーバーが付けた電子署名を、DNS 上の公開鍵で検証する仕組みです。本文やヘッダーが途中で改ざんされていないことを確認できます。',
      },
      {
        term: 'DMARC',
        description:
          'From のドメインが SPF または DKIM の認証ドメインと一致しているかを判定し、失敗時の扱い（none・quarantine・reject）を送信ドメインが宣言する仕組みです。',
      },
      {
        term: 'Return-Path',
        description:
          'エラーメール（バウンス）の戻り先となる、送信時のアドレスです。画面に表示される From とは別に指定できます。',
      },
    ],
  },
  en: {
    title: 'Email Header Analyzer: Received Path, SPF, DKIM, DMARC',
    description:
      'Paste raw email headers to trace the Received path and per-hop delays, read SPF, DKIM and DMARC results, and spot From mismatches. Runs in your browser.',
    h1: 'Email Header Analyzer: Route, Delays & Authentication',
    introHtml:
      'Investigating a phishing email or a delayed message? Paste the raw headers and get the Received route with the delay at each hop, the SPF, DKIM and DMARC verdicts from Authentication-Results, and warnings when From, Return-Path and Reply-To point to different domains. Folded lines and MIME-encoded subjects or sender names are decoded too. Everything is processed in your browser, and what you paste is never sent to a server. To set up the sending side, see the <a href="/en/tools/dmarc-spf-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">SPF & DMARC Record Generator</a>.',

    inputLabel: 'Email headers',
    inputPlaceholder:
      'Received: from mx.example.com ...\nAuthentication-Results: ...\nFrom: ...\nSubject: ...',
    sampleText: [
      'Received: from mx.example.com (mx.example.com [203.0.113.5])',
      '        by mail.example.net with ESMTPS id abc123;',
      '        Tue, 20 Oct 2026 10:10:30 +0900 (JST)',
      'Received: from relay.sender.test (relay.sender.test [198.51.100.7])',
      '        by mx.example.com with SMTP id def456;',
      '        Tue, 20 Oct 2026 10:00:05 +0900',
      'Authentication-Results: mx.example.com;',
      '        spf=softfail (domain does not designate sender) smtp.mailfrom=bounce.sender.test;',
      '        dkim=pass header.d=sender.test;',
      '        dmarc=fail (p=REJECT) header.from=shop.test',
      'Return-Path: <bounce@bounce.sender.test>',
      'Reply-To: <support@other.test>',
      'From: "Shop Support" <info@shop.test>',
      'To: you@example.net',
      'Subject: =?UTF-8?Q?Please_confirm_your_order?=',
      'Date: Tue, 20 Oct 2026 10:00:00 +0900',
      'Message-ID: <20261020010000.1234@sender.test>',
    ].join('\n'),
    sampleButton: 'Insert sample',
    inputHint:
      'Paste only the header block; anything after the first blank line is ignored. Any number of Received lines is fine.',
    analyzeButton: 'Analyze',
    clearButton: 'Clear',
    emptyError: 'Paste the email headers first',
    invalidNotice: 'Ignored {count} line(s) that could not be read as headers',

    summaryHeading: 'Message overview',
    summaryLabels: {
      subject: 'Subject',
      from: 'From',
      to: 'To',
      date: 'Date',
      messageId: 'Message-ID',
      returnPath: 'Return-Path',
      replyTo: 'Reply-To',
      totalDelay: 'Total delivery time',
    },
    none: '(none)',

    warningsHeading: 'Warnings',
    noWarnings: 'Nothing suspicious was found.',
    warnings: {
      noAuthResults:
        'No Authentication-Results or Received-SPF header was found. The receiving server may not record results, or only part of the headers was pasted.',
      spfFail:
        'SPF failed: the sending IP is not on the domain’s allowed list.',
      spfSoftfail:
        'SPF softfail: the sending IP is not authorized, but the message was not rejected outright.',
      dkimFail:
        'DKIM verification failed. The message may have been altered after signing, or the key does not match.',
      dmarcFail:
        'DMARC failed: the From domain does not align with the SPF or DKIM domain. The sender may be spoofed.',
      authNotPass: 'An authentication result is something other than pass.',
      returnPathMismatch:
        'From and Return-Path are on different domains. Mailing lists and bulk senders do this legitimately, but so do spoofers.',
      replyToMismatch:
        'From and Reply-To are on different domains, so replies go to another domain.',
      displayNameSpoof:
        'The display name contains an email address that differs from the real one, a common trick to look like someone else.',
      noReceived: 'There is no Received header, so the route cannot be traced.',
      negativeDelay:
        'This hop is timestamped earlier than the previous one. A server clock may be off, or the timestamp was forged.',
      longDelay:
        'This hop took 5 minutes or more. The delay most likely happened here.',
      noMessageId:
        'There is no Message-ID. Legitimate mail servers normally add one.',
      noDate: 'There is no Date header.',
    },

    authHeading: 'Authentication results (SPF, DKIM, DMARC)',
    authNone: 'No authentication results were recorded.',
    authMethodLabel: 'Method',
    authResultLabel: 'Result',
    authDetailLabel: 'Details',
    authStatusLabels: { pass: 'Good', warn: 'Check', fail: 'Failed' },

    hopsHeading: 'Received route (closest to the sender first)',
    hopsNone: 'No Received headers were found.',
    hopNumberLabel: '#',
    hopFromLabel: 'From (sender)',
    hopByLabel: 'By (receiver)',
    hopIpLabel: 'IP address',
    hopTimeLabel: 'Received at',
    hopDelayLabel: 'Since previous hop',

    howToHeading: 'How to use',
    howToSteps: [
      'In your mail app, open the message source (Show original or View source) and copy the raw headers.',
      'Paste them into the "Email headers" box and click "Analyze".',
      'Read the warnings, authentication results, and route from the top. The hop with the biggest delay is where the slowdown happened.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Received headers can be forged by the sender. Only the top few, added by your own receiving server, can be trusted; treat the rest of the route as a hint.',
      'Delays are the differences between timestamps each server wrote. If a server clock is off, the numbers will be off too. Time zones are converted using the offset in each timestamp.',
      'SPF, DKIM and DMARC results are read as recorded by the receiving server in the pasted headers. This tool does not query DNS or re-verify anything. A sender can also inject fake Authentication-Results lines, so when there are several, trust only the topmost one added by your own server.',
      'Everything is processed in your browser and nothing is stored or sent. Headers contain email addresses, so be careful when sharing them with others.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Received',
        description:
          'A trace line added at the top of the message by every server it passes through. Lower lines are closer to the sender; higher lines are closer to the recipient.',
      },
      {
        term: 'SPF',
        description:
          'Checks whether the sending IP is on the domain’s allowed list. It is evaluated against the Return-Path (envelope) domain.',
      },
      {
        term: 'DKIM',
        description:
          'A digital signature added by the sending server and verified with a public key in DNS, showing the body and headers were not altered in transit.',
      },
      {
        term: 'DMARC',
        description:
          'Checks that the From domain aligns with the SPF or DKIM domain, and lets the domain owner declare what to do on failure (none, quarantine, reject).',
      },
      {
        term: 'Return-Path',
        description:
          'The envelope address that bounces are sent to. It can differ from the From address shown in the mail app.',
      },
    ],
  },
};
