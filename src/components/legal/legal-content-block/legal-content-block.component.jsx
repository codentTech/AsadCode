import Link from "next/link";
import { parseLegalInlineContent } from "@/common/utils/legal-content.utils";

const TEXT_CLASS = "text-[10px] leading-relaxed text-gray-700 sm:text-xs md:text-sm";
const LINK_CLASS = "font-medium text-primary underline underline-offset-2 hover:text-indigo-800";

function LegalInlineText({ text }) {
  return parseLegalInlineContent(text).map((part, index) => {
    if (part.type === "link") {
      return (
        <Link
          key={`${part.href}-${index}`}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {part.value}
        </Link>
      );
    }

    return <span key={`text-${index}`}>{part.value}</span>;
  });
}

export default function LegalContentBlock({ block }) {
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-primary/70">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`} className={TEXT_CLASS}>
            <LegalInlineText text={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className={TEXT_CLASS}>
      <LegalInlineText text={block.text} />
    </p>
  );
}
