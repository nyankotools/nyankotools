export type WarningCode =
  | 'unsupportedOption'
  | 'unknownOption'
  | 'missingValue'
  | 'invalidPort'
  | 'invalidRestart'
  | 'invalidEnv'
  | 'pwdReplaced'
  | 'dollar';

export interface ConvertWarning {
  code: WarningCode;
  /** 該当するオプション名や値（表示用） */
  detail: string;
}

export type ConvertErrorCode =
  'empty' | 'unterminatedQuote' | 'notRun' | 'noImage';

export interface ConvertOptions {
  /** --name を container_name としても出力するか（既定 true） */
  containerName?: boolean;
}

export interface ConvertResult {
  yaml: string;
  serviceName: string;
  warnings: ConvertWarning[];
  error: ConvertErrorCode | null;
}

/** 値を 1 つ取る docker run オプション（長い名前） */
const SHORT_VALUE: Record<string, string> = {
  p: 'publish',
  v: 'volume',
  e: 'env',
  w: 'workdir',
  u: 'user',
  h: 'hostname',
  l: 'label',
  m: 'memory',
  a: 'attach',
  c: 'cpu-shares',
};

const SHORT_BOOL = new Set(['d', 'i', 't', 'P', 'q']);

const SUPPORTED_VALUE = new Set([
  'publish',
  'volume',
  'env',
  'env-file',
  'name',
  'restart',
  'workdir',
  'user',
  'hostname',
  'network',
  'net',
  'entrypoint',
  'label',
  'cap-add',
  'cap-drop',
  'dns',
  'add-host',
  'device',
  'tmpfs',
  'expose',
  'link',
  'memory',
  'cpus',
  'platform',
  'shm-size',
]);

/** 対応していないが値を 1 つ取るオプション（画像名の判定のため値を読み飛ばす） */
const UNSUPPORTED_VALUE = new Set([
  'attach',
  'annotation',
  'blkio-weight',
  'cgroup-parent',
  'cgroupns',
  'cidfile',
  'cpu-period',
  'cpu-quota',
  'cpu-shares',
  'cpuset-cpus',
  'cpuset-mems',
  'detach-keys',
  'device-cgroup-rule',
  'dns-option',
  'dns-search',
  'domainname',
  'gpus',
  'group-add',
  'health-cmd',
  'health-interval',
  'health-retries',
  'health-start-period',
  'health-timeout',
  'ip',
  'ip6',
  'ipc',
  'isolation',
  'kernel-memory',
  'label-file',
  'log-driver',
  'log-opt',
  'mac-address',
  'memory-reservation',
  'memory-swap',
  'mount',
  'network-alias',
  'oom-score-adj',
  'pid',
  'pids-limit',
  'pull',
  'runtime',
  'security-opt',
  'stop-signal',
  'stop-timeout',
  'storage-opt',
  'sysctl',
  'ulimit',
  'userns',
  'uts',
  'volume-driver',
  'volumes-from',
]);

const SUPPORTED_BOOL = new Set(['privileged', 'init', 'read-only', 'detach']);
const IGNORED_BOOL = new Set(['interactive', 'tty']);

type Tokenized =
  { ok: true; tokens: string[] } | { ok: false; error: 'unterminatedQuote' };

/**
 * シェル風の分割。シングル／ダブルクォート、行末の \\ ^ ` による継続行に対応する。
 * Windows のパス（C:\\data）を壊さないよう、引用符の外のバックスラッシュは
 * 直後が改行・空白・引用符・$・\\ のときだけエスケープとして扱う。
 */
