export interface TextCaseResult {
  camelCase: string;
  pascalCase: string;
  snakeCase: string;
  kebabCase: string;
  constantCase: string;
  titleCase: string;
  sentenceCase: string;
  lowerCase: string;
  upperCase: string;
}

const EMPTY_RESULT: TextCaseResult = {
  camelCase: '',
  pascalCase: '',
  snakeCase: '',
  kebabCase: '',
  constantCase: '',
  titleCase: '',
  sentenceCase: '',
  lowerCase: '',
  upperCase: '',
};

/**
 * camelCase/PascalCase の連続大文字（例: XMLHttp）も考慮して単語境界を推定し、
 * スペース・アンダースコア・ハイフン・ドット・スラッシュ区切りの単語配列（すべて小文字）に分解する。
 */
export function splitWords(input: string): string[] {
  const normalized = input
    .replace(/[_\-./]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .trim();

  if (normalized === '') {
    return [];
  }

  return normalized
    .split(/\s+/)
    .filter((word) => word !== '')
    .map((word) => word.toLowerCase());
}

function capitalize(word: string): string {
  if (word === '') return '';
  return word[0].toUpperCase() + word.slice(1);
}

export function convertTextCase(input: string): TextCaseResult {
  const words = splitWords(input);
  if (words.length === 0) {
    return { ...EMPTY_RESULT };
  }

  const snakeCase = words.join('_');
  const lowerCase = words.join(' ');

  return {
    camelCase: words
      .map((word, index) => (index === 0 ? word : capitalize(word)))
      .join(''),
    pascalCase: words.map(capitalize).join(''),
    snakeCase,
    kebabCase: words.join('-'),
    constantCase: snakeCase.toUpperCase(),
    titleCase: words.map(capitalize).join(' '),
    sentenceCase: capitalize(lowerCase),
    lowerCase,
    upperCase: lowerCase.toUpperCase(),
  };
}
