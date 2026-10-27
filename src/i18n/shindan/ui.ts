/** 診断セクション共通の文言（日本語先行。設計書15章5） */
import type { Rarity } from '../../lib/shindan/types';

export const shindanUiJa = {
  sectionName: 'にゃんこ診断',
  sectionDescription:
    '質問に答えるだけで楽しめる、にゃんこツールの診断コーナーです。入力内容と診断結果は送信されません。',
  toolsLink: 'ツール一覧へ',
  themesHeading: '診断一覧',
  start: '診断をはじめる',
  nameLabel: '名前（任意）',
  nameHint:
    '入力すると称号などのバリエーションが変わります（猫のタイプは変わりません）。名前は送信も保存もされません。',
  questionCount: '全{total}問',
  progress: '質問 {current} / {total}',
  remaining: 'あと{n}問',
  back: '1つ前に戻る',
  analyzing: '分析中…',
  resultFor: '{name}さんの結果',
  resultDefault: 'あなたの結果',
  typeIs: 'あなたを猫に例えると「{type}」タイプ',
  rarityRate: '出現率 {rate}%（診断上の設計値）',
  axesHeading: '4つの傾向',
  typeHeading: 'タイプの特徴',
  strengthsHeading: 'あなたの強み',
  hiddenHeading: '隠れた一面',
  quoteHeading: 'あなたへのひとこと',
  luckyItem: 'ラッキーアイテム',
  luckyAction: 'ラッキーアクション',
  retry: '最初からもう一度診断する',
  sharedResultFor: '友達の結果',
  sharedTypeIs: '猫に例えると「{type}」タイプ',
  sharedLead: '友達から共有された診断結果です。',
  tryYourself: 'あなたも診断してみる',
  shareHeading: '結果をシェア',
  shareNote:
    'シェアするURLを開くと、同じ結果が表示されます。名前はURLに含まれません。',
  cardShapeLabel: '画像の形',
  cardShapeLandscape: '横長（X・LINE向け）',
  cardShapePortrait: '縦長（スマホ向け）',
  cardNameLabel: '画像に名前を載せる',
  cardAlt: '結果のシェア用画像',
  cardGenerating: '画像を作成中…',
  cardFailed: '画像を作成できませんでした。',
  inAppHint:
    'アプリ内のブラウザでは保存できないことがあります。画像を長押しして保存するか、ブラウザで開き直してください。',
  shareImage: '画像付きでシェア',
  shareX: 'Xでポスト',
  shareLine: 'LINEで送る',
  copyUrl: 'URLをコピー',
  copied: 'URLをコピーしました',
  copyFailed: 'コピーできませんでした',
  saveImage: '画像を保存',
  cardSite: 'nyankotools.com',
  /** 投稿文（レア度ごとに数種類から結果で決まる）。{title} {type} {rarity} {label} {rate} を置き換える */
  shareTexts: {
    N: [
      '猫タイプ診断の結果は「{title}」。王道の{type}タイプでした🐾',
      'わたしを猫に例えると{type}。王道をいく「{title}」です🐱',
      '「{title}」になりました。安心と信頼の王道{type}タイプ🐾',
    ],
    R: [
      '猫タイプ診断で「{title}」に。個性派の【R】でした🐾',
      'わたしを猫に例えると{type}。個性が光る「{title}」です🐱',
      '個性派【R】の「{title}」が出ました🐾 {type}タイプです',
    ],
    SR: [
      '猫タイプ診断で注目株【SR】の「{title}」が出ました✨',
      'わたしを猫に例えると{type}。注目株の「{title}」です✨',
      '【SR】「{title}」になりました🐾 {type}タイプです',
    ],
    SSR: [
      '猫タイプ診断で【SSR】「{title}」が出ました✨（設計上の出現率{rate}%）',
      'わたしを猫に例えると{type}。人気者【SSR】の「{title}」です✨',
      '人気者【SSR】の「{title}」になりました🐾 {type}タイプ',
    ],
    UR: [
      '猫タイプ診断で稀少な【UR】「{title}」が出ました🌈（設計上の出現率{rate}%）',
      'わたしを猫に例えると{type}。稀少【UR】の「{title}」です🌈',
      '【UR】「{title}」に出会いました🌈 {type}タイプです',
    ],
    LR: [
      '猫タイプ診断で伝説の【LR】「{title}」が出ました👑（設計上の出現率{rate}%）',
      'わたしを猫に例えると{type}。伝説【LR】の「{title}」です👑',
      '伝説の【LR】「{title}」になりました👑 {type}タイプ',
    ],
  } satisfies Record<Rarity, string[]>,
  resultNote:
    'エンタメ目的の診断で、医学的・心理学的な診断ではありません。出現率は診断上の設計値です。',
  howItWorksHeading: '診断の仕組み',
  typesHeading: '16タイプの猫',
  disclaimerHeading: 'ご注意',
  disclaimers: [
    'エンタメ目的の診断で、医学的・心理学的な診断ではありません。',
    '猫種の性格は一般的なイメージによるもので、実際の猫には個体差があります。猫種やタイプに優劣はありません。',
    '出現率は診断上の設計値です。',
    '画像は仮のイラストです。',
  ],
  rarityLabels: {
    N: '王道',
    R: '個性派',
    SR: '注目株',
    SSR: '人気者',
    UR: '稀少',
    LR: '伝説',
  } satisfies Record<Rarity, string>,
};

export type ShindanUi = typeof shindanUiJa;
