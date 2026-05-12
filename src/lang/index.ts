import en from "./en.json";
import da from "./da.json";

const TABLES: Record<string, typeof en> = { en, da };

export function t(language: string, key: string): string {
  const lang = TABLES[language] ?? en;
  return key.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], lang) as string ?? key;
}
