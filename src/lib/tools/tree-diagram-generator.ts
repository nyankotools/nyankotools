import { displayWidth } from './ascii-table-generator';

export type TreeStyle = 'unicode' | 'ascii';
export type IndentUnit = 'auto' | '2' | '4' | 'tab';
export type CommentMarker = '#' | '//';

export interface TreeOptions {
  style: TreeStyle;
  indent: IndentUnit;
  /** 単一のルートを表示するか（複数ルートのときは常に表示） */
  showRoot: boolean;
  /** 表示する最大の深さ（入力のルート=1）。0 なら制限なし */
  maxDepth: number;
  /** ` # ` や ` // ` 以降をコメントとして桁揃えする */
  comments: boolean;
  /** 出力するコメントの記号 */
  commentMarker: CommentMarker;
}

export type TreeErrorReason =
  'inconsistent-indent' | 'skipped-level' | 'bad-first-indent' | 'empty-name';

export type TreeOutcome =
  | { success: true; output: string; nodes: number }
  | { success: false; reason: TreeErrorReason; line: number };

interface TreeNode {
  name: string;
  comment: string;
  children: TreeNode[];
}

const BULLET = /^[-*+] +/;

const CONNECTORS: Record<
  TreeStyle,
  { branch: string; last: string; pipe: string; blank: string }
> = {
  unicode: { branch: '├── ', last: '└── ', pipe: '│   ', blank: '    ' },
  ascii: { branch: '|-- ', last: '`-- ', pipe: '|   ', blank: '    ' },
};

interface RawLine {
  lineNumber: number;
  /** 先頭の空白（箇条書き記号より前） */
  indent: string;
  body: string;
}

