import crypto from "node:crypto";

export function generateToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createFutureDate(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
