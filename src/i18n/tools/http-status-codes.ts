import type { Locale } from '../../data/tools';
import type {
  StatusCategory,
  StatusCodeNumber,
} from '../../lib/tools/http-status-codes';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface StatusCodeText {
  /** 日本語名（英語版では標準フレーズと同じ） */
  name: string;
  /** 意味 */
  meaning: string;
  /** 主な用途・原因 */
  cause: string;
  /** 対処・実装メモ */
  advice: string;
}

export interface HttpStatusCodesPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  categoryLabel: string;
  allLabel: string;
  categories: Record<StatusCategory, { label: string; summary: string }>;
  /** {shown} {total} を件数に置き換える */
  countTemplate: string;
  noResults: string;
  causeLabel: string;
  adviceLabel: string;
  specLabel: string;

  codes: Record<StatusCodeNumber, StatusCodeText>;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const httpStatusCodesContent: Record<
  Locale,
  HttpStatusCodesPageContent
> = {
  ja: {
    title: 'HTTPステータスコード一覧・検索（意味と原因・対処つき）',
    description:
      '404・301・500・429 など HTTPステータスコードの意味・主な原因・対処をコード番号や名称、キーワードで検索できる一覧表。RFC 9110 を中心に1xx〜5xx を分類別に確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'HTTPステータスコード一覧・検索',
    introHtml:
      'HTTPステータスコードを、コード番号・名称・キーワードで検索できます。各コードの意味、主な用途や発生原因、対処の目安をまとめ、1xx〜5xx の分類で絞り込めます。主な出典は RFC 9110 です。レスポンスヘッダーそのものを調べたいときは <a href="/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTPヘッダー解析</a> もご利用ください。',

    searchLabel: 'コード・名称・キーワードで検索',
    searchPlaceholder: '例: 404 / Not Found / 認証 / 4xx',
    searchHint:
      '空白区切りで複数の語を指定すると、すべてを含むコードだけが表示されます。「4xx」で分類を指定することもできます。',
    categoryLabel: '分類で絞り込み',
    allLabel: 'すべて',
    categories: {
      '1xx': { label: '1xx', summary: '情報' },
      '2xx': { label: '2xx', summary: '成功' },
      '3xx': { label: '3xx', summary: 'リダイレクト' },
      '4xx': { label: '4xx', summary: 'クライアントエラー' },
      '5xx': { label: '5xx', summary: 'サーバーエラー' },
    },
    countTemplate: '{shown} / {total} 件を表示中',
    noResults: '該当するステータスコードが見つかりません。',
    causeLabel: '主な用途・原因',
    adviceLabel: '対処・実装メモ',
    specLabel: '仕様',

    codes: {
      100: {
        name: '継続',
        meaning:
          '要求ヘッダーは受け付けたので、クライアントはリクエストボディの送信を続けてよい、という中間応答です。',
        cause:
          'Expect: 100-continue を付けた大きなリクエストの送信前に、サーバーが受け入れ可否を返す場合に使われます。',
        advice:
          '通常はHTTPクライアントが自動で処理します。アプリ側で意識する必要はほとんどありません。',
      },
      101: {
        name: 'プロトコル切替',
        meaning:
          'クライアントの Upgrade 要求に応じて、通信プロトコルを切り替えることを示します。',
        cause: 'WebSocket の接続確立（ハンドシェイク）で返されます。',
        advice:
          'WebSocket が繋がらないときは、リバースプロキシが Upgrade / Connection ヘッダーを転送しているか確認します。',
      },
      102: {
        name: '処理中',
        meaning:
          '処理は受け付けたが完了までに時間がかかっていることを示す中間応答です（WebDAV）。',
        cause:
          '時間のかかる WebDAV 操作でタイムアウトを避けるために使われます。',
        advice:
          '一般的なWeb APIではほぼ使われません。非同期処理には 202 を使います。',
      },
      103: {
        name: '早期ヒント',
        meaning:
          '最終応答の前に、Link ヘッダーなどでブラウザへ先読みすべきリソースを知らせる中間応答です。',
        cause:
          'サーバーが本体を生成している間に、CSS や JavaScript の事前読み込み（preload）を始めさせるために使われます。',
        advice:
          'CDN やサーバーが対応している場合に表示速度の改善に使えます。非対応のクライアントは無視します。',
      },
      200: {
        name: '成功',
        meaning: 'リクエストが成功し、応答に結果が含まれています。',
        cause:
          'GET では取得した内容、POST では処理結果を返すときなど、最も一般的な成功応答です。',
        advice:
          '本文がない場合は 204、新規作成は 201 を返すと意図が明確になります。エラーなのに 200 を返す設計は避けます。',
      },
      201: {
        name: '作成済み',
        meaning: 'リクエストが成功し、新しいリソースが作成されました。',
        cause: 'POST や PUT でリソースを新規作成したときに返します。',
        advice:
          '作成したリソースのURLを Location ヘッダーで返すのが一般的です。',
      },
      202: {
        name: '受理',
        meaning:
          'リクエストは受け付けたが、処理はまだ完了していません（非同期処理）。',
        cause:
          'メール送信や重いバッチなど、バックグラウンドで処理する場合に返します。',
        advice: '処理状況を確認できる URL やジョブ ID を本文で返すと親切です。',
      },
      203: {
        name: '非権威情報',
        meaning:
          '成功しましたが、内容は元のサーバーではなく中継のプロキシ等が変換・加工したものです。',
        cause: 'プロキシが応答内容を書き換えた場合に返されます。',
        advice: 'ほとんど見かけません。通常は 200 として扱って問題ありません。',
      },
      204: {
        name: '内容なし',
        meaning: '成功しましたが、返すべき本文はありません。',
        cause:
          'DELETE や、更新結果を返さない PUT / PATCH、CORS のプリフライト応答などで使われます。',
        advice:
          '本文は付けません。「画面を遷移せず、今のページに留まる」という意味でも使われます。',
      },
      205: {
        name: 'リセット',
        meaning:
          '成功しました。クライアントは入力フォームなどの表示を初期状態に戻すべきです。',
        cause: 'フォーム送信後に入力欄をクリアさせたい場合に理論上使います。',
        advice: '実際にはほとんど使われず、ブラウザの対応も限定的です。',
      },
      206: {
        name: '部分的内容',
        meaning: 'Range ヘッダーで要求された範囲の一部だけを返しています。',
        cause:
          '動画のシーク再生や、大きなファイルの分割・再開ダウンロードで返されます。',
        advice:
          'Content-Range ヘッダーで返した範囲を示します。Accept-Ranges: bytes で対応を知らせます。',
      },
      207: {
        name: 'マルチステータス',
        meaning:
          '複数のリソースへの操作結果が、本文（XML）の中で個別に示されます。',
        cause: 'WebDAV で複数のファイルをまとめて操作したときに返されます。',
        advice:
          '本文内の各リソースのステータスを個別に確認する必要があります。',
      },
      208: {
        name: '報告済み',
        meaning:
          '同じ応答内で既に列挙済みのリソースなので、重複して詳細を返しません（WebDAV）。',
        cause:
          'WebDAV のバインディング機能で、同じ内容の再列挙を避けるために使われます。',
        advice: '一般的なWeb開発では目にすることはありません。',
      },
      226: {
        name: 'IM 使用',
        meaning:
          'デルタエンコーディングにより、現在の内容との差分として応答しています。',
        cause: '差分配信（Delta encoding in HTTP）に対応した環境で使われます。',
        advice: '実運用ではほとんど使われません。',
      },
      300: {
        name: '複数の選択肢',
        meaning: '要求に対して複数の候補があり、どれかを選ぶ必要があります。',
        cause: '言語や形式の違う複数の表現が存在する場合の応答です。',
        advice:
          '実際にはほとんど使われません。自動で選べるなら Accept 系ヘッダーによるコンテンツネゴシエーションを使います。',
      },
      301: {
        name: '恒久的に移動',
        meaning:
          'リソースのURLが恒久的に変わりました。以後は新しいURL（Location）を使います。',
        cause:
          'サイト移転、http から https への転送、URLの正規化（www の有無・末尾スラッシュ）で使われます。',
        advice:
          '検索エンジンの評価が新URLへ引き継がれます。POST が GET に変わることがあるため、メソッドを保つなら 308 を使います。ブラウザがキャッシュするので、誤設定すると戻しにくくなります。',
      },
      302: {
        name: '見つかった（一時的な移動）',
        meaning: 'リソースは一時的に別のURLにあります。',
        cause:
          'ログイン後の遷移、メンテナンス画面への転送、A/Bテストなど一時的なリダイレクトで使われます。',
        advice:
          '元のURLを維持したいときに使います。メソッドを保ちたい場合は 307、POST 後に GET へ遷移させたい場合は 303 が明確です。',
      },
      303: {
        name: '他を参照せよ',
        meaning: '結果は別のURLにあるので、GET で取得してください。',
        cause:
          'フォーム送信（POST）後に結果画面へリダイレクトする PRG パターンで使われます。',
        advice:
          'リロードによる二重送信を防げます。リダイレクト先には必ず GET でアクセスされます。',
      },
      304: {
        name: '未更新',
        meaning:
          'リソースは前回の取得から変更されていないので、キャッシュを再利用できます。',
        cause:
          'クライアントが If-None-Match（ETag）や If-Modified-Since を付けて問い合わせた場合に返されます。',
        advice:
          '本文は含めません。ETag や Last-Modified を正しく返すと通信量を減らせます。更新が反映されないときはキャッシュを疑います。',
      },
      305: {
        name: 'プロキシを使用',
        meaning: '指定のプロキシ経由でアクセスするよう求めていました。',
        cause: '歴史的な仕様で、現在は非推奨です。',
        advice:
          'セキュリティ上の理由でブラウザは無視します。使用しないでください。',
      },
      307: {
        name: '一時的リダイレクト',
        meaning:
          'リソースは一時的に別のURLにあります。リクエストのメソッドと本文はそのまま保ちます。',
        cause:
          'HSTS による http から https への内部リダイレクトや、POST を保ったままの一時転送で使われます。',
        advice:
          '302 と違い、POST を POST のまま再送します。ブラウザの開発者ツールで「307 Internal Redirect」と見えるものは、HSTS によるブラウザ内の転送です。',
      },
      308: {
        name: '恒久的リダイレクト',
        meaning:
          'リソースのURLが恒久的に変わりました。メソッドと本文は保ったまま再送します。',
        cause: 'POST などを保ったまま恒久的に移転したい場合に使います。',
        advice:
          '301 のメソッドを保つ版です。API のエンドポイント移転で有用です。',
      },
      400: {
        name: '不正なリクエスト',
        meaning: 'リクエストの構文や内容が不正で、サーバーが処理できません。',
        cause:
          'JSON の構文エラー、必須パラメーターの欠落、不正なヘッダーや大きすぎるCookie、URLの不正な文字などで発生します。',
        advice:
          'リクエストボディとヘッダーを見直します。API では、どのフィールドが不正かをエラーメッセージに含めると親切です。',
      },
      401: {
        name: '認証が必要',
        meaning:
          '認証されていないか、認証情報が無効です。名称は Unauthorized ですが、実際には「未認証」を意味します。',
        cause:
          'トークンや Cookie がない・期限切れ・誤りの場合、またはBASIC認証が必要な場合に返されます。',
        advice:
          'WWW-Authenticate ヘッダーで認証方式を示します。認証済みだが権限がない場合は 403 を使います。',
      },
      402: {
        name: '支払いが必要',
        meaning: '支払いが必要であることを示すために予約されたコードです。',
        cause:
          '標準では用途が定義されていませんが、一部のAPIが課金・利用枠超過の表現に独自に使います。',
        advice:
          '使うAPIの仕様を確認します。標準的な意味に頼らない設計が安全です。',
      },
      403: {
        name: '禁止',
        meaning: 'リクエストは理解したが、認可されておらず実行を拒否します。',
        cause:
          '権限不足、IP制限、ディレクトリの閲覧禁止、WAF やボット対策による遮断などで発生します。',
        advice:
          '認証し直しても解決しません。権限・ファイルのパーミッション・WAF のログを確認します。存在を隠したい場合は 404 を返す設計もあります。',
      },
      404: {
        name: '見つからない',
        meaning: '指定されたリソースがサーバー上に見つかりません。',
        cause:
          'URLの誤り、ページの削除や移動、ファイル名の大文字小文字の違い、デプロイの漏れなどで発生します。',
        advice:
          'URLを確認し、移転した場合は 301 を設定します。恒久的に削除したなら 410 も選べます。ソフト404（200 で「見つかりません」画面を返す）は避けます。',
      },
      405: {
        name: 'メソッドは許可されない',
        meaning: 'そのURLでは、使用したHTTPメソッドは許可されていません。',
        cause:
          'GET 専用のエンドポイントに POST を送った、または静的ファイルへの POST などで発生します。',
        advice:
          'Allow ヘッダーに使えるメソッドを返します。CORS のプリフライト（OPTIONS）が通らない場合もこれになります。',
      },
      406: {
        name: '受理できない',
        meaning: 'Accept 系ヘッダーが示す形式や言語では応答を返せません。',
        cause:
          'Accept: application/xml のみを求めたのに JSON しか返せない場合などです。',
        advice:
          'Accept ヘッダーの指定を見直します。mod_security などが誤検知して返すこともあります。',
      },
      407: {
        name: 'プロキシ認証が必要',
        meaning: 'プロキシサーバーでの認証が必要です。',
        cause: '企業のプロキシ等が認証を要求している場合に返されます。',
        advice:
          'Proxy-Authorization ヘッダーで認証情報を送ります。401 のプロキシ版です。',
      },
      408: {
        name: 'リクエストタイムアウト',
        meaning: 'サーバーがリクエストの受信完了を待ちきれませんでした。',
        cause:
          '通信が遅い・途中で止まった、接続だけ開いて送信しない場合などに返されます。',
        advice:
          '回線状況の確認や再試行を行います。サーバーやロードバランサーのタイムアウト設定も確認します。',
      },
      409: {
        name: '競合',
        meaning:
          'リソースの現在の状態と競合しており、リクエストを完了できません。',
        cause:
          '同じ値の重複登録、同時更新による編集の衝突、バージョン不一致などで発生します。',
        advice:
          '最新の状態を取得し直してから再試行するよう、クライアントに促します。',
      },
      410: {
        name: '消滅',
        meaning: 'リソースは恒久的に削除されており、今後も戻りません。',
        cause: '意図的に削除したページやAPIの廃止を明示したい場合に返します。',
        advice:
          '404 より「意図した削除」を強く伝えられ、検索エンジンの登録解除が早まることがあります。',
      },
      411: {
        name: '長さが必要',
        meaning: 'Content-Length ヘッダーが必要です。',
        cause:
          '本文つきのリクエストに Content-Length がなく、サーバーが必須としている場合です。',
        advice: '本文のバイト数を Content-Length に指定して再送します。',
      },
      412: {
        name: '前提条件の失敗',
        meaning:
          'If-Match など、リクエストヘッダーの前提条件を満たしていません。',
        cause:
          'ETag を使った楽観的ロックで、他の更新によりリソースが変わっていた場合に返されます。',
        advice: '最新のリソースを取得し、ETag を更新して再試行します。',
      },
      413: {
        name: 'コンテンツが大きすぎる',
        meaning: 'リクエストの本文がサーバーの許容サイズを超えています。',
        cause:
          'ファイルアップロードが大きい場合に発生します。nginx の client_max_body_size やアプリ側の上限が原因のことが多いです。',
        advice:
          '設定の上限値を確認・引き上げるか、ファイルを小さくして再送します。',
      },
      414: {
        name: 'URIが長すぎる',
        meaning: 'リクエストURIがサーバーの処理できる長さを超えています。',
        cause:
          'GET のクエリ文字列に大量のデータを載せた場合や、リダイレクトのループで発生します。',
        advice:
          '大きなデータは POST で本文に載せます。リダイレクトのループも確認します。',
      },
      415: {
        name: 'サポートされないメディアタイプ',
        meaning: '本文の形式（Content-Type）をサーバーが受け付けません。',
        cause:
          'JSON を期待するAPIに form 形式で送る、Content-Type の指定漏れなどで発生します。',
        advice:
          'Content-Type: application/json など、APIが受け付ける形式を指定します。',
      },
      416: {
        name: '範囲が不正',
        meaning:
          'Range ヘッダーで指定された範囲が、リソースの大きさを外れています。',
        cause:
          '再開ダウンロードで、実際のファイルサイズより後ろを要求した場合などです。',
        advice:
          'Content-Range: bytes */全体サイズ で実際のサイズを確認し、範囲を修正します。',
      },
      417: {
        name: '期待に添えない',
        meaning: 'Expect ヘッダーの要求をサーバーが満たせません。',
        cause:
          'Expect: 100-continue に対応していないサーバーやプロキシで発生します。',
        advice: 'Expect ヘッダーを外して送信します。',
      },
      418: {
        name: '私はティーポットです',
        meaning:
          'ティーポットにコーヒーを淹れさせようとした、というジョークのコードです（RFC 2324）。',
        cause:
          'エイプリルフールのRFCに由来します。一部のサービスが独自に、ボットの拒否などで使います。',
        advice:
          '本番の標準的な用途はありません。見かけたらそのサービスの独自仕様を確認します。',
      },
      421: {
        name: '誤った宛先',
        meaning: 'リクエストが、応答を返せないサーバーに向けて送られています。',
        cause:
          'HTTP/2 で複数のホスト名が同じ接続を共有し、証明書やSNIの構成が合わない場合に起きます。',
        advice:
          '新しい接続でリクエストを再送します。証明書のSAN構成も確認します。',
      },
      422: {
        name: '処理できないコンテンツ',
        meaning: '構文は正しいものの、意味的に処理できない内容です。',
        cause:
          'JSON は正しいがバリデーションに失敗した場合（メール形式の誤りなど）に、多くの API が使います。',
        advice:
          '400 が構文エラー、422 が入力値の検証エラー、と使い分けるのが一般的です。',
      },
      423: {
        name: 'ロック中',
        meaning: 'アクセス先のリソースがロックされています（WebDAV）。',
        cause: '他のユーザーが編集中などでロックされている場合です。',
        advice:
          'ロックが解除されるまで待つか、ロックトークンを付けて送ります。',
      },
      424: {
        name: '依存関係の失敗',
        meaning:
          '前提となる別の操作が失敗したため、このリクエストも実行できません（WebDAV）。',
        cause: '複数操作の一括処理で、依存先の処理が失敗した場合です。',
        advice: '失敗した元の操作（本文内のステータス）を先に解決します。',
      },
      425: {
        name: '早すぎる',
        meaning:
          '再送される可能性のあるリクエストを、サーバーが処理したくないことを示します。',
        cause:
          'TLS 1.3 の 0-RTT（アーリーデータ）で届いたリクエストの再送攻撃を避けるために返されます。',
        advice:
          'クライアントはハンドシェイク完了後に再送します。通常は自動で処理されます。',
      },
      426: {
        name: 'アップグレードが必要',
        meaning:
          '現在のプロトコルでは処理できず、別のプロトコルへの切り替えが必要です。',
        cause:
          'TLS や新しいHTTPバージョンなど、特定のプロトコルを要求するサーバーが返します。',
        advice: 'Upgrade ヘッダーに示されたプロトコルで接続し直します。',
      },
      428: {
        name: '事前条件が必要',
        meaning: 'リクエストに条件付きヘッダー（If-Match など）が必須です。',
        cause:
          '更新の競合（ロストアップデート）を防ぐため、If-Match を必須とするAPIが返します。',
        advice: '取得時の ETag を If-Match に付けて送ります。',
      },
      429: {
        name: 'リクエストが多すぎる',
        meaning: '一定時間内のリクエスト数が、レート制限を超えました。',
        cause:
          'APIの呼び出し回数制限、スクレイピング、ログイン試行の連打などで発生します。',
        advice:
          'Retry-After ヘッダーの秒数だけ待って再試行します。指数バックオフを用いるのが定石です。',
      },
      431: {
        name: 'ヘッダーが大きすぎる',
        meaning: 'リクエストヘッダー全体、または個々のヘッダーが大きすぎます。',
        cause:
          'Cookie が肥大化した場合や、巨大な Authorization / Referer などで発生します。',
        advice:
          '不要な Cookie を削除する、またはサーバーのヘッダーサイズ上限を見直します。',
      },
      451: {
        name: '法的理由により利用不可',
        meaning:
          '法的な要求（検閲・裁判所命令など）により、リソースを提供できません。',
        cause:
          '政府や裁判所の命令、著作権関連、地域規制によって遮断された場合です。名称は小説『華氏451度』に由来します。',
        advice:
          'Link ヘッダーで遮断を行った主体を示す方法が仕様化されています。',
      },
      500: {
        name: 'サーバー内部エラー',
        meaning:
          'サーバー側で予期しないエラーが発生し、リクエストを処理できませんでした。',
        cause:
          'アプリケーションの例外、設定ミス（.htaccess など）、DB 接続エラー、未捕捉のバグなどで発生します。',
        advice:
          'サーバーのエラーログを確認します。詳細なエラーはクライアントに返さず、ログに残します。',
      },
      501: {
        name: '未実装',
        meaning:
          'サーバーが、リクエストのメソッドや機能をサポートしていません。',
        cause: '未知のHTTPメソッドや、未実装の機能を要求した場合です。',
        advice:
          'そのメソッドが使えるか確認します。メソッドは許可されるが拒否したいときは 405 です。',
      },
      502: {
        name: '不正なゲートウェイ',
        meaning:
          'ゲートウェイやプロキシが、上流のサーバーから不正な応答を受け取りました。',
        cause:
          'リバースプロキシ（nginx・CDN・ロードバランサー）の背後のアプリが落ちている、または不正な応答を返している場合です。',
        advice:
          'アプリサーバーの稼働・ポート・クラッシュログを確認します。デプロイ直後や再起動中にも発生します。',
      },
      503: {
        name: 'サービス利用不可',
        meaning:
          'サーバーが一時的に過負荷、またはメンテナンス中でリクエストを処理できません。',
        cause:
          'メンテナンス、アクセス集中、リソース不足、デプロイ中などで発生します。',
        advice:
          'Retry-After ヘッダーで復旧の目安を返します。メンテナンス中の表示にも適しています（SEOへの影響を抑えられます）。',
      },
      504: {
        name: 'ゲートウェイタイムアウト',
        meaning:
          'ゲートウェイやプロキシが、上流のサーバーからの応答を時間内に受け取れませんでした。',
        cause:
          '上流の処理が遅い（重いクエリなど）、ネットワーク障害、プロキシのタイムアウト設定が短い場合に発生します。',
        advice:
          '処理の高速化や非同期化（202 の利用）、プロキシのタイムアウト値を見直します。',
      },
      505: {
        name: 'HTTPバージョン非対応',
        meaning:
          'リクエストで使われたHTTPのバージョンを、サーバーがサポートしていません。',
        cause: '古い・新しすぎるプロトコルバージョンで接続した場合です。',
        advice: 'サーバーが対応するバージョンで接続します。',
      },
      506: {
        name: '変種もネゴシエーションする',
        meaning: 'コンテンツネゴシエーションの設定が循環参照になっています。',
        cause: '透過的コンテンツネゴシエーションの設定ミスで起こります。',
        advice: 'サーバー設定を見直します。現代ではまず見かけません。',
      },
      507: {
        name: '容量不足',
        meaning:
          'リクエストを完了するための保存容量がサーバーにありません（WebDAV）。',
        cause: 'ディスク容量やストレージのクォータが不足している場合です。',
        advice: '空き容量やクォータを確認します。',
      },
      508: {
        name: 'ループを検出',
        meaning:
          '処理中に無限ループを検出したため、リクエストを中止しました（WebDAV）。',
        cause: 'WebDAV で、リソースの参照が循環している場合です。',
        advice: '参照構造のループを解消します。',
      },
      510: {
        name: '拡張が必要',
        meaning:
          'リクエストの処理に、HTTP 拡張（Extension Framework）が必要です。',
        cause: '実験的な仕様で、実際にはほとんど使われません。',
        advice: '一般的なWeb開発では気にする必要はありません。',
      },
      511: {
        name: 'ネットワーク認証が必要',
        meaning: 'ネットワークへのアクセスに認証が必要です。',
        cause:
          'カフェやホテルの Wi-Fi など、キャプティブポータルが認証を要求している場合に返されます。',
        advice: 'ブラウザでログインページを開いて認証を完了します。',
      },
    },

    howToHeading: '使い方',
    howToSteps: [
      '検索欄にコード番号（404）、名称（Not Found）、キーワード（認証・リダイレクト）を入力します。',
      '「4xx」などの分類ボタンで、クライアントエラーやサーバーエラーなどに絞り込みます。',
      'カードで意味・主な原因・対処の目安を確認します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'コードの意味は主に RFC 9110（HTTP Semantics）に基づきます。WebDAV 等の拡張コードは RFC 4918 などを出典としています。',
      '原因と対処は一般的な目安です。実際の原因はサーバー構成・フレームワーク・CDN によって異なるため、サーバーのログも確認してください。',
      'サービス独自のコード（Cloudflare の 52x、nginx の 499 など）や、IANA 登録のうち使用頻度が低いものは掲載していません。',
      '306 は予約済みの未使用コードで、掲載していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'リダイレクト',
        description:
          '別のURLへ誘導する仕組みです。3xx のステータスコードと Location ヘッダーの組み合わせで実現します。恒久（301・308）と一時（302・303・307）があります。',
      },
      {
        term: 'ETag',
        description:
          'リソースの版を表す識別子です。If-None-Match と組み合わせて、変更がなければ 304 を返して通信量を節約できます。',
      },
      {
        term: 'Retry-After',
        description:
          '再試行までの待ち時間（秒または日時）を伝えるヘッダーです。429 や 503 とともに返されます。',
      },
      {
        term: 'リバースプロキシ',
        description:
          'クライアントとアプリサーバーの間に立ち、リクエストを中継するサーバーです。nginx・CDN・ロードバランサーなどが該当し、502 や 504 はここで発生します。',
      },
    ],
  },
  en: {
    title: 'HTTP Status Codes List & Search (Meaning, Causes, Fixes)',
    description:
      'Search HTTP status codes like 404, 301, 500, and 429 by number or keyword, with meanings, causes, and fixes based on RFC 9110. Runs in your browser.',
    h1: 'HTTP Status Codes List & Search',
    introHtml:
      'Look up any HTTP status code by number, name, or keyword. Each entry explains what the code means, what usually causes it, and what to do about it, and you can filter by class from 1xx to 5xx. The main reference is RFC 9110. To inspect the response headers themselves, try the <a href="/en/tools/http-header-analyzer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">HTTP Header Analyzer</a>.',

    searchLabel: 'Search by code, name, or keyword',
    searchPlaceholder: 'e.g. 404 / Not Found / auth / 4xx',
    searchHint:
      'Separate several words with spaces to show only codes that match all of them. You can also type "4xx" to pick a class.',
    categoryLabel: 'Filter by class',
    allLabel: 'All',
    categories: {
      '1xx': { label: '1xx', summary: 'Informational' },
      '2xx': { label: '2xx', summary: 'Success' },
      '3xx': { label: '3xx', summary: 'Redirection' },
      '4xx': { label: '4xx', summary: 'Client error' },
      '5xx': { label: '5xx', summary: 'Server error' },
    },
    countTemplate: 'Showing {shown} of {total}',
    noResults: 'No matching status codes.',
    causeLabel: 'Common uses and causes',
    adviceLabel: 'What to do',
    specLabel: 'Spec',

    codes: {
      100: {
        name: 'Continue',
        meaning:
          'An interim response: the request headers were accepted and the client may go on to send the body.',
        cause:
          'Returned before a large upload when the client sent Expect: 100-continue and the server is willing to accept it.',
        advice:
          'HTTP clients normally handle this for you. Application code rarely needs to care.',
      },
      101: {
        name: 'Switching Protocols',
        meaning:
          'The server is switching to the protocol requested in the Upgrade header.',
        cause: 'Sent when a WebSocket connection is established.',
        advice:
          'If a WebSocket will not connect, check that your reverse proxy forwards the Upgrade and Connection headers.',
      },
      102: {
        name: 'Processing',
        meaning:
          'An interim WebDAV response saying the request was received but is still being processed.',
        cause:
          'Used for slow WebDAV operations to keep the client from timing out.',
        advice:
          'Rarely seen in ordinary web APIs. Use 202 for asynchronous work instead.',
      },
      103: {
        name: 'Early Hints',
        meaning:
          'An interim response that lets the browser start preloading resources (via Link headers) before the final response is ready.',
        cause:
          'Sent while the server is still building the page, so CSS and JavaScript can begin loading early.',
        advice:
          'Useful for faster rendering when your CDN or server supports it. Clients that do not understand it ignore it.',
      },
      200: {
        name: 'OK',
        meaning: 'The request succeeded and the response carries the result.',
        cause:
          'The most common success: the content for a GET, or the outcome of a POST.',
        advice:
          'Use 204 when there is no body and 201 for newly created resources. Do not return 200 for errors.',
      },
      201: {
        name: 'Created',
        meaning: 'The request succeeded and a new resource was created.',
        cause: 'Returned after a POST or PUT that creates a resource.',
        advice: 'Return the new resource’s URL in the Location header.',
      },
      202: {
        name: 'Accepted',
        meaning:
          'The request was accepted, but processing is not finished yet (asynchronous work).',
        cause:
          'Used when the work runs in the background, such as sending email or running a long batch job.',
        advice:
          'Return a job ID or a status URL in the body so the client can check progress.',
      },
      203: {
        name: 'Non-Authoritative Information',
        meaning:
          'The request succeeded, but a transforming proxy modified the content from the origin’s 200 response.',
        cause: 'A proxy changed the response on the way through.',
        advice: 'Rarely seen. Treat it like a 200.',
      },
      204: {
        name: 'No Content',
        meaning: 'The request succeeded and there is no body to return.',
        cause:
          'Used for DELETE, for PUT or PATCH that return nothing, and for CORS preflight responses.',
        advice:
          'Send no body. It can also tell the client to stay on the current page.',
      },
      205: {
        name: 'Reset Content',
        meaning:
          'The request succeeded and the client should reset the view, such as clearing a form.',
        cause: 'In theory, used to clear a form after it is submitted.',
        advice:
          'Almost never used in practice, and browser support is limited.',
      },
      206: {
        name: 'Partial Content',
        meaning:
          'Only the part of the resource requested with a Range header is being returned.',
        cause:
          'Video seeking and resumable or chunked downloads of large files.',
        advice:
          'Use Content-Range to describe the range, and Accept-Ranges: bytes to advertise support.',
      },
      207: {
        name: 'Multi-Status',
        meaning:
          'Results for several resources are reported individually in an XML body.',
        cause: 'WebDAV operations that touch several files at once.',
        advice: 'Check the status of each resource inside the body separately.',
      },
      208: {
        name: 'Already Reported',
        meaning:
          'The members were already listed earlier in this response, so they are not repeated (WebDAV).',
        cause:
          'WebDAV bindings, to avoid enumerating the same collection twice.',
        advice: 'You will not meet this in typical web development.',
      },
      226: {
        name: 'IM Used',
        meaning:
          'The response is the result of one or more instance manipulations, such as a delta against the current version.',
        cause: 'Delta encoding in HTTP (RFC 3229).',
        advice: 'Practically unused in production.',
      },
      300: {
        name: 'Multiple Choices',
        meaning:
          'There are several possible representations and the client must choose one.',
        cause: 'A resource exists in multiple languages or formats.',
        advice:
          'Rarely used. Prefer content negotiation with the Accept headers when the server can choose.',
      },
      301: {
        name: 'Moved Permanently',
        meaning:
          'The resource has permanently moved. Use the new URL in Location from now on.',
        cause:
          'Site migrations, http to https redirects, and URL normalization such as www or trailing slashes.',
        advice:
          'Search engines transfer ranking to the new URL. Some clients change POST to GET, so use 308 to keep the method. Browsers cache it hard, so a wrong 301 is difficult to undo.',
      },
      302: {
        name: 'Found',
        meaning: 'The resource is temporarily at a different URL.',
        cause:
          'Post-login redirects, maintenance pages, A/B tests, and other temporary moves.',
        advice:
          'Use it when the original URL should stay. 307 keeps the method, and 303 clearly means "fetch with GET".',
      },
      303: {
        name: 'See Other',
        meaning:
          'The result is at another URL, which should be fetched with GET.',
        cause:
          'The Post/Redirect/Get pattern: redirecting to a result page after a form POST.',
        advice:
          'Prevents duplicate submissions when the page is reloaded. The redirect target is always requested with GET.',
      },
      304: {
        name: 'Not Modified',
        meaning:
          'The resource has not changed since the last fetch, so the cached copy can be reused.',
        cause:
          'The client sent a conditional request with If-None-Match (ETag) or If-Modified-Since.',
        advice:
          'Send no body. Return correct ETag or Last-Modified values to save bandwidth. If updates do not show up, suspect caching.',
      },
      305: {
        name: 'Use Proxy',
        meaning: 'The resource was meant to be accessed through a given proxy.',
        cause: 'A historical code that is now deprecated.',
        advice: 'Browsers ignore it for security reasons. Do not use it.',
      },
      307: {
        name: 'Temporary Redirect',
        meaning:
          'The resource is temporarily at another URL. The method and body are preserved.',
        cause:
          'HSTS-driven http to https redirects inside the browser, and temporary moves that must keep POST.',
        advice:
          'Unlike 302, a POST is resent as a POST. A "307 Internal Redirect" in dev tools is the browser applying HSTS locally.',
      },
      308: {
        name: 'Permanent Redirect',
        meaning:
          'The resource has permanently moved, and the method and body are preserved.',
        cause:
          'Permanent moves where POST and other methods must stay the same.',
        advice:
          'The method-preserving version of 301. Handy when moving API endpoints.',
      },
      400: {
        name: 'Bad Request',
        meaning:
          'The server cannot process the request because its syntax or content is invalid.',
        cause:
          'Malformed JSON, missing required parameters, invalid headers, oversized cookies, or illegal characters in the URL.',
        advice:
          'Re-check the body and headers. An API should say which field was invalid.',
      },
      401: {
        name: 'Unauthorized',
        meaning:
          'The request lacks valid authentication. Despite the name, it means "unauthenticated".',
        cause:
          'A missing, expired, or wrong token or cookie, or Basic auth is required.',
        advice:
          'Describe the scheme in WWW-Authenticate. If the user is signed in but lacks permission, use 403 instead.',
      },
      402: {
        name: 'Payment Required',
        meaning: 'Reserved for future use to signal that payment is required.',
        cause:
          'Not defined by the standard, but some APIs use it for billing or quota problems.',
        advice:
          'Check the API’s own documentation. Do not rely on a standard meaning.',
      },
      403: {
        name: 'Forbidden',
        meaning:
          'The server understood the request but refuses to authorize it.',
        cause:
          'Missing permissions, IP restrictions, a forbidden directory listing, or a block from a WAF or bot protection.',
        advice:
          'Signing in again will not help. Check permissions, file modes, and WAF logs. Some sites return 404 instead to hide that a resource exists.',
      },
      404: {
        name: 'Not Found',
        meaning: 'The server cannot find the requested resource.',
        cause:
          'A wrong URL, a deleted or moved page, a case mismatch in a file name, or a missed deployment.',
        advice:
          'Check the URL and add a 301 if the page moved. Use 410 for permanently removed content. Avoid soft 404s, which show a "not found" page with 200.',
      },
      405: {
        name: 'Method Not Allowed',
        meaning: 'The HTTP method used is not allowed for this URL.',
        cause:
          'Sending a POST to a GET-only endpoint, or a POST to a static file.',
        advice:
          'List the allowed methods in the Allow header. A CORS preflight (OPTIONS) that is not handled also produces this.',
      },
      406: {
        name: 'Not Acceptable',
        meaning:
          'The server cannot produce a response matching the Accept headers.',
        cause:
          'A client demands Accept: application/xml but the server can only return JSON.',
        advice:
          'Review the Accept headers. Security modules such as mod_security can also return this on false positives.',
      },
      407: {
        name: 'Proxy Authentication Required',
        meaning: 'The client must authenticate with the proxy first.',
        cause: 'A corporate or other proxy requires credentials.',
        advice:
          'Send credentials in Proxy-Authorization. It is the proxy equivalent of 401.',
      },
      408: {
        name: 'Request Timeout',
        meaning:
          'The server gave up waiting for the client to finish sending the request.',
        cause:
          'A slow or stalled connection, or a connection opened without sending anything.',
        advice:
          'Check the network and retry. Review timeout settings on the server and load balancer too.',
      },
      409: {
        name: 'Conflict',
        meaning:
          'The request conflicts with the current state of the resource.',
        cause:
          'Duplicate unique values, edit collisions from concurrent updates, or version mismatches.',
        advice: 'Have the client fetch the latest state and retry.',
      },
      410: {
        name: 'Gone',
        meaning: 'The resource has been deliberately and permanently removed.',
        cause: 'Pages or API endpoints that were intentionally retired.',
        advice:
          'Signals an intentional removal more strongly than 404, and can lead search engines to drop the URL sooner.',
      },
      411: {
        name: 'Length Required',
        meaning: 'The server requires a Content-Length header.',
        cause:
          'A request with a body was sent without Content-Length to a server that insists on it.',
        advice: 'Resend with Content-Length set to the body size in bytes.',
      },
      412: {
        name: 'Precondition Failed',
        meaning:
          'A condition in the request headers, such as If-Match, was not satisfied.',
        cause:
          'Optimistic locking with ETags where another update changed the resource first.',
        advice: 'Fetch the latest resource and its ETag, then retry.',
      },
      413: {
        name: 'Content Too Large',
        meaning:
          'The request body is larger than the server is willing to process.',
        cause:
          'Large file uploads. Often the nginx client_max_body_size or an application limit.',
        advice: 'Raise the limit or send a smaller file.',
      },
      414: {
        name: 'URI Too Long',
        meaning: 'The request URI is longer than the server will accept.',
        cause:
          'Too much data in a GET query string, or a redirect loop that keeps growing the URL.',
        advice: 'Send large data in a POST body. Check for redirect loops.',
      },
      415: {
        name: 'Unsupported Media Type',
        meaning:
          'The server does not accept the format of the request body (Content-Type).',
        cause:
          'Sending form data to a JSON-only API, or leaving out Content-Type.',
        advice: 'Set a Content-Type the API accepts, such as application/json.',
      },
      416: {
        name: 'Range Not Satisfiable',
        meaning:
          'The range in the Range header lies outside the size of the resource.',
        cause: 'A resumed download asking for bytes beyond the real file size.',
        advice:
          'Read the real size from Content-Range: bytes */size and correct the range.',
      },
      417: {
        name: 'Expectation Failed',
        meaning: 'The server cannot meet the requirement in the Expect header.',
        cause: 'A server or proxy that does not support Expect: 100-continue.',
        advice: 'Resend without the Expect header.',
      },
      418: {
        name: "I'm a teapot",
        meaning:
          'A joke code from an April Fools’ RFC: a teapot refusing to brew coffee (RFC 2324).',
        cause:
          'Used by some services as a custom response, for example to turn away bots.',
        advice:
          'It has no standard production use. If you see it, check that service’s documentation.',
      },
      421: {
        name: 'Misdirected Request',
        meaning:
          'The request was sent to a server that cannot produce a response for it.',
        cause:
          'HTTP/2 connection reuse across hostnames when certificates or SNI settings do not line up.',
        advice:
          'Retry on a new connection and check the certificate’s SAN entries.',
      },
      422: {
        name: 'Unprocessable Content',
        meaning:
          'The syntax is valid but the content cannot be processed semantically.',
        cause:
          'Valid JSON that fails validation, such as a badly formatted email. Many APIs use this for validation errors.',
        advice:
          'A common convention is 400 for syntax errors and 422 for validation errors.',
      },
      423: {
        name: 'Locked',
        meaning: 'The target resource is locked (WebDAV).',
        cause: 'Another user is editing it, or a lock is held.',
        advice: 'Wait until the lock is released, or send the lock token.',
      },
      424: {
        name: 'Failed Dependency',
        meaning:
          'The request failed because an earlier operation it depended on failed (WebDAV).',
        cause: 'A batch of operations where a prerequisite step failed.',
        advice:
          'Resolve the original failing operation (shown in the body) first.',
      },
      425: {
        name: 'Too Early',
        meaning:
          'The server is unwilling to process a request that might be replayed.',
        cause:
          'Requests sent as TLS 1.3 0-RTT early data, refused to avoid replay attacks.',
        advice:
          'The client retries after the handshake completes. This is normally automatic.',
      },
      426: {
        name: 'Upgrade Required',
        meaning:
          'The server refuses the current protocol and requires switching to another.',
        cause: 'A server that demands TLS or a newer protocol.',
        advice: 'Reconnect using a protocol listed in the Upgrade header.',
      },
      428: {
        name: 'Precondition Required',
        meaning: 'The request must be conditional (for example with If-Match).',
        cause: 'APIs that require If-Match to prevent lost updates.',
        advice: 'Send the ETag you received in If-Match.',
      },
      429: {
        name: 'Too Many Requests',
        meaning: 'Too many requests were sent in a given time (rate limiting).',
        cause: 'API quota limits, scraping, or repeated login attempts.',
        advice:
          'Wait for the number of seconds in Retry-After before retrying. Exponential backoff is the usual approach.',
      },
      431: {
        name: 'Request Header Fields Too Large',
        meaning:
          'The request headers, as a whole or one of them, are too large.',
        cause:
          'Cookies that grew too large, or very long Authorization or Referer headers.',
        advice:
          'Remove unneeded cookies or raise the server’s header size limit.',
      },
      451: {
        name: 'Unavailable For Legal Reasons',
        meaning:
          'The resource is withheld because of a legal demand such as censorship or a court order.',
        cause:
          'Government or court orders, copyright claims, and regional regulations. The number references the novel Fahrenheit 451.',
        advice:
          'The spec lets a Link header point to the party that imposed the block.',
      },
      500: {
        name: 'Internal Server Error',
        meaning:
          'An unexpected error occurred on the server while handling the request.',
        cause:
          'Application exceptions, configuration mistakes (such as .htaccess), database connection errors, and unhandled bugs.',
        advice:
          'Check the server error logs. Keep details out of the response and write them to the log.',
      },
      501: {
        name: 'Not Implemented',
        meaning:
          'The server does not support the method or functionality needed for the request.',
        cause: 'An unknown HTTP method or an unimplemented feature.',
        advice:
          'Check whether the method is supported. Use 405 when the method is known but not allowed.',
      },
      502: {
        name: 'Bad Gateway',
        meaning:
          'A gateway or proxy received an invalid response from the upstream server.',
        cause:
          'The app behind a reverse proxy (nginx, CDN, load balancer) is down or returning something invalid.',
        advice:
          'Check that the app server is running, its port, and crash logs. It also appears briefly during deploys and restarts.',
      },
      503: {
        name: 'Service Unavailable',
        meaning:
          'The server is temporarily overloaded or down for maintenance.',
        cause:
          'Maintenance, traffic spikes, resource exhaustion, or a deploy in progress.',
        advice:
          'Send Retry-After to hint at recovery. It is also the right code for a maintenance page, as it limits SEO impact.',
      },
      504: {
        name: 'Gateway Timeout',
        meaning:
          'A gateway or proxy did not get a timely response from the upstream server.',
        cause:
          'Slow upstream work such as heavy queries, network trouble, or a short proxy timeout.',
        advice:
          'Speed up or make the work asynchronous (return 202), or review the proxy timeout.',
      },
      505: {
        name: 'HTTP Version Not Supported',
        meaning:
          'The server does not support the HTTP version used in the request.',
        cause: 'Connecting with a protocol version that is too old or too new.',
        advice: 'Connect with a version the server supports.',
      },
      506: {
        name: 'Variant Also Negotiates',
        meaning: 'The content negotiation configuration is circular.',
        cause: 'A misconfigured transparent content negotiation setup.',
        advice: 'Review the server configuration. Hardly ever seen today.',
      },
      507: {
        name: 'Insufficient Storage',
        meaning:
          'The server cannot store what is needed to complete the request (WebDAV).',
        cause: 'Disk space or storage quota is exhausted.',
        advice: 'Check free space and quotas.',
      },
      508: {
        name: 'Loop Detected',
        meaning:
          'The server stopped processing because it detected an infinite loop (WebDAV).',
        cause: 'Circular references between WebDAV resources.',
        advice: 'Remove the circular reference.',
      },
      510: {
        name: 'Not Extended',
        meaning:
          'The request needs further extensions (HTTP Extension Framework) to be fulfilled.',
        cause: 'An experimental spec that is rarely used.',
        advice: 'Not a concern in typical web development.',
      },
      511: {
        name: 'Network Authentication Required',
        meaning: 'The client must authenticate to gain network access.',
        cause:
          'A captive portal, such as café or hotel Wi-Fi, intercepting the request.',
        advice: 'Open a browser and complete the portal’s login page.',
      },
    },

    howToHeading: 'How to use',
    howToSteps: [
      'Type a code (404), a name (Not Found), or a keyword (auth, redirect) in the search box.',
      'Use the class buttons such as 4xx to narrow down client or server errors.',
      'Read each card for the meaning, common causes, and what to do.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Meanings follow RFC 9110 (HTTP Semantics). Extension codes such as WebDAV’s come from RFC 4918 and similar documents.',
      'Causes and fixes are general guidance. The real cause depends on your server setup, framework, and CDN, so check your server logs too.',
      'Vendor-specific codes (such as Cloudflare’s 52x or nginx’s 499) and rarely used IANA entries are not listed.',
      '306 is a reserved, unused code and is not included.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Redirect',
        description:
          'Sending the client to another URL, using a 3xx status code with a Location header. Permanent (301, 308) and temporary (302, 303, 307) redirects differ in how clients and search engines treat them.',
      },
      {
        term: 'ETag',
        description:
          'An identifier for a version of a resource. With If-None-Match, the server can answer 304 when nothing changed and save bandwidth.',
      },
      {
        term: 'Retry-After',
        description:
          'A header telling the client how long to wait (seconds or a date) before retrying. Sent with 429 and 503.',
      },
      {
        term: 'Reverse proxy',
        description:
          'A server between clients and your app that forwards requests, such as nginx, a CDN, or a load balancer. 502 and 504 come from this layer.',
      },
    ],
  },
};
