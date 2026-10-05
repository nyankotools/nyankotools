import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AmidakujiGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  playersLabel: string;
  playersPlaceholder: string;
  defaultPlayers: string;
  resultsLabel: string;
  resultsPlaceholder: string;
  defaultResults: string;
  hideResultsLabel: string;
  generate: string;
  revealAll: string;
  reset: string;
  saveImage: string;
  savePrintImage: string;
  tapHint: string;
  chipsLabel: string;
  /** {n} を置換して表示する */
  lineLabel: string;
  ladderLabel: string;
  /** {count} を置換して表示する */
  countInfo: string;
  /** {min} {max} を置換して表示する */
  playersRangeError: string;
  /** {players} {results} を置換して表示する */
  countMismatchError: string;
  /** {player} {result} を置換して表示する */
  routeResult: string;
  resultsListHeading: string;
  imageFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const amidakujiGeneratorContent: Record<
  Locale,
  AmidakujiGeneratorPageContent
> = {
  ja: {
    title: 'あみだくじ生成｜名前と当たりを入れて引ける無料ツール',
    description:
      '参加者と結果を入力するだけで、あみだくじを自動作成。結果を隠して1人ずつ辿る／全員分を一括表示、画像保存に対応。乱数はブラウザの暗号用乱数を使用。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'あみだくじ生成',
    introHtml:
      '参加者の名前と、ゴールに置く結果（当たり・はずれ・担当など）を1行に1つずつ入力すると、あみだくじを作ります。結果は隠したまま、引く人が好きな線を選んで1人ずつ辿れます。ゴールの結果の位置はランダムです。重みを付けたい抽選は <a href="/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ルーレット・抽選・サイコロ</a> をご利用ください。',
    playersLabel: '参加者（1行に1人）',
    playersPlaceholder: '参加者名を1行に1人ずつ入力',
    defaultPlayers: 'Aさん\nBさん\nCさん\nDさん',
    resultsLabel: '結果（1行に1つ・参加者と同じ数）',
    resultsPlaceholder: '当たり・はずれ・担当などを1行に1つずつ入力',
    defaultResults: '当たり\nはずれ\nはずれ\nはずれ',
    hideResultsLabel: '結果を隠す（辿るまで？で表示）',
    generate: 'あみだくじを作る',
    revealAll: '全員分を表示',
    reset: '最初の状態に戻す',
    saveImage: '画像として保存',
    savePrintImage: '印刷用に保存（結果表示・色なし）',
    tapHint:
      '引く人の名前を選び、上の線（番号）をタップすると、その線から辿ります。どの線を選ぶかは自由です。',
    chipsLabel: '引く人',
    lineLabel: '{n}番目の線',
    ladderLabel: 'あみだくじ',
    countInfo: '{count}人',
    playersRangeError: '参加者は{min}〜{max}人で入力してください。',
    countMismatchError:
      '参加者（{players}人）と結果（{results}件）の数を同じにしてください。',
    routeResult: '{player} → {result}',
    resultsListHeading: '結果一覧',
    imageFailed: '画像の保存に失敗しました。',
    notesHeading: '注意事項',
    notes: [
      '横線はブラウザの暗号用乱数（crypto.getRandomValues）で配置しています。隣り合う列の間には必ず3本以上の横線が入り、同じ段で隣り合う横線は作りません。どの参加者も別々の結果にたどり着きます。',
      '参加者は2〜20人までです。参加者と結果の数は同じにしてください。結果に同じ文字列（はずれなど）を複数入れても構いません。結果を入力した順番はゴールの位置とは無関係で、作成のたびにランダムに並べ替えます。',
      '「結果を隠す」をオンにしている間、ゴールの結果は「？」で表示され、辿ったときだけ明らかになります。「画像として保存」はその時点の表示がそのまま保存されます。「印刷用に保存」は、結果をすべて表示し、経路に色を付けない状態で保存します（名前は入れず、線の番号だけを表示します）。',
      '本ツールの結果は公正さを第三者に証明できるものではありません。懸賞・景品表示法の対象となる抽選や金銭の絡む抽選には使わないでください。',
      '長い名前や結果は、あみだくじの図の中では先頭だけを表示します。結果一覧には全文が表示されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'あみだくじ',
        description:
          '縦線に横線を引き、上から線をたどって行き先を決めるくじです。横線に当たったら必ず曲がる決まりのため、2人が同じ結果になることはありません。',
      },
      {
        term: '暗号用乱数',
        description:
          '予測しにくさを重視した乱数です。ブラウザが提供する crypto.getRandomValues を使っており、Math.random() よりも偏りや予測のリスクが小さくなります。',
      },
    ],
  },
  en: {
    title: 'Amidakuji (Ghost Leg) Generator – Free Online Ladder Lottery',
    description:
      'Create an amidakuji ghost-leg ladder from names and prizes, trace each player, and save or print it. Runs in your browser; nothing is sent to a server.',
    h1: 'Amidakuji (Ghost Leg) Generator',
    introHtml:
      'Amidakuji is a Japanese ladder lottery. Enter player names and the outcomes at the bottom (prizes, chores, seats), one per line, and the ladder is drawn for you. Keep the results hidden while each player picks any line and traces it. The outcomes are placed at random. For weighted picks, try the <a href="/en/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Roulette, Random Picker & Dice Roller</a>.',
    playersLabel: 'Players (one per line)',
    playersPlaceholder: 'Enter one player name per line',
    defaultPlayers: 'Alice\nBob\nCarol\nDave',
    resultsLabel: 'Outcomes (one per line, same count as players)',
    resultsPlaceholder: 'Enter one prize, chore or outcome per line',
    defaultResults: 'Winner\nMiss\nMiss\nMiss',
    hideResultsLabel: 'Hide outcomes (shown as ? until traced)',
    generate: 'Create ladder',
    revealAll: 'Reveal everyone',
    reset: 'Reset',
    saveImage: 'Save as image',
    savePrintImage: 'Save for printing (outcomes shown, no colors)',
    tapHint:
      'Pick who is drawing, then tap any numbered line at the top to trace it. Players can choose any line they like.',
    chipsLabel: 'Who is drawing',
    lineLabel: 'Line {n}',
    ladderLabel: 'Amidakuji ladder',
    countInfo: '{count} player(s)',
    playersRangeError: 'Enter {min} to {max} players.',
    countMismatchError:
      'The number of players ({players}) and outcomes ({results}) must match.',
    routeResult: '{player} → {result}',
    resultsListHeading: 'Results',
    imageFailed: 'Could not save the image.',
    notesHeading: 'Notes',
    notes: [
      'Rungs are placed with the browser’s cryptographic random numbers (crypto.getRandomValues). Every pair of neighboring lines has at least three rungs, and no two rungs sit side by side on the same level, so every player ends up at a different outcome.',
      'You can enter 2 to 20 players, and the number of outcomes must match. The same outcome (such as “Miss”) may appear on several lines. The order you type them in does not decide the slot; outcomes are shuffled each time you create the ladder.',
      'While “Hide outcomes” is on, the bottom shows “?” until a path is traced. “Save as image” captures exactly what is on screen. “Save for printing” shows every outcome and leaves the lines uncolored (names are left off; only line numbers are shown).',
      'The result cannot be proven fair to a third party. Do not use it for sweepstakes regulated by law or for draws involving money.',
      'Long names and outcomes are shortened inside the ladder drawing; the results list shows them in full.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Amidakuji (ghost leg)',
        description:
          'A Japanese lottery of vertical lines joined by horizontal rungs. You follow a line down and must turn whenever you meet a rung, so two players can never reach the same outcome.',
      },
      {
        term: 'Cryptographic randomness',
        description:
          'Random numbers designed to be hard to predict. This tool uses the browser’s crypto.getRandomValues, which is less biased and less predictable than Math.random().',
      },
    ],
  },
};
