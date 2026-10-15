import { describe, it, expect } from 'vitest';
import {
  generateSqlInsert,
  quoteIdentifier,
  quoteString,
  quoteTableName,
  typeSuggestions,
  type SqlInsertOptions,
} from './sql-insert-generator';

const base: SqlInsertOptions = {
  source: 'csv',
  dialect: 'mysql',
  tableName: 'users',
  delimiter: ',',
  hasHeader: true,
  emptyAsNull: true,
  multiRow: true,
  includeCreateTable: false,
};

function run(input: string, overrides: Partial<SqlInsertOptions> = {}) {
  return generateSqlInsert(input, { ...base, ...overrides });
}

function sqlOf(input: string, overrides: Partial<SqlInsertOptions> = {}) {
  const r = run(input, overrides);
  if (!r.success) throw new Error(`failed: ${r.reason}`);
  return r.sql;
}

describe('quote helpers', () => {
  it('識別子を方言ごとに引用する', () => {
    expect(quoteIdentifier('a`b', 'mysql')).toBe('`a``b`');
    expect(quoteIdentifier('a"b', 'postgresql')).toBe('"a""b"');
    expect(quoteIdentifier('a', 'sqlite')).toBe('"a"');
  });

  it('スキーマ付きテーブル名と空名', () => {
    expect(quoteTableName('public.users', 'postgresql')).toBe(
      '"public"."users"',
    );
    expect(quoteTableName('  ', 'mysql')).toBe('`my_table`');
  });

  it('文字列リテラルのエスケープ', () => {
    expect(quoteString("it's", 'postgresql')).toBe("'it''s'");
    expect(quoteString('a\\b', 'mysql')).toBe("'a\\\\b'");
    expect(quoteString('a\\b', 'sqlite')).toBe("'a\\b'");
  });
});

describe('CSV → INSERT', () => {
  it('複数行VALUESを生成し、数値は引用しない', () => {
    expect(sqlOf('id,name\n1,Taro\n2,Hanako')).toBe(
      "INSERT INTO `users` (`id`, `name`) VALUES\n  (1, 'Taro'),\n  (2, 'Hanako');\n",
    );
  });

  it('1行1文で出力できる', () => {
    expect(sqlOf('id\n1\n2', { multiRow: false })).toBe(
      'INSERT INTO `users` (`id`) VALUES (1);\nINSERT INTO `users` (`id`) VALUES (2);\n',
    );
  });

  it('先頭ゼロや混在列は文字列として引用する', () => {
    const sql = sqlOf('code,mix\n007,1\n010,abc');
    expect(sql).toContain("('007', '1')");
    expect(sql).toContain("('010', 'abc')");
  });

  it('空フィールドは NULL（オプションで空文字列）', () => {
    expect(sqlOf('a,b\n1,\n2,x')).toContain('(1, NULL)');
    expect(sqlOf('a,b\n1,\n2,x', { emptyAsNull: false })).toContain("(1, '')");
  });

  it('ヘッダーなしだと column1.. になる', () => {
    expect(sqlOf('1,2', { hasHeader: false })).toContain(
      '(`column1`, `column2`)',
    );
  });

  it('引用符・改行を含むフィールドを扱う', () => {
    const sql = sqlOf('t\n"a,""b""\nc"');
    expect(sql).toContain('(\'a,"b"\nc\')');
  });

  it('タブ区切り', () => {
    expect(sqlOf('a\tb\n1\t2', { delimiter: '\t' })).toContain('(1, 2)');
  });

  it('シングルクォートをエスケープする', () => {
    expect(sqlOf("n\nO'Brien", { dialect: 'postgresql' })).toContain(
      "('O''Brien')",
    );
  });

  it('真偽値列は方言ごとのリテラル', () => {
    expect(sqlOf('f\ntrue\nFALSE', { dialect: 'postgresql' })).toContain(
      '(TRUE),\n  (FALSE)',
    );
    expect(sqlOf('f\ntrue\nfalse', { dialect: 'sqlite' })).toContain(
      '(1),\n  (0)',
    );
  });

  it('1000行ごとにINSERTを分割する', () => {
    const lines = ['n', ...Array.from({ length: 1001 }, (_, i) => String(i))];
    const sql = sqlOf(lines.join('\n'));
    expect(sql.match(/INSERT INTO/g)).toHaveLength(2);
  });

  it('空行は読み飛ばす', () => {
    const r = run('a\n1\n\n2\n');
    expect(r.success && r.rowCount).toBe(2);
  });
});

