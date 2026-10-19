import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SnowflakeIdDecoderPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  epochLabel: string;
  epochTwitter: string;
  epochDiscord: string;
  epochCustom: string;
  customEpochLabel: string;
  copyResult: string;
  copied: string;
  copyFailed: string;
  resultsLabel: string;
  emptyResult: string;
  truncatedMessage: string;
  timeLabels: {
    iso: string;
    jst: string;
    unixMs: string;
    unixSec: string;
    outOfRange: string;
    noTime: string;
  };
  kindLabels: Record<'snowflake' | 'objectid' | 'uuid' | 'ulid', string>;
  fieldLabels: Record<
    | 'timestampOffset'
    | 'datacenter'
    | 'worker'
    | 'discordWorker'
    | 'discordProcess'
    | 'sequence'
    | 'increment'
    | 'random'
    | 'counter'
    | 'version'
    | 'variant'
    | 'clockSeq'
    | 'node'
    | 'randomBits',
    string
  >;
  errors: Record<'unknown' | 'overflow' | 'invalidUlid', string>;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const snowflakeIdDecoderContent: Record<
  Locale,
  SnowflakeIdDecoderPageContent
> = {
  ja: {
    title: 'Snowflake ID・ObjectID・UUIDの生成時刻デコード',
    description:
      'Twitter/X・DiscordのSnowflake ID、MongoDBのObjectID、UUID v1/v6/v7、ULIDから生成時刻と内部の構成要素を読み取る無料ツールです。複数行の一括デコードに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Snowflake ID・ObjectID・UUID生成時刻デコード',
    introHtml:
      'IDを貼り付けると形式を自動判定し、生成時刻（UTC・JST・ISO 8601・UNIXミリ秒）とworker・sequenceなどの構成要素を表示します。IDを作りたい場合は <a href="/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID生成</a> や <a href="/tools/ulid-nanoid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ULID・NanoID生成</a>、時刻の変換は <a href="/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UNIXタイムスタンプ変換</a> をご利用ください。',
    inputLabel: 'ID（1行に1件）',
    inputPlaceholder:
      '1288834974657\n507f1f77bcf86cd799439011\n017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
    sampleText:
      '1445078208190291973\n507f1f77bcf86cd799439011\n017f22e2-79b0-7cc3-98c4-dc0c0c07398f\nc232ab00-9414-11ec-b3c8-9f6bdeced846\n01ARZ3NDEKTSV4RRFFQ69G5FAV',
    epochLabel: '数値IDのエポック',
    epochTwitter: 'Twitter / X（1288834974657）',
    epochDiscord: 'Discord（1420070400000）',
    epochCustom: 'カスタム',
    customEpochLabel: 'エポック（UNIXミリ秒）',
    copyResult: '結果をコピー（TSV）',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    resultsLabel: '結果',
    emptyResult: 'IDを入力すると、ここに結果が表示されます。',
    truncatedMessage: '1000行を超えた分は処理していません。',
    timeLabels: {
      iso: 'ISO 8601（UTC）',
      jst: 'JST（日本時間）',
      unixMs: 'UNIXミリ秒',
      unixSec: 'UNIX秒',
      outOfRange: '日時として表せない範囲の値です。',
      noTime: 'このバージョンのUUIDには生成時刻が含まれていません。',
    },
    kindLabels: {
      snowflake: 'Snowflake ID（数値）',
      objectid: 'MongoDB ObjectID',
      uuid: 'UUID',
      ulid: 'ULID',
    },
    fieldLabels: {
      timestampOffset: 'エポックからの経過ミリ秒',
      datacenter: 'データセンターID（5bit）',
      worker: 'ワーカーID（5bit）',
      discordWorker: 'ワーカーID（5bit）',
      discordProcess: 'プロセスID（5bit）',
      sequence: 'シーケンス（12bit）',
      increment: 'インクリメント（12bit）',
      random: 'ランダム部',
      counter: 'カウンタ',
      version: 'バージョン',
      variant: 'バリアント',
      clockSeq: 'クロックシーケンス',
      node: 'ノード',
      randomBits: 'ランダム部（16進）',
    },
    errors: {
      unknown: '形式を判別できません。',
      overflow: '64bitの範囲（0〜18446744073709551615）を超えています。',
      invalidUlid: 'ULIDとして正しくありません（先頭文字は0〜7です）。',
    },
    howToHeading: '使い方',
    howToSteps: [
      'IDを「ID（1行に1件）」の欄に貼り付けます。複数ある場合は1行に1件ずつ入力します。',
      '数値のIDは「数値IDのエポック」でTwitter / X・Discordのどちらかを選びます。別のサービスなら「カスタム」にしてエポックを指定します。',
      '形式の判定結果と生成時刻、構成要素が表示されます。「結果をコピー（TSV）」で一覧をまとめて取り出せます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '数値のIDは、サービスごとに異なるエポック（起点時刻）を足して時刻にします。選択を誤ると数年単位でずれるため、IDの出どころに合わせて選んでください。',
      'Snowflake形式は上位41bitが時刻、続く10bitがマシンID、下位12bitがシーケンスという共通の並びを前提にしています。この並びと違う独自形式のIDでは正しく読み取れません。',
      'ObjectIDの時刻は秒単位、UUID v1・v6は100ナノ秒単位の値をミリ秒に丸めて表示します。',
      'UUID v4・v5などランダムまたはハッシュ由来のIDには時刻が含まれません。ULIDやUUID v7、Snowflakeは作成時刻がそのまま読み取れるため、作成日時を隠したい用途には向きません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Snowflake ID',
        description:
          'Twitter（X）が考案した64bitの連番風ID。時刻・マシンID・シーケンスをビットで詰めており、数値の大小がほぼ生成順になります。DiscordやInstagramなども似た形式を使っています。',
      },
      {
        term: 'エポック',
        description:
          'IDの時刻部分が数え始める起点の時刻です。Twitterは2010-11-04、Discordは2015-01-01が起点です。',
      },
      {
        term: 'ObjectID',
        description:
          'MongoDBが使う12バイト（24桁の16進）のID。先頭4バイトが秒単位の時刻、続く5バイトがランダム値、末尾3バイトがカウンタです。',
      },
      {
        term: 'UUID v7',
        description:
          '先頭48bitにUNIXミリ秒の時刻を持つUUIDです。生成順に並べやすく、データベースの主キーに向いています。',
      },
    ],
  },
  en: {
    title: 'Snowflake ID, ObjectID & UUID Timestamp Decoder',
    description:
      'Decode the creation time of Twitter/X and Discord Snowflake IDs, MongoDB ObjectIDs, UUID v1/v6/v7 and ULIDs. Runs in your browser, nothing is uploaded.',
    h1: 'Snowflake ID, ObjectID & UUID Timestamp Decoder',
    introHtml:
      'Paste an ID and the format is detected automatically. You get the creation time (UTC, JST, ISO 8601, Unix ms) and its parts such as worker and sequence. To create IDs instead, use the <a href="/en/tools/uuid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UUID Generator</a> or the <a href="/en/tools/ulid-nanoid-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ULID &amp; NanoID Generator</a>; for plain time conversion, see the <a href="/en/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unix Timestamp Converter</a>.',
    inputLabel: 'IDs (one per line)',
    inputPlaceholder:
      '1288834974657\n507f1f77bcf86cd799439011\n017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
    sampleText:
      '1445078208190291973\n507f1f77bcf86cd799439011\n017f22e2-79b0-7cc3-98c4-dc0c0c07398f\nc232ab00-9414-11ec-b3c8-9f6bdeced846\n01ARZ3NDEKTSV4RRFFQ69G5FAV',
    epochLabel: 'Epoch for numeric IDs',
    epochTwitter: 'Twitter / X (1288834974657)',
    epochDiscord: 'Discord (1420070400000)',
    epochCustom: 'Custom',
    customEpochLabel: 'Epoch (Unix ms)',
    copyResult: 'Copy results (TSV)',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    resultsLabel: 'Results',
    emptyResult: 'Enter an ID and the decoded result will appear here.',
    truncatedMessage: 'Lines beyond the first 1000 were not processed.',
    timeLabels: {
      iso: 'ISO 8601 (UTC)',
      jst: 'JST (Japan time)',
      unixMs: 'Unix ms',
      unixSec: 'Unix seconds',
      outOfRange: 'The value is outside the range a date can represent.',
      noTime: 'This UUID version does not contain a timestamp.',
    },
    kindLabels: {
      snowflake: 'Snowflake ID (numeric)',
      objectid: 'MongoDB ObjectID',
      uuid: 'UUID',
      ulid: 'ULID',
    },
    fieldLabels: {
      timestampOffset: 'Milliseconds since epoch',
      datacenter: 'Datacenter ID (5 bits)',
      worker: 'Worker ID (5 bits)',
      discordWorker: 'Worker ID (5 bits)',
      discordProcess: 'Process ID (5 bits)',
      sequence: 'Sequence (12 bits)',
      increment: 'Increment (12 bits)',
      random: 'Random part',
      counter: 'Counter',
      version: 'Version',
      variant: 'Variant',
      clockSeq: 'Clock sequence',
      node: 'Node',
      randomBits: 'Random bits (hex)',
    },
    errors: {
      unknown: 'The format could not be recognized.',
      overflow: 'Exceeds the 64-bit range (0 to 18446744073709551615).',
      invalidUlid: 'Not a valid ULID (the first character must be 0-7).',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Paste your IDs into "IDs (one per line)", one per line.',
      'For numeric IDs, pick Twitter / X or Discord in "Epoch for numeric IDs". For another service, choose "Custom" and enter its epoch.',
      'The detected format, creation time and parts are shown. Use "Copy results (TSV)" to take the whole list.',
    ],
    notesHeading: 'Notes',
    notes: [
      'A numeric ID is turned into a time by adding a service-specific epoch (start time). Picking the wrong one shifts the result by years, so choose the one that matches where the ID came from.',
      'Snowflake decoding assumes the common layout: 41 bits of time, 10 bits of machine ID and 12 bits of sequence. IDs with a different custom layout cannot be read correctly.',
      'ObjectID time has one-second resolution. UUID v1 and v6 use 100-nanosecond ticks, which are shown rounded down to milliseconds.',
      'Random or hash-based UUIDs (v4, v5) contain no time. ULIDs, UUID v7 and Snowflake IDs expose their creation time, so they are a poor fit when that must stay private.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Snowflake ID',
        description:
          'A 64-bit, roughly sequential ID created at Twitter (X). Time, machine ID and sequence are packed into bits, so larger numbers are generally newer. Discord and Instagram use similar formats.',
      },
      {
        term: 'Epoch',
        description:
          'The start time the ID counts its timestamp from. Twitter uses 2010-11-04 and Discord uses 2015-01-01.',
      },
      {
        term: 'ObjectID',
        description:
          "MongoDB's 12-byte (24 hex digits) ID: a 4-byte timestamp in seconds, 5 random bytes and a 3-byte counter.",
      },
      {
        term: 'UUID v7',
        description:
          'A UUID whose first 48 bits are a Unix millisecond timestamp. It sorts by creation time and works well as a database primary key.',
      },
    ],
  },
};
