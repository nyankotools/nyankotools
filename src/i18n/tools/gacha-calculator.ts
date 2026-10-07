import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface GachaCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  rateLabel: string;
  ratePlaceholder: string;
  pullsLabel: string;
  pullsPlaceholder: string;
  ceilingLabel: string;
  ceilingPlaceholder: string;
  costLabel: string;
  costPlaceholder: string;
  ownedLabel: string;
  ownedPlaceholder: string;
  error: string;
  resultHeading: string;
  resultProbabilityLabel: string;
  resultExpectedHitsLabel: string;
  resultExpectedPullsLabel: string;
  resultExpectedStonesLabel: string;
  resultCeilingStonesLabel: string;
  resultOwnedPullsLabel: string;
  resultOwnedProbabilityLabel: string;
  confidenceHeading: string;
  confidenceFormat: string;
  confidenceUnreachable: string;
  unreachable: string;
  pullsFormat: string;
  stonesFormat: string;
  hitsFormat: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const gachaCalculatorContent: Record<
  Locale,
  GachaCalculatorPageContent
> = {
  ja: {
    title: 'ガチャ確率計算機（天井・排出率・必要石数）',
    description:
      '排出率と回数から「N回で1回以上当たる確率」、天井までの期待回数、必要な石数、所持石数で当たる確率を計算できる無料のガチャ確率計算ツールです。50%・90%・99%に届く回数も表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ガチャ確率計算機',
    introHtml:
      '排出率（%）と引く回数を入力すると、1回以上当たる確率を計算します。天井（その回数で必ず排出）や1回あたりの石数を入力すれば、期待回数・必要な石数・所持石数で引ける回数と到達確率も分かります。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。割合や金額の計算には <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税・割引計算機</a> もご利用ください。',
    numberLocale: 'ja-JP',
    rateLabel: '排出率（%）',
    ratePlaceholder: '3',
    pullsLabel: '引く回数',
    pullsPlaceholder: '100',
    ceilingLabel: '天井（回・任意）',
    ceilingPlaceholder: '200',
    costLabel: '1回あたりの石数（任意）',
    costPlaceholder: '3',
    ownedLabel: '所持している石数（任意）',
    ownedPlaceholder: '300',
    error:
      '計算できませんでした（排出率は0〜100%、回数は0以上の整数、天井は1以上の整数、石数は0以上で入力してください）',
    resultHeading: '計算結果',
    resultProbabilityLabel: '指定回数で1回以上当たる確率',
    resultExpectedHitsLabel: '期待排出数（天井は含まない）',
    resultExpectedPullsLabel: '1体出るまでの期待回数',
    resultExpectedStonesLabel: '期待回数に必要な石数',
    resultCeilingStonesLabel: '天井まで引く場合の石数',
    resultOwnedPullsLabel: '所持石数で引ける回数',
    resultOwnedProbabilityLabel: '所持石数で1回以上当たる確率',
    confidenceHeading: '目標の確率に届くまでの回数',
    confidenceFormat: '{pct}%に届くまで: {pulls}',
    confidenceUnreachable: '届きません（排出率が0%です）',
    unreachable: '算出できません（排出率が0%）',
    pullsFormat: '{n}回',
    stonesFormat: '{n}個',
    hitsFormat: '{n}体',
    notesHeading: '注意事項',
    notes: [
      '各回の排出は独立（毎回同じ確率）として計算します。ゲームによっては「確定枠」「ステップアップ」「排出率の変動」などがあり、その場合は実際の確率と異なります。',
      '天井は「入力した回数目で必ず排出される」ものとして扱います。天井後に持ち越しや回数リセットがあるゲームの仕様までは考慮していません。',
      '確率は理論値です。何回引いても当たるとは限らず、「確率が高い＝必ず出る」ではありません。計画的な課金・所持石の管理にご活用ください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '排出率',
        description:
          '1回引いたときに対象のキャラクターやアイテムが出る確率です。「ピックアップ合計3%」のように複数が合算されている場合は、狙う1体あたりの確率を入力してください。',
      },
      {
        term: '天井',
        description:
          '一定回数引いても目的のものが出ない場合に、その回数目で必ず排出される救済仕様です。天井があると、必要な回数・石数に上限ができます。',
      },
      {
        term: '期待回数',
        description:
          '最初の1体が出るまでに引く回数の平均値です。天井がない場合は「1÷排出率」、天井がある場合は天井で打ち切られる分だけ小さくなります。',
      },
    ],
  },
  en: {
    title: 'Gacha Probability Calculator (Pity, Drop Rate & Gems)',
    description:
      'Calculate the chance of at least one drop in N pulls, expected pulls to the pity cap, and the gems you need. Runs in your browser.',
    h1: 'Gacha Probability Calculator',
    introHtml:
      'Enter a drop rate (%) and a number of pulls to see the chance of getting at least one. Add a pity cap (the pull where a drop is guaranteed) and the gem cost per pull, and you also get the expected pulls, the gems you need, and your odds with the gems you currently own. Everything runs in your browser, and nothing you type is sent to a server. For percentages and discounts, try the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Consumption Tax & Discount Calculator</a>.',
    numberLocale: 'en-US',
    rateLabel: 'Drop rate (%)',
    ratePlaceholder: '3',
    pullsLabel: 'Number of pulls',
    pullsPlaceholder: '100',
    ceilingLabel: 'Pity cap (pulls, optional)',
    ceilingPlaceholder: '200',
    costLabel: 'Gems per pull (optional)',
    costPlaceholder: '3',
    ownedLabel: 'Gems you own (optional)',
    ownedPlaceholder: '300',
    error:
      'Could not calculate (drop rate must be 0-100%, pulls a whole number of 0 or more, pity cap a whole number of 1 or more, and gems 0 or more)',
    resultHeading: 'Results',
    resultProbabilityLabel: 'Chance of at least one drop',
    resultExpectedHitsLabel: 'Expected drops (ignoring pity)',
    resultExpectedPullsLabel: 'Expected pulls to the first drop',
    resultExpectedStonesLabel: 'Gems for the expected pulls',
    resultCeilingStonesLabel: 'Gems to reach the pity cap',
    resultOwnedPullsLabel: 'Pulls your gems cover',
    resultOwnedProbabilityLabel: 'Chance with your gems',
    confidenceHeading: 'Pulls needed to reach a target chance',
    confidenceFormat: 'To reach {pct}%: {pulls}',
    confidenceUnreachable: 'Not reachable (the drop rate is 0%)',
    unreachable: 'Cannot be calculated (drop rate is 0%)',
    pullsFormat: '{n} pulls',
    stonesFormat: '{n} gems',
    hitsFormat: '{n} drops',
    notesHeading: 'Notes',
    notes: [
      'Every pull is treated as independent with the same probability. Games with guaranteed slots, step-up banners, or changing rates will differ from the real odds.',
      'The pity cap is treated as "a drop is guaranteed on exactly that pull". Carry-over or reset rules after pity are not modeled.',
      'Probabilities are theoretical. A high chance is not a guarantee, so use the numbers to plan your spending and gem savings.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Drop rate',
        description:
          'The chance of getting the target character or item on a single pull. If a banner lists a combined rate such as "3% total for featured units", enter the rate for the one you are after.',
      },
      {
        term: 'Pity (spark)',
        description:
          'A safety net that guarantees the target after a set number of pulls without it. With pity, both the pulls and the gems you need have a hard upper limit.',
      },
      {
        term: 'Expected pulls',
        description:
          'The average number of pulls until the first drop. Without pity it is 1 divided by the drop rate; with pity it is lower because the run is cut off at the cap.',
      },
    ],
  },
};
