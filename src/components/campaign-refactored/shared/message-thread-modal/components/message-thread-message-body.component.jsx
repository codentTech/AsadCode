import { FileText } from "lucide-react";
import { getSafeMediaUrl } from "@/common/utils/url.util";

const messageTextClassName =
  "whitespace-pre-wrap break-words text-[11px] leading-relaxed sm:text-sm";

const MessageThreadMessageBody = ({ message }) => {
  const safeAttachmentUrl = getSafeMediaUrl(message.attachment_url);

  if (message.message_type === "IMAGE" && safeAttachmentUrl) {
    return (
      <div className="space-y-2">
        <img
          src={safeAttachmentUrl}
          alt="Attachment"
          className="max-w-[220px] cursor-pointer rounded-lg transition-opacity hover:opacity-90 sm:max-w-xs"
          onClick={() => window.open(safeAttachmentUrl, "_blank")}
        />
        {message.content ? (
          <div className={messageTextClassName}>{message.content}</div>
        ) : null}
      </div>
    );
  }

  if (message.message_type === "FILE" && safeAttachmentUrl) {
    return (
      <div className="space-y-2">
        <a
          href={safeAttachmentUrl}
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

  return <div className={messageTextClassName}>{message.content}</div>;
};

export default MessageThreadMessageBody;
