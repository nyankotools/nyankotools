import { describe, expect, it } from 'vitest';
import {
  buildJsonLdObject,
  createEmptyInput,
  escapeForScript,
  generateJsonLd,
  normalizePrice,
  parseBreadcrumb,
  parseFaq,
  type JsonLdInput,
} from './jsonld-generator';

function input(patch: Partial<JsonLdInput>): JsonLdInput {
  return { ...createEmptyInput(), ...patch };
}

function parseOutput(out: string): Record<string, unknown> {
  const m = out.match(
    /^<script type="application\/ld\+json">\n([\s\S]*)\n<\/script>$/,
  );
  expect(m).not.toBeNull();
  return JSON.parse(m![1]) as Record<string, unknown>;
}

describe('parseFaq', () => {
  it('空行区切りで質問と回答に分ける', () => {
    expect(parseFaq('Q1\nA1\n\nQ2\nA2 line1\nA2 line2')).toEqual([
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2 line1\nA2 line2' },
    ]);
  });
  it('Q:/A: の接頭辞を取り除く', () => {
    expect(parseFaq('Q: なに？\nA: これ')).toEqual([
      { question: 'なに？', answer: 'これ' },
    ]);
  });
  it('回答が無いブロックと空入力は無視', () => {
    expect(parseFaq('質問だけ')).toEqual([]);
    expect(parseFaq('')).toEqual([]);
  });
  it('CRLFにも対応する', () => {
    expect(parseFaq('Q\r\nA\r\n\r\nQ2\r\nA2')).toHaveLength(2);
  });
});

describe('parseBreadcrumb', () => {
  it('名前とURLを分ける', () => {
    expect(parseBreadcrumb('Home | https://a.com/\n記事')).toEqual([
      { name: 'Home', url: 'https://a.com/' },
      { name: '記事', url: '' },
    ]);
  });
  it('名前が空の行と空行は無視', () => {
    expect(parseBreadcrumb(' | https://a.com\n\n')).toEqual([]);
  });
});

describe('normalizePrice', () => {
  it('カンマ除去・不正値は空', () => {
    expect(normalizePrice('1,980')).toBe('1980');
    expect(normalizePrice('12.5')).toBe('12.5');
    expect(normalizePrice('abc')).toBe('');
    expect(normalizePrice('-1')).toBe('');
  });
});

