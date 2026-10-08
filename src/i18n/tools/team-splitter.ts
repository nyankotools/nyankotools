import type { Locale } from '../../data/tools';

export interface TeamSplitterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  namesLabel: string;
  namesPlaceholder: string;
  defaultNames: string;
  /** {count} を置換して表示する */
  namesInfo: string;
  modeLabel: string;
  modeTeams: string;
  modeSize: string;
  teamsValueLabel: string;
  sizeValueLabel: string;
  split: string;
  reshuffle: string;
  /** {n} を置換する */
  teamLabel: string;
  /** {count} {teams} を置換して表示する */
  resultSummary: string;
  /** {count} を置換して表示する */
  memberCount: string;
  tooFewNames: string;
  /** {max} を置換して表示する */
  tooManyNames: string;
  /** {min} {max} を置換して表示する */
  teamsValueError: string;
  /** {max} を置換して表示する */
  sizeValueError: string;
  copy: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
}

export const teamSplitterContent: Record<Locale, TeamSplitterPageContent> = {
  ja: {
    title: 'チーム分け・グループ分けツール｜名簿を貼り付けてランダムに振り分け',
    description:
      '名簿を貼り付けて、チーム数または1チームの人数を指定するだけで、ランダムにチーム分け・グループ分けができる無料ツールです。余りは均等に分散、何度でも再シャッフル、結果はコピー可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'チーム分け・グループ分けツール',
    introHtml:
      'クラスの班決め、スポーツやゲームのチーム分け、飲み会の席決めなどに使える、ランダムなグループ分けツールです。名前を1行に1人ずつ貼り付け、チーム数か1チームの人数を指定するだけ。順番決めや1人だけ選びたいときは <a href="/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ルーレット・抽選・サイコロ</a> をご利用ください。',
    namesLabel: '名簿（1行に1人）',
    namesPlaceholder: '名前を1行に1人ずつ入力',
    defaultNames:
      'Aさん\nBさん\nCさん\nDさん\nEさん\nFさん\nGさん\nHさん\nIさん\nJさん',
    namesInfo: '{count}人',
    modeLabel: '分け方',
    modeTeams: 'チーム数で分ける',
    modeSize: '1チームの人数で分ける',
    teamsValueLabel: 'チーム数',
    sizeValueLabel: '1チームの人数',
    split: 'チーム分けする',
    reshuffle: 'もう一度シャッフル',
    teamLabel: 'チーム{n}',
    resultSummary: '{count}人を{teams}チームに分けました',
    memberCount: '{count}人',
    tooFewNames: '名簿には2人以上の名前を入力してください。',
    tooManyNames: '名簿は{max}人までです。',
    teamsValueError:
      'チーム数は{min}〜{max}の整数で、人数以下の値を入力してください。',
    sizeValueError:
      '1チームの人数は1〜{max}の整数で入力してください（全員が1チームになる値は指定できません）。',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '「名簿」に名前を1行に1人ずつ入力・貼り付けます。',
      '「分け方」で、チーム数か1チームの人数を選んで数を入力します。',
      '「チーム分けする」を押すと結果が表示されます。気に入らなければ「もう一度シャッフル」で何度でもやり直せます。',
      '「結果をコピー」で、チームごとの名簿をテキストとしてコピーできます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '乱数にはブラウザの暗号用乱数（crypto.getRandomValues）を使い、偏りが出ないようにシャッフルしています。',
      '人数が割り切れないときは、余りを各チームに1人ずつ振り分けるため、チームの人数の差は最大1人です。「1チームの人数」を指定した場合、人数は目安で、チーム数は切り上げで決まります（例: 10人を3人ずつ→3・3・2・2人の4チーム）。',
      '名簿は最大200人、チーム数は最大100までです。同じ名前が複数行にあっても、別の人として1人ずつ数えます。',
      '特定の人同士を同じチームにする・別のチームにする、といった条件指定には対応していません。',
      '名簿は個人名を含むため、ブラウザ内だけで処理し、サーバーには送信しません。',
    ],
  },
  en: {
    title: 'Random Team Generator – Split a Name List Into Teams',
    description:
      'Paste a name list and split it into random teams by team count or size. Reshuffle and copy the result. Runs in your browser; nothing is sent to a server.',
    h1: 'Random Team Generator',
    introHtml:
      'Make teams for a class, a sports match, a game night or a workshop. Paste one name per line, choose how many teams you want or how many people per team, and split. To pick just one person or decide the order, try the <a href="/en/tools/roulette-dice/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Roulette, Random Picker &amp; Dice Roller</a>.',
    namesLabel: 'Names (one per line)',
    namesPlaceholder: 'Enter one name per line',
    defaultNames:
      'Alice\nBob\nCarol\nDave\nEve\nFrank\nGrace\nHeidi\nIvan\nJudy',
    namesInfo: '{count} name(s)',
    modeLabel: 'Split by',
    modeTeams: 'Number of teams',
    modeSize: 'People per team',
    teamsValueLabel: 'Number of teams',
    sizeValueLabel: 'People per team',
    split: 'Split into teams',
    reshuffle: 'Shuffle again',
    teamLabel: 'Team {n}',
    resultSummary: '{count} people split into {teams} teams',
    memberCount: '{count} people',
    tooFewNames: 'Enter at least 2 names.',
    tooManyNames: 'You can enter up to {max} names.',
    teamsValueError:
      'Enter a whole number of teams from {min} to {max}, no larger than the number of names.',
    sizeValueError:
      'Enter a whole number of people per team from 1 to {max}. A size that would put everyone in one team is not allowed.',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Type or paste the names into the list, one per line.',
      'Under "Split by", choose number of teams or people per team and enter a number.',
      'Press "Split into teams" to see the result. Press "Shuffle again" as often as you like.',
      'Use "Copy result" to copy each team’s members as plain text.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Names are shuffled with your browser’s cryptographic generator (crypto.getRandomValues), without bias.',
      'When the names do not divide evenly, the leftovers are spread one per team, so team sizes differ by at most one. With "People per team", the number is a target and the team count is rounded up (for example, 10 people at 3 per team gives four teams of 3, 3, 2 and 2).',
      'Up to 200 names and 100 teams are supported. Duplicate names on separate lines are treated as separate people.',
      'Constraints such as keeping certain people together or apart are not supported.',
      'A name list can contain personal data, so it is processed only in your browser and never sent to a server.',
    ],
  },
};
