import React from "react";
import PropTypes from "prop-types";
import useViewExpenditureHistory from "./use-view-expenditure-history.hook";

export default function ViewExpendiuteHistory({ id }) {
  const { historyData, changeData } = useViewExpenditureHistory(id);

  return (
    <div className="absolute h-[184px] w-full    px-6 py-2">
      <div className=" flex h-40 w-full flex-col gap-3 rounded-[10px] border border-solid border-[#E7EAEE] bg-[#fafafa] px-2 py-4">
        <h3 className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
          History
        </h3>
        <div className="primary-scroll max-h-[150px] overflow-y-auto">
          <div dangerouslySetInnerHTML={{ __html: changeData }} />
        </div>
      </div>
      <pre> </pre>
    </div>
  );
}
ViewExpendiuteHistory.propTypes = {
  id: PropTypes.string,
};
