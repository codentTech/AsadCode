const CRAWLABLE_STYLE = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export default function CrawlableContent({ children }) {
  return (
    <div data-crawlable="true" style={CRAWLABLE_STYLE}>
      {children}
    </div>
  );
}
