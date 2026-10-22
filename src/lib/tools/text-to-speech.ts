export interface VoiceLike {
  name: string;
  lang: string;
  voiceURI: string;
  localService: boolean;
}

export const RATE_MIN = 0.5;
export const RATE_MAX = 2;
export const PITCH_MIN = 0;
export const PITCH_MAX = 2;
export const VOLUME_MIN = 0;
export const VOLUME_MAX = 1;

/** Chrome は長い発話が途中で止まることがあるため、1チャンクの上限をこの長さにする */
export const MAX_CHUNK_LENGTH = 160;

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** クラウド音声（localService=false）は入力テキストが外部へ送られうるため、端末内の音声だけを返す */
export function filterLocalVoices<T extends VoiceLike>(voices: T[]): T[] {
  return voices.filter((voice) => voice.localService === true);
}

function langPrefix(lang: string): string {
  return lang.replace('_', '-').split('-')[0].toLowerCase();
}

/** 優先言語（例: 'ja'）の音声を先頭にし、その後は言語・名前順に並べる */
export function sortVoices<T extends VoiceLike>(
  voices: T[],
  preferredLang: string,
): T[] {
  const preferred = langPrefix(preferredLang);
  return [...voices].sort((a, b) => {
    const aPref = langPrefix(a.lang) === preferred ? 0 : 1;
    const bPref = langPrefix(b.lang) === preferred ? 0 : 1;
    if (aPref !== bPref) return aPref - bPref;
    return (
      a.lang.localeCompare(b.lang) ||
      a.name.localeCompare(b.name) ||
      a.voiceURI.localeCompare(b.voiceURI)
    );
  });
}

const SENTENCE_END = /[。．！？!?.\n]/;

/** 文末（句点・感嘆符・疑問符・改行）で区切り、長い文はさらに maxLength 以内に分ける。空白だけのチャンクは捨てる */
export function splitIntoChunks(
  text: string,
  maxLength: number = MAX_CHUNK_LENGTH,
): string[] {
  const sentences: string[] = [];
  let current = '';
  for (const ch of text.replace(/\r\n?/g, '\n')) {
    current += ch;
    if (SENTENCE_END.test(ch)) {
      sentences.push(current);
      current = '';
    }
  }
  if (current) sentences.push(current);

  const chunks: string[] = [];
  for (const sentence of sentences) {
    const chars = Array.from(sentence);
    for (let i = 0; i < chars.length; i += maxLength) {
      const piece = chars
        .slice(i, i + maxLength)
        .join('')
        .trim();
      if (piece) chunks.push(piece);
    }
  }
  return chunks;
}
