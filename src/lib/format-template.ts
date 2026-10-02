/** `{key}` 形式のプレースホルダーを values で置き換える（未指定のキーは空文字） */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

/** [単数形, 複数形] のテンプレートから件数に合うものを選んで {n} を埋める */
export function count(
  forms: [string, string],
  n: number,
  display: string = String(n),
): string {
  return fill(n === 1 ? forms[0] : forms[1], { n: display });
}