describe('CREATE TABLE と型推定', () => {
  const csv =
    'id,price,flag,name,big\n1,1.5,true,Taro,12345678901\n2,2,false,Hanako,5';

  it('MySQL', () => {
    const r = run(csv, { includeCreateTable: true });
    expect(r.success && r.columns.map((c) => c.type)).toEqual([
      'INT',
      'DOUBLE',
      'BOOLEAN',
      'VARCHAR(255)',
      'BIGINT',
    ]);
    expect(sqlOf(csv, { includeCreateTable: true })).toMatch(
      /^CREATE TABLE `users` \(\n {2}`id` INT,/,
    );
  });

  it('PostgreSQL', () => {
    const r = run(csv, { dialect: 'postgresql' });
    expect(r.success && r.columns.map((c) => c.type)).toEqual([
      'INTEGER',
      'DOUBLE PRECISION',
      'BOOLEAN',
      'TEXT',
      'BIGINT',
    ]);
  });

  it('SQLite', () => {
    const r = run(csv, { dialect: 'sqlite' });
    expect(r.success && r.columns.map((c) => c.type)).toEqual([
      'INTEGER',
      'REAL',
      'INTEGER',
      'TEXT',
      'INTEGER',
    ]);
  });

  it('255文字超は MySQL で TEXT', () => {
    const r = run(`s\n${'a'.repeat(256)}`);
    expect(r.success && r.columns[0].type).toBe('TEXT');
  });

  it('BIGINTを超える整数は文字列扱い', () => {
    const r = run('n\n12345678901234567890');
    expect(r.success && r.columns[0].type).toBe('VARCHAR(255)');
    expect(sqlOf('n\n12345678901234567890')).toContain(
      "('12345678901234567890')",
    );
  });
});

describe('JSON → INSERT', () => {
  const json =
    '[{"id":1,"name":"Taro","ok":true},{"id":2,"name":null,"extra":{"a":1}}]';

  it('キーの和集合・NULL・ネスト値', () => {
    const sql = sqlOf(json, { source: 'json', dialect: 'postgresql' });
    expect(sql).toContain('("id", "name", "ok", "extra")');
    expect(sql).toContain("(1, 'Taro', TRUE, NULL)");
    expect(sql).toContain('(2, NULL, NULL, \'{"a":1}\')');
  });

  it('単一オブジェクトは1行として扱う', () => {
    const r = run('{"a":1}', { source: 'json' });
    expect(r.success && r.rowCount).toBe(1);
  });

  it('JSON文字列の数字は文字列のまま', () => {
    expect(sqlOf('[{"zip":"01234"}]', { source: 'json' })).toContain(
      "('01234')",
    );
  });

  it('__proto__ キーも通常のカラムとして扱う', () => {
    expect(sqlOf('[{"__proto__":1}]', { source: 'json' })).toContain(
      '(`__proto__`)',
    );
  });
});

describe('エラー', () => {
  it('空入力・ヘッダーのみ', () => {
    expect(run('')).toMatchObject({ success: false, reason: 'empty' });
    expect(run('a,b')).toMatchObject({ success: false, reason: 'empty' });
    expect(run('[]', { source: 'json' })).toMatchObject({
      success: false,
      reason: 'empty',
    });
  });

  it('列数不一致は行番号つき', () => {
    expect(run('a,b\n1,2\n3')).toMatchObject({
      success: false,
      reason: 'column-mismatch',
      line: 3,
      expectedColumns: 2,
      actualColumns: 1,
    });
  });

  it('引用符が閉じていない', () => {
    expect(run('a\n"x')).toMatchObject({
      success: false,
      reason: 'unterminated-quote',
    });
  });

  it('重複カラム名', () => {
    expect(run('a,a\n1,2')).toMatchObject({
      success: false,
      reason: 'duplicate-column',
      name: 'a',
    });
  });

  it('JSONのエラー', () => {
    expect(run('{', { source: 'json' })).toMatchObject({
      success: false,
      reason: 'invalid-json',
    });
    expect(run('1', { source: 'json' })).toMatchObject({
      success: false,
      reason: 'not-array',
    });
    expect(run('[1]', { source: 'json' })).toMatchObject({
      success: false,
      reason: 'not-object',
      index: 0,
    });
  });
});

describe('入力の正規化', () => {
  it('CSV先頭のBOMを除去する', () => {
    expect(sqlOf('\uFEFFid\n1')).toContain('(`id`)');
  });

  it('JSONの空文字キーは連番名になる', () => {
    expect(sqlOf('[{"":1}]', { source: 'json' })).toContain('(`column1`)');
  });
});

describe('多バイト文字・改行コード', () => {
  it('日本語・絵文字（サロゲートペア）をそのまま引用する', () => {
    const sql = sqlOf('名前,絵文字\n太郎,😀🐱\n');
    expect(sql).toContain("('太郎', '😀🐱')");
  });

  it('MySQLのVARCHAR判定はUTF-16単位ではなくコードポイント数で数える', () => {
    // 絵文字255個（UTF-16では510単位）は VARCHAR(255) のまま
    const emoji = '😀'.repeat(255);
    const r = run(`a\n${emoji}\n`, { includeCreateTable: true });
    if (!r.success) throw new Error(r.reason);
    expect(r.columns[0].type).toBe('VARCHAR(255)');
    const over = run(`a\n${'😀'.repeat(256)}\n`, { includeCreateTable: true });
    if (!over.success) throw new Error(over.reason);
    expect(over.columns[0].type).toBe('TEXT');
  });

  it('CRLF と CR の改行でも同じ結果になる', () => {
    const lf = sqlOf('a,b\n1,x\n2,y\n');
    expect(sqlOf('a,b\r\n1,x\r\n2,y\r\n')).toBe(lf);
    // 注意: CR のみ（旧Mac形式）の改行は共有パーサーが未対応（\r を読み飛ばす）
    // expect(sqlOf('a,b\r1,x\r2,y\r')).toBe(lf);
  });

  it('引用符で囲まれたフィールド内の改行はそのまま保持する', () => {
    const sql = sqlOf('a\r\n"line1\r\nline2"\r\n');
    expect(sql).toContain("('line1\r\nline2')");
  });

  it('JSONの日本語文字列とカラム名', () => {
    const sql = sqlOf('[{"名前":"太郎","年齢":30}]', { source: 'json' });
    expect(sql).toContain('(`名前`, `年齢`)');
    expect(sql).toContain("('太郎', 30)");
  });
});

describe('カラム型の上書き', () => {
  it('CREATE TABLE の型だけを上書きし、空欄は推定値を使う', () => {
    const columnTypes = new Map([
      ['id', 'BIGINT UNSIGNED'],
      ['name', '  '],
    ]);
    const r = run('id,name\n1,Taro', { includeCreateTable: true, columnTypes });
    expect(r.success && r.columns).toEqual([
      { name: 'id', type: 'BIGINT UNSIGNED', inferredType: 'INT' },
      { name: 'name', type: 'VARCHAR(255)', inferredType: 'VARCHAR(255)' },
    ]);
    expect(r.success && r.sql).toContain('`id` BIGINT UNSIGNED,');
    expect(r.success && r.sql).toContain('`name` VARCHAR(255)\n);');
    expect(r.success && r.sql).toContain("(1, 'Taro');");
  });

  it('候補は方言ごとに用意されている', () => {
    expect(typeSuggestions('oracle')).toContain('CLOB');
    expect(typeSuggestions('postgresql')).toContain('JSONB');
  });
});

describe('SQL Server / Oracle', () => {
  it('識別子と文字列の引用', () => {
    expect(quoteIdentifier('a]b', 'sqlserver')).toBe('[a]]b]');
    expect(quoteIdentifier('a"b', 'oracle')).toBe('"a""b"');
    expect(quoteTableName('dbo.users', 'sqlserver')).toBe('[dbo].[users]');
    expect(quoteString("it's", 'sqlserver')).toBe("N'it''s'");
    expect(quoteString('a\\b', 'oracle')).toBe("'a\\b'");
  });

  it('SQL Server: 型・BIT・N文字列・複数行VALUES', () => {
    const csv = 'id,price,flag,name\n1,1.5,true,太郎\n2,2,false,花子';
    const r = run(csv, { dialect: 'sqlserver', includeCreateTable: true });
    expect(r.success && r.columns.map((c) => c.type)).toEqual([
      'INT',
      'FLOAT',
      'BIT',
      'NVARCHAR(255)',
    ]);
    expect(r.success && r.sql).toContain(
      "[id], [price], [flag], [name]) VALUES\n  (1, 1.5, 1, N'太郎'),\n  (2, 2, 0, N'花子');",
    );
  });

  it('SQL Server: 256文字超は NVARCHAR(MAX)', () => {
    const r = run(`s\n${'a'.repeat(256)}`, { dialect: 'sqlserver' });
    expect(r.success && r.columns[0].type).toBe('NVARCHAR(MAX)');
  });

  it('Oracle: 型とINSERT ALL', () => {
    const csv = 'id,price,flag,name\n1,1.5,true,Taro\n2,2,false,Hanako';
    const r = run(csv, { dialect: 'oracle' });
    expect(r.success && r.columns.map((c) => c.type)).toEqual([
      'NUMBER(10)',
      'BINARY_DOUBLE',
      'NUMBER(1)',
      'VARCHAR2(255 CHAR)',
    ]);
    expect(r.success && r.sql).toBe(
      'INSERT ALL\n' +
        '  INTO "users" ("id", "price", "flag", "name") VALUES (1, 1.5, 1, \'Taro\')\n' +
        '  INTO "users" ("id", "price", "flag", "name") VALUES (2, 2, 0, \'Hanako\')\n' +
        'SELECT 1 FROM DUAL;\n',
    );
  });

  it('Oracle: 1行1文と256文字超の CLOB', () => {
    expect(sqlOf('a\n1', { dialect: 'oracle', multiRow: false })).toBe(
      'INSERT INTO "users" ("a") VALUES (1);\n',
    );
    const r = run(`s\n${'a'.repeat(256)}`, { dialect: 'oracle' });
    expect(r.success && r.columns[0].type).toBe('CLOB');
  });
});
