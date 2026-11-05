const SYSTEM_HOST_SUFFIXES = [
  ".airoapp.ai",
  ".test-airoapp.ai",
  ".dev-airoapp.ai",
  ".dev-godaddy.com",
];
function isSystemHost(req) {
  const h = (req.hostname || "").toLowerCase();
  if (!h || h === "localhost" || h === "127.0.0.1") return true;
  return SYSTEM_HOST_SUFFIXES.some(
    (s) => h === s.replace(/^\./, "") || h.endsWith(s),
  );
}
export { SYSTEM_HOST_SUFFIXES, isSystemHost };
