import type { Tool } from '../data/tools';

export interface HomeFilterOptions {
  query?: string;
  category?: string;
}

const ALL_CATEGORY = 'all';

export function filterTools(
  tools: Tool[],
  options: HomeFilterOptions = {},
): Tool[] {
  const query = options.query?.trim().toLowerCase() ?? '';
  const category = options.category ?? ALL_CATEGORY;

  return tools.filter((tool) => {
    const matchesCategory =
      category === ALL_CATEGORY || tool.category === category;
    if (!matchesCategory) return false;

    if (!query) return true;
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    );
  });
}

export function getCategories(tools: Tool[]): string[] {
  return Array.from(new Set(tools.map((tool) => tool.category)));
}
