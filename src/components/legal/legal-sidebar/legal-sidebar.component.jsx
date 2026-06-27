import Link from "next/link";
import { LEGAL_SIDEBAR_WIDTH } from "@/common/utils/legal-content.utils";

export default function LegalSidebar({ title, children }) {
  return (
    <aside className={LEGAL_SIDEBAR_WIDTH}>
      <div className="sticky top-3 overflow-hidden rounded-lg border border-indigo-100 bg-white shadow-sm">
        <div className="border-b border-indigo-100 bg-indigo-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
            {title}
          </p>
        </div>
        <nav className="legal-sidebar-scroll max-h-[calc(100vh-5.5rem)] overflow-y-auto px-2 py-2">
          {children}
        </nav>
      </div>
    </aside>
  );
}

export function LegalSidebarGroup({ label, href, children }) {
  return (
    <div className="mb-3 last:mb-0">
      <a
        href={href}
        className="mb-1 block px-2 text-[10px] font-semibold uppercase tracking-wide text-primary transition-colors hover:text-indigo-700 sm:text-xs"
      >
        {label}
      </a>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

export function LegalSidebarLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        className="block rounded-md border-l-2 border-transparent px-2.5 py-1.5 text-[10px] leading-snug text-gray-600 transition-colors hover:border-primary hover:bg-indigo-50 hover:text-primary sm:text-xs"
      >
        {children}
      </a>
    </li>
  );
}

export function LegalSidebarDocLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-md border-l-2 border-transparent px-2.5 py-1.5 text-[10px] leading-snug text-gray-700 transition-colors hover:border-primary hover:bg-indigo-50 hover:text-primary sm:text-xs"
      >
        {children}
      </Link>
    </li>
  );
}
