import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SearchIcon from "@/common/icons/search-icon";
import { Avatar } from "@mui/material";
import useChatList from "./use-chat-list";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";

export default function ChatList({ isCreaterInbox, activeTab }) {
  const {
    categories,
    filterOptions,
    chats,
    selectedChat,
    setSelectedChat,
    activeCategory,
    setActiveCategory,
    options,
    handleChange,
    activeFilter,
    setActiveFilter,
  } = useChatList();

  return (
    <div className="w-1/4 border-r flex flex-col overflow-hidden bg-white">
      {/* Categories - cleaner layout */}
      {![1, 2, 3].includes(activeTab) && (
        <div className="p-2 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CustomButton
                text={category}
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-1 py-1 rounded-lg text-[10px] font-medium transition-all ${
                  activeCategory === category
                    ? "bg-secondary-light-blue text-primary"
                    : "bg-gray-200 text-gray-700 border border-gray-800 hover:border-primary hover:text-primary"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {[3, 5].includes(activeTab) && !isCreaterInbox && (
        <div className="p-2 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <CustomButton
                text={filter}
                key={filter}
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev.includes(filter)
                      ? prev.filter((f) => f !== filter)
                      : [...prev, filter]
                  )
                }
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                  activeFilter.includes(filter)
                    ? "bg-secondary-light-blue text-primary"
                    : "bg-gray-200 text-gray-700 border border-gray-300 hover:border-primary hover:text-primary"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {[3, 4, 5].includes(activeTab) && !isCreaterInbox && (
        <div className="w-full pt-2 px-[14px]">
          <CustomButton
            startIcon={<FilterListAltIcon />}
            text="Apply more filters"
            className="w-full btn-outline"
          />
        </div>
      )}

      {[1, 2, 3].includes(activeTab) && !isCreaterInbox && (
        <div>
          <div className="p-[14px]">
            <SimpleSelect
              placeHolder="Select an option"
              options={options}
              isSearchable={true}
              isMulti={false}
              onChange={handleChange}
            />
          </div>
          <hr />
        </div>
      )}

      {/* Search - more prominent */}
      <div className="p-4 border-b">
        <div className="relative">
          <CustomInput
            type="text"
            name="search"
            placeholder="Search conversations..."
            startIcon={<SearchIcon />}
            className="!h-9"
          />
        </div>
      </div>

      {/* Chat list - enhanced with status indicators and better spacing */}
      <div className="overflow-y-auto flex-1 py-2">
        {chats.map((chat) => (
          <div
            key={chat.name}
            className={`flex items-center p-3 cursor-pointer transition-all ${
              chat.name === selectedChat
                ? "bg-secondary-light-blue border-l-4 border-primary"
                : chat.unread
                  ? "bg-secondary-light-blue"
                  : "hover:bg-gray-50 border-l-4 border-transparent"
            }`}
            onClick={() => setSelectedChat(chat.name)}
          >
            <div className="relative flex-shrink-0">
              <Avatar
                src={chat.avatar}
                alt={chat.name}
                className={`h-10 w-10 ${
                  chat.name === selectedChat ? "ring-2 ring-primary" : ""
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
                      ? "font-bold text-primary-700"
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
                  {chat.me && (
                    <>
                      {chat.online && !chat.unread ? (
                        <DoneAllIcon sx={{ fontSize: 15 }} color="primary" />
                      ) : chat.online && chat.unread ? (
                        <DoneAllIcon sx={{ fontSize: 15 }} />
                      ) : (
                        <DoneOutlinedIcon sx={{ fontSize: 15 }} />
                      )}{" "}
                    </>
                  )}
                  {chat.message}
                </p>
                {chat.unread && (
                  <span className="ml-1 flex-shrink-0 h-2 w-2 bg-primary rounded-full"></span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
