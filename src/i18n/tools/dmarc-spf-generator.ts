import type { Locale } from '../../data/tools';
import type {
  DmarcIssueCode,
  Severity,
  SpfIssueCode,
} from '../../lib/tools/dmarc-spf-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DmarcSpfGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  modeLabel: string;
  modeSpf: string;
  modeDmarc: string;
  domainLabel: string;
  domainPlaceholder: string;
  domainHint: string;

  // SPF 組み立て
  spfBuildHeading: string;
  spfIncludesLabel: string;
  spfIncludesPlaceholder: string;
  spfIp4Label: string;
  spfIp4Placeholder: string;
  spfIp6Label: string;
  spfIp6Placeholder: string;
  spfAllowA: string;
  spfAllowMx: string;
  spfRedirectLabel: string;
  spfRedirectHint: string;
  spfAllLabel: string;
  spfAllOptions: { value: string; label: string }[];

  // DMARC 組み立て
  dmarcBuildHeading: string;
  dmarcPolicyLabel: string;
  dmarcPolicyOptions: { value: string; label: string }[];
  dmarcSubPolicyLabel: string;
  dmarcSubPolicyOptions: { value: string; label: string }[];
  dmarcPctLabel: string;
  dmarcRuaLabel: string;
  dmarcRuaPlaceholder: string;
  dmarcRufLabel: string;
  dmarcRufPlaceholder: string;
  dmarcAddressHint: string;
  dmarcAdkimLabel: string;
  dmarcAspfLabel: string;
  dmarcAlignmentOptions: { value: string; label: string }[];
  dmarcFoLabel: string;
  dmarcFoOptions: { value: string; label: string }[];

  // 出力
  outputHeading: string;
  recordLabel: string;
  dnsHeading: string;
  dnsTypeLabel: string;
  dnsHostLabel: string;
  dnsValueLabel: string;
  dnsQuotedLabel: string;
  /** {length} {chunks} を置き換える */
  lengthTemplate: string;
  copyButton: string;
  copied: string;
  copyFailed: string;

  // チェック
  checkHeading: string;
  checkLabel: string;
  checkPlaceholder: string;
  checkSampleButton: string;
  sampleSpf: string;
  sampleDmarc: string;
  checkEmpty: string;
  checkOk: string;
  /** {count} {limit} を置き換える */
  lookupsTemplate: string;
  severityLabels: Record<Severity, string>;
  /** {value} を該当部分に置き換える */
  spfIssues: Record<SpfIssueCode, string>;
  dmarcIssues: Record<DmarcIssueCode, string>;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const dmarcSpfGeneratorContent: Record<
  Locale,
  DmarcSpfGeneratorPageContent
