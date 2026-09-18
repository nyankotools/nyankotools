import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface ColorField {
  id: 'hex' | 'rgb' | 'hsl';
  label: string;
  placeholder: string;
}

export interface ColorConverterPageContent {
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
  hexError: string;
  rgbError: string;
  hslError: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const colorConverterContent: Record<Locale, ColorConverterPageContent> =
  {
    ja: {
      title: 'カラーコード変換（HEX/RGB/HSL）',
      description:
        'HEX・RGB・HSLのカラーコードを相互に変換できる無料ツールです。カラーピッカーで直感的に色を選ぶこともできます。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'カラーコード変換（HEX/RGB/HSL）',
      introHtml:
        'HEX・RGB・HSL形式のカラーコードをリアルタイムで相互変換します。いずれかの欄に値を入力するか、カラーピッカーで色を選ぶと他の形式に自動で反映されます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。QRコードの色指定などにお困りの場合は <a href="/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QRコード生成</a> もあわせてご利用ください。',
      pickerAriaLabel: 'カラーピッカー',
      fields: [
        { id: 'hex', label: 'HEX', placeholder: '#3b82f6' },
        { id: 'rgb', label: 'RGB', placeholder: 'rgb(59, 130, 246)' },
        { id: 'hsl', label: 'HSL', placeholder: 'hsl(217, 91%, 60%)' },
      ],
      copy: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      hexError: 'HEXの形式が正しくありません（例: #3b82f6）',
      rgbError: 'RGBの形式が正しくありません（例: rgb(59, 130, 246)）',
      hslError: 'HSLの形式が正しくありません（例: hsl(217, 91%, 60%)）',
      notesHeading: '注意事項',
      notes: [
        'RGB・HSLは「rgb(255, 0, 0)」「hsl(0, 100%, 50%)」のような形式のほか、「255, 0, 0」のようにカンマ区切りの数値だけでも入力できます。',
        '入力した値が形式として不正な場合、他の欄への反映は行われずエラーメッセージを表示します。',
        '透明度（アルファ値）には対応していません。rgba()・hsla()形式を入力した場合はアルファ値を無視して変換します。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'HEX（16進数カラーコード）',
          description:
            '「#3b82f6」のように#と6桁（または3桁）の16進数で色を表す形式です。CSSやデザインツールで最も一般的に使われます。',
        },
        {
          term: 'RGB',
          description:
            '赤(Red)・緑(Green)・青(Blue)の光の三原色を、それぞれ0〜255の数値で表す形式です。',
        },
        {
          term: 'HSL',
          description:
            '色相(Hue・0〜360度)、彩度(Saturation・0〜100%)、明度(Lightness・0〜100%)で色を表す形式です。「同じ色味で明るさだけ変える」といった調整がしやすいのが特徴です。',
        },
      ],
    },
    en: {
      title: 'Color Converter (HEX/RGB/HSL)',
      description:
        'A free tool to convert color codes between HEX, RGB, and HSL. You can also pick a color intuitively with the color picker. Your data is processed in the browser and never sent to a server.',
      h1: 'Color Converter (HEX/RGB/HSL)',
      introHtml:
        'Converts HEX, RGB, and HSL color codes to each other in real time. Enter a value in any field, or pick a color with the color picker, and the other formats update automatically. Everything happens in your browser, and nothing you type is ever sent to a server. Need a color for a QR code? Check out the <a href="/en/tools/qr-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">QR Code Generator</a> as well.',
      pickerAriaLabel: 'Color picker',
      fields: [
        { id: 'hex', label: 'HEX', placeholder: '#3b82f6' },
        { id: 'rgb', label: 'RGB', placeholder: 'rgb(59, 130, 246)' },
        { id: 'hsl', label: 'HSL', placeholder: 'hsl(217, 91%, 60%)' },
      ],
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      hexError: 'Invalid HEX format (e.g. #3b82f6)',
      rgbError: 'Invalid RGB format (e.g. rgb(59, 130, 246))',
      hslError: 'Invalid HSL format (e.g. hsl(217, 91%, 60%))',
      notesHeading: 'Notes',
      notes: [
        'RGB and HSL accept formats like "rgb(255, 0, 0)" and "hsl(0, 100%, 50%)", as well as plain comma-separated numbers like "255, 0, 0".',
        'If a value is not a valid format, the other fields are left unchanged and an error message is shown instead.',
        'Transparency (alpha) is not supported. If you enter an rgba() or hsla() value, the alpha component is ignored during conversion.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'HEX (hexadecimal color code)',
          description:
            'A format like "#3b82f6" that represents a color as # followed by 6 (or 3) hexadecimal digits. It is the most common format in CSS and design tools.',
        },
        {
          term: 'RGB',
          description:
            'A format that expresses a color as amounts of Red, Green, and Blue light, each on a scale of 0 to 255.',
        },
        {
          term: 'HSL',
          description:
            'A format that expresses a color as Hue (0-360 degrees), Saturation (0-100%), and Lightness (0-100%). It makes adjustments like "keep the same hue but change the brightness" easy.',
        },
      ],
    },
  };
