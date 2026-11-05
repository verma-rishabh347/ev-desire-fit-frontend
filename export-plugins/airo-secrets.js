function getSecret(secretName) {
  return process.env[secretName] ?? null;
}
function listSecretNames() {
  return Object.keys(process.env).filter(
    (k) => !k.startsWith("npm_") && !k.startsWith("NODE_") && !k.startsWith("PATH")
  );
}
export {
  getSecret,
  listSecretNames
};
