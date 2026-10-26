import type { Locale } from '../../data/tools';

export interface CatClickerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  pointsLabel: string;
  perClickLabel: string;
  perSecondLabel: string;
  totalLabel: string;
  clicksLabel: string;
  catLabel: string;
  upgradesHeading: string;
  buyLabel: string;
  levelLabel: string;
  costLabel: string;
  clickEffect: string;
  autoEffect: string;
  upgrades: Record<string, { name: string; description: string }>;
  resetLabel: string;
  resetConfirm: string;
  offlineGain: string;
  offlineCapped: string;
  saveFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const catClickerContent: Record<Locale, CatClickerPageContent> = {
  ja: {
    title: '猫クリッカー（放置で育てるにゃんこ育成ゲーム）',
    description:
      '猫をクリックして「さかな」を集め、アップグレードで自動化していく放置系クリッカーゲームです。進行はこの端末に自動保存、閉じている間の放置分も加算。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '猫クリッカー（猫をクリックして育てる放置ゲーム）',
    introHtml:
      '猫をクリック（タップ）して「さかな」を集め、アップグレードを買って少しずつ自動で増やしていく軽い放置ゲームです。ページを閉じている間も、最大8時間ぶんは放置で増えます。進行はこの端末のブラウザにだけ保存されます。反応を試したいときは<a href="/tools/aim-trainer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">エイム練習</a>や<a href="/tools/whack-a-mole/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">もぐらたたき</a>もどうぞ。',
    pointsLabel: 'さかな',
    perClickLabel: '1クリックあたり',
    perSecondLabel: '毎秒',
    totalLabel: '合計で集めた数',
    clicksLabel: 'クリック回数',
    catLabel: '猫をなでる（クリック）',
    upgradesHeading: 'アップグレード',
    buyLabel: '買う',
    levelLabel: 'Lv.',
    costLabel: '必要なさかな',
    clickEffect: '1クリック +{n}',
    autoEffect: '毎秒 +{n}',
    upgrades: {
      paw: { name: 'ふかふか肉球', description: 'なでる力が上がる' },
      glove: { name: 'マタタビグローブ', description: '猫がご機嫌になる' },
      kitten: { name: '子猫の手伝い', description: '子猫が魚を運んでくる' },
      yarn: { name: '毛糸玉工場', description: '毛糸玉で猫たちが大はしゃぎ' },
      tower: { name: 'キャットタワー', description: '猫が集まる人気スポット' },
      boat: { name: '漁船', description: '大漁で魚が届く' },
    },
    resetLabel: 'リセット',
    resetConfirm: '進行状況をすべて消して最初からやり直しますか？',
    offlineGain: 'おかえりなさい！ 留守の間に「さかな」が {n} 増えました。',
    offlineCapped: '（放置で増えるのは最大8時間ぶんです）',
    saveFailed:
      'この環境では保存できないため、ページを閉じると進行が消えます。',
    howToHeading: '使い方',
    howToSteps: [
      '猫をクリック（タップ）して「さかな」を集めます。',
      '「さかな」がたまったらアップグレードの「買う」を押して、クリック力や毎秒の増加量を上げます。',
      'ページを閉じても進行は自動保存され、最大8時間ぶんは放置で増えます。最初からやり直すときは「リセット」を押します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '進行状況はこのブラウザのlocalStorageにだけ保存され、サーバーには送られません。別のブラウザや端末とは共有されず、ブラウザのデータを消去すると失われます。',
      '放置による加算は最大8時間ぶんです。それ以上閉じていても、増えるのは8時間ぶんだけです。端末の時計を大きく戻した場合は加算されません。',
      'アップグレードの価格は買うたびに約15%ずつ上がります。数値が大きくなると『1.50M』のような略記で表示されます。',
      '「リセット」を押すと保存データも含めてすべて消え、元に戻せません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'クリッカー（放置ゲーム）',
        description:
          'クリックで数値を増やし、アップグレードで自動化していくジャンルのゲームです。操作しない間も数値が増え続けるのが特徴です。',
      },
      {
        term: 'オフライン加算',
        description:
          'ページを閉じている間の経過時間を、再び開いたときにまとめて反映する仕組みです。このツールでは最大8時間ぶんです。',
      },
    ],
  },
  en: {
    title: 'Cat Clicker – Idle Cat Game in Your Browser',
    description:
      'A cozy idle clicker: pet the cat to collect fish, buy upgrades and let them pile up on their own, even while the tab is closed. Saved locally in your browser.',
    h1: 'Cat Clicker (Pet the Cat, Grow Your Idle Cat Empire)',
    introHtml:
      'Click (or tap) the cat to collect fish, then buy upgrades so the fish keep rolling in on their own. Your cat keeps earning for up to 8 hours while the page is closed. Progress is stored only in this browser. Want a different quick game? Try the <a href="/en/tools/aim-trainer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Aim Trainer</a> or <a href="/en/tools/whack-a-mole/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Whack-a-Mole</a>.',
    pointsLabel: 'Fish',
    perClickLabel: 'Per click',
    perSecondLabel: 'Per second',
    totalLabel: 'Total collected',
    clicksLabel: 'Clicks',
    catLabel: 'Pet the cat (click)',
    upgradesHeading: 'Upgrades',
    buyLabel: 'Buy',
    levelLabel: 'Lv.',
    costLabel: 'Fish needed',
    clickEffect: '+{n} per click',
    autoEffect: '+{n} per second',
    upgrades: {
      paw: { name: 'Fluffy Paws', description: 'Pets get stronger' },
      glove: {
        name: 'Catnip Gloves',
        description: 'Your cat is in a great mood',
      },
      kitten: {
        name: 'Kitten Helper',
        description: 'A kitten carries fish for you',
      },
      yarn: {
        name: 'Yarn Factory',
        description: 'Yarn balls keep the cats busy',
      },
      tower: { name: 'Cat Tower', description: 'The hottest spot for cats' },
      boat: { name: 'Fishing Boat', description: 'A huge catch arrives' },
    },
    resetLabel: 'Reset',
    resetConfirm: 'Erase all progress and start over?',
    offlineGain: 'Welcome back! You earned {n} fish while you were away.',
    offlineCapped: '(Idle earnings are capped at 8 hours.)',
    saveFailed:
      'Saving is not available here, so your progress is lost when you close the page.',
    howToHeading: 'How to use',
    howToSteps: [
      'Click (or tap) the cat to collect fish.',
      'When you have enough fish, press "Buy" on an upgrade to raise your per-click and per-second gains.',
      'Progress saves automatically and keeps growing for up to 8 hours while the page is closed. Press "Reset" to start over.',
    ],
    notesHeading: 'Notes',
    notes: [
      "Progress is saved only in this browser's localStorage and never sent to a server. It is not shared with other browsers or devices, and clearing browser data removes it.",
      'Idle earnings are capped at 8 hours; being away longer does not add more. Setting your device clock back does not give you anything.',
      'Each upgrade gets about 15% more expensive every time you buy it. Large numbers are abbreviated, for example 1.50M.',
      '"Reset" erases everything including the saved data and cannot be undone.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Clicker (idle game)',
        description:
          'A genre where clicking raises a number and upgrades automate it. The number keeps growing even when you are not playing.',
      },
      {
        term: 'Offline progress',
        description:
          'Time spent away is added all at once when you return. Here it covers up to 8 hours.',
      },
    ],
  },
};
