import { describe, expect, it } from 'vitest';
import {
  FONT_IDS,
  createBlockFont,
  loadFont,
  parseFlf,
  renderFiglet,
  wrapInComment,
} from './figlet-text';

describe('parseFlf', () => {
  it('FLF 以外はエラーにする', () => {
    expect(() => parseFlf('hello')).toThrow();
  });

  it('文字データが足りないとエラーにする', () => {
    expect(() => parseFlf('flf2a$ 2 1 5 0 0\n a@\n b@@\n')).toThrow();
  });
});

describe('書体の読み込み', () => {
  for (const id of FONT_IDS) {
    it(`${id}: 全書体で ASCII 英数字を描画できる`, async () => {
      const font = await loadFont(id);
      const result = renderFiglet(font, 'Hello World 123');
      expect(result.skipped).toEqual([]);
      expect(result.text.split('\n').length).toBeGreaterThanOrEqual(3);
      // 行の幅は揃っていなくてよいが、全行が空ではない文字を含む
      expect(result.text.trim()).not.toBe('');
    });
  }

  it('同じ書体は同じオブジェクトを返す（キャッシュ）', async () => {
    expect(await loadFont('small')).toBe(await loadFont('small'));
  });
});

describe('renderFiglet（Standard）', () => {
  it('Hi を FIGlet と同じ字形で描画する', async () => {
    const font = await loadFont('standard');
    expect(renderFiglet(font, 'Hi').text).toBe(
      [
        '  _   _ _',
        ' | | | (_)',
        ' | |_| | |',
        ' |  _  | |',
        ' |_| |_|_|',
      ].join('\n'),
    );
  });

  it('full は字間を詰めず、fitted・smush より幅が広い', async () => {
    const font = await loadFont('standard');
    const width = (layout: 'full' | 'fitted' | 'smush') =>
      Math.max(
        ...renderFiglet(font, 'Nyanko', layout)
          .text.split('\n')
          .map((l) => l.length),
      );
    expect(width('full')).toBeGreaterThan(width('fitted'));
    expect(width('fitted')).toBeGreaterThanOrEqual(width('smush'));
  });

  it('改行ごとに描画し、空行は字形の高さぶんの空白行になる', async () => {
    const font = createBlockFont();
    const one = renderFiglet(font, 'I').text.split('\n').length;
    const two = renderFiglet(font, 'I\n\nI').text.split('\n').length;
    expect(one).toBe(5);
    expect(two).toBe(one * 3);
  });

  it('未対応文字は描画せず skipped に出現順・重複なしで返す', async () => {
    const font = await loadFont('standard');
    const result = renderFiglet(font, 'A日B本日');
    expect(result.skipped).toEqual(['日', '本']);
    expect(result.text).toBe(renderFiglet(font, 'AB').text);
  });

  it('空文字は空文字を返す', async () => {
    const font = await loadFont('standard');
    expect(renderFiglet(font, '')).toEqual({ text: '', skipped: [] });
  });

  it('行末の空白は削られる', async () => {
    const font = await loadFont('standard');
    for (const line of renderFiglet(font, 'Test').text.split('\n')) {
      expect(line).toBe(line.trimEnd());
    }
  });

  it('CRLF と LF の入力で同じ結果になる', async () => {
    const font = await loadFont('small');
    expect(renderFiglet(font, 'a\r\nb').text).toBe(
      renderFiglet(font, 'a\nb').text,
    );
  });

  it('古い Mac の CR だけの改行も LF と同じ結果になる', async () => {
    const font = await loadFont('small');
    expect(renderFiglet(font, 'a\rb').text).toBe(
      renderFiglet(font, 'a\nb').text,
    );
    expect(renderFiglet(font, 'a\r\rb').text).toBe(
      renderFiglet(font, 'a\n\nb').text,
    );
  });

  it('サロゲートペア（絵文字）と全角英数は1文字ずつ未対応として返し、壊れた文字を描画しない', async () => {
    const font = await loadFont('standard');
    const result = renderFiglet(font, 'A😀Ａ B');
    expect(result.skipped).toEqual(['😀', 'Ａ']);
    expect(result.text).toBe(renderFiglet(font, 'A B').text);
  });

  it('タブは4つの空白として描画される', async () => {
    const font = await loadFont('standard');
    expect(renderFiglet(font, 'A\tB').text).toBe(
      renderFiglet(font, 'A    B').text,
    );
  });

  it('ハードブランクは出力に残らない（全書体）', async () => {
    for (const id of FONT_IDS) {
      const font = await loadFont(id);
      for (const layout of ['default', 'full', 'fitted', 'smush'] as const) {
        const { text } = renderFiglet(font, 'Nyan Ko', layout);
        expect(text.includes(font.hardblank), `${id}/${layout}`).toBe(false);
      }
    }
  });

  it('上限いっぱいの200文字を全書体・全字間で描画でき、結果が空でない', async () => {
    const input = 'Ab1! '.repeat(40);
    expect(input.length).toBe(200);
    for (const id of FONT_IDS) {
      const font = await loadFont(id);
      for (const layout of ['default', 'full', 'fitted', 'smush'] as const) {
        const result = renderFiglet(font, input, layout);
        expect(result.text.trim(), `${id}/${layout}`).not.toBe('');
      }
    }
  });
});

describe('parseFlf（追加）', () => {
  it('CRLF の書体ファイルも解析できる', async () => {
    const font = await loadFont('small');
    const lf = (await import('./figlet-fonts/small')).default;
    const crlf = parseFlf(lf.replace(/\n/g, '\r\n'));
    expect(crlf.height).toBe(font.height);
    expect(renderFiglet(crlf, 'Hi').text).toBe(renderFiglet(font, 'Hi').text);
  });

  it('高さ 0 のヘッダーはエラーにする', () => {
    expect(() => parseFlf('flf2a$ 0 0 0 0 0\n')).toThrow();
  });
});

describe('ブロック体', () => {
  const font = createBlockFont();

  it('全字形の行の幅が揃っていて、高さが5行', () => {
    for (const [code, rows] of font.glyphs) {
      expect(rows.length, `code ${code}`).toBe(5);
      expect(new Set(rows.map((r) => r.length)).size, `code ${code}`).toBe(1);
    }
  });

  it('英小文字は大文字と同じ字形になる', () => {
    expect(renderFiglet(font, 'abc').text).toBe(renderFiglet(font, 'ABC').text);
  });

  it('█ で描画される', () => {
    expect(renderFiglet(font, 'I').text).toContain('█');
  });

  it('字形のない文字（@ など）は skipped になる', () => {
    expect(renderFiglet(font, 'A@').skipped).toEqual(['@']);
  });
});

describe('wrapInComment', () => {
  const art = ' /\\ \n/__\\';

  it('none はそのまま返す', () => {
    expect(wrapInComment(art, 'none')).toBe(art);
  });

  it('slash / hash は各行の先頭に付ける（行末の空白は残さない）', () => {
    expect(wrapInComment('a\n\nb', 'slash')).toBe('// a\n//\n// b');
    expect(wrapInComment('a\nb', 'hash')).toBe('# a\n# b');
  });

  it('block は /* */ で囲み、中の */ を壊す', () => {
    expect(wrapInComment('a */ b', 'block')).toBe('/*\n * a * / b\n */');
  });

  it('html は <!-- --> で囲み、中の --> を壊す', () => {
    expect(wrapInComment('a --> b', 'html')).toBe('<!--\na -- > b\n-->');
  });

  it('空文字はそのまま返す', () => {
    expect(wrapInComment('', 'slash')).toBe('');
  });
});
