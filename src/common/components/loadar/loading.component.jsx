export default function Loading({ height = 8, width = 8 }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex items-center justify-center">
        <div
          className={`animate-spin rounded-full h-${height} w-${width} border-b-2 border-blue-600`}
        ></div>
      </div>
    </div>
  );
}
