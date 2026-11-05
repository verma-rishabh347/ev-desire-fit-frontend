import { seoRoutes } from "../lib/seo-routes";
import { siteMeta } from "../lib/site-meta";
import { isSystemHost } from "./seo-host";
function humanizeLabel(path) {
  if (path === "/") return "Home";
  const segment =
    path
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .pop() ?? "";
  return segment
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
function sanitizeMarkdown(text) {
  return text
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\\`[\]]/g, (c) => `\\${c}`)
    .replace(/ {2,}/g, " ")
    .trim();
}
function renderLlmsTxt(opts) {
  const name = sanitizeMarkdown(opts.name);
  const summary = sanitizeMarkdown(opts.summary);
  const lines = [`# ${name || opts.hostname}`];
  if (summary) {
    lines.push("", `> ${summary}`);
  }
  const pageLinks = opts.routes
    .filter((r) => typeof r.path === "string" && r.path.startsWith("/"))
    .map(
      (r) =>
        `- [${sanitizeMarkdown(humanizeLabel(r.path))}](${opts.baseUrl}${r.path})`,
    );
  if (pageLinks.length > 0) {
    lines.push("", "## Pages", ...pageLinks);
  }
  return `${lines.join("\n")}
`;
}
function llmsTxtHandler(req, res) {
  if (isSystemHost(req)) {
    res
      .status(404)
      .type("text/plain")
      .set("Cache-Control", "public, max-age=60, must-revalidate")
      .set("Vary", "Host")
      .send("Not found\n");
    return;
  }
  const body = renderLlmsTxt({
    baseUrl: `${req.protocol}://${req.hostname}`,
    hostname: req.hostname,
    name: siteMeta.name,
    summary: siteMeta.summary,
    routes: seoRoutes,
  });
  res
    .type("text/plain")
    .set("Cache-Control", "public, max-age=60, must-revalidate")
    .set("Vary", "Host")
    .send(body);
}
export { humanizeLabel, llmsTxtHandler, renderLlmsTxt, sanitizeMarkdown };
