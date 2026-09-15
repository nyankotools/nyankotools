export interface UrlEncodeSuccess {
  success: true;
  output: string;
}

export interface UrlEncodeFailure {
  success: false;
}

export type UrlEncodeOutcome = UrlEncodeSuccess | UrlEncodeFailure;

export function encodeUrl(input: string): UrlEncodeOutcome {
  try {
    return { success: true, output: encodeURIComponent(input) };
  } catch {
    return { success: false };
  }
}

export function decodeUrl(input: string): UrlEncodeOutcome {
  try {
    return { success: true, output: decodeURIComponent(input) };
  } catch {
    return { success: false };
  }
}
