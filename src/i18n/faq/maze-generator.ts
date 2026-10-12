import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '作った迷路には必ず正解のルートがありますか？',
      answer:
        'はい。作られる迷路はどのマスにも到達でき、スタート（左上）からゴール（右下）までの道がちょうど1本だけの「完全迷路」です。行き止まりに入らなければ迷わず進め、「解答を表示」で正解ルートを確認できます。',
    },
    {
      question: '難易度はどうやって変わりますか？',
      answer:
        '作り方（アルゴリズム）を変えています。「かんたん」は下か右へ進めばゴールに着く偏った迷路、「ふつう」は短い行き止まりが多い標準的な迷路、「むずかしい」は長くうねる道が続く迷路です。マス数を増やすとさらに難しくなります。',
    },
    {
      question: '解答つきと解答なしの2種類を印刷するには？',
      answer:
        '「解答を表示」をオフにして印刷し、そのままオンに切り替えて印刷すると、同じ迷路の問題用紙と解答用紙を作れます。「迷路を作る」を押すと別の迷路になるため、2回の印刷の間は押さないでください。',
    },
    {
      question: '印刷すると線が薄い、または切れてしまいます',
      answer:
        '印刷は迷路を用紙の幅いっぱいに拡大します。線が薄い場合はブラウザの印刷ダイアログで余白を小さくするか、用紙の向きを迷路の形に合わせてください。マス数が多いほど線が細く見えるため、読みづらいときは10×10〜20×20程度にするか、PNG画像で保存して他のソフトで印刷してください。',
    },
    {
      question: '同じ迷路をあとからもう一度作れますか？',
      answer:
        '作れません。迷路は毎回ランダムに作られ、乱数の種を保存していません。残しておきたい迷路はPNG画像として保存するか、印刷してください。',
    },
  ],
  en: [
    {
      question: 'Is there always a solution?',
      answer:
        'Yes. Every maze is a "perfect" maze: all cells are reachable and there is exactly one route from the start (top-left) to the goal (bottom-right). Tick "Show solution" to see that route.',
    },
    {
      question: 'How does the difficulty setting work?',
      answer:
        'It changes the generation algorithm. Easy is biased so that moving only down and right reaches the goal; Normal has many short dead ends; Hard has long winding corridors. A larger grid makes any level harder.',
    },
    {
      question: 'How do I print a worksheet and an answer sheet?',
      answer:
        'Print with "Show solution" off, then tick it and print again to get the answer sheet of the same maze. Do not press "Generate maze" between the two prints, because that creates a different maze.',
    },
    {
      question: 'My printout has faint or cut-off lines. What can I do?',
      answer:
        'Printing scales the maze to the page width. Reduce the margins in your browser’s print dialog and match the page orientation to the maze shape. Very large grids have thin passages; try about 10×10 to 20×20, or save a PNG and print it from another app.',
    },
    {
      question: 'Can I recreate the same maze later?',
      answer:
        'No. Each maze is random and no seed is stored. If you want to keep one, save it as a PNG or print it.',
    },
  ],
};
