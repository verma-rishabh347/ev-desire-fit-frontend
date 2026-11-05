import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { formatOverridesPlugin } from "./export-plugins/format-overrides-plugin.js";
import { contentPlugin } from "./export-plugins/content-plugin/index.js";
function extractHostname(value) {
  try {
    if (value.includes("://")) {
      return new URL(value).hostname;
    }
    return value;
  } catch {
    return value;
  }
}
function apiDevPlugin() {
  return {
    name: "api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api")) return next();
        try {
          const mod = await server.ssrLoadModule("/src/server/entry.js");
          const handler = mod.default;
          handler(req, res, next);
        } catch (err) {
          if (err instanceof Error) server.ssrFixStacktrace(err);
          next(err);
        }
      });
    }
  };
}
function ssrCjsCompatPlugin() {
  const CJS_PACKAGES = ["react-router", "react-router"];
  function rewriteNames(raw) {
    return raw.split(",").map((s) => s.trim()).filter((s) => s && !s.startsWith("type ")).map((s) => s.replace(/^(\S+)\s+as\s+(\S+)$/, "$1: $2")).join(", ");
  }
  return {
    name: "ssr-cjs-compat",
    apply: "serve",
    transform(code, id, options) {
      if (!options?.ssr) return;
      let transformed = code;
      for (const pkg of CJS_PACKAGES) {
        const re = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${pkg}['"]`, "g");
        transformed = transformed.replace(re, (_match, names) => {
          const alias = pkg.replace(/[^a-zA-Z]/g, "_");
          const destructured = rewriteNames(names);
          if (!destructured) return `import ${alias} from '${pkg}'`;
          return `import ${alias} from '${pkg}';
const {${destructured}} = ${alias}`;
        });
      }
      if (transformed === code) return;
      return {
        code: transformed,
        map: null
      };
    }
  };
}
const MIME_TYPES = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".json": "application/json"
};
function worktreePreviewPlugin() {
  const serverBundleCache = /* @__PURE__ */ new Map();
  return {
    name: "worktree-preview",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const worktreeRoot = req.headers["x-worktree-root"];
        if (!worktreeRoot) return next();
        const clientDir = path.join(worktreeRoot, "dist", "client");
        const indexPath = path.join(clientDir, "index.html");
        if (!existsSync(indexPath)) {
          res.setHeader("X-Worktree-Status", "not-built");
          res.statusCode = 503;
          res.end(JSON.stringify({
            error: "Worktree build not found. Run vite build first."
          }));
          return;
        }
        const url = req.url || "/";
        const ext = path.extname(url.split("?")[0] || "");
        if (ext && ext !== ".html") {
          const assetPath = path.resolve(clientDir, "." + (url.split("?")[0] || ""));
          if (assetPath.startsWith(clientDir + path.sep) && existsSync(assetPath)) {
            res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
            res.end(await readFile(assetPath));
            return;
          }
        }
        const bundlePath = path.join(worktreeRoot, "dist", "server.bundle.mjs");
        if (!existsSync(bundlePath)) {
          res.setHeader("Content-Type", "text/html");
          res.end(await readFile(indexPath, "utf-8"));
          return;
        }
        try {
          const bundleMtime = statSync(bundlePath).mtimeMs;
          let cached = serverBundleCache.get(worktreeRoot);
          if (!cached || cached.mtimeMs < bundleMtime) {
            const cacheBuster = `?t=${bundleMtime}`;
            const mod = await import(
              /* @vite-ignore */
              `${bundlePath}${cacheBuster}`
            );
            cached = {
              app: mod.default,
              mtimeMs: bundleMtime
            };
            serverBundleCache.set(worktreeRoot, cached);
          }
          const app = cached.app;
          app(req, res, () => {
            readFile(indexPath, "utf-8").then((html) => {
              res.setHeader("Content-Type", "text/html");
              res.end(html);
            }).catch(() => {
              res.statusCode = 500;
              res.end("Failed to read index.html");
            });
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          res.statusCode = 500;
          res.end(JSON.stringify({
            error: `Worktree server bundle failed: ${message}`
          }));
        }
      });
    }
  };
}
function ssrDevPlugin() {
  const worktreeBundleCache = /* @__PURE__ */ new Map();
  async function renderFromSource(server, routePath, req, res) {
    try {
      const mod = await server.ssrLoadModule("/src/entry-server.jsx");
      const renderFn = mod.render;
      const result = await renderFn(routePath);
      if (result.redirect) {
        res.statusCode = result.status;
        res.setHeader("Location", result.redirect);
        res.end();
        return;
      }
      const template = await readFile(path.resolve(__dirname, "index.html"), "utf-8");
      const html = template.replace("<!--app-head-->", result.head).replace("<!--app-html-->", result.html);
      res.statusCode = result.status;
      res.setHeader("Content-Type", "text/html");
      res.end(html);
    } catch (err) {
      if (err instanceof Error) server.ssrFixStacktrace(err);
      const message = err instanceof Error ? err.message : String(err);
      res.statusCode = 500;
      res.end(JSON.stringify({
        error: `SSR render failed: ${message}`
      }));
    }
  }
  async function renderFromWorktreeBuild(runId, routePath, req, res) {
    if (!/^[a-zA-Z0-9_-]+$/.test(runId)) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        error: "Invalid worktree runId"
      }));
      return;
    }
    const worktreeRoot = `/tmp/auto-${runId}`;
    const clientDir = path.join(worktreeRoot, "dist", "client");
    const indexPath = path.join(clientDir, "index.html");
    if (!existsSync(indexPath)) {
      res.setHeader("X-Worktree-Status", "not-built");
      res.statusCode = 503;
      res.end(JSON.stringify({
        error: "Worktree build not found. Run vite build first."
      }));
      return;
    }
    const ext = path.extname(routePath.split("?")[0] || "");
    if (ext && ext !== ".html") {
      const assetPath = path.resolve(clientDir, "." + routePath.split("?")[0]);
      if (assetPath.startsWith(clientDir + path.sep) && existsSync(assetPath)) {
        res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
        res.end(await readFile(assetPath));
        return;
      }
    }
    const bundlePath = path.join(worktreeRoot, "dist", "server.bundle.mjs");
    if (!existsSync(bundlePath)) {
      res.setHeader("Content-Type", "text/html");
      res.end(await readFile(indexPath, "utf-8"));
      return;
    }
    try {
      const bundleMtime = statSync(bundlePath).mtimeMs;
      let cached = worktreeBundleCache.get(worktreeRoot);
      if (!cached || cached.mtimeMs < bundleMtime) {
        const cacheBuster = `?t=${bundleMtime}`;
        const mod = await import(
          /* @vite-ignore */
          `${bundlePath}${cacheBuster}`
        );
        cached = {
          app: mod.default,
          mtimeMs: bundleMtime
        };
        worktreeBundleCache.set(worktreeRoot, cached);
      }
      const app = cached.app;
      const originalUrl = req.url;
      req.url = routePath;
      app(req, res, () => {
        req.url = originalUrl;
        readFile(indexPath, "utf-8").then((html) => {
          res.setHeader("Content-Type", "text/html");
          res.end(html);
        }).catch(() => {
          res.statusCode = 500;
          res.end("Failed to read index.html");
        });
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.statusCode = 500;
      res.end(JSON.stringify({
        error: `Worktree server bundle failed: ${message}`
      }));
    }
  }
  return {
    name: "ssr-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";
        if (!url.startsWith("/__ssr/")) return next();
        const stripped = url.slice("/__ssr/".length);
        if (stripped.startsWith("preview") && (stripped.length === 7 || stripped[7] === "/")) {
          const routePath = stripped.length <= 8 ? "/" : "/" + stripped.slice(8).split("?")[0];
          await renderFromSource(server, routePath, req, res);
        } else if (stripped.startsWith("worktree/")) {
          const rest = stripped.slice("worktree/".length);
          const slashIdx = rest.indexOf("/");
          const runId = slashIdx === -1 ? rest.split("?")[0] : rest.slice(0, slashIdx);
          const routePath = slashIdx === -1 ? "/" : "/" + rest.slice(slashIdx + 1).split("?")[0];
          await renderFromWorktreeBuild(runId, routePath, req, res);
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({
            error: "Unknown /__ssr/ variant"
          }));
        }
      });
    }
  };
}
const allowedHosts = [];
const corsOrigins = [];
if (process.env.FRONTEND_DOMAIN) {
  const frontendHost = extractHostname(process.env.FRONTEND_DOMAIN);
  allowedHosts.push(frontendHost);
  corsOrigins.push(`http://${frontendHost}`, `https://${frontendHost}`);
}
if (process.env.ALLOWED_ORIGINS) {
  const origins = process.env.ALLOWED_ORIGINS.split(",");
  allowedHosts.push(...origins.map(extractHostname));
  corsOrigins.push(...origins);
}
if (process.env.VITE_PARENT_ORIGIN) {
  allowedHosts.push(extractHostname(process.env.VITE_PARENT_ORIGIN));
  corsOrigins.push(process.env.VITE_PARENT_ORIGIN);
}
if (allowedHosts.length === 0) {
  allowedHosts.push("*");
}
if (corsOrigins.length === 0) {
  corsOrigins.push("*");
}
var stdin_default = defineConfig(({ isSsrBuild }) => ({
  envPrefix: ["VITE_", "SITE_"],
  // Airo-only editor plugins are intentionally omitted from this exported app.
  plugins: [react(), ssrCjsCompatPlugin(), ssrDevPlugin(), worktreePreviewPlugin(), apiDevPlugin(), formatOverridesPlugin(__dirname), contentPlugin()],
  resolve: {
    dedupe: ["react", "react-dom", "react-router"],
    alias: {
      nothing: "/src/fallbacks/missingModule.js",
      "@/api": path.resolve(__dirname, "./src/server/api"),
      "@": path.resolve(__dirname, "./src")
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router", "motion/react"]
  },
  ssr: {
    noExternal: isSsrBuild ? true : void 0
  },
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT || "5173"),
    strictPort: !!process.env.PORT,
    allowedHosts,
    cors: {
      origin: corsOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"]
    },
    hmr: {
      overlay: false
    },
    watch: {
      ignored: ["**/dist/**"]
    },
    // Pre-transform the entry chain on dev-server start so the FIRST iframe
    // request doesn't pay the full cold on-demand transpile cost. Paired with
    // the container's pre-start `vite optimize` (container-scripts/preview/
    // nomad_setup.sh), this shrinks the mount→IFRAME_READY window that the
    // builder's recovery logic waits on.
    warmup: {
      clientFiles: ["./src/main.jsx", "./src/App.jsx"]
    }
  },
  preview: {
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT || "5173"),
    strictPort: !!process.env.PORT,
    allowedHosts,
    cors: {
      origin: corsOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"]
    }
  },
  build: isSsrBuild ? {
    outDir: "dist",
    emptyOutDir: false,
    copyPublicDir: false,
    ssr: "src/server/entry.js",
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: "server.bundle.mjs",
        chunkFileNames: "bin/[name]-[hash].js",
        banner: "import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);"
      }
    }
  } : {
    outDir: "dist/client",
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "radix-ui": ["@radix-ui/react-accordion", "@radix-ui/react-alert-dialog", "@radix-ui/react-aspect-ratio", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-collapsible", "@radix-ui/react-context-menu", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-hover-card", "@radix-ui/react-label", "@radix-ui/react-menubar", "@radix-ui/react-navigation-menu", "@radix-ui/react-popover", "@radix-ui/react-progress", "@radix-ui/react-scroll-area", "@radix-ui/react-select", "@radix-ui/react-separator", "@radix-ui/react-slider", "@radix-ui/react-slot", "@radix-ui/react-switch", "@radix-ui/react-tabs", "@radix-ui/react-toast", "@radix-ui/react-toggle", "@radix-ui/react-toggle-group", "@radix-ui/react-tooltip"],
          query: ["@tanstack/react-query"]
        }
      }
    }
  }
}));
export {
  stdin_default as default
};
