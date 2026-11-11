import { defineI18n } from "fumadocs-core/i18n";
import translations from "@/data/translations.json";

export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: Object.keys(translations),
  parser: "dir",
});
