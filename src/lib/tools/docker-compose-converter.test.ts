import { describe, expect, it } from 'vitest';
import {
  convertDockerRun,
  serviceNameFromImage,
  tokenize,
  yamlScalar,
} from './docker-compose-converter';

describe('tokenize', () => {
  it('引用符と継続行を処理する', () => {
    const r = tokenize('a \'b c\' "d e" \\\n f');
    expect(r).toEqual({ ok: true, tokens: ['a', 'b c', 'd e', 'f'] });
  });
  it('CRLF の継続行と ^ / ` の継続行', () => {
    expect(tokenize('a \\\r\n b ^\n c `\n d')).toEqual({
      ok: true,
      tokens: ['a', 'b', 'c', 'd'],
    });
  });
  it('Windows パスのバックスラッシュを残す', () => {
    expect(tokenize('-v C:\\data:/data')).toEqual({
      ok: true,
      tokens: ['-v', 'C:\\data:/data'],
    });
  });
  it('閉じていない引用符はエラー', () => {
    expect(tokenize('a "b')).toEqual({ ok: false, error: 'unterminatedQuote' });
    expect(tokenize("a 'b")).toEqual({ ok: false, error: 'unterminatedQuote' });
  });
  it('ダブルクォート内のエスケープ', () => {
    expect(tokenize('"a\\"b\\$c"')).toEqual({ ok: true, tokens: ['a"b$c'] });
  });
});

describe('yamlScalar', () => {
  it('安全な文字列はそのまま', () => {
    expect(yamlScalar('nginx:latest')).toBe('nginx:latest');
    expect(yamlScalar('./data')).toBe('./data');
  });
  it('予約語・数値風・記号を含む文字列は引用符で囲む', () => {
    expect(yamlScalar('no')).toBe('"no"');
    expect(yamlScalar('true')).toBe('"true"');
    expect(yamlScalar('3306')).toBe('"3306"');
    expect(yamlScalar('a b')).toBe('"a b"');
    expect(yamlScalar('')).toBe('""');
    expect(yamlScalar('x: y')).toBe('"x: y"');
    expect(yamlScalar('say "hi"')).toBe('"say \\"hi\\""');
    expect(yamlScalar('~')).toBe('"~"');
  });
});

describe('serviceNameFromImage', () => {
  it('レジストリ・タグ・ダイジェストを除く', () => {
    expect(serviceNameFromImage('ghcr.io/foo/bar:1.0')).toBe('bar');
    expect(serviceNameFromImage('nginx@sha256:abc')).toBe('nginx');
    expect(serviceNameFromImage('localhost:5000/my_app')).toBe('my_app');
  });
});

