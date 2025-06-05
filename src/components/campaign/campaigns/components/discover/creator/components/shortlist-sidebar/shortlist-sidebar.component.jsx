import CustomButton from "@/common/components/custom-button/custom-button.component";
import { AddCircle } from "@mui/icons-material";
import React from "react";

function ShortlistSidebar({
  shortlists,
  selectedShortlist,
  setSelectedShortlist,
  handleShortlistSelect,
  setIsNewShortlistDialogOpen,
}) {
  return (
    <div className="w-64 flex flex-col gap-3 bg-white p-4 border-r border-gray-200 overflow-y-auto shadow-md">
      <h3 className="cursor-pointer" onClick={() => setSelectedShortlist("")}>
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
  );
}

export default ShortlistSidebar;
