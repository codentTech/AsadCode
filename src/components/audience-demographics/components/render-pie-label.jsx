export function renderPieLabel({ cx, cy, midAngle, outerRadius, name, value }) {
  const RADIAN = Math.PI / 180;
  const labelRadius = outerRadius + 22;
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#111827"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      <tspan x={x} y={y - 5} display="block">
        {name}
      </tspan>
      <tspan x={x} y={y + 7} display="block">
        {value}%
      </tspan>
    </text>
  );
}
