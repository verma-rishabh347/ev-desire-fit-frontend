import { parseFrontmatter } from "./frontmatter.js";
const CONTENT_SUBDIRS = ["pages", "data"];
const RESERVED_ROOTS = /* @__PURE__ */ new Set(["site", "pages", "data"]);
function isContentSubdir(value) {
  return CONTENT_SUBDIRS.includes(value);
}
const JS_RESERVED_WORDS = /* @__PURE__ */ new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "null",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "enum",
  "await"
]);
const IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
function canonicalKeyFor(subdir, bareName) {
  if (subdir === null) return bareName;
  return `${subdir}.${bareName}`;
}
function parseCanonicalKey(key) {
  if (key.length === 0) {
    return { error: "invalid-key", message: "content key must not be empty" };
  }
  const segments = key.split(".");
  const [first, second, ...rest] = segments;
  if (first === "site") {
    return { root: "site", bareName: "site", path: segments.slice(1) };
  }
  if (isContentSubdir(first) && second !== void 0) {
    return { root: first, bareName: second, path: rest };
  }
  if (!IDENTIFIER.test(first)) {
    return { error: "invalid-key", message: `content key "${key}" has an invalid root segment` };
  }
  return { root: null, bareName: first, path: segments.slice(1) };
}
const COLLECTION_ITEM = /\.(json|md)$/;
function isCollectionItem(filename) {
  if (filename.startsWith(".") || filename === "README.md") return false;
  return COLLECTION_ITEM.test(filename);
}
function classifyDirents(subdir, dirents) {
  const entries = [];
  for (const dirent of dirents) {
    if (dirent.name.endsWith(".json")) {
      const bareName = dirent.name.slice(0, -".json".length);
      entries.push({
        canonicalKey: canonicalKeyFor(subdir, bareName),
        bareName,
        subdir,
        kind: "file",
        relPath: `${subdir}/${dirent.name}`
      });
    } else if (dirent.isDirectory && subdir === "data") {
      entries.push({
        canonicalKey: canonicalKeyFor(subdir, dirent.name),
        bareName: dirent.name,
        subdir,
        kind: "collection",
        relPath: `${subdir}/${dirent.name}`
      });
    }
  }
  return entries;
}
function normalizeCollectionItem(filename, raw) {
  const slug = filename.replace(/\.(md|json)$/, "");
  if (filename.endsWith(".md")) {
    const { data, content } = parseFrontmatter(raw);
    return { slug, ...data, content };
  }
  return { slug, ...JSON.parse(raw) };
}
function itemIdentity(item) {
  const id = item.id;
  if (typeof id === "string") return id;
  const slug = item.slug;
  if (typeof slug === "string") return slug;
  return void 0;
}
function candidatePathsFor(key) {
  const parsed = parseCanonicalKey(key);
  if ("error" in parsed) return parsed;
  if (parsed.root === "site") {
    return { relPaths: ["site.json"] };
  }
  if (parsed.root === null) {
    return {
      error: `bare content key "${key}" names a file only through the alias set \u2014 resolve it by discovery`
    };
  }
  const filePath = `${parsed.root}/${parsed.bareName}.json`;
  if (parsed.root === "data") {
    return { relPaths: [filePath, `data/${parsed.bareName}`] };
  }
  return { relPaths: [filePath] };
}
function exportableAliasNames(entries) {
  const result = /* @__PURE__ */ new Set();
  for (const name of aliasableNames(entries)) {
    if (!isJsReservedWord(name)) result.add(name);
  }
  return result;
}
function aliasableNames(entries) {
  const counts = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    counts.set(entry.bareName, (counts.get(entry.bareName) ?? 0) + 1);
  }
  const result = /* @__PURE__ */ new Set();
  for (const [name, count] of counts) {
    if (count === 1 && !RESERVED_ROOTS.has(name)) result.add(name);
  }
  return result;
}
function findFatalDuplicates(entries) {
  const byCanonicalKey = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const group = byCanonicalKey.get(entry.canonicalKey) ?? [];
    group.push(entry);
    byCanonicalKey.set(entry.canonicalKey, group);
  }
  const pairs = [];
  for (const group of byCanonicalKey.values()) {
    for (let i = 1; i < group.length; i += 1) {
      pairs.push([group[0], group[i]]);
    }
  }
  return pairs;
}
function assertSafeContentName(name, filename) {
  if (!IDENTIFIER.test(name)) {
    throw new Error(`[airo-content] invalid content key "${name}" from "${filename}" \u2014 must be a valid JS identifier`);
  }
  if (RESERVED_ROOTS.has(name)) {
    throw new Error(
      `[airo-content] reserved content key "${name}" from "${filename}" \u2014 "${name}" is reserved for the ${name} namespace export and cannot be used as a content file name. Rename the file to avoid shadowing the generated virtual module.`
    );
  }
}
function isJsReservedWord(name) {
  return JS_RESERVED_WORDS.has(name);
}
const ID_CHARSET = /^[A-Za-z0-9_-]+$/;
const RESERVED_SEGMENTS = ["__proto__", "constructor", "prototype"];
function isIdRef(seg) {
  return typeof seg === "object" && seg !== null && typeof seg.id === "string";
}
function isContentPathError(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "error" in value;
}
function parseContentPath(key) {
  if (typeof key !== "string" || key.length === 0) {
    return { error: "content key must be a non-empty string" };
  }
  if (key.endsWith(".")) {
    return { error: `trailing '.' in "${key}"` };
  }
  const segments = [];
  let i = 0;
  let current = "";
  while (i < key.length) {
    const ch = key[i];
    if (ch === ".") {
      if (current === "") {
        return { error: `empty segment near position ${i} in "${key}"` };
      }
      segments.push(current);
      current = "";
      i++;
    } else if (ch === "[") {
      if (current !== "") {
        segments.push(current);
        current = "";
      }
      const end = key.indexOf("]", i);
      if (end === -1) {
        return { error: `unclosed '[' in "${key}"` };
      }
      const inside = key.slice(i + 1, end);
      if (inside.startsWith("@")) {
        const id = inside.slice(1);
        if (!ID_CHARSET.test(id)) {
          return { error: `invalid id "[${inside}]" in "${key}"` };
        }
        segments.push({ id });
      } else if (/^\d+$/.test(inside)) {
        const index = Number(inside);
        if (!Number.isSafeInteger(index)) {
          return { error: `index "[${inside}]" in "${key}" exceeds the safe integer range` };
        }
        segments.push(index);
      } else {
        return { error: `invalid index "[${inside}]" in "${key}"` };
      }
      i = end + 1;
      if (key[i] === ".") i++;
    } else if (/[a-zA-Z0-9_]/.test(ch)) {
      current += ch;
      i++;
    } else {
      return { error: `invalid character "${ch}" at position ${i} in "${key}"` };
    }
  }
  if (current !== "") segments.push(current);
  for (const seg of segments) {
    if (typeof seg === "string" && RESERVED_SEGMENTS.includes(seg)) {
      return { error: `reserved segment "${seg}" in "${key}"` };
    }
  }
  const first = segments[0];
  if (segments.length === 0 || typeof first !== "string") {
    return { error: `content key must start with a named root: "${key}"` };
  }
  return segments;
}
const NAMED_SEGMENT = /^[a-zA-Z0-9_]+$/;
function isExpressibleIdSegment(id) {
  return typeof id === "string" && ID_CHARSET.test(id);
}
function formatContentPath(segments) {
  const first = segments[0];
  if (segments.length === 0 || typeof first !== "string") {
    return { error: "content key must start with a named root" };
  }
  let out = "";
  for (const segment of segments) {
    if (isIdRef(segment)) {
      if (!isExpressibleIdSegment(segment.id)) {
        return { error: `id "${segment.id}" is not expressible in a content key` };
      }
      out += `[@${segment.id}]`;
      continue;
    }
    if (typeof segment === "number") {
      if (!Number.isSafeInteger(segment) || segment < 0) {
        return { error: `index ${segment} is not a non-negative safe integer` };
      }
      out += `[${segment}]`;
      continue;
    }
    if (!NAMED_SEGMENT.test(segment)) {
      return { error: `segment "${segment}" is not expressible in a content key` };
    }
    if (RESERVED_SEGMENTS.includes(segment)) {
      return { error: `reserved segment "${segment}"` };
    }
    out += out === "" ? segment : `.${segment}`;
  }
  return out;
}
function assertSafeExportName(name, filename) {
  assertSafeContentName(name, filename);
  if (JS_RESERVED_WORDS.has(name)) {
    throw new Error(
      `[airo-content] reserved content key "${name}" from "${filename}" \u2014 "${name}" is a JS reserved word and cannot be used as an export name. Rename the file to avoid a syntax error in the emitted virtual module.`
    );
  }
}
export {
  CONTENT_SUBDIRS,
  RESERVED_ROOTS,
  aliasableNames,
  assertSafeContentName,
  assertSafeExportName,
  candidatePathsFor,
  canonicalKeyFor,
  classifyDirents,
  exportableAliasNames,
  findFatalDuplicates,
  formatContentPath,
  isCollectionItem,
  isContentPathError,
  isContentSubdir,
  isExpressibleIdSegment,
  isIdRef,
  isJsReservedWord,
  itemIdentity,
  normalizeCollectionItem,
  parseCanonicalKey,
  parseContentPath
};
