#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const {
  ROOT,
  SRC,
  resolveSpecifier,
  allSourceFiles,
  companionBaseName,
  walk,
} = require("./lib/module-paths");

const USAGE = `Usage: node scripts/extract-types.js [options] [path...]

Moves top-level type aliases and interfaces out of .tsx files into a sibling
"<Name>.types.ts", re-importing them where the component still needs them and
rewriting every other file that imported those types.

Route files (page.tsx, layout.tsx, error.tsx, ...) get their companion named
after the parent folder — src/app/(dynamic)/library/page.tsx feeds
src/app/(dynamic)/library/library.types.ts.

A declaration stays put when it depends on a value or type that is local to the
component file (typeof someConst, a type built from a local generic), since
moving it would break the reference.

Options:
  --apply     Write the changes (default is a dry run)
  --quiet     Only print the summary
  -h, --help  This message
`;

const argv = process.argv.slice(2);
if (argv.includes("-h") || argv.includes("--help")) {
  process.stdout.write(USAGE);
  process.exit(0);
}
const APPLY = argv.includes("--apply");
const QUIET = argv.includes("--quiet");
const targets = argv.filter((a) => !a.startsWith("-"));

function parse(file, text) {
  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function importedBindings(sf) {
  const bindings = new Map();
  for (const node of sf.statements) {
    if (!ts.isImportDeclaration(node) || !node.importClause) continue;
    const clause = node.importClause;
    const specifier = node.moduleSpecifier.text;
    const typeOnlyClause = clause.isTypeOnly;
    if (clause.name) {
      bindings.set(clause.name.text, {
        specifier,
        kind: "default",
        typeOnly: typeOnlyClause,
        node,
      });
    }
    if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
      bindings.set(clause.namedBindings.name.text, {
        specifier,
        kind: "namespace",
        typeOnly: typeOnlyClause,
        node,
      });
    }
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const element of clause.namedBindings.elements) {
        bindings.set(element.name.text, {
          specifier,
          kind: "named",
          propertyName: element.propertyName?.text,
          typeOnly: typeOnlyClause || element.isTypeOnly,
          node,
        });
      }
    }
  }
  return bindings;
}

function topLevelNames(sf) {
  const names = new Set();
  for (const node of sf.statements) {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) names.add(decl.name.text);
      }
    } else if (node.name && ts.isIdentifier(node.name)) {
      names.add(node.name.text);
    }
  }
  return names;
}

function referencedNames(node) {
  const found = new Set();
  function visit(child) {
    if (ts.isTypeReferenceNode(child) || ts.isExpressionWithTypeArguments(child)) {
      let root = child.typeName ?? child.expression;
      while (root && (ts.isQualifiedName(root) || ts.isPropertyAccessExpression(root))) {
        root = root.left ?? root.expression;
      }
      if (root && ts.isIdentifier(root)) found.add(root.text);
    } else if (ts.isTypeQueryNode(child)) {
      let root = child.exprName;
      while (ts.isQualifiedName(root)) root = root.left;
      found.add(root.text);
    } else if (ts.isImportTypeNode(child) && child.qualifier) {
      found.add("__importType__");
    }
    ts.forEachChild(child, visit);
  }
  ts.forEachChild(node, visit);
  return found;
}

function typeParamNames(node) {
  return new Set((node.typeParameters ?? []).map((p) => p.name.text));
}

