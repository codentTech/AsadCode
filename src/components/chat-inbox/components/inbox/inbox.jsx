import {
  InfoOutlined as InfoOutlinedIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
} from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

function Inbox() {
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");

  const avatar =
    "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg";

  // Simulate typing indicator
  useEffect(() => {
    // const interval = setInterval(() => {
    //   setIsTyping(prev => !prev);
    // }, 3000);
    // return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Logic to send message would go here
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Chat header - improved layout */}
      <div className="py-3 px-4 border-b bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <div className="relative">
            <Avatar
              src={avatar}
              alt="Sam Waters"
              className="h-10 w-10 border-2 border-white shadow-sm"
            >
              S
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-1 ring-white"></span>
          </div>
          <div className="ml-3">
            <div className="font-bold text-gray-800">Sam Waters</div>
            <div className="flex items-center">
              <div className="text-yellow-500 text-xs mr-1">★★★★½</div>
              <span className="text-xs text-gray-500">4.5</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <IconButton
            size="small"
            className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Messages - improved layout and design */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
          <div className="flex items-end">
            <Avatar src={avatar} alt="Sam Waters" className="h-8 w-8 mr-2 mb-2">
              S
            </Avatar>
            <div className="max-w-xs">
              <div className="bg-white rounded-2xl rounded-bl-none py-2 px-3 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-800">
                  Hey, it was great meeting you at the event last night! As you
                  were saying, we definitely should collab together for a
                  morning run video soon!
                </p>
              </div>
              <span className="text-xs text-gray-500 ml-2 mt-1">2:32 PM</span>
            </div>
          </div>

          <div className="flex items-end">
            <Avatar src={avatar} alt="Sam Waters" className="h-8 w-8 mr-2 mb-2">
              S
            </Avatar>
            <div className="max-w-xs">
              <div className="bg-white rounded-2xl rounded-bl-none py-2 px-3 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-800">
                  I think a lot of my followers would follow you and vice versa!
                </p>
              </div>
              <span className="text-xs text-gray-500 ml-2 mt-1">2:33 PM</span>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-xs">
              <div className="bg-primary text-white rounded-2xl rounded-br-none py-2 px-3 shadow-sm">
                <p className="text-sm">
                  That sounds amazing! I'd love to collab on a morning routine
                  video. My followers are always asking about my workout
                  schedule.
                </p>
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-gray-500 mr-2 mt-1">2:35 PM</span>
              </div>
            </div>
          </div>

          {isTyping && (
            <div className="flex items-end">
              <Avatar
                src={avatar}
                alt="Sam Waters"
                className="h-8 w-8 mr-2 mb-2"
              >
                S
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
            <IconButton
              size="small"
              className="text-gray-500 hover:text-indigo-500"
            >
              <AttachFileIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              className="text-gray-500 hover:text-indigo-500"
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
          />
          <div className="pr-2">
            <button
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                message.trim()
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-400"
              }`}
              onClick={handleSendMessage}
              disabled={!message.trim()}
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
