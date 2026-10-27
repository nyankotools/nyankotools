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
  /** 静的テキスト「診断の仕組み」 */
  howItWorks: string[];
  /** 投稿文に付けるハッシュタグ（# なし） */
  shareHashtags: string[];
};
