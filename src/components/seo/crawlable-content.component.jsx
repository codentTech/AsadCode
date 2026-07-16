export default function CrawlableContent({ children }) {
  return (
    <div data-crawlable="true" className="sr-only">
      {children}
    </div>
  );
}
