export function deliverablesToContentFormatString(deliverables) {
  if (deliverables == null || deliverables === "") return "";
  if (Array.isArray(deliverables)) {
    return deliverables
      .map((entry) => {
        if (entry == null) return "";
        if (typeof entry === "object") return JSON.stringify(entry);
        let s = String(entry).trim();
        if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
          try {
            return JSON.parse(s);
          } catch {
            return s.slice(1, -1);
          }
        }
        return s;
      })
      .filter(Boolean)
      .join(", ");
  }
  if (typeof deliverables === "string") {
    const t = deliverables.trim();
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        return deliverablesToContentFormatString(JSON.parse(t));
      } catch {
        return deliverables;
      }
    }
    return deliverables;
  }
  return String(deliverables);
}
