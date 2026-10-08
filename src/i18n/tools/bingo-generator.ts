import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BingoGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  drawHeading: string;
  rangeLabel: string;
  /** {n} を置換して表示する */
  rangeHint: string;
  drawButton: string;
  resetButton: string;
  fullscreenButton: string;
  exitFullscreenButton: string;
  soundLabel: string;
  currentLabel: string;
  currentEmpty: string;
  historyLabel: string;
  historyEmpty: string;
  boardLabel: string;
  /** {drawn} {total} を置換して表示する */
  progress: string;
  finished: string;
  cardsHeading: string;
  cardCountLabel: string;
  /** {max} を置換して表示する */
  cardCountHint: string;
  cardsGenerate: string;
  cardsPrint: string;
  cardsHint: string;
  /** {n} を置換して表示する */
  cardTitle: string;
  freeLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const bingoGeneratorContent: Record<Locale, BingoGeneratorPageContent> =
  {
    ja: {
      title: 'ビンゴ抽選機・ビンゴカード生成｜忘年会・イベント向け無料ツール',
      description:
        'ビンゴ大会に使える抽選機と、人数分のビンゴカードを一括生成できる無料ツール。1〜75を重複なしで抽選し、履歴の表示・全画面表示・音に対応。カードは印刷可能。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'ビンゴ抽選機・ビンゴカード生成',
      introHtml:
        '忘年会や二次会、イベントのビンゴ大会に使えるツールです。ボタンを押すたびに番号を1つずつ重複なしで抽選し、出た番号の履歴を残します。人数分のビンゴカード（5×5・中央FREE）をまとめて作って印刷することもできます。景品の順番決めなどには <a href="/tools/amidakuji-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">あみだくじ生成</a> も便利です。',
      howToHeading: '使い方',
      howToSteps: [
        '「ビンゴカード」で人数分の枚数を入力し、「カードを作る」を押して「印刷する」で配布用のカードを用意します。',
        '「ビンゴ抽選機」で番号の範囲（標準は75）を確認し、会場で「全画面表示」を押します。',
        '「次の番号を引く」を押すたびに番号が大きく表示され、履歴に追加されます。音を鳴らしたいときは「音を鳴らす」をオンにします。',
        '最初からやり直すときは「リセット」を押します。',
      ],
      drawHeading: 'ビンゴ抽選機',
      rangeLabel: '番号の範囲（1〜）',
      rangeHint:
        '1〜{n}から重複なしで抽選します。変更すると最初からになります。',
      drawButton: '次の番号を引く',
      resetButton: 'リセット',
      fullscreenButton: '全画面表示',
      exitFullscreenButton: '全画面を終了',
      soundLabel: '音を鳴らす',
      currentLabel: '今回の番号',
      currentEmpty: '—',
      historyLabel: '出た番号の履歴（新しい順）',
      historyEmpty: 'まだ番号が出ていません。',
      boardLabel: '番号一覧（出た番号を強調）',
      progress: '{drawn} / {total} 個',
      finished: 'すべての番号が出ました。リセットすると最初からやり直せます。',
      cardsHeading: 'ビンゴカード一括生成',
      cardCountLabel: '枚数（人数分）',
      cardCountHint: '最大{max}枚まで。',
      cardsGenerate: 'カードを作る',
      cardsPrint: '印刷する',
      cardsHint:
        '標準の5×5カードです。B=1〜15、I=16〜30、N=31〜45、G=46〜60、O=61〜75で、中央はFREEです。',
      cardTitle: 'カード No.{n}',
      freeLabel: 'FREE',
      notesHeading: '注意事項',
      notes: [
        '番号はブラウザの暗号用乱数（crypto.getRandomValues）で抽選し、一度出た番号は二度と出ません。リセットすると履歴も消えます。',
        'ページを再読み込みすると、出た番号の履歴は消えます。大会の途中で閉じたり再読み込みしたりしないようご注意ください。',
        'カードは1枚ずつ独立にランダム生成します。別々のカードがまったく同じ並びになる可能性はごくわずかですが、重複しない保証はありません。',
        '全画面表示は、ブラウザが対応している場合のみ使えます。非対応の環境ではボタンを押しても何も起こりません。',
        '音はブラウザで作る短いビープ音です。ブラウザや端末のマナーモード・音量設定により鳴らないことがあります。',
        '印刷するときは、ブラウザの印刷画面で『背景のグラフィック』をオンにすると罫線が見やすくなります。懸賞・景品表示法の対象となる抽選や金銭の絡む抽選には使わないでください。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'ビンゴ（75ボール）',
          description:
            '1〜75の番号を使う、主に北米で一般的なビンゴです。5×5のカードの列がB・I・N・G・Oに対応し、各列に15個ずつの範囲があります。縦・横・斜めのどれか一列がそろうとビンゴです。',
        },
        {
          term: '暗号用乱数',
          description:
            '予測しにくさを重視した乱数です。ブラウザが提供する crypto.getRandomValues を使っており、Math.random() よりも偏りや予測のリスクが小さくなります。',
        },
      ],
    },
    en: {
      title: 'Bingo Number Caller & Card Generator – Free & Printable',
      description:
        'Call bingo numbers with no repeats, keep a history, go full screen, and print bingo cards. Runs in your browser; nothing is sent to a server.',
      h1: 'Bingo Number Caller & Card Generator',
      introHtml:
        'A bingo caller and card maker for parties, classrooms and company events. Each press draws one number with no repeats and adds it to the call history. You can also generate a batch of standard 5×5 cards with a free center space and print them. Need to settle the prize order too? Try the <a href="/en/tools/amidakuji-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Amidakuji (Ghost Leg) Generator</a>.',
      howToHeading: 'How to use',
      howToSteps: [
        'Under “Bingo cards”, enter how many cards you need, press “Generate cards”, then “Print” to get cards for your guests.',
        'Under “Bingo number caller”, check the number range (75 by default) and press “Full screen” at the venue.',
        'Press “Draw next number” to show a new number in large type and add it to the history. Turn on “Play a beep” if you want sound.',
        'Press “Reset” to start a new game.',
      ],
      drawHeading: 'Bingo number caller',
      rangeLabel: 'Number range (1 to)',
      rangeHint:
        'Numbers are drawn from 1 to {n} without repeats. Changing it restarts the game.',
      drawButton: 'Draw next number',
      resetButton: 'Reset',
      fullscreenButton: 'Full screen',
      exitFullscreenButton: 'Exit full screen',
      soundLabel: 'Play a beep',
      currentLabel: 'Current number',
      currentEmpty: '—',
      historyLabel: 'Numbers called (newest first)',
      historyEmpty: 'No numbers have been called yet.',
      boardLabel: 'Number board (called numbers highlighted)',
      progress: '{drawn} of {total} called',
      finished: 'Every number has been called. Press Reset to start over.',
      cardsHeading: 'Bingo cards',
      cardCountLabel: 'Number of cards',
      cardCountHint: 'Up to {max} cards.',
      cardsGenerate: 'Generate cards',
      cardsPrint: 'Print',
      cardsHint:
        'Standard 5×5 cards. B is 1–15, I is 16–30, N is 31–45, G is 46–60, O is 61–75, and the center is a free space.',
      cardTitle: 'Card #{n}',
      freeLabel: 'FREE',
      notesHeading: 'Notes',
      notes: [
        'Numbers are drawn with the browser’s cryptographic random numbers (crypto.getRandomValues), and a number that has been called is never called again. Resetting also clears the history.',
        'Reloading the page clears the call history, so avoid closing or reloading the tab in the middle of a game.',
        'Each card is generated independently at random. Two cards being identical is extremely unlikely, but it is not ruled out.',
        'Full screen works only in browsers that support it; in others the button does nothing.',
        'The sound is a short beep generated in the browser. It may be silent depending on your browser, device mute switch or volume.',
        'When printing, turn on “Background graphics” in the print dialog for clearer grid lines. Do not use this for sweepstakes regulated by law or draws involving money.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: '75-ball bingo',
          description:
            'The common North American style that uses numbers 1 to 75. The five columns of a 5×5 card are B, I, N, G and O, each with its own block of 15 numbers. Complete any row, column or diagonal to win.',
        },
        {
          term: 'Cryptographic randomness',
          description:
            'Random numbers designed to be hard to predict. This tool uses the browser’s crypto.getRandomValues, which is less biased and less predictable than Math.random().',
        },
      ],
    },
  };
