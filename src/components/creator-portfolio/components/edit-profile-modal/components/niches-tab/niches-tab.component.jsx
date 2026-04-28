import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { Trash2 } from "lucide-react";
import useNichesTab from "./use-niches-tab.hook";

const NichesTab = ({ profileData, setProfileData }) => {
  const { showNicheInput, setShowNicheInput, newNiche, setNewNiche, addNiche, removeNiche } =
    useNichesTab({ profileData, setProfileData });

  return (
    <div className="max-w-3xl space-y-3 sm:space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Content Niches</h3>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {profileData.niches.map((niche, index) => (
            <span
              key={index}
              className="px-2 py-1.5 rounded-lg text-xs border bg-primary text-white shadow-sm flex items-center gap-1.5"
            >
              {niche}
              <button
                onClick={() => removeNiche(niche)}
                className="text-white hover:text-red-200 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        {showNicheInput ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <CustomInput
                name="newNiche"
                value={newNiche}
                onChange={(e) => setNewNiche(e.target.value)}
                placeholder="Enter niche name"
              />
            </div>
            <CustomButton text="Add" onClick={addNiche} className="btn-primary w-full sm:w-auto" />
            <CustomButton
              text="Cancel"
              onClick={() => {
                setShowNicheInput(false);
                setNewNiche("");
              }}
              className="btn-cancel w-full sm:w-auto"
            />
          </div>
        ) : (
          <div className="flex justify-end">
            <CustomButton
              text="Add Niche"
              onClick={() => setShowNicheInput(true)}
              className="btn-outline"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NichesTab;
