const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.join(__dirname, "..");
const modules = path.join(root, "node_modules");
const target = path.join(root, "public", "models");

const REPO = "Xenova/all-MiniLM-L6-v2";
const REVISION = "main";

const MODEL_FILES = [
  "config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "special_tokens_map.json",
  "onnx/model_uint8.onnx",
];

const RUNTIME_FILES = ["ort-wasm-simd-threaded.wasm", "ort-wasm-simd-threaded.mjs"];

const LIBRARY = {
  from: ["@huggingface", "transformers", "dist", "transformers.web.min.js"],
  to: "transformers.web.min.js",
};

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function download(url, to) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
          response.resume();
          download(new URL(response.headers.location, url).href, to).then(resolve, reject);
          return;
        }
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`${response.statusCode} for ${url}`));
          return;
        }
        ensureDir(to);
        const partial = `${to}.partial`;
        const file = fs.createWriteStream(partial);
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            fs.renameSync(partial, to);
            resolve();
          });
        });
        file.on("error", reject);
      })
      .on("error", reject);
  });
}

async function syncModel() {
  const into = path.join(target, "minilm");
  for (const name of MODEL_FILES) {
    const to = path.join(into, name);
    if (fs.existsSync(to)) continue;
    const url = `https://huggingface.co/${REPO}/resolve/${REVISION}/${name}`;
    process.stdout.write(`  downloading ${name}\n`);
    await download(url, to);
  }
}

function syncRuntime() {
  const from = path.join(modules, "onnxruntime-web", "dist");
  const into = path.join(target, "ort");
  for (const name of RUNTIME_FILES) {
    const source = path.join(from, name);
    if (!fs.existsSync(source)) continue;
    const to = path.join(into, name);
    ensureDir(to);
    fs.copyFileSync(source, to);
  }
}

function syncLibrary() {
  const source = path.join(modules, ...LIBRARY.from);
  if (!fs.existsSync(source)) {
    process.stderr.write(
      `  missing ${LIBRARY.from.join("/")}, on-device classification will not load\n`,
    );
    return;
  }
  const to = path.join(target, LIBRARY.to);
  ensureDir(to);
  fs.copyFileSync(source, to);
}

async function main() {
  await syncModel();
  syncRuntime();
  syncLibrary();
  process.stdout.write("Model assets are in public/models.\n");
}

main().catch((cause) => {
  process.stderr.write(`Model assets failed: ${cause.message}\n`);
  process.exitCode = 1;
});