describe('generateJsonLd', () => {
  it('入力が空なら空文字', () => {
    for (const type of ['faq', 'article', 'product', 'breadcrumb'] as const) {
      expect(generateJsonLd(input({ type }))).toBe('');
    }
  });

  it('FAQPage を生成する', () => {
    const obj = parseOutput(
      generateJsonLd(input({ type: 'faq', faqText: 'Q\nA' })),
    );
    expect(obj['@type']).toBe('FAQPage');
    expect(obj['@context']).toBe('https://schema.org');
    expect(obj.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'Q',
        acceptedAnswer: { '@type': 'Answer', text: 'A' },
      },
    ]);
  });

  it('Article は入力した項目のみ出力する', () => {
    const obj = parseOutput(
      generateJsonLd(
        input({
          type: 'article',
          articleType: 'BlogPosting',
          headline: 'タイトル',
          authorName: '太郎',
          datePublished: '2026-10-19',
        }),
      ),
    );
    expect(obj['@type']).toBe('BlogPosting');
    expect(obj.headline).toBe('タイトル');
    expect(obj.author).toEqual({ '@type': 'Person', name: '太郎' });
    expect(obj).not.toHaveProperty('publisher');
    expect(obj).not.toHaveProperty('image');
  });

  it('Article の publisher にロゴを入れる', () => {
    const obj = buildJsonLdObject(
      input({
        type: 'article',
        headline: 'h',
        publisherName: 'P',
        publisherLogo: 'https://a.com/l.png',
      }),
    );
    expect(obj?.publisher).toEqual({
      '@type': 'Organization',
      name: 'P',
      logo: { '@type': 'ImageObject', url: 'https://a.com/l.png' },
    });
  });

  it('Product に Offer を付ける', () => {
    const obj = parseOutput(
      generateJsonLd(
        input({
          type: 'product',
          productName: '商品',
          brand: 'B',
          price: '1,980',
          currency: 'jpy',
          availability: 'OutOfStock',
        }),
      ),
    );
    expect(obj.brand).toEqual({ '@type': 'Brand', name: 'B' });
    expect(obj.offers).toEqual({
      '@type': 'Offer',
      price: '1980',
      priceCurrency: 'JPY',
      availability: 'https://schema.org/OutOfStock',
    });
  });

  it('Product は価格が不正なら offers を出さない', () => {
    const obj = buildJsonLdObject(
      input({ type: 'product', productName: 'x', price: 'abc' }),
    );
    expect(obj).not.toHaveProperty('offers');
  });

  it('商品の他項目が空で価格だけの場合も Offer を出す', () => {
    const obj = buildJsonLdObject(input({ type: 'product', price: '10' }));
    expect(obj?.offers).toBeDefined();
  });

  it('BreadcrumbList は position を振り、URL が無い項目は item を省く', () => {
    const obj = parseOutput(
      generateJsonLd(
        input({
          type: 'breadcrumb',
          breadcrumbText: 'Home | https://a.com/\n記事',
        }),
      ),
    );
    expect(obj.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://a.com/',
      },
      { '@type': 'ListItem', position: 2, name: '記事' },
    ]);
  });

  it('</script> を含む入力でもスクリプトを閉じない', () => {
    const out = generateJsonLd(
      input({
        type: 'faq',
        faqText: 'Q</script><script>alert(1)</script>\nA <!-- & -->',
      }),
    );
    const inner = out.slice(
      '<script type="application/ld+json">'.length,
      -'</script>'.length,
    );
    expect(inner).not.toContain('<');
    expect(inner).not.toContain('>');
    const obj = JSON.parse(inner) as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };
    expect(obj.mainEntity[0].name).toBe('Q</script><script>alert(1)</script>');
    expect(obj.mainEntity[0].acceptedAnswer.text).toBe('A <!-- & -->');
  });

  it('minify で改行なしの JSON になる', () => {
    const out = generateJsonLd(input({ type: 'faq', faqText: 'Q\nA' }), true);
    expect(out.split('\n')).toHaveLength(3);
  });
});

