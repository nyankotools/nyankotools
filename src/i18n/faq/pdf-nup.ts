import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '2in1と4in1では、用紙の向きはどうなりますか？',
      answer:
        '「自動」を選ぶと、2・6・8ページは横向き、4・9ページは縦向きの用紙になります。縦向きの用紙に2ページを上下に並べたいときなどは、用紙の向きを手動で指定してください。',
    },
    {
      question: 'ページが用紙いっぱいに拡大されないのはなぜですか？',
      answer:
        '各ページは縦横比を保ったまま、割り当てられた枠に収まる大きさに縮小して中央に置きます。枠と縦横比が違うと上下または左右に余白ができます。余白と間隔を0ptにすると、より大きく配置できます。',
    },
    {
      question: '横方向と縦方向の並び順はどう違いますか？',
      answer:
        '横方向は左上から右へ、次の段へと進む順（Z字）で、縦方向は左の列を上から下へ、次の列へと進む順（N字）です。通常の資料は横方向、縦に読み進める資料は縦方向が合います。',
    },
    {
      question: '縦横が混在するPDFや回転されたページはどうなりますか？',
      answer:
        '各ページの向きを保ったまま、それぞれの枠に収まるよう縮小して配置します。回転が設定されたページも、画面で見える向きのまま割り付けます。',
    },
  ],
  en: [
    {
      question: 'Which paper orientation is used for 2-up and 4-up?',
      answer:
        'With Auto, 2-up, 6-up and 8-up use landscape paper, while 4-up and 9-up use portrait. To stack two pages vertically on portrait paper, for example, set the orientation manually.',
    },
    {
      question: 'Why are the pages not enlarged to fill the sheet?',
      answer:
        'Each page is scaled down to fit its slot while keeping the aspect ratio, and centered. If the shapes differ, there is blank space above/below or beside it. Setting margin and gap to 0 pt lets pages be placed larger.',
    },
    {
      question: 'What is the difference between the two page orders?',
      answer:
        '"Across" fills the top row from left to right and then moves to the next row. "Down" fills the left column from top to bottom and then moves to the next column. Use Across for most documents, and Down for material read in columns.',
    },
    {
      question: 'What happens with mixed page sizes or rotated pages?',
      answer:
        'Each page keeps its own orientation and is scaled to fit its slot. Pages with a rotation setting are placed the way you see them on screen.',
    },
  ],
};
