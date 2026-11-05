import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { parseJson } from "./parse.js";
import {
  CONTENT_SUBDIRS,
  canonicalKeyFor,
  classifyDirents,
  isCollectionItem,
  findFatalDuplicates,
  assertSafeContentName,
  aliasableNames,
  exportableAliasNames,
  normalizeCollectionItem
} from "./keys.js";
const VIRTUAL_ID = "virtual:content";
const RESOLVED_VIRTUAL_ID = "\0" + VIRTUAL_ID;
const RUNTIME_VIRTUAL_ID = "virtual:content-runtime";
const RESOLVED_RUNTIME_VIRTUAL_ID = "\0" + RUNTIME_VIRTUAL_ID;
const AIRO_CONTENT_ID = "@airo/content";
function directImportError(rel) {
  return new Error(
    `[airo-content] Direct import of ${rel} is forbidden. Content files under src/content/ must be consumed through the virtual module:

  import { <key> } from 'virtual:content';

See src/content/virtual-content.d.js for available keys.`
  );
}
function contentPlugin(options = {}) {
  const relContentDir = options.contentDir ?? "src/content";
  let projectRoot;
  let contentDir;
  let schemasImportPath;
  return {
    name: "airo-content",
    // `enforce: 'pre'` gives us resolveId priority over Vite's built-in JSON
    // plugin, so we can block direct .json imports under src/content/ before
    // Vite serves the file.
    enforce: "pre",
    configResolved(config) {
      projectRoot = config.root;
      contentDir = path.resolve(config.root, relContentDir);
      schemasImportPath = "/" + path.posix.join(relContentDir, "schemas");
    },
    configureServer(s) {
      const reloadIfPresent = (resolvedId, label) => {
        const mod = s.moduleGraph.getModuleById(resolvedId);
        if (!mod) {
          s.config.logger.info(`[airo-content] ${label} not yet in module graph \u2014 skipping reload`);
          return;
        }
        void s.reloadModule(mod).then(() => {
          s.config.logger.info(`[airo-content] reloaded ${label} (HMR propagating)`);
        }).catch((err) => {
          s.config.logger.error(
            `[airo-content] HMR reload failed for ${label}: ${String(err)}`,
            { error: err }
          );
          try {
            s.ws.send({ type: "full-reload", path: "*" });
          } catch {
          }
        });
      };
      const invalidate = (file, event) => {
        if (!file.startsWith(contentDir)) return;
        s.config.logger.info(`[airo-content] ${event}: ${path.relative(projectRoot, file)}`);
        reloadIfPresent(RESOLVED_VIRTUAL_ID, "virtual:content");
        reloadIfPresent(RESOLVED_RUNTIME_VIRTUAL_ID, "virtual:content-runtime");
      };
      s.watcher.on("change", (f) => invalidate(f, "change"));
      s.watcher.on("add", (f) => invalidate(f, "add"));
      s.watcher.on("unlink", (f) => invalidate(f, "unlink"));
      if (!existsSync(contentDir)) {
        s.config.logger.info(`[airo-content] no ${relContentDir}/ yet \u2014 watcher armed, awaiting content`);
        return;
      }
      s.watcher.add(contentDir);
      void validateContentEager(s, contentDir, schemasImportPath).catch((err) => {
        s.config.logger.error(String(err), { error: err });
      });
    },
    resolveId(source, importer) {
      if (source === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
      if (source === RUNTIME_VIRTUAL_ID) return RESOLVED_RUNTIME_VIRTUAL_ID;
      if (source === AIRO_CONTENT_ID) {
        return path.resolve(projectRoot, "content-lib/src/index.js");
      }
      if (importer === RESOLVED_VIRTUAL_ID) return void 0;
      const cleanSource = source.replace(/[?#].*$/, "");
      const resolved = resolveAbsolute(cleanSource, importer, projectRoot);
      if (!resolved) return void 0;
      if ((resolved === contentDir || resolved.startsWith(contentDir + path.sep)) && !isContentMetaModule(resolved, contentDir)) {
        throw directImportError(path.relative(path.dirname(contentDir), resolved));
      }
      return void 0;
    },
    async load(id) {
      if (id === RESOLVED_RUNTIME_VIRTUAL_ID) {
        const entries = await discover(contentDir);
        return emitRuntimeModule(entries);
      }
      if (id === RESOLVED_VIRTUAL_ID) {
        const entries = await discover(contentDir);
        const schemasPath = path.join(contentDir, "schemas.js");
        return emitVirtualModule(entries, schemasImportPath, schemasPath);
      }
      const cleanId = id.replace(/[?#].*$/, "");
      if ((cleanId === contentDir || cleanId.startsWith(contentDir + path.sep)) && !isContentMetaModule(cleanId, contentDir)) {
        throw directImportError(path.relative(path.dirname(contentDir), cleanId));
      }
      return void 0;
    }
  };
}
var stdin_default = contentPlugin;
async function discover(contentDir) {
  const entries = [];
  if (await exists(contentDir)) {
    for (const entry of await fs.readdir(contentDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "site.json") continue;
      throw new Error(
        `[airo-content] Unexpected file src/content/${entry.name}.
Page content belongs at src/content/pages/${entry.name}.
Data collections belong at src/content/data/${entry.name}.
The only JSON allowed directly at src/content/ is site.json.`
      );
    }
  }
  const siteAbsPath = path.join(contentDir, "site.json");
  if (await exists(siteAbsPath)) {
    entries.push({
      canonicalKey: canonicalKeyFor(null, "site"),
      bareName: "site",
      subdir: null,
      kind: "file",
      relPath: "site.json",
      absPath: siteAbsPath
    });
  }
  for (const subdir of CONTENT_SUBDIRS) {
    const dir = path.join(contentDir, subdir);
    if (!await exists(dir)) continue;
    const dirents = (await fs.readdir(dir, { withFileTypes: true })).map(
      (d) => ({ name: d.name, isDirectory: d.isDirectory() })
    );
    for (const keyed of classifyDirents(subdir, dirents)) {
      assertSafeContentName(keyed.bareName, keyed.relPath);
      if (keyed.kind === "file") {
        entries.push({ ...keyed, kind: "file", absPath: path.join(contentDir, keyed.relPath) });
        continue;
      }
      const collectionDir = path.join(contentDir, keyed.relPath);
      const itemPaths = (await fs.readdir(collectionDir)).filter(isCollectionItem).sort().map((f) => path.join(collectionDir, f));
      entries.push({ ...keyed, kind: "collection", dirPath: collectionDir, itemPaths });
    }
  }
  const duplicates = findFatalDuplicates(entries);
  if (duplicates.length > 0) {
    const [first, second] = duplicates[0];
    throw duplicateKeyError(contentDir, first, second);
  }
  return entries;
}
function displayPath(contentDir, entry) {
  const abs = entry.kind === "file" ? entry.absPath : entry.dirPath;
  const rel = path.relative(contentDir, abs).split(path.sep).join("/");
  return entry.kind === "file" ? `src/content/${rel}` : `src/content/${rel}/ (collection)`;
}
function duplicateKeyError(contentDir, first, second) {
  return new Error(
    `[airo-content] duplicate content key "${second.canonicalKey}" \u2014 both of these export "${second.canonicalKey}":
  ${displayPath(contentDir, first)}
  ${displayPath(contentDir, second)}
Delete or rename one of them so the keys differ.
Keys must be camelCase JS identifiers; hyphens are rejected.`
  );
}
function normalizeItem(absPath, raw) {
  return normalizeCollectionItem(path.basename(absPath), raw);
}
async function readEntryValue(entry) {
  if (entry.kind === "file") {
    const raw = await fs.readFile(entry.absPath, "utf8");
    return parseJson(raw);
  }
  return Promise.all(
    entry.itemPaths.map(async (p) => {
      const raw = await fs.readFile(p, "utf8");
      return normalizeItem(p, raw);
    })
  );
}
function entryLocation(entry) {
  return entry.kind === "file" ? entry.absPath : `collection ${entry.canonicalKey}`;
}
async function readLiteral(entry) {
  let value;
  try {
    value = await readEntryValue(entry);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[airo-content] failed to parse ${entryLocation(entry)}: ${msg}`);
  }
  return JSON.stringify(value, null, 2);
}
function uniqueBareNameSet(entries) {
  const counts = /* @__PURE__ */ new Map();
  for (const e of entries) counts.set(e.bareName, (counts.get(e.bareName) ?? 0) + 1);
  const out = /* @__PURE__ */ new Set();
  for (const [name, n] of counts) if (n === 1) out.add(name);
  return out;
}
async function emitVirtualModule(entries, schemasImportPath, schemasPath) {
  const hasSchemas = await exists(schemasPath);
  const lines = [];
  if (hasSchemas) {
    lines.push(`import { schemas } from '${schemasImportPath}';`);
    lines.push(
      `const $LEAF = new Set(["ZodString", "ZodNumber", "ZodBoolean", "ZodLiteral", "ZodEnum", "ZodNativeEnum", "ZodDate", "ZodNull", "ZodUndefined", "ZodAny", "ZodUnknown", "ZodNever"]);`,
      `const $WRAP = new Set(["ZodOptional", "ZodNullable", "ZodDefault", "ZodReadonly"]);`,
      `const $mayFallBack = (s, seen = new Set()) => {`,
      `  if (!s || typeof s !== "object" || seen.has(s)) return !!s;`,
      `  seen.add(s);`,
      `  const d = s._def ?? {};`,
      `  const t = d.typeName;`,
      `  if ($LEAF.has(t)) return true;`,
      `  if ($WRAP.has(t)) return $mayFallBack(d.innerType, seen);`,
      `  if (t === "ZodArray" || t === "ZodSet") return $mayFallBack(d.type ?? d.valueType, seen);`,
      `  if (t === "ZodObject") { const shape = typeof d.shape === "function" ? d.shape() : d.shape; return Object.values(shape ?? {}).every((c) => $mayFallBack(c, seen)) && (!d.catchall || d.catchall._def?.typeName === "ZodNever" || $mayFallBack(d.catchall, seen)); }`,
      `  if (t === "ZodTuple") return (d.items ?? []).every((c) => $mayFallBack(c, seen)) && (!d.rest || $mayFallBack(d.rest, seen));`,
      `  if (t === "ZodRecord" || t === "ZodMap") return $mayFallBack(d.keyType, seen) && $mayFallBack(d.valueType, seen);`,
      `  if (t === "ZodUnion" || t === "ZodDiscriminatedUnion") { const opts = Array.isArray(d.options) ? d.options : d.options instanceof Map ? [...d.options.values()] : []; return opts.every((c) => $mayFallBack(c, seen)); }`,
      `  if (t === "ZodIntersection") return $mayFallBack(d.left, seen) && $mayFallBack(d.right, seen);`,
      `  return false;`,
      `};`,
      `const $parseContent = (schema, value, namespace) => {`,
      `  if (!schema) return value;`,
      `  try { return schema.parse(value); } catch (err) {`,
      `    const issues = Array.isArray(err?.issues) ? err.issues : [];`,
      `    const onlyMissing = issues.length > 0 && issues.every((i) => i.code === "invalid_type" && i.received === "undefined");`,
      `    if (!onlyMissing || !$mayFallBack(schema)) throw err;`,
      `    console.error("content.schema.mismatch", { namespace, missingFields: issues.length });`,
      `    return value;`,
      `  }`,
      `};`
    );
  }
  lines.push("");
  const aliasable = exportableAliasNames(entries);
  const uniqueBareNames = uniqueBareNameSet(entries);
  const aliasLines = [];
  const siteEntry = entries.find(
    (e) => e.subdir === null
  );
  if (siteEntry) {
    const literal = await readLiteral(siteEntry);
    lines.push(
      hasSchemas ? `export const site = $parseContent(schemas.site, ${literal}, "site");` : `export const site = ${literal};`
    );
  }
  for (const subdir of CONTENT_SUBDIRS) {
    const namespaceEntries = entries.filter(
      (e) => e.subdir === subdir
    );
    if (namespaceEntries.length === 0) continue;
    const props = [];
    for (const entry of namespaceEntries) {
      const literal = await readLiteral(entry);
      const flatFallback = uniqueBareNames.has(entry.bareName) ? ` ?? schemas.${entry.bareName}` : "";
      const expr = hasSchemas ? `$parseContent(schemas.${subdir}?.${entry.bareName}${flatFallback}, ${literal}, ${JSON.stringify(subdir)})` : literal;
      props.push(`  ${JSON.stringify(entry.bareName)}: ${expr},`);
      if (aliasable.has(entry.bareName)) {
        aliasLines.push(
          `const $alias_${entry.bareName} = ${subdir}.${entry.bareName};`,
          `export { $alias_${entry.bareName} as ${entry.bareName} };`
        );
      }
    }
    lines.push(`export const ${subdir} = {`, ...props, "};");
  }
  lines.push(...aliasLines);
  lines.push("");
  lines.push("if (import.meta.hot) {");
  lines.push("  import.meta.hot.accept(() => {");
  lines.push("    import.meta.hot.invalidate();");
  lines.push("  });");
  lines.push("}");
  return lines.join("\n") + "\n";
}
function collectDirectoryBackedKeys(entries) {
  const resolvableAliasNames = aliasableNames(entries);
  const keys = [];
  for (const entry of entries) {
    if (entry.kind !== "collection") continue;
    keys.push(entry.canonicalKey);
    if (resolvableAliasNames.has(entry.bareName)) keys.push(entry.bareName);
  }
  return keys;
}
function emitRuntimeModule(entries) {
  const roots = [];
  if (entries.some((e) => e.subdir === null)) roots.push("site");
  for (const subdir of CONTENT_SUBDIRS) {
    if (entries.some((e) => e.subdir === subdir)) roots.push(subdir);
  }
  const aliasNames = exportableAliasNames(entries);
  const names = [...roots, ...aliasNames];
  const props = names.map((name) => `${JSON.stringify(name)}: content[${JSON.stringify(name)}]`).join(", ");
  const collectionRoots = collectDirectoryBackedKeys(entries);
  const collectionRootsLiteral = JSON.stringify(collectionRoots);
  return `import * as content from ${JSON.stringify(VIRTUAL_ID)};
export default { ${props} };
export const collectionRoots = ${collectionRootsLiteral};

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot.invalidate();
  });
}
`;
}
async function validateContentEager(server, contentDir, schemasImportPath) {
  const schemasPath = path.join(contentDir, "schemas.js");
  if (!await exists(schemasPath)) {
    return;
  }
  let mod;
  try {
    mod = await server.ssrLoadModule(schemasImportPath);
  } catch (err) {
    throw new Error(
      `[airo-content] failed to evaluate ${schemasPath}: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  const schemas = mod.schemas;
  if (!schemas || typeof schemas !== "object") {
    return;
  }
  const entries = await discover(contentDir);
  const uniqueBareNames = uniqueBareNameSet(entries);
  const strippedFindings = [];
  for (const entry of entries) {
    const where = entryLocation(entry);
    let value;
    try {
      value = await readEntryValue(entry);
    } catch (err) {
      throw new Error(
        `[airo-content] failed to parse ${where}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
    const namespaceSchemas = entry.subdir ? schemas[entry.subdir] : void 0;
    const schema = namespaceSchemas?.[entry.bareName] ?? (uniqueBareNames.has(entry.bareName) ? schemas[entry.bareName] : void 0);
    if (!schema) continue;
    if (typeof schema.parse !== "function") continue;
    let parsed;
    try {
      parsed = schema.parse(value);
    } catch (err) {
      throw new Error(
        `[airo-content] content in ${where} does not match schemas.${entry.bareName}:
` + (err instanceof Error ? err.message : String(err))
      );
    }
    const strippedPaths = collectStrippedPaths(value, parsed, "");
    if (strippedPaths.length > 0) {
      strippedFindings.push({ where, paths: strippedPaths });
    }
  }
  if (strippedFindings.length > 0) {
    throw strippedFieldsError(strippedFindings);
  }
}
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function collectStrippedPaths(raw, parsed, pathPrefix) {
  if (Array.isArray(raw) && Array.isArray(parsed)) {
    const paths = [];
    for (let i = 0; i < raw.length; i += 1) {
      paths.push(...collectStrippedPaths(raw[i], parsed[i], `${pathPrefix}[${i}]`));
    }
    return paths;
  }
  if (isPlainObject(raw) && isPlainObject(parsed)) {
    const paths = [];
    for (const key of Object.keys(raw)) {
      const childPath = pathPrefix === "" ? key : `${pathPrefix}.${key}`;
      if (!Object.prototype.hasOwnProperty.call(parsed, key)) {
        paths.push(childPath);
        continue;
      }
      paths.push(...collectStrippedPaths(raw[key], parsed[key], childPath));
    }
    return paths;
  }
  return [];
}
function strippedFieldsError(findings) {
  const lines = findings.map(
    (f) => `  ${f.where}: ${f.paths.join(", ")}`
  );
  return new Error(
    `[airo-content] field(s) exist in the content file but are dropped before reaching virtual:content:
${lines.join("\n")}
Zod's z.object() strips any key it doesn't declare. These fields are present in the JSON above but missing from src/content/schemas.js, so they never reach virtual:content. Regenerate schemas.js (content_scaffold) or add the field(s) to it by hand.`
  );
}
function resolveAbsolute(source, importer, projectRoot) {
  const clean = source.replace(/[?#].*$/, "");
  if (clean.startsWith("/")) {
    const osAbs = clean;
    const rootRel = path.resolve(projectRoot, clean.slice(1));
    return osAbs.startsWith(projectRoot + path.sep) ? osAbs : rootRel;
  }
  if (clean.startsWith("./") || clean.startsWith("../")) {
    if (!importer) return void 0;
    return path.resolve(path.dirname(importer), clean);
  }
  return void 0;
}
function isContentMetaModule(resolvedPath, contentDir) {
  const rel = path.relative(contentDir, resolvedPath);
  return rel === "schemas" || rel === "schemas.js" || rel.endsWith(".d.js");
}
async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    return false;
  }
}
export {
  contentPlugin,
  stdin_default as default,
  validateContentEager
};
