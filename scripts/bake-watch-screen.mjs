import { PNG } from "pngjs";
import fs from "node:fs";
import sharp from "sharp";

const bezelPath = "public/devices/watch-ultra-trail.png";
const screenPath = process.argv[2];
const outPath = process.argv[3];

if (!screenPath || !outPath) {
  console.error("usage: node bake-watch-screen.mjs <screen.png> <out.png>");
  process.exit(1);
}

const bezel = PNG.sync.read(fs.readFileSync(bezelPath));
const { width, height, data } = bezel;

// Flood fill from the center over transparent pixels to isolate the screen
// cutout (avoids catching transparent margins outside the watch case).
const alphaAt = (x, y) => data[(y * width + x) * 4 + 3];
const visited = new Uint8Array(width * height);
const startX = Math.floor(width / 2);
const startY = Math.floor(height / 2);
const stack = [[startX, startY]];
let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= width || y >= height) continue;
  const idx = y * width + x;
  if (visited[idx]) continue;
  if (alphaAt(x, y) >= 8) continue;
  visited[idx] = 1;
  if (x < minX) minX = x;
  if (y < minY) minY = y;
  if (x > maxX) maxX = x;
  if (y > maxY) maxY = y;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

const boxW = maxX - minX + 1;
const boxH = maxY - minY + 1;
console.log("cutout box", { minX, minY, boxW, boxH, width, height });

const screen = await sharp(screenPath)
  .resize(boxW, boxH, { fit: "cover", position: "centre" })
  .png()
  .toBuffer();

// Transparent base, screen placed at box, bezel overlaid on top (masks corners
// and keeps the area outside the watch fully transparent).
const base = await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .png()
  .toBuffer();

await sharp(base)
  .composite([
    { input: screen, left: minX, top: minY },
    { input: bezelPath, left: 0, top: 0 },
  ])
  .png()
  .toFile(outPath);

console.log("wrote", outPath);
