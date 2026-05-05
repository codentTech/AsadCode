export default function CustomLegend({ items }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-gray-600">
            {item.percentage != null ? `${item.percentage}%` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
