import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ColorSenseTestPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  start: string;
  restart: string;
  timeLabel: string;
  scoreLabel: string;
  stageLabel: string;
  /** 開始前に盤面の場所へ表示する案内 */
  idleHint: string;
  boardLabel: string;
  /** {n} を置換する（1始まり） */
  tileLabel: string;
  correct: string;
  /** {seconds} を置換する */
  wrong: string;
  /** {score} {rank} を置換する */
  finished: string;
  newBest: string;
  rankBeginner: string;
  rankAverage: string;
  rankGood: string;
  rankGreat: string;
  rankMaster: string;
  bestHeading: string;
  /** {score} を置換する */
  bestValue: string;
  bestNone: string;
  resetRecords: string;
  recordsCleared: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const colorSenseTestContent: Record<Locale, ColorSenseTestPageContent> =
  {
    ja: {
      title: '色彩感覚テスト｜色の違いを見つけるゲーム（60秒）',
      description:
        'わずかに色の違うタイルを1つ選ぶ、60秒の色彩感覚テストです。進むほど色の差が小さくなり、正解数でランクが決まります。ベストスコアはブラウザに保存。娯楽用で医療的な検査ではありません。データはサーバーに送信されません。',
      h1: '色彩感覚テスト｜違う色のタイルを探す60秒ゲーム',
      introHtml:
        '並んだタイルの中から、ほんの少しだけ色が違うものを1つ選んでいくゲームです。制限時間は60秒で、正解するごとにタイルが増え、色の差も小さくなります。何問正解できたかでランクが決まります。これは遊びのためのもので、色覚検査などの医療的な検査の代わりにはなりません。反射神経を試すなら <a href="/tools/reaction-test/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">反応速度テスト</a> もどうぞ。',
      howToHeading: '使い方',
      howToSteps: [
        '「スタート」を押すと、60秒のカウントダウンが始まります。',
        '並んだタイルの中から、ほかと少しだけ色が違う1つをクリック（タップ）します。',
        '正解すると次の問題に進み、タイルが増えて色の差が小さくなります。間違えると残り時間が3秒減ります。',
        '時間が0になると終了し、正解数とランクが表示されます。「もう一度」で再挑戦できます。',
      ],
      start: 'スタート',
      restart: 'もう一度',
      timeLabel: '残り時間',
      scoreLabel: '正解数',
      stageLabel: '問題',
      idleHint: '「スタート」を押すと、タイルが表示されて60秒が始まります。',
      boardLabel: '色の違うタイルを1つ選んでください',
      tileLabel: '{n}番目のタイル',
      correct: '正解！',
      wrong: '違います。残り時間が{seconds}秒減りました。',
      finished: '終了！ {score}問正解でした。ランク: {rank}',
      newBest: 'ベストスコアを更新しました！',
      rankBeginner: 'これから伸びる',
      rankAverage: 'ふつう',
      rankGood: '良い',
      rankGreat: 'すばらしい',
      rankMaster: '達人',
      bestHeading: 'ベストスコア',
      bestValue: '{score}問',
      bestNone: '記録なし',
      resetRecords: '記録を消去',
      recordsCleared: 'ベストスコアを消去しました。',
      notesHeading: '注意事項',
      notes: [
        'このテストは娯楽・暇つぶし用です。色覚異常の検査や診断、医療的な判断の代わりにはなりません。気になる場合は眼科などの専門機関に相談してください。',
        '見え方は、モニターの種類・明るさ・色温度・ナイトモードや、周囲の明るさで大きく変わります。同じ人でも環境によって結果が変わるため、スコアは目安として楽しんでください。',
        '色の違いは明るさだけを少し変えています。ステージが進むほど明るさの差が小さくなり、最終的には約1.5%の差になります。',
        'ランクの目安は、正解数が15問以上で「ふつう」、25問以上で「良い」、35問以上で「すばらしい」、45問以上で「達人」です。',
        'ベストスコアは、このブラウザの localStorage にのみ保存されます。サーバーには送信されず、別の端末やブラウザとは共有されません。',
        '時間の計測はブラウザ上の時計で行います。タブを切り替えても時間は進み続けます。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '明度（明るさ）',
          description:
            '色の明るさの度合いです。このゲームでは、色合い（色相）と鮮やかさ（彩度）は同じまま、明度だけをわずかに変えたタイルを混ぜています。',
        },
        {
          term: '色相・彩度',
          description:
            '色相は赤・緑・青といった色合いの種類、彩度は色の鮮やかさです。このゲームでは問題ごとにランダムな色相と彩度の組み合わせが選ばれます。',
        },
        {
          term: 'HSL',
          description:
            '色を色相（Hue）・彩度（Saturation）・明度（Lightness）で表す方法です。Webの色指定でよく使われ、このゲームのタイルの色もHSLで作っています。',
        },
      ],
    },
    en: {
      title: 'Color Sense Test – Spot the Odd Color Tile (60-Second Game)',
      description:
        'Pick the one slightly different color tile in 60 seconds. The difference shrinks as you go; best score saved in your browser. For fun, not a medical test.',
      h1: 'Color Sense Test – Find the Odd Color Tile in 60 Seconds',
      introHtml:
        'Among a grid of tiles, one is a slightly different shade. Click it before the 60 seconds run out. Each correct answer adds more tiles and makes the difference smaller, and your total number of correct answers sets your rank. This is a game for fun and is not a color vision test or a medical tool. If you like speed games, try the <a href="/en/tools/reaction-test/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">reaction time test</a> too.',
      howToHeading: 'How to use',
      howToSteps: [
        'Press "Start" to begin the 60-second countdown.',
        'Click (or tap) the one tile whose color is slightly different from the rest.',
        'A correct pick moves on to the next round with more tiles and a smaller difference. A wrong pick takes 3 seconds off the clock.',
        'When the time reaches 0 the game ends and shows your score and rank. Press "Play again" to retry.',
      ],
      start: 'Start',
      restart: 'Play again',
      timeLabel: 'Time left',
      scoreLabel: 'Correct',
      stageLabel: 'Round',
      idleHint: 'Press "Start" to show the tiles and begin the 60 seconds.',
      boardLabel: 'Pick the one tile with a different color',
      tileLabel: 'Tile {n}',
      correct: 'Correct!',
      wrong: 'Not that one. {seconds} seconds were taken off the clock.',
      finished: 'Time is up! You got {score} correct. Rank: {rank}',
      newBest: 'New best score!',
      rankBeginner: 'Room to grow',
      rankAverage: 'Average',
      rankGood: 'Good',
      rankGreat: 'Great',
      rankMaster: 'Master',
      bestHeading: 'Best score',
      bestValue: '{score} correct',
      bestNone: 'No record yet',
      resetRecords: 'Clear record',
      recordsCleared: 'The best score has been cleared.',
      notesHeading: 'Notes',
      notes: [
        'This test is for fun only. It is not a color vision test or a diagnosis, and it cannot replace a medical examination. If you have concerns about your color vision, consult an eye-care professional.',
        'What you see depends heavily on your monitor, its brightness and color temperature, night mode and the lighting around you. The same person can score differently in different setups, so treat the score as a rough guide.',
        'Only the lightness of the odd tile is changed. The difference shrinks as rounds progress and bottoms out at about 1.5%.',
        'Rank guide: 15 or more correct is Average, 25 Good, 35 Great and 45 Master.',
        'Your best score is stored only in this browser’s localStorage. It is not sent to a server and is not shared with other devices or browsers.',
        'Time is measured by the browser’s clock and keeps running if you switch tabs.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Lightness',
          description:
            'How light or dark a color is. In this game, the odd tile has the same hue and saturation as the others and differs only slightly in lightness.',
        },
        {
          term: 'Hue and saturation',
          description:
            'Hue is the kind of color (red, green, blue…) and saturation is how vivid it is. Each round picks a random combination of the two.',
        },
        {
          term: 'HSL',
          description:
            'A way of describing colors by Hue, Saturation and Lightness. It is common in CSS, and the tile colors in this game are generated in HSL.',
        },
      ],
    },
  };
