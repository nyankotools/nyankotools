import type { Locale } from '../../data/tools';

export interface KeyboardTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  areaLabel: string;
  statusIdle: string;
  statusActive: string;
  progressLabel: string;
  resetLabel: string;
  legendHeld: string;
  legendPressed: string;
  legendUntouched: string;
  lastKeyHeading: string;
  rowKey: string;
  rowCode: string;
  rowLocation: string;
  none: string;
  locations: Record<'standard' | 'left' | 'right' | 'numpad', string>;
  otherHeading: string;
  otherEmpty: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const keyboardTesterContent: Record<Locale, KeyboardTesterPageContent> =
  {
    ja: {
      title: 'キーボードテスト（全キーの押下判定・チャタリング確認）',
      description:
        'キーボードの全キーが反応するかをブラウザ上で確認できる無料ツールです。押したキーが画面のキーボード図で光り、押し忘れも一目で分かります。キー名（key）とコード（code）も表示。入力内容は送信されません。',
      h1: 'キーボードテスト（全キー押下判定）',
      introHtml:
        '新しいキーボードや中古品の動作確認、キーが反応しない・二重に入力されるといった不調の切り分けに。下のキーボード図をクリックしてから実際にキーを押すと、押したキーが色づき、全キーを押したかどうかが分かります。押したキーのキー名・コードを調べたいときは<a href="/tools/keycode-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">キーコード（e.code/e.key）チェッカー</a>もご利用ください。入力内容はブラウザの外には出ません。',
      areaLabel: 'キーボードテストの領域。クリックしてからキーを押してください',
      statusIdle: 'ここをクリックしてからキーを押してください',
      statusActive: 'テスト中：キーを押してください',
      progressLabel: '押したキー',
      resetLabel: '結果をリセット',
      legendHeld: '押している間',
      legendPressed: '押した',
      legendUntouched: '未確認',
      lastKeyHeading: '最後に押したキー',
      rowKey: 'キー名（key）',
      rowCode: 'コード（code）',
      rowLocation: '位置',
      none: '-',
      locations: {
        standard: '標準',
        left: '左',
        right: '右',
        numpad: 'テンキー',
      },
      otherHeading: '配置図にないキー',
      otherEmpty:
        'JISキーボードの「¥」「ろ」「無変換」などを押すと、ここに表示されます。',
      notesHeading: '使い方と注意点',
      notes: [
        '図の領域をクリック（またはタブキーでフォーカス）してからキーを押します。領域の外をクリックするとテストが止まり、他のページ操作に戻れます。',
        'テスト中は、F5（再読み込み）やスペースキー（スクロール）などブラウザの標準動作を無効にして判定します。ただし、Tabキーはフォーカス移動に使うため無効にせず、押すと同時にテストが止まります。再開するには領域をもう一度クリックしてください。',
        'キーの配置は、フルサイズ（104キー・ANSI配列）を基準にしています。JIS配列の「¥」「ろ」「変換」「カタカナひらがな」などは、押すと「配置図にないキー」に表示されます。ノートPCではテンキーやFnキーがなく、Fnキーはブラウザには届かない場合があります。',
        'Windowsキーや「PrintScreen」、メディアキー、OSが先に処理するショートカットは、ブラウザに届かず判定できないことがあります。',
        'キーを一度押しただけで複数回反応する（チャタリング）場合は、押下中のキー表示が一瞬ちらついたり、複数回点滅したりすることで気づけます。ここでは押した回数の集計は行いません。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'key と code',
          description:
            'keyは入力された文字や機能（「a」「Enter」など）で、キーボード配列や入力モードで変わります。codeは物理的なキーの位置を表す名前（「KeyA」「Enter」など）で、配列が違っても同じキーなら同じ値になります。',
        },
        {
          term: 'チャタリング',
          description:
            'キーを1回押しただけなのに、接点の劣化やほこりで何度も入力されてしまう不具合です。古いキーボードやスイッチの摩耗で起こります。',
        },
        {
          term: 'Nキーロールオーバー（NKRO）',
          description:
            '同時に押した複数のキーを、いくつでも正しく認識できる仕組みです。非対応のキーボードでは、同時に押せるキー数に上限があります。',
        },
      ],
    },
    en: {
      title: 'Keyboard Test – Check Every Key Online',
      description:
        'Check that every key on your keyboard works. Each key you press lights up on an on-screen keyboard, with its name and code shown. Runs in your browser.',
      h1: 'Keyboard Tester (Test Every Key)',
      introHtml:
        'Use it to check a new or used keyboard, or to narrow down keys that do not respond or type twice. Click the keyboard below, then press keys; each one lights up so you can see whether you have tried them all. To look up the key name and code of a single press, try the <a href="/en/tools/keycode-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Keycode (e.code / e.key) Checker</a>. Nothing you type leaves your browser.',
      areaLabel: 'Keyboard test area. Click it, then press keys',
      statusIdle: 'Click here, then press keys',
      statusActive: 'Testing: press keys now',
      progressLabel: 'Keys pressed',
      resetLabel: 'Reset results',
      legendHeld: 'Held down',
      legendPressed: 'Pressed',
      legendUntouched: 'Not tested',
      lastKeyHeading: 'Last key pressed',
      rowKey: 'Key (key)',
      rowCode: 'Code (code)',
      rowLocation: 'Location',
      none: '-',
      locations: {
        standard: 'Standard',
        left: 'Left',
        right: 'Right',
        numpad: 'Numpad',
      },
      otherHeading: 'Keys not on the diagram',
      otherEmpty:
        'Keys such as the ¥ or Ro key on a Japanese (JIS) keyboard appear here when pressed.',
      notesHeading: 'How to use & notes',
      notes: [
        'Click the diagram (or focus it with the Tab key), then press keys. Clicking outside it stops the test and returns you to normal page use.',
        'While testing, browser defaults such as F5 (reload) and Space (scroll) are disabled so the key can be detected. The Tab key is not disabled because it moves focus, so pressing it also stops the test; click the area again to resume.',
        'The layout is a full-size (104-key, ANSI) keyboard. Keys specific to other layouts, such as the Japanese ¥, Ro, Convert and Katakana/Hiragana keys, appear under "Keys not on the diagram" when pressed. Laptops have no numpad, and the Fn key often does not reach the browser.',
        'The Windows key, PrintScreen, media keys and shortcuts the operating system handles first may not reach the browser, so they cannot always be detected.',
        'If one press registers several times (key chatter), you may notice the key flickering on screen. This tool does not count how many times a key fires.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'key vs. code',
          description:
            '"key" is the character or function that was typed (such as "a" or "Enter") and changes with layout and input mode. "code" names the physical key position (such as "KeyA"), so the same key gives the same value on any layout.',
        },
        {
          term: 'Key chatter',
          description:
            'A fault where a single press registers several times because of worn contacts or dust. It is common in old keyboards and worn switches.',
        },
        {
          term: 'N-key rollover (NKRO)',
          description:
            'The ability to register any number of keys pressed at once. Keyboards without it limit how many keys can be held at the same time.',
        },
      ],
    },
  };
