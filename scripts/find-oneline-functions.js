#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_TARGETS = ["src"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
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
  "vendor",
]);
const SKIP_FILES = new Set([
  path.join("scripts", "android-deploy.js"),
  path.join("scripts", "ios-deploy.js"),
]);

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const countOnly = args.includes("--count");
const includeCallbacks = args.includes("--callbacks");
const aliasOnly = args.includes("--alias");
const looseAlias = args.includes("--loose");
const positional = args.filter((a) => !a.startsWith("--"));
const targets = positional.length ? positional : DEFAULT_TARGETS;

function walk(dir, files) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
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
  const files = [];
  for (const target of targets) {
    const full = path.isAbsolute(target) ? target : path.join(ROOT, target);
    if (!fs.existsSync(full)) continue;
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files.sort();
}

function containsJsx(node) {
  let found = false;
  function visit(n) {
    if (found) return;
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) {
      found = true;
      return;
    }
    ts.forEachChild(n, visit);
  }
  visit(node);
  return found;
}

function isTrivialReturn(fn) {
  const body = fn.body;
  if (!body) return null;
  if (!ts.isBlock(body)) return body;
  const statements = body.statements;
  if (statements.length !== 1) return null;
  const only = statements[0];
  if (!ts.isReturnStatement(only)) return null;
  return only.expression ?? null;
}

function nameOf(fn, parent) {
  if (fn.name && ts.isIdentifier(fn.name)) return fn.name.text;
  if (!parent) return null;
  if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) return parent.name.text;
  if (ts.isPropertyAssignment(parent) && ts.isIdentifier(parent.name)) return parent.name.text;
  if (ts.isPropertyDeclaration(parent) && ts.isIdentifier(parent.name)) return parent.name.text;
  return null;
}

function isNamedDefinition(fn, parent) {
  if (ts.isFunctionDeclaration(fn)) return true;
  if (ts.isMethodDeclaration(fn) || ts.isGetAccessor(fn)) return true;
  if (!parent) return false;
  if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) return true;
  if (ts.isPropertyDeclaration(parent) && ts.isIdentifier(parent.name)) return true;
  return false;
}

function wrappedInHook(parent) {
  let node = parent;
  while (node) {
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const text = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : "";
      if (/^(useCallback|useMemo|useSyncExternalStore|memo|forwardRef)$/.test(text)) return true;
    }
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) return false;
    node = node.parent;
  }
  return false;
}

