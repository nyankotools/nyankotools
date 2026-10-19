export type JsonLdType = 'faq' | 'article' | 'product' | 'breadcrumb';

export interface JsonLdInput {
  type: JsonLdType;
  /** FAQPage: 空行区切りのブロック。各ブロックの1行目が質問、2行目以降が回答 */
  faqText: string;
  /** Article */
  articleType: 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  articleDescription: string;
  articleImage: string;
  articleUrl: string;
  authorName: string;
  authorUrl: string;
  publisherName: string;
  publisherLogo: string;
  datePublished: string;
  dateModified: string;
  /** Product */
  productName: string;
  productDescription: string;
  productImage: string;
  productUrl: string;
  brand: string;
  sku: string;
  price: string;
  currency: string;
  availability: ProductAvailability | '';
  /** BreadcrumbList: 1行1項目、`名前 | URL`（URLは最後の項目では省略可） */
  breadcrumbText: string;
}

export type ProductAvailability =
  'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';

export const PRODUCT_AVAILABILITIES: ProductAvailability[] = [
  'InStock',
  'OutOfStock',
  'PreOrder',
  'Discontinued',
];

export function createEmptyInput(): JsonLdInput {
  return {
    type: 'faq',
    faqText: '',
    articleType: 'Article',
    headline: '',
    articleDescription: '',
    articleImage: '',
    articleUrl: '',
    authorName: '',
    authorUrl: '',
    publisherName: '',
    publisherLogo: '',
    datePublished: '',
    dateModified: '',
    productName: '',
    productDescription: '',
    productImage: '',
    productUrl: '',
    brand: '',
    sku: '',
    price: '',
    currency: 'JPY',
    availability: 'InStock',
    breadcrumbText: '',
  };
}

type JsonObject = Record<string, unknown>;

/** 空文字・空配列・空オブジェクトの値を取り除く（`@type` のみのオブジェクトも除く） */
function compact(obj: JsonObject): JsonObject | null {
  const out: JsonObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  const keys = Object.keys(out).filter((k) => k !== '@type');
  return keys.length > 0 ? out : null;
}

export function parseFaq(text: string): { question: string; answer: string }[] {
  const items: { question: string; answer: string }[] = [];
  const blocks = text.replace(/\r\n?/g, '\n').split(/\n\s*\n/);
  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '');
    if (lines.length < 2) continue;
    const question = lines[0].replace(/^(?:Q\s*[:：]|質問\s*[:：.．])\s*/, '');
    const answer = lines
      .slice(1)
      .join('\n')
      .replace(/^(?:A\s*[:：]|回答\s*[:：.．])\s*/, '');
    if (question && answer) items.push({ question, answer });
  }
  return items;
}

export function parseBreadcrumb(text: string): { name: string; url: string }[] {
  const items: { name: string; url: string }[] = [];
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const idx = line.lastIndexOf('|');
    let name = line;
    let url = '';
    if (idx >= 0) {
      name = line.slice(0, idx).trim();
      url = line.slice(idx + 1).trim();
    }
    if (!name) continue;
    items.push({ name, url });
  }
  return items;
}

function buildFaq(input: JsonLdInput): JsonObject | null {
  const items = parseFaq(input.faqText);
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

function buildArticle(input: JsonLdInput): JsonObject | null {
  const authorName = input.authorName.trim();
  const publisherName = input.publisherName.trim();
  const publisherLogo = input.publisherLogo.trim();
  const body = compact({
    '@type': input.articleType,
    headline: input.headline.trim(),
    description: input.articleDescription.trim(),
    image: input.articleImage.trim(),
    mainEntityOfPage: input.articleUrl.trim()
      ? { '@type': 'WebPage', '@id': input.articleUrl.trim() }
      : '',
    author: authorName
      ? compact({
          '@type': 'Person',
          name: authorName,
          url: input.authorUrl.trim(),
        })
      : '',
    publisher: publisherName
      ? compact({
          '@type': 'Organization',
          name: publisherName,
          logo: publisherLogo
            ? { '@type': 'ImageObject', url: publisherLogo }
            : '',
        })
      : '',
    datePublished: input.datePublished.trim(),
    dateModified: input.dateModified.trim(),
  });
  if (!body) return null;
  return { '@context': 'https://schema.org', ...body };
}

/** 数値として解釈できる価格文字列のみ通す（カンマ除去）。不正なら空文字 */
export function normalizePrice(value: string): string {
  const cleaned = value.trim().replace(/,/g, '');
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return '';
  return cleaned;
}

function buildProduct(input: JsonLdInput): JsonObject | null {
  const price = normalizePrice(input.price);
  const currency = input.currency.trim().toUpperCase();
  const brand = input.brand.trim();
  const offers = price
    ? compact({
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        availability: input.availability
          ? `https://schema.org/${input.availability}`
          : '',
        url: input.productUrl.trim(),
      })
    : '';
  const body = compact({
    '@type': 'Product',
    name: input.productName.trim(),
    description: input.productDescription.trim(),
    image: input.productImage.trim(),
    sku: input.sku.trim(),
    brand: brand ? { '@type': 'Brand', name: brand } : '',
    offers,
  });
  if (!body) return null;
  return { '@context': 'https://schema.org', ...body };
}

function buildBreadcrumb(input: JsonLdInput): JsonObject | null {
  const items = parseBreadcrumb(input.breadcrumbText);
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const entry: JsonObject = {
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
      };
      if (item.url) entry.item = item.url;
      return entry;
    }),
  };
}

/** 入力から JSON-LD オブジェクトを作る。出力する項目が無ければ null */
export function buildJsonLdObject(input: JsonLdInput): JsonObject | null {
  switch (input.type) {
    case 'faq':
      return buildFaq(input);
    case 'article':
      return buildArticle(input);
    case 'product':
      return buildProduct(input);
    case 'breadcrumb':
      return buildBreadcrumb(input);
  }
}

/**
 * `<script>` 内に埋め込んでも HTML パーサに閉じられないよう、
 * JSON 文字列中の `<` `>` `&` と行区切り文字を \u エスケープする（JSON としては等価）。
 */
export function escapeForScript(json: string): string {
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(String.fromCharCode(0x2028))
    .join('\\u2028')
    .split(String.fromCharCode(0x2029))
    .join('\\u2029');
}

export function serializeJsonLd(obj: JsonObject, minify = false): string {
  const json = minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
  return escapeForScript(json);
}

export function wrapScriptTag(json: string): string {
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

/** 空なら空文字、そうでなければ `<script>` タグ付きの出力を返す */
export function generateJsonLd(input: JsonLdInput, minify = false): string {
  const obj = buildJsonLdObject(input);
  if (!obj) return '';
  return wrapScriptTag(serializeJsonLd(obj, minify));
}
