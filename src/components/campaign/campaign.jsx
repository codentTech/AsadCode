// pages/index.js
import CustomButton from "@/common/components/custom-button/custom-button.component";
import {
  AddCircle,
  ArrowForward,
  Delete,
  EmailOutlined,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Rating,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useCampaign from "./use-campaign";
import Modal from "@/common/components/modal/modal.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import DeleteIconRed from "@/common/icons/deletered.icon";
import PlusIconBlack from "@/common/icons/plus-icon-black";
import EmailInput from "@/common/components/send-email-modal/component/email-input";
import TextArea from "@/common/components/text-area/text-area.component";

// Social media icons mapping
const PlatformIcons = {
  instagram: <InstagramIcon />,
  youtube: <YouTubeIcon />,
  tiktok: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
};

export default function Campaign() {
  const {
    activeTab,
    setActiveTab,
    mainTabs,
    mockNicheCategories,
    mockShortlists,
    sortOptions,
  } = useCampaign();
  // State for navigation tabs
  const [navValue, setNavValue] = useState(0);

  // State for shortlists
  const [shortlists, setShortlists] = useState(mockShortlists);
  const [selectedShortlist, setSelectedShortlist] = useState(null);
  const [isNewShortlistDialogOpen, setIsNewShortlistDialogOpen] =
    useState(false);
  const [newShortlistName, setNewShortlistName] = useState("");

  // State for creator preview
  const [previewCreator, setPreviewCreator] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // State for shortlist sort option
  const [sortOption, setSortOption] = useState("followers");

  // State for shortlist save modal
  const [saveToShortlistDialogOpen, setSaveToShortlistDialogOpen] =
    useState(false);
  const [creatorToSave, setCreatorToSave] = useState(null);

  // State for message dialog
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [creatorToMessage, setCreatorToMessage] = useState(null);
  const [messageText, setMessageText] = useState("");

  // Handle navigation tab change
  const handleNavChange = (event, newValue) => {
    setNavValue(newValue);
  };

  // Handle shortlist selection
  const handleShortlistSelect = (shortlist) => {
    setSelectedShortlist(shortlist);
  };

  // Handle new shortlist creation
  const handleCreateShortlist = () => {
    if (newShortlistName.trim()) {
      const newShortlist = {
        id: shortlists.length + 1,
        name: newShortlistName,
        creators: [],
      };
      setShortlists([...shortlists, newShortlist]);
      setNewShortlistName("");
      setIsNewShortlistDialogOpen(false);
    }
  };

  // Handle creator preview
  const handleCreatorPreview = (creator) => {
    setPreviewCreator(creator);
    setIsPreviewOpen(true);
  };

  // Handle adding creator to shortlist
  const handleSaveToShortlist = (creator) => {
    setCreatorToSave(creator);
    setSaveToShortlistDialogOpen(true);
  };

  // Confirm adding creator to selected shortlist
  const confirmSaveToShortlist = (shortlistId) => {
    const updatedShortlists = shortlists.map((shortlist) => {
      if (shortlist.id === shortlistId) {
        // Check if creator is already in shortlist
        if (!shortlist.creators.some((c) => c.id === creatorToSave.id)) {
          return {
            ...shortlist,
            creators: [...shortlist.creators, creatorToSave],
          };
        }
      }
      return shortlist;
    });

    setShortlists(updatedShortlists);
    setSaveToShortlistDialogOpen(false);
  };

  // Handle removing creator from shortlist
  const handleRemoveFromShortlist = (creatorId) => {
    if (!selectedShortlist) return;

    const updatedShortlists = shortlists.map((shortlist) => {
      if (shortlist.id === selectedShortlist.id) {
        return {
          ...shortlist,
          creators: shortlist.creators.filter(
            (creator) => creator.id !== creatorId
          ),
        };
      }
      return shortlist;
    });

    setShortlists(updatedShortlists);

    // Update selected shortlist reference
    const updatedSelectedShortlist = updatedShortlists.find(
      (s) => s.id === selectedShortlist.id
    );
    setSelectedShortlist(updatedSelectedShortlist);
  };

  // Handle messaging a creator
  const handleMessageCreator = (creator) => {
    setCreatorToMessage(creator);
    setMessageDialogOpen(true);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    // Message sending logic would go here
    console.log(`Message to ${creatorToMessage?.name}: ${messageText}`);
    setMessageText("");
    setMessageDialogOpen(false);
  };

  // Sort creators in the selected shortlist
  const getSortedCreators = () => {
    if (!selectedShortlist) return [];

    return [...selectedShortlist.creators].sort((a, b) => {
      switch (sortOption) {
        case "followers":
          return b.followers - a.followers;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "engagement":
          return b.engagementRate - a.engagementRate;
        default:
          return b.followers - a.followers;
      }
    });
  };

  // Update the selected shortlist when shortlists change
  useEffect(() => {
    if (selectedShortlist) {
      const updatedShortlist = shortlists.find(
        (s) => s.id === selectedShortlist.id
      );
      setSelectedShortlist(updatedShortlist);
    }
  }, [shortlists]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top navigation - streamlined and modern */}
      <div className="py-3 flex items-center bg-white border-b">
        <nav className="hidden md:flex">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 py-2 mx-1 text-sm font-bold transition-all relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex w-full h-[calc(100vh-48px)]">
        {/* Left Column - Shortlists Sidebar */}
        <div className="w-64 flex flex-col gap-3 bg-white p-4 border-r border-gray-200 overflow-y-auto shadow-md">
          <h3
            className="cursor-pointer"
            onClick={() => setSelectedShortlist("")}
          >
            Shortlists
          </h3>
          <hr />
          <ul>
            {shortlists.map((shortlist) => (
              <li
                key={shortlist.id}
                onClick={() => handleShortlistSelect(shortlist)}
                className={`cursor-pointer text-sm px- py-2 mb-2 rounded-lg transition-colors duration-200 ${
                  selectedShortlist?.id === shortlist.id
                    ? "bg-blue-50 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {shortlist.name}
              </li>
            ))}
          </ul>

          <CustomButton
            text="Create New Shortlist"
            className="btn-primary w-full"
            startIcon={<AddCircle />}
            onClick={() => setIsNewShortlistDialogOpen(true)}
          />
        </div>

        {/* Center Column - Discovery Feed or Shortlist View */}
        <div className="flex-1 p-3 overflow-y-auto">
          {selectedShortlist ? (
            /* Shortlist View */
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1>{selectedShortlist.name}</h1>

                <SimpleSelect
                  placeHolder="Select an option"
                  options={sortOptions}
                  className="w-full max-w-[200px]"
                />
              </div>

              {getSortedCreators().length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-gray-500">
                    No creators in this shortlist yet. Browse the Discover+ feed
                    to add creators.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {getSortedCreators().map((creator) => (
                    <div
                      key={creator.id}
                      className="w-full rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-100"
                      onClick={() => handleCreatorPreview(creator)}
                    >
                      <div className="p-4">
                        <div className="flex flex-col items-center">
                          <img
                            src={creator.profileImage}
                            alt={creator.name}
                            className="w-16 h-16 rounded-full mb-3 object-cover"
                          />

                          <h4 className="text-base font-medium text-gray-800">
                            {creator.name}
                          </h4>
                          <p className="text-sm text-gray-500 text-center">
                            {creator.location}
                          </p>

                          <div className="flex items-center mt-1 text-yellow-400 text-sm">
                            {"★".repeat(Math.floor(creator.rating))}
                            {"☆".repeat(5 - Math.floor(creator.rating))}
                          </div>

                          <p className="text-sm text-gray-500 mt-1">
                            {creator.followers.toLocaleString()} followers
                          </p>

                          <div className="flex justify-center space-x-2 mt-2 text-gray-600 text-md">
                            {creator.platforms.map((platform) => (
                              <span key={platform}>
                                {PlatformIcons[platform] || platform}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-center items-center gap-2 mt-3 w-full">
                            <div
                              onClick={() =>
                                handleRemoveFromShortlist(creator.id)
                              }
                            >
                              <DeleteIconRed />
                            </div>
                            <PlusIconBlack />
                            <div
                              className="ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMessageCreator(creator);
                              }}
                            >
                              <EmailOutlined sx={{ color: "gray" }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Default Discovery View - Netflix-style categorized rows */
            <div>
              <h1 className="mb-3">Discover Creators</h1>
              {mockNicheCategories.map((category) => (
                <div key={category.id} className="mb-10">
                  <div className="flex justify-between items-center mb-3">
                    <h4>{category.name}</h4>
                    <div className="text-primary text-sm hover:underline font-medium flex items-center gap-1">
                      See More
                      <span>
                        <ArrowForward sx={{ size: "10px" }} />
                      </span>
                    </div>
                  </div>

                  <div className="flex overflow-x-auto space-x-4 pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                    {category.creators.map((creator) => (
                      <div
                        key={creator.id}
                        className="flex-shrink-0 w-52 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-100"
                        onClick={() => handleCreatorPreview(creator)}
                      >
                        <div className="p-4">
                          <div className="flex flex-col items-center">
                            <img
                              src={creator.profileImage}
                              alt={creator.name}
                              className="w-16 h-16 rounded-full mb-3 object-cover"
                            />

                            <h4>{creator.name}</h4>
                            <p className="text-sm text-gray-500 text-center">
                              {creator.location}
                            </p>

                            <div className="flex items-center mt-1 text-yellow-400 text-sm">
                              {"★".repeat(Math.floor(creator.rating))}
                              {"☆".repeat(5 - Math.floor(creator.rating))}
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              {creator.followers.toLocaleString()} followers
                            </p>

                            <div className="flex justify-center space-x-2 mt-2 text-gray-600 text-md">
                              {creator.platforms.map((platform) => (
                                <span key={platform}>
                                  {PlatformIcons[platform] || platform}
                                </span>
                              ))}
                            </div>

                            <div className="flex justify-center mt-3 w-full">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveToShortlist(creator);
                                }}
                                className="px-1 rounded-full text-blue-600 hover:bg-blue-50 transition"
                                title="Save"
                              >
                                🔖
                              </button>

                              <button
                                className="px-1 rounded-full text-green-600 hover:bg-green-50 transition"
                                title="Add"
                              >
                                ➕
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessageCreator(creator);
                                }}
                                className="px-1 rounded-full text-purple-600 hover:bg-purple-50 transition"
                                title="Message"
                              >
                                ✉️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Shortlist Dialog */}
      <Modal
        title="Create New Shortlist"
        show={isNewShortlistDialogOpen}
        onClose={() => setIsNewShortlistDialogOpen(false)}
      >
        <CustomInput
          label="Shortlist Name"
          placeholder="Enter shortlist name"
          value={newShortlistName}
          onChange={(e) => setNewShortlistName(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-3">
          <CustomButton
            onClick={() => setIsNewShortlistDialogOpen(false)}
            text="Cancel"
            className="btn-cancel"
          ></CustomButton>
          <CustomButton onClick={handleCreateShortlist} text="Create" />
        </div>
      </Modal>

      {/* Creator Preview Dialog */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {previewCreator && (
          <>
            <DialogTitle className="flex justify-between items-center">
              <Typography variant="h6">Creator Preview</Typography>
              <IconButton onClick={() => setIsPreviewOpen(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <div className="flex flex-col">
                <div className="bg-gray-200 w-full h-32 mb-4 rounded-md relative">
                  {/* Cover photo placeholder */}
                  <Avatar
                    src={previewCreator.profileImage}
                    alt={previewCreator.name}
                    className="absolute -bottom-6 left-4 w-20 h-20 border-4 border-white"
                  />
                </div>

                <div className="pt-8 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="h5" className="font-bold">
                        {previewCreator.name}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {previewCreator.location}
                      </Typography>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        <Rating
                          value={previewCreator.rating}
                          readOnly
                          precision={0.5}
                        />
                        <Typography variant="body2" className="ml-1">
                          ({previewCreator.reviewCount} reviews)
                        </Typography>
                      </div>
                      <Typography variant="body2">
                        {previewCreator.followers.toLocaleString()} followers
                      </Typography>
                      <div className="flex justify-end space-x-2 mt-1">
                        {previewCreator.platforms.map((platform) => (
                          <span key={platform} className="text-gray-600">
                            {PlatformIcons[platform]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Typography variant="body1" className="mt-4">
                    {previewCreator.bio}
                  </Typography>

                  <Typography variant="h6" className="font-bold mt-6 mb-3">
                    Portfolio Highlights
                  </Typography>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="bg-gray-200 h-36 rounded-md flex items-center justify-center"
                      >
                        <Typography variant="body2" className="text-gray-600">
                          Video {item}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  <Typography variant="h6" className="font-bold mt-6 mb-3">
                    Audience Demographics
                  </Typography>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-md">
                      <Typography variant="subtitle2" className="font-bold">
                        Age Distribution
                      </Typography>
                      <div className="h-32 flex items-center justify-center">
                        <Typography variant="body2" className="text-gray-500">
                          Age distribution chart
                        </Typography>
                      </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <Typography variant="subtitle2" className="font-bold">
                        Gender Split
                      </Typography>
                      <div className="h-32 flex items-center justify-center">
                        <Typography variant="body2" className="text-gray-500">
                          Gender distribution chart
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <Typography variant="h6" className="font-bold mt-6 mb-3">
                    Recent Reviews
                  </Typography>
                  <div className="space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="bg-gray-100 p-4 rounded-md">
                        <div className="flex justify-between">
                          <Typography variant="subtitle2" className="font-bold">
                            Brand {item}
                          </Typography>
                          <Rating
                            value={4.5}
                            readOnly
                            size="small"
                            precision={0.5}
                          />
                        </div>
                        <Typography variant="body2" className="mt-1">
                          "Great to work with! Very professional and delivered
                          on time."
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
              <Button variant="contained" color="primary">
                View Full Profile
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Save to Shortlist Dialog */}
      <Modal
        title="Save to Shortlist"
        show={saveToShortlistDialogOpen}
        onClose={() => setSaveToShortlistDialogOpen(false)}
      >
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {shortlists.map((shortlist) => (
            <li key={shortlist.id}>
              <button
                className="w-full p-2 border border-gray-200 hover:border-primary hover:bg-indigo-50 rounded-lg cursor-pointer transition-all flex items-center"
                onClick={() => confirmSaveToShortlist(shortlist.id)}
              >
                {shortlist.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-3">
          <CustomButton
            text="Cancel"
            className="btn-cancel"
            onClick={() => setSaveToShortlistDialogOpen(false)}
          />
        </div>
      </Modal>

      {/* Message Creator Dialog */}
      <Modal
        title={`Message to ${creatorToMessage?.name}`}
        show={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        {creatorToMessage && (
          <>
            <TextArea
              label="Your Message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div className="w-full flex flex-end gap-3">
              <CustomButton
                text="Cancel"
                className="btn-cancel"
                onClick={() => setMessageDialogOpen(false)}
              />

              <CustomButton text="Send Message" onClick={handleSendMessage} />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
