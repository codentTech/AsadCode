export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const name = payload[0].payload?.name ?? payload[0].name ?? label;
    return (
      <div className="flex bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-indigo-600 font-bold">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
}
