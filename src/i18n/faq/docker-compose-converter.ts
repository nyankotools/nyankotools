import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どのdocker runオプションに対応していますか？',
      answer:
        '-p・-v・-e・--env-file・--name・--restart・-w・-u・--network・--entrypoint・--cap-add・--privileged・-i/-t など主要なものに対応しています。--rm・ヘルスチェック・ログ設定・--mount などは変換せず、警告として一覧表示します。',
    },
    {
      question: '-v $(pwd):/app はどう変換されますか？',
      answer:
        'ブラウザ上ではシェルの展開を実行できないため、$(pwd)・$PWD・${PWD} を、compose.ymlからの相対パス「.」に置き換えます（例: ./data:/data）。docker compose はcompose.ymlのあるディレクトリを基準に解決します。',
    },
    {
      question: '名前付きボリュームは自動で宣言されますか？',
      answer:
        'はい。-v pgdata:/data のようにパスではなく名前で指定したものは、トップレベルの volumes: に追加します。--network で独自のネットワーク名を指定した場合も networks: に external: true で宣言します。',
    },
    {
      question: '環境変数の値が "true" や 3000 のとき、引用符は付きますか？',
      answer:
        'はい。YAMLでは true・no・数値などが文字列でなくなってしまうため、該当する値は二重引用符で囲んで出力します。restart: "no" も同様です。$ を含む値はComposeが変数展開するため、必要に応じて $$ と書いてください。',
    },
    {
      question: 'docker-compose.yml から docker run への逆変換はできますか？',
      answer:
        'このツールは docker run から Compose への一方向のみです。複数コンテナを含むComposeファイルからの逆変換には対応していません。',
    },
  ],
  en: [
    {
      question: 'Which docker run options are supported?',
      answer:
        'Common ones: -p, -v, -e, --env-file, --name, --restart, -w, -u, --network, --entrypoint, --cap-add, --privileged, -i and -t, among others. Options such as --rm, health checks, logging settings and --mount are not converted and are listed as warnings.',
    },
    {
      question: 'How is -v $(pwd):/app converted?',
      answer:
        'A browser cannot evaluate shell expansion, so $(pwd), $PWD and ${PWD} are replaced with the path "." relative to the compose file (for example ./data:/data). Docker Compose resolves relative paths against the directory containing compose.yml.',
    },
    {
      question: 'Are named volumes declared automatically?',
      answer:
        'Yes. A source given as a name rather than a path, as in -v pgdata:/data, is added under the top-level volumes: key. A custom network passed to --network is likewise added under networks: with external: true.',
    },
    {
      question: 'Are values like "true" or 3000 quoted in the YAML?',
      answer:
        'Yes. In YAML, true, no and numbers would otherwise stop being strings, so such values are written in double quotes. restart: "no" is handled the same way. Compose expands $VARIABLES, so write $$ for a literal dollar sign.',
    },
    {
      question: 'Can I convert docker-compose.yml back to docker run?',
      answer:
        'No. This tool only goes from docker run to Compose. Converting a multi-container Compose file back to commands is not supported.',
    },
  ],
};
