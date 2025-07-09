import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import useCampaignList from "@/common/hooks/use-campaign-list.hook";
import Niche from "@/components/niche/niche";
import { RefreshRounded } from "@mui/icons-material";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import HireCreatorModal from "../hire-creator-modal/hire-creator-modal.component";
import useCampaignOverview from "./use-campaign-overview.hook";

export default function CampaignOverview() {
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const { options, handleChange } = useCampaignList();
  const { openFilterModal, setOpenFilterModal, messageDialogOpen, setMessageDialogOpen } =
    useCampaignOverview();

  const handleHireClick = () => {
    // You'll need to get the selected creator and campaign data
    setSelectedCreator({
      id: 1,
      name: "Sam Waters",
      email: "sam@example.com",
    });
    setSelectedCampaign({
      title: "Summer Launch Campaign",
      brandName: "Brand Name",
      deliverables: "1 TikTok, 3 Instagram Stories",
      hashtags: "#summer #brand",
      mentions: "@brand",
    });
    setHireModalOpen(true);
  };

  const handleSendOffer = (contractData) => {
    console.log("Contract data:", contractData);
    // Here you'll make API call to backend
    // createContract(contractData);
  };

  const countries = [
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
  ];

  return (
    <div className="w-[23%] border-r flex flex-col bg-white p-4 gap-4 pb-20">
      <SimpleSelect
        placeHolder="Select a campaign"
        options={options}
        isSearchable={true}
        isMulti={false}
        onChange={handleChange}
      />

      <hr />

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Actions</h3>
          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-2">
            <CustomButton
              text="Message"
              onClick={() => setMessageDialogOpen(true)}
              className="btn-primary"
            />
            <CustomButton text="Hire" className="btn-outline" onClick={handleHireClick} />
            <CustomButton text="Reject" className="btn-danger" />
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </h3>

        {/* Follower Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Follower Count</label>
          <div className="flex gap-2">
            <CustomInput type="number" placeholder="Min" />
            <CustomInput type="number" placeholder="Max" />
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600">Minimum Rating</h4>
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            defaultValue="4"
            className="w-full h-1.5 text-primary"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1.0</span>
            <span>5.0</span>
          </div>
        </div>

        {/* Audience Country */}
        <div>
          <SimpleSelect
            placeHolder="Select Audience Country"
            options={countries}
            onChange={() => {}}
          />
        </div>

        {/* See More Button */}
        <button
          onClick={() => setOpenFilterModal(!openFilterModal)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {openFilterModal ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {openFilterModal ? "See Less" : "See More"}
        </button>
      </div>

      <HireCreatorModal
        show={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        creatorData={selectedCreator}
        campaignData={selectedCampaign}
        onSendOffer={handleSendOffer}
      />

      {/* Message Creator Dialog */}
      <Modal
        title={`Message to Sam Waters`}
        show={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        <TextArea label="Your Message" />
        <div className="w-full flex justify-end gap-3">
          <CustomButton
            text="Cancel"
            className="btn-cancel"
            onClick={() => setMessageDialogOpen(false)}
          />

          <CustomButton text="Send Message" className="btn-primary" />
        </div>
      </Modal>

      <Modal title="Apply Filters" show={openFilterModal} onClose={() => setOpenFilterModal(false)}>
        <div className="space-y-6">
          {/* Category Filters */}
          <div className="p-2 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Categories</h4>
            <Niche />
          </div>

          {/* Rating Slider */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Minimum Rating</h4>
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
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Number of Ratings</h4>
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
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Countries</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {["United States", "Canada", "United Kingdom", "Australia"].map((country, idx) => (
                <label key={country} className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-blue-600" defaultChecked={idx < 2} />
                  <span>{country}</span>
                </label>
              ))}
            </div>
            <button className="mt-2 text-blue-600 text-sm hover:underline">+ Show more</button>
          </div>

          {/* Platform Filters */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Social Platforms</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {["Instagram", "TikTok", "YouTube"].map((platform, idx) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-blue-600" defaultChecked={idx < 2} />
                  <span>{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <CustomButton text="Apply Filters" className="w-full btn-primary" />
            <CustomButton text="Reset" className="btn-outline" startIcon={<RefreshRounded />} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
