export function parseHttpUrlInput(raw) {
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (!trimmed) {
    return { ok: false, error: "Enter a URL" };
  }
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    if (/^\s*https?:\/\//i.test(trimmed)) {
      return { ok: false, error: "Enter a valid URL" };
    }
    try {
      parsed = new URL(`https://${trimmed}`);
    } catch {
      return { ok: false, error: "Enter a valid URL" };
    }
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Use a link starting with http:// or https://" };
  }
  return { ok: true, href: parsed.href };
}
