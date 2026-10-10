import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssLayoutGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  modeLabel: string;
  modeFlex: string;
  modeGrid: string;
  itemCountLabel: string;
  directionLabel: string;
  wrapLabel: string;
  justifyContentLabel: string;
  alignItemsLabel: string;
  alignItemsGridLabel: string;
  alignContentLabel: string;
  gapLabel: string;
  columnsLabel: string;
  rowsLabel: string;
  rowsHint: string;
  columnGapLabel: string;
  rowGapLabel: string;
  justifyItemsLabel: string;
  previewHeading: string;
  cssHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssLayoutGeneratorContent: Record<
  Locale,
  CssLayoutGeneratorPageContent
> = {
  ja: {
    title: 'CSS Flexbox/Gridジェネレーター（プレビュー付き）',
    description:
      'justify-content・align-items・gap・列数などを選ぶだけで、CSSのFlexboxとGridレイアウトをプレビューしながら生成できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSS Flexbox/Gridジェネレーター',
    introHtml:
      'FlexboxとGridを切り替えながら、方向・折り返し・揃え方・間隔・列数を選ぶと、プレビューの配置と生成されるCSSがリアルタイムに更新されます。アイテム数を変えて、折り返しや余白の挙動も確認できます。生成したCSSはコピーボタンでそのまま貼り付けられます。装飾には <a href="/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS box-shadowジェネレーター</a> や <a href="/tools/css-gradient-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSSグラデーションジェネレーター</a> もあわせてご利用ください。',
    modeLabel: 'レイアウト方式',
    modeFlex: 'Flexbox',
    modeGrid: 'Grid',
    itemCountLabel: 'アイテム数',
    directionLabel: 'flex-direction（並べる方向）',
    wrapLabel: 'flex-wrap（折り返し）',
    justifyContentLabel: 'justify-content（主軸方向の揃え）',
    alignItemsLabel: 'align-items（交差軸方向の揃え）',
    alignItemsGridLabel: 'align-items（縦方向の揃え）',
    alignContentLabel: 'align-content（複数行の揃え）',
    gapLabel: 'gap（間隔・px）',
    columnsLabel: '列数',
    rowsLabel: '行数',
    rowsHint: '0にすると行数を指定せず、アイテム数に応じて自動で増えます。',
    columnGapLabel: '列の間隔（px）',
    rowGapLabel: '行の間隔（px）',
    justifyItemsLabel: 'justify-items（横方向の揃え）',
    previewHeading: 'プレビュー',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'プレビューのアイテムは、揃え方の違いが分かるように大きさをあえて不揃いにしています。実際の要素の大きさによって見え方は変わります。',
      'align-content は、flex-wrap が wrap / wrap-reverse で複数行になる場合にのみ効果があるため、nowrap のときは出力されません。',
      'Gridの列・行は repeat(n, 1fr) による等幅の指定です。列幅を細かく変えたい場合は、生成されたCSSの grid-template-columns を直接書き換えてください。',
      'セレクタは .container 固定です。ご利用のクラス名に置き換えてお使いください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Flexbox',
        description:
          '要素を一方向（横または縦）に並べるためのレイアウト方式。親要素に`display: flex`を指定し、子要素の並び・揃え・間隔を制御する。',
      },
      {
        term: 'Grid',
        description:
          '行と列の格子状に要素を配置するレイアウト方式。親要素に`display: grid`を指定し、`grid-template-columns`などで格子を定義する。',
      },
      {
        term: '主軸と交差軸',
        description:
          'Flexboxで要素が並ぶ向きを主軸、それと直交する向きを交差軸と呼ぶ。`justify-content`は主軸、`align-items`は交差軸の揃えを決める。',
      },
      {
        term: 'fr',
        description:
          'Gridで使う「残りの空間に対する比率」の単位。`repeat(3, 1fr)`は同じ幅の3列を意味する。',
      },
      {
        term: 'gap',
        description:
          'FlexboxやGridでアイテム同士の間隔を指定するプロパティ。外側の余白は含まず、アイテムの間にだけ適用される。',
      },
    ],
  },
  en: {
    title: 'CSS Flexbox & Grid Layout Generator with Live Preview',
    description:
      'Pick justify-content, align-items, gap, columns and more to generate Flexbox or Grid CSS with a live preview, then copy it. Runs in your browser.',
    h1: 'CSS Flexbox & Grid Layout Generator',
    introHtml:
      'Switch between Flexbox and Grid, then choose the direction, wrapping, alignment, gap and columns — the preview and the generated CSS update instantly. Change the number of items to see how wrapping and spacing behave. Copy the CSS and paste it straight into your stylesheet. For styling the boxes themselves, try the <a href="/en/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Box-Shadow Generator</a> and the <a href="/en/tools/css-gradient-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Gradient Generator</a>.',
    modeLabel: 'Layout type',
    modeFlex: 'Flexbox',
    modeGrid: 'Grid',
    itemCountLabel: 'Number of items',
    directionLabel: 'flex-direction',
    wrapLabel: 'flex-wrap',
    justifyContentLabel: 'justify-content (main axis)',
    alignItemsLabel: 'align-items (cross axis)',
    alignItemsGridLabel: 'align-items (vertical)',
    alignContentLabel: 'align-content (multiple lines)',
    gapLabel: 'gap (px)',
    columnsLabel: 'Columns',
    rowsLabel: 'Rows',
    rowsHint: 'Set 0 to leave rows unspecified; they grow with the item count.',
    columnGapLabel: 'Column gap (px)',
    rowGapLabel: 'Row gap (px)',
    justifyItemsLabel: 'justify-items (horizontal)',
    previewHeading: 'Preview',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'The preview items are intentionally uneven in size so alignment differences are easy to see. Real results depend on the size of your own elements.',
      'align-content only has an effect when flex-wrap is wrap or wrap-reverse and the items form multiple lines, so it is omitted for nowrap.',
      'Grid columns and rows use equal-width repeat(n, 1fr). To vary track widths, edit grid-template-columns in the generated CSS by hand.',
      'The selector is fixed to .container. Replace it with your own class name.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Flexbox',
        description:
          'A layout model that arranges items along one direction (row or column). Set `display: flex` on the parent to control the order, alignment and spacing of its children.',
      },
      {
        term: 'Grid',
        description:
          'A layout model that places items on rows and columns. Set `display: grid` on the parent and define the tracks with `grid-template-columns` and similar properties.',
      },
      {
        term: 'Main axis and cross axis',
        description:
          'In Flexbox, the main axis is the direction items are laid out and the cross axis is perpendicular to it. `justify-content` aligns along the main axis, `align-items` along the cross axis.',
      },
      {
        term: 'fr',
        description:
          'A Grid unit meaning a share of the remaining space. `repeat(3, 1fr)` creates three equal-width columns.',
      },
      {
        term: 'gap',
        description:
          'The property that sets spacing between items in Flexbox and Grid. It applies only between items, not around the outer edge.',
      },
    ],
  },
};
