"use client";

import {
  DataGrid,
  GridNoRowsOverlay,
  GridLoadingOverlay,
} from "@mui/x-data-grid";
import { APPLICATION_DEFAULT } from "@constants";

const AppDataGrid = ({
  columns = [],
  rows = [],
  rowCount = 0,
  pageNumber = APPLICATION_DEFAULT.dataGrid.pageNumber,
  pageSize = APPLICATION_DEFAULT.dataGrid.pageSize,
  hiddenColumn = {},
  loading = false,
  rowSelection = false,
  getRowId = (row) => row.id,
  onPaginationModelChange = () => {},
  onSortModelChange = () => {},
  noRowsOverlay = () => <GridNoRowsOverlay />,
  loadingOverlay = () => <GridLoadingOverlay />,
  labelDisplayedRows = ({ from, to, count }) => `${from}–${to} จาก ${count}`,
  sortField = "",
  sortDirection = "asc",
  onRowClick = {},
}) => {
  return (
    <DataGrid
      rows={rows}
      getRowId={getRowId}
      rowSelection={rowSelection}
      columns={columns}
      loading={loading}
      rowCount={rowCount}
      onRowClick={onRowClick}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: pageSize },
        },
        columns: {
          columnVisibilityModel: hiddenColumn,
        },
        sorting: { sortModel: [{ field: sortField, sort: sortDirection }] },
      }}
      disableColumnMenu
      disableVirtualization
      sortModel={[{ field: sortField, sort: sortDirection }]}
      sortingMode="server"
      paginationMode="server"
      pageSizeOptions={[...APPLICATION_DEFAULT.dataGrid.pageSizeOption]}
      paginationModel={{
        page: pageNumber,
        pageSize: pageSize,
      }}
      onPaginationModelChange={onPaginationModelChange}
      onSortModelChange={onSortModelChange}
      slots={{
        noRowsOverlay: noRowsOverlay,
        loadingOverlay: loadingOverlay,
      }}
      slotProps={{
        pagination: {
          labelDisplayedRows: labelDisplayedRows,
          labelRowsPerPage: "จำนวนรายการต่อหน้า",
        },
      }}
    />
  );
};

export default AppDataGrid;
