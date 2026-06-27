import LegalPageShell from "@/components/legal/legal-page-shell/legal-page-shell.component";
import LegalDocHeader from "@/components/legal/legal-doc-header/legal-doc-header.component";
import LegalSidebar, {
  LegalSidebarLink,
} from "@/components/legal/legal-sidebar/legal-sidebar.component";
import LegalContentBlock from "@/components/legal/legal-content-block/legal-content-block.component";
import { LEGAL_PAGE_MAX_WIDTH } from "@/common/constants/legal-layout.constant";
import { LEGAL_CONTENT_PANEL, LEGAL_TWO_PANEL_ROW } from "@/common/utils/legal-content.utils";
import useLegalDocument from "./use-legal-document.hook";

export default function LegalDocumentPage({ audience, doc }) {
  const { document, formattedSections, isValid, backHref, audienceLabel, audienceDescription } =
    useLegalDocument({
      audience,
      doc,
    });

  if (!isValid || !document) {
    return null;
  }

  return (
    <LegalPageShell>
      <LegalDocHeader
        backHref={backHref}
        backLabel={`All ${audienceLabel} legal documents`}
        title={document.title}
        lastUpdated={document.lastUpdated}
        description={audienceDescription}
      />

      <div className={`mx-auto ${LEGAL_PAGE_MAX_WIDTH} px-3 py-4 sm:px-4 lg:px-6`}>
        <div className={LEGAL_TWO_PANEL_ROW}>
          <LegalSidebar title="On this page">
            <ul className="space-y-0.5">
              {formattedSections.map((section) => (
                <LegalSidebarLink key={section.id} href={`#${section.id}`}>
                  {section.heading}
                </LegalSidebarLink>
              ))}
            </ul>
          </LegalSidebar>

          <article className={`${LEGAL_CONTENT_PANEL} rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:p-5`}>
            <div className="space-y-5">
              {formattedSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                >
                  <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                    {section.heading}
                  </h2>
                  <div className="mt-2.5 space-y-2">
                    {section.blocks.map((block, blockIndex) => (
                      <LegalContentBlock key={`${section.id}-${blockIndex}`} block={block} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </LegalPageShell>
  );
}
