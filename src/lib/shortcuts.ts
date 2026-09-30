export type ShortcutAction = 'run' | 'copy';

interface KeyLike {
  key: string;
  code: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  isComposing?: boolean;
  keyCode?: number;
}

/**
 * キー入力を共通ショートカットに対応付ける。
 * - Ctrl/⌘ + Enter: 実行（主ボタンを押す）
 * - Alt + Shift + C: コピー（Ctrl+Shift+C はブラウザの開発者ツールと衝突するため使わない）
 * Esc でのクリアは、入力の消失事故とダイアログ・サイドバーのEscとの衝突を避けるため設けない。
 */
export function matchShortcut(e: KeyLike): ShortcutAction | null {
  // Safari は変換確定の Enter で isComposing が false になり keyCode が 229 になる
  if (e.isComposing || e.keyCode === 229) return null;
  if (
    e.key === 'Enter' &&
    (e.ctrlKey || e.metaKey) &&
    !e.altKey &&
    !e.shiftKey
  ) {
    return 'run';
  }
  if (e.code === 'KeyC' && e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
    return 'copy';
  }
  return null;
}

const TARGET_SELECTORS: Record<ShortcutAction, string> = {
  run: 'button.ui-btn-primary, button[id$="generate-button"]',
  copy: 'button[id*="copy"]:not([id$="status"])',
};

function isUsable(el: HTMLButtonElement): boolean {
  return !el.disabled && el.getClientRects().length > 0;
}

/** ツールページで、共通ショートカットに対応するボタンを押す */
export function initShortcuts(): void {
  const container = document.querySelector<HTMLElement>('[data-tool-page]');
  if (!container) return;

  // パレットの案内には、このページで実際に効くショートカットだけを出す
  const hint = document.getElementById('palette-tool-hint');
  (['run', 'copy'] as const).forEach((action) => {
    if (!container.querySelector(TARGET_SELECTORS[action])) return;
    hint?.removeAttribute('hidden');
    hint?.querySelector(`[data-hint-${action}]`)?.removeAttribute('hidden');
  });

  document.addEventListener('keydown', (event) => {
    const action = matchShortcut(event);
    if (!action) return;
    if (document.querySelector('dialog[open]')) return;
    const target = Array.from(
      container.querySelectorAll<HTMLButtonElement>(TARGET_SELECTORS[action]),
    ).find(isUsable);
    if (!target) return;
    event.preventDefault();
    target.click();
  });
}
