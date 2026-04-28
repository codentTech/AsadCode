import {
  X,
  Phone,
  Video,
  MoreHorizontal,
  Search,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";
import MessageThreadMessagesSkeleton from "./components/message-thread-messages-skeleton.component";
import MessageThreadMessagesList from "./components/message-thread-messages-list.component";
import MessageThreadModalAvatar from "./components/message-thread-modal-avatar/message-thread-modal-avatar.component";

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
  user,
  actualShowEmojiPicker,
  emojiPickerRef,
  emojiButtonRef,
  handleKeyPress,
  handleToggleEmojiClick,
  formatMessageTime,
  handleEmojiClick,
  isUploading,
  attachmentPreview,
  handleFileSelect,
  removeAttachment,
  openFilePicker,
  fileInputRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex h-[700px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between rounded-t-2xl border-b bg-white p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MessageThreadModalAvatar
                src={creator?.avatar || creator?.image}
                alt={creator?.name}
                className="h-10 w-10"
              >
                {creator?.name?.[0] || "C"}
              </MessageThreadModalAvatar>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {creator?.name || "Creator"}
              </h3>
              <div className="flex items-center space-x-1">
                {isCreatorOnline ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-500">Online</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">Offline</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <Video className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 rounded-full p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex flex-1 flex-col space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4"
        >
          {isLoading && (!messages || messages.length === 0) ? (
            <div className="flex min-h-[240px] flex-1 flex-col justify-center">
              <MessageThreadMessagesSkeleton />
            </div>
          ) : null}

          {!isLoading && (!messages || messages.length === 0) ? (
            <div className="flex h-full flex-col items-center justify-center text-gray-500">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : null}

          {messages && messages.length > 0 ? (
            <MessageThreadMessagesList
              messages={messages}
              user={user}
              creator={creator}
              formatMessageTime={formatMessageTime}
            />
          ) : null}

          {isCreatorTyping ? (
            <div className="flex items-end">
              <MessageThreadModalAvatar
                src={creator?.avatar || creator?.image}
                alt={creator?.name}
                className="mb-2 mr-2 h-8 w-8"
              >
                {creator?.name?.[0] || "C"}
              </MessageThreadModalAvatar>
              <div className="rounded-2xl rounded-bl-none border border-gray-100 bg-white p-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200" />
                </div>
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="relative border-t bg-white p-4">
          {attachmentPreview ? (
            <div className="mb-3 flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center space-x-3">
                {attachmentPreview.mimetype.startsWith("image/") ? (
                  <>
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{attachmentPreview.filename}</p>
                      <p className="text-xs text-gray-500">
                        {(attachmentPreview.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 text-primary" />
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
                type="button"
                onClick={() => removeAttachment?.()}
                className="rounded-full p-1 transition-colors hover:bg-gray-200"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ) : null}

          {actualShowEmojiPicker ? (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full left-4 z-[60] mb-2 rounded-lg border border-gray-200 bg-white shadow-2xl"
            >
              <EmojiPicker
                onEmojiClick={(emojiData) => handleEmojiClick?.(emojiData)}
                width={350}
                height={400}
              />
            </div>
          ) : null}

          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
            {fileInputRef ? (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect ?? undefined}
                className="hidden"
              />
            ) : null}

            <div className="flex px-2">
              <IconButton
                size="small"
                className="text-gray-500 hover:text-primary"
                onClick={() => openFilePicker?.()}
                disabled={isUploading || typeof openFilePicker !== "function"}
              >
                {isUploading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <AttachFileIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                ref={emojiButtonRef}
                size="small"
                className="text-gray-500 hover:text-primary"
                onClick={handleToggleEmojiClick}
              >
                <EmojiEmotionsIcon fontSize="small" />
              </IconButton>
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress ?? undefined}
              disabled={isSending || isUploading}
            />
            <div className="pr-2">
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  (newMessage.trim() || attachmentPreview) && !isSending && !isUploading
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-200 text-gray-400"
                }`}
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !attachmentPreview) || isSending || isUploading}
              >
                {isSending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
