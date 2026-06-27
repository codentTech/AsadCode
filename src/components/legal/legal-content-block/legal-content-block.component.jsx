export default function LegalContentBlock({ block }) {
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-primary/70">
        {block.items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="text-[10px] leading-relaxed text-gray-700 sm:text-xs md:text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="text-[10px] leading-relaxed text-gray-700 sm:text-xs md:text-sm">{block.text}</p>
  );
}
