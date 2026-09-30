/**
 * Blob をファイルとしてダウンロードさせる（クリックで即保存する用途）。
 * 生成した object URL は保存開始後に必ず revoke する。
 * プレビュー表示などで URL を保持し続ける場合は、呼び出し側で管理すること。
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // 保存開始前に revoke すると失敗するブラウザがある（iOS Safari は保存確認の
  // シート表示中も URL を参照する）ため、余裕をもって待つ
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
