const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const SRC = path.join(ROOT, "src");

const ALIASES = [["@/", ROOT]];

const EXTS = [".ts", ".tsx", ".js", ".jsx"];

function onDisk(file) {
  return fs.existsSync(file) && fs.statSync(file).isFile();
}

function resolveToFile(base, hasFile = onDisk) {
  if (hasFile(base)) return base;
  for (const ext of EXTS) {
    if (hasFile(base + ext)) return base + ext;
  }
  for (const ext of EXTS) {
    const idx = path.join(base, "index" + ext);
    if (hasFile(idx)) return idx;
  }
  return null;
}

function resolveSpecifier(specifier, fromFile, hasFile = onDisk) {
  if (specifier.startsWith(".")) {
    return resolveToFile(path.resolve(path.dirname(fromFile), specifier), hasFile);
  }
  for (const [prefix, dir] of ALIASES) {
    if (specifier.startsWith(prefix)) {
      return resolveToFile(path.join(dir, specifier.slice(prefix.length)), hasFile);
    }
  }
  return null;
}

function stripExt(file) {
  return file.replace(/\.(tsx|ts|jsx|js)$/, "");
}

function toRelativeSpecifier(targetFile, fromFile) {
  let rel = path.relative(path.dirname(fromFile), stripExt(targetFile));
  rel = rel.split(path.sep).join("/");
  rel = rel.replace(/\/index$/, "");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

function toAliasSpecifier(targetFile, originalSpecifier) {
  const prefix = ALIASES.find(([p]) => originalSpecifier.startsWith(p));
  if (!prefix) return null;
  const [name, dir] = prefix;
  const stripped = stripExt(targetFile);
  if (!stripped.startsWith(dir + path.sep)) return null;
  let rest = path.relative(dir, stripped).split(path.sep).join("/");
  rest = rest.replace(/\/index$/, "");
  return name + rest;
}

function rewriteSpecifier(originalSpecifier, targetFile, fromFile) {
  if (!originalSpecifier.startsWith(".")) {
    const aliased = toAliasSpecifier(targetFile, originalSpecifier);
    if (aliased) return aliased;
  }
  return toRelativeSpecifier(targetFile, fromFile);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function allSourceFiles() {
  const dirs = ["src", "tests"].map((d) => path.join(ROOT, d)).filter(fs.existsSync);
  return dirs.flatMap((d) => walk(d));
}

function isRouteFile(file) {
  return /^(page|layout|template|error|loading|not-found|global-error|default|route)$/.test(
    path.basename(file).replace(/\.(tsx|ts)$/, ""),
  );
}

function companionBaseName(file) {
  const base = path.basename(file).replace(/\.(tsx|ts)$/, "");
  if (!isRouteFile(file)) return base;
  const parent = path.basename(path.dirname(file));
  return parent.replace(/^[([]|[)\]]$/g, "") || base;
}

module.exports = {
  ROOT,
  SRC,
  resolveSpecifier,
  resolveToFile,
  rewriteSpecifier,
  toRelativeSpecifier,
  stripExt,
  allSourceFiles,
  isRouteFile,
  companionBaseName,
  walk,
};
