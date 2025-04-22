'use client';

import { useState } from 'react';

export default function UseCustomTableHook() {
  const initialColumnState = {
    id: true,
    firstName: true,
    lastName: true,
    age: true
  };
  const [columnState, setColumnState] = useState(initialColumnState);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (params) => {
    setCurrentPage(params.page);
  };

  const handleToggleColumn = (columnName) => {
    setColumnState({
      ...columnState,
      [columnName]: !columnState[columnName]
    });
  };

  const handleManageColumns = () => {
    setOpen(true);
  };
  return {
    columnState,
    setColumnState,
    open,
    setOpen,
    handleToggleColumn,
    handleManageColumns,
    handlePageChange
  };
}
