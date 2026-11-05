import { promises as fs } from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";
import traverseDefault from "@babel/traverse";
import {
  isArrayExpression,
  isBinaryExpression,
  isCallExpression,
  isConditionalExpression,
  isLogicalExpression,
  isIdentifier,
  isImportDeclaration,
  isMemberExpression,
  isObjectExpression,
  isObjectProperty,
  isOptionalCallExpression,
  isOptionalMemberExpression,
  isStringLiteral,
  isTemplateLiteral,
  isTSNonNullExpression
} from "@babel/types";
const traverseModule = traverseDefault;
const traverse = typeof traverseModule === "function" ? traverseModule : traverseModule.default;
const CONTENT_MODULE = "@airo/content";
const BOUND_IMPORT_NAME = "Text";
const TEXT_ATTRIBUTES = /* @__PURE__ */ new Set(["alt", "placeholder", "title"]);
const VALUE_ELEMENTS = /* @__PURE__ */ new Set(["input", "textarea"]);
const UNBINDABLE_PARENTS = /* @__PURE__ */ new Set(["style", "script", "option", "textarea", "title"]);
const DEFAULT_SCAN_ROOTS = ["src/pages", "src/components", "src/layouts"];
const ATTRIBUTE_KINDS = /* @__PURE__ */ new Set([
  "alt",
  "placeholder",
  "title",
  "input-value"
]);
function isAttributeKind(kind) {
  return ATTRIBUTE_KINDS.has(kind);
}
const ENFORCED_KINDS = /* @__PURE__ */ new Set([
  "jsx-text",
  "jsx-expression-literal",
  "local-map",
  "local-const"
]);
function isEnforcedSite(site) {
  return ENFORCED_KINDS.has(site.kind);
}
function enforcedSites(sites) {
  return sites.filter(isEnforcedSite);
}
function report(bound, sites, filesScanned, options = {}) {
  const unbound = sites.length;
  const total = bound + unbound;
  return {
    bound,
    unbound,
    compliance: total === 0 ? 0 : bound / total,
    filesScanned,
    sites,
    i18nSites: options.i18nSites ?? [],
    parseError: options.parseError
  };
}
const PAGES_ROOT = "src/pages";
const COMPONENTS_ROOT = "src/components";
const GATED_ROOTS = DEFAULT_SCAN_ROOTS;
const UI_PREFIX = `${COMPONENTS_ROOT}/ui`;
function toPosix(relPath) {
  return relPath.split(path.sep).join("/");
}
const TEST_MODULE = /\.test\.[jt]sx?$/;
const FRAMEWORK_FILES = /* @__PURE__ */ new Set([
  "src/components/CookieBanner.jsx",
  "src/components/CookieBannerErrorBoundary.jsx",
  "src/components/DemoContent.jsx",
  "src/layouts/Dashboard.jsx"
]);
function isFrameworkExemptPath(relPath) {
  const p = toPosix(relPath);
  if (p === UI_PREFIX || p.startsWith(UI_PREFIX + "/")) return true;
  if (p.includes("/__tests__/") || TEST_MODULE.test(p)) return true;
  if (FRAMEWORK_FILES.has(p)) return true;
  const baseName = p.split("/").pop() ?? p;
  return p.startsWith(PAGES_ROOT + "/") && baseName.startsWith("_");
}
function isGatedPath(relPath) {
  const p = toPosix(relPath);
  if (!isScannableSourceFile(p)) return false;
  if (isFrameworkExemptPath(p)) return false;
  return GATED_ROOTS.some((root) => p === root || p.startsWith(root + "/"));
}
function isComponentPath(relPath) {
  const p = toPosix(relPath);
  if (isFrameworkExemptPath(p)) return false;
  return p === COMPONENTS_ROOT || p.startsWith(COMPONENTS_ROOT + "/");
}
const MAX_LISTED_SITES = 20;
function describeSite(site) {
  const where = `:${site.line}`.padEnd(6, " ");
  const kind = site.kind.padEnd(11, " ");
  if (site.kind === "local-map" || site.kind === "local-const") {
    const origin = site.declaredLine !== void 0 ? `declared :${site.declaredLine}` : "declared in more than one scope";
    return `  ${where} ${kind} ${site.text} (${origin}), not the content layer`;
  }
  return `  ${where} ${kind} ${JSON.stringify(site.text)}`;
}
function describeUnboundSites(relPath, sites) {
  const shown = sites.slice(0, MAX_LISTED_SITES);
  const remainder = sites.length - shown.length;
  const lines = [
    `${sites.length} user-visible string${sites.length === 1 ? "" : "s"} in ${relPath} ${sites.length === 1 ? "is" : "are"} not bound to content.`,
    "",
    ...shown.map(describeSite)
  ];
  if (remainder > 0) lines.push(`  +${remainder} more`);
  lines.push(
    "",
    "Bind each one:",
    "  1. content_scaffold the keys (one call can add several). It returns the import line to use.",
    "  2. import { home } from 'virtual:content';  then read each field directly: {home.hero.title}",
    "  3. For a list, keep the .map() and the {item.field} that renders each value on the page.",
    "",
    "This rule applies to every page you write, not only this file."
  );
  return lines.join("\n");
}
const SOURCE_EXTENSIONS = /\.[jt]sx?$/;
function isScannableSourceFile(fileName) {
  return SOURCE_EXTENSIONS.test(fileName) && !TEST_MODULE.test(fileName);
}
function gatedModulePath(id, projectRoot) {
  const cleanId = id.replace(/[?#].*$/, "");
  if (!SOURCE_EXTENSIONS.test(cleanId)) return void 0;
  if (!cleanId.startsWith(projectRoot + path.sep)) return void 0;
  const relPath = toPosix(path.relative(projectRoot, cleanId));
  return isGatedPath(relPath) ? relPath : void 0;
}
const UNBOUND_REFUSAL_STEM = "This app enforces content authority and refuses unbound literal text";
function assertContentAuthority(code, relPath) {
  if (!isGatedPath(relPath)) return;
  const result = classifyFileSource(code, relPath);
  if (result.parseError !== void 0) return;
  const enforced = enforcedSites(result.sites);
  if (enforced.length === 0) return;
  throw new Error(
    `[airo-content] ${describeUnboundSites(relPath, enforced)}

${UNBOUND_REFUSAL_STEM}, so the build cannot continue. Text resolved at runtime
(a translation call, for instance) is counted but not refused.`
  );
}
function containsStringLiteral(node) {
  const entries = node.type === "ArrayExpression" ? node.elements : node.properties;
  for (const entry of entries) {
    if (entry === null) continue;
    const candidate = isObjectProperty(entry) ? entry.value : entry;
    if (isStringLiteral(candidate)) return true;
    if (isTemplateLiteral(candidate) && candidate.expressions.length === 0) return true;
    if (isObjectExpression(candidate) || isArrayExpression(candidate)) {
      if (containsStringLiteral(candidate)) return true;
    }
  }
  return false;
}
function bindingKind(init) {
  if (isObjectExpression(init) || isArrayExpression(init)) {
    return containsStringLiteral(init) ? "local-map" : void 0;
  }
  if (isStringLiteral(init) || isTemplateLiteral(init) && init.expressions.length === 0) {
    return editableLiteralsIn(init).length > 0 ? "local-const" : void 0;
  }
  return void 0;
}
function collectLocalStringMaps(ast) {
  const maps = /* @__PURE__ */ new Map();
  const record = (decl) => {
    for (const d of decl.declarations) {
      if (d.id.type !== "Identifier" || d.init === null || d.init === void 0) continue;
      const kind = bindingKind(d.init);
      if (kind === void 0) continue;
      const existing = maps.get(d.id.name);
      if (existing === void 0) {
        maps.set(d.id.name, { kind, line: d.id.loc?.start.line ?? 0 });
        continue;
      }
      if (existing.line !== void 0) maps.set(d.id.name, { kind: existing.kind });
    }
  };
  traverse(ast, {
    VariableDeclaration: (path2) => {
      record(path2.node);
    }
  });
  return maps;
}
function rootIdentifier(node) {
  let current = node;
  for (; ; ) {
    if (current === void 0) return void 0;
    if (isIdentifier(current)) return current.name;
    if (isMemberExpression(current) || isOptionalMemberExpression(current)) {
      current = current.object;
      continue;
    }
    if (isCallExpression(current) || isOptionalCallExpression(current)) {
      current = current.callee;
      continue;
    }
    if (isTSNonNullExpression(current)) {
      current = current.expression;
      continue;
    }
    return void 0;
  }
}
function readRoots(expr) {
  const node = expr;
  if (node === null || node === void 0) return [];
  if (isTemplateLiteral(node)) {
    return node.expressions.flatMap((e) => readRoots(e));
  }
  const root = rootIdentifier(node);
  return root === void 0 ? [] : [root];
}
function elementName(node) {
  const name = node.openingElement.name;
  return name.type === "JSXIdentifier" ? name.name : void 0;
}
function literalAttribute(attr) {
  const value = attr.value;
  if (value === null || value === void 0) return void 0;
  if (value.type === "StringLiteral") return value.value;
  if (value.type === "JSXExpressionContainer") return literalExpressionText(value);
  return void 0;
}
function collectContentImportAliases(ast, imported) {
  const localNames = /* @__PURE__ */ new Set();
  for (const stmt of ast.program.body) {
    if (!isImportDeclaration(stmt) || stmt.source.value !== CONTENT_MODULE) continue;
    for (const specifier of stmt.specifiers) {
      if (specifier.type !== "ImportSpecifier") continue;
      const name = specifier.imported.type === "Identifier" ? specifier.imported.name : void 0;
      if (name === imported) localNames.add(specifier.local.name);
    }
  }
  return localNames;
}
const TRANSLATION_CALLEES = /* @__PURE__ */ new Set(["t", "i18n.t", "i18next.t"]);
function calleeName(node) {
  if (isIdentifier(node)) return node.name;
  if (!isMemberExpression(node) && !isOptionalMemberExpression(node)) return void 0;
  if (node.computed) return void 0;
  const object = node.object;
  const property = node.property;
  if (!isIdentifier(object) || !isIdentifier(property)) return void 0;
  return `${object.name}.${property.name}`;
}
function translationCall(expr) {
  if (expr === null || expr === void 0) return void 0;
  if (!isCallExpression(expr) && !isOptionalCallExpression(expr)) return void 0;
  const callee = calleeName(expr.callee);
  if (callee === void 0 || !TRANSLATION_CALLEES.has(callee)) return void 0;
  const key = literalStringValue(expr.arguments[0]);
  return { callee, key };
}
function literalStringValue(expr) {
  if (expr === null || expr === void 0) return void 0;
  if (isStringLiteral(expr)) return expr.value;
  if (isTemplateLiteral(expr) && expr.expressions.length === 0) {
    return expr.quasis.map((quasi) => quasi.value.raw).join("");
  }
  return void 0;
}
function literalExpressionText(node) {
  return literalStringValue(node.expression);
}
function literalStringsIn(expr) {
  if (expr === null || expr === void 0) return [];
  if (isStringLiteral(expr)) return [expr.value];
  if (isTemplateLiteral(expr)) {
    const parts = [];
    for (let i = 0; i < expr.quasis.length; i++) {
      parts.push(expr.quasis[i].value.raw);
      const interpolated = expr.expressions[i];
      if (interpolated !== void 0) parts.push(...literalStringsIn(interpolated));
    }
    return parts;
  }
  if (isConditionalExpression(expr)) {
    return [...literalStringsIn(expr.consequent), ...literalStringsIn(expr.alternate)];
  }
  if (isLogicalExpression(expr) || isBinaryExpression(expr) && expr.operator === "+") {
    return [...literalStringsIn(expr.left), ...literalStringsIn(expr.right)];
  }
  if (isTSNonNullExpression(expr)) return literalStringsIn(expr.expression);
  return [];
}
function editableLiteralsIn(expr) {
  return literalStringsIn(expr).filter(
    (text) => text.trim().length > 0 && !isDecorativeText(text)
  );
}
const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;
function isDecorativeText(text) {
  return !LETTER_OR_DIGIT.test(text);
}
function attributeSiteKind(attrName, ownerName) {
  if (TEXT_ATTRIBUTES.has(attrName)) return attrName;
  if (attrName === "value" && ownerName !== void 0 && VALUE_ELEMENTS.has(ownerName)) return "input-value";
  return void 0;
}
function hasUnbindableParent(p) {
  const parent = p.parentPath;
  if (parent === null || parent.node.type !== "JSXElement") return false;
  const name = elementName(parent.node);
  return name !== void 0 && UNBINDABLE_PARENTS.has(name);
}
function classifyFileSource(source, relPath) {
  let ast;
  try {
    ast = parse(source, { sourceType: "module", plugins: ["jsx"] });
  } catch (err) {
    return report(0, [], 1, { parseError: String(err) });
  }
  const boundLocalNames = collectContentImportAliases(ast, BOUND_IMPORT_NAME);
  const localStringMaps = collectLocalStringMaps(ast);
  let bound = 0;
  const sites = [];
  const i18nSites = [];
  const checkTranslation = (expr, line) => {
    const call = translationCall(expr);
    if (call === void 0) return false;
    i18nSites.push({ file: relPath, line, callee: call.callee, key: call.key });
    return true;
  };
  const checkLocalMap = (expr, line, source2, positionKind) => {
    for (const root of readRoots(expr)) {
      const binding = localStringMaps.get(root);
      if (binding !== void 0) {
        sites.push({
          file: relPath,
          line,
          kind: isAttributeKind(positionKind) ? positionKind : binding.kind,
          text: `${source2} reads ${root}`,
          ...binding.line !== void 0 ? { declaredLine: binding.line } : {}
        });
        return;
      }
    }
  };
  const recordExpressionFallback = (expr, line, kind, mapSource) => {
    if (checkTranslation(expr, line)) return;
    const reached = editableLiteralsIn(expr);
    if (reached.length > 0) {
      for (const literal of reached) sites.push({ file: relPath, line, kind, text: literal });
      return;
    }
    checkLocalMap(expr, line, mapSource, kind);
  };
  traverse(ast, {
    JSXElement(p) {
      const name = elementName(p.node);
      if (name !== void 0 && boundLocalNames.has(name)) bound += 1;
    },
    JSXText(p) {
      const trimmed = p.node.value.trim();
      if (trimmed.length === 0) return;
      if (isDecorativeText(trimmed)) return;
      if (hasUnbindableParent(p)) return;
      sites.push({ file: relPath, line: p.node.loc?.start.line ?? 0, kind: "jsx-text", text: trimmed });
    },
    JSXExpressionContainer(p) {
      if (p.parentPath.node.type === "JSXAttribute") return;
      if (hasUnbindableParent(p)) return;
      const line = p.node.loc?.start.line ?? 0;
      const text = literalExpressionText(p.node);
      if (text === void 0) {
        recordExpressionFallback(p.node.expression, line, "jsx-expression-literal", "jsx text");
        return;
      }
      if (text.trim().length === 0) return;
      if (isDecorativeText(text)) return;
      sites.push({ file: relPath, line, kind: "jsx-expression-literal", text });
    },
    JSXAttribute(p) {
      const attrName = p.node.name;
      if (attrName.type !== "JSXIdentifier") return;
      const owner = p.parentPath.parentPath;
      const ownerName = owner !== null && owner.node.type === "JSXElement" ? elementName(owner.node) : void 0;
      const kind = attributeSiteKind(attrName.name, ownerName);
      const text = literalAttribute(p.node);
      if (text === void 0) {
        if (kind !== void 0 && p.node.value?.type === "JSXExpressionContainer") {
          const line = p.node.loc?.start.line ?? 0;
          recordExpressionFallback(p.node.value.expression, line, kind, attrName.name);
        }
        return;
      }
      if (text.trim().length === 0) return;
      if (isDecorativeText(text)) return;
      if (kind === void 0) return;
      sites.push({ file: relPath, line: p.node.loc?.start.line ?? 0, kind, text });
    }
  });
  return report(bound, sites, 1, { i18nSites });
}
async function walkSourceFiles(dir, visit, scanErrors) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code !== "ENOENT") {
      scanErrors.push(`${dir}: ${String(err)}`);
    }
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") continue;
      await walkSourceFiles(full, visit, scanErrors);
      continue;
    }
    if (isScannableSourceFile(entry.name)) await visit(full);
  }
}
function isUnderPrefix(rel, prefix) {
  const normalized = toPosix(prefix).replace(/\/+$/, "");
  return rel === normalized || rel.startsWith(normalized + "/");
}
async function measurePrimitiveCompliance(appDir, options = {}) {
  const scanRoots = options.scanRoots ?? DEFAULT_SCAN_ROOTS;
  const excludePaths = options.excludePaths ?? [];
  let bound = 0;
  let filesScanned = 0;
  const sites = [];
  const i18nSites = [];
  const scanErrors = [];
  for (const root of scanRoots) {
    await walkSourceFiles(path.join(appDir, root), async (file) => {
      const rel = toPosix(path.relative(appDir, file));
      if (isFrameworkExemptPath(rel)) return;
      if (excludePaths.some((prefix) => isUnderPrefix(rel, prefix))) return;
      const source = await fs.readFile(file, "utf-8");
      const fileReport = classifyFileSource(source, rel);
      if (fileReport.parseError !== void 0) scanErrors.push(`${rel}: ${fileReport.parseError}`);
      bound += fileReport.bound;
      filesScanned += fileReport.filesScanned;
      sites.push(...fileReport.sites);
      i18nSites.push(...fileReport.i18nSites);
    }, scanErrors);
  }
  return { ...report(bound, sites, filesScanned, { i18nSites }), scanErrors };
}
export {
  UNBOUND_REFUSAL_STEM,
  assertContentAuthority,
  classifyFileSource,
  collectContentImportAliases,
  describeUnboundSites,
  elementName,
  enforcedSites,
  gatedModulePath,
  isComponentPath,
  isFrameworkExemptPath,
  isGatedPath,
  literalAttribute,
  measurePrimitiveCompliance
};
