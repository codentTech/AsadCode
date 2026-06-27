import LegalPageShell from "@/components/legal/legal-page-shell/legal-page-shell.component";
import LegalDocHeader from "@/components/legal/legal-doc-header/legal-doc-header.component";
import LegalSidebar, {
  LegalSidebarDocLink,
  LegalSidebarGroup,
} from "@/components/legal/legal-sidebar/legal-sidebar.component";
import Link from "next/link";
import { ArrowRight, ChevronRight, FileText } from "lucide-react";
import { LEGAL_PAGE_MAX_WIDTH } from "@/common/constants/legal-layout.constant";
import { LEGAL_CONTENT_PANEL, LEGAL_TWO_PANEL_ROW } from "@/common/utils/legal-content.utils";
import useLegalIndex from "./use-legal-index.hook";

export default function LegalIndexPage({ audience }) {
  const { groups, documentCount, audienceLabel, audienceDescription, isValid } = useLegalIndex({
    audience,
  });

  if (!isValid) {
    return null;
  }

  return (
    <LegalPageShell>
      <LegalDocHeader
        backHref="/"
        backLabel="Back to CleerCut"
        title={`${audienceLabel} legal documents`}
        lastUpdated="June 4, 2026"
        description={audienceDescription}
        meta={`${documentCount} documents`}
      />

      <div className={`mx-auto ${LEGAL_PAGE_MAX_WIDTH} px-3 py-4 sm:px-4 lg:px-6`}>
        <div className={LEGAL_TWO_PANEL_ROW}>
          <LegalSidebar title="Contents">
            {groups.map((group) => (
              <LegalSidebarGroup key={group.id} label={group.title} href={`#${group.id}`}>
                {group.documents.map((item) => (
                  <LegalSidebarDocLink
                    key={item.slug}
                    href={`/legal/${audience}/${item.slug}`}
                  >
                    {item.label}
                  </LegalSidebarDocLink>
                ))}
              </LegalSidebarGroup>
            ))}
          </LegalSidebar>

          <div className={`${LEGAL_CONTENT_PANEL} space-y-5`}>
            {groups.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-28">
                <div className="mb-2 border-b border-gray-100 pb-2">
                  <h2 className="text-sm font-semibold text-gray-900 sm:text-base">{group.title}</h2>
                  <p className="mt-0.5 text-[10px] leading-snug text-gray-500 sm:text-xs">
                    {group.description}
                  </p>
                </div>

                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5">
                  {group.documents.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/legal/${audience}/${item.slug}`}
                        className="group flex h-full items-start gap-2.5 rounded-lg border border-gray-200 bg-white p-2.5 transition-colors hover:border-primary hover:bg-indigo-50/40 sm:p-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary">
                          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-primary">
                            {item.label}
                          </p>
                          <p className="mt-0.5 flex w-full items-center justify-between gap-2 text-[10px] font-medium text-gray-500 group-hover:text-primary sm:text-xs">
                            <span>Read document</span>
                            <ChevronRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <div className="rounded-lg border border-indigo-100 bg-white px-3 py-2.5 sm:px-4">
              <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                Need the other document set?{" "}
                <Link
                  href={`/legal/${audience === "client" ? "creator" : "client"}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  View {audience === "client" ? "Creator" : "Client"} legal documents
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </LegalPageShell>
  );
}
