/** 入力欄の文字数（サロゲートペアなどをコードポイント単位で数える） */
export function countChars(value: string): number {
  let count = 0;
  for (let i = 0; i < value.length; i++) {
    count++;
    // 上位サロゲートの直後の下位サロゲートは同じ1文字
    if ((value.codePointAt(i) ?? 0) > 0xffff) i++;
  }
  return count;
}

/** `{n}` を含む文言に文字数を差し込む（3桁区切り） */
export function formatCount(template: string, n: number): string {
  return template.replace('{n}', n.toLocaleString('en-US'));
}

export interface InputLabels {
  paste: string;
  pasteFailed: string;
  clear: string;
  sample: string;
  count: string;
}

function parseLabels(raw: string | undefined): InputLabels | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InputLabels;
  } catch {
    return null;
  }
}

function makeButton(label: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ui-btn';
  button.textContent = label;
  return button;
}

function setValue(target: HTMLTextAreaElement, value: string): void {
  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true }));
  target.focus();
}

/**
 * `data-query-target` を付けた入力欄（各ツールが「主入力の非機微テキスト欄」として明示したもの）に、
 * 貼り付け・クリア・サンプル入力（`data-sample` があれば）・文字数（`data-no-count` で抑止）を足す。
 * 値は `input` イベントを発火して反映するため、各ツールの既存の処理がそのまま走る。
 */
export function initInputHelpers(): void {
  const container = document.querySelector<HTMLElement>('[data-tool-page]');
  if (!container || container.hasAttribute('data-tool-sensitive')) return;
  const labels = parseLabels(container.dataset.inputLabels);
  if (!labels) return;

  container
    .querySelectorAll<HTMLTextAreaElement>('textarea[data-query-target]')
    .forEach((target) => {
      const bar = document.createElement('div');
      bar.className = 'mt-2 print:hidden flex flex-wrap items-center gap-2';
      bar.setAttribute('data-input-helpers', '');

      const status = document.createElement('span');
      status.className = 'text-sm text-gray-600 dark:text-gray-400';
      status.setAttribute('aria-live', 'polite');

      const sample = target.dataset.sample;
      if (sample) {
        const button = makeButton(labels.sample);
        button.addEventListener('click', () => {
          status.textContent = '';
          setValue(target, sample);
        });
        bar.append(button);
      }

      if (navigator.clipboard && 'readText' in navigator.clipboard) {
        const button = makeButton(labels.paste);
        button.addEventListener('click', async () => {
          try {
            const text = await navigator.clipboard.readText();
            status.textContent = '';
            setValue(target, text);
          } catch {
            status.textContent = labels.pasteFailed;
            target.focus();
          }
        });
        bar.append(button);
      }

      const clear = makeButton(labels.clear);
      clear.addEventListener('click', () => {
        status.textContent = '';
        setValue(target, '');
      });
      bar.append(clear);

      if (!target.hasAttribute('data-no-count')) {
        const count = document.createElement('span');
        count.className = 'text-sm text-gray-600 dark:text-gray-400';
        const update = () => {
          count.textContent = formatCount(
            labels.count,
            countChars(target.value),
          );
        };
        target.addEventListener('input', update);
        update();
        bar.append(count);
      }

      bar.append(status);
      target.insertAdjacentElement('afterend', bar);
    });
}
