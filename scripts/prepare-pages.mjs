import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const root = fileURLToPath(new URL("../", import.meta.url));
const site = path.join(root, "site");
await rm(site, { recursive: true, force: true });
await mkdir(site, { recursive: true });
for (const file of ["index.html", "sw.js", "proxy-config.js"]) {
  await cp(path.join(root, file), path.join(site, file));
}
for (const [source, target] of [
  [scramjetPath, "scram"],
  [libcurlPath, "libcurl"],
  [baremuxPath, "baremux"],
]) {
  await cp(source, path.join(site, target), { recursive: true });
}
console.log("Prepared GitHub Pages site with Scramjet, BareMux and Libcurl assets.");
