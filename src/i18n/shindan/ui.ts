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
