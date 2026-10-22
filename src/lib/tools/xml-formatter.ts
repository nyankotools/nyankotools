import { XMLValidator } from 'fast-xml-parser';

export type XmlIndent = '2' | '4' | 'tab' | 'min';

export interface XmlFormatOptions {
  /** '2' / '4' はスペース、'tab' はタブで整形、'min' はミニファイ */
  indent?: XmlIndent;
  /** true のとき、属性が2つ以上ある開始タグを属性ごとに改行する（整形時のみ） */
  breakAttributes?: boolean;
  /** true のとき、コメントを取り除く */
  removeComments?: boolean;
}

export interface XmlFormatSuccess {
  success: true;
  output: string;
}

export interface XmlFormatFailure {
  success: false;
  message: string;
  line: number | null;
  column: number | null;
}

export type XmlFormatOutcome = XmlFormatSuccess | XmlFormatFailure;

interface Attr {
  name: string;
  quote: string;
  value: string;
}

type XmlNode =
  | { type: 'text'; value: string }
  | { type: 'cdata' | 'comment' | 'pi' | 'doctype'; raw: string }
  | {
      type: 'element';
      name: string;
      attrs: Attr[];
      selfClosing: boolean;
      children: XmlNode[];
    };

type Element = Extract<XmlNode, { type: 'element' }>;

function parseAttrs(source: string): Attr[] {
  const attrs: Attr[] = [];
  const re = /([^\s=/>]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    const quote = m[2][0];
    attrs.push({
      name: m[1],
      quote,
      value: quote === '"' ? m[3] : m[4],
    });
  }
  return attrs;
}

/** 検証済みの XML をノードツリーにする。タグ内の引用符つき属性値に含まれる > を考慮する。 */
function parseTree(input: string): XmlNode[] {
  const root: XmlNode[] = [];
  const stack: Element[] = [];
  const current = (): XmlNode[] =>
    stack.length > 0 ? stack[stack.length - 1].children : root;

  let i = 0;
  const n = input.length;
  while (i < n) {
    if (input[i] !== '<') {
      let end = input.indexOf('<', i);
      if (end === -1) end = n;
      current().push({ type: 'text', value: input.slice(i, end) });
      i = end;
      continue;
    }
    if (input.startsWith('<!--', i)) {
      const end = input.indexOf('-->', i + 4);
      if (end === -1) throw new Error('Unterminated comment');
      current().push({ type: 'comment', raw: input.slice(i, end + 3) });
      i = end + 3;
    } else if (input.startsWith('<![CDATA[', i)) {
      const end = input.indexOf(']]>', i + 9);
      if (end === -1) throw new Error('Unterminated CDATA');
      current().push({ type: 'cdata', raw: input.slice(i, end + 3) });
      i = end + 3;
    } else if (input.startsWith('<?', i)) {
      const end = input.indexOf('?>', i + 2);
      if (end === -1) throw new Error('Unterminated processing instruction');
      current().push({ type: 'pi', raw: input.slice(i, end + 2) });
      i = end + 2;
    } else if (input.startsWith('<!', i)) {
      // DOCTYPE: 内部サブセット [...] と引用符を考慮して閉じ > を探す
      let depth = 0;
      let quote = '';
      let j = i + 2;
      for (; j < n; j++) {
        const c = input[j];
        if (quote) {
          if (c === quote) quote = '';
        } else if (c === '"' || c === "'") quote = c;
        else if (c === '[') depth++;
        else if (c === ']') depth--;
        else if (c === '>' && depth <= 0) break;
      }
      if (j >= n) throw new Error('Unterminated declaration');
      current().push({ type: 'doctype', raw: input.slice(i, j + 1) });
      i = j + 1;
    } else if (input.startsWith('</', i)) {
      const end = input.indexOf('>', i + 2);
      if (end === -1) throw new Error('Unterminated closing tag');
      const name = input.slice(i + 2, end).trim();
      const open = stack.pop();
      if (!open || open.name !== name) throw new Error('Mismatched tag');
      i = end + 1;
    } else {
      let quote = '';
      let j = i + 1;
      for (; j < n; j++) {
        const c = input[j];
        if (quote) {
          if (c === quote) quote = '';
        } else if (c === '"' || c === "'") quote = c;
        else if (c === '>') break;
      }
      if (j >= n) throw new Error('Unterminated tag');
      let body = input.slice(i + 1, j);
      const selfClosing = body.endsWith('/');
      if (selfClosing) body = body.slice(0, -1);
      const nameMatch = /^[^\s/>]+/.exec(body);
      if (!nameMatch) throw new Error('Missing tag name');
      const el: Element = {
        type: 'element',
        name: nameMatch[0],
        attrs: parseAttrs(body.slice(nameMatch[0].length)),
        selfClosing,
        children: [],
      };
      current().push(el);
      if (!selfClosing) stack.push(el);
      i = j + 1;
    }
  }
  if (stack.length > 0) throw new Error('Unclosed tag');
  return root;
}

function isBlank(node: XmlNode): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

/** 非空白のテキストや CDATA を直接の子に持つ要素（混在コンテンツ）。空白を変えると意味が変わるため整形しない。 */
function hasTextContent(el: Element): boolean {
  return el.children.some(
    (c) => c.type === 'cdata' || (c.type === 'text' && c.value.trim() !== ''),
  );
}

