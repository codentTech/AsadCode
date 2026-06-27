import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LEGAL_PAGE_MAX_WIDTH } from "@/common/constants/legal-layout.constant";

export default function LegalDocHeader({
  backHref,
  backLabel,
  title,
  lastUpdated,
  description,
  meta,
}) {
  const lastUpdatedLabel = `Last updated ${lastUpdated}`;

  return (
    <section className="border-b border-indigo-700/20 bg-primary">
      <div className={`mx-auto ${LEGAL_PAGE_MAX_WIDTH} px-3 py-2.5 sm:px-5 sm:py-4 lg:px-6`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Link
            href={backHref}
            className="btn btn-outline inline-flex h-8 min-h-8 w-fit max-w-full shrink-0 items-center gap-1.5 self-start !border-white !bg-transparent !px-2.5 !text-white hover:!bg-white/10 sm:!px-3 sm:min-w-0 normal-case"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-xs sm:text-sm">{backLabel}</span>
          </Link>

          <div className="hidden h-4 w-px shrink-0 bg-white/25 sm:block" aria-hidden="true" />

          <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <h1 className="min-w-0 truncate text-sm font-semibold leading-tight text-white sm:text-base md:text-lg">
              {title}
            </h1>
            <p className="shrink-0 whitespace-nowrap text-right text-[10px] leading-tight text-white sm:text-xs">
              {lastUpdatedLabel}
            </p>
          </div>
        </div>

        {(description || meta) && (
          <div className="mt-2 rounded-lg bg-white px-2.5 py-2 sm:mt-3 sm:px-4 sm:py-3">
            <p className="text-[10px] leading-snug text-gray-700 sm:text-xs md:text-sm">
              {description}
              {description && meta ? " · " : ""}
              {meta}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
