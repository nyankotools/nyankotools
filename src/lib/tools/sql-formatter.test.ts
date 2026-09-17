import { describe, expect, it } from 'vitest';
import { formatSqlQuery, minifySqlQuery } from './sql-formatter';

describe('formatSqlQuery', () => {
  it('シンプルなSELECT文を整形する', () => {
    const result = formatSqlQuery('select a,b from t where a=1');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe(
        'SELECT\n  a,\n  b\nFROM\n  t\nWHERE\n  a = 1',
      );
    }
  });

  it('キーワードの大文字/小文字を指定できる', () => {
    const result = formatSqlQuery('SELECT a FROM t', { keywordCase: 'lower' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('select\n  a\nfrom\n  t');
    }
  });

  it('インデント幅を指定できる', () => {
    const result = formatSqlQuery('SELECT a FROM t', { tabWidth: 4 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('SELECT\n    a\nFROM\n    t');
    }
  });

  it('方言（dialect）を指定できる', () => {
    const result = formatSqlQuery('SELECT `a` FROM `t`', {
      dialect: 'mysql',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('`a`');
    }
  });

  it('空文字はエラーにならず空文字を返す', () => {
    const result = formatSqlQuery('');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('');
    }
  });

  it('括弧の対応が崩れたSQLはエラーを返す', () => {
    const result = formatSqlQuery('SELECT * FROM (((');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message.length).toBeGreaterThan(0);
      expect(result.message).not.toContain('\n');
    }
  });

  it('閉じていない文字列リテラルはエラーを返す', () => {
    const result = formatSqlQuery("SELECT 'unterminated");
    expect(result.success).toBe(false);
  });

  it('空白のみの入力はエラーにならず空文字を返す', () => {
    const result = formatSqlQuery('   \n\t  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('');
    }
  });

  it('useTabsを指定するとタブでインデントする', () => {
    const result = formatSqlQuery('SELECT a FROM t', { useTabs: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('SELECT\n\ta\nFROM\n\tt');
    }
  });

  it('キーワードの大文字/小文字を"そのまま"にできる（preserve）', () => {
    const result = formatSqlQuery('SeLeCt a fRoM t', {
      keywordCase: 'preserve',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('SeLeCt\n  a\nfRoM\n  t');
    }
  });

  it('セミコロン区切りの複数ステートメントを整形できる', () => {
    const result = formatSqlQuery('SELECT 1; SELECT 2;');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('SELECT\n  1;\n\nSELECT\n  2;');
    }
  });

  it('日本語や絵文字を含む文字列リテラルを保持したまま整形する', () => {
    const result = formatSqlQuery(
      "SELECT * FROM t WHERE name = '日本語テスト' AND pet = '🐱猫'",
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain("'日本語テスト'");
      expect(result.output).toContain("'🐱猫'");
    }
  });

  it('SQLとして解釈できないゴミ入力はエラーを返す', () => {
    const result = formatSqlQuery('this is not @#$% sql at all !!!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message.length).toBeGreaterThan(0);
    }
  });
});

