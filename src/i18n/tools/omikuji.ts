import type { Locale } from '../../data/tools';
import type { ColorId, FortuneId, ItemId, Tier } from '../../lib/tools/omikuji';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface FortuneText {
  name: string;
  reading: string;
  /** 運勢文（VARIANTS 件） */
  messages: string[];
}

interface ItemText {
  label: string;
  /** 吉凶の段階ごとの文（それぞれ VARIANTS 件） */
  texts: Record<Tier, string[]>;
}

export interface OmikujiPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること */
  introHtml: string;
  modeLabel: string;
  modeDaily: string;
  modeRedraw: string;
  nameLabel: string;
  namePlaceholder: string;
  nameHint: string;
  /** {date} を置換して表示する */
  dailyInfo: string;
  redrawInfo: string;
  drawDaily: string;
  drawRedraw: string;
  luckyColorLabel: string;
  luckyNumberLabel: string;
  /** {name} は名前入力があるときだけ付く「◯◯さん」 */
  resultHeading: string;
  /** 名前があるときの見出し。{name} を置換 */
  resultHeadingNamed: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** コピー用の先頭行。{fortune} を置換 */
  shareText: string;
  fortunes: Record<FortuneId, FortuneText>;
  items: Record<ItemId, ItemText>;
  colors: Record<ColorId, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const omikujiContent: Record<Locale, OmikujiPageContent> = {
  ja: {
    title: 'おみくじ・今日の運勢｜大吉〜大凶を無料で引ける',
    description:
      'ブラウザで引ける無料のおみくじ。日付と名前から決まる「今日の運勢」と、何度でも引ける「引き直し」に対応。大吉・中吉・小吉・凶などの運勢と、願望・恋愛・仕事・学問・健康・金運、ラッキーカラーを表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'おみくじ・今日の運勢',
    introHtml:
      '大吉から大凶までのおみくじを、ブラウザ上で引けるツールです。「今日の運勢」は日付と名前（任意）から決まるので、同じ日なら何度開いても同じ結果になります。気分を変えたいときは「引き直し」で何度でも引けます。何かを決めたいときは <a href="/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ルーレット・抽選・サイコロ</a> もどうぞ。',
    modeLabel: '引き方を選ぶ',
    modeDaily: '今日の運勢',
    modeRedraw: '引き直し',
    nameLabel: '名前（任意）',
    namePlaceholder: '例: にゃんこ',
    nameHint:
      '名前を入れると、あなただけの今日の運勢になります（入力した名前は保存も送信もされません）。',
    dailyInfo:
      '{date} の運勢です。同じ日・同じ名前なら、何度引いても同じ結果です。',
    redrawInfo: 'ボタンを押すたびに引き直します。',
    drawDaily: '今日の運勢を見る',
    drawRedraw: 'おみくじを引く',
    luckyColorLabel: 'ラッキーカラー',
    luckyNumberLabel: 'ラッキーナンバー',
    resultHeading: 'おみくじの結果',
    resultHeadingNamed: '{name}さんのおみくじ',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    shareText: 'おみくじの結果は「{fortune}」でした',
    fortunes: {
      daikichi: {
        name: '大吉',
        reading: 'だいきち',
        messages: [
          '何をやってもうまくいく最高の運気です。思い切って一歩を踏み出しましょう。',
          '追い風が吹いています。やりたかったことを始めるには絶好の日です。',
        ],
      },
      kichi: {
        name: '吉',
        reading: 'きち',
        messages: [
          '運気は上向きです。素直な気持ちで動けば、良い流れに乗れます。',
          '穏やかに良いことが続く運勢です。身近な人への感謝を忘れずに。',
        ],
      },
      chukichi: {
        name: '中吉',
        reading: 'ちゅうきち',
        messages: [
          '堅実に進めば成果が出ます。焦らず目の前のことに集中しましょう。',
          'ほどよく運に恵まれています。小さな努力が後で実を結びます。',
        ],
      },
      shokichi: {
        name: '小吉',
        reading: 'しょうきち',
        messages: [
          'ささやかな幸せが見つかる運勢です。小さな喜びを大切にしましょう。',
          '少しずつ運が開けてきます。無理をせず自分のペースで進みましょう。',
        ],
      },
      suekichi: {
        name: '末吉',
        reading: 'すえきち',
        messages: [
          '今は静かな時期ですが、この先に運が向いてきます。気長に待ちましょう。',
          '焦らず準備を整えれば、少しあとに良い結果がついてきます。',
        ],
      },
      kyo: {
        name: '凶',
        reading: 'きょう',
        messages: [
          '慎重に過ごせば大きな問題は避けられます。今日は無理せず控えめに。',
          '少し思うようにいかない日。休息を取り、足元を固める時期です。',
        ],
      },
      daikyo: {
        name: '大凶',
        reading: 'だいきょう',
        messages: [
          'これ以上は悪くならない底の運気です。あとは上がるだけ、気楽にいきましょう。',
          '悪い運は出し切りました。今日はのんびり過ごして、明日に期待しましょう。',
        ],
      },
    },
    items: {
      wish: {
        label: '願望',
        texts: {
          good: [
            '思いは通じます。自信を持って。',
            '願いは叶う方向へ進みます。',
          ],
          normal: [
            '焦らず続ければ道は開けます。',
            '時間はかかっても叶うでしょう。',
          ],
          bad: [
            '今は我慢のとき。時機を待って。',
            '願いは急がず、準備を整えて。',
          ],
        },
      },
      love: {
        label: '恋愛',
        texts: {
          good: [
            '素敵な出会いや進展がありそう。',
            '気持ちを伝えるなら今です。',
          ],
          normal: [
            '自然体でいると良い縁が近づきます。',
            '身近な人との会話を大切に。',
          ],
          bad: [
            '言葉選びは慎重に。すれ違いに注意。',
            '無理に動かず、様子を見て。',
          ],
        },
      },
      work: {
        label: '仕事',
        texts: {
          good: [
            '努力が評価されます。挑戦に向いた時期です。',
            '周囲の協力を得て大きく前進します。',
          ],
          normal: [
            '地道な作業が実を結びます。',
            '確認を怠らなければ順調です。',
          ],
          bad: [
            'ミスに注意。いつも以上に見直しを。',
            '大きな決断は先送りにしましょう。',
          ],
        },
      },
      study: {
        label: '学問',
        texts: {
          good: [
            '集中力が高まります。成果が出やすい時期。',
            '学んだことがしっかり身につきます。',
          ],
          normal: [
            'コツコツ続ければ力がつきます。',
            '基礎の復習が役に立ちます。',
          ],
          bad: [
            '気が散りやすい時期。環境を整えて。',
            '焦らず一歩ずつ。休憩も大切です。',
          ],
        },
      },
      health: {
        label: '健康',
        texts: {
          good: ['心身ともに好調です。', '体が軽く、活力にあふれています。'],
          normal: ['規則正しい生活を心がけて。', '軽い運動が調子を整えます。'],
          bad: [
            '無理は禁物。早めに休みましょう。',
            '疲れをためないよう注意して。',
          ],
        },
      },
      money: {
        label: '金運',
        texts: {
          good: [
            '思わぬ収入や良い買い物がありそう。',
            '財布のめぐりが良い時期です。',
          ],
          normal: [
            '収支は安定。計画的に使いましょう。',
            '堅実な管理が実を結びます。',
          ],
          bad: [
            '衝動買いに注意。出費を見直して。',
            '貸し借りや大きな買い物は慎重に。',
          ],
        },
      },
    },
    colors: {
      red: '赤',
      orange: 'オレンジ',
      yellow: '黄',
      green: '緑',
      blue: '青',
      purple: '紫',
      pink: 'ピンク',
      white: '白',
    },
    notesHeading: '注意事項',
    notes: [
      'おみくじの内容は娯楽用の読み物で、占いや予言として的中を保証するものではありません。医療・金銭・進路などの判断は、ご自身の責任で行ってください。',
      '「今日の運勢」は、端末の日付（ローカル時間）と入力した名前から計算します。日付が変わると結果も変わり、名前を変えても結果が変わります。名前の前後の空白や全角・半角、大文字・小文字の違いは同じ扱いです。',
      '「引き直し」はブラウザの暗号用乱数で引きます。出現率はおおよそ 大吉15%・吉25%・中吉20%・小吉15%・末吉15%・凶8%・大凶2% です。',
      '実際の神社のおみくじとは吉凶の順序や出現率が異なります。神社によって順序は様々です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'おみくじの吉凶の順序',
        description:
          'このツールでは 大吉 → 吉 → 中吉 → 小吉 → 末吉 → 凶 → 大凶 の順で運勢が下がるものとして扱っています。神社によって順序や種類（半吉・末小吉など）は異なります。',
      },
    ],
  },
  en: {
    title: 'Omikuji – Daily Fortune & Japanese Fortune Slip Online',
    description:
      'Draw a free omikuji fortune slip. Get a daily fortune that stays the same all day, or redraw freely. Runs in your browser; nothing is sent to a server.',
    h1: 'Omikuji: Daily Fortune Slip',
    introHtml:
      'Draw an omikuji, the fortune slips sold at Japanese shrines, ranging from great blessing to great curse. "Daily fortune" is based on today’s date and an optional name, so you get the same result all day. Want a different one? Use "Redraw" as many times as you like. To make a decision instead, try the <a href="/en/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Roulette, Random Picker & Dice Roller</a>.',
    modeLabel: 'Choose a mode',
    modeDaily: 'Daily fortune',
    modeRedraw: 'Redraw',
    nameLabel: 'Name (optional)',
    namePlaceholder: 'e.g. Nyanko',
    nameHint:
      'Enter a name to get a fortune just for you. The name is neither saved nor sent anywhere.',
    dailyInfo:
      'This is your fortune for {date}. The same date and name always give the same result.',
    redrawInfo: 'Each press draws a new slip.',
    drawDaily: 'See today’s fortune',
    drawRedraw: 'Draw a slip',
    luckyColorLabel: 'Lucky color',
    luckyNumberLabel: 'Lucky number',
    resultHeading: 'Your omikuji',
    resultHeadingNamed: 'Omikuji for {name}',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    shareText: 'My omikuji result: {fortune}',
    fortunes: {
      daikichi: {
        name: 'Great blessing',
        reading: 'Dai-kichi',
        messages: [
          'Everything is going your way. Take a bold step forward.',
          'You have a tailwind. This is a great day to start something new.',
        ],
      },
      kichi: {
        name: 'Blessing',
        reading: 'Kichi',
        messages: [
          'Your luck is rising. Move with an open heart and the current will carry you.',
          'Good things keep coming quietly. Remember to thank those close to you.',
        ],
      },
      chukichi: {
        name: 'Middle blessing',
        reading: 'Chu-kichi',
        messages: [
          'Steady progress pays off. Stay calm and focus on what is in front of you.',
          'Luck is with you in moderation. Small efforts will bear fruit later.',
        ],
      },
      shokichi: {
        name: 'Small blessing',
        reading: 'Sho-kichi',
        messages: [
          'You will find small happiness today. Cherish the little joys.',
          'Your luck is opening up bit by bit. Go at your own pace.',
        ],
      },
      suekichi: {
        name: 'Future blessing',
        reading: 'Sue-kichi',
        messages: [
          'Things are quiet now, but luck is coming. Be patient.',
          'Prepare without rushing and good results will follow soon.',
        ],
      },
      kyo: {
        name: 'Curse',
        reading: 'Kyo',
        messages: [
          'Stay careful and you will avoid any big trouble. Keep a low profile today.',
          'Things may not go as planned. Rest and strengthen your footing.',
        ],
      },
      daikyo: {
        name: 'Great curse',
        reading: 'Dai-kyo',
        messages: [
          'This is rock bottom: it cannot get worse, only better. Take it easy.',
          'You have used up your bad luck. Relax today and look forward to tomorrow.',
        ],
      },
    },
    items: {
      wish: {
        label: 'Wishes',
        texts: {
          good: [
            'Your wish will be heard. Be confident.',
            'Your wishes are heading toward coming true.',
          ],
          normal: [
            'Keep at it and the way will open.',
            'It may take time, but it will come true.',
          ],
          bad: [
            'Be patient and wait for the right moment.',
            'Do not rush your wish. Get ready first.',
          ],
        },
      },
      love: {
        label: 'Love',
        texts: {
          good: [
            'A lovely encounter or progress is likely.',
            'If you want to share your feelings, now is the time.',
          ],
          normal: [
            'Be yourself and good connections will find you.',
            'Cherish conversations with those near you.',
          ],
          bad: [
            'Choose your words carefully to avoid misunderstandings.',
            'Do not force things. Wait and see.',
          ],
        },
      },
      work: {
        label: 'Work',
        texts: {
          good: [
            'Your effort will be recognized. A good time to take on challenges.',
            'With help from those around you, you will make big progress.',
          ],
          normal: [
            'Steady work will pay off.',
            'Things go smoothly if you double-check.',
          ],
          bad: [
            'Watch for mistakes and review more than usual.',
            'Put off big decisions for now.',
          ],
        },
      },
      study: {
        label: 'Study',
        texts: {
          good: [
            'Your focus is sharp. Results come easily.',
            'What you learn will stick well.',
          ],
          normal: [
            'Keep going bit by bit and you will improve.',
            'Reviewing the basics will help.',
          ],
          bad: [
            'You may get distracted. Tidy up your environment.',
            'Take one step at a time, and rest too.',
          ],
        },
      },
      health: {
        label: 'Health',
        texts: {
          good: [
            'You feel good in body and mind.',
            'You are light and full of energy.',
          ],
          normal: [
            'Keep a regular routine.',
            'Light exercise will keep you in shape.',
          ],
          bad: [
            'Do not overdo it. Rest early.',
            'Be careful not to let fatigue build up.',
          ],
        },
      },
      money: {
        label: 'Money',
        texts: {
          good: [
            'Unexpected income or a good purchase may come.',
            'Money flows your way.',
          ],
          normal: [
            'Finances are stable. Spend with a plan.',
            'Careful management will pay off.',
          ],
          bad: [
            'Beware of impulse buys. Review your spending.',
            'Be careful with loans and big purchases.',
          ],
        },
      },
    },
    colors: {
      red: 'Red',
      orange: 'Orange',
      yellow: 'Yellow',
      green: 'Green',
      blue: 'Blue',
      purple: 'Purple',
      pink: 'Pink',
      white: 'White',
    },
    notesHeading: 'Notes',
    notes: [
      'The fortunes are for entertainment only and make no prediction or guarantee. Make decisions about health, money or your career on your own judgment.',
      'The daily fortune is calculated from your device’s local date and the name you enter. The result changes when the date or the name changes. Extra spaces, full-width vs. half-width characters and letter case in the name are treated as the same.',
      'Redraw uses the browser’s cryptographic randomness. Approximate odds: great blessing 15%, blessing 25%, middle blessing 20%, small blessing 15%, future blessing 15%, curse 8%, great curse 2%.',
      'Shrines differ in how they rank and distribute fortunes, so the order and odds here are not those of any real shrine.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Omikuji (おみくじ)',
        description:
          'Paper fortune slips drawn at Japanese shrines and temples. Here the ranks run from Great blessing (大吉) to Great curse (大凶): 大吉, 吉, 中吉, 小吉, 末吉, 凶, 大凶. Real shrines vary in the order and types they use.',
      },
    ],
  },
};
