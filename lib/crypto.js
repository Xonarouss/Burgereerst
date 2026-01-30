import crypto from "crypto";

export function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function randomToken(len = 32) {
  return crypto.randomBytes(len).toString("hex");
}

export function hashIp(ip) {
  if (!ip) return null;
  // Salted hash to reduce raw IP storage
  const salt = process.env.IP_HASH_SALT || "burger-eerst";
  return sha256(`${salt}:${ip}`);
}
