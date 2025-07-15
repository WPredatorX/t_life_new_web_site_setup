import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TablePagination,
  Grid,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { APPLICATION_DEFAULT } from "@/constants";

// Example overlays (replace these with your actual components)
const GridNoRowsOverlay = () => <div>ไม่พบข้อมูล</div>;
const GridLoadingOverlay = () => <div>Loading...</div>;

// APPLICATION_DEFAULT should be defined in your project.

function CustomDataGrid({
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
  handleUpdateRow = () => {},
}) {
  // Local state for rows (to enable reordering)
  const [localRows, setLocalRows] = useState(rows);

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  // Handle drag end for row reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedRows = Array.from(localRows);
    const [removed] = updatedRows.splice(result.source.index, 1);
    updatedRows.splice(result.destination.index, 0, removed);
    handleUpdateRow(updatedRows);
    setLocalRows(updatedRows);
  };

  // Pagination handlers call the provided onPaginationModelChange
  const handleChangePage = (event, newPage) => {
    onPaginationModelChange({ pageNumber: newPage, pageSize });
  };

  const handleChangeRowsPerPage = (event) => {
    onPaginationModelChange({
      pageNumber: 0,
      pageSize: parseInt(event.target.value, 10),
    });
  };

  // Filter out hidden columns; if hiddenColumn[field] is false, omit that column.
  const visibleColumns = columns.filter(
    (col) => hiddenColumn[col.field] !== false
  );
  const renderCell = (col, row) => {
    return col.renderCell({
      value: row[col.field],
      row: row,
    });
  };
  // Calculate total columns count for overlay colspan: 1 for drag handle + 1 for selection (if any) + visible columns length.
  const totalColumns = visibleColumns.length + 1 + (rowSelection ? 1 : 0);

  return (
    <Grid container>
      <Grid item xs={12}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {/* Drag handle header */}
                  <TableCell sx={{ width: 50 }} />
                  {rowSelection && <TableCell />}
                  {visibleColumns.map((col) => (
                    <TableCell style={{ color: "white" }} key={col.field}>
                      {col.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <TableBody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {loading ? (
                      <TableRow sx={{ height: "104px" }}>
                        <TableCell colSpan={totalColumns} align="center">
                          {loadingOverlay()}
                        </TableCell>
                      </TableRow>
                    ) : localRows.length === 0 ? (
                      <TableRow sx={{ height: "104px" }}>
                        <TableCell colSpan={totalColumns} align="center">
                          {noRowsOverlay()}
                        </TableCell>
                      </TableRow>
                    ) : (
                      localRows.map((row, index) => {
                        const rowId = getRowId(row);
                        return (
                          <Draggable
                            key={rowId}
                            draggableId={rowId.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                {/* Drag handle cell */}
                                <TableCell {...provided.dragHandleProps}>
                                  <IconButton size="small">
                                    <DragIndicatorIcon
                                      data-testid={`Drag-${index}`}
                                    />
                                  </IconButton>
                                </TableCell>
                                {rowSelection && (
                                  <TableCell>
                                    <Checkbox checked={false} />
                                  </TableCell>
                                )}
                                {visibleColumns.map((col) => {
                                  return (
                                    <TableCell key={col.field}>
                                      {col.renderCell
                                        ? renderCell(col, row)
                                        : row[col.field]}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            )}
                          </Draggable>
                        );
                      })
                    )}

                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </Table>
          </TableContainer>
        </DragDropContext>
      </Grid>
      <Grid item xs={12}>
        {/* Render loading overlay if loading */}
        {rowCount !== 0 && !hideFooter && (
          <TablePagination
            component="div"
            count={rowCount}
            page={pageNumber}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={APPLICATION_DEFAULT.dataGrid.pageSizeOption}
            labelRowsPerPage="จำนวนรายการต่อหน้า"
            labelDisplayedRows={labelDisplayedRows}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default CustomDataGrid;
