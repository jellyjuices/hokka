#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const os = require("os");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_TARGETS = ["src", "tests"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SKIP_FILES = new Set([
  path.join("scripts", "android-deploy.js"),
  path.join("scripts", "ios-deploy.js"),
  path.join("scripts", "arrow-to-function.js"),
]);
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "out",
  "android",
  "ios",
  "coverage",
  ".code-review-graph",
]);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry");
const verbose = args.includes("--list") || dryRun;
const verifyOnly = args.includes("--verify-only");
const verify = !dryRun && !args.includes("--no-verify");
const positional = [];
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--skip") {
    SKIP_FILES.add(args[i + 1]);
    i += 1;
  } else if (!args[i].startsWith("--")) {
    positional.push(args[i]);
  }
}
const targets = positional;

function walk(dir, files) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, files);
    } else if (EXTS.has(path.extname(entry.name)) && !entry.name.endsWith(".d.ts")) {
      if (SKIP_FILES.has(path.relative(ROOT, full))) continue;
      files.push(full);
    }
  }
  return files;
}

function collectFiles() {
  const list = [];
  for (const target of targets.length ? targets : DEFAULT_TARGETS) {
    const full = path.resolve(ROOT, target);
    if (!fs.existsSync(full)) continue;
    if (fs.statSync(full).isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

function scriptKind(file) {
  if (file.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (file.endsWith(".ts")) return ts.ScriptKind.TS;
  return ts.ScriptKind.JSX;
}

function containsJsx(node) {
  let found = false;
  const visit = (n) => {
    if (found) return;
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) {
      found = true;
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
}

function returnsJsx(arrow) {
  if (!ts.isBlock(arrow.body)) return containsJsx(arrow.body);
  let found = false;
  const visit = (n) => {
    if (found) return;
    if (ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n)) return;
    if (ts.isReturnStatement(n) && n.expression && containsJsx(n.expression)) {
      found = true;
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(arrow.body);
  return found;
}

function usesThisOrArguments(arrow) {
  let found = false;
  const visit = (n) => {
    if (found) return;
    if (n.kind === ts.SyntaxKind.ThisKeyword) {
      found = true;
      return;
    }
    if (ts.isIdentifier(n) && n.text === "arguments") {
      found = true;
      return;
    }
    if (ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isClassLike(n)) return;
    ts.forEachChild(n, visit);
  };
  visit(arrow.body);
  for (const param of arrow.parameters) visit(param);
  return found;
}

function hasAsyncModifier(arrow) {
  return (arrow.modifiers ?? []).some((m) => m.kind === ts.SyntaxKind.AsyncKeyword);
}

function convertFile(file, text, blacklist) {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));

  const edits = [];

  const visit = (node) => {
    ts.forEachChild(node, visit);
    if (!ts.isVariableStatement(node)) return;
    const list = node.declarationList;
    if (!(list.flags & ts.NodeFlags.Const)) return;
    if (list.declarations.length !== 1) return;
    const decl = list.declarations[0];
    if (!ts.isIdentifier(decl.name)) return;
    if (decl.type) return;
    if (!decl.initializer || !ts.isArrowFunction(decl.initializer)) return;
    if ((node.modifiers ?? []).some((m) => m.kind === ts.SyntaxKind.DeclareKeyword)) return;

    const arrow = decl.initializer;
    if (blacklist.has(decl.name.text)) return;
    if (returnsJsx(arrow)) return;
    if (usesThisOrArguments(arrow)) return;

    const stmtStart = node.getStart(sf);
    const constStart = list.getStart(sf);
    const prefix = text.slice(stmtStart, constStart);
    const name = decl.name.text;
    const isAsync = hasAsyncModifier(arrow);

    let typeParams = "";
    let sigStart = arrow.getStart(sf);
    if (isAsync) {
      const asyncMod = arrow.modifiers.find((m) => m.kind === ts.SyntaxKind.AsyncKeyword);
      sigStart = asyncMod.end;
    }
    if (arrow.typeParameters) {
      const open = text.indexOf("<", sigStart);
      const close = text.indexOf(">", arrow.typeParameters.end - 1);
      if (open === -1 || close === -1) return;
      typeParams = text.slice(open, close + 1).replace(/,\s*>$/, ">");
      sigStart = close + 1;
    }

    let signature = text.slice(sigStart, arrow.equalsGreaterThanToken.getStart(sf)).trim();
    if (!signature.startsWith("(")) signature = `(${signature})`;

    const lineStart = text.lastIndexOf("\n", stmtStart) + 1;
    const indent = text.slice(lineStart, stmtStart).match(/^[ \t]*/)[0];

    let body;
    if (ts.isBlock(arrow.body)) {
      body = text.slice(arrow.body.getStart(sf), arrow.body.end);
    } else {
      body = `{\n${indent}  return ${text.slice(arrow.body.getStart(sf), arrow.body.end)};\n${indent}}`;
    }

    const replacement = `${prefix}${isAsync ? "async " : ""}function ${name}${typeParams}${signature} ${body}`;
    edits.push({ start: stmtStart, end: node.end, replacement, name });
  };

  visit(sf);
  const outer = edits.filter(
    (edit) =>
      !edits.some((other) => other !== edit && other.start < edit.start && other.end >= edit.end),
  );
  if (!outer.length) return null;

  const nested = edits.length - outer.length;
  outer.sort((a, b) => b.start - a.start);
  let out = text;
  for (const edit of outer) {
    out = out.slice(0, edit.start) + edit.replacement + out.slice(edit.end);
  }
  return { out, names: outer.map((edit) => edit.name), nested };
}

function convertText(file, text) {
  const names = [];
  let current = text;
  for (let pass = 0; pass < 10; pass += 1) {
    let result;
    try {
      result = convertFile(file, current, new Set());
    } catch (err) {
      console.error(`skip ${path.relative(ROOT, file)}: ${err.message}`);
      break;
    }
    if (!result) break;
    names.push(...result.names);
    current = result.out;
    if (!result.nested) break;
  }
  return { text: current, names };
}

function revertFunction(file, name) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
  let target = null;
  const visit = (node) => {
    if (target) return;
    if (ts.isFunctionDeclaration(node) && node.name && node.name.text === name && node.body) {
      target = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!target) return false;

  const start = target.getStart(sf);
  const modifiers = (target.modifiers ?? []).filter((m) => m.kind !== ts.SyntaxKind.AsyncKeyword);
  const isAsync = (target.modifiers ?? []).some((m) => m.kind === ts.SyntaxKind.AsyncKeyword);
  const prefix = modifiers.length
    ? `${text.slice(start, modifiers[modifiers.length - 1].end)} `
    : "";

  let typeParams = "";
  if (target.typeParameters) {
    const open = text.indexOf("<", target.name.end);
    const close = text.indexOf(">", target.typeParameters.end - 1);
    typeParams = text.slice(open, close + 1);
    if (file.endsWith(".tsx") && !/,\s*>$/.test(typeParams))
      typeParams = `${typeParams.slice(0, -1)},>`;
  }
  const sigStart = target.typeParameters
    ? text.indexOf(">", target.typeParameters.end - 1) + 1
    : target.name.end;
  const signature = text.slice(sigStart, target.body.getStart(sf)).trim();
  const body = text.slice(target.body.getStart(sf), target.body.end);

  const replacement = `${prefix}const ${name} = ${isAsync ? "async " : ""}${typeParams}${signature} => ${body};`;
  fs.writeFileSync(file, text.slice(0, start) + replacement + text.slice(target.end));
  return true;
}

function runTsc() {
  const out = spawnSync("npx", ["tsc", "--noEmit", "--pretty", "false"], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const diagnostics = [];
  for (const line of `${out.stdout}${out.stderr}`.split("\n")) {
    const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/);
    if (!match) continue;
    diagnostics.push({
      file: path.resolve(ROOT, match[1]),
      line: Number(match[2]),
      column: Number(match[3]),
      message: match[5],
    });
  }
  return diagnostics;
}

function offsetOf(text, line, column) {
  const lines = text.split("\n");
  let offset = 0;
  for (let i = 0; i < line - 1 && i < lines.length; i += 1) offset += lines[i].length + 1;
  return offset + column - 1;
}

function enclosingFunctionNames(file, line, column) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
  const offset = offsetOf(text, line, column);
  const found = [];
  const visit = (node) => {
    if (node.getStart(sf) > offset || node.end < offset) return;
    if (ts.isFunctionDeclaration(node) && node.name) found.push(node.name.text);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found.reverse();
}

function candidatesFromDiff() {
  const out = spawnSync("git", ["diff", "-U0", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const map = new Map();
  let file = null;
  for (const line of out.stdout.split("\n")) {
    const header = line.match(/^\+\+\+ b\/(.*)$/);
    if (header) {
      file = path.resolve(ROOT, header[1]);
      continue;
    }
    const removed = line.match(
      /^-\s*(?:export\s+)?const\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?[(<]/,
    );
    if (removed && file) {
      if (!map.has(file)) map.set(file, new Set());
      map.get(file).add(removed[1]);
    }
  }
  return map;
}

function verifyLoop(candidates) {
  for (let round = 0; round < 12; round += 1) {
    const diagnostics = runTsc();
    if (!diagnostics.length) return [];
    let reverted = 0;
    const touched = new Set();
    const unattributed = [];
    for (const diagnostic of diagnostics) {
      if (touched.has(diagnostic.file)) continue;
      const names = candidates.get(diagnostic.file);
      if (!names || !names.size) {
        unattributed.push(diagnostic);
        continue;
      }
      const enclosing = enclosingFunctionNames(
        diagnostic.file,
        diagnostic.line,
        diagnostic.column,
      ).find((candidate) => names.has(candidate));
      if (!enclosing) {
        unattributed.push(diagnostic);
        continue;
      }
      if (revertFunction(diagnostic.file, enclosing)) {
        names.delete(enclosing);
        touched.add(diagnostic.file);
        reverted += 1;
        continue;
      }
      unattributed.push(diagnostic);
    }
    if (!reverted) return unattributed;
    console.log(`  verify round ${round + 1}: reverted ${reverted}`);
  }
  return runTsc();
}

const files = collectFiles();

if (verifyOnly) {
  const candidates = candidatesFromDiff();
  const left = verifyLoop(candidates);
  console.log(`${left.length} type error(s) remain`);
  for (const diagnostic of left.slice(0, 15)) {
    console.log(
      `  ${path.relative(ROOT, diagnostic.file)}:${diagnostic.line} ${diagnostic.message}`,
    );
  }
  process.exit(0);
}

const converted = new Map();
for (const file of files) {
  const result = convertText(file, fs.readFileSync(file, "utf8"));
  if (!result.names.length) continue;
  converted.set(file, new Set(result.names));
  if (verbose) console.log(`${path.relative(ROOT, file)}: ${result.names.join(", ")}`);
  if (!dryRun) fs.writeFileSync(file, result.text);
}

const total = [...converted.values()].reduce((sum, set) => sum + set.size, 0);
console.log(`${dryRun ? "[dry run] " : ""}${total} arrow const(s) in ${converted.size} file(s)`);

if (dryRun || !converted.size) process.exit(0);

const left = verify
  ? verifyLoop(new Map([...converted].map(([file, names]) => [file, new Set(names)])))
  : [];

const changedPaths = [...converted.keys()].map((file) => path.relative(ROOT, file));
spawnSync("npx", ["prettier", "--write", ...changedPaths], { cwd: ROOT, stdio: "ignore" });
fs.writeFileSync(path.join(os.tmpdir(), "arrow-to-function-files.txt"), changedPaths.join("\n"));

if (left.length) {
  console.log(`${left.length} type error(s) remain and were not caused by this codemod:`);
  for (const diagnostic of left.slice(0, 15)) {
    console.log(
      `  ${path.relative(ROOT, diagnostic.file)}:${diagnostic.line} ${diagnostic.message}`,
    );
  }
}
