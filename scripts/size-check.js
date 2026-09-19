const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const DIRS = ["app", "context", "hooks", "components", "lib"];
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"];
const THRESHOLD = 200;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function countLines(file) {
  const content = fs.readFileSync(file, "utf8");
  if (content === "") return 0;
  return content.split("\n").length;
}

const results = [];
for (const dir of DIRS) {
  const abs = path.join(root, "src", dir);
  if (!fs.existsSync(abs)) continue;
  for (const file of walk(abs)) {
    const lines = countLines(file);
    if (lines > THRESHOLD) {
      results.push({ file: path.relative(root, file), lines });
    }
  }
}

results.sort((a, b) => b.lines - a.lines);

const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function colorize(lines, text) {
  if (lines <= 249) return `${GREEN}${text}${RESET}`;
  if (lines <= 400) return `${YELLOW}${text}${RESET}`;
  return `${RED}${text}${RESET}`;
}

if (results.length === 0) {
  console.log(`No files over ${THRESHOLD} lines in: ${DIRS.join(", ")}`);
} else {
  const width = String(results[0].lines).length;
  console.log(`${results.length} file(s) over ${THRESHOLD} lines (longest first):\n`);
  for (const { file, lines } of results) {
    const row = `${String(lines).padStart(width)}  ${file}`;
    console.log(colorize(lines, row));
  }
}
