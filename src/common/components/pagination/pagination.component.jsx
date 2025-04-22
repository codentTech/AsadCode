import useLineItem from "@/components/offer/create/line-item/use-line-item.hook";
import { useState, useEffect } from "react";
// import usePagination from './pagination.hook';

const DynamicPagination = ({ itemsPerPage, data, setData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  //   const { data, setData } = useLineItem({});

  useEffect(() => {
    // Calculate the total number of pages based on the data length and items per page
    const totalPagesCount = Math.ceil(data.length / itemsPerPage);
    setCurrentPage(1); // Reset the current page to the first page
    setTotalPages(totalPagesCount);
  }, [data, itemsPerPage]);

  const displayData = data.slice(startIndex, endIndex);
  //   setData(displayData)
  console.log(displayData);

  const handlePagination = (pageNumber) => {
    // Check if the requested page number is within the valid range
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setData(displayData);
    }
  };

  return (
    <div>
      {/* Render the displayed data */}
      {displayData.map((item) => (
        <div key={item.id}>{item.description}</div>
      ))}

      {/* Render pagination controls */}
      <div className="flex justify-between">
        <div></div>
        <div className="flex gap-4">
          {" "}
          <button
            onClick={() => handlePagination(currentPage - 1)}
            className="flex w-11 flex-row items-center justify-center bg-[#E4E4E4] px-2.5 py-1"
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePagination(index + 1)}
              //   style={{ fontWeight: currentPage === index + 1 ? 'bold' : 'normal' }}
              className={`flex flex-row items-center justify-center px-2.5 py-1 ${
                currentPage === index + 1
                  ? "bg-primary text-white"
                  : "bg-[#E4E4E4]"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePagination(currentPage + 1)}
            className="flex w-11 flex-row items-center justify-center bg-[#E4E4E4] px-2.5 py-1"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicPagination;