describe('エッジケース（追加）', () => {
  it('FAQ の全角接頭辞（質問：／回答：）を取り除く', () => {
    expect(parseFaq('質問：なに\n回答：これ')).toEqual([
      { question: 'なに', answer: 'これ' },
    ]);
    expect(parseFaq('質問．なに\n回答．これ')).toEqual([
      { question: 'なに', answer: 'これ' },
    ]);
  });

  it('Q: の後に質問本文が無いブロックは捨てる', () => {
    expect(parseFaq('Q:\nA')).toEqual([]);
  });

  it('Question: のような長い接頭辞は除去しない', () => {
    expect(parseFaq('Question: x\nA')).toEqual([
      { question: 'Question: x', answer: 'A' },
    ]);
  });

  it('FAQ の HTML 特殊文字は JSON として復元でき、&・<・> は生で出ない', () => {
    const out = generateJsonLd(
      input({ type: 'faq', faqText: 'A & B <b>x</b>\n1 > 0 & 2 < 3' }),
    );
    const inner = out.slice(
      '<script type="application/ld+json">\n'.length,
      -'\n</script>'.length,
    );
    expect(inner).not.toMatch(/[<>&]/);
    const obj = parseOutput(out) as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };
    expect(obj.mainEntity[0].name).toBe('A & B <b>x</b>');
    expect(obj.mainEntity[0].acceptedAnswer.text).toBe('1 > 0 & 2 < 3');
  });

  it('絵文字（サロゲートペア）は壊さず往復できる', () => {
    const obj = parseOutput(
      generateJsonLd(input({ type: 'faq', faqText: 'Q😀家族\nA🎉👨‍👩‍👧' })),
    ) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(obj.mainEntity[0].name).toBe('Q😀家族');
    expect(obj.mainEntity[0].acceptedAnswer.text).toBe('A🎉👨‍👩‍👧');
  });

  it('孤立サロゲートは JSON として有効な \\ud800 形式で出力され、往復で元に戻る', () => {
    const out = generateJsonLd(input({ type: 'faq', faqText: 'Q\uD800x\nA' }));
    expect(out).toContain('\\ud800');
    const obj = parseOutput(out) as {
      mainEntity: { name: string }[];
    };
    expect(obj.mainEntity[0].name).toBe('Q\uD800x');
  });

  it('Article: publisher 名が空ならロゴだけでは publisher を出さない', () => {
    const obj = buildJsonLdObject(
      input({
        type: 'article',
        headline: 'h',
        publisherLogo: 'https://a.com/l.png',
      }),
    );
    expect(obj).not.toHaveProperty('publisher');
  });

  it('Article: 公開日のみでも出力する', () => {
    const obj = buildJsonLdObject(
      input({ type: 'article', dateModified: '2026-01-01' }),
    );
    expect(obj).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      dateModified: '2026-01-01',
    });
  });

  it('Article: mainEntityOfPage・author の URL は各値の時だけ出す', () => {
    const obj = buildJsonLdObject(
      input({
        type: 'article',
        headline: 'h',
        articleUrl: ' https://a.com/p ',
        authorName: 'A',
      }),
    );
    expect(obj?.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://a.com/p',
    });
    expect(obj?.author).toEqual({ '@type': 'Person', name: 'A' });
  });

  it('Product: 価格 0 は有効、availability 空なら availability を出さない', () => {
    const obj = buildJsonLdObject(
      input({
        type: 'product',
        productName: 'x',
        price: '0',
        availability: '',
      }),
    );
    expect(obj?.offers).toEqual({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    });
  });

  it('Product: 通貨コードが空なら priceCurrency を出さない', () => {
    const obj = buildJsonLdObject(
      input({ type: 'product', price: '5', currency: '  ' }),
    );
    expect(obj?.offers).not.toHaveProperty('priceCurrency');
  });

  it('Product: 価格の桁区切り・小数を正規化し、指数表記は無効', () => {
    expect(normalizePrice(' 1,000,000.50 ')).toBe('1000000.50');
    expect(normalizePrice('1e3')).toBe('');
    expect(normalizePrice('.5')).toBe('');
    expect(normalizePrice('')).toBe('');
  });

  it('Product: 価格が不正でも商品名があれば Product は出す（offers なし）', () => {
    const obj = buildJsonLdObject(
      input({ type: 'product', productName: 'x', price: '1e3' }),
    );
    expect(obj?.name).toBe('x');
    expect(obj).not.toHaveProperty('offers');
  });

  it('BreadcrumbList: 名前の無い区切り行は飛ばし、position は詰めて振る', () => {
    expect(parseBreadcrumb('Home\n|\nBlog | ')).toEqual([
      { name: 'Home', url: '' },
      { name: 'Blog', url: '' },
    ]);
    const obj = buildJsonLdObject(
      input({ type: 'breadcrumb', breadcrumbText: 'Home\n|\nBlog' }),
    );
    expect(obj?.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home' },
      { '@type': 'ListItem', position: 2, name: 'Blog' },
    ]);
  });

  it('BreadcrumbList: 全角の｜は区切りとして扱わない', () => {
    expect(parseBreadcrumb('A｜B | https://a.com/')).toEqual([
      { name: 'A｜B', url: 'https://a.com/' },
    ]);
  });

  it('minify の出力は1行で、パースすると元と同じ', () => {
    const src = input({ type: 'faq', faqText: 'Q😀 & <\nA' });
    const min = generateJsonLd(src, true);
    const pretty = generateJsonLd(src, false);
    expect(parseOutput(min)).toEqual(parseOutput(pretty));
  });

  it('長い入力（3000件のFAQ）でも全件を出力する', () => {
    const faqText = Array.from({ length: 3000 }, (_, i) => `Q${i}\nA${i}`).join(
      '\n\n',
    );
    const obj = buildJsonLdObject(input({ type: 'faq', faqText })) as {
      mainEntity: unknown[];
    };
    expect(obj.mainEntity).toHaveLength(3000);
  });
});

describe('escapeForScript', () => {
  it('行区切り文字をエスケープする', () => {
    expect(escapeForScript('a\u2028b\u2029c')).toBe('a\\u2028b\\u2029c');
  });
});
