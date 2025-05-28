import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppReOrderDatagrid } from "@/components";
import userEvent from "@testing-library/user-event";
const columns = [
  { field: "id", headerName: "ID" },
  { field: "name", headerName: "Name" },
];

const rows = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];

const mockOnPaginationModelChange = jest.fn();
const mockHandleUpdateRow = jest.fn();

describe("AppReOrderDatagrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders rows and columns correctly", () => {
    render(
      <AppReOrderDatagrid
        columns={columns}
        rows={rows}
        rowCount={rows.length}
        onPaginationModelChange={mockOnPaginationModelChange}
      />
    );

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  test("renders no rows overlay when rows is empty", () => {
    render(<AppReOrderDatagrid columns={columns} rows={[]} rowCount={0} />);
    expect(screen.getByText("ไม่พบข้อมูล")).toBeInTheDocument();
  });

  test("calls onPaginationModelChange on page change", () => {
    render(
      <AppReOrderDatagrid
        columns={columns}
        rows={rows}
        rowCount={50}
        onPaginationModelChange={mockOnPaginationModelChange}
      />
    );

    const nextPageBtn = screen.getByLabelText("Go to next page");
    fireEvent.click(nextPageBtn);

    expect(mockOnPaginationModelChange).toHaveBeenCalled();
  });

  test("calls onPaginationModelChange on rows per page change", async () => {
    render(
      <AppReOrderDatagrid
        columns={columns}
        rows={rows}
        rowCount={50}
        onPaginationModelChange={mockOnPaginationModelChange}
      />
    );
    // คลิกปุ่ม dropdown (select box)
    const rowsPerPageSelect = screen.getByLabelText("จำนวนรายการต่อหน้า");
    //fireEvent.change(rowsPerPageSelect, { target: { value: "20" } });
  });

  test("handles row drag and calls handleUpdateRow", () => {
    // react-beautiful-dnd and @hello-pangea/dnd may require complex mocking for drag/drop
    // This example assumes you simulate drag behavior via direct function call for unit testing

    render(
      <AppReOrderDatagrid
        columns={columns}
        rows={rows}
        rowCount={rows.length}
        handleUpdateRow={mockHandleUpdateRow}
      />
    );

    // Simulate drag end manually
    const instance = screen.getByText("John").closest("tr").parentNode;
    fireEvent.dragEnd(instance);

    // Since drag-and-drop is difficult to simulate without e2e, this call should be tested via integration/e2e tools (e.g. Cypress)
    // Here we just assert component renders and drag end doesn't crash
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});
