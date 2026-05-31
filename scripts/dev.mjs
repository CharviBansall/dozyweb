import { execSync, spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const devDir = ".next-dev";

try {
  execSync("lsof -tiTCP:3000 -sTCP:LISTEN | xargs kill -9 2>/dev/null", {
    stdio: "ignore",
  });
} catch {
  // port already free
}

execSync(`rm -rf ${devDir}`, { cwd: root, stdio: "inherit" });

const child = spawn("npx", ["next", "dev", "--turbopack"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, NEXT_DIST_DIR: devDir },
});

child.on("exit", (code) => process.exit(code ?? 0));
