export type Locale = 'ja' | 'en';

export interface ToolTranslation {
  name: string;
  description: string;
  category: string;
}

export interface Tool {
  slug: string;
  translations: Record<Locale, ToolTranslation>;
}

/** ロケールごとに文言を解決した、表示・検索用のツール情報 */
export interface LocalizedTool {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export const tools: Tool[] = [
  {
    slug: 'char-counter',
    translations: {
      ja: {
        name: '文字数カウント',
        description:
          '入力したテキストの文字数・単語数・行数をリアルタイムで数えます。',
        category: 'テキスト',
      },
      en: {
        name: 'Character Counter',
        description:
          'Counts the characters, words, and lines of your text in real time.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'zenkaku-hankaku',
    translations: {
      ja: {
        name: '全角/半角変換',
        description:
          '英数字・記号・カタカナ・スペースを対象に、全角と半角を相互に変換します。変換したい文字種を個別に選択可能。',
        category: 'テキスト',
      },
      en: {
        name: 'Full-width / Half-width Converter',
        description:
          'Converts between full-width and half-width for alphanumerics, symbols, katakana, and spaces, with each character type selectable individually.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'kana-converter',
    translations: {
      ja: {
        name: 'ひらがな/カタカナ変換',
        description:
          'ひらがなとカタカナを相互に変換します。濁音・半濁音・拗音・促音・踊り字にも対応。',
        category: 'テキスト',
      },
      en: {
        name: 'Hiragana / Katakana Converter',
        description:
          'Converts Japanese text between hiragana and katakana — handy for learners checking vocabulary, flashcards, and loanwords.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'json-formatter',
    translations: {
      ja: {
        name: 'JSON整形',
        description:
          'JSONデータを整形・圧縮し、構文エラーがあれば分かりやすく表示します。',
        category: '変換',
      },
      en: {
        name: 'JSON Formatter',
        description:
          'Formats and minifies JSON data, with clear syntax error messages.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'yaml-json-converter',
    translations: {
      ja: {
        name: 'YAML⇔JSON変換',
        description:
          'YAMLとJSONを相互に変換します。Docker ComposeやGitHub Actionsなどの設定ファイル確認に便利。',
        category: '変換',
      },
      en: {
        name: 'YAML to JSON Converter',
        description:
          'Converts between YAML and JSON, handy for checking Docker Compose or GitHub Actions config files.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'csv-json-converter',
    translations: {
      ja: {
        name: 'CSV⇔JSON変換',
        description:
          'CSVとJSONを相互に変換します。ヘッダー行をキーとして使用し、カンマ・タブ区切りや引用符付きフィールドにも対応。',
        category: '変換',
      },
      en: {
        name: 'CSV to JSON Converter',
        description:
          'Converts between CSV and JSON using the header row as keys, with support for comma/tab delimiters and quoted fields.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'toml-converter',
    translations: {
      ja: {
        name: 'TOML⇔JSON/YAML変換',
        description:
          'TOML・JSON・YAMLを相互に変換します。Cargo.tomlやpyproject.tomlなどのTOML設定ファイル確認に便利。',
        category: '変換',
      },
      en: {
        name: 'TOML to JSON/YAML Converter',
        description:
          'Converts between TOML, JSON, and YAML, handy for checking a TOML config file like Cargo.toml or pyproject.toml.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'markdown-preview',
    translations: {
      ja: {
        name: 'Markdown⇔HTML変換',
        description:
          'Markdownをリアルタイムプレビューしながら、HTMLと相互変換します。README や記事の下書き確認に便利。',
        category: '変換',
      },
      en: {
        name: 'Markdown to HTML Converter',
        description:
          'Converts Markdown to HTML with a live preview, and HTML back to Markdown. Handy for checking a README or article draft.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'unix-timestamp',
    translations: {
      ja: {
        name: 'Unixタイムスタンプ変換',
        description:
          'Unixタイムスタンプ（エポック秒・ミリ秒）と日時を相互に変換します。現在時刻の取得にも対応。',
        category: '変換',
      },
      en: {
        name: 'Unix Timestamp Converter',
        description:
          'Converts between a Unix timestamp (epoch seconds or milliseconds) and a date/time, and shows the current timestamp.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'color-converter',
    translations: {
      ja: {
        name: 'カラーコード変換',
        description:
          'HEX・RGB・HSLのカラーコードを相互に変換します。カラーピッカーで色を選ぶこともできます。',
        category: '変換',
      },
      en: {
        name: 'Color Converter',
        description:
          'Converts color codes between HEX, RGB, and HSL, with a color picker for choosing colors visually.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'base64',
    translations: {
      ja: {
        name: 'Base64エンコード/デコード',
        description:
          'テキストとBase64文字列を相互に変換します。日本語などのマルチバイト文字にも対応。',
        category: 'エンコード/デコード',
      },
      en: {
        name: 'Base64 Encoder/Decoder',
        description:
          'Converts text to and from Base64, with full support for multibyte characters.',
        category: 'Encode/Decode',
      },
    },
  },
  {
    slug: 'url-encode',
    translations: {
      ja: {
        name: 'URLエンコード/デコード',
        description:
          'テキストとパーセントエンコード形式を相互に変換します。クエリパラメータの日本語などマルチバイト文字にも対応。',
        category: 'エンコード/デコード',
      },
      en: {
        name: 'URL Encoder/Decoder',
        description:
          'Converts text to and from percent-encoding, with full support for multibyte characters in query parameters.',
        category: 'Encode/Decode',
      },
    },
  },
  {
    slug: 'kishu-izon-checker',
    translations: {
      ja: {
        name: '機種依存文字チェッカー',
        description:
          '①②③などの丸数字やⅠⅡⅢのローマ数字、㈱㍉㍻といった機種依存文字（環境依存文字）を検出し、安全な表記への置き換え案も表示します。',
        category: 'テキスト',
      },
      en: {
        name: 'Machine-Dependent Character Checker',
        description:
          'Detects machine-dependent characters such as circled numbers, Roman numerals, and ligatures like ㈱ ㍉ ㍻, with a safe replacement suggestion for each.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'html-escape',
    translations: {
      ja: {
        name: 'HTML/JS文字列エスケープ・アンエスケープ',
        description:
          'HTMLの特殊文字（& < > " \'）やJavaScript文字列内の改行・クォートなどを相互に変換します。XSS対策やコード生成時の文字列組み立てに便利。',
        category: 'エンコード/デコード',
      },
      en: {
        name: 'HTML/JS String Escape & Unescape',
        description:
          'Escapes and unescapes HTML special characters (& < > " \') and JavaScript string escape sequences such as newlines and quotes.',
        category: 'Encode/Decode',
      },
    },
  },
  {
    slug: 'uuid-generator',
    translations: {
      ja: {
        name: 'UUID生成',
        description:
          'ランダムなUUID（v4）を1件〜100件まとめて生成します。ハイフンなし・大文字表記にも対応。',
        category: '生成',
      },
      en: {
        name: 'UUID Generator',
        description:
          'Generates 1 to 100 random UUIDs (v4) at once, with optional hyphen removal and uppercase formatting.',
        category: 'Generate',
      },
    },
  },
  {
    slug: 'password-generator',
    translations: {
      ja: {
        name: 'パスワード生成',
        description:
          '文字種（大文字・小文字・数字・記号）と桁数を指定して、安全なランダムパスワードを生成します。強度の目安も表示。',
        category: '生成',
      },
      en: {
        name: 'Password Generator',
        description:
          'Generates strong random passwords by choosing character types (uppercase, lowercase, numbers, symbols) and length, with a strength estimate.',
        category: 'Generate',
      },
    },
  },
  {
    slug: 'hash-generator',
    translations: {
      ja: {
        name: 'ハッシュ生成',
        description:
          'テキストからMD5・SHA-1・SHA-256のハッシュ値をリアルタイムで計算します。',
        category: '生成',
      },
      en: {
        name: 'Hash Generator',
        description:
          'Computes MD5, SHA-1, and SHA-256 hashes from text in real time.',
        category: 'Generate',
      },
    },
  },
  {
    slug: 'regex-tester',
    translations: {
      ja: {
        name: '正規表現テスター',
        description:
          '正規表現のパターンとテスト文字列を入力すると、マッチ箇所のハイライト表示・キャプチャグループの一覧・置換結果のプレビューができます。',
        category: '開発',
      },
      en: {
        name: 'Regex Tester',
        description:
          'Tests a regular expression against sample text with match highlighting, a capture group list, and a live replacement preview.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'text-diff',
    translations: {
      ja: {
        name: 'テキスト差分比較（diff）',
        description:
          '2つのテキストを行単位で比較し、追加・削除された箇所をハイライト表示します。空白や大文字小文字の違いを無視する比較にも対応。',
        category: '開発',
      },
      en: {
        name: 'Text Diff Checker',
        description:
          'Compares two texts line by line and highlights added and removed lines, with options to ignore whitespace or case differences.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'jwt-decoder',
    translations: {
      ja: {
        name: 'JWTデコーダー',
        description:
          'JWT（JSON Web Token）のヘッダーとペイロードをデコードして整形表示します。exp/iat等の日時クレームも人が読める形式に変換。署名の検証は行いません。',
        category: '開発',
      },
      en: {
        name: 'JWT Decoder',
        description:
          'Decodes a JWT (JSON Web Token) and displays its header and payload as formatted JSON, with time-based claims like exp/iat shown as human-readable dates. The signature is not verified.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'lorem-ipsum',
    translations: {
      ja: {
        name: 'ダミーテキスト生成',
        description:
          'Lorem ipsum（欧文）または日本語のダミーテキストを、段落・文・単語単位で指定した個数だけ生成します。',
        category: '生成',
      },
      en: {
        name: 'Dummy Text Generator',
        description:
          'Generates Lorem ipsum (Latin) or Japanese placeholder text by paragraphs, sentences, or words, in any count you choose.',
        category: 'Generate',
      },
    },
  },
  {
    slug: 'text-list-tools',
    translations: {
      ja: {
        name: '文字列の重複削除・ソート・シャッフル',
        description:
          '改行区切りのテキストの重複行削除・昇順/降順/数値ソート・ランダムシャッフルをまとめて行います。空行削除や前後の空白削除にも対応。',
        category: 'テキスト',
      },
      en: {
        name: 'Text List Deduplicate, Sort & Shuffle',
        description:
          'Deduplicates, sorts (alphabetical, reverse, or numeric), or randomly shuffles newline-separated text, with options to remove empty lines and trim whitespace.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'line-ending-converter',
    translations: {
      ja: {
        name: '改行コード変換',
        description:
          'テキストの改行コード（LF/CRLF/CR）を判定し、指定した種類に統一変換します。',
        category: 'テキスト',
      },
      en: {
        name: 'Line Ending Converter',
        description:
          'Detects the line endings (LF, CRLF, or CR) in your text and converts them all to the type you choose.',
        category: 'Text',
      },
    },
  },
  {
    slug: 'qr-generator',
    translations: {
      ja: {
        name: 'QRコード生成',
        description:
          'URLやテキストからQRコードを生成し、PNG画像としてダウンロードできます。誤り訂正レベルも選択可能。',
        category: '生成',
      },
      en: {
        name: 'QR Code Generator',
        description:
          'Generates a QR code from a URL or text and downloads it as a PNG, with a selectable error correction level.',
        category: 'Generate',
      },
    },
  },
  {
    slug: 'cron-parser',
    translations: {
      ja: {
        name: 'Cron式スケジュールシミュレーター',
        description:
          'cron式の意味を日本語で解説し、次回の実行予定日時を一覧表示します。crontabやGitHub Actionsの動作確認に便利。',
        category: '開発',
      },
      en: {
        name: 'Cron Expression Simulator',
        description:
          'Explains a cron expression in plain English and lists its upcoming run times. Handy for checking crontab or GitHub Actions schedules.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'japanese-era-converter',
    translations: {
      ja: {
        name: '和暦⇔西暦変換',
        description:
          '明治・大正・昭和・平成・令和の和暦と西暦を相互に変換します。改元日をまたぐ日付にも対応した元号早見表付き。',
        category: '変換',
      },
      en: {
        name: 'Japanese Era Converter',
        description:
          'Converts between the Japanese era calendar (Meiji, Taisho, Showa, Heisei, Reiwa) and the Western year, with an era reference table covering transition dates.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'date-calculator',
    translations: {
      ja: {
        name: '日数計算機',
        description:
          '二つの日付の差（日数）や、指定した日から○日後・○日前の日付を計算します。初日を含めて数えるかどうかも選択可能。',
        category: '計算',
      },
      en: {
        name: 'Date Calculator',
        description:
          'Calculates the difference in days between two dates, or the date a set number of days before or after a given date, with an option to count both endpoints.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'age-calculator',
    translations: {
      ja: {
        name: '年齢計算機',
        description:
          '生年月日から満年齢・数え年・生まれてから経過した日数・次の誕生日までの日数を計算します。基準日を指定して未来・過去時点の年齢も確認可能。',
        category: '計算',
      },
      en: {
        name: 'Age Calculator',
        description:
          'Calculates the exact age, traditional East Asian age, days lived, and days until the next birthday from a date of birth, with a customizable reference date.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'hourly-wage-calculator',
    translations: {
      ja: {
        name: '時給・日給・月給換算＆残業代計算機',
        description:
          '時給・日給・月給・年収を相互換算し、時間外労働・法定休日労働・深夜労働の割増賃金（残業代）もまとめてシミュレーションできます。',
        category: '計算',
      },
      en: {
        name: 'Hourly Wage Converter & Overtime Pay Calculator',
        description:
          'Converts between hourly, daily, monthly, and annual wages, and simulates overtime, holiday, and late-night premium pay.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'tax-calculator',
    translations: {
      ja: {
        name: '消費税・割引計算機',
        description:
          '税込/税抜金額を相互に変換し、割引率や割引額からセール後の価格も計算します。標準税率10%・軽減税率8%・カスタム税率に対応。',
        category: '計算',
      },
      en: {
        name: 'Consumption Tax & Discount Calculator',
        description:
          'Converts between tax-included and tax-excluded prices, and calculates the discounted price from a discount rate or amount.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'ratio-calculator',
    translations: {
      ja: {
        name: '割合・比率計算機',
        description:
          '比を最も簡単な整数比に約分し、比例式（A:B=C:D）の空欄の値や、部分・全体・割合(%)・増減率を相互に計算します。',
        category: '計算',
      },
      en: {
        name: 'Ratio & Percentage Calculator',
        description:
          'Reduces a ratio to its simplest whole-number form, solves for a missing term in a proportion, and converts between a part, a whole, a percentage, and a rate of change.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'bmi-calculator',
    translations: {
      ja: {
        name: 'BMI計算機',
        description:
          '身長・体重からBMI（体格指数）を計算し、日本肥満学会の基準に基づく肥満度判定と普通体重の範囲を表示します。',
        category: '計算',
      },
      en: {
        name: 'BMI Calculator',
        description:
          'Calculates your Body Mass Index from height and weight, shows the WHO weight category, and gives the healthy weight range for your height.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'freelance-income-calculator',
    translations: {
      ja: {
        name: 'フリーランス手取り計算機',
        description:
          '年間の売上・必要経費・青色申告特別控除・社会保険料から、所得税・復興特別所得税・住民税と手取り額を簡易試算します。',
        category: '計算',
      },
      en: {
        name: 'Freelancer Take-Home Pay Calculator',
        description:
          "Estimates a Japanese freelancer's income tax, reconstruction surtax, and resident tax from annual revenue, expenses, and deductions, with a rough take-home pay figure.",
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'mortgage-calculator',
    translations: {
      ja: {
        name: '住宅ローン繰り上げ返済比較シミュレーション',
        description:
          '借入残高・金利・残りの返済期間と繰り上げ返済額から、「期間短縮型」「返済額軽減型」それぞれの利息軽減額・返済期間短縮・返済額軽減効果を比較します。',
        category: '計算',
      },
      en: {
        name: 'Mortgage Prepayment Comparison Calculator',
        description:
          'Compares the interest saved, term shortened, or monthly payment reduced by a lump-sum mortgage prepayment, for both the "shorten term" and "reduce payment" strategies.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'investment-simulator',
    translations: {
      ja: {
        name: '資産運用シミュレーション',
        description:
          '初期投資額・毎月の積立額・想定利回り・積立期間のうち3つから残る1つを複利計算で試算します。積立元本と運用益の内訳をグラフと年別の表で確認でき、取り崩し可能額（毎月）もあわせて試算できます。',
        category: '計算',
      },
      en: {
        name: 'Investment Growth Simulator',
        description:
          'Solves for any one of initial investment, monthly contribution, annual return, or time horizon from the other three under compound interest, with a chart and year-by-year table, plus a sustainable monthly withdrawal estimate.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'sql-formatter',
    translations: {
      ja: {
        name: 'SQL整形',
        description:
          'SQLクエリを整形・ミニファイします。MySQL・PostgreSQL・SQLite・BigQuery等の方言、インデント幅、キーワードの大文字/小文字に対応。',
        category: '変換',
      },
      en: {
        name: 'SQL Formatter',
        description:
          'Formats and minifies SQL queries, with support for MySQL, PostgreSQL, SQLite, BigQuery and other dialects, indent width, and keyword case.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'code-minifier',
    translations: {
      ja: {
        name: 'CSS/JS/HTMLミニファイ＆整形',
        description:
          'CSS・JavaScript・HTMLのコードを整形・ミニファイします。インデント幅の指定にも対応。',
        category: '変換',
      },
      en: {
        name: 'CSS/JS/HTML Minifier',
        description:
          'Formats and minifies CSS, JavaScript, and HTML code, with a selectable indent width.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'chmod-calculator',
    translations: {
      ja: {
        name: 'Chmodパーミッション計算機',
        description:
          'ファイルパーミッションをチェックボックス・8進数（755等）・シンボル表記（rwxr-xr-x等）で相互変換します。setuid/setgid/スティッキービットにも対応。',
        category: '開発',
      },
      en: {
        name: 'Chmod Permission Calculator',
        description:
          'Converts file permissions between checkboxes, octal notation (e.g. 755), and symbolic notation (e.g. rwxr-xr-x), with setuid/setgid/sticky bit support.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'cidr-calculator',
    translations: {
      ja: {
        name: 'CIDR/サブネット計算機',
        description:
          'CIDR表記やIPアドレス+サブネットマスクから、ネットワークアドレス・ブロードキャストアドレス・利用可能ホスト数を計算します。',
        category: '開発',
      },
      en: {
        name: 'CIDR / Subnet Calculator',
        description:
          'Calculates the network address, broadcast address, and usable host count from CIDR notation or an IP address plus subnet mask.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'keycode-checker',
    translations: {
      ja: {
        name: 'キーコード（e.code/e.key）チェッカー',
        description:
          '押したキーのevent.key・event.code・keyCode・location・修飾キーの状態をリアルタイムで表示します。JavaScriptのキーボードイベント実装時の値確認に便利。',
        category: '開発',
      },
      en: {
        name: 'Keycode (e.code / e.key) Checker',
        description:
          'Shows the event.key, event.code, keyCode, location, and modifier keys of any key you press, in real time. Handy for checking values while implementing keyboard event handling.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'viewport-checker',
    translations: {
      ja: {
        name: 'スクリーンサイズ・Viewportチェッカー',
        description:
          'ビューポートサイズ・ウィンドウサイズ・画面解像度・デバイスピクセル比・Tailwind CSSのブレークポイントをリアルタイムで表示します。レスポンシブデザインの確認に便利。',
        category: '開発',
      },
      en: {
        name: 'Screen Size & Viewport Checker',
        description:
          'Shows the viewport size, window size, screen resolution, device pixel ratio, and current Tailwind CSS breakpoint in real time. Handy for checking responsive designs.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'json-path-tester',
    translations: {
      ja: {
        name: 'JSON Path / JSON Pointerテスター',
        description:
          'JSONPathやJSON Pointer（RFC 6901）のクエリを入力すると、マッチした値と絶対パスを一覧表示します。APIレスポンスから値を取り出すクエリの動作確認に便利。',
        category: '開発',
      },
      en: {
        name: 'JSON Path / JSON Pointer Tester',
        description:
          'Tests a JSONPath or JSON Pointer (RFC 6901) query against your JSON data and lists every matched value with its absolute path. Handy for checking a query before pulling a value out of an API response.',
        category: 'Development',
      },
    },
  },
  {
    slug: 'text-case-converter',
    translations: {
      ja: {
        name: 'テキストケース変換',
        description:
          '文字列をcamelCase・PascalCase・snake_case・kebab-caseなど9種類の命名規則に一括変換します。プログラミングの変数名・関数名の書き換えに便利。',
        category: '変換',
      },
      en: {
        name: 'Text Case Converter',
        description:
          'Converts text into 9 naming conventions at once, including camelCase, PascalCase, snake_case, and kebab-case. Handy for renaming variables and functions.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'scholarship-repayment-simulator',
    translations: {
      ja: {
        name: '奨学金返済シミュレーション',
        description:
          'JASSO第二種奨学金（利子付き）を想定し、貸与総額・利率・返還期間から、利率固定方式・利率見直し方式それぞれの毎月の返済額・総返済額・総利息を簡易試算します。',
        category: '計算',
      },
      en: {
        name: 'JASSO Student Loan Repayment Simulator',
        description:
          'Estimates the monthly payment, total repayment, and total interest for a JASSO Type 2 (interest-bearing) student loan, comparing the fixed-rate and rate-review repayment methods.',
        category: 'Calculate',
      },
    },
  },
  {
    slug: 'image-converter',
    translations: {
      ja: {
        name: '画像フォーマット変換',
        description:
          'PNG・JPEG・GIF・BMP画像をWebP・JPEG・PNGに変換し、品質を指定して圧縮できます。複数画像の一括変換に対応。',
        category: '変換',
      },
      en: {
        name: 'Image Format Converter',
        description:
          'Converts PNG, JPEG, GIF, and BMP images to WebP, JPEG, or PNG with adjustable quality, and supports converting several files at once.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'image-resizer',
    translations: {
      ja: {
        name: '画像リサイズ・圧縮',
        description:
          '画像の幅・高さをpxまたは%指定でリサイズし、WebP・JPEG・PNGで圧縮できます。複数画像の一括処理に対応。',
        category: '変換',
      },
      en: {
        name: 'Image Resizer & Compressor',
        description:
          'Resizes images by pixel size or percentage and compresses them to WebP, JPEG, or PNG, with support for processing several files at once.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'image-to-base64',
    translations: {
      ja: {
        name: '画像のBase64（Data URL）変換',
        description:
          '画像ファイルをBase64文字列・Data URLに変換したり、Base64文字列やData URLを画像に戻して保存できます。',
        category: '変換',
      },
      en: {
        name: 'Image to Base64 Converter',
        description:
          'Converts an image file to a Base64 string or Data URL, and converts a Base64 string or Data URL back into a downloadable image.',
        category: 'Convert',
      },
    },
  },
  {
    slug: 'favicon-generator',
    translations: {
      ja: {
        name: 'favicon一括生成',
        description:
          '1枚の画像からfavicon.ico（16/32/48px同梱）と複数サイズのPNG（apple-touch-icon等）を一括生成し、HTML貼り付け用のlinkタグも出力します。',
        category: '生成',
      },
      en: {
        name: 'Favicon Generator',
        description:
          'Generates favicon.ico (bundling 16/32/48px) and multiple PNG sizes (apple-touch-icon, etc.) from a single image, plus the HTML link tags to reference them.',
        category: 'Generate',
      },
    },
  },
];

export function getLocalizedTools(locale: Locale): LocalizedTool[] {
  return tools.map((tool) => ({
    slug: tool.slug,
    ...tool.translations[locale],
  }));
}
