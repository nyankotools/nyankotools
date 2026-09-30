import type { Locale } from '../data/tools';

export interface ShortcutRow {
  /** 表示するキーの組み合わせ（`+` で同時押し、`/` で択一。各キーを <kbd> にする） */
  keys: string;
  action: string;
}

export interface ShortcutGroup {
  heading: string;
  note?: string;
  rows: ShortcutRow[];
}

export interface ShortcutsContent {
  title: string;
  description: string;
  h1: string;
  intro: string;
  groups: ShortcutGroup[];
  notesHeading: string;
  footnotes: string[];
}

export const shortcuts: Record<Locale, ShortcutsContent> = {
  ja: {
    title: 'キーボードショートカット一覧',
    description:
      'にゃんこツールで使えるキーボードショートカットの一覧です。Ctrl+Kでツール検索、Ctrl+Enterで実行、Alt+Shift+Cでコピーなど、操作を素早くするキーをまとめています。',
    h1: 'キーボードショートカット一覧',
    intro:
      'にゃんこツールでは、キーボードだけで素早く操作できるショートカットを用意しています。Macでは Ctrl の代わりに ⌘（Command）を使ってください。',
    groups: [
      {
        heading: 'サイト全体',
        rows: [
          {
            keys: 'Ctrl/⌘+K',
            action: 'ツール検索（コマンドパレット）を開く・閉じる',
          },
          {
            keys: 'Ctrl/⌘+Enter',
            action: 'ツールページで主ボタン（変換・生成・計算など）を実行する',
          },
          {
            keys: 'Alt+Shift+C',
            action: 'ツールページで「コピー」ボタンを押す',
          },
          {
            keys: 'Esc',
            action: 'スマートフォン表示のメニュー（サイドバー）を閉じる',
          },
        ],
      },
      {
        heading: 'ツール検索（コマンドパレット）の中',
        rows: [
          { keys: '↑/↓', action: '候補を選ぶ' },
          { keys: 'Enter', action: '選んだツールのページを開く' },
          { keys: 'Esc', action: '検索を閉じる' },
        ],
      },
      {
        heading: '猫ロゴテキストジェネレーター',
        note: 'キャンバス上でテキストを選択しているときだけ使えます。',
        rows: [
          {
            keys: '←/→/↑/↓',
            action: 'テキストの位置を少しずつ動かす（1%刻み）',
          },
          {
            keys: 'Shift+←/→/↑/↓',
            action: 'テキストの位置を大きく動かす（5%刻み）',
          },
          { keys: 'Delete/Backspace', action: '選択中のテキストを削除する' },
          { keys: 'Esc', action: 'テキストの選択を解除する' },
        ],
      },
    ],
    notesHeading: '補足',
    footnotes: [
      '日本語入力（IME）で変換中は、ショートカットは動作しません。',
      'ダイアログ（ツール検索など）が開いている間は、Ctrl/⌘+Enter と Alt+Shift+C は動作しません。',
      'ツールに実行ボタンやコピーボタンがない場合、そのページでは該当のショートカットは何も起きません。',
      'コピーに Alt+Shift+C を使うのは、Ctrl+Shift+C がブラウザの開発者ツールと重なるためです。',
    ],
  },
  en: {
    title: 'Keyboard Shortcuts',
    description:
      'All keyboard shortcuts available on NyankoTools: Ctrl+K to search tools, Ctrl+Enter to run, Alt+Shift+C to copy, and more.',
    h1: 'Keyboard Shortcuts',
    intro:
      'NyankoTools has shortcuts so you can work quickly from the keyboard. On a Mac, use ⌘ (Command) in place of Ctrl.',
    groups: [
      {
        heading: 'Across the site',
        rows: [
          {
            keys: 'Ctrl/⌘+K',
            action: 'Open or close tool search (command palette)',
          },
          {
            keys: 'Ctrl/⌘+Enter',
            action:
              'On a tool page, press the main button (convert, generate, calculate, etc.)',
          },
          {
            keys: 'Alt+Shift+C',
            action: 'On a tool page, press the "Copy" button',
          },
          { keys: 'Esc', action: 'Close the menu (sidebar) on mobile layouts' },
        ],
      },
      {
        heading: 'Inside tool search (command palette)',
        rows: [
          { keys: '↑/↓', action: 'Move through the results' },
          { keys: 'Enter', action: 'Open the selected tool' },
          { keys: 'Esc', action: 'Close the search' },
        ],
      },
      {
        heading: 'Cat Logo Text Generator',
        note: 'Available only while a text item is selected on the canvas.',
        rows: [
          {
            keys: '←/→/↑/↓',
            action: 'Nudge the text position in small steps (1%)',
          },
          {
            keys: 'Shift+←/→/↑/↓',
            action: 'Move the text position in larger steps (5%)',
          },
          { keys: 'Delete/Backspace', action: 'Delete the selected text' },
          { keys: 'Esc', action: 'Deselect the text' },
        ],
      },
    ],
    notesHeading: 'Notes',
    footnotes: [
      'Shortcuts do nothing while an IME is composing text.',
      'Ctrl/⌘+Enter and Alt+Shift+C are disabled while a dialog (such as tool search) is open.',
      'If a tool has no run or copy button, the matching shortcut does nothing on that page.',
      'Alt+Shift+C is used for copy because Ctrl+Shift+C conflicts with the browser developer tools.',
    ],
  },
};
