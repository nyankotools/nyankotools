import { parseAllDocuments, visit, isScalar } from 'yaml';

export interface YamlFormatOptions {
  /** インデント幅（2〜8）。既定は2 */
  indent?: number;
  /** マップのキーを昇順に並べ替える（ネストも対象） */
  sortKeys?: boolean;
  /** {a: 1} や [x, y] のフロー形式をブロック形式に展開する */
  expandFlow?: boolean;
}

export interface YamlFormatSuccess {
  success: true;
  output: string;
  /** 入力に含まれるドキュメント数 */
  documents: number;
}

export interface YamlFormatFailure {
  success: false;
  message: string;
  line: number | null;
  column: number | null;
  /** 何番目のドキュメントで見つかったか（1始まり） */
  document: number;
}

export type YamlFormatOutcome = YamlFormatSuccess | YamlFormatFailure;

function cleanMessage(message: string): string {
  // yaml ライブラリの整形済みメッセージから位置と抜粋を取り除く
  const firstLine = message.split('\n')[0] ?? message;
  return firstLine.replace(/\s+at line \d+, column \d+:?$/, '').trim();
}

function compareKeys(a: unknown, b: unknown): number {
  const x = String(a);
  const y = String(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

export function formatYaml(
  input: string,
  options: YamlFormatOptions = {},
): YamlFormatOutcome {
  const indent = Math.min(8, Math.max(1, Math.floor(options.indent ?? 2)));
  const sortKeys = options.sortKeys ?? false;
  const expandFlow = options.expandFlow ?? false;

  let docs;
  try {
    docs = parseAllDocuments(input, { prettyErrors: true });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      line: null,
      column: null,
      document: 1,
    };
  }
  const list = Array.isArray(docs) ? docs : [docs];

  for (let i = 0; i < list.length; i++) {
    const err = list[i].errors[0];
    if (err) {
      const pos = err.linePos?.[0];
      return {
        success: false,
        message: cleanMessage(err.message),
        line: pos ? pos.line : null,
        column: pos ? pos.col : null,
        document: i + 1,
      };
    }
  }

  const parts = list.map((doc, index) => {
    if (sortKeys || expandFlow) {
      visit(doc, {
        Map(_key, node) {
          if (sortKeys) {
            node.items.sort((a, b) =>
              compareKeys(
                isScalar(a.key) ? a.key.value : a.key,
                isScalar(b.key) ? b.key.value : b.key,
              ),
            );
          }
          if (expandFlow && node.items.length > 0) node.flow = false;
        },
        Seq(_key, node) {
          if (expandFlow && node.items.length > 0) node.flow = false;
        },
      });
    }
    // 2つ目以降は区切りの --- を自前で付けるため、元の明示マーカーは外す
    if (index > 0) doc.directives.docStart = null;
    return doc.toString({ indent, lineWidth: 0 }).replace(/\n+$/, '');
  });
  const output = parts.length <= 1 ? (parts[0] ?? '') : parts.join('\n---\n');
  return { success: true, output, documents: list.length };
}
