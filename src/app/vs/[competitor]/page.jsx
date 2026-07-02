import { notFound } from "next/navigation";
import {
  COMPARISON_VS_SLUGS,
  getComparisonVsPage,
} from "@/common/constants/comparison-pages.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import ComparisonVsPage from "@/components/comparison/comparison-vs-page/comparison-vs-page.component";

export function generateStaticParams() {
  return COMPARISON_VS_SLUGS.map((competitor) => ({ competitor }));
}

export function generateMetadata({ params }) {
  const page = getComparisonVsPage(params.competitor);

  if (!page) {
    return { title: `Not Found | ${SITE_NAME}` };
  }

  return {
    title: `${page.title} | ${SITE_NAME}`,
    description: page.metaDescription,
    alternates: { canonical: `${SITE_URL}/vs/${page.slug}` },
  };
}

export default function Page({ params }) {
  const page = getComparisonVsPage(params.competitor);

  if (!page) {
    notFound();
  }

  return <ComparisonVsPage page={page} />;
}
