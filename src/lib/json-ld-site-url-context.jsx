import { createContext, useContext } from "react";
const JsonLdSiteUrlContext = createContext(void 0);
function JsonLdSiteUrlProvider({ siteUrl, children }) {
  return (
    /* @__PURE__ */ <JsonLdSiteUrlContext.Provider
      value={siteUrl.replace(/\/$/, "")}
    >
      {children}
    </JsonLdSiteUrlContext.Provider>
  );
}
function useJsonLdSiteUrl() {
  const fromContext = useContext(JsonLdSiteUrlContext);
  if (fromContext) {
    return fromContext;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const fromEnv = import.meta.env.VITE_PUBLIC_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return "";
}
export { JsonLdSiteUrlProvider, useJsonLdSiteUrl };
