import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Avatar, IconButton, Menu, MenuItem, Checkbox } from "@mui/material";
import { avatar as defaultAvatar } from "@/common/constants/auth.constant";
import useInbox from "./use-inbox";
import Loader from "@/common/components/loader/loader.component";
import EmojiPicker from "emoji-picker-react";
import { useRef, useEffect, useState } from "react";
import { FileText, Image as ImageIcon, X, Trash2 } from "lucide-react";
import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";

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
    // Emoji
    showEmojiPicker,
    setShowEmojiPicker,
    toggleEmojiPicker,
    handleEmojiClick,
    // Attachments
    isUploading,
    attachmentPreview,
    handleFileSelect,
    removeAttachment,
    openFilePicker,
    fileInputRef,
    // Message selection and deletion
    selectionMode,
    setSelectionMode,
    selectedMessages,
    toggleMessageSelection,
    selectAllMessages,
    clearSelection,
    deleteSelectedMessages,
    deleteSingleMessage,
    clearConversationHandler,
    deleteConversationHandler,
    showOptionsMenu,
    setShowOptionsMenu,
    // Confirmation modals
    showClearChatModal,
    setShowClearChatModal,
    showDeleteConversationModal,
    setShowDeleteConversationModal,
  } = useInbox(selectedChatId);

  // Local state for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [messageMenuAnchor, setMessageMenuAnchor] = useState(null);
  const [selectedMessageForMenu, setSelectedMessageForMenu] = useState(null);

  // Refs for click outside
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  // Handle click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, setShowEmojiPicker]);

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
        <div className="flex items-center space-x-2">
          {selectionMode ? (
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-700">
                {selectedMessages.length} selected
              </span>
              <div className="h-4 w-px bg-gray-300"></div>
              <button
                onClick={selectAllMessages}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Select All
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <button
                onClick={deleteSelectedMessages}
                disabled={selectedMessages.length === 0}
                className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <button
                onClick={clearSelection}
                className="text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <IconButton
              size="small"
              className="text-gray-600 hover:text-primary hover:bg-indigo-50"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 3,
          style: {
            minWidth: 180,
            borderRadius: 8,
            marginTop: 8,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setSelectionMode(true);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          Select Messages
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowClearChatModal(true);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          Clear Chat
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowDeleteConversationModal(true);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            px: 2,
            color: "#ef4444",
            "&:hover": {
              backgroundColor: "#fef2f2",
            },
          }}
        >
          Delete Conversation
        </MenuItem>
      </Menu>

      {/* Message Context Menu */}
      <Menu
        anchorEl={messageMenuAnchor}
        open={Boolean(messageMenuAnchor)}
        onClose={() => {
          setMessageMenuAnchor(null);
          setSelectedMessageForMenu(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 3,
          style: {
            minWidth: 150,
            borderRadius: 8,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedMessageForMenu) {
              deleteSingleMessage(selectedMessageForMenu);
            }
            setMessageMenuAnchor(null);
            setSelectedMessageForMenu(null);
          }}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            px: 2,
            color: "#ef4444",
            "&:hover": {
              backgroundColor: "#fef2f2",
            },
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Messages - improved layout and design */}
      <div className="flex-1 p-6 overflow-y-auto messages-container">
        <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
          {conversationMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            conversationMessages.map((msg) => {
              const isMyMessage = msg.sender.id === user?.id;
              const isSelected = selectedMessages.includes(msg.id);

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMyMessage ? "justify-end" : "items-end"} group relative`}
                >
                  {/* Selection checkbox */}
                  {selectionMode && (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleMessageSelection(msg.id)}
                      size="small"
                      className="mr-2"
                      sx={{
                        padding: "4px",
                        color: "#6366f1",
                        "&.Mui-checked": {
                          color: "#6366f1",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 18,
                        },
                      }}
                    />
                  )}

                  {!isMyMessage && !selectionMode && (
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
                      } py-2 px-3 shadow-sm ${isSelected ? "ring-2 ring-primary" : ""} ${
                        isMyMessage && !selectionMode ? "cursor-context-menu" : ""
                      }`}
                      onContextMenu={(e) => {
                        if (isMyMessage && !selectionMode) {
                          e.preventDefault();
                          setMessageMenuAnchor(e.currentTarget);
                          setSelectedMessageForMenu(msg.id);
                        }
                      }}
                    >
                      {renderMessageContent(msg)}
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
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full left-4 mb-2 z-[60] shadow-2xl bg-white rounded-lg border border-gray-200"
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} width={350} height={400} />
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
              onClick={toggleEmojiPicker}
            >
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
            disabled={isSending || isUploading}
          />
          <div className="pr-2">
            <button
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                (message.trim() || attachmentPreview) && !isSending && !isUploading
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-200 text-gray-400"
              }`}
              onClick={handleSendMessage}
              disabled={(!message.trim() && !attachmentPreview) || isSending || isUploading}
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

      {/* Clear Chat Confirmation Modal */}
      <ConfirmationModal
        show={showClearChatModal}
        close={() => setShowClearChatModal(false)}
        onConfirm={clearConversationHandler}
        onCancel={() => setShowClearChatModal(false)}
        img="/assets/images/delete-icon.svg"
        message="Clear Chat?"
        messageStyling="mt-6 text-xl font-semibold text-gray-900"
        content="Are you sure you want to clear all messages in this conversation? This action cannot be undone."
        contentStyling="mt-2 text-sm text-gray-600 text-center max-w-sm"
        cancelText="Cancel"
        confirmText="Clear Chat"
        cancelTextStyling="btn-secondary"
        confirmTextStyling="btn-danger"
      />

      {/* Delete Conversation Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteConversationModal}
        close={() => setShowDeleteConversationModal(false)}
        onConfirm={deleteConversationHandler}
        onCancel={() => setShowDeleteConversationModal(false)}
        img="/assets/images/delete-icon.svg"
        message="Delete Conversation?"
        messageStyling="mt-6 text-xl font-semibold text-gray-900"
        content="Are you sure you want to delete this entire conversation? This action cannot be undone."
        contentStyling="mt-2 text-sm text-gray-600 text-center max-w-sm"
        cancelText="Cancel"
        confirmText="Delete"
        cancelTextStyling="btn-secondary"
        confirmTextStyling="btn-danger"
      />
    </div>
  );
}

export default Inbox;
