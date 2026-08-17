export function normalizeInviteToken(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim();
  if (!s) return null;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function parseInviteValidationBody(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, message: "Invalid response" };
  }
  const inner = body.data?.data ?? body.data ?? body;
  if (!inner || typeof inner !== "object") {
    return { valid: false, message: body.message || "Invalid response" };
  }
  const valid =
    inner.valid === true ||
    (typeof inner.valid === "string" && inner.valid.toLowerCase() === "true");
  return {
    valid,
    message: inner.message,
    email: inner.email,
    resumeOnly: Boolean(inner.resumeOnly),
  };
}
