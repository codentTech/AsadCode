import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import Link from "next/link";
import { CLEERCUT_PRICING } from "@/common/constants/comparison-pages.constant";
import JsonLd from "@/components/seo/json-ld.component";
import { buildFaqPageSchema, buildWebPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_URL } from "@/common/constants/site.constant";

export default function ComparisonAlternativePage({ page }) {
  const pageUrl = `${SITE_URL}/alternatives/${page.slug}`;
  const faqSchema = page.faq?.length ? buildFaqPageSchema(page.faq) : null;

  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: page.title,
          description: page.metaDescription,
          url: pageUrl,
        })}
      />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}

      <HeaderFooterLayout>
        <article className="min-h-screen bg-gray-50">
          <header className="border-b border-indigo-100 bg-primary px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-100 sm:text-xs">
                Alternatives
              </p>
              <h1 className="mt-1 text-sm font-semibold text-white sm:text-lg md:text-xl">
                {page.heading}
              </h1>
              <p className="mt-2 text-[10px] leading-snug text-indigo-100 sm:text-xs md:text-sm">
                {page.intro}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
            {page.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
              >
                <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                  {section.title}
                </h2>
                <p className="mt-2 text-[10px] leading-snug text-gray-600 sm:text-xs md:text-sm">
                  {section.body}
                </p>
              </section>
            ))}

            <section className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
              <h2 className="text-sm font-semibold text-gray-900 sm:text-base">CleerCut pricing</h2>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-[10px] text-gray-700 sm:text-xs">
                {CLEERCUT_PRICING.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>

            {page.faq?.length ? (
              <section className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
                <h2 className="text-sm font-semibold text-gray-900 sm:text-base">FAQ</h2>
                <div className="mt-3 space-y-3">
                  {page.faq.map((item) => (
                    <div key={item.question}>
                      <h3 className="text-xs font-semibold text-gray-900 sm:text-sm">
                        {item.question}
                      </h3>
                      <p className="mt-1 text-[10px] leading-snug text-gray-600 sm:text-xs">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Link href="/pricing" className="btn btn-primary">
                View pricing
              </Link>
              <Link href="/vs/grin" className="btn btn-outline">
                CleerCut vs GRIN
              </Link>
            </div>
          </div>
        </article>
      </HeaderFooterLayout>
    </>
  );
}
