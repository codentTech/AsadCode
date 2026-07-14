import { ChevronDown } from "lucide-react";
import useBlogPostFaq from "./use-blog-post-faq.hook";

const BlogPostFaq = ({ items }) => {
  const { toggleQuestion, isQuestionOpen } = useBlogPostFaq(items);

  if (!items?.length) return null;

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      <h2 className="text-left text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
        FAQs
      </h2>

      <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item) => {
          const isOpen = isQuestionOpen(item.id);

          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => toggleQuestion(item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-semibold text-gray-900 sm:text-base">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen ? (
                <div
                  className="blog-post-body pb-4 text-left text-sm leading-relaxed text-gray-700 sm:text-base"
                  dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BlogPostFaq;
