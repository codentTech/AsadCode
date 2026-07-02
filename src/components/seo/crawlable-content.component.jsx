export default function CrawlableContent({ children }) {
  return (
    <div aria-hidden="true" className="hidden">
      {children}
    </div>
  );
}
