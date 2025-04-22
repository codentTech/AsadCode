import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import UseCustomTableHook from './use-custom-table.hook';
import CustomPagination from '../paginations/pagination.component';

export default function CustomTable({ columns, rows }) {
  const { open, setOpen, handleToggleColumn, handleManageColumns, handlePageChange } =
    UseCustomTableHook();

  function noResultsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        No results in DataGrid
        <pre>(rows=&#123;rowData&#125;)</pre>
        But local filter returns no result
      </Stack>
    );
  }

  const updatedRows = rows.map((row) => ({
    ...row,
    companyAddress: row.companyAddress?.map((company) => company.addressLabel).join(', ') // Assuming the company object has a "description" property
  }));

  return (
    <DataGrid
    className="tableRows"
      rows={updatedRows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10
          }
        }
      }}
      slots={{ NoRowsOverlay: noResultsOverlay }}
      onPageChange={handlePageChange}
      checkboxSelection
      disableColumnMenu
      disableRowSelectionOnClick
      components={{ Footer: CustomPagination }}
    >
      <CustomPagination data={rows} />
    </DataGrid>
  );
}
CustomTable.propTypes = {
  columns: PropTypes.arrayOf,
  rows: PropTypes.arrayOf
};