describe('convertDockerRun', () => {
  it('主要オプションを変換する', () => {
    const r = convertDockerRun(
      'docker run -d --name web -p 8080:80 -v ./html:/usr/share/nginx/html:ro -e TZ=Asia/Tokyo --restart unless-stopped nginx:latest',
    );
    expect(r.error).toBeNull();
    expect(r.warnings).toEqual([]);
    expect(r.serviceName).toBe('web');
    expect(r.yaml).toBe(
      [
        'services:',
        '  web:',
        '    image: nginx:latest',
        '    container_name: web',
        '    restart: unless-stopped',
        '    ports:',
        '      - "8080:80"',
        '    volumes:',
        '      - ./html:/usr/share/nginx/html:ro',
        '    environment:',
        '      TZ: Asia/Tokyo',
        '',
      ].join('\n'),
    );
  });

  it('名前付きボリュームをトップレベルに宣言する', () => {
    const r = convertDockerRun(
      'docker run -v pgdata:/var/lib/postgresql/data -v /host:/c postgres:16',
    );
    expect(r.yaml).toContain('\nvolumes:\n  pgdata:\n');
    expect(r.yaml).not.toMatch(/^ {2}host:/m);
  });

  it('--name 無しではイメージ名からサービス名を作る', () => {
    const r = convertDockerRun('docker run redis:7');
    expect(r.serviceName).toBe('redis');
    expect(r.yaml).not.toContain('container_name');
  });

  it('containerName: false で container_name を省く', () => {
    const r = convertDockerRun('docker run --name a nginx', {
      containerName: false,
    });
    expect(r.yaml).not.toContain('container_name');
  });

  it('値が予約語・数値の環境変数は引用符付きになる', () => {
    const r = convertDockerRun(
      'docker run -e DEBUG=true -e PORT=3000 -e EMPTY= -e PASS -e MSG="a b" app',
    );
    expect(r.yaml).toContain('DEBUG: "true"');
    expect(r.yaml).toContain('PORT: "3000"');
    expect(r.yaml).toContain('EMPTY: ""');
    expect(r.yaml).toContain('      PASS:\n');
    expect(r.yaml).toContain('MSG: "a b"');
  });

  it('同じ環境変数は後勝ちで 1 件になる', () => {
    const r = convertDockerRun('docker run -e A=1 -e A=2 app');
    expect(r.yaml.match(/A:/g)).toHaveLength(1);
    expect(r.yaml).toContain('A: "2"');
  });

  it('restart: no は文字列として引用する', () => {
    const r = convertDockerRun('docker run --restart=no app');
    expect(r.yaml).toContain('restart: "no"');
  });

  it('不正な restart は警告', () => {
    const r = convertDockerRun('docker run --restart sometimes app');
    expect(r.warnings).toContainEqual({
      code: 'invalidRestart',
      detail: 'sometimes',
    });
  });

  it('コマンド引数を command に出す', () => {
    const r = convertDockerRun(
      'docker run alpine sh -c \'echo "hi" && sleep 1\'',
    );
    expect(r.yaml).toContain(
      '    command: ["sh", "-c", "echo \\"hi\\" && sleep 1"]',
    );
  });

  it('コマンド中のオプション風トークンはイメージ以降として扱う', () => {
    const r = convertDockerRun('docker run nginx -g "daemon off;"');
    expect(r.yaml).toContain('command: ["-g", "daemon off;"]');
    expect(r.warnings).toEqual([]);
  });

  it('-itd のまとめ指定と tty / stdin_open', () => {
    const r = convertDockerRun('docker run -itd ubuntu bash');
    expect(r.yaml).toContain('stdin_open: true');
    expect(r.yaml).toContain('tty: true');
    expect(r.warnings).toEqual([]);
  });

  it('--opt=value と -p8080:80 の連結指定', () => {
    const r = convertDockerRun(
      'docker run --name=x --publish=9000:9000 -p8080:80 -ePORT=1 img',
    );
    expect(r.yaml).toContain('container_name: x');
    expect(r.yaml).toContain('- "9000:9000"');
    expect(r.yaml).toContain('- "8080:80"');
    expect(r.yaml).toContain('PORT: "1"');
  });

  it('host ネットワークは network_mode、独自ネットワークは external 宣言', () => {
    expect(convertDockerRun('docker run --network host a').yaml).toContain(
      'network_mode: host',
    );
    const r = convertDockerRun('docker run --network mynet a');
    expect(r.yaml).toContain('    networks:\n      - mynet');
    expect(r.yaml).toContain('\nnetworks:\n  mynet:\n    external: true\n');
  });

  it('未対応オプションは警告し、値を読み飛ばしてイメージを特定する', () => {
    const r = convertDockerRun(
      'docker run --rm --log-driver json-file --ulimit nofile=1024 -P nginx',
    );
    expect(r.error).toBeNull();
    expect(r.yaml).toContain('image: nginx');
    const details = r.warnings.map((w) => w.detail);
    expect(details).toEqual(
      expect.arrayContaining(['--rm', '--log-driver', '--ulimit', '-P']),
    );
    expect(r.warnings.every((w) => w.code === 'unsupportedOption')).toBe(true);
  });

  it('未知のオプションは unknownOption', () => {
    const r = convertDockerRun('docker run --frobnicate nginx');
    expect(r.warnings).toEqual([
      { code: 'unknownOption', detail: '--frobnicate' },
    ]);
    expect(r.yaml).toContain('image: nginx');
  });

  it('$(pwd) を . に置き換えて警告する', () => {
    const r = convertDockerRun('docker run -v "$(pwd)":/app -v $PWD/data:/d a');
    expect(r.yaml).toContain('- ".:/app"');
    expect(r.yaml).toContain('- ./data:/d');
    expect(r.warnings.some((w) => w.code === 'pwdReplaced')).toBe(true);
  });

  it('その他の $ は dollar 警告を 1 回だけ出す', () => {
    const r = convertDockerRun('docker run -e A=$HOME -e B=$USER a');
    expect(r.warnings.filter((w) => w.code === 'dollar')).toHaveLength(1);
  });

  it('不正なポートは警告するが出力は残す', () => {
    const r = convertDockerRun('docker run -p 80:abc a');
    expect(r.warnings).toContainEqual({
      code: 'invalidPort',
      detail: '80:abc',
    });
    expect(r.yaml).toContain('"80:abc"');
  });

  it('IP・範囲・プロトコル付きのポートは有効', () => {
    const r = convertDockerRun(
      'docker run -p 127.0.0.1:8080:80 -p 5000-5010:5000-5010/udp -p 80 a',
    );
    expect(r.warnings).toEqual([]);
  });

  it('値が足りないオプションは警告', () => {
    const r = convertDockerRun('docker run -p');
    expect(r.error).toBe('noImage');
    const r2 = convertDockerRun('docker run img -p');
    expect(r2.warnings).toEqual([]);
    const r3 = convertDockerRun('docker run --name');
    expect(r3.error).toBe('noImage');
  });

  it('その他のオプション（user, workdir, labels, cap_add など）', () => {
    const r = convertDockerRun(
      'docker run -u 1000:1000 -w /app -h box -l com.x.y=z --cap-add NET_ADMIN --privileged --init --read-only -m 512m --cpus 0.5 --entrypoint /bin/sh --env-file .env --add-host h:1.2.3.4 --dns 8.8.8.8 --tmpfs /tmp --expose 3000 --platform linux/amd64 a',
    );
    expect(r.warnings).toEqual([]);
    for (const s of [
      'user: "1000:1000"',
      'working_dir: /app',
      'hostname: box',
      'com.x.y: z',
      '- NET_ADMIN',
      'privileged: true',
      'init: true',
      'read_only: true',
      'mem_limit: "512m"',
      'cpus: 0.5',
      'entrypoint: ["/bin/sh"]',
      '- ".env"',
      '- h:1.2.3.4',
      '- "8.8.8.8"',
      '- /tmp',
      '- "3000"',
      'platform: linux/amd64',
    ]) {
      expect(r.yaml).toContain(s);
    }
  });

  it('改行付きの docker run（継続行）を変換する', () => {
    const r = convertDockerRun(
      'docker run -d \\\n  --name db \\\n  -p 5432:5432 \\\n  postgres:16',
    );
    expect(r.error).toBeNull();
    expect(r.yaml).toContain('image: postgres:16');
    expect(r.yaml).toContain('- "5432:5432"');
  });

  it('docker run 以外や prompt / sudo 付きの入力', () => {
    expect(convertDockerRun('docker build .').error).toBe('notRun');
    expect(convertDockerRun('$ sudo docker run nginx').error).toBeNull();
    expect(convertDockerRun('docker container run nginx').error).toBeNull();
    expect(convertDockerRun('run nginx').error).toBeNull();
    expect(convertDockerRun('nginx').error).toBeNull();
  });

  it('空入力・イメージ無し・引用符の閉じ忘れ', () => {
    expect(convertDockerRun('').error).toBe('empty');
    expect(convertDockerRun('   \n').error).toBe('empty');
    expect(convertDockerRun('docker run -d').error).toBe('noImage');
    expect(convertDockerRun('docker run -e "A=1 nginx').error).toBe(
      'unterminatedQuote',
    );
  });

  it('-- の後ろをイメージとして扱う', () => {
    const r = convertDockerRun('docker run -- -weird-image arg');
    expect(r.yaml).toContain('"-weird-image"');
    expect(r.yaml).toContain('command: ["arg"]');
  });

  it('Windows パスのボリュームは名前付きとして扱わない', () => {
    const r = convertDockerRun('docker run -v C:\\data:/data a');
    expect(r.yaml).toContain('"C:\\\\data:/data"');
    expect(r.yaml).not.toContain('\nvolumes:\n');
  });
});

