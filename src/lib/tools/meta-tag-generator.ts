export type TwitterCardType = 'summary' | 'summary_large_image';

export interface MetaTagInput {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  siteName: string;
  twitterCard: TwitterCardType;
  twitterSite: string;
  locale: string;
}

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 先頭の`@`（複数可）を取り除いたうえで単一の`@`を補い、前後の空白は取り除く */
export function normalizeTwitterHandle(value: string): string {
  const trimmed = value.trim().replace(/^@+/, '');
  if (!trimmed) return '';
  return `@${trimmed}`;
}

/**
 * 基本メタタグ・OGP・Twitter Cardのブロックに分けて生成する。
 * 各行は値が入力されている項目のみ出力し、ブロック間は空行区切り。
 */
export function buildMetaTags(input: MetaTagInput): string {
  const title = input.title.trim();
  const description = input.description.trim();
  const url = input.url.trim();
  const imageUrl = input.imageUrl.trim();
  const siteName = input.siteName.trim();
  const twitterSite = normalizeTwitterHandle(input.twitterSite);
  const locale = input.locale.trim();

  const basicLines: string[] = [];
  if (title) basicLines.push(`<title>${escapeHtmlAttribute(title)}</title>`);
  if (description) {
    basicLines.push(
      `<meta name="description" content="${escapeHtmlAttribute(description)}">`,
    );
  }
  if (url) {
    basicLines.push(
      `<link rel="canonical" href="${escapeHtmlAttribute(url)}">`,
    );
  }

  const ogLines: string[] = [];
  if (title) {
    ogLines.push(
      `<meta property="og:title" content="${escapeHtmlAttribute(title)}">`,
    );
  }
  if (description) {
    ogLines.push(
      `<meta property="og:description" content="${escapeHtmlAttribute(description)}">`,
    );
  }
  if (title || description || url || imageUrl || siteName || locale) {
    ogLines.push(`<meta property="og:type" content="website">`);
  }
  if (url) {
    ogLines.push(
      `<meta property="og:url" content="${escapeHtmlAttribute(url)}">`,
    );
  }
  if (imageUrl) {
    ogLines.push(
      `<meta property="og:image" content="${escapeHtmlAttribute(imageUrl)}">`,
    );
  }
  if (siteName) {
    ogLines.push(
      `<meta property="og:site_name" content="${escapeHtmlAttribute(siteName)}">`,
    );
  }
  if (locale) {
    ogLines.push(
      `<meta property="og:locale" content="${escapeHtmlAttribute(locale)}">`,
    );
  }

  const twitterLines: string[] = [];
  if (title || description || imageUrl || twitterSite) {
    twitterLines.push(
      `<meta name="twitter:card" content="${input.twitterCard}">`,
    );
    if (title) {
      twitterLines.push(
        `<meta name="twitter:title" content="${escapeHtmlAttribute(title)}">`,
      );
    }
    if (description) {
      twitterLines.push(
        `<meta name="twitter:description" content="${escapeHtmlAttribute(description)}">`,
      );
    }
    if (imageUrl) {
      twitterLines.push(
        `<meta name="twitter:image" content="${escapeHtmlAttribute(imageUrl)}">`,
      );
    }
    if (twitterSite) {
      twitterLines.push(
        `<meta name="twitter:site" content="${escapeHtmlAttribute(twitterSite)}">`,
      );
    }
  }

  return [basicLines, ogLines, twitterLines]
    .filter((block) => block.length > 0)
    .map((block) => block.join('\n'))
    .join('\n\n');
}

/** URLからドメイン部分のみを取り出す。不正なURLなら空文字を返す */
export function extractDomain(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  try {
    return new URL(trimmed).hostname;
  } catch {
    return '';
  }
}
