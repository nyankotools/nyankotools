import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ライフゲームのルールを教えてください',
      answer:
        '生きたセルは、周囲8マスの生きたセルが2個または3個なら次の世代も生き残り、それ以外（0〜1個は過疎、4個以上は過密）では死にます。死んだセルは、周囲の生きたセルがちょうど3個なら誕生します。このツールはこの標準ルール（B3/S23）で動きます。',
    },
    {
      question: '再生が勝手に止まってしまいます',
      answer:
        'すべてのセルが死滅したときと、盤面がまったく変化しなくなった（静物だけになった）ときは、再生を自動で停止します。ブリンカーやグライダーのように動き続けるパターンは止まりません。「端をつなげる」をオンにすると、宇宙船が端で崩れずに動き続けます。',
    },
    {
      question: '端をつなげる（ループ）とは何ですか？',
      answer:
        '盤面の右端と左端、上端と下端をつなげて、端のないドーナツ状（トーラス）の盤面にする設定です。オフのときは盤面の外は常に死んだ状態として扱われるため、グライダーは端に当たると小さな静物に変わって止まります。',
    },
    {
      question: '盤面を保存したり、他の人に共有したりできますか？',
      answer:
        'できません。配置はブラウザ上だけに存在し、サーバーにも保存されないため、ページを再読み込みすると消えます。気に入った配置はスクリーンショットなどで残してください。',
    },
    {
      question: 'グライダー銃を置くと盤面が広がったのはなぜですか？',
      answer:
        'グライダー銃は幅が36マスあり、「小（30×20）」の盤面には収まりません。そのため、パターンを置くときに盤面を自動で「標準」に広げています。',
    },
  ],
  en: [
    {
      question: 'What are the rules of the Game of Life?',
      answer:
        'A live cell survives to the next generation if two or three of its eight neighbors are alive; otherwise it dies of loneliness (0–1) or overcrowding (4+). A dead cell becomes alive if exactly three neighbors are alive. This tool uses these standard rules (B3/S23).',
    },
    {
      question: 'Why does playback stop on its own?',
      answer:
        'Playback stops automatically when every cell has died or when the board no longer changes (only still lifes remain). Patterns that keep moving, such as blinkers and gliders, never stop. Turn on "Wrap around edges" so spaceships keep travelling instead of crashing at the border.',
    },
    {
      question: 'What does "Wrap around edges" do?',
      answer:
        'It joins the left edge to the right and the top to the bottom so the board becomes a torus with no edges. When it is off, everything outside the board is dead, so a glider that reaches the border collapses into a small still life.',
    },
    {
      question: 'Can I save or share my board?',
      answer:
        'No. The layout only exists in your browser and is not stored anywhere, so reloading the page clears it. Take a screenshot if you want to keep one.',
    },
    {
      question: 'Why did the board get larger when I placed the glider gun?',
      answer:
        'The Gosper glider gun is 36 cells wide and does not fit on the "Small (30×20)" board, so the board is switched to Medium automatically when you place it.',
    },
  ],
};
