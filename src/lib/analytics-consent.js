const CONSENT_KEY = "c2_analytics_consent";
function parseConsent(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function getAnalyticsConsent() {
  if (typeof localStorage === "undefined") return false;
  const consent = parseConsent(localStorage.getItem(CONSENT_KEY));
  return consent?.analytics === true;
}
function onConsentChange(callback) {
  function handler(event) {
    const e = event;
    callback(e.detail.consented);
  }
  window.addEventListener("cookie-consent-changed", handler);
  return () => window.removeEventListener("cookie-consent-changed", handler);
}
export { getAnalyticsConsent, onConsentChange };
