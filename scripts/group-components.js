#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ts = require("typescript");
const {
  ROOT,
  SRC,
  resolveSpecifier,
  rewriteSpecifier,
  stripExt,
  allSourceFiles,
  isRouteFile,
  walk,
} = require("./lib/module-paths");

const USAGE = `Usage: node scripts/group-components.js [options]

Groups every "<Name>.tsx" that has a sibling "<Name>.styles.ts" and/or
"<Name>.types.ts" into a "<Name>/" folder holding the component, its styles
(if any), its types (if any) and an index.ts re-exporting them.

Only imports that the move actually breaks are rewritten: relative paths
inside the moved files (which gain a directory level) and direct imports of
"<Name>.styles"/"<Name>.types" from elsewhere. Imports of "<Name>" itself are
left alone — they resolve through the new index.ts.

Route files (page/layout/error/not-found/...) are never moved: their location is
their URL. Their companion files are named after the parent folder instead, and
this script leaves them alone.

Options:
  --apply     Perform the moves (default is a dry run)
  --quiet     Only print the summary
  -h, --help  This message
`;

const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) {
  process.stdout.write(USAGE);
  process.exit(0);
}
const APPLY = args.includes("--apply");
const QUIET = args.includes("--quiet");

function parse(file, text) {
  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    /\.tsx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function exportedNames(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const values = [];
  const types = [];
  let hasDefault = false;
  function isExported(node) {
    return node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
  }

  for (const node of sf.statements) {
    if (ts.isExportAssignment(node)) hasDefault = true;
    else if (!isExported(node)) continue;
    else if (node.modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) hasDefault = true;
    else if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
      if (node.name) values.push(node.name.text);
    } else if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) values.push(decl.name.text);
      }
    } else if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      types.push(node.name.text);
    } else if (ts.isEnumDeclaration(node)) {
      values.push(node.name.text);
    }
  }
  return { values, types, hasDefault };
}

function siblingIndexCovers(dir, base) {
  const index = path.join(dir, "index.ts");
  if (!fs.existsSync(index)) return false;
  return new RegExp(`["']\\./${base}["']`).test(fs.readFileSync(index, "utf8"));
}

function collectGroups() {
  const groups = [];
  for (const file of walk(SRC)) {
    if (!file.endsWith(".tsx") || isRouteFile(file)) continue;
    const dir = path.dirname(file);
    const base = path.basename(file, ".tsx");
    const styles = path.join(dir, `${base}.styles.ts`);
    const types = path.join(dir, `${base}.types.ts`);
    const hasStyles = fs.existsSync(styles);
    const hasTypes = fs.existsSync(types);
    if (!hasStyles && !hasTypes) continue;
    if (path.basename(dir) === base) continue;
    if (siblingIndexCovers(dir, base)) continue;

    const members = [file];
    if (hasStyles) members.push(styles);
    if (hasTypes) members.push(types);
    groups.push({ base, dir, target: path.join(dir, base), members });
  }
  return groups;
}

const FILES = allSourceFiles();
const TEXTS = new Map(FILES.map((file) => [file, fs.readFileSync(file, "utf8")]));

const groups = collectGroups();
if (!groups.length) {
  console.log("Nothing to group.");
  process.exit(0);
}

const moves = new Map();
for (const group of groups) {
  for (const member of group.members) {
    moves.set(member, path.join(group.target, path.basename(member)));
  }
}

const indexFiles = new Map();
for (const group of groups) {
  const component = exportedNames(path.join(group.dir, `${group.base}.tsx`));
  const lines = [];
  if (component.values.length)
    lines.push(`export { ${component.values.join(", ")} } from "./${group.base}";`);
  if (component.types.length)
    lines.push(`export type { ${component.types.join(", ")} } from "./${group.base}";`);
  if (component.hasDefault) lines.push(`export { default } from "./${group.base}";`);

  for (const suffix of ["styles", "types"]) {
    const sideFile = path.join(group.dir, `${group.base}.${suffix}.ts`);
    if (!group.members.includes(sideFile)) continue;
    const sideUsers = new Set();
    for (const file of FILES) {
      if (group.members.includes(file)) continue;
      for (const match of TEXTS.get(file).matchAll(/from\s*["']([^"']+)["']/g)) {
        if (resolveSpecifier(match[1], file) === sideFile) sideUsers.add(file);
      }
    }
    if (!sideUsers.size) continue;
    const sideExports = exportedNames(sideFile);
    if (sideExports.values.length) {
      lines.push(`export { ${sideExports.values.join(", ")} } from "./${group.base}.${suffix}";`);
    }
    if (sideExports.types.length) {
      lines.push(
        `export type { ${sideExports.types.join(", ")} } from "./${group.base}.${suffix}";`,
      );
    }
  }
  indexFiles.set(path.join(group.target, "index.ts"), lines.join("\n") + "\n");
}

const futureFiles = new Set(FILES.map((file) => moves.get(file) ?? file));
for (const file of indexFiles.keys()) futureFiles.add(file);
function existsAfterMove(file) {
  return futureFiles.has(file);
}

const indexOwner = new Map();
const componentIndex = new Map();
for (const group of groups) {
  const index = path.join(group.target, "index.ts");
  for (const member of group.members) {
    indexOwner.set(path.join(group.target, path.basename(member)), index);
  }
  componentIndex.set(path.join(group.target, `${group.base}.tsx`), index);
}

let rewritten = 0;
const pending = new Map();
for (const file of FILES) {
  const text = TEXTS.get(file);
  const newSelf = moves.get(file) ?? file;
  let changed = false;
  const next = text.replace(
    /(from\s*["']|import\(\s*["'])([^"']+)(["'])/g,
    (whole, head, spec, tail) => {
      const target = resolveSpecifier(spec, file);
      if (!target) return whole;
      const moved = moves.get(target) ?? target;
      const landing = resolveSpecifier(spec, newSelf, existsAfterMove);
      if (landing === moved) return whole;
      if (landing && landing === indexOwner.get(moved)) return whole;
      const nextSpec = rewriteSpecifier(spec, componentIndex.get(moved) ?? moved, newSelf);
      if (nextSpec === spec || stripExt(moved) === stripExt(newSelf)) return whole;
      changed = true;
      return head + nextSpec + tail;
    },
  );
  if (changed) rewritten += 1;
  if (changed) pending.set(newSelf, next);
}

if (!QUIET) {
  for (const group of groups) {
    console.log(`${path.relative(ROOT, group.dir)}/ → ${group.base}/`);
    for (const member of group.members) console.log(`    ${path.basename(member)}`);
  }
}
console.log(
  `\n${groups.length} component(s) grouped, ${moves.size} file(s) moved, ${rewritten} file(s) with rewritten imports.`,
);

if (!APPLY) {
  console.log("Dry run — re-run with --apply to write.");
  process.exit(0);
}

for (const group of groups) fs.mkdirSync(group.target, { recursive: true });
for (const [from, to] of moves) {
  try {
    execFileSync("git", ["mv", from, to], { cwd: ROOT });
  } catch {
    fs.renameSync(from, to);
  }
}
for (const [file, text] of pending) fs.writeFileSync(file, text);
for (const [file, text] of indexFiles) fs.writeFileSync(file, text);

console.log("Done. Run: npx tsc --noEmit && npm run lint && npm test");
