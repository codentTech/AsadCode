import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";

const BlogPostBottomCta = () => (
  <section className="mt-16 px-2 py-10 text-center sm:px-4 sm:py-14">
    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
      Ready to run verified creator campaigns?
    </h2>
    <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
      Join CleerCut to discover creators with verified data and launch campaigns with confidence.
    </p>
    <Link href="/" className="mt-6 inline-block">
      <CustomButton text="Get Started" className="btn-outline min-w-[160px]" />
    </Link>
  </section>
);

export default BlogPostBottomCta;
