import MessageThreadModalAvatar from "./message-thread-modal-avatar/message-thread-modal-avatar.component";
import MessageThreadMessageBody from "./message-thread-message-body.component";
import MessageThreadMessageStatusIcon from "./message-thread-message-status-icon.component";

const MessageThreadMessagesList = ({ messages, user, creator, formatMessageTime }) =>
  messages.map((message, index) => {
    const isFromBrand = message.sender?.id === user?.id;
    const showAvatar =
      !isFromBrand &&
      (index === messages.length - 1 ||
        messages[index + 1]?.sender?.id !== message.sender?.id);
    const showTimestamp =
      index === 0 ||
      new Date(message.created_at).getTime() -
        new Date(messages[index - 1].created_at).getTime() >
        300000;

    return (
      <div key={message.id} className="w-full">
        {showTimestamp ? (
          <div className="mb-4 flex justify-center">
            <div className="rounded-full border bg-white px-3 py-1 text-xs text-gray-500 shadow-sm">
              {formatMessageTime(message.created_at)}
            </div>
          </div>
        ) : null}

        <div className={`mb-3 flex w-full ${isFromBrand ? "justify-end" : "justify-start"}`}>
          <div
            className={`flex max-w-[75%] items-end ${isFromBrand ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`flex-shrink-0 ${isFromBrand ? "ml-2" : "mr-2"}`}>
              {showAvatar && !isFromBrand ? (
                <MessageThreadModalAvatar
                  src={creator?.avatar || creator?.image}
                  alt={creator?.name}
                  className="h-8 w-8"
                >
                  {creator?.name?.[0] || "C"}
                </MessageThreadModalAvatar>
              ) : (
                <div className="h-8 w-8" />
              )}
            </div>

            <div className="flex min-w-0 flex-col">
              <div
                className={`break-words rounded-2xl px-4 py-2 ${
                  isFromBrand
                    ? "rounded-br-sm bg-primary text-white shadow-md"
                    : "rounded-bl-sm border border-gray-200 bg-white text-gray-900 shadow-sm"
                }`}
              >
                <MessageThreadMessageBody message={message} />
              </div>

              <div
                className={`mt-1 flex items-center px-2 ${isFromBrand ? "justify-end" : "justify-start"}`}
              >
                <span className="mr-1 text-xs text-gray-400">
                  {new Date(message.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                {isFromBrand ? (
                  <div className="flex items-center">
                    <MessageThreadMessageStatusIcon status={message.status} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

export default MessageThreadMessagesList;
