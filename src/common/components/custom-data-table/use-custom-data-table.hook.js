/* eslint-disable react/button-has-type */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-filename-extension */
import { useEffect, useRef, useState } from "react";
import useClickOutside from "@/common/hooks/use-click-outside";
import ViewExpendiuteHistory from "./components/expenditure/view-expenditure-history.component";
import OfferAddData from "./components/offer/offer-add-data";
import OrderAddData from "./components/order/order-add-data.component";
import DeliveryNotesAddData from "./components/delivery-notes/delivery-notes-add-data.component";
import InvoicesAddData from "./components/invoices/invoices-add-data.component";
import { INVOICE_STATUS } from "@/common/constants/document-status.constant";

export default function useCustomDataTable(
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
) {
  const ref = useRef(null);
  const refConvert = useRef(null);
  const refCol = useRef(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openColPopup, setOpenColPopup] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedValues, setSelectedValues] = useState({});
  const [activeRow, setActiveRow] = useState(false);
  const [customIconPopup, setCustomIconPopup] = useState(false);
  const [activeRowCollaps, setActiveRowCollaps] = useState(false);
  const [columns, setColumns] = useState(initialColumns);
  const [tableData, setTableData] = useState(initialTableData);
  const [sortOrder, setSortOrder] = useState({
    column: "name",
    ascending: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [convertMenu, setConverMenu] = useState(false);
  const [selectAllColumn, setSelectAllColumn] = useState(false);
  const [currentItems, setCurrentItems] = useState([]);

  const [columnState, setColumnState] = useState(
    initialColumns.reduce((acc, col) => ({ ...acc, [col.name]: col.show }), {})
  );

  useClickOutside([ref, refCol], [setActiveRow, setOpenColPopup]);

  useEffect(() => {
    if (initialTableData) {
      setCurrentItems(initialTableData);
    }
    if (selectedRows?.length === initialTableData?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, initialTableData]);

  const handleToggleAllColumns = () => {
    const updatedColumns = columns.map((col) => ({
      ...col,
      selected: !selectAllColumn,
    }));
    setColumns(updatedColumns);
    setSelectAllColumn(!selectAllColumn);
  };

  const handleToggleColumn = (fieldName) => {
    const updatedColumns = columns.map((col) => {
      if (col.name === fieldName) {
        return {
          ...col,
          selected: !col.selected,
        };
      }
      return col;
    });
    setColumns(updatedColumns);
    setColumns(
      columns.map((column) => {
        if (column.name === fieldName) {
          return { ...column, selected: !column.selected };
        }
        return column;
      })
    );
    setColumnState({ ...columnState, [fieldName]: !columnState[fieldName] });
    const allColumnsSelected = updatedColumns.every((col) => col.selected);
    setSelectAllColumn(allColumnsSelected);
  };

  const visibleColumns = columns.filter((column) => column.selected);

  const searchAllOption = [
    {
      label: "All",
      // icon: <DeleteIcon />,
      onClick: (row) => {},
    },
    {
      label: "Paid",
      // icon: <DeleteIcon />,
      onClick: (row) => {},
    },
    {
      label: "Unpaid",
      // icon: <DeleteIcon />,
      onClick: (row) => {},
    },
  ];

  // sort columns

  const handleSort = (column) => {
    const newAscending =
      sortOrder.column === column ? !sortOrder.ascending : true;

    const newTableData = [...initialTableData].sort((a, b) => {
      const result = a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0; // compare values

      return sortOrder.ascending ? result : -result; // invert result if descending
    });

    setTableData(newTableData);
    setSortOrder({ column, ascending: newAscending });
  };

  // drag drop
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newColumns = Array.from(columns);
    const [removed] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, removed);

    const newTableData = tableData?.map((row) => {
      const newRow = {};
      newColumns.forEach((column) => {
        newRow[column.name] = row[column.name];
      });
      return newRow;
    });

    setColumns(newColumns);
    setTableData(newTableData);
  };

  const handleActionClick = (action, rowData) => {
    action.onClick(rowData);
    setActiveRow(null);
  };

  const handleStatusOptionChange = (id, value) => {
    setSelectedValues({ ...selectedValues, [id]: value });
    statusAction({ ...selectedValues, [id]: value });
  };

  const getStatusOptionClassName = (statusValue, id) => {
    let className = "status_dropdown  !px-0  ";
    if (selectedValues[id]) {
      className += selectedValues[id].toLowerCase();
    } else {
      className += statusValue?.toString().toLowerCase();
    }
    return className;
  };

  // paginate
  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value);

    setTablePageSize(newItemsPerPage);

    setTablePageNum(1);
  };

  const indexOfLastItem = tablePageNum * tablePageSize;
  const indexOfFirstItem = indexOfLastItem - tablePageSize;
  let pageNumbers = [];
  const totalPages = Math.ceil(dataTotallRecords / tablePageSize);
  if (totalPages && totalPages > 0) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  // const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);

  const getPageRangeText = () => {
    const firstItemIndex = (tablePageNum - 1) * tablePageSize + 1;
    const lastItemIndex = Math.min(
      tablePageNum * tablePageSize,
      dataTotallRecords
    );
    // return `${firstItemIndex} - ${lastItemIndex} of ${tableData.length} entries`;
    return (
      <div className="text-xs font-normal not-italic leading-[18px] text-text-ultra-light-gray">
        <span className="pr-1 text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
          entries
        </span>
        <span className="text-text-dark-gray">{firstItemIndex} </span> to{" "}
        {lastItemIndex} of {dataTotallRecords} entries
      </div>
    );
  };

  const renderPageButtons = () => {
    if (pageNumbers.length <= 6) {
      return pageNumbers.map((pageNumber) => renderButton(pageNumber));
    } else {
      const lastNumber = tablePageNum > 1 ? tablePageNum + 1 : 3;
      const firstPageButtons = pageNumbers.slice(
        tablePageNum > 1 ? tablePageNum - 2 : 0,
        lastNumber
      );
      const lastPageButtons = pageNumbers.slice(-3);

      return [
        ...firstPageButtons.map((pageNumber) => renderButton(pageNumber)),

        ...(lastNumber < lastPageButtons[0]
          ? [
              <button key="dots" disabled className="dots-button">
                ...
              </button>,
              ...lastPageButtons?.map((pageNumber) => renderButton(pageNumber)),
            ]
          : lastNumber === lastPageButtons[0] ||
              lastNumber === lastPageButtons[1]
            ? lastPageButtons
                .filter((item) => item > lastNumber)
                .map((pageNumber) => renderButton(pageNumber))
            : []),
      ];
    }
  };

  const renderButton = (pageNumber) => {
    return (
      <button
        key={pageNumber}
        disabled={pageNumber === tablePageNum}
        onClick={() => setTablePageNum(pageNumber)}
        className={
          pageNumber === tablePageNum
            ? "flex h-8 flex-col items-center justify-center gap-2.5 rounded-[3px] bg-[#1D4ED8] px-2.5 py-1 text-center text-xs font-normal not-italic leading-[18px] text-white"
            : "flex h-8 flex-col items-center justify-center gap-2.5 rounded-[3px] bg-[#E4E4E4] px-2.5 py-1 text-center text-xs font-normal not-italic leading-[18px] "
        }
      >
        {pageNumber}
      </button>
    );
  };
  // row collapse

  const handleButtonClick = (row) => {
    setSelectedRow(row);
  };

  const renderCustomContent = (module) => {
    if (selectedRow) {
      switch (buttonLabel) {
        case "View History":
          return <ViewExpendiuteHistory id={selectedRow.id} />;
        case "View Data":
          return (
            <OfferAddData
              id={selectedRow.id}
              rowData={selectedRow}
              action={action}
              allData={allData}
            />
          );
        case "Add Data":
          if (module === "Delivery Notes") {
            return (
              <DeliveryNotesAddData
                id={selectedRow.id}
                rowData={selectedRow}
                action={action}
                allData={allData}
              />
            );
          } else if (module === "Invoices") {
            return (
              <InvoicesAddData
                id={selectedRow.id}
                rowData={selectedRow}
                action={action}
                allData={allData}
              />
            );
          } else {
            return (
              <OrderAddData
                id={selectedRow.id}
                rowData={selectedRow}
                action={action}
                allData={allData}
              />
            );
          }

        case "Add Datadd":
          return (
            <div>
              <h3>History for {selectedRow.firstName}:</h3>
              <p>Other content specific to the selected row...</p>
            </div>
          );
        // Add more cases for different button labels and their respective content
        default:
          return null;
      }
    }
    return null;
  };

  const renderCustomIconPopup = (row) => {
    switch (CustomIconPopup?.title) {
      case "View Summary":
        return (
          <div>
            <svg
              width="24"
              height="15"
              viewBox="0 0 24 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0.180176C7.41454 0.180176 3.25621 2.68892 0.187788 6.76379C-0.0625959 7.09763 -0.0625959 7.56404 0.187788 7.89788C3.25621 11.9777 7.41454 14.4864 12 14.4864C16.5855 14.4864 20.7438 11.9777 23.8122 7.90279C24.0626 7.56894 24.0626 7.10254 23.8122 6.7687C20.7438 2.68892 16.5855 0.180176 12 0.180176ZM12.3289 12.3704C9.28506 12.5619 6.7714 10.0531 6.96287 7.00435C7.11998 4.4907 9.15741 2.45327 11.6711 2.29616C14.7149 2.10469 17.2286 4.61344 17.0371 7.66222C16.8751 10.171 14.8377 12.2084 12.3289 12.3704ZM12.1767 10.0433C10.537 10.1464 9.18196 8.79632 9.28997 7.15655C9.37343 5.80153 10.4732 4.70672 11.8282 4.61835C13.4679 4.51525 14.823 5.86536 14.7149 7.50512C14.6266 8.86505 13.5268 9.95986 12.1767 10.0433Z"
                fill="#7E7D7D"
              />
            </svg>
          </div>
        );
      case "See History":
        return (
          <div>
            <h3>History for {selectedRow.firstName}:</h3>
            <p>Other content specific to the selected row...</p>
          </div>
        );
      case "Reminder":
        return (
          <div>
            {row &&
            row?.isReminderAttached &&
            row.status.toLowerCase() === INVOICE_STATUS.SENT.toLowerCase() ? (
              <img src="/assets/icons/reminder-icon-sent.svg" alt="reminder" />
            ) : row && row?.isReminderAttached ? (
              <img src="/assets/icons/reminder-blue-icon.svg" alt="reminder" />
            ) : (
              <img src="/assets/icons/reminder-gray-icon.svg" alt="reminder" />
            )}
          </div>
        );
      // Add more cases for different button labels and their respective content
      default:
        return null;
    }
  };

  return {
    columns,
    setColumns,
    tableData,
    setTableData,
    selectedRows,
    setSelectedRows,
    selectAll,
    setSelectAll,
    sortOrder,
    setSortOrder,
    handleSort,
    handleDragEnd,
    activeRow,
    setActiveRow,
    ref,
    handleActionClick,
    handleStatusOptionChange,
    getStatusOptionClassName,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    handleItemsPerPageChange,
    indexOfLastItem,
    indexOfFirstItem,
    currentItems,
    totalPages,
    pageNumbers,
    getPageRangeText,
    searchAllOption,
    openPopup,
    setOpenPopup,
    openColPopup,
    setOpenColPopup,
    refCol,
    columnState,
    setColumnState,
    handleToggleColumn,
    visibleColumns,
    selectedRow,
    setSelectedRow,
    handleButtonClick,
    renderCustomContent,
    activeRowCollaps,
    setActiveRowCollaps,
    renderCustomIconPopup,
    customIconPopup,
    setCustomIconPopup,
    convertMenu,
    setConverMenu,
    handleToggleAllColumns,
    selectAllColumn,
    refConvert,
    renderPageButtons,
  };
}
