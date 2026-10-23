import type { Locale } from '../../data/tools';
import type {
  ConvertErrorCode,
  WarningCode,
} from '../../lib/tools/docker-compose-converter';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DockerComposeConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleButton: string;
  clearButton: string;
  containerNameLabel: string;
  outputLabel: string;
  copyButton: string;
  downloadButton: string;
  copied: string;
  copyFailed: string;
  summary: string;
  warningsHeading: string;
  warnings: Record<WarningCode, string>;
  errors: Record<ConvertErrorCode, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
  sampleText: string;
}

const SAMPLE = [
  'docker run -d \\',
  '  --name web \\',
  '  -p 8080:80 \\',
  '  -v "$(pwd)/html":/usr/share/nginx/html:ro \\',
  '  -v logs:/var/log/nginx \\',
  '  -e TZ=Asia/Tokyo \\',
  '  --restart unless-stopped \\',
  '  --rm \\',
  '  nginx:1.27',
].join('\n');

const CODE = 'rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800';

export const dockerComposeConverterContent: Record<
  Locale,
  DockerComposeConverterPageContent
> = {
  ja: {
    title: 'docker run→docker-compose変換（compose.yml生成）',
    description:
      'docker runコマンドをdocker-compose.ymlに変換する無料ツールです。-p・-v・-e・--name・--restartなど主要オプションに対応し、未対応オプションは警告。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'docker run→docker-compose変換',
    introHtml: `<code class="${CODE}">docker run</code> コマンドを貼り付けると、<code class="${CODE}">docker-compose.yml</code>（Compose形式）に変換します。ポート・ボリューム・環境変数・コンテナ名・再起動ポリシーなどの主要オプションに対応し、名前付きボリュームやカスタムネットワークのトップレベル宣言も自動で追加します。変換できないオプションは警告として一覧表示します。生成したYAMLの整形は <a href="/tools/yaml-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">YAML整形</a> でも行えます。`,
    inputLabel: 'docker runコマンド',
    inputPlaceholder:
      'docker run -d --name web -p 8080:80 -e TZ=Asia/Tokyo nginx:latest',
    sampleButton: 'サンプルを入力',
    clearButton: 'クリア',
    containerNameLabel: '--name を container_name としても出力する',
    outputLabel: 'docker-compose.yml',
    copyButton: 'コピー',
    downloadButton: 'ダウンロード',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    summary: 'サービス「{name}」に変換しました',
    warningsHeading: '変換できなかった項目・確認が必要な項目',
    warnings: {
      unsupportedOption:
        '{detail} は対応していないため変換に含めていません。必要ならCompose側で手動で設定してください。',
      unknownOption: '{detail} は不明なオプションのため無視しました。',
      missingValue: '{detail} に値がありません。',
      invalidPort:
        'ポート指定「{detail}」が一般的な形式（[IP:]ホスト:コンテナ[/プロトコル]）ではありません。そのまま出力しています。',
      invalidRestart:
        '再起動ポリシー「{detail}」は no・always・unless-stopped・on-failure[:回数] のいずれでもありません。',
      invalidEnv: '環境変数の指定「{detail}」を解釈できませんでした。',
      pwdReplaced:
        '「{detail}」のカレントディレクトリ指定を「.」（compose.ymlからの相対パス）に置き換えました。',
      dollar:
        '値に「$」が含まれています。Composeは $変数 を展開するため、そのまま使いたい場合は「$$」と書いてください。',
    },
    errors: {
      empty: 'docker runコマンドを入力してください。',
      unterminatedQuote: '引用符（" または \'）が閉じられていません。',
      notRun:
        '「docker run」で始まるコマンドではありません。このツールは docker run のみに対応しています。',
      noImage: 'イメージ名が見つかりませんでした。コマンドを確認してください。',
    },
    notesHeading: '注意点',
    notes: [
      '対応しているのは -p / -v / -e / --env-file / --name / --restart / -w / -u / -h / --network / --entrypoint / -l / --cap-add / --cap-drop / --dns / --add-host / --device / --tmpfs / --expose / --link / -m / --cpus / --platform / --shm-size / --privileged / --init / --read-only / -i / -t などの主要オプションです。--rm・ヘルスチェック・ログ設定・--mount など、それ以外は警告として表示します。',
      '変換は docker run → Compose の一方向のみです。コマンドは実行されず、イメージの取得やコンテナの起動も行いません。',
      'シェルの展開（$(pwd) など）は実行できません。$(pwd)・$PWD はボリュームの相対パス「.」に置き換え、それ以外の「$」はそのまま出力します。',
      '-e に含まれるパスワードやトークンも出力に含まれます。共有や公開の前にご確認ください（値は保存・送信されません）。',
      '-d（バックグラウンド実行）は Compose では docker compose up -d で指定するため、出力には含めません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Docker Compose',
        description:
          '複数のコンテナの構成をYAMLファイル（compose.yml / docker-compose.yml）に書いて、docker compose up で一括起動する仕組みです。docker runのオプションをファイルに残せるため、再現しやすくなります。',
      },
      {
        term: '名前付きボリューム',
        description:
          '-v pgdata:/var/lib/postgresql/data のように、パスではなく名前を指定するボリュームです。Composeではトップレベルの volumes: に宣言します。/ や . で始まる指定はバインドマウント（ホストのパス）です。',
      },
      {
        term: 'network_mode',
        description:
          'docker run の --network host などに相当するComposeの設定です。独自ネットワーク名を指定した場合は networks: に書き、外部で作成済みのネットワークとして external: true を付けます。',
      },
    ],
    sampleText: SAMPLE,
  },
  en: {
    title: 'docker run to Compose Converter (compose.yml)',
    description:
      'Convert a docker run command to docker-compose.yml. Handles -p, -v, -e, --name, --restart and more, and warns about unsupported options. Runs in your browser.',
    h1: 'docker run to docker-compose.yml Converter',
    introHtml: `Paste a <code class="${CODE}">docker run</code> command and get a <code class="${CODE}">docker-compose.yml</code> (Compose file). Ports, volumes, environment variables, container name, restart policy and other common options are converted, and named volumes and custom networks are declared at the top level for you. Anything that cannot be converted is listed as a warning. You can tidy the generated YAML with the <a href="/en/tools/yaml-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">YAML Formatter</a>.`,
    inputLabel: 'docker run command',
    inputPlaceholder:
      'docker run -d --name web -p 8080:80 -e TZ=Asia/Tokyo nginx:latest',
    sampleButton: 'Insert sample',
    clearButton: 'Clear',
    containerNameLabel: 'Also output --name as container_name',
    outputLabel: 'docker-compose.yml',
    copyButton: 'Copy',
    downloadButton: 'Download',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    summary: 'Converted to service "{name}"',
    warningsHeading: 'Skipped or needs checking',
    warnings: {
      unsupportedOption:
        '{detail} is not supported and was left out. Add it to the Compose file by hand if you need it.',
      unknownOption: '{detail} is an unknown option and was ignored.',
      missingValue: '{detail} has no value.',
      invalidPort:
        'The port mapping "{detail}" does not look like [IP:]host:container[/protocol]. It was output as is.',
      invalidRestart:
        'The restart policy "{detail}" is not one of no, always, unless-stopped or on-failure[:count].',
      invalidEnv: 'Could not read the environment variable "{detail}".',
      pwdReplaced:
        'The current-directory reference in "{detail}" was replaced with "." (a path relative to the compose file).',
      dollar:
        'A value contains "$". Compose expands $VARIABLES, so write "$$" if you want a literal dollar sign.',
    },
    errors: {
      empty: 'Enter a docker run command.',
      unterminatedQuote: 'A quote (" or \') is not closed.',
      notRun:
        'This is not a "docker run" command. Only docker run is supported.',
      noImage: 'No image name was found. Check the command.',
    },
    notesHeading: 'Notes',
    notes: [
      'Supported options include -p, -v, -e, --env-file, --name, --restart, -w, -u, -h, --network, --entrypoint, -l, --cap-add, --cap-drop, --dns, --add-host, --device, --tmpfs, --expose, --link, -m, --cpus, --platform, --shm-size, --privileged, --init, --read-only, -i and -t. Everything else, such as --rm, health checks, logging options and --mount, is reported as a warning.',
      'Conversion goes one way only, from docker run to Compose. The command is never executed, and no image is pulled or container started.',
      'Shell expansion such as $(pwd) cannot be evaluated. $(pwd) and $PWD in volumes become the relative path ".", and any other "$" is output unchanged.',
      'Passwords and tokens given with -e appear in the output. Check it before sharing or publishing (values are never stored or sent anywhere).',
      '-d (detached mode) has no Compose equivalent in the file; use docker compose up -d instead, so it is omitted.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Docker Compose',
        description:
          'A tool that describes one or more containers in a YAML file (compose.yml / docker-compose.yml) and starts them with docker compose up. Keeping your docker run options in a file makes the setup easy to reproduce.',
      },
      {
        term: 'Named volume',
        description:
          'A volume given by name instead of a path, as in -v pgdata:/var/lib/postgresql/data. In Compose it is declared under the top-level volumes: key. A source starting with / or . is a bind mount of a host path.',
      },
      {
        term: 'network_mode',
        description:
          'The Compose setting that corresponds to docker run --network host and similar. A custom network name goes under networks:, marked external: true when it was created outside Compose.',
      },
    ],
    sampleText: SAMPLE,
  },
};
