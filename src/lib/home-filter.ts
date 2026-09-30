import type { CategoryId, LocalizedTool } from '../data/tools';

export interface HomeFilterOptions {
  query?: string;
  /** カテゴリID（'all' は絞り込みなし） */
  category?: CategoryId | 'all';
}

const ALL_CATEGORY = 'all';

export function filterTools(
  tools: LocalizedTool[],
  options: HomeFilterOptions = {},
): LocalizedTool[] {
  const query = options.query?.trim().toLowerCase() ?? '';
  const category = options.category ?? ALL_CATEGORY;

  return tools.filter((tool) => {
    const matchesCategory =
      category === ALL_CATEGORY || tool.categoryId === category;
    if (!matchesCategory) return false;

    if (!query) return true;
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords.some((keyword) => keyword.toLowerCase().includes(query))
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
