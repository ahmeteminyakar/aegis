#!/usr/bin/env node
/**
 * One-shot brand asset build.
 *
 * Reads source SVGs in src/assets/brand/ and writes:
 *   public/favicon.svg          (copy of wordmark source)
 *   public/favicon.ico          (16/32/48 multi-res, assembled with png-to-ico)
 *   public/og/aegis-og.svg      (copy of OG source)
 *   public/og/aegis-og.png      (1200x630 PNG export)
 *
 * Run: `pnpm brand:build`
 *
 * Tooling. The script does not import sharp directly so the project
 * does not need to depend on it. SVG-to-PNG rasterisation is done by
 * `pnpm dlx sharp-cli` and ICO assembly by `pnpm dlx png-to-ico`. Both
 * are dev-time transients pulled fresh on first run and cached
 * thereafter.
 *
 * Process invocations use execFileSync with argv arrays. No path or
 * size is ever interpolated into a shell command string, so a hostile
 * filename can not inject shell tokens. shell:true is needed on
 * Windows so PATHEXT resolves `pnpm.cmd`, but arguments stay parsed
 * as an array.
 */
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const brand = join(root, "src/assets/brand");
const publicDir = join(root, "public");

const log = (...args) => console.log("[brand]", ...args);

async function copyFile(src, dest) {
  await fs.mkdir(dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
  log("copy", relative(src), "->", relative(dest));
}

function relative(p) {
  return p.replace(root + "\\", "").replace(root + "/", "").replaceAll("\\", "/");
}

// Resolve the pnpm binary directly so we can run execFile with
// shell:false. Bypasses the Node 22 DEP0190 warning that fires when
// shell:true is combined with an argv array.
const PNPM_BIN = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function dlx(pkg, args, { capture = false } = {}) {
  return execFileSync(
    PNPM_BIN,
    ["dlx", pkg, ...args],
    {
      stdio: ["ignore", capture ? "pipe" : "inherit", "inherit"],
      shell: false,
      maxBuffer: 32 * 1024 * 1024,
    }
  );
}

function svgToPng(svgPath, outPath, width, height) {
  log("png ", relative(outPath), `${width}x${height}`);
  // sharp-cli: -i input -o output --density N resize W H
  dlx("sharp-cli", [
    "-i", svgPath,
    "-o", outPath,
    "--density", "384",
    "resize", String(width), String(height),
  ]);
}

async function buildFavicon() {
  const src = join(brand, "aegis-wordmark.svg");
  await copyFile(src, join(publicDir, "favicon.svg"));

  const sizes = [16, 32, 48];
  const tmps = sizes.map((s) => join(publicDir, `.favicon-${s}.png`));
  for (let i = 0; i < sizes.length; i++) {
    svgToPng(src, tmps[i], sizes[i], sizes[i]);
  }

  const icoOut = join(publicDir, "favicon.ico");
  log("ico assembling via pnpm dlx png-to-ico");
  const buf = dlx("png-to-ico", tmps, { capture: true });
  await fs.writeFile(icoOut, buf);
  log("ico ", relative(icoOut), `${buf.length} bytes`);

  for (const tmp of tmps) await fs.unlink(tmp);
}

async function buildOg() {
  const src = join(brand, "aegis-og.svg");
  await copyFile(src, join(publicDir, "og/aegis-og.svg"));
  svgToPng(src, join(publicDir, "og/aegis-og.png"), 1200, 630);
}

async function main() {
  log("start");
  await buildFavicon();
  await buildOg();
  log("done");
}

main().catch((err) => {
  console.error("[brand] FAILED:", err.message ?? err);
  process.exit(1);
});
