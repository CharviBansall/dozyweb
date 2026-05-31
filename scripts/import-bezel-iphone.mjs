import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "devices");
const outFile = join(outDir, "iphone-17-mist-blue-portrait.png");

const volumes = execSync("ls /Volumes", { encoding: "utf8" })
  .split("\n")
  .map((v) => v.trim())
  .filter((v) => v.startsWith("Bezel-iPhone"));

if (volumes.length === 0) {
  console.error(
    "Mount Bezel-iPhone-17.dmg first (open the file in Finder and accept the license).",
  );
  process.exit(1);
}

const src = join(
  "/Volumes",
  volumes[0],
  "PNG/iPhone 17/iPhone 17 - Mist Blue - Portrait.png",
);

if (!existsSync(src)) {
  console.error("Source PNG not found:", src);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, outFile);
console.log("Copied →", outFile);
