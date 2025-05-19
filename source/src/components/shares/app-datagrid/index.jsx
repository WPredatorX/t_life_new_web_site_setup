"use client";

import {
  DataGrid,
  GridNoRowsOverlay,
  GridLoadingOverlay,
} from "@mui/x-data-grid";
import { APPLICATION_DEFAULT } from "@constants";

const AppDataGrid = ({
  apiRef = null,
  columns = [],
  rows = [],
  rowCount = 0,
  pageNumber = APPLICATION_DEFAULT.dataGrid.pageNumber,
  pageSize = APPLICATION_DEFAULT.dataGrid.pageSize,
  hiddenColumn = {},
  loading = false,
  rowSelection = false,
  onRowSelectionModelChange = () => {},
  rowSelectionModel = [],
  getRowId = (row) => row.id,
  onPaginationModelChange = () => {},
  onSortModelChange = () => {},
  noRowsOverlay = () => <GridNoRowsOverlay />,
  loadingOverlay = () => <GridLoadingOverlay />,
  labelDisplayedRows = ({ from, to, count }) => `${from}–${to} จาก ${count}`,
  sortField = "",
  sortDirection = "asc",
  onRowClick = () => {},
  pagination = true,
  disableColumnSorting = false,
  hideFooter = false,
  hideFooterPagination = false,
  hideFooterSelectedRowCount = false,
  disableRowSelectionOnClick = false,
  sortingMode = "server", // client
  paginationMode = "server", // client
}) => {
  return (
    <DataGrid
      apiRef={apiRef}
      rows={rows}
      getRowId={getRowId}
      rowSelection={rowSelection}
      onRowSelectionModelChange={onRowSelectionModelChange}
      rowSelectionModel={rowSelectionModel}
      columns={columns}
      loading={loading}
      rowCount={rowCount}
      onRowClick={onRowClick}
      pagination={pagination}
      disableColumnSorting={disableColumnSorting}
      initialState={{
        pagination:
          paginationMode === "server"
            ? {
                paginationModel: { page: 0, pageSize: pageSize },
              }
            : null,
        columns: {
          columnVisibilityModel: hiddenColumn,
        },
        sorting:
          sortingMode === "server"
            ? { sortModel: [{ field: sortField, sort: sortDirection }] }
            : null,
      }}
      hideFooter={hideFooter}
      hideFooterPagination={hideFooterPagination}
      hideFooterSelectedRowCount={hideFooterSelectedRowCount}
      disableColumnMenu
      disableVirtualization
      sortingOrder={["asc", "desc"]}
      sortingMode={sortingMode}
      {...(sortingMode === "server" && {
        sortModel: [{ field: sortField, sort: sortDirection }],
      })}
      paginationMode={paginationMode}
      pageSizeOptions={[...APPLICATION_DEFAULT.dataGrid.pageSizeOption]}
      {...(paginationMode === "server" && {
        paginationModel: {
          page: pageNumber,
          pageSize: pageSize,
        },
      })}
      onPaginationModelChange={onPaginationModelChange}
      onSortModelChange={onSortModelChange}
      slots={{
        noRowsOverlay: noRowsOverlay,
        loadingOverlay: loadingOverlay,
      }}
      localeText={{
        noRowsLabel: "ไม่พบข้อมูล",
        noResultsOverlayLabel: "ไม่พบข้อมูล",
      }}
      slotProps={{
        pagination: {
          labelDisplayedRows: labelDisplayedRows,
          labelRowsPerPage: "จำนวนรายการต่อหน้า",
        },
      }}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
    />
  );
};

export default AppDataGrid;
