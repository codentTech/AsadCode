import CustomButton from "@/common/components/custom-button/custom-button.component";
import ReadMore from "@/common/components/readmore/readmore.component";
import { avatar } from "@/common/constants/auth.constant";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Avatar } from "@mui/material";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({ isCompleted = false }) => {
  const { privateNotes } = useDeliverablesProgress();

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
      <div className="flex-1 overflow-y-auto">
        {/* Header - Quick Actions */}
        <div className="p-4 border-b">
          <div className="flex flex-col justify-between items-start gap-3">
            <h4 className="text-lg font-semibold text-gray-800">Original Application</h4>
            <div className="flex flex-col gap-1">
              <h6 className="text-sm font-bold">Application Message:</h6>
              <div className="bg-gray-100 p-3 rounded-lg">
                <ReadMore
                  maxLength={130}
                  text="I love fashion and have been creating content for 3 years. My audience is primarily 18-35 year old women interested in affordable fashion trends."
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4">Audience Demographics</h3>
              <AudienceDemographics className="flex flex-col" />
            </div>
          </div>
        </div>

        {/* Private Notes Section */}
        <div className="bg-white rounded-lg m-4 p-4 shadow mt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Private Notes</h4>
          <ul className="space-y-3 text-sm text-gray-700 mb-4">
            {privateNotes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">📝</span>
                <div className="flex flex-col">
                  <span>{note.text}</span>
                  <span className="text-xs text-gray-400 mt-1">{note.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between mt-3 m-4 gap-3">
          <CustomButton text="Reinstate to Applications" className="btn-primary" />
          <CustomButton text="Move to saved shortlists" className="btn-outline" />
        </div>
      </div>
    </div>
  );
};

export default DeliverablesProgress;
