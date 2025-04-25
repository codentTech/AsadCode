import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SearchIcon from "@/common/icons/search-icon";
import { Avatar } from "@mui/material";
import useChatList from "./use-chat-list";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import Modal from "@/common/components/modal/modal.component";
import { RefreshRounded } from "@mui/icons-material";

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
    openFilterModal,
    setOpenFilterModal,
  } = useChatList();

  return (
    <div className="w-1/4 border-r flex flex-col overflow-hidden bg-white">
      {[3, 5].includes(activeTab) && !isCreaterInbox && (
        <div className="bg-white border-b px-4">
          <div className="flex space-x-4 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-all ${
                  activeFilter === option
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-primary hover:border-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {[1, 2, 3].includes(activeTab) && !isCreaterInbox && (
        <div>
          <div className="p-2">
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
      <div className="flex justify-between gap-2 p-2 border-b">
        <div className="w-full relative">
          <CustomInput
            type="text"
            name="search"
            placeholder="Search conversations..."
            startIcon={<SearchIcon />}
            className="!h-[36px]"
          />
        </div>
        {[3, 4, 5].includes(activeTab) && !isCreaterInbox && (
          <CustomButton
            startIcon={<FilterListAltIcon />}
            text="Filters"
            className="btn-outline"
            onClick={() => setOpenFilterModal(true)}
          />
        )}
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

      {openFilterModal && (
        <Modal
          title="Apply Filters"
          show={openFilterModal}
          onClose={() => setOpenFilterModal(false)}
        >
          <div className="space-y-6">
            {/* Category Filters */}
            {![1, 2].includes(activeTab) && (
              <div className="p-2 bg-gray-50 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <CustomButton
                      key={category}
                      text={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-1 rounded-md text-xs font-medium border transition-all ${
                        activeCategory === category
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rating Slider */}
            <div className="bg-white border rounded-lg p-2 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Minimum Rating
              </h4>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                defaultValue="4"
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1.0</span>
                <span>5.0</span>
              </div>
            </div>

            {/* Number of Ratings Slider */}
            <div className="bg-white border rounded-lg p-2 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Number of Ratings
              </h4>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                defaultValue="20"
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>100+</span>
              </div>
            </div>

            {/* Country Filters */}
            <div className="bg-white border rounded-lg p-2 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Countries
              </h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                {["United States", "Canada", "United Kingdom", "Australia"].map(
                  (country, idx) => (
                    <label
                      key={country}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        className="accent-blue-600"
                        defaultChecked={idx < 2}
                      />
                      <span>{country}</span>
                    </label>
                  )
                )}
              </div>
              <button className="mt-2 text-blue-600 text-sm hover:underline">
                + Show more
              </button>
            </div>

            {/* Platform Filters */}
            <div className="bg-white border rounded-lg p-2 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Social Platforms
              </h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                {["Instagram", "TikTok", "YouTube"].map((platform, idx) => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      defaultChecked={idx < 2}
                    />
                    <span>{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <CustomButton
                text="Apply Filters"
                className="w-full btn-primary"
              />
              <CustomButton
                text="Reset"
                className="btn-outline"
                startIcon={<RefreshRounded />}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