export function tokenize(text: string): Tokenized {
  const tokens: string[] = [];
  let cur = '';
  let inTok = false;
  let i = 0;
  const n = text.length;

  /** j 位置の改行の長さ（改行でなければ 0） */
  const isNewline = (j: number): number => {
    if (text[j] === '\r') return text[j + 1] === '\n' ? 2 : 1;
    return text[j] === '\n' ? 1 : 0;
  };

  while (i < n) {
    const c = text[i];
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      if (inTok) {
        tokens.push(cur);
        cur = '';
        inTok = false;
      }
      i++;
      continue;
    }
    if (c === '\\' || c === '^' || c === '`') {
      const nl = isNewline(i + 1);
      if (nl > 0) {
        // 継続行
        i += 1 + nl;
        continue;
      }
      if (c === '\\') {
        const next = text[i + 1];
        if (
          next === ' ' ||
          next === '"' ||
          next === "'" ||
          next === '$' ||
          next === '\\'
        ) {
          cur += next;
          inTok = true;
          i += 2;
          continue;
        }
      }
      cur += c;
      inTok = true;
      i++;
      continue;
    }
    if (c === "'") {
      const end = text.indexOf("'", i + 1);
      if (end === -1) return { ok: false, error: 'unterminatedQuote' };
      cur += text.slice(i + 1, end);
      inTok = true;
      i = end + 1;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      let closed = false;
      while (j < n) {
        const d = text[j];
        if (d === '"') {
          closed = true;
          break;
        }
        if (d === '\\') {
          const nl = isNewline(j + 1);
          if (nl > 0) {
            j += 1 + nl;
            continue;
          }
          const next = text[j + 1];
          if (next === '"' || next === '\\' || next === '$' || next === '`') {
            cur += next;
            j += 2;
            continue;
          }
        }
        cur += d;
        j++;
      }
      if (!closed) return { ok: false, error: 'unterminatedQuote' };
      inTok = true;
      i = j + 1;
      continue;
    }
    cur += c;
    inTok = true;
    i++;
  }
  if (inTok) tokens.push(cur);
  return { ok: true, tokens };
}

const RESERVED = new Set([
  'y',
  'n',
  'yes',
  'no',
  'on',
  'off',
  'true',
  'false',
  'null',
]);

/** YAML のスカラー。安全な文字列だけをそのまま、それ以外は二重引用符で出力する */
export function yamlScalar(s: string): string {
  if (
    /^(?:\.{1,2}\/|[A-Za-z_/])[A-Za-z0-9_./@:+-]*$/.test(s) &&
    !s.endsWith(':') &&
    !RESERVED.has(s.toLowerCase())
  ) {
    return s;
  }
  return JSON.stringify(s);
}

/** フロー形式（[a, b]）の中では常に二重引用符を使う */
function flowList(items: string[]): string {
  return `[${items.map((s) => JSON.stringify(s)).join(', ')}]`;
}

const PORT_RE =
  /^(?:(?:\[[^\]]+\]|[A-Za-z0-9.-]+):)?(?:\d+(?:-\d+)?:)?\d+(?:-\d+)?(?:\/(?:tcp|udp|sctp))?$/;

const PWD_RE = /\$\(pwd\)|\$\{PWD\}|\$PWD|`pwd`/g;

function splitOnce(s: string): [string, string | null] {
  const idx = s.indexOf('=');
  return idx === -1 ? [s, null] : [s.slice(0, idx), s.slice(idx + 1)];
}

/** イメージ名からサービス名の候補を作る */
export function serviceNameFromImage(image: string): string {
  let base = image.split('@')[0];
  base = base.slice(base.lastIndexOf('/') + 1);
  base = base.split(':')[0];
  return sanitizeName(base) || 'app';
}

function sanitizeName(name: string): string {
  return name
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^[^A-Za-z0-9]+/, '')
    .replace(/-+$/, '');
}

interface Model {
  image: string;
  name: string | null;
  ports: string[];
  volumes: string[];
  namedVolumes: string[];
  env: Map<string, string | null>;
  envFiles: string[];
  restart: string | null;
  workdir: string | null;
  user: string | null;
  hostname: string | null;
  networkMode: string | null;
  networks: string[];
  entrypoint: string | null;
  labels: Map<string, string>;
  capAdd: string[];
  capDrop: string[];
  dns: string[];
  addHosts: string[];
  devices: string[];
  tmpfs: string[];
  expose: string[];
  links: string[];
  memory: string | null;
  cpus: string | null;
  platform: string | null;
  shmSize: string | null;
  privileged: boolean;
  init: boolean;
  readOnly: boolean;
  tty: boolean;
  stdinOpen: boolean;
  command: string[];
}

