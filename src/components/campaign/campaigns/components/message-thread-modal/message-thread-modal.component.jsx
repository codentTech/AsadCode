import React, { useState } from "react";
import { X, Send, Phone, Video, MoreHorizontal, Paperclip, Smile, Search } from "lucide-react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import { getUser } from "@/common/utils/users.util";

const MessageThreadModal = ({
  isOpen,
  onClose,
  creator,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  isSending,
  isLoading,
  isCreatorOnline,
  isCreatorTyping,
  messagesEndRef,
  messagesContainerRef,
}) => {
  const user = getUser();

  // Improved Avatar component with better fallback
  const Avatar = ({ src, alt, children, className }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div
        className={`rounded-full flex items-center justify-center text-white font-semibold overflow-hidden border-2 border-white shadow-sm ${className}`}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-semibold text-sm">
            {children}
          </div>
        )}
      </div>
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "SENT":
        return <DoneOutlinedIcon sx={{ fontSize: 15, color: "#9CA3AF" }} />;
      case "DELIVERED":
        return <DoneAllIcon sx={{ fontSize: 15, color: "#9CA3AF" }} />;
      case "SEEN":
        return <DoneAllIcon sx={{ fontSize: 15, color: "#6366F1" }} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[700px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                src={creator?.avatar || creator?.image}
                alt={creator?.name}
                className="w-10 h-10"
              >
                {creator?.name?.[0] || "C"}
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">
                {creator?.name || "Creator"}
              </h3>
              <div className="flex items-center space-x-1">
                {isCreatorOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">Online</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">Offline</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100"
        >
          {/* Loading indicator */}
          {isLoading && (!messages || messages.length === 0) && (
            <div className="flex justify-center items-center h-full">
              <Loader loading={true} />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && (!messages || messages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          )}

          {/* Messages */}
          {messages &&
            messages.length > 0 &&
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
                  300000; // 5 minutes

              return (
                <div key={message.id} className="w-full">
                  {showTimestamp && (
                    <div className="flex justify-center mb-4">
                      <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                        {formatMessageTime(message.created_at)}
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex w-full mb-3 ${isFromBrand ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-end max-w-[75%] ${isFromBrand ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div className={`flex-shrink-0 ${isFromBrand ? "ml-2" : "mr-2"}`}>
                        {showAvatar && !isFromBrand ? (
                          <Avatar
                            src={creator?.avatar || creator?.image}
                            alt={creator?.name}
                            className="w-8 h-8"
                          >
                            {creator?.name?.[0] || "C"}
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex flex-col min-w-0">
                        <div
                          className={`px-4 py-2 rounded-2xl break-words ${
                            isFromBrand
                              ? "bg-primary text-white rounded-br-sm shadow-md"
                              : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content || "Message content"}
                          </p>
                        </div>

                        {/* Message Status and Time */}
                        <div
                          className={`flex items-center mt-1 px-2 ${isFromBrand ? "justify-end" : "justify-start"}`}
                        >
                          <span className="text-xs text-gray-400 mr-1">
                            {new Date(message.created_at).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                          {isFromBrand && (
                            <div className="flex items-center">
                              {getMessageStatusIcon(message.status)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Typing Indicator */}
          {isCreatorTyping && (
            <div className="flex items-end">
              <Avatar
                src={creator?.avatar || creator?.image}
                alt={creator?.name}
                className="w-8 h-8 mr-2 mb-2"
              >
                {creator?.name?.[0] || "C"}
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

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 rounded-b-2xl">
          <div className="flex items-center gap-3 max-w-full">
            {/* Attachment Button */}
            <div className="flex-shrink-0">
              <button className="group relative p-2.5 text-gray-100 hover:text-primary bg-primary rounded-lg transition-all duration-200 hover:scale-105">
                <Paperclip className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>

            {/* Message Input Container */}
            <div className="flex-1 relative">
              <div>
                <CustomInput
                  placeholder="Type your message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSending}
                />

                {/* Emoji Button */}
                <button
                  className="absolute right-3 bottom-1 p-2 text-gray-400 hover:text-primary hover:bg-primary rounded-lg transition-all duration-200 hover:scale-110"
                  type="button"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              {/* Message length indicator (optional) */}
              {newMessage.length > 100 && (
                <div className="absolute -bottom-6 right-0 text-xs text-gray-400">
                  {newMessage.length}/500
                </div>
              )}
            </div>

            {/* Send Button */}
            <div className="flex-shrink-0">
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending}
                className={`relative p-3 rounded-lg transition-all duration-200 ${
                  newMessage.trim() && !isSending
                    ? "bg-primary hover:bg-primary text-white shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div
                    className={`transition-transform duration-200 ${newMessage.trim() ? "rotate-0" : "rotate-45"}`}
                  >
                    <Send className="w-5 h-5 mr-1" />
                  </div>
                )}

                {/* Send button glow effect */}
                {newMessage.trim() && !isSending && (
                  <div className="absolute inset-0 bg-primary rounded-xl blur-sm opacity-30 -z-10 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThreadModal;