/** 名前とコメントを分ける（空白に挟まれた # または //） */
export function splitComment(
  body: string,
  enabled: boolean,
): { name: string; comment: string } {
  if (!enabled) return { name: body.trim(), comment: '' };
  const match = /(^|\s)(#|\/\/)(\s|$)/.exec(body);
  if (!match) return { name: body.trim(), comment: '' };
  const markerStart = match.index + match[1].length;
  return {
    name: body.slice(0, match.index).trim(),
    comment: body.slice(markerStart + match[2].length).trim(),
  };
}

export function parseIndentedTree(
  input: string,
  options: Pick<TreeOptions, 'indent' | 'comments'>,
): { success: true; roots: TreeNode[]; nodes: number } | TreeErrorResult {
  const raw: RawLine[] = [];
  input.split(/\r\n|\r|\n/).forEach((line, i) => {
    if (line.trim() === '') return;
    const m = /^[ \t]*/.exec(line)!;
    raw.push({
      lineNumber: i + 1,
      indent: m[0],
      body: line.slice(m[0].length).trimEnd(),
    });
  });
  if (raw.length === 0) return { success: true, roots: [], nodes: 0 };

  // すべての行が箇条書き記号で始まるときだけ記号を取り除く
  if (raw.every((line) => BULLET.test(line.body))) {
    for (const line of raw) line.body = line.body.replace(BULLET, '');
  }

  let unit: number;
  if (options.indent === 'tab') unit = 1;
  else if (options.indent === '2' || options.indent === '4')
    unit = Number(options.indent);
  else {
    const spaceIndents = raw
      .filter((line) => !line.indent.includes('\t') && line.indent.length > 0)
      .map((line) => line.indent.length);
    unit = spaceIndents.length > 0 ? Math.min(...spaceIndents) : 1;
  }

  const roots: TreeNode[] = [];
  const stack: TreeNode[] = [];
  let nodes = 0;
  for (const line of raw) {
    if (options.indent === 'tab' && line.indent.includes(' ')) {
      return fail('inconsistent-indent', line.lineNumber);
    }
    let width = 0;
    for (const ch of line.indent) width += ch === '\t' ? unit : 1;
    if (width % unit !== 0) {
      return fail('inconsistent-indent', line.lineNumber);
    }
    const level = width / unit;
    if (stack.length === 0 && level !== 0) {
      return fail('bad-first-indent', line.lineNumber);
    }
    if (level > stack.length) {
      return fail('skipped-level', line.lineNumber);
    }
    const { name, comment } = splitComment(line.body, options.comments);
    if (name === '') return fail('empty-name', line.lineNumber);
    const node: TreeNode = { name, comment, children: [] };
    stack.length = level;
    if (level === 0) roots.push(node);
    else stack[level - 1].children.push(node);
    stack.push(node);
    nodes++;
  }
  return { success: true, roots, nodes };
}

interface TreeErrorResult {
  success: false;
  reason: TreeErrorReason;
  line: number;
}

function fail(reason: TreeErrorReason, line: number): TreeErrorResult {
  return { success: false, reason, line };
}

interface OutLine {
  text: string;
  comment: string;
}

export function indentedTextToTree(
  input: string,
  options: TreeOptions,
): TreeOutcome {
  const parsed = parseIndentedTree(input, options);
  if (!parsed.success) return parsed;
  const { roots, nodes } = parsed;
  if (roots.length === 0) return { success: true, output: '', nodes: 0 };

  const c = CONNECTORS[options.style];
  const out: OutLine[] = [];
  const hideRoot = !options.showRoot && roots.length === 1;
  const limit = options.maxDepth > 0 ? options.maxDepth : Infinity;

  // depth: 表示上の深さ（1始まり）
  const walk = (list: TreeNode[], prefix: string, depth: number): void => {
    list.forEach((node, index) => {
      const isLast = index === list.length - 1;
      out.push({
        text: prefix + (isLast ? c.last : c.branch) + node.name,
        comment: node.comment,
      });
      const childPrefix = prefix + (isLast ? c.blank : c.pipe);
      emitChildren(node, childPrefix, depth);
    });
  };
  const emitChildren = (node: TreeNode, prefix: string, depth: number) => {
    if (node.children.length === 0) return;
    if (depth >= limit) {
      out.push({ text: prefix + c.last + '...', comment: '' });
      return;
    }
    walk(node.children, prefix, depth + 1);
  };

  if (hideRoot) {
    const root = roots[0];
    if (limit >= 1) {
      // ルートを隠すと子が深さ1になる
      if (root.children.length > 0) walk(root.children, '', 1);
    }
  } else {
    for (const root of roots) {
      out.push({ text: root.name, comment: root.comment });
      emitChildren(root, '', 1);
    }
  }

  const hasComment = out.some((line) => line.comment !== '');
  const column = hasComment
    ? Math.max(...out.map((line) => displayWidth(line.text))) + 2
    : 0;
  const marker = options.commentMarker;
  const lines = out.map((line) =>
    line.comment === ''
      ? line.text
      : line.text +
        ' '.repeat(column - displayWidth(line.text)) +
        marker +
        ' ' +
        line.comment,
  );
  return { success: true, output: lines.join('\n'), nodes };
}

export interface ReverseOptions {
  indent: IndentUnit;
  /** 各行の先頭に「- 」を付ける */
  bullets: boolean;
}

const CONNECTOR_PREFIX = /^[\s│|]*(?:[├└]─{1,2}|[|`+]-{1,2})\s?/;

/** ツリー図（├── └── │ または |-- `--）をインデント付きテキストへ戻す */
export function treeToIndentedText(
  input: string,
  options: ReverseOptions,
): { output: string; lines: number } {
  const items: { level: number; text: string }[] = [];
  for (const line of input.split(/\r\n|\r|\n/)) {
    if (line.trim() === '') continue;
    const m = CONNECTOR_PREFIX.exec(line);
    const level = m ? Math.max(1, Math.round(m[0].length / 4)) : 0;
    const rest = (m ? line.slice(m[0].length) : line)
      .trim()
      .replace(/\s{2,}(#|\/\/)(\s|$)/, ' $1$2');
    items.push({ level, text: rest });
  }
  if (items.length === 0) return { output: '', lines: 0 };
  // ルートが無い（すべて枝付き）ときは最小の深さを0に揃える
  const min = Math.min(...items.map((item) => item.level));
  const unit =
    options.indent === 'tab'
      ? '\t'
      : ' '.repeat(options.indent === '4' ? 4 : 2);
  const lines = items.map(
    (item) =>
      unit.repeat(item.level - min) + (options.bullets ? '- ' : '') + item.text,
  );
  return { output: lines.join('\n'), lines: lines.length };
}
