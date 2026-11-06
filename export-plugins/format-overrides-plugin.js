import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
const SIDECAR_DIRNAME = "format-overrides";
const FORMAT_OVERRIDES_MODULE_ID = "virtual:format-overrides";
const RESOLVED_FORMAT_OVERRIDES_MODULE_ID = `\0${FORMAT_OVERRIDES_MODULE_ID}`;
const EMPTY_SIDECAR = { version: 1, overrides: {} };
const EMPTY_BUNDLE = { version: 1, scopes: {} };
function readSidecarFile(filePath, scope) {
  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf-8"));
    if (!parsed || parsed.version !== 1 || !parsed.overrides || typeof parsed.overrides !== "object" || Array.isArray(parsed.overrides)) {
      console.warn(JSON.stringify({ event: "format-overrides.sidecar.invalid", scope }));
      return EMPTY_SIDECAR;
    }
    return parsed;
  } catch (error) {
    console.warn(JSON.stringify({
      event: "format-overrides.sidecar.invalid",
      scope,
      reason: error instanceof Error ? error.message : String(error),
    }));
    return EMPTY_SIDECAR;
  }
}
function collectSidecarFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) return collectSidecarFiles(fullPath);
    return entry.endsWith(".json") ? [fullPath] : [];
  });
}
function scopeFromFile(sidecarRoot, filePath) {
  const relative = path.relative(sidecarRoot, filePath).replace(/\\/g, "/");
  return relative.replace(/\.json$/, "");
}
function readSidecarBundle(root) {
  const sidecarRoot = path.join(root, SIDECAR_DIRNAME);
  if (!existsSync(sidecarRoot)) return EMPTY_BUNDLE;
  const scopes = Object.fromEntries(
    collectSidecarFiles(sidecarRoot).sort().map((filePath) => {
      const scope = scopeFromFile(sidecarRoot, filePath);
      return [scope, readSidecarFile(filePath, scope)];
    })
  );
  return { version: 1, scopes };
}
function buildModule(root) {
  return `export default ${JSON.stringify(readSidecarBundle(root))};`;
}
function formatOverridesPlugin(root = process.cwd()) {
  return {
    name: "format-overrides",
    resolveId(id) {
      return id === FORMAT_OVERRIDES_MODULE_ID ? RESOLVED_FORMAT_OVERRIDES_MODULE_ID : null;
    },
    load(id) {
      return id === RESOLVED_FORMAT_OVERRIDES_MODULE_ID ? buildModule(root) : null;
    },
    configureServer(server) {
      const sidecarRoot = path.join(root, SIDECAR_DIRNAME);
      const moduleId = RESOLVED_FORMAT_OVERRIDES_MODULE_ID;
      const update = (filePath) => {
        if (!filePath.startsWith(sidecarRoot) || !filePath.endsWith(".json")) return;
        const moduleNode = server.moduleGraph.getModuleById(moduleId);
        if (moduleNode) server.moduleGraph.invalidateModule(moduleNode);
        server.ws.send("format-overrides:update", readSidecarBundle(root));
      };
      server.watcher.on("change", update);
      server.watcher.on("add", update);
      server.watcher.on("unlink", update);
    }
  };
}
export {
  FORMAT_OVERRIDES_MODULE_ID,
  formatOverridesPlugin
};