> = {
  ja: {
    title: 'SPF・DMARCレコード生成とチェック（TXT値を作成）',
    description:
      'SPF・DMARCのTXTレコードをフォームから作成し、既存レコードの構文・DNSルックアップ10回上限・+all・pct範囲などを確認できます。DNSには問い合わせず、データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'SPF・DMARCレコード生成・構文チェック',
    introHtml:
      'メール送信元の認証に使う SPF と DMARC の TXT レコードを、フォームの入力から組み立てます。すでに設定しているレコードを貼り付ければ、先頭の v=spf1、all の位置、DNSルックアップ10回の上限、pct の範囲、rua の mailto: 形式などもチェックします。DNSへの問い合わせは行わず、入力内容はブラウザ内だけで処理され、サーバーには送信されません。メール系の周辺ツールには <a href="/tools/mailto-link-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">mailtoリンク生成</a> もあります。',

    modeLabel: '作成するレコード',
    modeSpf: 'SPF',
    modeDmarc: 'DMARC',
    domainLabel: 'ドメイン',
    domainPlaceholder: 'example.com',
    domainHint:
      '入力すると、TXTレコードを登録するホスト名を表示します（未入力なら example.com の例を表示）。',

    spfBuildHeading: 'SPFレコードを作成',
    spfIncludesLabel: '送信を許可するサービス（include）',
    spfIncludesPlaceholder: '_spf.google.com\nspf.protection.outlook.com',
    spfIp4Label: '許可するIPv4アドレス（ip4）',
    spfIp4Placeholder: '192.0.2.10\n198.51.100.0/24',
    spfIp6Label: '許可するIPv6アドレス（ip6）',
    spfIp6Placeholder: '2001:db8::/32',
    spfAllowA: '自ドメインのAレコードのサーバーを許可（a）',
    spfAllowMx: '自ドメインのMXのサーバーを許可（mx）',
    spfRedirectLabel: '別ドメインのSPFに委譲（redirect）',
    spfRedirectHint:
      'redirect は all を使わないときだけ有効です。「末尾の指定」を「指定しない」にすると出力に含まれます。',
    spfAllLabel: '末尾の指定',
    spfAllOptions: [
      { value: '-all', label: '-all（それ以外は拒否）' },
      { value: '~all', label: '~all（それ以外は soft fail）' },
      { value: '?all', label: '?all（それ以外は判定しない）' },
      { value: '+all', label: '+all（全て許可・非推奨）' },
      { value: 'none', label: '指定しない' },
    ],

    dmarcBuildHeading: 'DMARCレコードを作成',
    dmarcPolicyLabel: 'ポリシー（p）',
    dmarcPolicyOptions: [
      { value: 'none', label: 'none（監視のみ）' },
      { value: 'quarantine', label: 'quarantine（隔離）' },
      { value: 'reject', label: 'reject（拒否）' },
    ],
    dmarcSubPolicyLabel: 'サブドメインのポリシー（sp）',
    dmarcSubPolicyOptions: [
      { value: '', label: '指定しない（p を継承）' },
      { value: 'none', label: 'none' },
      { value: 'quarantine', label: 'quarantine' },
      { value: 'reject', label: 'reject' },
    ],
    dmarcPctLabel: '適用割合（pct、0〜100）',
    dmarcRuaLabel: '集計レポートの送信先（rua）',
    dmarcRuaPlaceholder: 'dmarc@example.com',
    dmarcRufLabel: '失敗レポートの送信先（ruf）',
    dmarcRufPlaceholder: 'forensic@example.com',
    dmarcAddressHint:
      'メールアドレスをカンマか改行で区切ります。mailto: は自動で付きます。',
    dmarcAdkimLabel: 'DKIMのアライメント（adkim）',
    dmarcAspfLabel: 'SPFのアライメント（aspf）',
    dmarcAlignmentOptions: [
      { value: '', label: '指定しない（relaxed）' },
      { value: 'r', label: 'r（relaxed）' },
      { value: 's', label: 's（strict）' },
    ],
    dmarcFoLabel: '失敗レポートの条件（fo）',
    dmarcFoOptions: [
      { value: '', label: '指定しない（0）' },
      { value: '0', label: '0（SPFもDKIMも失敗）' },
      { value: '1', label: '1（どちらかが失敗）' },
      { value: 'd', label: 'd（DKIMが失敗）' },
      { value: 's', label: 's（SPFが失敗）' },
    ],

    outputHeading: '生成結果',
    recordLabel: 'TXTレコードの値',
    dnsHeading: 'DNSへの登録内容',
    dnsTypeLabel: 'タイプ',
    dnsHostLabel: 'ホスト名（名前）',
    dnsValueLabel: '値',
    dnsQuotedLabel: '255文字ごとに分割した表記（長いときに使用）',
    lengthTemplate: '{length} 文字 ／ TXT文字列 {chunks} 個',
    copyButton: 'レコード値をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    checkHeading: '既存レコードの構文チェック',
    checkLabel: '貼り付けたレコード',
    checkPlaceholder: 'v=spf1 include:_spf.google.com ~all',
    checkSampleButton: 'サンプルを入れる',
    sampleSpf:
      'v=spf1 include:_spf.google.com include:spf.protection.outlook.com ip4:192.0.2.10 ptr ?all',
    sampleDmarc:
      'v=DMARC1; p=quarantine; pct=50; rua=dmarc@example.com; adkim=x',
    checkEmpty:
      'SPF または DMARC のレコード値を貼り付けると、ここに結果が出ます。',
    checkOk: '問題は見つかりませんでした。',
    lookupsTemplate:
      'DNSルックアップ（このレコード内の概算）: {count} / {limit}',
    severityLabels: {
      error: 'エラー',
      warn: '注意',
      info: '参考',
    },
    spfIssues: {
      empty: 'レコードが空です。',
      noVersion:
        '先頭に v=spf1 がありません。SPF レコードとして認識されません。',
      versionNotFirst:
        'v=spf1 がレコードの先頭にありません。先頭に置いてください。',
      multipleAll:
        'all が複数あります。最初の all で判定が決まるため、ひとつにまとめてください。',
      allNotLast:
        'all より後ろのメカニズムは評価されません。all は末尾に置いてください。',
      plusAll:
        '+all（または修飾子なしの all）は全てのサーバーに送信を許可するため、SPF の意味がなくなります。-all か ~all にしてください。',
      neutralAll:
        '?all は「判定しない」の意味で、なりすましを防ぎません。-all か ~all を検討してください。',
      noAll:
        '末尾に all も redirect もありません。どれにも一致しない送信元の扱いが決まらないため、-all か ~all を付けてください。',
      redirectWithAll:
        'all がある場合、redirect は無視されます。どちらか一方にしてください。',
      multipleRedirect: 'redirect が複数あります。ひとつだけ指定できます。',
      ptr: 'ptr は非推奨で、DNS負荷も大きいため使わないでください（RFC 7208）。',
      tooManyLookups:
        'DNSルックアップが {value} 回あり、上限の10回を超えています。受信側で permerror になり SPF が無効になります。include を減らすか IP の直接指定に置き換えてください。',
      manyLookups:
        'DNSルックアップが {value} 回で上限の10回に近づいています。include 先の中でも数えられるため、実際は超えている可能性があります。',
      invalidIp4: 'IPv4 の指定が不正です: {value}',
      invalidIp6: 'IPv6 の指定が不正です: {value}',
      invalidDomain: 'ドメイン名として不正です: {value}',
      missingValue: 'ドメインの指定がありません: {value}',
      unknownMechanism: '解釈できない指定です: {value}',
      duplicateMechanism: '同じ指定が重複しています: {value}',
      needsSplit:
        'レコードが {value} 文字で、TXT の1文字列の上限（255文字）を超えています。DNS管理画面が自動で分割しない場合は、255文字以内で分割して登録してください。',
      tooLongTotal:
        'レコードが {value} 文字あります。DNS応答が約450バイトを超えるとTCPへの切り替えが必要になり、受信側で取得に失敗することがあります。include や IP の整理を検討してください。',
    },
    dmarcIssues: {
      empty: 'レコードが空です。',
      noVersion: 'v=DMARC1 がありません。DMARC レコードとして認識されません。',
      versionNotFirst:
        'v=DMARC1 がレコードの先頭にありません。先頭に置いてください。',
      noPolicy: '必須の p（ポリシー）がありません。',
      policyNotSecond:
        'p は v の直後に置くのが仕様です。順序を入れ替えてください。',
      invalidPolicy:
        'p の値が不正です: {value}（none / quarantine / reject のいずれか）',
      invalidSubPolicy:
        'sp の値が不正です: {value}（none / quarantine / reject のいずれか）',
      invalidPct: 'pct の値が不正です: {value}（0〜100の整数）',
      invalidAdkim: 'adkim の値が不正です: {value}（r か s）',
      invalidAspf: 'aspf の値が不正です: {value}（r か s）',
      invalidFo: 'fo の値が不正です: {value}（0 / 1 / d / s をコロン区切り）',
      invalidRi: 'ri は秒数の整数で指定します: {value}',
      invalidUri: 'mailto:メールアドレス の形式ではありません: {value}',
      invalidSyntax: 'タグ=値 の形式として読み取れませんでした: {value}',
      unknownTag: '未知のタグです（無視されます）: {value}',
      duplicateTag: 'タグが重複しています: {value}',
      policyNone:
        'p=none は監視のみで、なりすましメールは拒否されません。レポートを確認したら quarantine や reject へ段階的に強めてください。',
      pctPartial:
        'pct={value} のため、ポリシーは一部のメールにしか適用されません。移行期間の設定なら、最終的には100に戻してください。',
      subWeaker:
        'sp が p より緩く、サブドメインからのなりすましが通りやすくなります。',
      noRua:
        'rua がないため、集計レポートが届きません。まず none で運用状況を把握するには rua の設定が必要です。',
      needsSplit:
        'レコードが {value} 文字で、TXT の1文字列の上限（255文字）を超えています。DNS管理画面が自動で分割しない場合は、255文字以内で分割して登録してください。',
    },

    howToHeading: '使い方',
    howToSteps: [
      '「SPF」か「DMARC」を選び、「ドメイン」に自分のドメインを入力します。',
      'フォームの項目を設定すると、「TXTレコードの値」がその場で組み立てられます。',
      '「レコード値をコピー」で値をコピーし、表示された「ホスト名（名前）」にTXTレコードとして登録します。',
      '設定済みのレコードは「既存レコードの構文チェック」に貼り付けて確認します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'DNSへの問い合わせは行わないため、現在公開されているレコードの取得や、include 先の中身の展開はできません。ルックアップ回数は貼り付けたレコード内だけを数えた概算で、include 先でさらに使われる分は含みません。実際の上限判定には、各 include 先も含めて確認してください。',
      'SPF は1つのドメインにつき1レコードだけにします。複数の v=spf1 レコードがあると permerror になるため、既存のレコードがある場合は統合してください。',
      'DMARC を導入するときは、まず p=none と rua でレポートを集め、正規の送信元が SPF か DKIM で認証できていることを確認してから quarantine、reject へ強めるのが安全です。DKIM の署名設定は別途メール送信サービス側で行います。',
      '別ドメインのメールアドレスを rua に指定する場合、受信側のドメインで報告の受け入れを許可する DNS レコードが必要になることがあります。',
      'DNS管理画面によっては、ホスト名にドメイン部分を含めず _dmarc とだけ入力する仕様のものがあります。画面の説明に従ってください。反映には TTL に応じた時間がかかります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'SPF（Sender Policy Framework）',
        description:
          'どのサーバーがそのドメインの名前でメールを送ってよいかを、DNSのTXTレコードで宣言する仕組みです。受信側は送信元IPと照合します。',
      },
      {
        term: 'DMARC',
        description:
          'SPFとDKIMの結果がヘッダーFromのドメインと一致（アライメント）しているかを判定し、失敗したメールの扱い（none / quarantine / reject）と報告先を指示する仕組みです。',
      },
      {
        term: 'DKIM',
        description:
          'メールに電子署名を付け、送信ドメインの公開鍵（DNS）で検証する仕組みです。DMARC はSPFかDKIMのどちらかが通ってアライメントしていれば合格とします。',
      },
      {
        term: 'アライメント（adkim / aspf）',
        description:
          '認証に使ったドメインと、メールのFromドメインがどこまで一致していればよいかを決める設定です。relaxed は親ドメインが同じなら可、strict は完全一致が必要です。',
      },
      {
        term: 'permerror',
        description:
          'SPF レコードの構文ミスやルックアップ上限超過などで、受信側が判定を続けられなくなる恒久的なエラーです。多くの受信側で SPF が失敗扱いになります。',
      },
    ],
  },
  en: {
    title: 'SPF & DMARC Record Generator and Checker',
    description:
      'Build SPF and DMARC TXT records from a form and check existing ones for the 10-lookup limit, +all, pct range, and mailto: URIs. Runs in your browser.',
    h1: 'SPF & DMARC Record Generator and Syntax Checker',
    introHtml:
      'Build the SPF and DMARC TXT records used to authenticate your outgoing mail from a simple form. Paste a record you already publish to check v=spf1, the position of <code>all</code>, the 10 DNS lookup limit, the <code>pct</code> range, and <code>mailto:</code> report addresses. No DNS queries are made, and what you enter is processed in your browser and never sent to a server. For related email links, see the <a href="/en/tools/mailto-link-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">mailto Link Generator</a>.',

    modeLabel: 'Record type',
    modeSpf: 'SPF',
    modeDmarc: 'DMARC',
    domainLabel: 'Domain',
    domainPlaceholder: 'example.com',
    domainHint:
      'Shows the host name where the TXT record goes (an example.com sample is used while empty).',

    spfBuildHeading: 'Build an SPF record',
    spfIncludesLabel: 'Services allowed to send (include)',
    spfIncludesPlaceholder: '_spf.google.com\nspf.protection.outlook.com',
    spfIp4Label: 'Allowed IPv4 addresses (ip4)',
    spfIp4Placeholder: '192.0.2.10\n198.51.100.0/24',
    spfIp6Label: 'Allowed IPv6 addresses (ip6)',
    spfIp6Placeholder: '2001:db8::/32',
    spfAllowA: 'Allow the servers in this domain’s A records (a)',
    spfAllowMx: 'Allow this domain’s MX servers (mx)',
    spfRedirectLabel: 'Delegate to another domain’s SPF (redirect)',
    spfRedirectHint:
      'redirect only takes effect without all. Set "Final rule" to "None" to include it in the output.',
    spfAllLabel: 'Final rule',
    spfAllOptions: [
      { value: '-all', label: '-all (reject everything else)' },
      { value: '~all', label: '~all (soft fail everything else)' },
      { value: '?all', label: '?all (neutral for everything else)' },
      { value: '+all', label: '+all (allow everyone, not recommended)' },
      { value: 'none', label: 'None' },
    ],

    dmarcBuildHeading: 'Build a DMARC record',
    dmarcPolicyLabel: 'Policy (p)',
    dmarcPolicyOptions: [
      { value: 'none', label: 'none (monitor only)' },
      { value: 'quarantine', label: 'quarantine' },
      { value: 'reject', label: 'reject' },
    ],
    dmarcSubPolicyLabel: 'Subdomain policy (sp)',
    dmarcSubPolicyOptions: [
      { value: '', label: 'Not set (inherit p)' },
      { value: 'none', label: 'none' },
      { value: 'quarantine', label: 'quarantine' },
      { value: 'reject', label: 'reject' },
    ],
    dmarcPctLabel: 'Percentage applied (pct, 0-100)',
    dmarcRuaLabel: 'Aggregate report address (rua)',
    dmarcRuaPlaceholder: 'dmarc@example.com',
    dmarcRufLabel: 'Failure report address (ruf)',
    dmarcRufPlaceholder: 'forensic@example.com',
    dmarcAddressHint:
      'Separate email addresses with commas or new lines. mailto: is added for you.',
    dmarcAdkimLabel: 'DKIM alignment (adkim)',
    dmarcAspfLabel: 'SPF alignment (aspf)',
    dmarcAlignmentOptions: [
      { value: '', label: 'Not set (relaxed)' },
      { value: 'r', label: 'r (relaxed)' },
      { value: 's', label: 's (strict)' },
    ],
    dmarcFoLabel: 'Failure report options (fo)',
    dmarcFoOptions: [
      { value: '', label: 'Not set (0)' },
      { value: '0', label: '0 (both SPF and DKIM fail)' },
      { value: '1', label: '1 (either fails)' },
      { value: 'd', label: 'd (DKIM fails)' },
      { value: 's', label: 's (SPF fails)' },
    ],

    outputHeading: 'Result',
    recordLabel: 'TXT record value',
    dnsHeading: 'What to enter in your DNS',
    dnsTypeLabel: 'Type',
    dnsHostLabel: 'Host name (name)',
    dnsValueLabel: 'Value',
    dnsQuotedLabel: 'Split into 255-character strings (for long records)',
    lengthTemplate: '{length} characters / {chunks} TXT string(s)',
    copyButton: 'Copy record value',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    checkHeading: 'Check an existing record',
    checkLabel: 'Pasted record',
    checkPlaceholder: 'v=spf1 include:_spf.google.com ~all',
    checkSampleButton: 'Insert sample',
    sampleSpf:
      'v=spf1 include:_spf.google.com include:spf.protection.outlook.com ip4:192.0.2.10 ptr ?all',
    sampleDmarc:
      'v=DMARC1; p=quarantine; pct=50; rua=dmarc@example.com; adkim=x',
    checkEmpty:
      'Paste an SPF or DMARC record value and the results appear here.',
    checkOk: 'No problems found.',
    lookupsTemplate:
      'DNS lookups (estimate within this record): {count} / {limit}',
    severityLabels: {
      error: 'Error',
      warn: 'Warning',
      info: 'Info',
    },
    spfIssues: {
      empty: 'The record is empty.',
      noVersion:
        'It does not start with v=spf1, so it is not recognized as SPF.',
      versionNotFirst: 'v=spf1 must be the first term of the record.',
      multipleAll:
        'There is more than one all. The first one decides the result, so keep only one.',
      allNotLast: 'Terms after all are never evaluated. Put all at the end.',
      plusAll:
        '+all (or a bare all) authorizes every server to send, which defeats SPF. Use -all or ~all.',
      neutralAll:
        '?all means neutral and does not stop spoofing. Consider -all or ~all.',
      noAll:
        'There is no all or redirect at the end, so mail from other senders gets no verdict. Add -all or ~all.',
      redirectWithAll:
        'When all is present, redirect is ignored. Use only one of them.',
      multipleRedirect: 'There is more than one redirect. Only one is allowed.',
      ptr: 'ptr is deprecated and expensive to evaluate. Avoid it (RFC 7208).',
      tooManyLookups:
        'This record uses {value} DNS lookups, over the limit of 10. Receivers return permerror and SPF stops working. Remove includes or list IPs directly.',
      manyLookups:
        '{value} DNS lookups is close to the limit of 10. Lookups inside include targets also count, so the real total may already exceed it.',
      invalidIp4: 'Invalid IPv4 value: {value}',
      invalidIp6: 'Invalid IPv6 value: {value}',
      invalidDomain: 'Not a valid domain name: {value}',
      missingValue: 'A domain is required here: {value}',
      unknownMechanism: 'Unrecognized term: {value}',
      duplicateMechanism: 'Duplicate term: {value}',
      needsSplit:
        'The record is {value} characters, over the 255-character limit for one TXT string. If your DNS panel does not split it automatically, enter it as several strings of 255 characters or fewer.',
      tooLongTotal:
        'The record is {value} characters. DNS responses over about 450 bytes may need a TCP fallback and some receivers fail to fetch them. Consider trimming includes or IP lists.',
    },
    dmarcIssues: {
      empty: 'The record is empty.',
      noVersion: 'v=DMARC1 is missing, so it is not recognized as DMARC.',
      versionNotFirst: 'v=DMARC1 must be the first tag of the record.',
      noPolicy: 'The required p (policy) tag is missing.',
      policyNotSecond: 'The spec expects p right after v. Reorder the tags.',
      invalidPolicy:
        'Invalid p value: {value} (use none, quarantine, or reject).',
      invalidSubPolicy:
        'Invalid sp value: {value} (use none, quarantine, or reject).',
      invalidPct: 'Invalid pct value: {value} (an integer from 0 to 100).',
      invalidAdkim: 'Invalid adkim value: {value} (r or s).',
      invalidAspf: 'Invalid aspf value: {value} (r or s).',
      invalidFo: 'Invalid fo value: {value} (0, 1, d, s separated by colons).',
      invalidRi: 'ri must be an integer number of seconds: {value}',
      invalidUri: 'Not in mailto:address form: {value}',
      invalidSyntax: 'Could not read this as tag=value: {value}',
      unknownTag: 'Unknown tag (ignored by receivers): {value}',
      duplicateTag: 'Duplicate tag: {value}',
      policyNone:
        'p=none only monitors; spoofed mail is not rejected. After reviewing reports, tighten to quarantine and then reject.',
      pctPartial:
        'With pct={value}, the policy applies to only part of your mail. If this is a rollout step, return to 100 at the end.',
      subWeaker:
        'sp is weaker than p, which makes spoofing from subdomains easier.',
      noRua:
        'There is no rua, so you will not receive aggregate reports. You need it to learn who sends mail as your domain before tightening the policy.',
      needsSplit:
        'The record is {value} characters, over the 255-character limit for one TXT string. If your DNS panel does not split it automatically, enter it as several strings of 255 characters or fewer.',
    },

    howToHeading: 'How to use',
    howToSteps: [
      'Choose "SPF" or "DMARC" and enter your own domain in "Domain".',
      'Set the form fields and the "TXT record value" is built as you go.',
      'Press "Copy record value" and add it as a TXT record at the "Host name (name)" shown.',
      'Paste a record you already publish into "Check an existing record" to validate it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'This tool makes no DNS queries, so it cannot fetch what you currently publish or expand include targets. The lookup count only covers the pasted record; lookups made inside included records are not counted, so verify the real total including each include.',
      'Publish exactly one SPF record per domain. Several v=spf1 records cause a permerror, so merge them if you already have one.',
      'When rolling out DMARC, start with p=none and rua to collect reports, confirm your legitimate senders pass SPF or DKIM, and only then move to quarantine and reject. DKIM signing itself is configured in your mail service.',
      'If rua points to an address in a different domain, that domain may need a DNS record authorizing it to receive your reports.',
      'Some DNS panels expect only _dmarc as the host name, without the domain part. Follow your provider’s instructions. Changes take effect after the record’s TTL.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'SPF (Sender Policy Framework)',
        description:
          'A DNS TXT record that declares which servers may send mail for a domain. Receivers compare the sending IP against it.',
      },
      {
        term: 'DMARC',
        description:
          'A policy that checks whether SPF and DKIM results align with the visible From domain, tells receivers what to do with failures (none, quarantine, reject), and says where to send reports.',
      },
      {
        term: 'DKIM',
        description:
          'A digital signature added to each message and verified with a public key published in DNS. DMARC passes if either SPF or DKIM passes with alignment.',
      },
      {
        term: 'Alignment (adkim / aspf)',
        description:
          'How closely the authenticated domain must match the From domain. Relaxed accepts the same organizational domain; strict requires an exact match.',
      },
      {
        term: 'permerror',
        description:
          'A permanent SPF error caused by syntax mistakes or exceeding the lookup limit. Most receivers treat SPF as failed in this case.',
      },
    ],
  },
};
