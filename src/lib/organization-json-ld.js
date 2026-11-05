import sameAsConfig from "../config/same-as.json";
function getSameAsUrls() {
  const urls = Array.isArray(sameAsConfig.urls) ? sameAsConfig.urls : [];
  return urls.filter((url) => typeof url === "string" && url.length > 0);
}
function buildOrganizationNode(params) {
  const businessType = params.businessType ?? "Organization";
  const node = {
    "@type": businessType,
    "@id": `${params.siteUrl}/#organization`,
    name: params.name,
    url: `${params.siteUrl}/`,
  };
  if (params.logo) {
    node.logo = params.logo;
  }
  const sameAs = getSameAsUrls();
  if (sameAs.length > 0) {
    node.sameAs = sameAs;
  }
  return node;
}
function buildHomepageSameAsJsonLdDocument(params) {
  return {
    "@context": "https://schema.org",
    ...buildOrganizationNode({
      siteUrl: params.siteUrl,
      name: params.organizationName,
    }),
  };
}
function buildHomepageJsonLd(params) {
  const websiteId = `${params.siteUrl}/#website`;
  const webpageId = `${params.siteUrl}/#webpage`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: params.organizationName,
        url: `${params.siteUrl}/`,
      },
      buildOrganizationNode({
        siteUrl: params.siteUrl,
        name: params.organizationName,
        logo: params.logo,
        businessType: params.businessType,
      }),
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: `${params.siteUrl}/`,
        isPartOf: { "@id": websiteId },
        about: { "@id": `${params.siteUrl}/#organization` },
        datePublished: params.datePublished,
        dateModified: params.dateModified,
      },
    ],
  };
}
export {
  buildHomepageJsonLd,
  buildHomepageSameAsJsonLdDocument,
  buildOrganizationNode,
  getSameAsUrls,
};
