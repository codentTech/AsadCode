import { FAQ_DATA } from "@/common/constants/faq.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

export default function FaqCrawlableContent() {
  return (
    <CrawlableContent>
      <h1>Frequently Asked Questions — CleerCut</h1>
      <p>
        Everything you need to know about using CleerCut for seamless brand-creator
        collaborations.
      </p>
      {FAQ_DATA.map((category) => (
        <section key={category.category}>
          <h2>{category.category}</h2>
          {category.questions.map((item) => (
            <div key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </section>
      ))}
    </CrawlableContent>
  );
}
