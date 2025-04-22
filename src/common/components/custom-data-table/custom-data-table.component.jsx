/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import { Dialog, DialogContent } from "@mui/material/node";
import useCustomDataTable from "./use-custom-data-table.hook";
import PropTypes from "prop-types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CustomButton from "../custom-button/custom-button.component";
import CustomInput from "../custom-input/custom-input.component";
import CustomSelect from "../custom-select/custom-select.component";
import SearchableDropDown from "../search-dropdown/search-dropdown.component";
import NoResultFound from "../no-result-found/no-result-found";
import InfoIcon from "@/common/icons/info.icon";
import useClickOutside from "@/common/hooks/use-click-outside";
import SearchIcon from "@/common/icons/search-icon";
import { INVOICE_STATUS } from "@/common/constants/document-status.constant";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import TableLoadar from "../loadar/table-loader.component";
import FilterPopupClossIcon from "@/common/icons/filter-popup-close.icon";
import SearchFilterIcon from "../../icons/search-filter.icon";

export default function CustomDataTabe({
  initialColumns,
  initialTableData,
  actionsOption,
  statusOptions,
  doubleActionOption,
  buttonLabel,
  CustomIconPopup,
  action,
  allData,
  statusAction,
  renderFilterContent,
  module,
  filterModelWidth = "429px",
  handleStatusChange,
  convertToOptions,
  isConvertShow,
  isTabTable,
  customStatusOptions,
  isBookDraft,
  handleBook,
  setSearchText,
  isLoading,
  dataTotallRecords,
  tablePageNum,
  setTablePageNum,
  tablePageSize,
  setTablePageSize,
  openFilterPopup,
  setOpenFilterPopup,
  simpleSearch,
  hideColumn,
  paginationShow = true,
  tableHeaderShow = true,
  checkBoxShow = true,
  tableBodyMinHeight = true,
  isSearchFilter = true,
  setCurrentAction,
  actionAbsoluteClass = "right-[75px] top-[-75px]",
}) {
  const {
    columns,
    selectedRows,
    setSelectedRows,
    selectAll,
    setSelectAll,
    handleSort,
    handleDragEnd,
    activeRow,
    setActiveRow,
    handleActionClick,
    handleStatusOptionChange,
    getStatusOptionClassName,
    handleItemsPerPageChange,
    currentItems,
    totalPages,
    getPageRangeText,
    ref,
    searchAllOption,
    openColPopup,
    refCol,
    setOpenColPopup,
    handleToggleColumn,
    visibleColumns,
    handleButtonClick,
    activeRowCollaps,
    setActiveRowCollaps,
    renderCustomContent,
    renderCustomIconPopup,
    setCustomIconPopup,
    convertMenu,
    setConverMenu,
    handleToggleAllColumns,
    selectAllColumn,
    refConvert,
    renderPageButtons,
  } = useCustomDataTable(
    initialColumns,
    initialTableData,
    buttonLabel,
    CustomIconPopup,
    statusAction,
    action,
    allData,
    dataTotallRecords,
    tablePageNum,
    setTablePageNum,
    tablePageSize,
    setTablePageSize
  );
  useClickOutside([refConvert], [setConverMenu]);

  return (
    <>
      <div
        className={`  flex w-full flex-col items-start  ${
          isTabTable
            ? ""
            : " rounded-[10px] border border-solid border-disabled-input"
        }  bg-white pb-0`}
      >
        {tableHeaderShow && (
          <div
            className={`flex w-full items-center justify-between ${
              isTabTable ? "" : "rounded-[10px_10px_0px_0px]"
            }  bg-[#BBBBBB1A] px-5 py-3`}
          >
            <div className="flex-shrink-0 sm:w-1/2 flex  w-full max-w-[380px] gap-2.5 ">
              {simpleSearch ? (
                <CustomInput
                  placeholder="Search"
                  type="text"
                  onChange={(e) => setSearchText(e.target.value)}
                  className="relative max-h-[42px] max-w-[323px]"
                  startIcon={<SearchIcon />}
                />
              ) : (
                <>
                  {" "}
                  <SearchableDropDown
                    setSearchText={setSearchText}
                    searchAllOption={searchAllOption}
                  />
                  {isSearchFilter && (
                    <div
                      onClick={() => setOpenFilterPopup(true)}
                      className="flex h-[41px] w-10 items-center justify-center rounded-[5px] border border-solid border-disabled-input bg-white hover:cursor-pointer"
                    >
                      <SearchFilterIcon />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="relative top-1 flex w-full items-center  justify-end gap-2">
              {hideColumn ? null : (
                <div className="relative">
                  <button
                    onClick={() => setOpenColPopup(!openColPopup)}
                    className="relative font-dm  text-sm font-normal not-italic leading-[21buttonx] text-text-light-gray underline"
                  >
                    Show columns
                  </button>
                  {openColPopup && (
                    <div
                      ref={refCol}
                      className="absolute left-[-200px] top-10 z-[100] flex  w-[257px] flex-col items-start gap-[11px]  rounded-md border-[2px] border-solid border-[#BBBBBB1A] bg-white p-3 shadow-2xl"
                    >
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          className="unchecked:bg-[url('/assets/images/unchecked.svg')] h-4 w-4 appearance-none rounded-sm border border-gray-300 bg-cover checked:bg-[url('/assets/images/checked.svg')]"
                          checked={selectAllColumn}
                          onChange={() => handleToggleAllColumns()}
                        />

                        <label
                          className="font-dm text-xs font-medium not-italic leading-[18px] text-[#2C2E3E]"
                          htmlFor="selectAll"
                        >
                          Select All
                        </label>
                      </div>

                      {columns.map((col) => (
                        <div key={col.name} className="flex gap-2">
                          <input
                            id={col.name}
                            type="checkbox"
                            className="unchecked:bg-[url('/assets/images/unchecked.svg')] h-4 w-4 appearance-none rounded-sm border border-gray-300 bg-cover checked:bg-[url('/assets/images/checked.svg')]"
                            checked={col.selected}
                            onChange={() => handleToggleColumn(col.name)}
                          />
                          <label
                            className="font-dm text-xs font-medium not-italic leading-[18px] text-[#2C2E3E]"
                            htmlFor={col.name}
                          >
                            {col.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(module === "Offer" ||
                module === "Order" ||
                module === "Invoices" ||
                module === "Delivery Notes") && (
                <>
                  {isConvertShow && (
                    <div className=" relative z-10  max-h-[36px] ">
                      <CustomButton
                        text="Convert to"
                        disabled={selectedRows.length !== 1}
                        onClick={(e) => {
                          // handleConvertClick(e);
                          setConverMenu(() => !convertMenu);
                        }}
                        className="relative flex  max-h-[36px] w-[107.29px] items-start items-center rounded-md border border-solid border-disabled-input bg-[#FFF] px-2 py-[10px] text-sm font-normal not-italic leading-[17.5px] text-text-light-gray opacity-[0.699999988079071]"
                        endIcon={
                          <div>
                            <img
                              src="/assets/icons/arrow-drop.svg"
                              alt=""
                              height="4.81"
                              width="8.01px"
                            />
                          </div>
                        }
                      />

                      {convertMenu && (
                        <div
                          anchorEl={convertMenu}
                          keepMounted
                          onClose={() => setConverMenu(false)}
                          open={convertMenu}
                          ref={refConvert}
                          className=" absolute top-10 flex w-[189px] flex-col items-start gap-2 rounded-md border border-solid border-[#CECECE] bg-white p-3"
                        >
                          {convertToOptions?.map((option, i) => {
                            return (
                              <div
                                id={option.label}
                                className="w-flex w-full items-center gap-2 hover:cursor-pointer hover:bg-[#e6e6e67e] "
                                onClick={() =>
                                  option.onClick(
                                    selectedRows,
                                    setConverMenu,
                                    setSelectedRows
                                  )
                                }
                              >
                                {option.onClick}
                                {option.label}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  {isBookDraft && (
                    <CustomButton
                      text={`Book ${module}`}
                      onClick={() =>
                        handleBook({ selectedRows, setSelectedRows })
                      }
                      disabled={selectedRows.length === 0}
                      className="btn-secondary  rounded-md bg-[#047857] px-4 py-[9px] text-sm font-medium not-italic leading-[17.5px] opacity-[0.699999988079071]"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <div className="w-full">
          <div
            className={`custom-scroll
            overflow-x-auto overflow-y-visible ${
              tableBodyMinHeight ? "min-h-[422px]" : ""
            }  max-w-full  ${
              isTabTable
                ? "rounded-[0px_0px_10px_10px] border-b border-solid border-b-disabled-input"
                : ""
            }`}
          >
            <DragDropContext onDragEnd={handleDragEnd}>
              <table className="w-full">
                <thead className="h-[59px] border-b border-t border-solid border-b-[#E7EAEE] border-t-[#E7EAEE] bg-[#1d4ed808] p-2 ">
                  <Droppable droppableId="columns" direction="horizontal">
                    {(provided) => (
                      <tr {...provided.droppableProps} ref={provided.innerRef}>
                        {checkBoxShow && (
                          // eslint-disable-next-line jsx-a11y/control-has-associated-label
                          <th className="flex h-[59.333px] w-[59.333px] shrink-0 items-center justify-center gap-1 px-0 py-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 bg-unchecked  checked:bg-checked"
                              checked={selectAll}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const ids = initialTableData.map(
                                    (row) => row.id
                                  );
                                  setSelectedRows(ids);
                                  action(ids);
                                } else {
                                  setSelectedRows([]);
                                  action([]);
                                }
                                setSelectAll(e.target.checked);
                              }}
                            />
                          </th>
                        )}

                        {visibleColumns.map((column, index) => (
                          <Draggable
                            key={column.id}
                            draggableId={column.id}
                            index={index}
                          >
                            {(provided) => (
                              <th
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="text-left "
                                key={column.id}
                              >
                                <div
                                  className="flex h-[59px] cursor-pointer items-center gap-2 p-2"
                                  onClick={() =>
                                    handleSort(column.name.toLowerCase())
                                  }
                                >
                                  {" "}
                                  <span className="whitespace-nowrap text-sm font-normal not-italic leading-[17.5px] text-text-black">
                                    {column.title}
                                  </span>
                                  <div className="flex flex-col">
                                    {column.sort && (
                                      <svg
                                        width="9"
                                        height="15"
                                        viewBox="0 0 9 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0 6.3326L4.03846 0.499268L8.07692 6.3326H0ZM0 8.66724L4.03846 14.5006L8.07692 8.66724H0Z"
                                          fill="#BDBDBD"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              </th>
                            )}
                          </Draggable>
                        ))}
                        {statusOptions && (
                          <th className="text-left ">
                            <span className="whitespace-nowrap  text-sm  font-normal not-italic leading-[17.5px] text-text-black">
                              Status
                            </span>
                          </th>
                        )}

                        {buttonLabel && (
                          <th className=" pl-0 pr-4 text-left">
                            <span className="flex items-center gap-1 whitespace-nowrap text-sm  font-normal not-italic leading-[17.5px] text-text-black">
                              {buttonLabel}{" "}
                              <div title="Click on it and View More Data">
                                <InfoIcon />
                              </div>
                            </span>
                          </th>
                        )}
                        {CustomIconPopup && (
                          <th className="px-2 text-left">
                            <span className="whitespace-nowrap  text-sm  font-normal not-italic leading-[17.5px] text-text-black">
                              {CustomIconPopup.title}
                            </span>
                          </th>
                        )}

                        {actionsOption && (
                          <th className=" pl-0 pr-4 text-left">
                            <span className="whitespace-nowrap  text-sm  font-normal not-italic leading-[17.5px] text-text-black">
                              Actions
                            </span>
                          </th>
                        )}

                        {doubleActionOption && (
                          <th className=" pl-0 pr-4 text-left">
                            <span className="whitespace-nowrap  text-sm  font-normal not-italic leading-[17.5px] text-text-black">
                              Actions
                            </span>
                          </th>
                        )}
                        {provided.placeholder}
                      </tr>
                    )}
                  </Droppable>
                </thead>

                <tbody className="p-2">
                  {!isLoading &&
                    currentItems?.map((row, index) => (
                      <React.Fragment key={row.id}>
                        <tr className="h-[72px] border-b border-solid border-b-[#E7EAEE] bg-white px-2 py-4">
                          {checkBoxShow && (
                            // eslint-disable-next-line jsx-a11y/control-has-associated-label
                            <td className="w-[40px] text-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 bg-unchecked  checked:bg-checked"
                                checked={selectedRows.includes(row.id)}
                                // onClick={() => {}}S
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRows([...selectedRows, row.id]);
                                    action([...selectedRows, row.id]);
                                  } else {
                                    setSelectedRows(
                                      selectedRows.filter((id) => id !== row.id)
                                    );
                                    action(
                                      selectedRows.filter(
                                        (id) => id !== row.id && row
                                      )
                                    );
                                  }
                                }}
                              />
                            </td>
                          )}
                          {visibleColumns.map((column) => (
                            <td
                              className={` ${
                                column.sort ? "overflow-hidden" : ""
                              } max-h-[59px] max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap pl-3 text-sm font-normal not-italic leading-[17.5px] text-text-medium-gray`}
                              key={column.id}
                            >
                              <span
                                className={` m-w-[100px] text-ellipsis ${
                                  column.name === "status" &&
                                  (module === "Invoices" ||
                                    module === "Expenditure") &&
                                  row[column.name] === "PAID"
                                    ? "flex max-w-[44px] items-center gap-2.5 rounded-[5px] bg-[#0fff5f1a] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-secondary-green"
                                    : row[column.name] === "OPEN" &&
                                        module !== "Offer" &&
                                        module !== "Delivery Notes" &&
                                        module !== "Order" &&
                                        module !== "Invoices"
                                      ? "flex max-w-[52px] items-center gap-2.5 rounded-[5px] bg-[#ef20201a] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-danger"
                                      : column.name === "status" &&
                                          row.isActive === true
                                        ? "flex w-fit items-center gap-2.5 rounded-[5px] bg-[#1d4ed81a] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-primary"
                                        : column.name === "status" &&
                                            row.isActive === false
                                          ? "flex w-fit items-center gap-2.5 rounded-[5px] bg-[#ef20201a] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-danger"
                                          : (column.name === "status" &&
                                                (module === "Order" ||
                                                  module === "Delivery Notes" ||
                                                  module === "Invoices" ||
                                                  module === "Offer") &&
                                                row[column.name] ===
                                                  "REJECTED") ||
                                              row[column.name] ===
                                                INVOICE_STATUS.CANCELLED ||
                                              (column.name === "status" &&
                                                row[column.name] === "Rejected")
                                            ? " flex max-w-[73px] items-center justify-center gap-2.5 rounded-[5px] bg-[#ffe8e8] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-[#A60A0A]"
                                            : column.name === "status" &&
                                                row[column.name] === "DRAFT"
                                              ? "max-w-[49px] rounded-[5px] bg-[#F2F2F2] px-2 py-1 text-sm font-normal not-italic leading-[17.5px]"
                                              : (column.name === "status" &&
                                                    module === "Offer") ||
                                                  (column.name === "status" &&
                                                    module === "Order") ||
                                                  (column.name === "status" &&
                                                    module === "Invoices") ||
                                                  (module ===
                                                    "Delivery Notes" &&
                                                    row[column.name] ===
                                                      "OPEN") ||
                                                  row[column.name] === "Open" ||
                                                  row[column.name] === "open"
                                                ? ""
                                                : column.name === "status" &&
                                                    row[column.name] ===
                                                      "EXECUTED"
                                                  ? " flex items-center gap-2.5 rounded-[5px] bg-[#F1FFB9] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-[#A58825]"
                                                  : column.name === "status" &&
                                                      row[column.name] ===
                                                        "EXECUTED"
                                                    ? "flex items-center gap-2.5 rounded-[5px] bg-[#1D4ED8] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-primary"
                                                    : column.name ===
                                                          "status" &&
                                                        (module === "Order" ||
                                                          module === "Offer" ||
                                                          module ===
                                                            "Delivery Notes") &&
                                                        row[
                                                          column.name
                                                        ]?.toUpperCase() ===
                                                          "INVOICED"
                                                      ? "flex items-center  rounded-[5px] bg-[#DCFFDE] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-[#0DA60A] "
                                                      : (column.name ===
                                                            "status" &&
                                                            module ===
                                                              "Delivery Notes" &&
                                                            row[column.name] ===
                                                              "DELIVERED") ||
                                                          row[column.name] ===
                                                            "Delivered" ||
                                                          row[column.name] ===
                                                            "delivered"
                                                        ? "flex max-w-[88px] items-center rounded-[5px] bg-[#DCFFDE] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-[#0DA60A] "
                                                        : column.name ===
                                                              "status" &&
                                                            module ===
                                                              "Invoices" &&
                                                            (row[
                                                              column.name
                                                            ] === "OVERDUE" ||
                                                              row[
                                                                column.name
                                                              ] === "Overdue" ||
                                                              row[
                                                                column.name
                                                              ] === "overdue")
                                                          ? "flex items-center gap-2.5 rounded-[5px] bg-[#F1FFB9] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-[#A58825]"
                                                          : column.name ===
                                                                "status" &&
                                                              module ===
                                                                "Delivery Notes" &&
                                                              row[
                                                                column.name
                                                              ] === "RETURNED"
                                                            ? "fdf"
                                                            : column.name ===
                                                                  "status" &&
                                                                row[
                                                                  column.name
                                                                ] === "Block"
                                                              ? "flex max-w-[52px] items-center gap-2.5 rounded-[5px] bg-[#ef20201a] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-danger"
                                                              : column.name ===
                                                                    "status" &&
                                                                  row[
                                                                    column.name
                                                                  ] ===
                                                                    "Unblock"
                                                                ? "flex max-w-[69px] items-center gap-2.5 rounded-[5px] bg-[#1d4ed81a] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-primary"
                                                                : ""
                                }`}
                              >
                                {" "}
                                {column.name === "status" &&
                                row.isActive === true ? (
                                  "Active"
                                ) : column.name === "status" &&
                                  row.isActive === false ? (
                                  "In-active"
                                ) : column.name === "status" &&
                                  (module === "Order" ||
                                    module === "Delivery Notes" ||
                                    module === "Offer") &&
                                  (row[column.name] === "REJECTED" ||
                                    row[column.name] === "Rejected" ||
                                    row[column.name] === "rejected") ? (
                                  "Rejected"
                                ) : column.name === "status" &&
                                  module === "Invoices" &&
                                  row[column.name] ===
                                    INVOICE_STATUS.CANCELLED ? (
                                  capitalizeFirstLetter(
                                    INVOICE_STATUS.CANCELLED
                                  )
                                ) : (column.name === "status" &&
                                    (module === "Order" ||
                                      module === "Offer") &&
                                    row[column.name] === "INVOICED") ||
                                  (column.name === "status" &&
                                    module === "Delivery Notes" &&
                                    row[column.name] === "INVOICED") ? (
                                  <p className="flex max-w-[71px] items-center rounded-[5px] bg-[#DCFFDE] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-[#0DA60A]">
                                    Invoiced
                                  </p>
                                ) : column.name === "status" &&
                                  (module === "Order" ||
                                    module === "Delivery Notes" ||
                                    module === "Offer") &&
                                  row[column.name] === "DRAFT" ? (
                                  "Draft"
                                ) : column.name === "status" &&
                                  row[column.name] === "INVOICED" ? (
                                  <CustomSelect
                                    options={customStatusOptions}
                                    id={row.id}
                                    value={row[column.name]}
                                    defaultValue={row[column.name]}
                                    onChange={(event) =>
                                      handleStatusChange(
                                        row.id,
                                        event.target.value
                                      )
                                    }
                                    className={`${getStatusOptionClassName(
                                      row[column.name],
                                      row.id
                                    )} max-h-[26px] w-[120px] !max-w-[130px]`}
                                  />
                                ) : column.name === "status" &&
                                  row[column.name] === "ACCEPTED" ? (
                                  <CustomSelect
                                    options={customStatusOptions}
                                    id={row.id}
                                    value={row[column.name]}
                                    defaultValue={row[column.name]}
                                    onChange={(event) =>
                                      handleStatusChange(
                                        row.id,
                                        event.target.value
                                      )
                                    }
                                    className={`${getStatusOptionClassName(
                                      row[column.name],
                                      row.id
                                    )} max-h-[26px] w-[120px] !max-w-[130px]`}
                                  />
                                ) : column.name === "status" &&
                                  (module === "Offer" ||
                                    module === "Order" ||
                                    module === "Invoices" ||
                                    module === "Delivery Notes") &&
                                  (row[column.name] === "OPEN" ||
                                    row[column.name] === "Open" ||
                                    row[column.name] === "open") ? (
                                  <div className="w-[92px] ">
                                    <CustomSelect
                                      options={customStatusOptions}
                                      id={row.id}
                                      value={row[column.name]}
                                      defaultValue={row[column.name]}
                                      onChange={(event) =>
                                        handleStatusChange(
                                          row.id,
                                          event.target.value
                                        )
                                      }
                                      className={`${getStatusOptionClassName(
                                        row[column.name],
                                        row.id
                                      )} max-h-[26px] `}
                                    />
                                  </div>
                                ) : column.name === "status" &&
                                  row[column.name] === "EXECUTED" ? (
                                  <CustomSelect
                                    options={customStatusOptions}
                                    id={row.id}
                                    value={row[column.name]}
                                    defaultValue={row[column.name]}
                                    onChange={(event) =>
                                      handleStatusChange(
                                        row.id,
                                        event.target.value
                                      )
                                    }
                                    className={`${getStatusOptionClassName(
                                      row[column.name],
                                      row.id
                                    )} max-h-[26px] w-[120px] !max-w-[130px]`}
                                  />
                                ) : column.name === "status" &&
                                  row[column.name] === "SENT" ? (
                                  <CustomSelect
                                    options={customStatusOptions}
                                    id={row.id}
                                    value={row[column.name]}
                                    defaultValue={row[column.name]}
                                    onChange={(event) =>
                                      handleStatusChange(
                                        row.id,
                                        event.target.value
                                      )
                                    }
                                    className={`${getStatusOptionClassName(
                                      row[column.name],
                                      row.id
                                    )} max-h-[26px] !w-[92px] !max-w-[92px]`}
                                  />
                                ) : column.name === "status" &&
                                  module === "Delivery Notes" &&
                                  row[column.name] === "RETURNED" ? (
                                  <CustomSelect
                                    options={customStatusOptions}
                                    id={row.id}
                                    value={row[column.name]}
                                    defaultValue={row[column.name]}
                                    onChange={(event) =>
                                      handleStatusChange(
                                        row.id,
                                        event.target.value
                                      )
                                    }
                                    className={`${getStatusOptionClassName(
                                      row[column.name],
                                      row.id
                                    )} max-h-[26px] w-[120px] !max-w-[130px]`}
                                  />
                                ) : column.name === "status" &&
                                  module === "Invoices" &&
                                  (row[column.name] === "OVERDUE" ||
                                    row[column.name] === "Overdue" ||
                                    row[column.name] === "overdue") ? (
                                  <p className="flex items-center gap-2.5 rounded-[5px] bg-[#F1FFB9] px-2 py-1 text-sm font-normal not-italic leading-[17.5px] text-[#A58825]">
                                    {row[column.name]}
                                  </p>
                                ) : column.name === "productCategorys" &&
                                  module === "Product" ? (
                                  row[column.name]
                                    .map((cat) => cat?.categoryName)
                                    .join(",") || "---"
                                ) : (
                                  row[column.name] || "---"
                                )}
                              </span>
                            </td>
                          ))}
                          {statusOptions && (
                            <td>
                              <CustomSelect
                                options={statusOptions}
                                id={row.id}
                                defaultValue={row.status}
                                onChange={(event) =>
                                  handleStatusOptionChange(
                                    row.id,
                                    event.target.value
                                  )
                                }
                                className={getStatusOptionClassName(
                                  row.status,
                                  row.id
                                )}
                              />
                            </td>
                          )}
                          {buttonLabel && (
                            <td className="m-auto">
                              {activeRowCollaps === row.id ? (
                                <div
                                  className="m-auto flex w-fit justify-center  hover:cursor-pointer"
                                  onClick={() => setActiveRowCollaps(false)}
                                >
                                  <svg
                                    width="27"
                                    height="27"
                                    viewBox="0 0 27 27"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clipPath="url(#clip0_9908_129310)">
                                      <path
                                        d="M17.3291 12.3657H9.26462C8.73236 12.3657 8.29688 12.8012 8.29688 13.3335C8.29688 13.8657 8.73236 14.3012 9.26462 14.3012H17.3291C17.8614 14.3012 18.2969 13.8657 18.2969 13.3335C18.2969 12.8012 17.8614 12.3657 17.3291 12.3657Z"
                                        fill="#BBBBBB"
                                      />
                                    </g>
                                    <rect
                                      x="0.75"
                                      y="1.0835"
                                      width="25.0953"
                                      height="24.5"
                                      rx="3.25"
                                      stroke="#BBBBBB"
                                      strokeWidth="1.5"
                                    />
                                    <defs>
                                      <clipPath id="clip0_9908_129310">
                                        <rect
                                          width="10"
                                          height="10"
                                          fill="white"
                                          transform="translate(8.29688 8.3335)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </div>
                              ) : (
                                <div
                                  className="m-auto flex  w-fit justify-center hover:cursor-pointer"
                                  onClick={() => {
                                    handleButtonClick(row);
                                    setActiveRowCollaps(row.id);
                                  }}
                                >
                                  <svg
                                    width="27"
                                    height="27"
                                    viewBox="0 0 27 27"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clipPath="url(#clip0_9908_125932)">
                                      <path
                                        d="M17.404 12.4405H14.3683C14.3209 12.4405 14.2755 12.4216 14.242 12.3882C14.2085 12.3547 14.1897 12.3092 14.1897 12.2619V9.22617C14.1897 8.73309 13.79 8.33331 13.2969 8.33331C12.8038 8.33331 12.404 8.73309 12.404 9.22617V12.2619C12.404 12.3092 12.3852 12.3547 12.3517 12.3882C12.3182 12.4216 12.2728 12.4405 12.2254 12.4405H9.18973C8.69665 12.4405 8.29688 12.8402 8.29688 13.3333C8.29688 13.8264 8.69665 14.2262 9.18973 14.2262H12.2254C12.2728 14.2262 12.3182 14.245 12.3517 14.2785C12.3852 14.312 12.404 14.3574 12.404 14.4047V17.4405C12.404 17.9335 12.8038 18.3333 13.2969 18.3333C13.79 18.3333 14.1897 17.9335 14.1897 17.4405V14.4047C14.1897 14.3574 14.2085 14.312 14.242 14.2785C14.2755 14.245 14.3209 14.2262 14.3683 14.2262H17.404C17.8971 14.2262 18.2969 13.8264 18.2969 13.3333C18.2969 12.8402 17.8971 12.4405 17.404 12.4405Z"
                                        fill="#BBBBBB"
                                      />
                                    </g>
                                    <rect
                                      x="0.75"
                                      y="1.08331"
                                      width="25.0953"
                                      height="24.5"
                                      rx="3.25"
                                      stroke="#BBBBBB"
                                      strokeWidth="1.5"
                                    />
                                    <defs>
                                      <clipPath id="clip0_9908_125932">
                                        <rect
                                          width="10"
                                          height="10"
                                          fill="white"
                                          transform="translate(8.29688 8.33331)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </div>
                              )}
                            </td>
                          )}
                          {CustomIconPopup && (
                            <td className="relative m-auto">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCustomIconPopup(row);
                                  CustomIconPopup?.handleClick(row);
                                }}
                                className="relative m-auto flex  w-fit justify-center hover:cursor-pointer"
                              >
                                {renderCustomIconPopup(row)}
                              </div>
                            </td>
                          )}
                          {actionsOption && (
                            <td className="relative m-auto">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveRow(row.id);
                                  setCurrentAction(row);
                                }}
                                className="relative m-auto w-fit overflow-hidden text-ellipsis whitespace-nowrap  py-2 text-sm font-normal not-italic leading-[17.5px] text-text-medium-gray hover:cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="25"
                                  viewBox="0 0 24 25"
                                  fill="none"
                                >
                                  <path
                                    d="M9.75 12.333C9.75 13.5735 10.7595 14.583 12 14.583C13.2405 14.583 14.25 13.5735 14.25 12.333C14.25 11.0925 13.2405 10.083 12 10.083C10.7595 10.083 9.75 11.0925 9.75 12.333ZM9.75 19.833C9.75 21.0735 10.7595 22.083 12 22.083C13.2405 22.083 14.25 21.0735 14.25 19.833C14.25 18.5925 13.2405 17.583 12 17.583C10.7595 17.583 9.75 18.5925 9.75 19.833ZM9.75 4.83301C9.75 6.07351 10.7595 7.08301 12 7.08301C13.2405 7.08301 14.25 6.07351 14.25 4.83301C14.25 3.59251 13.2405 2.58301 12 2.58301C10.7595 2.58301 9.75 3.59251 9.75 4.83301Z"
                                    fill="#585858"
                                  />
                                </svg>
                              </div>

                              {actionsOption && activeRow === row.id && (
                                <ul
                                  ref={ref}
                                  className={`${
                                    (index === currentItems.length - 1 &&
                                      currentItems.length >= 5) ||
                                    (index === currentItems.length - 2 &&
                                      currentItems.length >= 5)
                                      ? `absolute ${actionAbsoluteClass} z-50`
                                      : "absolute right-[55px] top-[40px] z-50"
                                  }  flex flex-col gap-2  rounded-md border border-solid border-[#CECECE] bg-white bg-white p-3`}
                                >
                                  {actionsOption.map((action) => (
                                    <li
                                      key={action.label}
                                      onClick={() =>
                                        handleActionClick(action, row)
                                      }
                                      className="flex flex-col gap-2 hover:cursor-pointer hover:bg-[#1D4ED808]"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                                          {action.icon}
                                        </div>
                                        <div className="whitespace-nowrap text-sm">
                                          {action.label}
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          )}
                          {doubleActionOption && (
                            <td className="relative m-auto ">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveRow(row.id);
                                }}
                                className="relative m-auto w-fit overflow-hidden text-ellipsis whitespace-nowrap py-2 text-sm font-normal not-italic leading-[17.5px] text-text-medium-gray hover:cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="25"
                                  viewBox="0 0 24 25"
                                  fill="none"
                                >
                                  <path
                                    d="M9.75 12.333C9.75 13.5735 10.7595 14.583 12 14.583C13.2405 14.583 14.25 13.5735 14.25 12.333C14.25 11.0925 13.2405 10.083 12 10.083C10.7595 10.083 9.75 11.0925 9.75 12.333ZM9.75 19.833C9.75 21.0735 10.7595 22.083 12 22.083C13.2405 22.083 14.25 21.0735 14.25 19.833C14.25 18.5925 13.2405 17.583 12 17.583C10.7595 17.583 9.75 18.5925 9.75 19.833ZM9.75 4.83301C9.75 6.07351 10.7595 7.08301 12 7.08301C13.2405 7.08301 14.25 6.07351 14.25 4.83301C14.25 3.59251 13.2405 2.58301 12 2.58301C10.7595 2.58301 9.75 3.59251 9.75 4.83301Z"
                                    fill="#585858"
                                  />
                                </svg>
                              </div>

                              {doubleActionOption && activeRow === row.id && (
                                <ul
                                  ref={ref}
                                  className={`${
                                    (index === currentItems.length - 1 &&
                                      currentItems.length >= 5) ||
                                    (index === currentItems.length - 2 &&
                                      currentItems.length >= 5)
                                      ? `absolute ${actionAbsoluteClass} z-50`
                                      : "absolute right-[55px] top-[40px] z-50"
                                  }  flex flex-col gap-2  rounded-md border border-solid border-[#CECECE]  bg-white p-3`}
                                >
                                  {row.status === "PAID"
                                    ? doubleActionOption.paid?.map((action) => (
                                        <li
                                          key={action.label}
                                          onClick={() =>
                                            handleActionClick(action, row)
                                          }
                                          className="flex flex-col gap-2 hover:cursor-pointer hover:bg-[#1D4ED808]"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                                              {action.icon}
                                            </div>
                                            <div className="whitespace-nowrap">
                                              {action.label}
                                            </div>
                                          </div>
                                        </li>
                                      ))
                                    : doubleActionOption.open?.map((action) => (
                                        <li
                                          key={action.label}
                                          onClick={() =>
                                            handleActionClick(action, row)
                                          }
                                          className="flex flex-col gap-2 hover:cursor-pointer hover:bg-[#1D4ED808]"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                                              {action.icon}
                                            </div>
                                            <div className="whitespace-nowrap">
                                              {action.label}
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                  {row.status === "Block"
                                    ? doubleActionOption.block?.map(
                                        (action) => (
                                          <li
                                            key={action.label}
                                            onClick={() =>
                                              handleActionClick(action, row)
                                            }
                                            className="flex flex-col gap-2 hover:cursor-pointer hover:bg-[#1D4ED808]"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                                                {action.icon}
                                              </div>
                                              <div className="whitespace-nowrap">
                                                {action.label}
                                              </div>
                                            </div>
                                          </li>
                                        )
                                      )
                                    : doubleActionOption.unBlock?.map(
                                        (action) => (
                                          <li
                                            key={action.label}
                                            onClick={() =>
                                              handleActionClick(action, row)
                                            }
                                            className="flex flex-col gap-2 hover:cursor-pointer hover:bg-[#1D4ED808]"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                                                {action.icon}
                                              </div>
                                              <div className="whitespace-nowrap">
                                                {action.label}
                                              </div>
                                            </div>
                                          </li>
                                        )
                                      )}
                                  {row.isActive === true
                                    ? doubleActionOption.active?.map(
                                        (action) => (
                                          <li
                                            key={action.label}
                                            onClick={() =>
                                              handleActionClick(action, row)
                                            }
                                            className="flex flex-col gap-2 hover:cursor-pointer hover:bg-[#1D4ED808]"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                                                {action.icon}
                                              </div>
                                              <div className="whitespace-nowrap">
                                                {action.label}
                                              </div>
                                            </div>
                                          </li>
                                        )
                                      )
                                    : row.isActive === false
                                      ? doubleActionOption.inActive?.map(
                                          (action) => (
                                            <li
                                              key={action.label}
                                              onClick={() =>
                                                handleActionClick(action, row)
                                              }
                                              className="flex flex-col gap-2 hover:cursor-pointer hover:bg-[#1D4ED808]"
                                            >
                                              <div className="flex items-center gap-2">
                                                <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                                                  {action.icon}
                                                </div>
                                                <div className="whitespace-nowrap">
                                                  {action.label}
                                                </div>
                                              </div>
                                            </li>
                                          )
                                        )
                                      : null}
                                </ul>
                              )}
                            </td>
                          )}
                        </tr>
                        {activeRowCollaps === row.id && (
                          <tr className="relative z-10 h-[184px] border-b border-solid border-b-[#E7EAEE] bg-white px-6 py-2">
                            {renderCustomContent(module)}
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </DragDropContext>
            {isLoading ? (
              <TableLoadar />
            ) : currentItems?.length === 0 ? (
              <div className="relative  h-[400px] w-full  ">
                <div className="absolute top-[10%] mt-3 flex w-full flex-col  items-center justify-center gap-[48px] text-center">
                  <NoResultFound />
                  <p className=" overflow-hidden text-ellipsis text-center text-[22px] font-medium capitalize not-italic leading-[33px] text-text-black">
                    NO RESULT FOUND
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {paginationShow && (
        <div
          className={` ${
            isTabTable ? " px-5" : ""
          } mt-4 flex w-full items-center justify-between `}
        >
          <div className="flex items-center gap-4">
            <p className="text-xs font-normal not-italic leading-[18px] text-[#333]">
              Show
            </p>
            <select
              className="h-[27px] rounded border border-solid border-[#E0E7ED] px-1  text-center text-xs font-normal not-italic leading-[18px] text-text-black"
              value={tablePageSize}
              onChange={handleItemsPerPageChange}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
            </select>{" "}
            {getPageRangeText()}
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={tablePageNum === 1}
              onClick={() => setTablePageNum(tablePageNum - 1)}
              className={`flex h-8 w-[44px] items-center justify-center gap-2.5 rounded-[3px] bg-[#E4E4E4] px-2.5 py-1 disabled:cursor-not-allowed ${
                tablePageNum === 1 ? "opacity-50" : ""
              } `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.362 17.5002C13.1 17.5002 12.839 17.3982 12.643 17.1952L8.78004 13.1953C8.40204 12.8022 8.40704 12.1793 8.79304 11.7933L12.793 7.79325C13.183 7.40225 13.816 7.40225 14.207 7.79325C14.597 8.18425 14.597 8.81625 14.207 9.20725L10.902 12.5122L14.081 15.8053C14.465 16.2032 14.454 16.8362 14.057 17.2192C13.862 17.4072 13.612 17.5002 13.362 17.5002Z"
                  fill="#2C2E3E"
                />
              </svg>
            </button>
            {renderPageButtons()}
            <button
              disabled={tablePageNum === totalPages}
              onClick={() => setTablePageNum(tablePageNum + 1)}
              className={`flex h-8 w-[44px] items-center justify-center gap-2.5 rounded-[3px] bg-[#E4E4E4] px-2.5 py-1 disabled:cursor-not-allowed ${
                tablePageNum === totalPages ? "opacity-50" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.5002 17.5002C10.2442 17.5002 9.98825 17.4022 9.79325 17.2072C9.40225 16.8162 9.40225 16.1842 9.79325 15.7932L13.0982 12.4882L9.91825 9.19525C9.53525 8.79725 9.54625 8.16425 9.94325 7.78125C10.3413 7.39825 10.9742 7.40925 11.3572 7.80525L15.2193 11.8052C15.5983 12.1982 15.5933 12.8212 15.2073 13.2072L11.2072 17.2072C11.0122 17.4022 10.7563 17.5002 10.5002 17.5002Z"
                  fill="#2C2E3E"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      <Dialog
        className="!rounded-[20px]"
        ref={ref}
        open={openFilterPopup}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: filterModelWidth, // Set your width here
            },
          },
          zIndex: 13000,
        }}
      >
        <div className="my-scroll min-w-[429px] overflow-y-auto">
          <div className="relative h-14 w-full bg-white">
            <div className="fixed z-10 flex h-14 w-[429px] items-center justify-between bg-[#e3ecf4] p-5">
              <div className=" text-xl font-medium not-italic leading-[30px] text-text-dark-gray">
                Filters
              </div>
              <div
                className="hover:cursor-pointer"
                onClick={() => setOpenFilterPopup(false)}
              >
                <FilterPopupClossIcon />
              </div>
            </div>
          </div>
          <DialogContent>{renderFilterContent}</DialogContent>
        </div>
      </Dialog>
    </>
  );
}
CustomDataTabe.propTypes = {
  initialColumns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  initialTableData: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  actionsOption: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  doubleActionOption: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  ),
  statusOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  buttonLabel: PropTypes.string,
  module: PropTypes.string,
  filterModelWidth: PropTypes.string,
  CustomIconPopup: PropTypes.object,
  handleSubmit: PropTypes.func,
  onSubmitFilterForm: PropTypes.func,
  register: PropTypes.func,
  reset: PropTypes.func,
  selectedPaymentAmount: PropTypes.string,
  setSearchText: PropTypes.func,
  setSelectedPaymentAmount: PropTypes.func,
  allData: PropTypes.func,
  selectedInstallments: PropTypes.string,
  setSelectedInstallments: PropTypes.func,
  selectedStatus: PropTypes.func,
  setSelectedStatus: PropTypes.func,
  action: PropTypes.func,
  handleStatusChange: PropTypes.func,
  statusAction: PropTypes.func,
  handleConvertClick: PropTypes.func,
  handleBookOffer: PropTypes.func,
  convertToOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  customStatusOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object])
  ),
  isOfferDraft: PropTypes.bool,
  isDateShow: PropTypes.bool,
  isConvertShow: PropTypes.bool,
  isCollectiveShow: PropTypes.bool,
  isTabTable: PropTypes.bool,
  isLoading: PropTypes.bool,
  renderFilterContent: PropTypes.element,
  isBookDraft: PropTypes.bool,
  openFilterPopup: PropTypes.bool,
  handleBook: PropTypes.func,
  dataTotallRecords: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  actionAbsoluteClass: PropTypes.string,
  tablePageNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setTablePageNum: PropTypes.func,
  tablePageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setTablePageSize: PropTypes.func,
  setOpenFilterPopup: PropTypes.func,
  simpleSearch: PropTypes.bool,
  hideColumn: PropTypes.bool,
  paginationShow: PropTypes.bool,
  tableHeaderShow: PropTypes.bool,
  checkBoxShow: PropTypes.bool,
  setCurrentAction: PropTypes.func,
  tableBodyMinHeight: PropTypes.bool,
  isSearchFilter: PropTypes.bool,
};
