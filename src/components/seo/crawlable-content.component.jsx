/**
 * Static HTML fallback for AI/search crawlers that do not execute JS.
 * Content is present in the SSR HTML response; visually hidden from users.
 */
export default function CrawlableContent({ children }) {
  return (
    <div
      aria-hidden="true"
      data-crawlable="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </div>
  );
}
