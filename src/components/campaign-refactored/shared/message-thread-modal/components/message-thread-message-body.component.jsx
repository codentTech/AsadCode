import { FileText } from "lucide-react";

const MessageThreadMessageBody = ({ message }) => {
  if (message.message_type === "IMAGE" && message.attachment_url) {
    return (
      <div className="space-y-2">
        <img
          src={message.attachment_url}
          alt="Attachment"
          className="max-w-[220px] cursor-pointer rounded-lg transition-opacity hover:opacity-90 sm:max-w-xs"
          onClick={() => window.open(message.attachment_url, "_blank")}
        />
        {message.content ? <p className="text-[11px] sm:text-sm">{message.content}</p> : null}
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
          className="flex items-center space-x-2 rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200"
        >
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-[11px] font-medium sm:text-sm">{message.content}</span>
        </a>
      </div>
    );
  }

  return <p className="text-[11px] leading-relaxed sm:text-sm">{message.content}</p>;
};

export default MessageThreadMessageBody;
