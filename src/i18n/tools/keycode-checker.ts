import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface FieldRow {
  id: 'key' | 'code' | 'keycode' | 'location' | 'modifiers' | 'repeat';
  label: string;
}

export interface KeycodeCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  captureAriaLabel: string;
  placeholder: string;
  fieldRows: FieldRow[];
  historyHeading: string;
  clearHistory: string;
  notesHeading: string;
  notes: string[];
  locationStandard: string;
  locationLeft: string;
  locationRight: string;
  locationNumpad: string;
  locationUnknown: string;
  modifierNone: string;
  spaceLabel: string;
  repeatYes: string;
  repeatNo: string;
  /** `{location}` `{label}` を置換して使うテンプレート */
  locationValueTemplate: string;
  /** `{code}` `{key}` を置換して使うテンプレート */
  historyItemTemplate: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const keycodeCheckerContent: Record<Locale, KeycodeCheckerPageContent> =
  {
    ja: {
      title:
        'キーコード（e.code/e.key）チェッカー（JavaScriptキーイベント確認）',
      description:
        '押したキーのevent.key・event.code・keyCode・修飾キーなどのキーボードイベント情報をリアルタイムで確認できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'キーコード（e.code/e.key）チェッカー',
      introHtml:
        '下の入力エリアをクリックしてフォーカスし、任意のキーを押すと、<code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">event.key</code>・<code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">event.code</code>・keyCode・location・修飾キーの状態をリアルタイムで表示します。JavaScriptのキーボードイベント処理を実装する際の、実機での値確認やevent.keyとevent.codeの違いの確認に便利です。ブラウザ内で処理され、押したキーの情報がサーバーに送信されることはありません。入力値のパターンマッチングを試したい場合は <a href="/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">正規表現テスター</a> もあわせてご利用ください。',
      captureAriaLabel: 'キー入力検知エリア',
      placeholder: 'ここをクリックしてフォーカスし、任意のキーを押してください',
      fieldRows: [
        { id: 'key', label: 'event.key' },
        { id: 'code', label: 'event.code' },
        { id: 'keycode', label: 'keyCode（非推奨）' },
        { id: 'location', label: 'location' },
        { id: 'modifiers', label: '修飾キー' },
        { id: 'repeat', label: 'リピート（長押し）' },
      ],
      historyHeading: '履歴（最新10件）',
      clearHistory: '履歴をクリア',
      notesHeading: '注意事項',
      notes: [
        'キー入力を検知するには、上の入力エリアをクリックしてフォーカスしてから任意のキーを押してください。',
        '入力エリアにフォーカスしている間は、Tabキーによるフォーカス移動やF5キーの再読み込みなど、ブラウザ標準の動作を防止して表示します（エリア外をクリックする、またはEscapeキーを押すと通常の動作に戻ります）。',
        '日本語入力（IME）で変換中に押したキーは、環境によってevent.keyが"Process"などの特殊な値になる場合があります。',
        'キーボードの配列（JIS配列/US配列等）によって、同じ物理キーでもevent.keyの値が異なる場合があります。event.codeは配列に依存しない物理的な位置を表します。',
        'ブラウザ・OSの組み合わせによっては、メディアキーやブラウザに予約されたショートカットキーなど、検出できないキーもあります。',
      ],
      locationStandard: '標準',
      locationLeft: '左側',
      locationRight: '右側',
      locationNumpad: 'テンキー',
      locationUnknown: '不明',
      modifierNone: 'なし',
      spaceLabel: 'Space（" "）',
      repeatYes: 'はい（長押し）',
      repeatNo: 'いいえ',
      locationValueTemplate: '{location}（{label}）',
      historyItemTemplate: '{code}（{key}）',
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'event.key',
          description:
            '押されたキーが表す「文字」または機能名を表します（例: "a"、"Enter"、"ArrowUp"）。キーボード配列やShiftキーの状態、IME変換中かどうかによって値が変わることがあります。',
        },
        {
          term: 'event.code',
          description:
            'キーボード上の「物理的な位置」を表す文字列です（例: "KeyA"、"Digit1"）。数字キーの「1」を押したとき、Shiftキーの状態でevent.keyは"1"や"!"に変わりますが、event.codeは常に"Digit1"のままで、キーボード配列にも依存しません。',
        },
        {
          term: 'KeyboardEvent.location',
          description:
            'Shift・Ctrl・Alt・Enterなど、キーボード上に複数存在するキーを区別するための値です。0が標準、1が左側、2が右側、3がテンキー側のキーを表します。',
        },
        {
          term: 'keyCode / which（非推奨）',
          description:
            'キーを数値で表す古いブラウザAPIです。ブラウザや配列によって値の解釈が揺れることがあるため非推奨とされており、新規実装ではevent.keyやevent.codeを使うことが推奨されています。',
        },
        {
          term: '修飾キー（モディファイアキー）',
          description:
            'Ctrl・Alt・Shift・Metaなど、他のキーと組み合わせて使う特殊キーの総称です。Metaキーは、Windowsではウィンドウズキー、Macではcommandキーに対応します。',
        },
      ],
    },
    en: {
      title: 'Keycode (e.code / e.key) Checker — Keyboard Event Inspector',
      description:
        'Check event.key, event.code, keyCode, and modifier keys for any key press in real time. Runs in your browser; nothing is sent to a server.',
      h1: 'Keycode (e.code / e.key) Checker',
      introHtml:
        'Click the box below to focus it, then press any key to see its <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">event.key</code>, <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">event.code</code>, keyCode, location, and modifier key state in real time. Handy for checking real-device values while implementing keyboard event handling in JavaScript, or for understanding the difference between event.key and event.code. Everything happens in your browser, and the keys you press are never sent to a server. If you also need to test input patterns, try the <a href="/en/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Regex Tester</a> as well.',
      captureAriaLabel: 'Key input detection area',
      placeholder: 'Click here to focus, then press any key',
      fieldRows: [
        { id: 'key', label: 'event.key' },
        { id: 'code', label: 'event.code' },
        { id: 'keycode', label: 'keyCode (deprecated)' },
        { id: 'location', label: 'location' },
        { id: 'modifiers', label: 'Modifier keys' },
        { id: 'repeat', label: 'Repeat (held down)' },
      ],
      historyHeading: 'History (last 10)',
      clearHistory: 'Clear history',
      notesHeading: 'Notes',
      notes: [
        'To detect a key press, click the box above to focus it first, then press any key.',
        'While the box is focused, browser default actions such as Tab moving focus or F5 reloading the page are prevented so you can see their values (clicking outside the box, or pressing Escape, restores normal behavior).',
        'Keys pressed while an IME is mid-conversion may report a special event.key value such as "Process", depending on your environment.',
        'The same physical key can report a different event.key value depending on keyboard layout (e.g. JIS vs. US). event.code represents the physical position and does not depend on layout.',
        'Some keys, such as media keys or shortcuts reserved by the browser, may not be detectable depending on your browser and OS combination.',
      ],
      locationStandard: 'standard',
      locationLeft: 'left',
      locationRight: 'right',
      locationNumpad: 'numpad',
      locationUnknown: 'unknown',
      modifierNone: 'None',
      spaceLabel: 'Space (" ")',
      repeatYes: 'Yes (held down)',
      repeatNo: 'No',
      locationValueTemplate: '{location} ({label})',
      historyItemTemplate: '{code} ({key})',
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'event.key',
          description:
            'The character or function name a pressed key represents (e.g. "a", "Enter", "ArrowUp"). Its value can change depending on keyboard layout, whether Shift is held, or whether an IME is mid-conversion.',
        },
        {
          term: 'event.code',
          description:
            'A string representing the physical location of a key on the keyboard (e.g. "KeyA", "Digit1"). Pressing the "1" key gives event.key a value of "1" or "!" depending on Shift, but event.code always stays "Digit1" regardless of keyboard layout.',
        },
        {
          term: 'KeyboardEvent.location',
          description:
            'Distinguishes keys that appear more than once on a keyboard, such as Shift, Ctrl, Alt, and Enter. 0 means standard, 1 means left, 2 means right, and 3 means the numeric keypad.',
        },
        {
          term: 'keyCode / which (deprecated)',
          description:
            'Older browser APIs that represent a key as a number. Their interpretation varies across browsers and keyboard layouts, so they are deprecated — new code should use event.key or event.code instead.',
        },
        {
          term: 'Modifier key',
          description:
            'A general term for keys such as Ctrl, Alt, Shift, and Meta that are held down together with another key. The Meta key corresponds to the Windows key on Windows and the Command key on Mac.',
        },
      ],
    },
  };
