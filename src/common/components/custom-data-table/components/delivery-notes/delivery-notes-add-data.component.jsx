import PropTypes from "prop-types";
import useOverView from "@/components/delivery-notes/view/components/overview/use-overview.hook";
import Comments from "../../../document/components/comments/comments.component";
import FileUpload from "../../../document/components/file-uploads/file-upload.component";
import History from "../../../document/components/history/history.component";
import Rejected from "../../../document/components/rejected/rejected";
import formatDate from "@/common/utils/formate-date";
import DOCUMENT from "@/common/constants/document.constants";
import { DOCUMENT_STATUS } from "@/common/constants/document-status.constant";
import { DOCUMENT_LOWER_CASE_STATUS } from "@/common/utils/document-helpers/document-helpers";

export default function DeliveryNotesAddData({ rowData, id, action, allData }) {
  const {
    open,
    handleOpenModal,
    handleCloseModal,
    deliveryNotesComments,
    handleComment,
    deliveryNotesHistory,
    openPopup,
    comment,
    handleAddComment,
    setComment,
    reason,
    setReason,
    setRejectionOpenPopup,
    handleAddReason,
    refRejection,
    rejectionOpenPopup,
    handleClose,
    commentAction,
    commentActionId,
    commentActionRef,
    setCommentAction,
    setCommentActionId,
    handleEditComment,
    commentId,
    handleDeleteComment,
    openHistoryModal,
    handleOpenHistoryModal,
    handleCloseHistoryModal,
  } = useOverView({
    action,
    allData,
    rowData,
  });

  return (
    <div>
      <div className="absolute w-[1220px]">
        <tr>
          <td>
            <div
              className={`jut mx-6 my-2 grid h-[168px] w-full ${
                DOCUMENT_LOWER_CASE_STATUS(rowData.status) ===
                DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED)
                  ? "gap-4 grid-cols-4"
                  : "gap-4 grid-cols-3 "
              }  gap-[10px] rounded-[9px] border border-solid border-[#E7EAEE] bg-[#fbfbfb] py-4`}
            >
              <Comments
                id={id}
                open={open}
                comments={deliveryNotesComments}
                handleClose={handleClose}
                handleCloseModal={handleCloseModal}
                commentAction={commentAction}
                commentActionId={commentActionId}
                commentActionRef={commentActionRef}
                setCommentAction={setCommentAction}
                setCommentActionId={setCommentActionId}
                handleEditComment={handleEditComment}
                handleDeleteComment={handleDeleteComment}
                openPopup={openPopup}
                comment={comment}
                setComment={setComment}
                commentId={commentId}
                handleAddComment={handleAddComment}
                rowData={rowData}
                handleComment={handleComment}
                handleOpenModal={handleOpenModal}
              />

              <FileUpload
                rowData={rowData}
                moduleName={DOCUMENT.DELIVERY_NOTES}
              />

              <div
                className={` ${
                  DOCUMENT_LOWER_CASE_STATUS(rowData.status) ===
                  DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED)
                    ? "border-r border-solid border-r-disabled-input"
                    : "min-w-[350px]"
                } `}
              >
                <div className="text-xs font-medium not-italic leading-[18px]">
                  History
                </div>
                <div className="primary-scroll max-h-[100px] overflow-y-auto ">
                  <p className="mt-2 border-b border-solid border-b-disabled-input text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
                    {rowData?.createdByName}{" "}
                    <span className="text-xs font-medium not-italic leading-[18px] text-text-black">
                      {" "}
                      create Delivery Notes at{" "}
                    </span>{" "}
                    {formatDate(rowData?.createdAt)}
                  </p>

                  <History
                    open={openHistoryModal}
                    rowData={rowData}
                    history={deliveryNotesHistory}
                    moduleName={DOCUMENT.DELIVERY_NOTES}
                    handleClose={handleCloseHistoryModal}
                    handleOpenModal={handleOpenHistoryModal}
                  />
                </div>
              </div>

              {DOCUMENT_LOWER_CASE_STATUS(rowData.status) ===
                DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED) && (
                <Rejected
                  rowData={rowData}
                  refRejection={refRejection}
                  rejectionOpenPopup={rejectionOpenPopup}
                  setRejectionOpenPopup={setRejectionOpenPopup}
                  reason={reason}
                  setReason={setReason}
                  handleAddReason={handleAddReason}
                />
              )}
            </div>
          </td>
        </tr>
      </div>
    </div>
  );
}
DeliveryNotesAddData.propTypes = {
  id: PropTypes.string,
  rowData: PropTypes.arrayOf,
  action: PropTypes.func,
  allData: PropTypes.func,
};