function emptyModel(): Model {
  return {
    image: '',
    name: null,
    ports: [],
    volumes: [],
    namedVolumes: [],
    env: new Map(),
    envFiles: [],
    restart: null,
    workdir: null,
    user: null,
    hostname: null,
    networkMode: null,
    networks: [],
    entrypoint: null,
    labels: new Map(),
    capAdd: [],
    capDrop: [],
    dns: [],
    addHosts: [],
    devices: [],
    tmpfs: [],
    expose: [],
    links: [],
    memory: null,
    cpus: null,
    platform: null,
    shmSize: null,
    privileged: false,
    init: false,
    readOnly: false,
    tty: false,
    stdinOpen: false,
    command: [],
  };
}

function fail(error: ConvertErrorCode): ConvertResult {
  return { yaml: '', serviceName: '', warnings: [], error };
}

/** -v の値を分解し、名前付きボリュームなら名前を返す */
function parseVolume(
  raw: string,
  warnings: ConvertWarning[],
): { spec: string; named: string | null } {
  const spec = raw.replace(PWD_RE, '.');
  if (spec !== raw) warnings.push({ code: 'pwdReplaced', detail: raw });
  // Windows のドライブレターを含む場合は先頭の ":" を区切りとして数えない
  const drive = /^[A-Za-z]:[\\/]/.test(spec);
  const rest = drive ? spec.slice(2) : spec;
  const colon = rest.indexOf(':');
  if (colon === -1) return { spec, named: null };
  const source = (drive ? spec.slice(0, 2) : '') + rest.slice(0, colon);
  const named = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(source) ? source : null;
  return { spec, named };
}

/**
 * `docker run` コマンドを docker-compose.yml（services 1 件）へ変換する。
 */
