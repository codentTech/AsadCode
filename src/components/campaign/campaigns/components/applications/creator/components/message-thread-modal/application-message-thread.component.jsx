import MessageThreadModal from "../../../../message-thread-modal/message-thread-modal.component";
import useApplicationMessageThread from "./use-application-message-thread.hook";

const ApplicationMessageThread = ({ brandId, onClose, application }) => {
  const { handleClose, brand, ...messageThreadProps } = useApplicationMessageThread(
    brandId,
    application,
    onClose
  );

  return (
    <MessageThreadModal
      isOpen={messageThreadProps.isModalOpen}
      onClose={handleClose}
      creator={brand}
      messages={messageThreadProps.messages || []}
      newMessage={messageThreadProps.newMessage || ""}
      setNewMessage={messageThreadProps.setNewMessage}
      sendMessage={messageThreadProps.sendMessage}
      isSending={messageThreadProps.isSending}
      isLoading={messageThreadProps.isLoading}
      isCreatorOnline={messageThreadProps.isCreatorOnline}
      isCreatorTyping={messageThreadProps.isCreatorTyping}
      messagesEndRef={messageThreadProps.messagesEndRef}
      messagesContainerRef={messageThreadProps.messagesContainerRef}
      showEmojiPicker={messageThreadProps.showEmojiPicker}
      toggleEmojiPicker={messageThreadProps.toggleEmojiPicker}
      handleEmojiClick={messageThreadProps.handleEmojiClick}
      isUploading={messageThreadProps.isUploading}
      attachmentPreview={messageThreadProps.attachmentPreview}
      handleFileSelect={messageThreadProps.handleFileSelect}
      removeAttachment={messageThreadProps.removeAttachment}
      openFilePicker={messageThreadProps.openFilePicker}
      fileInputRef={messageThreadProps.fileInputRef}
    />
  );
};

export default ApplicationMessageThread;

