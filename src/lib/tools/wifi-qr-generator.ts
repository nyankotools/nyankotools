export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export interface WifiInput {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

export type WifiPayloadResult =
  | { ok: true; payload: string }
  | { ok: false; reason: 'ssid-empty' | 'password-empty' };

export type PasswordLengthIssue = 'ok' | 'too-short' | 'too-long';

/** Wi-Fi QRの値で意味を持つ \ ; , : " をバックスラッシュでエスケープする */
export function escapeWifiValue(value: string): string {
  return value.replace(/[\\;,:"]/g, (ch) => `\\${ch}`);
}

/** `WIFI:T:WPA;S:ssid;P:pass;H:true;;` 形式の文字列を組み立てる */
export function buildWifiPayload(input: WifiInput): WifiPayloadResult {
  if (input.ssid === '') {
    return { ok: false, reason: 'ssid-empty' };
  }
  const needsPassword = input.security !== 'nopass';
  if (needsPassword && input.password === '') {
    return { ok: false, reason: 'password-empty' };
  }

  let payload = `WIFI:T:${input.security};S:${escapeWifiValue(input.ssid)};`;
  if (needsPassword) {
    payload += `P:${escapeWifiValue(input.password)};`;
  }
  if (input.hidden) {
    payload += 'H:true;';
  }
  return { ok: true, payload: `${payload};` };
}

/** WPA/WPA2のパスワードは8〜63文字。範囲外なら警告用の判定を返す */
export function checkPasswordLength(
  security: WifiSecurity,
  password: string,
): PasswordLengthIssue {
  if (security !== 'WPA' || password === '') return 'ok';
  const length = Array.from(password).length;
  if (length < 8) return 'too-short';
  if (length > 63) return 'too-long';
  return 'ok';
}
