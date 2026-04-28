const ROW_KEYS = ["a", "b", "c", "d", "e", "f", "g"];

const MessageThreadMessagesSkeleton = () => (
  <div className="flex w-full flex-col gap-4 py-3" aria-hidden>
    {ROW_KEYS.map((key, index) => (
      <div
        key={key}
        className={`flex w-full ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
      >
        <div
          className={`h-11 max-w-[72%] animate-pulse rounded-2xl bg-gray-200/90 ${
            index % 2 === 0 ? "ml-1 w-[58%] rounded-bl-md" : "mr-1 w-[48%] rounded-br-md"
          }`}
        />
      </div>
    ))}
  </div>
);

export default MessageThreadMessagesSkeleton;
