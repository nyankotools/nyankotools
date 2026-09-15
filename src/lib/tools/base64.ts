export interface Base64Success {
  success: true;
  output: string;
}

export interface Base64Failure {
  success: false;
}

export type Base64Outcome = Base64Success | Base64Failure;

export function encodeBase64(input: string): Base64Outcome {
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return { success: true, output: btoa(binary) };
  } catch {
    return { success: false };
  }
}

export function decodeBase64(input: string): Base64Outcome {
  try {
    const binary = atob(input.trim());
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const output = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return { success: true, output };
  } catch {
    return { success: false };
  }
}
