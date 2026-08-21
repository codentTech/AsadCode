import { SEO_FAQ_ITEMS } from "@/common/constants/seo-schema.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

/**
 * Compact server FAQ block. Keep this short — large hidden dumps get dropped by
 * some AI fetch/extract tools. Answers must stay in plain text here.
 */
export default function FaqCrawlableContent() {
  return (
    <CrawlableContent>
      <h1>Frequently Asked Questions — CleerCut</h1>
      <p>
        Everything you need to know about using CleerCut for seamless brand-creator
        collaborations.
      </p>
      {SEO_FAQ_ITEMS.map((item) => (
        <div key={item.question}>
          <h2>{item.question}</h2>
          <p>{item.answer}</p>
        </div>
      ))}
    </CrawlableContent>
  );
}
