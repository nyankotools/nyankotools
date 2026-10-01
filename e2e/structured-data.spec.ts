import { test, expect } from './helpers/test';

// 構造化データの name は SEO title（「無料」等を含む）ではなく h1 を使う。

for (const path of ['/tools/char-counter/', '/en/tools/char-counter/']) {
  test(`構造化データの name が h1 と一致する: ${path}`, async ({ page }) => {
    await page.goto(path);
    const h1 = (await page.locator('main h1').textContent())?.trim();
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const nodes = scripts.map((s) => JSON.parse(s) as Record<string, unknown>);

    const app = nodes.find((n) => n['@type'] === 'SoftwareApplication');
    expect(app?.name).toBe(h1);

    const breadcrumb = nodes.find((n) => n['@type'] === 'BreadcrumbList') as {
      itemListElement: { name: string }[];
    };
    expect(breadcrumb.itemListElement[1].name).toBe(h1);
  });
}
