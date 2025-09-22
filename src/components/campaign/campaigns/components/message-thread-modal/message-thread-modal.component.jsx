import React, { useState, useEffect, useRef } from "react";
import { X, Send, Phone, Video, MoreHorizontal, Paperclip, Smile, Search } from "lucide-react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CustomInput from "@/common/components/custom-input/custom-input.component";

const MessageThreadModal = ({ isOpen, onClose, creator }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Mock data for demonstration
  useEffect(() => {
    if (isOpen) {
      loadInitialMessages();
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  const loadInitialMessages = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockMessages = [
      {
        id: 0,
        text: "Thanks for accepting our collaboration proposal! We're excited to work with you.",
        sender: "brand",
        timestamp: "2025-01-14T16:00:00Z",
        status: "read",
      },
      {
        id: 1,
        text: "Hi Sam! Looking forward to working with you on this campaign. When can we schedule a call to discuss the details?",
        sender: "brand",
        timestamp: "2025-01-15T10:00:00Z",
        status: "read",
      },
      {
        id: 2,
        text: "Hello! Great to connect with you. I'm available for a call tomorrow afternoon or Thursday morning. What works best for your schedule?",
        sender: "creator",
        timestamp: "2025-01-15T10:30:00Z",
        status: "read",
      },
      {
        id: 3,
        text: "Perfect! Let's do Thursday morning at 10 AM. I'll send you the meeting link shortly.",
        sender: "brand",
        timestamp: "2025-01-15T11:00:00Z",
        status: "read",
      },
      {
        id: 4,
        text: "Sounds great! I'll be ready. Also, I had a few creative ideas for the Instagram video that I'd love to share with you during our call.",
        sender: "creator",
        timestamp: "2025-01-15T11:15:00Z",
        status: "read",
      },
      {
        id: 5,
        text: "That's exactly what I was hoping to hear! Your creativity is why we chose to work with you. See you Thursday!",
        sender: "brand",
        timestamp: "2025-01-15T11:20:00Z",
        status: "read",
      },
      {
        id: 6,
        text: "Just finished recording the first draft of the Instagram video! It turned out better than expected. I'll send you the preview link in a few minutes.",
        sender: "creator",
        timestamp: "2025-01-18T14:30:00Z",
        status: "read",
      },
      {
        id: 7,
        text: "Wow! I just watched it and it's absolutely perfect! The lighting, the messaging, everything is spot on. No revisions needed - this is exactly what we envisioned.",
        sender: "brand",
        timestamp: "2025-01-18T15:45:00Z",
        status: "delivered",
      },
    ];

    setMessages(mockMessages);
    setIsLoading(false);
    scrollToBottom();
  };

  const loadMoreMessages = async () => {
    if (!hasMoreMessages || isLoading) return;

    setIsLoading(true);
    // Simulate loading older messages
    await new Promise((resolve) => setTimeout(resolve, 800));

    const olderMessages = [
      {
        id: -1,
        text: "Welcome to the campaign! Let's create something amazing together.",
        sender: "brand",
        timestamp: "2025-01-14T15:00:00Z",
        status: "read",
      },
    ];

    setMessages((prev) => [...olderMessages, ...prev]);
    setHasMoreMessages(false); // No more messages to load
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: "brand",
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setIsSending(true);
    scrollToBottom();

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessages((prev) =>
      prev.map((msg) => (msg.id === message.id ? { ...msg, status: "delivered" } : msg))
    );
    setIsSending(false);

    // Simulate read after delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === message.id ? { ...msg, status: "read" } : msg))
      );
    }, 2000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMoreMessages) {
      loadMoreMessages();
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
      case "sending":
        return (
          <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
        );
      case "delivered":
        return <DoneOutlinedIcon sx={{ fontSize: 15, color: "#9CA3AF" }} />;
      case "read":
        return <DoneAllIcon sx={{ fontSize: 15, color: "#6366F1" }} />;
      default:
        return null;
    }
  };

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
      handleSendMessage();
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
              <Avatar src={creator?.avatar} alt={creator?.name} className="w-10 h-10">
                {creator?.name?.[0] || "S"}
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">
                {creator?.name || "Sam Waters"}
              </h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Online</span>
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
          onScroll={handleScroll}
        >
          {/* Loading indicator for older messages */}
          {isLoading && hasMoreMessages && (
            <div className="flex justify-center py-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading messages...</span>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => {
            const isFromBrand = message.sender === "brand";
            const showAvatar =
              !isFromBrand &&
              (index === messages.length - 1 || messages[index + 1]?.sender !== message.sender);
            const showTimestamp =
              index === 0 ||
              new Date(message.timestamp).getTime() -
                new Date(messages[index - 1].timestamp).getTime() >
                300000; // 5 minutes

            return (
              <div key={message.id} className="w-full">
                {showTimestamp && (
                  <div className="flex justify-center mb-4">
                    <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                      {formatMessageTime(message.timestamp)}
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
                        <Avatar src={creator?.avatar} alt={creator?.name} className="w-8 h-8">
                          {creator?.name?.[0] || "S"}
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
                          {message.text || "Message content"}
                        </p>
                      </div>

                      {/* Message Status and Time */}
                      <div
                        className={`flex items-center mt-1 px-2 ${isFromBrand ? "justify-end" : "justify-start"}`}
                      >
                        <span className="text-xs text-gray-400 mr-1">
                          {new Date(message.timestamp).toLocaleTimeString("en-US", {
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
                  onChange={(e) => setNewMessage(e.target.value)}
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
                onClick={handleSendMessage}
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
