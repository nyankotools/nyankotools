import { trackEvent } from './analytics';

/** 利用者へ知らせる必要のないエラー（ブラウザ由来・別オリジンのスクリプト由来）を除く */
export function shouldReport(
  message: string,
  filename: string | undefined,
  origin: string,
): boolean {
  if (message.startsWith('ResizeObserver loop')) return false;
  if (filename && !filename.startsWith(origin)) return false;
  // 別オリジンのスクリプトのエラーは "Script error." のみで詳細も原因も分からない
  if (!filename && message === 'Script error.') return false;
  return true;
}

/** ユーザーの入力が混ざりうるメッセージは送らず、種別と発生位置だけを短く残す */
export function describeError(
  name: string,
  filename: string | undefined,
  line: number | undefined,
): string {
  const file = filename?.split('?')[0].split('/').pop() ?? '';
  const where = file ? ` @${file}${line ? `:${line}` : ''}` : '';
  return `${name}${where}`.slice(0, 100);
}

const MAX_REPORTS = 3;

/**
 * 想定外の例外・未処理のPromise拒否を、利用者へ通知（`#error-toast`）しGA4へ送る。
 * GA4送信は1ページにつき最大3回まで（エラーの連鎖で溢れさせない）。
 */
export function initErrorBoundary(): void {
  const toast = document.getElementById('error-toast');
  let reports = 0;
  let dismissed = false;

  document
    .getElementById('error-toast-close')
    ?.addEventListener('click', () => {
      dismissed = true;
      toast?.setAttribute('hidden', '');
    });

  function report(name: string, filename?: string, line?: number): void {
    // 閉じた後は、エラーが続いても同じページでは再表示しない
    if (!dismissed) toast?.removeAttribute('hidden');
    if (reports >= MAX_REPORTS) return;
    reports += 1;
    trackEvent('exception', {
      description: describeError(name, filename, line),
      fatal: false,
    });
  }

  window.addEventListener('error', (event) => {
    if (!shouldReport(event.message, event.filename, location.origin)) return;
    report(event.error?.name ?? 'Error', event.filename, event.lineno);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason: unknown = event.reason;
    // 拡張機能などページ外が原因の拒否で誤通知しないよう、自サイトのスクリプト由来と分かるものだけ扱う
    if (
      !(reason instanceof Error) ||
      !reason.stack?.includes(location.origin)
    ) {
      return;
    }
    report(reason.name);
  });
}
