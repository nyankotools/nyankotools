export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export const tools: Tool[] = [
  {
    slug: 'char-counter',
    name: '文字数カウント',
    description:
      '入力したテキストの文字数・単語数・行数をリアルタイムで数えます。',
    category: 'テキスト',
  },
];