function scanFile(file) {
  const source = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const bindings = topLevelBindings(sf);
  const hits = [];
  function visit(node) {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isGetAccessor(node)
    ) {
      const parent = node.parent;
      const named = isNamedDefinition(node, parent);
      if (named || includeCallbacks) {
        const expr = isTrivialReturn(node);
        if (expr !== null && !containsJsx(expr) && !wrappedInHook(parent)) {
          const name = nameOf(node, parent);
          if (name || includeCallbacks) {
            if (isTypePredicate(node)) {
              ts.forEachChild(node, visit);
              return;
            }
            const target = aliasTargetOf(node, expr, sf);
            const alias = target ? classifyAlias(target, bindings, sf) : null;
            if (!aliasOnly || alias) {
              const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
              hits.push({
                file: path.relative(ROOT, file),
                line: line + 1,
                kind: kindOf(expr),
                alias,
                shape: target ? target.shape : null,
                aliasOf: target ? target.text : null,
                name: name || "(anonymous)",
                body: expr.getText(sf).replace(/\s+/g, " ").slice(0, 100),
                exported: isExported(node, parent),
              });
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return hits;
}

function kindOf(expr) {
  let node = expr;
  while (
    ts.isParenthesizedExpression(node) ||
    ts.isAsExpression(node) ||
    ts.isNonNullExpression(node)
  ) {
    node = node.expression;
  }
  if (ts.isCallExpression(node) || ts.isAwaitExpression(node)) return "passthrough";
  if (
    ts.isIdentifier(node) ||
    ts.isPropertyAccessExpression(node) ||
    ts.isElementAccessExpression(node)
  ) {
    return "passthrough";
  }
  return "expression";
}

function unwrap(node) {
  let n = node;
  for (;;) {
    if (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || ts.isNonNullExpression(n)) {
      n = n.expression;
    } else if (ts.isAwaitExpression(n)) {
      n = n.expression;
    } else {
      return n;
    }
  }
}

function rootIdentifier(node) {
  let n = node;
  while (ts.isPropertyAccessExpression(n) || ts.isElementAccessExpression(n)) n = n.expression;
  return ts.isIdentifier(n) ? n.text : null;
}

function calleeText(node, sf) {
  return node.getText(sf).replace(/\s+/g, " ");
}

function argsAreTrivial(fn, call) {
  const names = new Set(
    fn.parameters.filter((p) => ts.isIdentifier(p.name)).map((p) => p.name.text),
  );
  return call.arguments.every((arg) => {
    const a = unwrap(arg);
    if (ts.isIdentifier(a)) return names.has(a.text) || a.text === "undefined";
    return (
      ts.isStringLiteral(a) ||
      ts.isNumericLiteral(a) ||
      a.kind === ts.SyntaxKind.TrueKeyword ||
      a.kind === ts.SyntaxKind.FalseKeyword ||
      a.kind === ts.SyntaxKind.NullKeyword
    );
  });
}

function forwardsParametersExactly(fn, call) {
  const params = fn.parameters;
  const argsList = call.arguments;
  if (params.length !== argsList.length) return false;
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    const arg = argsList[i];
    if (!ts.isIdentifier(param.name)) return false;
    if (param.initializer) return false;
    if (param.dotDotDotToken) {
      if (!ts.isSpreadElement(arg)) return false;
      if (!ts.isIdentifier(arg.expression) || arg.expression.text !== param.name.text) return false;
    } else {
      if (!ts.isIdentifier(arg) || arg.text !== param.name.text) return false;
    }
  }
  return true;
}

function aliasTargetOf(fn, expr, sf) {
  const node = unwrap(expr);
  if (ts.isCallExpression(node)) {
    if (node.questionDotToken) return null;
    const exact = forwardsParametersExactly(fn, node);
    if (!exact && !(looseAlias && argsAreTrivial(fn, node))) return null;
    const callee = unwrap(node.expression);
    if (!ts.isIdentifier(callee) && !ts.isPropertyAccessExpression(callee)) return null;
    return {
      text: calleeText(callee, sf),
      root: rootIdentifier(callee),
      shape: ts.isIdentifier(callee) ? "call-identifier" : "call-method",
    };
  }
  if (
    fn.parameters.length === 0 &&
    (ts.isIdentifier(node) || ts.isPropertyAccessExpression(node))
  ) {
    return { text: calleeText(node, sf), root: rootIdentifier(node), shape: "value" };
  }
  return null;
}

function topLevelBindings(sf) {
  const map = new Map();
  for (const statement of sf.statements) {
    const mods = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
    const exported = Boolean(mods?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword));
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      map.set(statement.name.text, exported ? "exported" : "private");
    } else if (ts.isVariableStatement(statement)) {
      for (const decl of statement.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) map.set(decl.name.text, exported ? "exported" : "private");
      }
    } else if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause;
      if (!clause) continue;
      if (clause.name) map.set(clause.name.text, "imported");
      const bindings = clause.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) map.set(bindings.name.text, "imported");
      if (bindings && ts.isNamedImports(bindings)) {
        for (const el of bindings.elements) map.set(el.name.text, "imported");
      }
    }
  }
  return map;
}

const BUILTIN_METHODS = new Set([
  "includes",
  "test",
  "map",
  "filter",
  "find",
  "findIndex",
  "some",
  "every",
  "reduce",
  "join",
  "slice",
  "splice",
  "concat",
  "indexOf",
  "lastIndexOf",
  "push",
  "pop",
  "shift",
  "unshift",
  "sort",
  "reverse",
  "flat",
  "flatMap",
  "replace",
  "replaceAll",
  "split",
  "trim",
  "match",
  "matchAll",
  "startsWith",
  "endsWith",
  "padStart",
  "padEnd",
  "repeat",
  "toString",
  "toLowerCase",
  "toUpperCase",
  "has",
  "get",
  "set",
  "add",
  "delete",
  "keys",
  "values",
  "entries",
  "then",
  "catch",
  "finally",
  "call",
  "apply",
  "bind",
]);

function classifyAlias(target, bindings, sf) {
  if (!target.root) return null;
  if (!declaredSomewhere(target.root, sf)) return null;
  const parts = target.text.split(".");
  if (parts.length > 1 && BUILTIN_METHODS.has(parts[parts.length - 1])) return null;
  const origin = bindings.get(target.root);
  if (origin === "imported" || origin === "exported") return "rename";
  if (origin === "private") return "door";
  if (!origin) return "local";
  return null;
}

function declaredSomewhere(name, sf) {
  let found = false;
  function visit(node) {
    if (found) return;
    if (
      (ts.isVariableDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isParameter(node) ||
        ts.isImportSpecifier(node) ||
        ts.isImportClause(node) ||
        ts.isNamespaceImport(node)) &&
      node.name &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    ) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return found;
}

function isTypePredicate(fn) {
  return Boolean(fn.type && ts.isTypePredicateNode(fn.type));
}

function isExported(fn, parent) {
  let node = ts.isFunctionDeclaration(fn) ? fn : parent;
  while (node) {
    if (ts.isVariableStatement(node) || ts.isFunctionDeclaration(node)) {
      const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
      return Boolean(mods?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword));
    }
    if (ts.isSourceFile(node)) return false;
    node = node.parent;
  }
  return false;
}

const files = collectFiles();
const hits = [];
for (const file of files) hits.push(...scanFile(file));

