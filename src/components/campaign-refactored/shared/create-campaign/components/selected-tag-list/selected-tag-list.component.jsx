import { X } from "lucide-react";

function SelectedTagList({ label = "Selected:", items = [], onRemove }) {
  if (!items.length) return null;

  return (
    <div className="space-y-1">
      <h5 className="text-xs font-semibold text-gray-600">{label}</h5>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 rounded-lg border border-primary bg-gray-100 px-2 py-1 text-xs text-gray-700"
          >
            {item.label}
            {onRemove ? (
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="rounded p-0.5 text-gray-500 hover:bg-white hover:text-black"
                aria-label={`Remove ${item.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SelectedTagList;
