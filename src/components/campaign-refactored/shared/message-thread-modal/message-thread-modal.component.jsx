import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import EmojiPicker from "emoji-picker-react";
import {
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  MoreHorizontal,
  Phone,
  Search,
  Smile,
  Video,
  X,
} from "lucide-react";
import MessageTemplatesModal from "../message-templates-modal/message-templates-modal.component";
import MessageThreadMessagesList from "./components/message-thread-messages-list.component";
import MessageThreadMessagesSkeleton from "./components/message-thread-messages-skeleton.component";
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
  showTemplatesModal,
  openTemplatesModal,
  closeTemplatesModal,
  handleTemplateSelect,
  creatorFirstName,
  showTemplatesButton,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
      <div className="flex h-[92svh] max-h-[92svh] w-[94vw] max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl sm:h-[700px] sm:max-h-[700px] sm:w-full">
        <div className="flex items-center justify-between border-b bg-white p-2.5 sm:rounded-t-lg sm:p-4">
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
              <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                {creator?.name || "Creator"}
              </h3>
              <div className="flex items-center space-x-1">
                {isCreatorOnline ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-[10px] text-gray-500 sm:text-sm">Online</span>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-400 sm:text-sm">Offline</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-0.5 sm:space-x-1">
            <button
              type="button"
              className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:p-2"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              className="hidden rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:inline-flex"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="hidden rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:inline-flex"
            >
              <Video className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="hidden rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:inline-flex"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-1 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 sm:ml-2 sm:p-2"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex flex-1 flex-col space-y-3 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-2.5 sm:space-y-4 sm:p-4"
        >
          {isLoading && (!messages || messages.length === 0) ? (
            <div className="flex min-h-[240px] flex-1 flex-col justify-center">
              <MessageThreadMessagesSkeleton />
            </div>
          ) : null}

          {!isLoading && (!messages || messages.length === 0) ? (
            <div className="flex h-full flex-col items-center justify-center text-gray-500">
              <p className="text-sm font-medium sm:text-lg">No messages yet</p>
              <p className="text-xs sm:text-sm">Start the conversation!</p>
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

        <div className="relative border-t bg-white p-2.5 sm:p-4">
          {attachmentPreview ? (
            <div className="mb-3 flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center space-x-3">
                {attachmentPreview.mimetype.startsWith("image/") ? (
                  <>
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-medium sm:text-sm">{attachmentPreview.filename}</p>
                      <p className="text-xs text-gray-500">
                        {(attachmentPreview.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-medium sm:text-sm">{attachmentPreview.filename}</p>
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
              className="absolute bottom-full left-2.5 z-[60] mb-2 rounded-lg border border-gray-200 bg-white shadow-2xl sm:left-4"
            >
              <EmojiPicker
                onEmojiClick={(emojiData) => handleEmojiClick?.(emojiData)}
                width={300}
                height={360}
              />
            </div>
          ) : null}

          <div className="flex min-h-10 items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 sm:min-h-11">
            {fileInputRef ? (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect ?? undefined}
                className="hidden"
              />
            ) : null}

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => openFilePicker?.()}
                disabled={isUploading || typeof openFilePicker !== "function"}
                title="Attach file"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-200 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-8"
              >
                {isUploading ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent sm:h-4 sm:w-4" />
                ) : (
                  <AttachFileIcon sx={{ fontSize: 17 }} />
                )}
              </button>
              <button
                ref={emojiButtonRef}
                type="button"
                onClick={handleToggleEmojiClick}
                title="Emoji"
                className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors sm:h-8 sm:w-8 ${
                  actualShowEmojiPicker
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-gray-200 bg-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-200 hover:text-primary"
                }`}
              >
                <Smile className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
              </button>
              {showTemplatesButton ? (
                <button
                  type="button"
                  onClick={openTemplatesModal}
                  title="Templates"
                  className="flex h-7 items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-1.5 text-primary transition-colors hover:border-primary/30 hover:bg-primary/15 sm:h-8 sm:px-2"
                >
                  <LayoutTemplate className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={1.75} />
                  <span className="text-[10px] font-semibold leading-none sm:text-xs">Templates</span>
                </button>
              ) : null}
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              className="min-w-0 flex-1 bg-transparent px-1.5 py-2 text-sm leading-snug focus:outline-none sm:px-2 sm:py-2.5 sm:text-base"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress ?? undefined}
              disabled={isSending || isUploading}
            />
            <div className="shrink-0 pr-0.5">
              <button
                type="button"
                className={`flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                  (newMessage.trim() || attachmentPreview) && !isSending && !isUploading
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-200 text-gray-400"
                }`}
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !attachmentPreview) || isSending || isUploading}
              >
                {isSending ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-4 sm:w-4" />
                ) : (
                  <SendIcon fontSize="small" className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <MessageTemplatesModal
        isOpen={showTemplatesModal}
        onClose={closeTemplatesModal}
        onSelectTemplate={handleTemplateSelect}
        creatorName={creatorFirstName}
      />
    </div>
  );
};

export default MessageThreadModal;
