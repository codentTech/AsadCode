import { notFound } from "next/navigation";
import {
  COMPARISON_ALTERNATIVE_SLUGS,
  getComparisonAlternativePage,
} from "@/common/constants/comparison-pages.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import ComparisonAlternativePage from "@/components/comparison/comparison-alternative-page/comparison-alternative-page.component";

export function generateStaticParams() {
  return COMPARISON_ALTERNATIVE_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const page = getComparisonAlternativePage(params.slug);

  if (!page) {
    return { title: `Not Found | ${SITE_NAME}` };
  }

  return {
    title: `${page.title} | ${SITE_NAME}`,
    description: page.metaDescription,
    alternates: { canonical: `${SITE_URL}/alternatives/${page.slug}` },
  };
}

export default function Page({ params }) {
  const page = getComparisonAlternativePage(params.slug);

  if (!page) {
    notFound();
  }

  return <ComparisonAlternativePage page={page} />;
}
