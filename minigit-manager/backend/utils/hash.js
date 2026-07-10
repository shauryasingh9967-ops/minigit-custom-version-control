const crypto = require("crypto");

/**
 * Generates a short git-like hash (7 characters) from arbitrary input.
 */
function shortHash(input) {
  return crypto
    .createHash("sha1")
    .update(typeof input === "string" ? input : JSON.stringify(input))
    .digest("hex")
    .slice(0, 7);
}

/**
 * Generates a full-length hash, used internally to detect content changes.
 */
function contentHash(content) {
  return crypto
    .createHash("sha1")
    .update(content || "")
    .digest("hex");
}

module.exports = { shortHash, contentHash };
