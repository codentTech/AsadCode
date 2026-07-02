import CustomButton from "@/common/components/custom-button/custom-button.component";

export default function BrandCampaignTypeToggle({
  isMultiCreator,
  onSelect,
  className = "",
  rightLabelClassName = "",
}) {
  return (
    <div className={className}>
      <div className="flex min-h-0 w-full gap-1 rounded-lg border border-gray-300 bg-gray-100 shadow-inner">
        <CustomButton
          text="Multi-Creator"
          type="button"
          onClick={() => onSelect(true)}
          className={`flex-1 min-h-8 min-w-0 text-xs leading-tight sm:min-w-[106px] ${
            isMultiCreator ? "btn-primary" : "btn-outline border-transparent !shadow-none"
          }`}
        />
        <CustomButton
          text="Individual Creator"
          type="button"
          onClick={() => onSelect(false)}
          className={`flex-1 min-h-8 min-w-0 text-xs leading-tight sm:min-w-[106px] ${
            !isMultiCreator ? "btn-primary" : "btn-outline border-transparent !shadow-none"
          }`}
        />
      </div>
    </div>
  );
}
