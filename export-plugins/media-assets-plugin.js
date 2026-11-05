import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import {
  ALLOWED_IMAGE_REDIRECT_HOSTS,
  ALLOWED_VIDEO_REDIRECT_HOSTS
} from "./media-redirect-policy.js";
import { parseSlotPath, resolveSlotTargetUrl } from "./media-slot-selection.js";
const MANIFEST_FILENAME = "airo-media.json";
const IMAGE_PREFIX = "/airo-assets/images/";
const VIDEO_PREFIX = "/airo-assets/videos/";
const UPLOAD_PREFIX = "/airo-assets/uploads/";
const ALLOWED_IMAGE_HOSTS = ALLOWED_IMAGE_REDIRECT_HOSTS;
const ALLOWED_VIDEO_HOSTS = ALLOWED_VIDEO_REDIRECT_HOSTS;
const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf"
};
const manifestCacheByRoot = /* @__PURE__ */ new Map();
async function loadMediaManifest(root) {
  const manifestPath = path.join(root, MANIFEST_FILENAME);
  try {
    const { mtimeMs } = await stat(manifestPath);
    const cached = manifestCacheByRoot.get(root);
    if (cached && cached.mtime === mtimeMs) return cached.manifest;
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifestCacheByRoot.set(root, { manifest, mtime: mtimeMs });
    return manifest;
  } catch {
    return {};
  }
}
function buildUploadSearchPaths(root) {
  const publicAssets = path.join(root, "public", "assets");
  return [
    publicAssets,
    path.join(publicAssets, "media"),
    path.join(publicAssets, "images"),
    path.join(publicAssets, "uploads"),
    path.join(root, "public", "media"),
    path.join(root, "public", "images")
  ];
}
function findUploadFile(searchPaths, filename) {
  if (!filename || filename.includes("..") || filename.startsWith("/") || filename.includes("\0")) {
    return null;
  }
  for (const dir of searchPaths) {
    const candidate = path.resolve(dir, filename);
    const base = path.resolve(dir);
    if (candidate !== base && !candidate.startsWith(`${base}${path.sep}`)) continue;
    if (!existsSync(candidate)) continue;
    if (!statSync(candidate).isFile()) continue;
    return candidate;
  }
  return null;
}
function isAllowedRedirectUrl(targetUrl, allowedHosts) {
  try {
    const parsed = new URL(targetUrl);
    return parsed.protocol === "https:" && allowedHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}
function contentTypeFor(filePath) {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}
function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(body);
}
function serveLocalFile(res, filePath) {
  res.statusCode = 200;
  res.setHeader("Content-Type", contentTypeFor(filePath));
  res.setHeader("X-Content-Type-Options", "nosniff");
  createReadStream(filePath).pipe(res);
}
function serveDataUri(res, dataUri) {
  const match = dataUri.match(/^data:([^;,]+)?(?:;base64)?,(.+)$/);
  if (!match) {
    sendJson(res, 400, JSON.stringify({ error: "invalid data URI" }));
    return;
  }
  const isBase64 = dataUri.includes(";base64,");
  const contentType = match[1] || "application/octet-stream";
  const payload = match[2] ?? "";
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  res.end(isBase64 ? Buffer.from(payload, "base64") : decodeURIComponent(payload));
}
function redirectTo(res, targetUrl) {
  res.statusCode = 302;
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Location", targetUrl);
  res.end();
}
function serveUpload(res, root, uploadUrl) {
  if (!uploadUrl.startsWith(UPLOAD_PREFIX)) return false;
  const filename = uploadUrl.slice(UPLOAD_PREFIX.length);
  const filePath = findUploadFile(buildUploadSearchPaths(root), filename);
  if (!filePath) {
    sendJson(res, 404, JSON.stringify({ error: "file not found" }));
    return true;
  }
  serveLocalFile(res, filePath);
  return true;
}
function serveManifest(res, root) {
  const manifestPath = path.join(root, MANIFEST_FILENAME);
  if (!existsSync(manifestPath)) {
    sendJson(res, 200, "{}");
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  createReadStream(manifestPath).pipe(res);
}
function serveMediaSlot(req, res, root, manifest, prefix, allowedHosts) {
  const pathname = (req.url ?? "").split("?")[0] ?? "";
  const parsed = parseSlotPath(pathname, prefix);
  if (!parsed) return false;
  const slot = manifest[parsed.slotPath];
  if (!slot) {
    sendJson(res, 404, JSON.stringify({ error: "slot not found" }));
    return true;
  }
  const srcParam = new URL(req.url ?? "/", "http://localhost").searchParams.get("src");
  const targetUrl = resolveSlotTargetUrl(slot, parsed.surfaceVariant, srcParam);
  if (!targetUrl) {
    sendJson(res, 404, JSON.stringify({ error: "slot has no media URL" }));
    return true;
  }
  if (targetUrl.startsWith(UPLOAD_PREFIX)) {
    serveUpload(res, root, targetUrl);
    return true;
  }
  if (targetUrl.startsWith("data:")) {
    serveDataUri(res, targetUrl);
    return true;
  }
  if (isAllowedRedirectUrl(targetUrl, allowedHosts)) {
    redirectTo(res, targetUrl);
    return true;
  }
  sendJson(res, 500, JSON.stringify({ error: "invalid media URL" }));
  return true;
}
function createMediaAssetsMiddleware(getRoot) {
  return function mediaAssetsMiddleware(req, res, next) {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    const root = getRoot();
    const pathname = (req.url ?? "").split("?")[0] ?? "";
    if (pathname === `/${MANIFEST_FILENAME}`) {
      serveManifest(res, root);
      return;
    }
    if (pathname.startsWith(UPLOAD_PREFIX)) {
      const filename = pathname.slice(UPLOAD_PREFIX.length);
      const filePath = findUploadFile(buildUploadSearchPaths(root), filename);
      if (!filePath) {
        sendJson(res, 404, JSON.stringify({ error: "file not found" }));
        return;
      }
      if (req.method === "HEAD") {
        res.statusCode = 200;
        res.setHeader("Content-Type", contentTypeFor(filePath));
        res.end();
        return;
      }
      serveLocalFile(res, filePath);
      return;
    }
    loadMediaManifest(root).then(function resolveMedia(manifest) {
      if (serveMediaSlot(req, res, root, manifest, IMAGE_PREFIX, ALLOWED_IMAGE_HOSTS)) return;
      if (serveMediaSlot(req, res, root, manifest, VIDEO_PREFIX, ALLOWED_VIDEO_HOSTS)) return;
      next();
    }).catch(function onManifestError(err) {
      next(err);
    });
  };
}
function mediaAssetsPlugin() {
  let root = process.cwd();
  return {
    name: "export-media-assets",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      server.middlewares.use(createMediaAssetsMiddleware(() => root));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createMediaAssetsMiddleware(() => root));
    }
  };
}
export {
  MANIFEST_FILENAME,
  buildUploadSearchPaths,
  createMediaAssetsMiddleware,
  findUploadFile,
  isAllowedRedirectUrl,
  loadMediaManifest,
  mediaAssetsPlugin,
  parseSlotPath,
  resolveSlotTargetUrl
};
