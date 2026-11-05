import { statSync } from "node:fs";
import path from "node:path";
const ENROLLMENT_MARKER_PATH = "src/content/.content-authority";
const ENFORCEMENT_MARKER_PATH = "src/content/.content-authority-enforce";
const NO_USABLE_MARKER = /* @__PURE__ */ new Set([
  "ENOENT",
  "ENOTDIR",
  "EACCES",
  "EPERM",
  "ELOOP",
  "ENAMETOOLONG"
]);
function enforcementEnabled(projectRoot) {
  if (projectRoot.length === 0) return false;
  try {
    return statSync(path.join(projectRoot, ENFORCEMENT_MARKER_PATH)).isFile();
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String(error.code) : "";
    if (NO_USABLE_MARKER.has(code)) return false;
    throw error;
  }
}
export {
  ENFORCEMENT_MARKER_PATH,
  ENROLLMENT_MARKER_PATH,
  enforcementEnabled
};
