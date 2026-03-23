import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Search,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";
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
  // Emoji props
  showEmojiPicker,
  toggleEmojiPicker,
  handleEmojiClick,
  // Attachment props
  isUploading,
  attachmentPreview,
  handleFileSelect,
  removeAttachment,
  openFilePicker,
  fileInputRef,
}) => {
  const user = getUser();

  // Fallback emoji state if not provided by hook
  const [localShowEmojiPicker, setLocalShowEmojiPicker] = useState(false);
  const actualShowEmojiPicker =
    showEmojiPicker !== undefined ? showEmojiPicker : localShowEmojiPicker;

  // Refs for click outside
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  // Handle click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actualShowEmojiPicker &&
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setLocalShowEmojiPicker(false);
      }
    };

    if (actualShowEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actualShowEmojiPicker]);

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

  // Render message content based on type
  const renderMessageContent = (message) => {
    if (message.message_type === "IMAGE" && message.attachment_url) {
      return (
        <div className="space-y-2">
          <img
            src={message.attachment_url}
            alt="Attachment"
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.attachment_url, "_blank")}
          />
          {message.content && <p className="text-sm">{message.content}</p>}
        </div>
      );
    }

    if (message.message_type === "FILE" && message.attachment_url) {
      return (
        <div className="space-y-2">
          <a
            href={message.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{message.content}</span>
          </a>
        </div>
      );
    }

    return <p className="text-sm leading-relaxed">{message.content}</p>;
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
                          {renderMessageContent(message)}
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

        {/* Message Input - Chat Inbox Style */}
        <div className="p-4 bg-white border-t relative">
          {/* Attachment Preview */}
          {attachmentPreview && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {attachmentPreview.mimetype.startsWith("image/") ? (
                  <>
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{attachmentPreview.filename}</p>
                      <p className="text-xs text-gray-500">
                        {(attachmentPreview.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{attachmentPreview.filename}</p>
                      <p className="text-xs text-gray-500">
                        {(attachmentPreview.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={removeAttachment}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {actualShowEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full left-4 mb-2 z-[60] shadow-2xl bg-white rounded-lg border border-gray-200"
            >
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  const emoji = emojiData.emoji || emojiData.native || emojiData;
                  // Use the setNewMessage function properly
                  if (typeof setNewMessage === "function") {
                    setNewMessage((prev) => prev + emoji);
                  } else {
                    // Fallback: directly update the input value
                    const input = document.querySelector(
                      'input[placeholder="Type your message..."]'
                    );
                    if (input) {
                      input.value = input.value + emoji;
                      // Trigger change event
                      const event = new Event("input", { bubbles: true });
                      input.dispatchEvent(event);
                    }
                  }
                  setLocalShowEmojiPicker(false);
                }}
                width={350}
                height={400}
              />
            </div>
          )}

          <div className="flex items-center p-1 bg-gray-50 rounded-lg border border-gray-200">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex px-2">
              <IconButton
                size="small"
                className="text-gray-500 hover:text-primary"
                onClick={openFilePicker}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <AttachFileIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                ref={emojiButtonRef}
                size="small"
                className="text-gray-500 hover:text-primary"
                onClick={() => {
                  if (toggleEmojiPicker) {
                    toggleEmojiPicker();
                  } else {
                    setLocalShowEmojiPicker((prev) => !prev);
                  }
                }}
              >
                <EmojiEmotionsIcon fontSize="small" />
              </IconButton>
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending || isUploading}
            />
            <div className="pr-2">
              <button
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  (newMessage.trim() || attachmentPreview) && !isSending && !isUploading
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-200 text-gray-400"
                }`}
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !attachmentPreview) || isSending || isUploading}
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <SendIcon fontSize="small" className="h-4 w-4" />
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
