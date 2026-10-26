import type { Locale } from '../../data/tools';
import type { IllusionId } from '../../lib/tools/optical-illusions';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface IllusionText {
  name: string;
  /** 見え方 */
  look: string;
  /** 実際はどうなっているか */
  truth: string;
}

export interface OpticalIllusionsPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  illusionLabel: string;
  nextButton: string;
  guidesLabel: string;
  hideInducersLabel: string;
  strengthLabel: string;
  strengthUnused: string;
  lookHeading: string;
  truthHeading: string;
  /** 図の読み上げ用。{name} を置換する */
  figureLabel: string;
  illusions: Record<IllusionId, IllusionText>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const opticalIllusionsContent: Record<
  Locale,
  OpticalIllusionsPageContent
> = {
  ja: {
    title: '錯視ギャラリー｜ミュラー・リヤーなど定番の錯視を試せる',
    description:
      'ミュラー・リヤー、ポンゾ、カフェウォールなど定番の錯視9種を表示。補助線の表示や強さの調整で「実は同じ・平行」を確かめられます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '錯視ギャラリー｜補助線で「実は同じ・平行」を確かめる',
    introHtml:
      '長さが違って見える線、曲がって見える平行線など、定番の錯視を9種類そろえました。補助線を出したり、錯視の要因を隠したりして、目の錯覚だと確かめてみてください。点滅や高速な動きは使っていません。色のしくみを調べるなら <a href="/tools/contrast-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">コントラスト比チェッカー</a>、記憶力を試すなら <a href="/tools/memory-match/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">神経衰弱</a> もどうぞ。',
    howToHeading: '使い方',
    howToSteps: [
      '「錯視」で見たい図を選びます。「次の錯視」で順番に切り替えることもできます。',
      'まず補助のない状態で、線の長さや平行かどうかを目で判断してみます。',
      '「補助線を表示」をオンにすると、実際に長さが同じ・平行であることが確かめられます。',
      '「錯視の要因を隠す」で錯視を起こす部分を消したり、「強さ」で効き具合を変えたりして、見え方の違いを比べます。',
    ],
    illusionLabel: '錯視',
    nextButton: '次の錯視',
    guidesLabel: '補助線を表示',
    hideInducersLabel: '錯視の要因を隠す',
    strengthLabel: '強さ',
    strengthUnused: 'この錯視では強さを変えられません。',
    lookHeading: '見え方：',
    truthHeading: '実際は：',
    figureLabel: '錯視の図：{name}',
    illusions: {
      'muller-lyer': {
        name: 'ミュラー・リヤー錯視',
        look: '上の線（矢じり形）より、下の線（矢羽根形）のほうが長く見えます。',
        truth:
          '2本の線の長さはまったく同じです。補助線で両端の位置がそろっていることを確かめられます。',
      },
      ponzo: {
        name: 'ポンゾ錯視',
        look: '奥へ収束する2本の線の間では、上にある横棒のほうが長く見えます。',
        truth:
          '2本の横棒は同じ長さです。遠近法の手がかりがあると、奥にあるものを大きく見積もってしまいます。',
      },
      zollner: {
        name: 'ツェルナー錯視',
        look: '短い斜線が付いた横線が、互いに傾いているように見えます。',
        truth:
          '4本の長い線は完全に平行です。要因を隠すと、まっすぐ平行であることがよく分かります。',
      },
      ebbinghaus: {
        name: 'エビングハウス錯視',
        look: '大きい円に囲まれた中央の円は小さく、小さい円に囲まれたほうは大きく見えます。',
        truth:
          '中央の2つのオレンジの円は同じ大きさです。補助線は上下の接線を示します。',
      },
      'cafe-wall': {
        name: 'カフェウォール錯視',
        look: '白と黒のタイルを半端にずらして並べると、灰色の目地が斜めに傾いて見えます。',
        truth:
          '目地は水平でまっすぐです。補助線を重ねるか、強さを0にするとそれが分かります。',
      },
      'checker-shadow': {
        name: 'チェッカーシャドウ錯視',
        look: '影の中のマスAは、影の外のマスBよりずっと明るく見えます。',
        truth:
          'AとBは同じ灰色です。補助線の帯をつなぐと、色が同じだと確かめられます。脳は影の影響を差し引いて明るさを判断するためです。',
      },
      'hermann-grid': {
        name: 'ヘルマン格子錯視',
        look: '白い隙間の交差点に、ぼんやりした灰色の点が見えます。',
        truth:
          '交差点の色は隙間の部分と同じ白です。目を向けた交差点では点が消えます。',
      },
      poggendorff: {
        name: 'ポッゲンドルフ錯視',
        look: '板に隠された斜線の右側が、左側の延長線よりずれているように見えます。',
        truth:
          '左右の線は完全に一直線です。補助線を出すと、板の向こうでぴったりつながることが分かります。',
      },
      'fraser-spiral': {
        name: 'フレーザー錯視（渦巻き）',
        look: '同心円なのに、渦を巻いた螺旋のように見えます。',
        truth:
          '4つとも真円の同心円です。補助線の円をなぞると、渦に見える部分も円周上にあることが分かります。',
      },
    },
    notesHeading: '注意事項',
    notes: [
      '図はすべてこのページ内でSVGとして描いています。画像の読み込みや通信はなく、サーバーには何も送信されません。',
      '光過敏への配慮として、点滅や高速な動きは使っていません。見ていて気分が悪くなったら、無理せず画面から目を離してください。',
      '見え方には個人差があり、画面の大きさや明るさ、視聴距離でも変わります。錯視が強く感じられない場合もあります。',
      '錯視は目や脳の自然なしくみによるもので、視力や病気の診断には使えません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '錯視',
        description:
          '実際の大きさ・長さ・向き・明るさと違って見える、視覚の錯覚です。目や脳が周囲の情報から補正しようとする自然な働きによって起きるとされます。',
      },
    ],
  },
  en: {
    title: 'Optical Illusions Gallery – Interactive Visual Illusions',
    description:
      'Try 9 classic optical illusions, including Müller-Lyer and café wall. Toggle guide lines to see what is really equal or parallel. Runs in your browser.',
    h1: 'Optical Illusions Gallery – See What Is Really Equal or Parallel',
    introHtml:
      'Lines that look unequal, parallel lines that seem to bend: here are nine classic illusions. Show guide lines or hide the part that causes the effect to prove that your eyes are being fooled. There is no flashing or fast motion. For color and perception, you might also like the <a href="/en/tools/contrast-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Contrast Checker</a> or <a href="/en/tools/memory-match/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Memory Match</a>.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick a figure in "Illusion". "Next illusion" cycles through them in order.',
      'First, judge by eye which lines are longer, or whether they are parallel.',
      'Turn on "Show guide lines" to confirm that they really are equal or parallel.',
      'Use "Hide illusion cause" to remove what triggers the effect, or "Strength" to change how strong it is, and compare.',
    ],
    illusionLabel: 'Illusion',
    nextButton: 'Next illusion',
    guidesLabel: 'Show guide lines',
    hideInducersLabel: 'Hide illusion cause',
    strengthLabel: 'Strength',
    strengthUnused: 'Strength cannot be changed for this illusion.',
    lookHeading: 'What you see: ',
    truthHeading: 'What is true: ',
    figureLabel: 'Optical illusion: {name}',
    illusions: {
      'muller-lyer': {
        name: 'Müller-Lyer illusion',
        look: 'The bottom line (with outward fins) looks longer than the top one (with arrowheads).',
        truth:
          'Both lines have exactly the same length. The guide lines show that their ends line up.',
      },
      ponzo: {
        name: 'Ponzo illusion',
        look: 'Between two lines that converge into the distance, the upper bar looks longer.',
        truth:
          'The two bars are the same length. With depth cues, your brain judges the farther one to be bigger.',
      },
      zollner: {
        name: 'Zöllner illusion',
        look: 'Horizontal lines with short slanted ticks seem to tilt toward each other.',
        truth:
          'The four long lines are perfectly parallel. Hide the ticks to see how straight they are.',
      },
      ebbinghaus: {
        name: 'Ebbinghaus illusion',
        look: 'The center circle surrounded by big circles looks smaller than the one surrounded by small circles.',
        truth:
          'The two orange circles are the same size. The guide lines are tangent to both at the top and bottom.',
      },
      'cafe-wall': {
        name: 'Café wall illusion',
        look: 'Black and white tiles shifted row by row make the gray mortar lines look slanted.',
        truth:
          'The mortar lines are straight and horizontal. Show the guide lines, or set the strength to 0, to check.',
      },
      'checker-shadow': {
        name: 'Checker shadow illusion',
        look: 'Square A, inside the shadow, looks much lighter than square B, outside it.',
        truth:
          'A and B are the same shade of gray. The guide band joins them in one color. Your brain discounts the shadow when judging brightness.',
      },
      'hermann-grid': {
        name: 'Hermann grid illusion',
        look: 'Faint gray spots seem to appear at the white crossings between the black squares.',
        truth:
          'The crossings are as white as the lanes. The spot disappears at the crossing you look at directly.',
      },
      poggendorff: {
        name: 'Poggendorff illusion',
        look: 'A diagonal line hidden behind a bar seems to come out shifted on the other side.',
        truth:
          'The two segments lie on one straight line. Show the guide line to see that it connects perfectly.',
      },
      'fraser-spiral': {
        name: 'Fraser spiral illusion',
        look: 'Concentric circles look like a swirling spiral.',
        truth:
          'All four are perfect concentric circles. Trace the guide circles to see that the swirl lies on a circle.',
      },
    },
    notesHeading: 'Notes',
    notes: [
      'Every figure is drawn as SVG on this page. Nothing is loaded or sent to a server.',
      'For people sensitive to light, the page uses no flashing or fast motion. If you feel uncomfortable, look away from the screen.',
      'What you see varies between people and with screen size, brightness and viewing distance. Some illusions may look weak.',
      'Illusions come from normal workings of the eyes and brain. This page is not a tool for testing eyesight or diagnosing anything.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Optical illusion',
        description:
          'A visual effect where size, length, direction or brightness looks different from what it really is. It arises from the brain’s normal attempts to correct what it sees using context.',
      },
    ],
  },
};
