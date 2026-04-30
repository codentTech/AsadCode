import MessageThreadModalAvatar from "./message-thread-modal-avatar/message-thread-modal-avatar.component";
import MessageThreadMessageBody from "./message-thread-message-body.component";
import MessageThreadMessageStatusIcon from "./message-thread-message-status-icon.component";

const MessageThreadMessagesList = ({ messages, user, creator, formatMessageTime }) =>
  messages.map((message, index) => {
    const senderId = message.sender?.id || message.sender_id || message.senderId;
    const currentUserId = user?.id;
    const senderRole = (message.sender?.role || message.sender_role || "").toUpperCase();
    const currentUserRole = (user?.role || "").toUpperCase();
    const isOwnById =
      senderId != null &&
      currentUserId != null &&
      String(senderId) === String(currentUserId);
    const isOwnByRole =
      !isOwnById && senderRole && currentUserRole
        ? senderRole === currentUserRole
        : false;
    const isOwnMessage = isOwnById || isOwnByRole;
    const showAvatar =
      !isOwnMessage &&
      (index === messages.length - 1 ||
        (messages[index + 1]?.sender?.id ||
          messages[index + 1]?.sender_id ||
          messages[index + 1]?.senderId) !== senderId);
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

        <div className={`mb-3 flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
          <div
            className={`flex max-w-[88%] items-end sm:max-w-[75%] ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`flex-shrink-0 ${isOwnMessage ? "ml-1.5 sm:ml-2" : "mr-1.5 sm:mr-2"}`}>
              {showAvatar && !isOwnMessage ? (
                <MessageThreadModalAvatar
                  src={creator?.avatar || creator?.image}
                  alt={creator?.name}
                  className="h-8 w-8"
                >
                  {creator?.name?.[0] || "C"}
                </MessageThreadModalAvatar>
              ) : (
                <div className="h-7 w-7 sm:h-8 sm:w-8" />
              )}
            </div>

            <div className="flex min-w-0 flex-col">
              <div
                className={`break-words rounded-2xl px-2.5 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-sm ${
                  isOwnMessage
                    ? "rounded-br-sm bg-primary text-white shadow-md"
                    : "rounded-bl-sm border border-gray-200 bg-white text-gray-900 shadow-sm"
                }`}
              >
                <MessageThreadMessageBody message={message} />
              </div>

              <div
                className={`mt-1 flex items-center px-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <span className="mr-1 text-[10px] text-gray-400 sm:text-xs">
                  {new Date(message.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                {isOwnMessage ? (
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