describe('境界・多言語・入力パターン', () => {
  it('日本語を含む値は二重引用符で囲む', () => {
    expect(yamlScalar('日本語')).toBe('"日本語"');
    const r = convertDockerRun(
      'docker run -e MSG=こんにちは -e "NOTE=メモ 1" app',
    );
    expect(r.yaml).toContain('MSG: "こんにちは"');
    expect(r.yaml).toContain('NOTE: "メモ 1"');
    expect(r.error).toBeNull();
  });

  it('日本語だけのイメージ名はサービス名 app にフォールバックする', () => {
    expect(serviceNameFromImage('日本語/')).toBe('app');
    expect(serviceNameFromImage('')).toBe('app');
  });

  it('CRLF の改行を含む docker run も変換できる', () => {
    const r = convertDockerRun(
      'docker run -d \\\r\n  --name db \\\r\n  -p 5432:5432 \\\r\n  postgres:16',
    );
    expect(r.error).toBeNull();
    expect(r.serviceName).toBe('db');
    expect(r.yaml).toContain('image: postgres:16');
    expect(r.yaml).toContain('- "5432:5432"');
  });

  it('環境変数を2000件指定しても落ちず全件出力する', () => {
    const flags = Array.from({ length: 2000 }, (_, i) => `-e K${i}=${i}`).join(
      ' ',
    );
    const r = convertDockerRun(`docker run ${flags} app`);
    expect(r.error).toBeNull();
    expect(r.yaml.match(/^ {6}K\d+:/gm)).toHaveLength(2000);
  });
});
