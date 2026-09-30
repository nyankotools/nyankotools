import type { CategoryId, LocalizedTool } from '../data/tools';

export interface HomeFilterOptions {
  query?: string;
  /** カテゴリID（'all' は絞り込みなし） */
  category?: CategoryId | 'all';
}

const ALL_CATEGORY = 'all';

/** 大文字小文字と全角/半角（ＪＳＯＮ→json など）の表記ゆれを揃える */
export function normalize(text: string): string {
  return text.normalize('NFKC').toLowerCase();
}

export function filterTools(
  tools: LocalizedTool[],
  options: HomeFilterOptions = {},
): LocalizedTool[] {
  const query = normalize(options.query?.trim() ?? '');
  const category = options.category ?? ALL_CATEGORY;

  return tools.filter((tool) => {
    const matchesCategory =
      category === ALL_CATEGORY || tool.categoryId === category;
    if (!matchesCategory) return false;

    if (!query) return true;
    return (
      normalize(tool.name).includes(query) ||
      normalize(tool.description).includes(query) ||
      tool.keywords.some((keyword) => normalize(keyword).includes(query))
    );
  });
}

export interface CategoryGroup {
  id: CategoryId;
  /** 表示名（ロケール解決済み） */
  label: string;
  tools: LocalizedTool[];
}

/** カテゴリごとにツールをグループ化する（カテゴリの順序は初出順） */
export function groupByCategory(tools: LocalizedTool[]): CategoryGroup[] {
  const groups = new Map<CategoryId, CategoryGroup>();
  for (const tool of tools) {
    const group = groups.get(tool.categoryId);
    if (group) {
      group.tools.push(tool);
    } else {
      groups.set(tool.categoryId, {
        id: tool.categoryId,
        label: tool.category,
        tools: [tool],
      });
    }
  }
  return Array.from(groups.values());
}
