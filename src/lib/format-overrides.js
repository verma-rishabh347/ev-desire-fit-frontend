import { lineHeightForFontSize } from "./text-size";
const EMPTY_FORMAT_OVERRIDE_SIDECAR = {
  version: 1,
  overrides: {},
};
const EMPTY_FORMAT_OVERRIDE_BUNDLE = {
  version: 1,
  scopes: {},
};
function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function isFormatOverrideSourceKind(value) {
  return (
    value === "bound-expression" ||
    value === "content-key" ||
    value === "content-key-template"
  );
}
function isFormatOverrideTarget(value) {
  if (!isRecord(value)) return false;
  return (
    typeof value.file === "string" &&
    typeof value.tagName === "string" &&
    isFormatOverrideSourceKind(value.sourceKind) &&
    (value.contentKey === void 0 ||
      value.contentKey === null ||
      typeof value.contentKey === "string") &&
    (value.contentKeyTemplate === void 0 ||
      value.contentKeyTemplate === null ||
      typeof value.contentKeyTemplate === "string") &&
    (value.expressionHash === void 0 ||
      value.expressionHash === null ||
      typeof value.expressionHash === "string")
  );
}
function isFormatOverrideMarks(value) {
  if (!isRecord(value)) return false;
  return (
    (value.bold === void 0 || typeof value.bold === "boolean") &&
    (value.italic === void 0 || typeof value.italic === "boolean") &&
    (value.color === void 0 ||
      value.color === null ||
      typeof value.color === "string") &&
    (value.fontSize === void 0 || typeof value.fontSize === "string")
  );
}
function isFormatOverrideEntry(value) {
  if (!isRecord(value)) return false;
  return (
    isFormatOverrideTarget(value.target) &&
    isFormatOverrideMarks(value.marks) &&
    typeof value.updatedAt === "string"
  );
}
function warnMalformedFormatOverrideEntry(scope, devId) {
  if (import.meta.env.DEV) {
    console.warn("[format-overrides] Ignoring malformed override entry.", {
      scope,
      devId,
    });
  }
}
function normalizeNullable(value) {
  return value ?? null;
}
function normalizeSourceFile(file) {
  const normalized = file.replace(/\\/g, "/");
  const srcIndex = normalized.indexOf("/src/");
  if (srcIndex !== -1) return normalized.slice(srcIndex + 1);
  return normalized.replace(/^\/+/, "");
}
function toSafePagePath(rawPagePath) {
  const segments = rawPagePath.split("/");
  if (segments.some((segment) => !/^[a-zA-Z0-9_-]+$/.test(segment)))
    return null;
  return segments.map((segment) => segment.toLowerCase()).join("/");
}
function deriveFormatOverrideScope(file) {
  const normalized = normalizeSourceFile(file);
  const pageMatch = /^src\/pages\/(.+)\.[jt]sx?$/.exec(normalized);
  if (!pageMatch?.[1]) {
    return { key: "shared", filePath: "format-overrides/shared.json" };
  }
  const pagePath = toSafePagePath(pageMatch[1]);
  if (!pagePath) {
    return { key: "shared", filePath: "format-overrides/shared.json" };
  }
  return {
    key: `pages/${pagePath}`,
    filePath: `format-overrides/pages/${pagePath}.json`,
  };
}
function targetsMatch(expected, actual) {
  return (
    expected.file === actual.file &&
    expected.tagName === actual.tagName &&
    expected.sourceKind === actual.sourceKind &&
    normalizeNullable(expected.contentKey) ===
      normalizeNullable(actual.contentKey) &&
    normalizeNullable(expected.contentKeyTemplate) ===
      normalizeNullable(actual.contentKeyTemplate) &&
    normalizeNullable(expected.expressionHash) ===
      normalizeNullable(actual.expressionHash)
  );
}
function findApplicableFormatOverride(bundle, devId, actual) {
  const scope = deriveFormatOverrideScope(actual.file);
  const sidecar = bundle.scopes[scope.key] ?? EMPTY_FORMAT_OVERRIDE_SIDECAR;
  const entry = sidecar.overrides[devId];
  if (!entry) return { status: "missing" };
  if (!isFormatOverrideEntry(entry)) {
    warnMalformedFormatOverrideEntry(scope.key, devId);
    return { status: "missing" };
  }
  if (!targetsMatch(entry.target, actual)) {
    return { status: "guard-mismatch", expected: entry.target, actual };
  }
  return { status: "applicable", marks: entry.marks };
}
function buildFormatOverrideStyle(marks) {
  const lineHeight = marks.fontSize
    ? lineHeightForFontSize(marks.fontSize)
    : void 0;
  return {
    ...(marks.bold ? { fontWeight: 700 } : {}),
    ...(marks.italic ? { fontStyle: "italic" } : {}),
    ...(marks.color ? { color: marks.color } : {}),
    ...(marks.fontSize ? { fontSize: marks.fontSize } : {}),
    ...(lineHeight ? { lineHeight } : {}),
  };
}
export {
  EMPTY_FORMAT_OVERRIDE_BUNDLE,
  EMPTY_FORMAT_OVERRIDE_SIDECAR,
  buildFormatOverrideStyle,
  deriveFormatOverrideScope,
  findApplicableFormatOverride,
  targetsMatch,
};
