import { existsSync, readFileSync } from "node:fs";
import { normalize, resolve, sep } from "node:path";
const ADSENSE_MANIFEST_FILENAME = "airo-adsense.json";
const ADSENSE_PUBLISHER_ID_PATTERN = /^ca-pub-\d{16}$/;
const EMPTY_ADSENSE_RUNTIME_CONFIG = {
  publisherId: null,
  scriptHtml: "",
  adsTxt: null,
  appAdsTxt: null,
};
function buildCanonicalAdSenseScript(publisherId) {
  if (!ADSENSE_PUBLISHER_ID_PATTERN.test(publisherId)) return "";
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"><\/script>`;
}
function loadAdSenseRuntimeConfig(baseDir) {
  const manifestPath = resolveRuntimeManifestPath(baseDir);
  if (manifestPath === null) return EMPTY_ADSENSE_RUNTIME_CONFIG;
  if (!existsSync(manifestPath)) return EMPTY_ADSENSE_RUNTIME_CONFIG;
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
    return normalizeRuntimeManifest(parsed);
  } catch (error) {
    console.error("adsense.manifest.load_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return EMPTY_ADSENSE_RUNTIME_CONFIG;
  }
}
function resolveRuntimeManifestPath(baseDir) {
  if (baseDir.includes("\0")) return null;
  if (baseDir.split(/[\\/]+/).includes("..")) return null;
  const normalizedBaseDir = normalize(baseDir);
  const resolvedBaseDir = resolve(normalizedBaseDir);
  const resolvedManifestPath = resolve(
    resolvedBaseDir,
    ADSENSE_MANIFEST_FILENAME,
  );
  const basePrefix = resolvedBaseDir.endsWith(sep)
    ? resolvedBaseDir
    : `${resolvedBaseDir}${sep}`;
  if (
    resolvedManifestPath !== resolvedBaseDir &&
    !resolvedManifestPath.startsWith(basePrefix)
  ) {
    return null;
  }
  return resolvedManifestPath;
}
function resolveAdSenseTextFile(config, key) {
  return config[key];
}
function normalizeRuntimeManifest(value) {
  if (!isRuntimeManifestShape(value)) return EMPTY_ADSENSE_RUNTIME_CONFIG;
  if (!value.enabled) return EMPTY_ADSENSE_RUNTIME_CONFIG;
  const publisherId = isValidPublisherId(value.publisherId)
    ? value.publisherId
    : null;
  return {
    publisherId,
    scriptHtml: publisherId ? buildCanonicalAdSenseScript(publisherId) : "",
    adsTxt: normalizeTextFile(value.adsTxt),
    appAdsTxt: normalizeTextFile(value.appAdsTxt),
  };
}
function isRuntimeManifestShape(value) {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value;
  return (
    candidate.version === 1 &&
    typeof candidate.enabled === "boolean" &&
    (candidate.publisherId === null ||
      typeof candidate.publisherId === "string") &&
    typeof candidate.scriptSnippet === "string" &&
    isTextFileManifest(candidate.adsTxt) &&
    isTextFileManifest(candidate.appAdsTxt)
  );
}
function isTextFileManifest(value) {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value;
  return (
    typeof candidate.enabled === "boolean" &&
    typeof candidate.content === "string"
  );
}
function isValidPublisherId(value) {
  return typeof value === "string" && ADSENSE_PUBLISHER_ID_PATTERN.test(value);
}
function normalizeTextFile(value) {
  if (!value.enabled) return null;
  const content = value.content.trim();
  return content ? value.content : null;
}
export {
  EMPTY_ADSENSE_RUNTIME_CONFIG,
  buildCanonicalAdSenseScript,
  loadAdSenseRuntimeConfig,
  resolveAdSenseTextFile,
};
