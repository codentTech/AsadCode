import CustomButton from "@/common/components/custom-button/custom-button.component";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar } from "@mui/material";
import { useState } from "react";

export default function ChatList() {
  const [selectedChat, setSelectedChat] = useState("Sam Waters");
  const [activeCategory, setActiveCategory] = useState("Skincare");

  const avatar =
    "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg";

  const categories = ["Skincare", "Makeup", "Fashion", "Nutrition", "Fitness"];

  const chats = [
    {
      name: "Sam Waters",
      message: "Hey, it was great meeting you at event last night!",
      time: "2:32 PM",
      avatar,
      rating: 4.5,
      unread: false,
      selected: true,
      online: true,
    },
    {
      name: "Alex Wong",
      message: "Your latest video is great girl!",
      time: "10:15 AM",
      avatar,
      unread: false,
      online: true,
    },
    {
      name: "Emily Davis",
      message: "Quick question about tonight's event ex I vicevara?",
      time: "Yesterday",
      avatar,
      unread: true,
      online: false,
    },
    {
      name: "Sarah Kim",
      message: "Hey girl, anytips for for pitching to L'Oreal?",
      time: "April 21",
      avatar,
      unread: false,
      online: false,
    },
    {
      name: "kylie anderson",
      message: "Hey girl, anytips for for pitching to L'Oreal?",
      time: "April 21",
      avatar,
      unread: false,
      online: false,
    },
    {
      name: "Kim stone",
      message: "Hey girl, anytips for for pitching to L'Oreal?",
      time: "April 21",
      avatar,
      unread: false,
      online: false,
    },
  ];

  return (
    <div className="w-1/4 border-r flex flex-col overflow-hidden bg-white">
      {/* Search - more prominent */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-sm"
          />
          <SearchIcon className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {/* Categories - cleaner layout */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <CustomButton
              text={category}
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeCategory === category
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Chat list - enhanced with status indicators and better spacing */}
      <div className="overflow-y-auto flex-1">
        {chats.map((chat) => (
          <div
            key={chat.name}
            className={`flex items-center p-3 cursor-pointer transition-all ${
              chat.name === selectedChat
                ? "bg-indigo-50 border-l-4 border-indigo-500"
                : "hover:bg-gray-50 border-l-4 border-transparent"
            }`}
            onClick={() => setSelectedChat(chat.name)}
          >
            <div className="relative flex-shrink-0">
              <Avatar
                src={chat.avatar}
                alt={chat.name}
                className={`h-10 w-10 ${
                  chat.name === selectedChat ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                {chat.name.charAt(0)}
              </Avatar>
              {chat.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-1 ring-white"></span>
              )}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <div className="flex justify-between items-center">
                <span
                  className={`${
                    chat.name === selectedChat
                      ? "font-bold text-indigo-700"
                      : "font-medium text-gray-800"
                  } text-sm truncate max-w-[120px]`}
                >
                  {chat.name}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {chat.time}
                </span>
              </div>
              <div className="flex items-center">
                <p
                  className={`text-xs truncate max-w-[150px] ${
                    chat.unread ? "font-semibold" : "text-gray-500"
                  }`}
                >
                  {chat.message}
                </p>
                {chat.unread && (
                  <span className="ml-1 flex-shrink-0 h-2 w-2 bg-indigo-600 rounded-full"></span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
