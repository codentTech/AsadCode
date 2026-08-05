/**
 * Semantic wrapper for content that must remain in the initial HTML.
 * Never use sr-only or display:none here — AI tools that run JS often strip those.
 */
export default function ServerReadableContent({
  children,
  id = "server-readable-content",
}) {
  return (
    <div id={id} data-crawlable="true">
      {children}
    </div>
  );
}
