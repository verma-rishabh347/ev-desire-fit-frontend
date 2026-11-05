import { Helmet } from "@dr.pogodin/react-helmet";
import { useLocation } from "react-router";
import { buildHomepageSameAsJsonLdDocument } from "@/lib/organization-json-ld";
import { useJsonLdSiteUrl } from "@/lib/json-ld-site-url-context";
import { siteMeta } from "@/lib/site-meta";
function HomepageSameAsJsonLd() {
  const location = useLocation();
  const siteUrl = useJsonLdSiteUrl();
  if (location.pathname !== "/" || !siteUrl) {
    return null;
  }
  const jsonLd = buildHomepageSameAsJsonLdDocument({
    siteUrl,
    organizationName:
      siteMeta.name.trim() || new globalThis.URL(siteUrl).hostname,
  });
  return (
    /* @__PURE__ */ <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd).replace(/</g, "\\u003c")}
      </script>
    </Helmet>
  );
}
export { HomepageSameAsJsonLd as default };
