import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, IconButton } from "@mui/material";
import { avatar as defaultAvatar } from "@/common/constants/auth.constant";
import useInbox from "./use-inbox";
import Loader from "@/common/components/loader/loader.component";

function Inbox({ selectedChatId }) {
  const {
    message,
    setMessage,
    handleSendMessage,
    handleKeyPress,
    conversationMessages,
    currentConversation,
    otherUser,
    isOtherUserOnline,
    isOtherUserTyping,
    isLoading,
    isSending,
    formatMessageTime,
    getMessageStatusIcon,
    user,
  } = useInbox(selectedChatId);

  // Show loading or empty state
  if (!selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader loading={true} />
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Conversation not found</p>
        </div>
      </div>
    );
  }

  const otherUserAvatar =
    otherUser.creator_profile?.profile_photo_url ||
    otherUser.brand_profile?.logo_url ||
    defaultAvatar;

  const otherUserName =
    `${otherUser.first_name || ""} ${otherUser.last_name || ""}`.trim() || "User";

  const otherUserRating = otherUser.creator_profile?.rating || 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Chat header - improved layout */}
      <div className="py-3 px-4 border-b bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <div className="relative">
            <Avatar
              src={otherUserAvatar}
              alt={otherUserName}
              className="h-10 w-10 border-2 border-white shadow-sm"
            >
              {otherUserName.charAt(0)}
            </Avatar>
            {isOtherUserOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-1 ring-white"></span>
            )}
          </div>
          <div className="ml-3">
            <div className="font-bold text-gray-800">{otherUserName}</div>
            {otherUserRating > 0 && (
              <div className="flex items-center">
                <div className="text-yellow-500 text-xs mr-1">
                  {"★".repeat(Math.floor(otherUserRating))}
                  {otherUserRating % 1 >= 0.5 ? "½" : ""}
                </div>
                <span className="text-xs text-gray-500">{otherUserRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <IconButton size="small" className="text-gray-600 hover:text-primary hover:bg-indigo-50">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Messages - improved layout and design */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
          {conversationMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            conversationMessages.map((msg) => {
              const isMyMessage = msg.sender.id === user?.id;

              return (
                <div key={msg.id} className={`flex ${isMyMessage ? "justify-end" : "items-end"}`}>
                  {!isMyMessage && (
                    <Avatar src={otherUserAvatar} alt={otherUserName} className="h-8 w-8 mr-2 mb-2">
                      {otherUserName.charAt(0)}
                    </Avatar>
                  )}
                  <div className="max-w-xs">
                    <div
                      className={`${
                        isMyMessage
                          ? "bg-primary text-white rounded-2xl rounded-br-none"
                          : "bg-white rounded-2xl rounded-bl-none border border-gray-100"
                      } py-2 px-3 shadow-sm`}
                    >
                      <p className={`text-sm ${isMyMessage ? "text-white" : "text-gray-800"}`}>
                        {msg.content}
                      </p>
                    </div>
                    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                      <span className="text-xs text-gray-500 mx-2 mt-1">
                        {formatMessageTime(msg.created_at)}
                        {isMyMessage && getMessageStatusIcon(msg) && (
                          <span
                            className={`ml-1 ${msg.status === "SEEN" ? "text-primary" : "text-gray-400"}`}
                          >
                            {getMessageStatusIcon(msg)}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isOtherUserTyping && (
            <div className="flex items-end">
              <Avatar src={otherUserAvatar} alt={otherUserName} className="h-8 w-8 mr-2 mb-2">
                {otherUserName.charAt(0)}
              </Avatar>
              <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message input - enhanced design */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center p-1 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex px-2">
            <IconButton size="small" className="text-gray-500 hover:text-primary">
              <AttachFileIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" className="text-gray-500 hover:text-primary">
              <EmojiEmotionsIcon fontSize="small" />
            </IconButton>
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
          />
          <div className="pr-2">
            <button
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                message.trim() && !isSending
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-200 text-gray-400"
              }`}
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
            >
              <SendIcon fontSize="small" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inbox;
