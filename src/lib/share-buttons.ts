import { copyText } from './clipboard';

export function initShareButtons(): void {
  document
    .querySelectorAll<HTMLElement>('[data-share-buttons]')
    .forEach((container) => {
      const shareUrl = container.dataset.shareUrl ?? '';
      const shareTitle = container.dataset.shareTitle ?? '';
      const statusEl = container.querySelector<HTMLElement>(
        '[data-share-status]',
      );

      container
        .querySelectorAll<HTMLAnchorElement>('[data-share-popup]')
        .forEach((link) => {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            window.open(
              link.href,
              'share',
              'width=600,height=480,noopener,noreferrer',
            );
          });
        });

      const copyButton =
        container.querySelector<HTMLButtonElement>('[data-share-copy]');
      copyButton?.addEventListener('click', async () => {
        if (!statusEl) return;
        statusEl.textContent = (await copyText(shareUrl, { track: false }))
          ? (copyButton.dataset.copiedText ?? '')
          : (copyButton.dataset.copyFailedText ?? '');
      });

      const nativeButton = container.querySelector<HTMLButtonElement>(
        '[data-share-native]',
      );
      if (nativeButton && typeof navigator.share === 'function') {
        nativeButton.hidden = false;
        nativeButton.addEventListener('click', async () => {
          try {
            await navigator.share({ url: shareUrl, title: shareTitle });
          } catch {
            // ユーザーがキャンセルした場合などは何もしない
          }
        });
      }
    });
}