function isExported(node) {
  return node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function importLine(name, binding) {
  const type = binding.typeOnly ? "type " : "";
  if (binding.kind === "default") return `import ${type}${name} from "${binding.specifier}";`;
  if (binding.kind === "namespace")
    return `import ${type}* as ${name} from "${binding.specifier}";`;
  const named = binding.propertyName ? `${binding.propertyName} as ${name}` : name;
  return `import ${type}{ ${named} } from "${binding.specifier}";`;
}

function cutRanges(text, ranges) {
  let out = text;
  for (const [start, end] of [...ranges].sort((a, b) => b[0] - a[0])) {
    let from = start;
    while (from > 0 && (out[from - 1] === " " || out[from - 1] === "\t")) from -= 1;
    let to = end;
    while (to < out.length && (out[to] === "\n" || out[to] === "\r")) to += 1;
    out = out.slice(0, from) + out.slice(to);
  }
  return out.replace(/\n{3,}/g, "\n\n");
}

function candidateFiles() {
  if (!targets.length) return walk(SRC).filter((f) => f.endsWith(".tsx"));
  return targets
    .flatMap((t) => {
      const full = path.resolve(ROOT, t);
      return fs.statSync(full).isDirectory() ? walk(full) : [full];
    })
    .filter((f) => f.endsWith(".tsx"));
}

const FILES = allSourceFiles();
const TEXTS = new Map(FILES.map((file) => [file, fs.readFileSync(file, "utf8")]));

const plans = [];
for (const file of candidateFiles()) {
  const text = TEXTS.get(file) ?? fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const decls = sf.statements.filter(
    (n) => ts.isTypeAliasDeclaration(n) || ts.isInterfaceDeclaration(n),
  );
  if (!decls.length) continue;

  const locals = topLevelNames(sf);
  const imports = importedBindings(sf);
  const declNames = new Set(decls.map((d) => d.name.text));

  let moving = decls.slice();
  for (;;) {
    const movingNames = new Set(moving.map((d) => d.name.text));
    const kept = moving.filter((decl) => {
      const own = typeParamNames(decl);
      for (const ref of referencedNames(decl)) {
        if (own.has(ref) || ref === decl.name.text) continue;
        if (movingNames.has(ref)) continue;
        if (imports.has(ref)) continue;
        if (locals.has(ref) || declNames.has(ref)) return false;
      }
      return true;
    });
    if (kept.length === moving.length) break;
    moving = kept;
  }
  if (!moving.length) continue;

  const movingNames = new Set(moving.map((d) => d.name.text));
  const neededImports = new Map();
  for (const decl of moving) {
    for (const ref of referencedNames(decl)) {
      if (imports.has(ref) && !movingNames.has(ref)) neededImports.set(ref, imports.get(ref));
    }
  }

  const typesFile = path.join(path.dirname(file), `${companionBaseName(file)}.types.ts`);
  if (typesFile === file.replace(/\.tsx$/, ".types.ts") && typesFile === file) continue;

  const body = moving
    .map((decl) => {
      const src = text.slice(decl.getStart(sf), decl.end);
      return isExported(decl) ? src : `export ${src}`;
    })
    .join("\n\n");
  const header = [...neededImports].map(([name, binding]) => importLine(name, binding)).join("\n");
  const addition = (header ? header + "\n\n" : "") + body + "\n";

  const remaining = cutRanges(
    text,
    moving.map((d) => [d.getStart(sf), d.end]),
  );
  const stillUsed = [...movingNames].filter((name) =>
    new RegExp(`\\b${name}\\b`).test(remaining.replace(/^import[\s\S]*?;\s*$/gm, "")),
  );
  const exportedMoved = new Set(moving.filter(isExported).map((d) => d.name.text));

  plans.push({
    file,
    typesFile,
    addition,
    remaining,
    stillUsed,
    movingNames,
    exportedMoved,
    count: moving.length,
    skipped: decls.length - moving.length,
  });
}

const typesFileOf = new Map(plans.map((p) => [p.file, p]));

function specifierFor(fromFile, plan) {
  const rel = path
    .relative(path.dirname(fromFile), plan.typesFile.replace(/\.ts$/, ""))
    .split(path.sep)
    .join("/");
  return rel.startsWith(".") ? rel : "./" + rel;
}

const writes = new Map();

for (const plan of plans) {
  let source = plan.remaining;
  if (plan.stillUsed.length) {
    const line = `import type { ${plan.stillUsed.sort().join(", ")} } from "${specifierFor(plan.file, plan)}";\n`;
    const sf = parse(plan.file, source);
    const lastImport = [...sf.statements].reverse().find(ts.isImportDeclaration);
    const at = lastImport ? lastImport.end + 1 : 0;
    source = source.slice(0, at) + line + source.slice(at);
  }
  writes.set(plan.file, source);

  const existing = fs.existsSync(plan.typesFile)
    ? fs.readFileSync(plan.typesFile, "utf8").replace(/\s*$/, "\n")
    : "";
  writes.set(plan.typesFile, existing ? existing + "\n" + plan.addition : plan.addition);
}

let importerCount = 0;
for (const file of FILES) {
  if (typesFileOf.has(file)) continue;
  let text = writes.get(file) ?? TEXTS.get(file);
  const sf = parse(file, text);
  const edits = [];
  for (const node of sf.statements) {
    if (!ts.isImportDeclaration(node) || !node.importClause) continue;
    const named = node.importClause.namedBindings;
    if (!named || !ts.isNamedImports(named)) continue;
    const resolved = resolveSpecifier(node.moduleSpecifier.text, file);
    const plan = resolved && typesFileOf.get(resolved);
    if (!plan) continue;
    const moved = named.elements.filter((e) =>
      plan.exportedMoved.has((e.propertyName ?? e.name).text),
    );
    if (!moved.length) continue;
    const stay = named.elements.filter((e) => !moved.includes(e));
    function render(elements) {
      return elements
        .map((e) => (e.isTypeOnly ? "type " : "") + text.slice(e.getStart(sf), e.end))
        .join(", ");
    }
    const lines = [];
    if (stay.length || node.importClause.name) {
      const clause = node.importClause.name
        ? `${node.importClause.name.text}${stay.length ? `, { ${render(stay)} }` : ""}`
        : `{ ${render(stay)} }`;
      lines.push(
        `import ${node.importClause.isTypeOnly ? "type " : ""}${clause} from "${node.moduleSpecifier.text}";`,
      );
    }
    lines.push(`import type { ${render(moved)} } from "${specifierFor(file, plan)}";`);
    edits.push([node.getStart(sf), node.end, lines.join("\n")]);
  }
  if (!edits.length) continue;
  for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0])) {
    text = text.slice(0, start) + replacement + text.slice(end);
  }
  writes.set(file, text);
  importerCount += 1;
}

if (!QUIET) {
  for (const plan of plans) {
    console.log(
      `${path.relative(ROOT, plan.file)} → ${path.basename(plan.typesFile)}  (${plan.count} moved${plan.skipped ? `, ${plan.skipped} kept` : ""})`,
    );
  }
}
console.log(
  `\n${plans.length} file(s) touched, ${plans.reduce((n, p) => n + p.count, 0)} declaration(s) moved, ${importerCount} importer(s) updated.`,
);

if (!APPLY) {
  console.log("Dry run — re-run with --apply to write.");
  process.exit(0);
}

for (const [file, text] of writes) fs.writeFileSync(file, text);
console.log("Done. Run: npx tsc --noEmit && npm run lint && npm test");
