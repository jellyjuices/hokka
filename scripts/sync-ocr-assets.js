const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const modules = path.join(root, "node_modules");
const target = path.join(root, "public", "ocr");

const CORE_VARIANTS = [
  "tesseract-core-lstm.wasm.js",
  "tesseract-core-simd-lstm.wasm.js",
  "tesseract-core-relaxedsimd-lstm.wasm.js",
];

const assets = [
  {
    from: path.join(modules, "tesseract.js", "dist", "worker.min.js"),
    to: path.join(target, "worker.min.js"),
  },
  {
    from: path.join(modules, "@tesseract.js-data", "eng", "4.0.0_best_int", "eng.traineddata.gz"),
    to: path.join(target, "lang", "eng.traineddata.gz"),
  },
  {
    from: path.join(modules, "pdfjs-dist", "build", "pdf.worker.min.mjs"),
    to: path.join(target, "pdf.worker.min.mjs"),
  },
  ...CORE_VARIANTS.map((name) => ({
    from: path.join(modules, "tesseract.js-core", name),
    to: path.join(target, "core", name),
  })),
];

function fontAssets() {
  const from = path.join(modules, "pdfjs-dist", "standard_fonts");
  if (!fs.existsSync(from)) return [{ from, to: path.join(target, "fonts") }];
  return fs
    .readdirSync(from)
    .map((name) => ({ from: path.join(from, name), to: path.join(target, "fonts", name) }));
}

function isCurrent(from, to) {
  if (!fs.existsSync(to)) return false;
  const source = fs.statSync(from);
  const copy = fs.statSync(to);
  return source.size === copy.size && copy.mtimeMs >= source.mtimeMs;
}

let copied = 0;
let missing = 0;

for (const asset of [...assets, ...fontAssets()]) {
  if (!fs.existsSync(asset.from)) {
    console.warn(`ocr assets: missing ${path.relative(root, asset.from)}`);
    missing += 1;
    continue;
  }
  if (isCurrent(asset.from, asset.to)) continue;
  fs.mkdirSync(path.dirname(asset.to), { recursive: true });
  fs.copyFileSync(asset.from, asset.to);
  copied += 1;
}

if (missing > 0) {
  console.warn(`ocr assets: ${missing} file(s) unavailable, on-device OCR will not load`);
} else if (copied === 0) {
  console.log("ocr assets: up to date");
} else {
  console.log(`ocr assets: copied ${copied} file(s) into public/ocr`);
}
