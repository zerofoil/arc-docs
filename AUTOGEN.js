// This script automatically generates node tables from arc-studio repository.
// Make sure that arc-studio and arc-docs repositories are both in the same folder.

import { readdirSync, writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputDir = join(__dirname, "../arc-studio/packages/studio-server/src/engine/nodes");
const outputDir = join(__dirname, "content/docs");

const translations = JSON.parse(readFileSync(join(__dirname, "src/data/translations.json"), "utf-8"));

const defaults = { "Pin Description": "Pin Description", "Inputs": "Inputs", "Outputs": "Outputs", "Pin Name": "Pin Name", "Pin Type": "Pin Type", "Default Value": "Default Value" };
const t = (lang, key) => translations[lang]?.[`${key}(node info table)`] ?? defaults[key];

const escape = s => String(s).replaceAll("{", "\\{").replaceAll("}", "\\}").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function generateMdx(obj, lang) {
  const pin = t(lang, "Pin Name"), type = t(lang, "Pin Type"), def = t(lang, "Default Value"), inp = t(lang, "Inputs"), out = t(lang, "Outputs"), desc = t(lang, "Pin Description");
  let mdx = `---\ntitle: "${obj.label}"\n---\n\n${obj.description}\n`;

  if (obj.inputs?.length) {
    mdx += `\n## ${inp}\n\n| ${pin} | ${type} | ${def} | ${desc} |\n| :-: | :-: | :-: | :-: |\n`;
    for (const i of obj.inputs) mdx += `| ${i.label} | ${i.type} | ${i.defaultValue ?? ""} | ${i.description ?? ""} |\n`;
  }
  if (obj.outputs?.length) {
    mdx += `\n## ${out}\n\n| ${pin} | ${type} | ${desc} |\n| :-: | :-: | :-: |\n`;
    for (const o of obj.outputs) mdx += `| ${o.label} | ${o.type} | ${o.description ?? ""} |\n`;
  }
  return escape(mdx);
}

async function main() {
  if (!existsSync(inputDir)) {
    console.error(`❌ arc-studio repository not found.\n${inputDir}`);
    process.exit(1);
  }

  const langs = readdirSync(outputDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const files = readdirSync(inputDir, { recursive: true })
    .filter(f => /\.(js|jsx)$/.test(f) && !/(^|\/)runtime\//.test(f));

  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    const fullPath = join(inputDir, file);
    try {
      const obj = (await import(fullPath)).default;
      if (!obj?.type) { console.log(`⏭️ | ${file} (no type/export)`); skipped++; continue; }

      const subdir = relative(inputDir, dirname(fullPath));
      for (const lang of langs) {
        const outDir = join(outputDir, lang, "nodes", subdir);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, `${obj.type}.mdx`), generateMdx(obj, lang), "utf-8");
      }
      console.log(`✅ | ${file}`);
      processed++;
    } catch (err) {
      console.error(`❌ | ${file}:`, err.message);
      skipped++;
    }
  }

  console.log(`\n🎉 Done!\nNodes: ${processed}\nLangs: ${langs.length} (${langs.join(", ")})\nSkipped ${skipped} nodes.`);
}

main();
