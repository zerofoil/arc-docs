import { createGetUrl } from "fumadocs-core/source";

export const appName = "ARC Studio";
export const appDescription = "Create Discord bot's using graphs, visually & easily.";
export const appIcon = "/icon.png";
export const appBanner = "/banner2.png";
export const appUri = "https://arc-docs.zerofoil.workers.dev";
export const appWebsite = "https://none.yet";
export const docsRoute = "/";
export const docsContentRoute = "/llms.mdx/docs";

export const gitConfig = {
  user: "relentiousdragon",
  repo: "arc-studio",
  branch: "main",
};

const getContentUrl = createGetUrl(docsContentRoute);
export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "content.md"];
  return { segments, url: getContentUrl(segments, page.locale) };
}
