import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import ReadMore from "@/common/components/readmore/readmore.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Avatar } from "@mui/material";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import CampaignHistory from "../campaign-history/campaign-history.component";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({ isCompleted = false }) => {
  const { messageDialogOpen, setMessageDialogOpen } = useDeliverablesProgress();

  return (
    <div className="w-1/4 bg-white flex flex-col border h-screen pb-20">
      {/* Sticky Profile Section */}
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-2 top-0 bg-white z-10">
        <div className="relative">
          <Avatar
            src={avatar}
            alt="Sam Waters"
            className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
          >
            S
          </Avatar>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
          {isCompleted && (
            <span className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </span>
          )}
        </div>
        <h3>Sam Waters</h3>

        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(4) ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Los Angeles, CA</span>
        </div>
        <p className="primary-text text-center">
          Fitness and lifestyle creator based in Los Angeles
        </p>
        {isCompleted && (
          <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Campaign Completed
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-col overflow-y-auto p-4 gap-4">
        <div className="bg-white rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 pb-2">Application Message</h4>
          <div className="bg-gray-100 p-3 rounded-lg">
            <ReadMore text="I absolutely love your brand aesthetic and have been following you for years! I specialize in lifestyle content and have worked with similar brands. My audience is primarily 18-35 females who are interested in fashion and beauty. I would love to create authentic content that showcases your products in real-life scenarios." />
          </div>
        </div>
        {/* Past Campaign History */}
        <div className="">
          <h3 className="text-lg font-semibold text-gray-900 pb-2">Campaign History</h3>
          <div className="bg-gray-100 rounded-lg p-3">
            <span className="text-sm">3 completed campaigns</span>
            <p className="text-sm text-gray-600">First time working with your brand</p>
          </div>
        </div>
        <div className="">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
          <AudienceDemographics className="flex flex-col" />
        </div>

        {/* Action Buttons */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Actions</h3>
          <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-2">
            <CustomButton
              text="Message"
              onClick={() => setMessageDialogOpen(true)}
              className="btn-primary"
            />
            <CustomButton text="Save for latter" className="btn-outline" />
            <CustomButton text="Reject" className="btn-danger" />
          </div>
        </div>
        <hr />

        <CampaignHistory />
      </div>

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
    </div>
  );
};

export default DeliverablesProgress;