function attrText(a: Attr): string {
  return `${a.name}=${a.quote}${a.value}${a.quote}`;
}

function openTag(
  el: Element,
  selfClose: boolean,
  breakAttrs: boolean,
  attrIndent: string,
): string {
  const end = selfClose ? '/>' : '>';
  if (el.attrs.length === 0) return `<${el.name}${end}`;
  if (breakAttrs && el.attrs.length >= 2) {
    return `<${el.name}\n${el.attrs
      .map((a) => attrIndent + attrText(a))
      .join('\n')}${end}`;
  }
  return `<${el.name} ${el.attrs.map(attrText).join(' ')}${end}`;
}

/** 空白を変えずに直列化する（混在コンテンツ内部用） */
function serializeRaw(node: XmlNode, removeComments: boolean): string {
  switch (node.type) {
    case 'text':
      return node.value;
    case 'comment':
      return removeComments ? '' : node.raw;
    case 'cdata':
    case 'pi':
    case 'doctype':
      return node.raw;
    case 'element': {
      if (node.selfClosing) return openTag(node, true, false, '');
      return `${openTag(node, false, false, '')}${node.children
        .map((c) => serializeRaw(c, removeComments))
        .join('')}</${node.name}>`;
    }
  }
}

function printNode(
  node: XmlNode,
  depth: number,
  unit: string,
  opts: { breakAttributes: boolean; removeComments: boolean },
  lines: string[],
): void {
  const pad = unit.repeat(depth);
  switch (node.type) {
    case 'text': {
      const t = node.value.trim();
      if (t) lines.push(pad + t);
      return;
    }
    case 'comment':
      if (!opts.removeComments) lines.push(pad + node.raw);
      return;
    case 'cdata':
    case 'pi':
    case 'doctype':
      lines.push(pad + node.raw);
      return;
    case 'element': {
      const attrIndent = unit.repeat(depth + 1);
      if (node.selfClosing) {
        lines.push(pad + openTag(node, true, opts.breakAttributes, attrIndent));
        return;
      }
      if (hasTextContent(node)) {
        const inner = node.children
          .map((c) => serializeRaw(c, opts.removeComments))
          .join('');
        lines.push(
          pad +
            openTag(node, false, opts.breakAttributes, attrIndent) +
            inner +
            `</${node.name}>`,
        );
        return;
      }
      const children = node.children.filter(
        (c) => !isBlank(c) && !(opts.removeComments && c.type === 'comment'),
      );
      const open = openTag(node, false, opts.breakAttributes, attrIndent);
      if (children.length === 0) {
        lines.push(`${pad}${open}</${node.name}>`);
        return;
      }
      lines.push(pad + open);
      for (const c of children) printNode(c, depth + 1, unit, opts, lines);
      lines.push(`${pad}</${node.name}>`);
      return;
    }
  }
}

function minifyNodes(nodes: XmlNode[], removeComments: boolean): string {
  return nodes
    .map((node) => {
      if (node.type === 'text')
        return node.value.trim() === '' ? '' : node.value;
      if (node.type === 'comment') return removeComments ? '' : node.raw;
      if (node.type !== 'element') return node.raw;
      if (node.selfClosing) return openTag(node, true, false, '');
      const inner = hasTextContent(node)
        ? node.children.map((c) => serializeRaw(c, removeComments)).join('')
        : minifyNodes(node.children, removeComments);
      return `${openTag(node, false, false, '')}${inner}</${node.name}>`;
    })
    .join('');
}

/**
 * fast-xml-parser の検証は内部サブセット付き DOCTYPE を扱えないため、検証用にだけ
 * DOCTYPE を空白へ置き換える（改行は残すので行・列は変わらない）。
 */
function maskDoctype(input: string): string {
  const start = input.indexOf('<!DOCTYPE');
  if (start === -1) return input;
  let depth = 0;
  let quote = '';
  let end = -1;
  for (let j = start + 2; j < input.length; j++) {
    const c = input[j];
    if (quote) {
      if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '[') depth++;
    else if (c === ']') depth--;
    else if (c === '>' && depth <= 0) {
      end = j;
      break;
    }
  }
  if (end === -1) return input;
  return (
    input.slice(0, start) +
    input.slice(start, end + 1).replace(/[^\r\n]/g, ' ') +
    input.slice(end + 1)
  );
}

export function formatXml(
  input: string,
  {
    indent = '2',
    breakAttributes = false,
    removeComments = false,
  }: XmlFormatOptions = {},
): XmlFormatOutcome {
  const validation = XMLValidator.validate(maskDoctype(input));
  if (validation !== true) {
    const { msg, line, col } = validation.err;
    return { success: false, message: msg, line, column: col };
  }
  try {
    const tree = parseTree(input);
    if (tree.filter((node) => node.type === 'element').length > 1) {
      return {
        success: false,
        message: 'Multiple root elements found.',
        line: null,
        column: null,
      };
    }
    if (indent === 'min') {
      return { success: true, output: minifyNodes(tree, removeComments) };
    }
    const unit = indent === 'tab' ? '\t' : indent === '4' ? '    ' : '  ';
    const lines: string[] = [];
    for (const node of tree) {
      printNode(node, 0, unit, { breakAttributes, removeComments }, lines);
    }
    return { success: true, output: lines.join('\n') };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      line: null,
      column: null,
    };
  }
}