function referenceScanRoots() {
  const roots = new Set(files);
  const testsDir = path.join(ROOT, "tests");
  if (fs.existsSync(testsDir)) walk(testsDir, []).forEach((f) => roots.add(f));
  return [...roots];
}

function inlineVerdict(hit) {
  if (hit.alias === "door") return "door";
  if (hit.refs > 0 && hit.shape === "value") {
    return "needs a function value where it is passed by reference";
  }
  if (hit.refs > 0 && hit.shape === "call-method") {
    return "passing the target directly would unbind its receiver";
  }
  return null;
}

function annotateUsage(list) {
  if (!list.length) return;
  const names = new Set(list.map((h) => h.name));
  const escaped = [...names].map((n) => n.replace(/[$]/g, "\\$&")).join("|");
  const pattern = new RegExp(`\\b(${escaped})\\b(\\s*\\()?`, "g");
  const perFile = new Map();
  for (const file of referenceScanRoots()) {
    const counts = new Map();
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (/^\s*(import|export)\s*[{*]/.test(line)) continue;
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(line))) {
        const entry = counts.get(match[1]) ?? { calls: 0, refs: 0, byLine: new Map() };
        const own = entry.byLine.get(i + 1) ?? { calls: 0, refs: 0 };
        if (match[2]) {
          entry.calls += 1;
          own.calls += 1;
        } else {
          entry.refs += 1;
          own.refs += 1;
        }
        entry.byLine.set(i + 1, own);
        counts.set(match[1], entry);
      }
    }
    perFile.set(path.relative(ROOT, file), counts);
  }
  for (const hit of list) {
    let calls = 0;
    let refs = 0;
    const scope = hit.exported ? [...perFile.keys()] : [hit.file];
    for (const file of scope) {
      const entry = perFile.get(file)?.get(hit.name);
      if (!entry) continue;
      calls += entry.calls;
      refs += entry.refs;
    }
    const own = perFile.get(hit.file)?.get(hit.name)?.byLine.get(hit.line);
    hit.calls = Math.max(0, calls - (own?.calls ?? 0));
    hit.refs = Math.max(0, refs - (own?.refs ?? 0));
    hit.scope = hit.exported ? "repo" : "file";
  }
}

annotateUsage(hits);

if (asJson) {
  console.log(JSON.stringify(hits, null, 2));
} else if (countOnly) {
  console.log(String(hits.length));
} else if (aliasOnly) {
  for (const hit of hits) hit.blocker = inlineVerdict(hit);
  const inlinable = hits.filter((h) => !h.blocker);
  const blocked = hits.filter((h) => h.blocker && h.blocker !== "door");
  const doors = hits.filter((h) => h.blocker === "door");

  function render(group) {
    for (const hit of group) {
      const notes = [];
      if (hit.refs > 0) notes.push(`passed-by-ref×${hit.refs}`);
      if (hit.calls > 0) notes.push(`calls×${hit.calls} (${hit.scope})`);
      console.log(
        `  ${hit.file}:${hit.line}  ${hit.exported ? "export " : ""}${hit.name}  →  ${hit.body}` +
          (notes.length ? `   [${notes.join(", ")}]` : ""),
      );
      if (hit.blocker && hit.blocker !== "door") console.log(`         KEEP — ${hit.blocker}`);
    }
  }

  if (inlinable.length) {
    console.log("\nINLINE — the alias adds nothing; call the target directly");
    render(inlinable);
  }
  if (blocked.length) {
    console.log("\nKEEP — an alias, but removing it changes behaviour");
    render(blocked);
  }
  if (doors.length) {
    console.log(
      "\nDOOR — delegates to a module-private binding; removing it means exporting internals",
    );
    render(doors);
  }
  console.log(
    `\n${hits.length} alias(es) — ${inlinable.length} inlinable, ` +
      `${blocked.length} behaviour-blocked, ${doors.length} doors.`,
  );
} else {
  let current = "";
  for (const hit of hits) {
    if (hit.file !== current) {
      current = hit.file;
      console.log(`\n${current}`);
    }
    const notes = [];
    if (hit.alias) notes.push(hit.alias);
    if (hit.refs > 0) notes.push(`passed-by-ref×${hit.refs}`);
    if (hit.calls > 0) notes.push(`calls×${hit.calls}`);
    console.log(
      `  ${String(hit.line).padStart(5)}  ${hit.exported ? "export " : ""}${hit.name}  →  ${hit.body}` +
        (notes.length ? `   [${notes.join(", ")}]` : ""),
    );
  }
  const passthrough = hits.filter((h) => h.kind === "passthrough").length;
  console.log(
    `\n${hits.length} one-line function(s) in ${files.length} file(s) — ` +
      `${passthrough} pure passthrough, ${hits.length - passthrough} single-expression, ` +
      `${hits.filter((h) => h.exported).length} exported.`,
  );
}
process.exitCode = hits.length ? 1 : 0;
