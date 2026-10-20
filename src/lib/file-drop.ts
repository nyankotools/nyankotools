const ACTIVE_CLASSES = [
  'border-blue-400!',
  'bg-blue-50',
  'dark:bg-blue-950/30',
];

/**
 * zone へのファイルのドラッグ＆ドロップを input[type=file] に反映する。
 * ドロップされたファイルは input.files に設定し、change イベントを発火する。
 * onIntent は「これからファイルが選ばれそう」な時点（選択ダイアログを開いた・ドラッグが入ってきた）で
 * 一度だけ呼ばれる。遅延読み込みするライブラリの先読みに使う（ダイアログを開いている間に読み込める）。
 */
export function enableFileDrop(
  zone: HTMLElement,
  input: HTMLInputElement,
  onIntent?: () => void,
) {
  if (onIntent) {
    let called = false;
    const fire = () => {
      if (called) return;
      called = true;
      onIntent();
    };
    input.addEventListener('click', fire);
    zone.addEventListener('dragenter', fire);
  }
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
