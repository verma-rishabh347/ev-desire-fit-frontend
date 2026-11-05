import express from "express";
import { fileURLToPath } from "node:url";
import { isIP } from "node:net";
import { dirname, extname, join } from "node:path";
import { readFileSync } from "node:fs";
import health__get from "./api/health/GET";
import { seoRoutes } from "../lib/seo-routes";
import {
  loadAdSenseRuntimeConfig,
  resolveAdSenseTextFile,
} from "./adsense-manifest";
import { loadIndexNowKey } from "./indexnow-key";
import { isSystemHost } from "./seo-host";
import { llmsTxtHandler } from "./llms-txt";
const UNROUTED = "(unrouted)";
function routeLabel(req) {
  const route = req.route;
  if (typeof route !== "object" || route === null) {
    return UNROUTED;
  }
  const template = route.path;
  if (typeof template === "string") {
    return template;
  }
  if (template instanceof RegExp) {
    return template.source;
  }
  return UNROUTED;
}
const MAX_LOGGED_FRAMES = 5;
function loggedFrames(err) {
  if (typeof err.stack !== "string") {
    return [];
  }
  const headline = err.message ? `${err.name}: ${err.message}` : err.name;
  if (!err.stack.startsWith(headline)) {
    return [];
  }
  return err.stack
    .slice(headline.length)
    .split("\n")
    .filter((line) => /^\s+at \S/.test(line))
    .slice(0, MAX_LOGGED_FRAMES)
    .map((line) => line.trim());
}
function toLogError(err) {
  const shaped = {
    name: err instanceof Error ? err.name : typeof err,
  };
  const fields = typeof err === "object" && err !== null ? err : {};
  if (typeof fields.type === "string") {
    shaped.type = fields.type;
  }
  if (typeof fields.code === "string" || typeof fields.code === "number") {
    shaped.code = fields.code;
  }
  if (typeof fields.status === "number") {
    shaped.status = fields.status;
  }
  if (err instanceof Error) {
    const frames = loggedFrames(err);
    if (frames.length > 0) {
      shaped.frames = frames;
    }
  }
  return shaped;
}
const apiErrorHandler = (err, req, res, _next) => {
  console.error("ssr.api.error", {
    route: routeLabel(req),
    error: toLogError(err),
  });
  res.status(500).json({ error: "Internal server error" });
};
const finalErrorHandler = (err, req, res, _next) => {
  console.error("ssr.request.failed", {
    route: routeLabel(req),
    error: toLogError(err),
  });
  if (res.headersSent) {
    res.destroy();
    return;
  }
  const rawStatus =
    typeof err === "object" && err !== null
      ? (err.status ?? err.statusCode)
      : void 0;
  const status =
    typeof rawStatus === "number" && rawStatus >= 400 && rawStatus <= 599
      ? rawStatus
      : 500;
  res.status(status).type("text/plain").send("Internal Server Error");
};
function registerAdSenseTextRoutes(app2, config) {
  app2.get("/ads.txt", (_req, res) => {
    const content = resolveAdSenseTextFile(config, "adsTxt");
    if (content === null) {
      res
        .status(404)
        .type("text/plain")
        .set("Cache-Control", "no-cache")
        .send("Not found\n");
      return;
    }
    res.type("text/plain").set("Cache-Control", "no-cache").send(content);
  });
  app2.get("/app-ads.txt", (_req, res) => {
    const content = resolveAdSenseTextFile(config, "appAdsTxt");
    if (content === null) {
      res
        .status(404)
        .type("text/plain")
        .set("Cache-Control", "no-cache")
        .send("Not found\n");
      return;
    }
    res.type("text/plain").set("Cache-Control", "no-cache").send(content);
  });
}
function renderSsrDocument(template, result, adSenseConfig) {
  const head = [result.head, adSenseConfig.scriptHtml]
    .filter(Boolean)
    .join("\n");
  return template
    .replace("<!--app-head-->", () => head)
    .replace("<!--app-html-->", () => result.html);
}
function normalizeCommerceApiBaseUrlEnv() {
  if (process.env.GODADDY_API_BASE_URL) return;
  const hostOnly = process.env.VITE_GODADDY_API_HOST;
  if (!hostOnly) return;
  const normalizedHost = hostOnly.replace(/^https?:\/\//, "").trim();
  if (!normalizedHost) return;
  process.env.GODADDY_API_BASE_URL = `https://${normalizedHost}`;
}
normalizeCommerceApiBaseUrlEnv();
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/health", health__get);
app.use("/api", apiErrorHandler);
function baseUrl(req) {
  return `${req.protocol}://${req.hostname}`;
}
function siteOriginReason(url) {
  if (!url) return "unparseable";
  if (url.protocol !== "https:") return "bad_scheme";
  if (isSystemHost(url)) return "system_host";
  return "accepted";
}
function isIpHost(hostname) {
  return isIP((hostname ?? "").replace(/^\[|\]$/g, "")) !== 0;
}
function parseUrl(raw) {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}
function preferredOrigin(req) {
  const raw = req.get("x-airo-site-origin");
  if (!raw) return baseUrl(req);
  const url = parseUrl(raw);
  const reason = siteOriginReason(url);
  const origin = url && reason === "accepted" ? url.origin : baseUrl(req);
  const headerIsIp = url !== null && isIpHost(url.hostname);
  const requestIsIp = isIpHost(req.hostname);
  if (headerIsIp || requestIsIp) {
    const where =
      headerIsIp && requestIsIp ? "both" : headerIsIp ? "header" : "request";
    console.info("ssr.site-origin.ip-literal", `in=${where} reason=${reason}`);
    return origin;
  }
  console.info(
    "ssr.site-origin.observed",
    `requestOrigin=${baseUrl(req)} preferredOrigin=${origin} reason=${reason}`,
  );
  return origin;
}
function escapeXml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
}
app.get("/robots.txt", (req, res) => {
  if (isSystemHost(req)) {
    res
      .type("text/plain")
      .set("Cache-Control", "public, max-age=60, must-revalidate")
      .set("Vary", "Host")
      .send("User-agent: *\nDisallow: /\n");
    return;
  }
  const base = baseUrl(req);
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
  res
    .type("text/plain")
    .set("Cache-Control", "public, max-age=60, must-revalidate")
    .set("Vary", "Host")
    .send(body);
});
app.get("/sitemap.xml", (req, res) => {
  if (isSystemHost(req)) {
    const empty = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>
`;
    res
      .type("application/xml")
      .set("Cache-Control", "public, max-age=60, must-revalidate")
      .set("Vary", "Host")
      .send(empty);
    return;
  }
  const base = baseUrl(req);
  const urls = seoRoutes
    .filter((r) => typeof r.path === "string" && r.path.startsWith("/"))
    .map((r) => {
      const loc = `${base}${r.path}`;
      const parts = [`    <loc>${escapeXml(loc)}</loc>`];
      if (r.lastmod)
        parts.push(`    <lastmod>${escapeXml(r.lastmod)}</lastmod>`);
      if (r.changefreq)
        parts.push(`    <changefreq>${r.changefreq}</changefreq>`);
      if (r.priority !== void 0)
        parts.push(`    <priority>${r.priority.toFixed(1)}</priority>`);
      return `  <url>
${parts.join("\n")}
  </url>`;
    })
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  res
    .type("application/xml")
    .set("Cache-Control", "public, max-age=60, must-revalidate")
    .set("Vary", "Host")
    .send(body);
});
app.get("/llms.txt", llmsTxtHandler);
if (import.meta.env.PROD) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const clientDir = join(__dirname, "client");
  const adSenseRuntimeConfig = loadAdSenseRuntimeConfig(__dirname);
  const indexNowKey = loadIndexNowKey(__dirname);
  registerAdSenseTextRoutes(app, adSenseRuntimeConfig);
  if (indexNowKey !== null) {
    app.get(`/${indexNowKey}.txt`, (_req, res) => {
      res
        .type("text/plain")
        .set("Cache-Control", "public, max-age=86400")
        .send(indexNowKey);
    });
  }
  app.use(
    express.static(clientDir, {
      index: false,
      setHeaders(res, filePath) {
        res.set(
          "Cache-Control",
          filePath.includes("/assets/")
            ? "public, max-age=31536000, immutable"
            : "no-cache",
        );
      },
    }),
  );
  app.use((_req, res, next) => {
    res.set("Cache-Control", "no-cache");
    next();
  });
  let template;
  try {
    template = readFileSync(join(clientDir, "index.html"), "utf-8");
  } catch (err) {
    console.error("ssr.template.load-failed", {
      path: join(clientDir, "index.html"),
      error: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  }
  if (
    !template.includes("<!--app-head-->") ||
    !template.includes("<!--app-html-->")
  ) {
    console.error("ssr.template.markers-missing", {
      hasHead: template.includes("<!--app-head-->"),
      hasHtml: template.includes("<!--app-html-->"),
    });
    process.exit(1);
  }
  const fallbackShell = template
    .replace("<!--app-head-->", "")
    .replace("<!--app-html-->", "");
  let renderFn = null;
  const SSR_MODULE_LOAD_TIMEOUT_MS = 3e4;
  const loadTimeout = setTimeout(() => {
    if (renderFn !== null) return;
    console.error("ssr.module.load-timeout", {
      timeoutMs: SSR_MODULE_LOAD_TIMEOUT_MS,
    });
    process.exit(1);
  }, SSR_MODULE_LOAD_TIMEOUT_MS);
  loadTimeout.unref();
  import("../entry-server").then(
    (mod) => {
      clearTimeout(loadTimeout);
      renderFn = mod.render;
    },
    (err) => {
      clearTimeout(loadTimeout);
      console.error("ssr.module.load-failed", {
        error: err instanceof Error ? err.stack : String(err),
      });
      process.exit(1);
    },
  );
  app.get(/.*/, async (req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();
    if (extname(req.path)) return next();
    const sendFallback = () =>
      res
        .status(503)
        .set("Content-Type", "text/html; charset=utf-8")
        .set("Cache-Control", "no-store")
        .send(fallbackShell);
    if (renderFn === null) {
      return sendFallback();
    }
    try {
      const result = await renderFn(
        req.url,
        `${req.protocol}://${req.hostname}`,
      );
      if (result.redirect) {
        res.redirect(result.status, result.redirect);
        return;
      }
      if (!result.html) {
        console.error("ssr.render.error-response", {
          route: routeLabel(req),
          status: result.status,
        });
        res
          .status(result.status)
          .set("Content-Type", "text/html; charset=utf-8")
          .set("Cache-Control", "no-store")
          .send(fallbackShell);
        return;
      }
      preferredOrigin(req);
      const seoHead = isSystemHost(req)
        ? `<meta name="robots" content="noindex,nofollow">`
        : `<link rel="canonical" href="${escapeXml(`${req.protocol}://${req.hostname}${req.path}`)}">`;
      const out = renderSsrDocument(
        template,
        { ...result, head: seoHead + result.head },
        adSenseRuntimeConfig,
      );
      res
        .status(result.status)
        .set("Content-Type", "text/html; charset=utf-8")
        .set("Cache-Control", "no-cache")
        .send(out);
    } catch (err) {
      console.error("ssr.render.failed", {
        route: routeLabel(req),
        // The stack is dropped even though React annotates it with the failing
        // component tree. A route component or loader throws messages it builds
        // itself, so a thrown value can quote a query parameter or a submitted
        // field, and the message is embedded in the stack. The component tree is
        // not worth sending request data to a shared log.
        error: toLogError(err),
      });
      sendFallback();
    }
  });
  app.use(finalErrorHandler);
  const shutdown = async (signal) => {
    console.log(`Got ${signal}, shutting down gracefully...`);
    let mod = null;
    try {
      const dbClient = "./db/client.js";
      mod = await import(
        /* @vite-ignore */
        dbClient
      );
    } catch (error) {
      const code = error?.code;
      if (code !== "ERR_MODULE_NOT_FOUND") {
        console.error("ssr.shutdown.db-import-failed", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    if (mod && typeof mod.closeConnection === "function") {
      try {
        await mod.closeConnection();
        console.log("Database connections closed");
      } catch (error) {
        console.error("ssr.shutdown.db-close-failed", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    process.exit(0);
  };
  ["SIGTERM", "SIGINT"].forEach((signal) => {
    process.once(signal, () => {
      void shutdown(signal);
    });
  });
  const rawPort = process.env.PORT || "3000";
  const port = parseInt(rawPort, 10);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    console.error("ssr.server.invalid-port", { rawPort });
    process.exit(1);
  }
  const host = process.env.HOST || "0.0.0.0";
  const server = app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
  });
  server.on("error", (err) => {
    console.error("ssr.server.listen-failed", {
      port,
      host,
      code: err.code,
      error: err.message,
    });
    process.exit(1);
  });
}
var stdin_default = app;
export {
  apiErrorHandler,
  stdin_default as default,
  finalErrorHandler,
  preferredOrigin,
  registerAdSenseTextRoutes,
  renderSsrDocument,
  routeLabel,
  toLogError,
};
