export default function AudienceEmptyState({ message = "No data available" }) {
  return (
    <div className="flex min-h-[40px] items-center justify-center">
      <p className="text-center text-sm text-gray-500">{message}</p>
    </div>
  );
}
