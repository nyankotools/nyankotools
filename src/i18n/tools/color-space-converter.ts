import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface ColorField {
  id: 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'hwb' | 'lab' | 'oklch';
  label: string;
  placeholder: string;
  error: string;
}

export interface ColorSpaceConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  pickerAriaLabel: string;
  fields: ColorField[];
  copy: string;
  copied: string;
  copyFailed: string;
  clipped: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const colorSpaceConverterContent: Record<
  Locale,
  ColorSpaceConverterPageContent
> = {
  ja: {
    title: '色空間変換（RGB・CMYK・Lab・OKLCH・HWB）',
    description:
      'RGB・HEX・HSL・CMYK・HWB・Lab・OKLCHの色表現を相互に変換できる無料ツールです。CSSのlab()・oklch()・hwb()形式にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '色空間変換（RGB・CMYK・Lab・OKLCH・HWB）',
    introHtml:
      'RGB・HEX・HSL・CMYK・HWB・Lab・OKLCHの7種類の色表現をリアルタイムで相互変換します。いずれかの欄に値を入力するか、カラーピッカーで色を選ぶと、他の形式に自動で反映されます。Lab・OKLCH・HWBはCSSの <code>lab()</code>・<code>oklch()</code>・<code>hwb()</code> にそのまま貼り付けられる形式で表示します。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。HEX・RGB・HSLだけで十分な場合は <a href="/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カラーコード変換</a> もご利用ください。',
    pickerAriaLabel: 'カラーピッカー',
    fields: [
      {
        id: 'hex',
        label: 'HEX',
        placeholder: '#3b82f6',
        error: 'HEXの形式が正しくありません（例: #3b82f6）',
      },
      {
        id: 'rgb',
        label: 'RGB',
        placeholder: 'rgb(59, 130, 246)',
        error: 'RGBの形式が正しくありません（例: rgb(59, 130, 246)）',
      },
      {
        id: 'hsl',
        label: 'HSL',
        placeholder: 'hsl(217, 91%, 60%)',
        error: 'HSLの形式が正しくありません（例: hsl(217, 91%, 60%)）',
      },
      {
        id: 'cmyk',
        label: 'CMYK（簡易換算）',
        placeholder: 'cmyk(76%, 47%, 0%, 4%)',
        error:
          'CMYKの形式が正しくありません。各値は0〜100%です（例: cmyk(76%, 47%, 0%, 4%)）',
      },
      {
        id: 'hwb',
        label: 'HWB',
        placeholder: 'hwb(217 23% 4%)',
        error:
          'HWBの形式が正しくありません。W・Bは0〜100%です（例: hwb(217 23% 4%)）',
      },
      {
        id: 'lab',
        label: 'Lab（CIE Lab・D50）',
        placeholder: 'lab(54.29 80.8 69.89)',
        error:
          'Labの形式が正しくありません。Lは0〜100です（例: lab(54.29 80.8 69.89)）',
      },
      {
        id: 'oklch',
        label: 'OKLCH',
        placeholder: 'oklch(0.628 0.2577 29.23)',
        error:
          'OKLCHの形式が正しくありません。Lは0〜1（または0〜100%）、Cは0〜0.5です（例: oklch(0.628 0.2577 29.23)）',
      },
    ],
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    clipped:
      '入力した色はsRGBで表現できる範囲を超えているため、最も近い表示可能な色に丸めて他の形式へ反映しました。',
    notesHeading: '注意事項',
    notes: [
      'CMYKはICCプロファイルを使わない数式による簡易換算です。実際の印刷では用紙・インク・プロファイルによって色が変わるため、印刷物の色合わせにはDTPソフトや印刷会社の指定に従ってください。',
      'RGB・HEX・HSLはsRGB、LabはD50白色点（CSSの lab() と同じ）、OKLCHはCSS Color 4の oklch() と同じ定義で計算しています。Photoshop等のD65基準のLabとは値が異なる場合があります。',
      'LabやOKLCHにはsRGBで表示できない色も存在します。そうした値を入力した場合は、最も近い表示可能な色に丸めて他の形式へ反映し、その旨を表示します。',
      '形式が不正な値を入力した場合、他の欄は変更せずエラーを表示します。カンマ区切りの数値のみ（例: 76, 47, 0, 4）でも入力できます。透明度（アルファ値）には対応しておらず、指定しても無視されます。',
      '表示値は丸めているため、他の形式から戻すと±1程度の差が出ることがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'CMYK',
        description:
          'シアン(C)・マゼンタ(M)・イエロー(Y)・黒(K)のインクの量で色を表す、印刷向けの色表現です。このツールの換算は簡易式のため、実際の印刷色とは一致しません。',
      },
      {
        term: 'HWB',
        description:
          '色相(Hue)に、混ぜる白(Whiteness)と黒(Blackness)の割合を指定して色を表す形式です。「この色に白や黒をどれだけ足すか」で直感的に調整できます。CSSの hwb() で使えます。',
      },
      {
        term: 'Lab（CIE Lab）',
        description:
          '明るさ(L)と、赤〜緑(a)・黄〜青(b)の軸で色を表す色空間です。人の見た目の差に近くなるよう設計されており、色の差を測る用途にも使われます。CSSの lab() はD50白色点を基準にします。',
      },
      {
        term: 'OKLCH',
        description:
          '知覚的に均一なOKLabを、明るさ(L)・彩度(C)・色相(H)で表した形式です。色相を変えても明るさが見た目で揃いやすく、グラデーションや配色の生成に向いています。CSSの oklch() で使えます。',
      },
      {
        term: 'sRGB・色域（ガモット）',
        description:
          'sRGBはWebや一般的なディスプレイの標準色空間です。色域（ガモット）はその色空間で表現できる色の範囲で、LabやOKLCHにはsRGBの色域の外にある色もあります。',
      },
    ],
  },
  en: {
    title: 'Color Space Converter (RGB, CMYK, Lab, OKLCH, HWB)',
    description:
      'Convert colors between RGB, HEX, HSL, CMYK, HWB, Lab and OKLCH, with CSS lab(), oklch() and hwb() output. Runs in your browser; nothing is uploaded.',
    h1: 'Color Space Converter (RGB, CMYK, Lab, OKLCH, HWB)',
    introHtml:
      'Converts colors between RGB, HEX, HSL, CMYK, HWB, Lab and OKLCH in real time. Enter a value in any field, or pick a color with the color picker, and the other formats update automatically. Lab, OKLCH and HWB are shown in a form you can paste straight into CSS <code>lab()</code>, <code>oklch()</code> and <code>hwb()</code>. Everything happens in your browser, and nothing you type is ever sent to a server. If HEX, RGB and HSL are all you need, the simpler <a href="/en/tools/color-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Color Converter</a> is also available.',
    pickerAriaLabel: 'Color picker',
    fields: [
      {
        id: 'hex',
        label: 'HEX',
        placeholder: '#3b82f6',
        error: 'Invalid HEX format (e.g. #3b82f6)',
      },
      {
        id: 'rgb',
        label: 'RGB',
        placeholder: 'rgb(59, 130, 246)',
        error: 'Invalid RGB format (e.g. rgb(59, 130, 246))',
      },
      {
        id: 'hsl',
        label: 'HSL',
        placeholder: 'hsl(217, 91%, 60%)',
        error: 'Invalid HSL format (e.g. hsl(217, 91%, 60%))',
      },
      {
        id: 'cmyk',
        label: 'CMYK (simple formula)',
        placeholder: 'cmyk(76%, 47%, 0%, 4%)',
        error:
          'Invalid CMYK format. Each value must be 0-100% (e.g. cmyk(76%, 47%, 0%, 4%))',
      },
      {
        id: 'hwb',
        label: 'HWB',
        placeholder: 'hwb(217 23% 4%)',
        error:
          'Invalid HWB format. W and B must be 0-100% (e.g. hwb(217 23% 4%))',
      },
      {
        id: 'lab',
        label: 'Lab (CIE Lab, D50)',
        placeholder: 'lab(54.29 80.8 69.89)',
        error:
          'Invalid Lab format. L must be 0-100 (e.g. lab(54.29 80.8 69.89))',
      },
      {
        id: 'oklch',
        label: 'OKLCH',
        placeholder: 'oklch(0.628 0.2577 29.23)',
        error:
          'Invalid OKLCH format. L must be 0-1 (or 0-100%) and C 0-0.5 (e.g. oklch(0.628 0.2577 29.23))',
      },
    ],
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    clipped:
      'The color you entered is outside the sRGB gamut, so the other formats show the closest displayable color.',
    notesHeading: 'Notes',
    notes: [
      'CMYK uses a simple formula without an ICC profile. Real print colors depend on the paper, ink and profile, so use your DTP software or print shop specifications when matching printed colors.',
      'RGB, HEX and HSL are sRGB. Lab uses the D50 white point (same as CSS lab()), and OKLCH follows the CSS Color 4 oklch() definition. Values may differ from D65-based Lab in tools such as Photoshop.',
      'Lab and OKLCH can describe colors that sRGB cannot display. If you enter such a value, the other formats show the closest displayable color and a notice appears.',
      'An invalid value leaves the other fields unchanged and shows an error. Plain comma-separated numbers (e.g. 76, 47, 0, 4) are also accepted. Transparency (alpha) is not supported and is ignored.',
      'Displayed values are rounded, so converting back from another format can differ by about ±1.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'CMYK',
        description:
          'A print-oriented model that describes a color by the amounts of Cyan, Magenta, Yellow and blacK ink. This tool uses a simple formula, so results do not match real printed colors exactly.',
      },
      {
        term: 'HWB',
        description:
          'A model that takes a Hue and the amounts of Whiteness and Blackness mixed in. It makes it easy to think in terms of "how much white or black to add to this color". Usable in CSS hwb().',
      },
      {
        term: 'Lab (CIE Lab)',
        description:
          'A color space with a lightness axis (L) and red-green (a) and yellow-blue (b) axes. It is designed so distances roughly match perceived differences, and is used for measuring color difference. CSS lab() uses the D50 white point.',
      },
      {
        term: 'OKLCH',
        description:
          'The perceptually uniform OKLab expressed as Lightness (L), Chroma (C) and Hue (H). Changing the hue keeps perceived lightness fairly steady, which suits gradients and palette generation. Usable in CSS oklch().',
      },
      {
        term: 'sRGB and gamut',
        description:
          'sRGB is the standard color space for the web and typical displays. A gamut is the range of colors a space can represent; Lab and OKLCH include colors outside the sRGB gamut.',
      },
    ],
  },
};
