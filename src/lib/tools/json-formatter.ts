export interface JsonFormatSuccess {
  success: true;
  output: string;
}

export interface JsonFormatFailure {
  success: false;
  message: string;
}

export type JsonFormatOutcome = JsonFormatSuccess | JsonFormatFailure;

export function formatJson(
  input: string,
  indent: string | number = 2,
): JsonFormatOutcome {
  try {
    const parsed = JSON.parse(input);
    return { success: true, output: JSON.stringify(parsed, null, indent) };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export function minifyJson(input: string): JsonFormatOutcome {
  try {
    const parsed = JSON.parse(input);
    return { success: true, output: JSON.stringify(parsed) };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
