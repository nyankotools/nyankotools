export type ApiTarget = 'navigator' | 'window';

export interface ApiDefinition {
  id: string;
  /** 表示名（API名はロケールによらず英語表記） */
  name: string;
  target: ApiTarget;
  /** target オブジェクトに存在するかを `in` で判定するプロパティ名 */
  key: string;
}

/** 対応状況を調べるWeb APIの一覧（存在チェックのみ。権限や実際の動作は保証しない） */
export const API_DEFINITIONS: ApiDefinition[] = [
  {
    id: 'clipboard',
    name: 'Clipboard API',
    target: 'navigator',
    key: 'clipboard',
  },
  {
    id: 'midi',
    name: 'Web MIDI',
    target: 'navigator',
    key: 'requestMIDIAccess',
  },
  {
    id: 'bluetooth',
    name: 'Web Bluetooth',
    target: 'navigator',
    key: 'bluetooth',
  },
  { id: 'usb', name: 'WebUSB', target: 'navigator', key: 'usb' },
  { id: 'serial', name: 'Web Serial', target: 'navigator', key: 'serial' },
  { id: 'hid', name: 'WebHID', target: 'navigator', key: 'hid' },
  { id: 'webgpu', name: 'WebGPU', target: 'navigator', key: 'gpu' },
  { id: 'share', name: 'Web Share', target: 'navigator', key: 'share' },
  {
    id: 'wakelock',
    name: 'Screen Wake Lock',
    target: 'navigator',
    key: 'wakeLock',
  },
  {
    id: 'geolocation',
    name: 'Geolocation',
    target: 'navigator',
    key: 'geolocation',
  },
  {
    id: 'mediadevices',
    name: 'MediaDevices (camera / mic)',
    target: 'navigator',
    key: 'mediaDevices',
  },
  {
    id: 'battery',
    name: 'Battery Status',
    target: 'navigator',
    key: 'getBattery',
  },
  { id: 'vibrate', name: 'Vibration', target: 'navigator', key: 'vibrate' },
  {
    id: 'serviceworker',
    name: 'Service Worker',
    target: 'navigator',
    key: 'serviceWorker',
  },
  {
    id: 'webauthn',
    name: 'WebAuthn',
    target: 'window',
    key: 'PublicKeyCredential',
  },
  {
    id: 'notification',
    name: 'Notifications',
    target: 'window',
    key: 'Notification',
  },
  {
    id: 'filepicker',
    name: 'File System Access',
    target: 'window',
    key: 'showOpenFilePicker',
  },
  { id: 'eyedropper', name: 'EyeDropper', target: 'window', key: 'EyeDropper' },
  {
    id: 'speechrecognition',
    name: 'Speech Recognition',
    target: 'window',
    key: 'webkitSpeechRecognition',
  },
  { id: 'webrtc', name: 'WebRTC', target: 'window', key: 'RTCPeerConnection' },
  { id: 'webaudio', name: 'Web Audio', target: 'window', key: 'AudioContext' },
  {
    id: 'sharedarraybuffer',
    name: 'SharedArrayBuffer',
    target: 'window',
    key: 'SharedArrayBuffer',
  },
  {
    id: 'webassembly',
    name: 'WebAssembly',
    target: 'window',
    key: 'WebAssembly',
  },
  { id: 'indexeddb', name: 'IndexedDB', target: 'window', key: 'indexedDB' },
];

export interface ApiSupportRow {
  id: string;
  name: string;
  supported: boolean;
}

function hasKey(obj: unknown, key: string): boolean {
  if (obj === null || obj === undefined) return false;
  if (typeof obj !== 'object' && typeof obj !== 'function') return false;
  return key in (obj as object);
}

/** window / navigator 相当のオブジェクトから各APIの有無を判定する */
export function detectApiSupport(
  win: unknown,
  nav: unknown,
  definitions: ApiDefinition[] = API_DEFINITIONS,
): ApiSupportRow[] {
  return definitions.map((d) => ({
    id: d.id,
    name: d.name,
    supported: hasKey(d.target === 'navigator' ? nav : win, d.key),
  }));
}

export function countSupported(rows: ApiSupportRow[]): number {
  return rows.filter((r) => r.supported).length;
}

/** 「1920 × 1080 px」形式。数値でない・負の値は null */
export function formatResolution(width: number, height: number): string | null {
  if (![width, height].every((n) => Number.isFinite(n) && n >= 0)) return null;
  return `${width} × ${height} px`;
}

/** CSSピクセル × DPR の物理ピクセル数（概算）。DPRが不正なら null */
export function physicalResolution(
  width: number,
  height: number,
  dpr: number,
): string | null {
  if (!Number.isFinite(dpr) || dpr <= 0) return null;
  return formatResolution(Math.round(width * dpr), Math.round(height * dpr));
}

/** DPRを「2x」「1.25x」形式にする */
export function formatDpr(dpr: number): string | null {
  if (!Number.isFinite(dpr) || dpr <= 0) return null;
  return `${Number(dpr.toFixed(3))}x`;
}

export interface MemoryInfo {
  gb: number;
  /** navigator.deviceMemory は最大8に丸められるため、8以上は「8GB以上」の意味 */
  capped: boolean;
}

export function describeDeviceMemory(
  value: number | null | undefined,
): MemoryInfo | null {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value) || value <= 0) return null;
  return { gb: value, capped: value >= 8 };
}

export function describeCpuCores(
  value: number | null | undefined,
): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value <= 0) return null;
  return value;
}

export type PointerKind = 'fine' | 'coarse' | 'none';

/** `(pointer: fine)` / `(pointer: coarse)` の結果から主ポインタの種類を決める */
export function classifyPointer(fine: boolean, coarse: boolean): PointerKind {
  if (fine) return 'fine';
  if (coarse) return 'coarse';
  return 'none';
}

/** WebGLから得た文字列を整える。空なら null */
export function normalizeGpuString(
  value: string | null | undefined,
): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.replace(/\s+/g, ' ').trim();
  return trimmed === '' ? null : trimmed;
}

export interface ReportRow {
  label: string;
  value: string;
}

/** 「ラベル: 値」を改行区切りにしたコピー用テキストを作る */
export function buildReport(rows: ReportRow[]): string {
  return rows.map((r) => `${r.label}: ${r.value}`).join('\n');
}