describe('minifySqlQuery', () => {
  it('連続する空白・改行を1個のスペースにまとめる', () => {
    const input = 'SELECT\n  a,\n  b\nFROM\n  t';
    expect(minifySqlQuery(input)).toBe('SELECT a, b FROM t');
  });

  it('行コメントを除去する', () => {
    const input = 'SELECT 1 -- this is a comment\nFROM t';
    expect(minifySqlQuery(input)).toBe('SELECT 1 FROM t');
  });

  it('ブロックコメントを除去する', () => {
    const input = 'SELECT /* comment */ 1 FROM t';
    expect(minifySqlQuery(input)).toBe('SELECT 1 FROM t');
  });

  it('シングルクォート文字列内の空白は保持する', () => {
    const input = "SELECT   'a   b'   FROM   t";
    expect(minifySqlQuery(input)).toBe("SELECT 'a   b' FROM t");
  });

  it("文字列内の二重クォートエスケープ（'' ）を保持する", () => {
    const input = "SELECT 'it''s'   FROM t";
    expect(minifySqlQuery(input)).toBe("SELECT 'it''s' FROM t");
  });

  it('MySQL方言ではバックスラッシュエスケープを保持する', () => {
    const input = "SELECT 'a\\'b'   FROM t";
    expect(minifySqlQuery(input, 'mysql')).toBe("SELECT 'a\\'b' FROM t");
  });

  it('標準SQL方言（既定値）ではバックスラッシュを特別扱いしない', () => {
    // PostgreSQL/SQL Server/Oracle等の既定挙動と同様、\ はエスケープ文字ではないため
    // 文字列は最初の ' で正しく終端し、以降のコメント除去・空白圧縮も行われる
    const input = "SELECT 'C:\\' AS path,    1  --trailing comment\nAS n";
    expect(minifySqlQuery(input)).toBe("SELECT 'C:\\' AS path, 1 AS n");
  });

  it('二重引用符識別子内のエスケープ（""）を保持する', () => {
    const input = 'SELECT   "col""name"   FROM   t';
    expect(minifySqlQuery(input)).toBe('SELECT "col""name" FROM t');
  });

  it('角括弧識別子のエスケープ（]]）を保持する', () => {
    const input = 'SELECT   [col]]name]   FROM   t';
    expect(minifySqlQuery(input)).toBe('SELECT [col]]name] FROM t');
  });

  it('バッククォート識別子内の空白は保持する', () => {
    const input = 'SELECT `col   name`   FROM   t';
    expect(minifySqlQuery(input)).toBe('SELECT `col   name` FROM t');
  });

  it('角括弧識別子（T-SQL）内の空白は保持する', () => {
    const input = 'SELECT [col   name]   FROM   t';
    expect(minifySqlQuery(input)).toBe('SELECT [col   name] FROM t');
  });

  it('前後の空白を取り除く', () => {
    expect(minifySqlQuery('   SELECT 1   ')).toBe('SELECT 1');
  });

  it('空文字は空文字を返す', () => {
    expect(minifySqlQuery('')).toBe('');
  });

  it('CRLFの改行が混在していても1個のスペースにまとめる', () => {
    const input = 'SELECT\r\n  a,\r\n  b\r\nFROM\r\n  t -- comment\r\nAS x';
    expect(minifySqlQuery(input)).toBe('SELECT a, b FROM t AS x');
  });

  it('日本語や絵文字を含む文字列リテラルを保持したままコメント・空白を除去する', () => {
    const input = "SELECT '日本語テスト' , '🐱猫'   -- コメント\nFROM   t";
    expect(minifySqlQuery(input)).toBe("SELECT '日本語テスト' , '🐱猫' FROM t");
  });

  it('閉じていないブロックコメントは末尾まで除去し、例外を投げない', () => {
    const input = 'SELECT 1 /* unterminated comment';
    expect(() => minifySqlQuery(input)).not.toThrow();
    expect(minifySqlQuery(input)).toBe('SELECT 1');
  });

  it('閉じていない文字列リテラルは残りを丸ごとリテラル扱いにし、例外を投げない', () => {
    const input = "SELECT 'unterminated FROM t";
    expect(() => minifySqlQuery(input)).not.toThrow();
    expect(minifySqlQuery(input)).toBe("SELECT 'unterminated FROM t");
  });

  it('全角スペース（U+3000）はクォート外にあっても半角スペースに圧縮されない（既知の仕様）', () => {
    // ミニファイが対象とするのはASCIIの空白（半角スペース・タブ・改行）のみで、
    // 全角スペースは通常のSQL識別子には現れないため、非空白文字として素通しする
    const input = 'SELECT　1　FROM　t';
    expect(minifySqlQuery(input)).toBe('SELECT　1　FROM　t');
  });
});
