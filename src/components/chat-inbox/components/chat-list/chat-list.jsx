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
import Niche from "@/components/niche/niche";
import useCampaignList from "@/common/hooks/use-campaign-list.hook";

export default function ChatList({ isCreatorMode, activeTab, selectedChatId, setSelectedChatId }) {
  const {
    filterOptions,
    chats,
    activeFilter,
    setActiveFilter,
    openFilterModal,
    setOpenFilterModal,
    isLoading,
    searchQuery,
    setSearchQuery,
    filters,
    handleFilterChange,
    handleCheckboxFilter,
    handleNicheChange,
    handleResetFilters,
    handleApplyFilters,
    activeFilterCount,
  } = useChatList(selectedChatId, setSelectedChatId);

  const { options, handleChange } = useCampaignList();

  return (
    <div className="w-1/4 border-r flex flex-col overflow-hidden bg-white">
      {[3, 5].includes(activeTab) && !isCreatorMode && (
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

      {[1, 2, 3].includes(activeTab) && !isCreatorMode && (
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {[3, 4, 5].includes(activeTab) && !isCreatorMode && (
          <div className="relative">
            <CustomButton
              startIcon={<FilterListAltIcon />}
              text="Filters"
              className="btn-outline"
              onClick={() => setOpenFilterModal(true)}
            />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="p-2 bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-primary hover:text-primary-dark hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {filters.categories.length > 0 && (
              <span className="px-2 py-0.5 bg-white text-xs rounded-full border border-primary text-primary">
                {filters.categories[0]}
              </span>
            )}
            {filters.minRating > 1 && (
              <span className="px-2 py-0.5 bg-white text-xs rounded-full border border-primary text-primary">
                Rating: {filters.minRating.toFixed(1)}+
              </span>
            )}
            {filters.minRatingCount > 0 && (
              <span className="px-2 py-0.5 bg-white text-xs rounded-full border border-primary text-primary">
                Reviews: {filters.minRatingCount}+
              </span>
            )}
            {filters.countries.length > 0 && (
              <span className="px-2 py-0.5 bg-white text-xs rounded-full border border-primary text-primary">
                {filters.countries.length} countr{filters.countries.length > 1 ? "ies" : "y"}
              </span>
            )}
            {filters.platforms.length > 0 && (
              <span className="px-2 py-0.5 bg-white text-xs rounded-full border border-primary text-primary">
                {filters.platforms.length} platform{filters.platforms.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Chat list - enhanced with status indicators and better spacing */}
      <div className="overflow-y-auto flex-1 py-2">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
            <p className="text-sm text-center">
              {searchQuery ? "No conversations found matching your search" : "No conversations yet"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-primary text-xs hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-3 cursor-pointer transition-all ${
                chat.id === selectedChatId
                  ? "bg-secondary-light-blue border-l-4 border-primary"
                  : chat.unread
                    ? "bg-secondary-light-blue"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
              }`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div className="relative flex-shrink-0">
                <Avatar
                  src={chat.avatar}
                  alt={chat.name}
                  className={`h-10 w-10 ${chat.id === selectedChatId ? "ring-2 ring-primary" : ""}`}
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
                      chat.id === selectedChatId
                        ? "font-bold text-primary-700"
                        : "font-medium text-gray-800"
                    } text-sm truncate max-w-[120px]`}
                  >
                    {chat.name}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{chat.time}</span>
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
          ))
        )}
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
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Categories</h4>
                <Niche
                  onNicheChange={handleNicheChange}
                  selectedNiche={filters.categories.length > 0 ? filters.categories[0] : "all"}
                />
              </div>
            )}

            {/* Rating Slider */}
            <div className="bg-white border rounded-lg p-2 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Minimum Rating: {filters.minRating.toFixed(1)}
              </h4>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => handleFilterChange("minRating", parseFloat(e.target.value))}
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
                Minimum Reviews: {filters.minRatingCount}
              </h4>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minRatingCount}
                onChange={(e) => handleFilterChange("minRatingCount", parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>100+</span>
              </div>
            </div>

            {/* Country Filters */}
            <div className="bg-white border rounded-lg p-2 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Countries</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                {["United States", "Canada", "United Kingdom", "Australia"].map((country) => (
                  <label key={country} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={filters.countries.includes(country)}
                      onChange={(e) => handleCheckboxFilter("countries", country, e.target.checked)}
                    />
                    <span>{country}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Platform Filters */}
            <div className="bg-white border rounded-lg p-2 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Social Platforms</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                {["Instagram", "TikTok", "YouTube"].map((platform) => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={filters.platforms.includes(platform)}
                      onChange={(e) =>
                        handleCheckboxFilter("platforms", platform, e.target.checked)
                      }
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
                onClick={handleApplyFilters}
              />
              <CustomButton
                text="Reset"
                className="btn-outline"
                startIcon={<RefreshRounded />}
                onClick={handleResetFilters}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