export function convertDockerRun(
  text: string,
  options: ConvertOptions = {},
): ConvertResult {
  const includeContainerName = options.containerName ?? true;
  if (text.trim() === '') return fail('empty');
  const tk = tokenize(text);
  if (!tk.ok) return fail(tk.error);
  const tokens = tk.tokens.slice();
  if (tokens.length === 0) return fail('empty');

  // 先頭の "$" "sudo" "docker" "container" "run" を取り除く
  if (tokens[0] === '$' || tokens[0] === '>') tokens.shift();
  if (tokens[0] === 'sudo') tokens.shift();
  if (tokens[0] === 'docker') {
    tokens.shift();
    const next = (): string | undefined => tokens[0];
    if (next() === 'container') tokens.shift();
    if (next() !== 'run') return fail('notRun');
    tokens.shift();
  } else if (tokens[0] === 'run') {
    tokens.shift();
  }

  const m = emptyModel();
  const warnings: ConvertWarning[] = [];
  const warned = new Set<string>();
  const warn = (code: WarningCode, detail: string) => {
    const key = `${code}:${detail}`;
    if (warned.has(key)) return;
    warned.add(key);
    warnings.push({ code, detail });
  };
  let dollar = false;
  const scan = (s: string) => {
    if (s.includes('$')) dollar = true;
  };

  const apply = (name: string, value: string, display: string) => {
    scan(value);
    switch (name) {
      case 'publish':
        if (!PORT_RE.test(value)) warn('invalidPort', value);
        m.ports.push(value);
        break;
      case 'volume': {
        const v = parseVolume(value, warnings);
        m.volumes.push(v.spec);
        if (v.named && !m.namedVolumes.includes(v.named)) {
          m.namedVolumes.push(v.named);
        }
        break;
      }
      case 'env': {
        const [k, v] = splitOnce(value);
        if (k === '') warn('invalidEnv', value);
        else m.env.set(k, v);
        break;
      }
      case 'env-file':
        m.envFiles.push(value);
        break;
      case 'name':
        m.name = value;
        break;
      case 'restart':
        if (!/^(?:no|always|unless-stopped|on-failure(?::\d+)?)$/.test(value)) {
          warn('invalidRestart', value);
        }
        m.restart = value;
        break;
      case 'workdir':
        m.workdir = value;
        break;
      case 'user':
        m.user = value;
        break;
      case 'hostname':
        m.hostname = value;
        break;
      case 'network':
      case 'net':
        if (
          value === 'host' ||
          value === 'none' ||
          value === 'bridge' ||
          value.startsWith('container:') ||
          value.startsWith('service:')
        ) {
          m.networkMode = value;
        } else if (!m.networks.includes(value)) {
          m.networks.push(value);
        }
        break;
      case 'entrypoint':
        m.entrypoint = value;
        break;
      case 'label': {
        const [k, v] = splitOnce(value);
        m.labels.set(k, v ?? '');
        break;
      }
      case 'cap-add':
        m.capAdd.push(value);
        break;
      case 'cap-drop':
        m.capDrop.push(value);
        break;
      case 'dns':
        m.dns.push(value);
        break;
      case 'add-host':
        m.addHosts.push(value);
        break;
      case 'device':
        m.devices.push(value);
        break;
      case 'tmpfs':
        m.tmpfs.push(value);
        break;
      case 'expose':
        m.expose.push(value);
        break;
      case 'link':
        m.links.push(value);
        break;
      case 'memory':
        m.memory = value;
        break;
      case 'cpus':
        m.cpus = value;
        break;
      case 'platform':
        m.platform = value;
        break;
      case 'shm-size':
        m.shmSize = value;
        break;
      default:
        warn('unsupportedOption', display);
    }
  };

  const applyBool = (name: string) => {
    switch (name) {
      case 'privileged':
        m.privileged = true;
        break;
      case 'init':
        m.init = true;
        break;
      case 'read-only':
        m.readOnly = true;
        break;
      case 'interactive':
        m.stdinOpen = true;
        break;
      case 'tty':
        m.tty = true;
        break;
      default:
        break; // detach は compose では up -d に相当するため無視
    }
  };

  let i = 0;
  let imageFound = false;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok === '--') {
      i++;
      if (i < tokens.length) {
        m.image = tokens[i];
        m.command = tokens.slice(i + 1);
        imageFound = true;
      }
      break;
    }
    if (tok.startsWith('--') && tok.length > 2) {
      const [rawName, inline] = splitOnce(tok.slice(2));
      const name = rawName;
      const display = `--${name}`;
      const takesValue =
        SUPPORTED_VALUE.has(name) || UNSUPPORTED_VALUE.has(name);
      if (takesValue) {
        let value = inline;
        if (value === null) {
          i++;
          value = i < tokens.length ? tokens[i] : null;
        }
        if (value === null) {
          warn('missingValue', display);
        } else if (SUPPORTED_VALUE.has(name)) {
          apply(name, value, display);
        } else {
          warn('unsupportedOption', display);
        }
      } else if (name === 'interactive' || name === 'tty') {
        applyBool(name);
      } else if (SUPPORTED_BOOL.has(name) || IGNORED_BOOL.has(name)) {
        applyBool(name);
      } else if (
        [
          'rm',
          'publish-all',
          'sig-proxy',
          'no-healthcheck',
          'oom-kill-disable',
          'quiet',
          'disable-content-trust',
        ].includes(name)
      ) {
        warn('unsupportedOption', display);
      } else {
        warn('unknownOption', display);
      }
      i++;
      continue;
    }
    if (tok.startsWith('-') && tok.length > 1) {
      // 短いオプション（-itd のようにまとめて指定できる）
      let k = 1;
      while (k < tok.length) {
        const ch = tok[k];
        if (SHORT_BOOL.has(ch)) {
          if (ch === 'i') applyBool('interactive');
          else if (ch === 't') applyBool('tty');
          else if (ch === 'P') warn('unsupportedOption', '-P');
          else if (ch === 'q') warn('unsupportedOption', '-q');
          k++;
          continue;
        }
        const long = SHORT_VALUE[ch];
        if (long) {
          let value: string | null = tok.slice(k + 1);
          if (value.startsWith('=')) value = value.slice(1);
          if (value === '') {
            i++;
            value = i < tokens.length ? tokens[i] : null;
          }
          if (value === null) warn('missingValue', `-${ch}`);
          else if (SUPPORTED_VALUE.has(long)) apply(long, value, `-${ch}`);
          else warn('unsupportedOption', `-${ch}`);
          break;
        }
        warn('unknownOption', `-${ch}`);
        k++;
      }
      i++;
      continue;
    }
    // 最初のオプション以外のトークンがイメージ名
    m.image = tok;
    m.command = tokens.slice(i + 1);
    imageFound = true;
    break;
  }
  if (!imageFound || m.image === '') return fail('noImage');

  for (const c of m.command) scan(c);
  scan(m.image);
  if (dollar) warn('dollar', '$');

  const serviceName =
    (m.name ? sanitizeName(m.name) : '') || serviceNameFromImage(m.image);

  const lines: string[] = ['services:', `  ${yamlScalar(serviceName)}:`];
  const P = '    ';
  const kv = (key: string, value: string) => lines.push(`${P}${key}: ${value}`);
  const list = (key: string, items: string[], quoteAll = false) => {
    if (items.length === 0) return;
    lines.push(`${P}${key}:`);
    for (const it of items) {
      lines.push(`${P}  - ${quoteAll ? JSON.stringify(it) : yamlScalar(it)}`);
    }
  };
  const map = (key: string, entries: [string, string | null][]) => {
    if (entries.length === 0) return;
    lines.push(`${P}${key}:`);
    for (const [k, v] of entries) {
      lines.push(
        v === null
          ? `${P}  ${yamlScalar(k)}:`
          : `${P}  ${yamlScalar(k)}: ${yamlScalar(v)}`,
      );
    }
  };

  kv('image', yamlScalar(m.image));
  if (m.name && includeContainerName) kv('container_name', yamlScalar(m.name));
  if (m.entrypoint !== null) kv('entrypoint', flowList([m.entrypoint]));
  if (m.command.length > 0) kv('command', flowList(m.command));
  if (m.restart) kv('restart', yamlScalar(m.restart));
  if (m.platform) kv('platform', yamlScalar(m.platform));
  list('ports', m.ports, true);
  list('expose', m.expose, true);
  list('volumes', m.volumes);
  list('tmpfs', m.tmpfs);
  map('environment', [...m.env.entries()]);
  list('env_file', m.envFiles);
  map('labels', [...m.labels.entries()]);
  if (m.workdir) kv('working_dir', yamlScalar(m.workdir));
  if (m.user) kv('user', yamlScalar(m.user));
  if (m.hostname) kv('hostname', yamlScalar(m.hostname));
  if (m.networkMode) kv('network_mode', yamlScalar(m.networkMode));
  if (!m.networkMode) list('networks', m.networks);
  list('links', m.links);
  list('dns', m.dns);
  list('extra_hosts', m.addHosts);
  list('devices', m.devices);
  list('cap_add', m.capAdd);
  list('cap_drop', m.capDrop);
  if (m.memory) kv('mem_limit', yamlScalar(m.memory));
  if (m.cpus) {
    kv('cpus', /^\d+(?:\.\d+)?$/.test(m.cpus) ? m.cpus : yamlScalar(m.cpus));
  }
  if (m.shmSize) kv('shm_size', yamlScalar(m.shmSize));
  if (m.privileged) kv('privileged', 'true');
  if (m.init) kv('init', 'true');
  if (m.readOnly) kv('read_only', 'true');
  if (m.stdinOpen) kv('stdin_open', 'true');
  if (m.tty) kv('tty', 'true');

  if (m.namedVolumes.length > 0) {
    lines.push('', 'volumes:');
    for (const v of m.namedVolumes) lines.push(`  ${yamlScalar(v)}:`);
  }
  if (!m.networkMode && m.networks.length > 0) {
    lines.push('', 'networks:');
    for (const n of m.networks) {
      lines.push(`  ${yamlScalar(n)}:`, '    external: true');
    }
  }

  return {
    yaml: lines.join('\n') + '\n',
    serviceName,
    warnings,
    error: null,
  };
}
