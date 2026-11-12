import { mkdirSync, readFileSync, writeFileSync } from "fs";

const html = readFileSync("scripts/lcp-optimisation/analysis/home.html", "utf8");
const m = html.match(/<svg viewBox="0 0 900 560"[\s\S]*?<\/svg>/);
if (!m) {
  console.error("landscape svg not found in home.html");
  process.exit(1);
}
mkdirSync("public/research", { recursive: true });
let svg = m[0];
if (!svg.includes("xmlns=")) {
  svg = svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
}
writeFileSync("public/research/landscape-wireframe.svg", svg);
console.log("wrote public/research/landscape-wireframe.svg", Math.round(svg.length / 1024), "KB");
