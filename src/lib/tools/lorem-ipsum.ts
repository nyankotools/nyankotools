export type LoremUnit = 'paragraphs' | 'sentences' | 'words';

export type LoremOptions =
  | {
      language: 'latin';
      unit: LoremUnit;
      /** 生成する段落・文・単語の個数（1〜200） */
      count: number;
      /** 定番の書き出し文（Lorem ipsum dolor sit amet...）から始める */
      fixedOpening: boolean;
    }
  | {
      language: 'ja';
      /** 日本語は「単語」の区切りが不自然なため段落・文のみ対応 */
      unit: Exclude<LoremUnit, 'words'>;
      count: number;
      /** 定番の書き出し文（これはダミーテキストです。）から始める */
      fixedOpening: boolean;
    };

const MIN_COUNT = 1;
const MAX_COUNT = 200;
const DEFAULT_COUNT = 3;

export function clampLoremCount(count: number): number {
  if (!Number.isFinite(count)) return DEFAULT_COUNT;
  return Math.min(Math.max(Math.trunc(count), MIN_COUNT), MAX_COUNT);
}

const LATIN_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
] as const;

const LATIN_OPENING =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

/** 意味を持たない、レイアウト確認用の日本語ダミー文のプール */
const JA_SENTENCES = [
  'この文章はダミーテキストです。',
  '実際の内容とは関係ありません。',
  'レイアウトや文字組みを確認するために使用します。',
  '文字の大きさや行間の見え方をチェックするサンプルです。',
  '本文の分量を変えながらデザインを調整できます。',
  '見出しや段落の区切りを試すのにも便利です。',
  '原稿が用意できるまでの仮置き用としてお使いください。',
  '改行の扱いや文字コードの確認にも役立ちます。',
  'テンプレートの見た目を確かめるための素材です。',
  'カフェの窓際の席で、静かに雨を眺めていた。',
  '駅前の商店街は、今日も人通りが多かった。',
  '本棚の整理をしていたら、懐かしい写真が出てきた。',
  '週末は近所の公園を散歩するのが日課になっている。',
  '新しく買った靴が、思ったより歩きやすかった。',
  '朝早くに目が覚めたので、いつもより長く散歩した。',
  '図書館で借りた本を、電車の中で読み進めた。',
  '台所からコーヒーの香りが漂ってきた。',
  '庭の木々が、少しずつ色づき始めている。',
  '会議の資料を、前日のうちに準備しておいた。',
  '古い時計の針は、いつの間にか止まっていた。',
  '休日は特に予定を入れず、のんびり過ごすことにした。',
  '新しいノートを開くときは、少し気持ちが引き締まる。',
  '夕方になると、空の色が少しずつ変わっていった。',
  '駅までの道のりを、いつもより少し遠回りして歩いた。',
  '机の上を片付けたら、作業がしやすくなった。',
  '雨上がりの空気は、どこか清々しく感じられた。',
  '長い会議の後は、熱いお茶が恋しくなる。',
  '本のページをめくる音だけが、部屋に響いていた。',
  '窓の外では、風が木の葉を揺らしていた。',
  '新しい年度が始まり、身の回りを整理し始めた。',
] as const;

const JA_OPENING = JA_SENTENCES[0];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(pool: readonly T[]): T {
  return pool[randomInt(0, pool.length - 1)];
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildLatinSentence(): string {
  const words = Array.from({ length: randomInt(6, 14) }, () =>
    pickRandom(LATIN_WORDS),
  );
  return `${capitalize(words.join(' '))}.`;
}

function buildLatinParagraph(): string {
  return Array.from({ length: randomInt(3, 6) }, () =>
    buildLatinSentence(),
  ).join(' ');
}

function buildJaParagraph(): string {
  return Array.from({ length: randomInt(3, 6) }, () =>
    pickRandom(JA_SENTENCES),
  ).join('');
}

function generateLatin(
  options: Extract<LoremOptions, { language: 'latin' }>,
): string {
  const count = clampLoremCount(options.count);

  if (options.unit === 'words') {
    const words = Array.from({ length: count }, () => pickRandom(LATIN_WORDS));
    if (options.fixedOpening) {
      const openingWords = LATIN_OPENING.replace(/\.$/, '').split(' ');
      const rest = words.slice(openingWords.length);
      return `${capitalize([...openingWords, ...rest].join(' '))}.`;
    }
    return `${capitalize(words.join(' '))}.`;
  }

  if (options.unit === 'sentences') {
    const sentences = Array.from({ length: count }, () => buildLatinSentence());
    if (options.fixedOpening) sentences[0] = LATIN_OPENING;
    return sentences.join(' ');
  }

  const paragraphs = Array.from({ length: count }, () => buildLatinParagraph());
  if (options.fixedOpening) {
    paragraphs[0] = `${LATIN_OPENING} ${paragraphs[0]}`;
  }
  return paragraphs.join('\n\n');
}

function generateJa(
  options: Extract<LoremOptions, { language: 'ja' }>,
): string {
  const count = clampLoremCount(options.count);

  if (options.unit === 'sentences') {
    const sentences = Array.from({ length: count }, () =>
      pickRandom(JA_SENTENCES),
    );
    if (options.fixedOpening) sentences[0] = JA_OPENING;
    return sentences.join('');
  }

  const paragraphs = Array.from({ length: count }, () => buildJaParagraph());
  if (options.fixedOpening) {
    paragraphs[0] = `${JA_OPENING}${paragraphs[0]}`;
  }
  return paragraphs.join('\n\n');
}

/** ダミーテキスト（Lorem ipsum / 日本語版）を生成する */
export function generateLoremIpsum(options: LoremOptions): string {
  return options.language === 'latin'
    ? generateLatin(options)
    : generateJa(options);
}
