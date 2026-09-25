const ACTIVE_CLASSES = [
  'border-blue-400!',
  'bg-blue-50',
  'dark:bg-blue-950/30',
];

/**
 * zone へのファイルのドラッグ＆ドロップを input[type=file] に反映する。
 * ドロップされたファイルは input.files に設定し、change イベントを発火する。
 */
export function enableFileDrop(zone: HTMLElement, input: HTMLInputElement) {
  const hasFiles = (e: DragEvent) =>
    Array.from(e.dataTransfer?.types ?? []).includes('Files');
  const setActive = (on: boolean) =>
    ACTIVE_CLASSES.forEach((c) => zone.classList.toggle(c, on));

  zone.addEventListener('dragover', (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    setActive(true);
  });
  zone.addEventListener('dragleave', (e) => {
    if (!zone.contains(e.relatedTarget as Node | null)) setActive(false);
  });
  zone.addEventListener('drop', (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    setActive(false);
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    // multiple でない input には先頭の1件だけ渡す
    if (input.multiple || files.length === 1) {
      input.files = files;
    } else {
      const dt = new DataTransfer();
      dt.items.add(files[0]);
      input.files = dt.files;
    }
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
