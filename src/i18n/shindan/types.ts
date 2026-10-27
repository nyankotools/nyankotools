/**
 * 診断テーマの文言。構造データ（src/data/themes/*.ts）のIDから引く。
 * seed は文言を使わないので、ここを直しても結果（タイプ・部品の選択）は変わらない。
 */
export type ShindanThemeTexts = {
  /** 診断名（一覧・パンくず） */
  name: string;
  /** <title>（サイト名は Layout が付ける） */
  title: string;
  description: string;
  h1: string;
  intro: string;
  axes: Record<string, { label: string; plus: string; minus: string }>;
  questions: Record<string, { text: string; choices: Record<string, string> }>;
  types: Record<
    string,
    {
      name: string;
      /** 称号に組み込むときの短い名前 */
      shortName: string;
      description: string;
    }
  >;
  /** スロットID → 部品ID → 文言 */
  parts: Record<string, Record<string, string>>;
  /** 相性（16.9）。文言は全て肯定的にする（P2） */
  compat: {
    /** 極が一致した軸の数（0〜軸数）ごとの関係タイプ。コメントは2人の結果で1つ選ぶ */
    relations: { name: string; comments: string[] }[];
    /** 回答が完全一致した相手（100%） */
    twins: { name: string; comments: string[] };
    /** ベストパートナー猫の説明 */
    partnerNote: string;
  };
  /** 静的テキスト「診断の仕組み」 */
  howItWorks: string[];
  /** 投稿文に付けるハッシュタグ（# なし） */
  shareHashtags: string[];
};
