import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export interface ConvertSuccess {
  success: true;
  output: string;
}

export interface ConvertFailure {
  success: false;
  message: string;
}

export type ConvertOutcome = ConvertSuccess | ConvertFailure;

export function yamlToJson(input: string, indent = 2): ConvertOutcome {
  try {
    const parsed = parseYaml(input);
    const output = JSON.stringify(parsed, null, indent);
    return { success: true, output: output ?? '' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export function jsonToYaml(input: string, indent = 2): ConvertOutcome {
  try {
    const parsed = JSON.parse(input);
    return { success: true, output: stringifyYaml(parsed, { indent }) };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
