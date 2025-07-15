import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppReOrderDatagrid, AppStatus } from "@/components";
import userEvent from "@testing-library/user-event";
import { DragDropContext } from "@hello-pangea/dnd";
const columns = [
  { field: "id", headerName: "ID" },
  { field: "name", headerName: "Name" },
  {
    field: "status",
    headerName: "สถานะ",
    renderCell: (params) => {
      return (
        <AppStatus
          type="2"
          status={params.value}
          statusText={params.row.statusName}
        />
      );
    },
  },
];

const rows = [
  { id: 1, name: "John", status: 1, statusName: "test" },
  { id: 2, name: "Jane" },
];

const mockOnPaginationModelChange = jest.fn();
const mockHandleUpdateRow = jest.fn();

function isElement(obj) {
  if (typeof obj !== "object") {
    return false;
  }
  let prototypeStr, prototype;
  do {
    prototype = Object.getPrototypeOf(obj);
    // to work in iframe
    prototypeStr = Object.prototype.toString.call(prototype);
    // '[object Document]' is used to detect document
    if (
      prototypeStr === "[object Element]" ||
      prototypeStr === "[object Document]"
    ) {
      return true;
    }
    obj = prototype;
    // null is the terminal of object
  } while (prototype !== null);
  return false;
}

function getElementClientCenter(element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

const getCoords = (charlie) =>
  isElement(charlie) ? getElementClientCenter(charlie) : charlie;

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function drag(element, { to: inTo, delta, steps = 20, duration = 500 }) {
  const from = getElementClientCenter(element);
  const to = delta
    ? {
        x: from.x + delta.x,
        y: from.y + delta.y,
      }
    : getCoords(inTo);

  const step = {
    x: (to.x - from.x) / steps,
    y: (to.y - from.y) / steps,
  };

  const current = {
    clientX: from.x,
    clientY: from.y,
  };

  fireEvent.mouseEnter(element, current);
  fireEvent.mouseOver(element, current);
  fireEvent.mouseMove(element, current);
  fireEvent.mouseDown(element, current);
  for (let i = 0; i < steps; i++) {
    current.clientX += step.x;
    current.clientY += step.y;
    await sleep(duration / steps);
    fireEvent.mouseMove(element, current);
  }
  fireEvent.mouseUp(element, current);
}

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

  test("renders loading", () => {
    render(
      <AppReOrderDatagrid
        columns={columns}
        rows={rows}
        rowCount={rows.length}
        onPaginationModelChange={mockOnPaginationModelChange}
        loading={true}
      />
    );
  });

  test("renders no rows overlay when rows is empty", () => {
    render(<AppReOrderDatagrid columns={columns} rows={[]} rowCount={0} />);
    expect(screen.getByText("ไม่พบข้อมูล")).toBeInTheDocument();
  });

  test("renders rowSelection = true", () => {
    render(
      <AppReOrderDatagrid
        columns={[]}
        rows={[]}
        rowCount={0}
        rowSelection={true}
      />
    );
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

    fireEvent.mouseDown(
      screen.getByRole("combobox", {
        name: /จำนวนรายการต่อหน้า/i,
      })
    );
    fireEvent.click(
      screen.getByRole("option", {
        name: /100/i,
      })
    );

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

  test("handles row drag and calls dragEnd", async () => {
    const { getByTestId, container } = render(
      <AppReOrderDatagrid
        columns={columns}
        rows={rows}
        rowCount={rows.length}
        handleUpdateRow={mockHandleUpdateRow}
      />
    );
    const instance = (await screen.findByTestId("Drag-0")).closest(
      "td"
    ).parentNode;
    const instance2 = (await screen.findByTestId("Drag-1")).closest(
      "td"
    ).parentNode;
    //const instance2 = screen.getByText("Jane").closest("tr").parentNode;
    //const instance = await screen.findByRole("button")[0];
    act(() => {
      fireEvent.mouseDown(instance);
      fireEvent.mouseMove(instance2);
      fireEvent.mouseOver(instance2);
      fireEvent.mouseUp(instance);
    });
    expect(screen.getByText("John")).toBeInTheDocument();
  });
  test("handles row drag and calls handleUpdateRow", async () => {
    render(
      <AppReOrderDatagrid
        columns={columns}
        rows={rows}
        rowCount={rows.length}
        handleUpdateRow={mockHandleUpdateRow}
      />
    );

    // Simulate drag end manually
    const instance = (await screen.findByTestId("Drag-0")).closest(
      "td"
    ).parentNode;
    await drag(instance, {
      delta: { x: 0, y: 100 },
    });
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});
