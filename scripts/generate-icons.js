const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default;

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const LOGO_DIR = path.join(PUBLIC_DIR, "logo");

const PNG_TARGETS = [
  { src: "logo-maskable.svg", out: "icon-192.png", size: 192 },
  { src: "logo-maskable.svg", out: "icon-512.png", size: 512 },
  { src: "logo-maskable.svg", out: "apple-touch-icon.png", size: 180 },
];

const ICO_TARGETS = [
  { src: "favicon.svg", out: "favicon.ico", sizes: [16, 32, 48], dir: PUBLIC_DIR },
];

function renderPng({ src, size }) {
  const density = Math.ceil((size / 100) * 72 * 2);
  return sharp(path.join(LOGO_DIR, src), { density })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  const written = [];

  for (const target of PNG_TARGETS) {
    const buffer = await renderPng(target);
    fs.writeFileSync(path.join(LOGO_DIR, target.out), buffer);
    written.push(`${target.out} (${target.size}x${target.size})`);
  }

  for (const icoTarget of ICO_TARGETS) {
    const icoBuffers = await Promise.all(
      icoTarget.sizes.map((size) => renderPng({ src: icoTarget.src, size })),
    );
    const ico = await pngToIco(icoBuffers);
    fs.writeFileSync(path.join(icoTarget.dir, icoTarget.out), ico);
    written.push(`${icoTarget.out} (${icoTarget.sizes.join("/")})`);
  }

  console.log(`Generated ${written.length} icons:`);
  for (const entry of written) console.log(`  - ${entry}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
