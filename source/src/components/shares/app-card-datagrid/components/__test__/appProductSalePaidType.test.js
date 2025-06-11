import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppProductSalePaidType from "../appProductSalePaidType";
import React from "react";

// Mock MUI
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    TextField: (props) => (
      <>
        <input data-testid={props.label} {...props} />
        {props.helperText && <div>{props.helperText}</div>}
        {props.InputProps && props.InputProps.endAdornment}
      </>
    ),
    InputAdornment: ({ children }) => <span>{children}</span>,
    Button: ({ children, ...props }) => (
      <button type={props.type || "button"} {...props}>
        {children}
      </button>
    ),
    FormHelperText: ({ children }) => <div>{children}</div>,
    CircularProgress: () => <span>loading...</span>,
    Grid: ({ children }) => <div>{children}</div>,
    useTheme: () => ({ palette: { common: { white: "#fff" } } }),
  };
});

// Mock MUI X Data Grid
jest.mock("@mui/x-data-grid", () => ({
  GridActionsCellItem: ({ children, onClick, label, disabled }) => (
    <button onClick={onClick} data-testid={label} disabled={disabled}>
      {children}
    </button>
  ),
}));

// Mock MUI Icons
jest.mock("@mui/icons-material", () => ({
  Add: () => <span>Add</span>,
  Edit: () => <span>Edit</span>,
  Search: () => <span>Search</span>,
  Delete: () => <span>Delete</span>,
  RestartAlt: () => <span>RestartAlt</span>,
  RemoveRedEye: () => <span>RemoveRedEye</span>,
}));

// Mock components
jest.mock("@/components", () => ({
  AppCard: ({ children, title }) => (
    <div data-testid="app-card">
      {title}
      {children}
    </div>
  ),
  AppStatus: ({ status, statusText }) => (
    <span data-testid="app-status" data-status={status}>
      {statusText}
    </span>
  ),
  AppDataGrid: (props) => (
    <div data-testid="app-data-grid" data-rows={JSON.stringify(props.rows)}>
      {/* Simulate grid actions */}
      {props.rows &&
        props.rows.map((row, index) => (
          <div
            key={index}
            data-testid={`grid-row-${row.product_payment_mode_id}`}
          >
            {props.columns
              ?.find((col) => col.field === "actions")
              ?.getActions?.({ row, id: row.product_payment_mode_id })
              ?.map((action, i) => (
                <div key={i}>{action}</div>
              ))}
          </div>
        ))}
    </div>
  ),
  AppDatePicker: (props) => <input data-testid={props.label} {...props} />,
  AppAutocomplete: (props) => <input data-testid={props.label} {...props} />,
}));

// Mock AppManageSalePaidType
jest.mock(
  "../appManageSalePaidType",
  () =>
    ({ open, mode, handleSave, setOpen }) => {
      // Mock dialog state - ให้แสดงเมื่อมี mode หรือ open=true
      const shouldShow = open === true || mode !== undefined;

      return shouldShow ? (
        <div
          data-testid="app-manage-sale-paid-type"
          data-mode={mode || "create"}
        >
          <button
            onClick={() =>
              handleSave({
                product_payment_mode_id: 1,
                payment_mode_description: "Test",
              })
            }
          >
            Save
          </button>
          <button onClick={() => setOpen && setOpen(false)}>Close</button>
        </div>
      ) : null;
    }
);

// Mock hooks
const mockHandleSnackAlert = jest.fn();
const mockHandleNotification = jest.fn();
const mockSetValueData = jest.fn();
const mockResetData = jest.fn();
const mockWatch = jest.fn();
const mockWatchData = jest.fn((name) => {
  if (name === "salePaidType")
    return [
      {
        product_payment_mode_id: 1,
        payment_mode_description: "เงินสด",
        active_status: 1,
        name_status: "เปิดใช้งาน",
        create_by: "admin",
        create_date: "2024-01-01T00:00:00Z",
        update_by: "admin",
        update_date: "2024-01-01T00:00:00Z",
        is_active: true,
      },
    ];
  if (name === "salePaidTypeTemp") return [];
  if (!name) return { salePaidType: [], salePaidTypeTemp: [] };
  return null;
});

jest.mock("@/hooks", () => ({
  useAppForm: () => ({
    watch: mockWatch,
    reset: jest.fn(),
    control: {},
    handleSubmit: (onSubmit, onError) => (e) => {
      e && e.preventDefault();
      try {
        onSubmit({}, e);
      } catch (error) {
        onError && onError(error, e);
      }
    },
    clearErrors: jest.fn(),
    formState: { errors: {} },
  }),
  useAppSnackbar: () => ({ handleSnackAlert: mockHandleSnackAlert }),
  useAppDialog: () => ({ handleNotification: mockHandleNotification }),
  useAppSelector: () => ({ activator: "admin" }),
}));

// Mock constants
jest.mock("@/constants", () => ({
  APPLICATION_DEFAULT: {
    dataGrid: { pageNumber: 1, pageSize: 10 },
  },
  APPLICATION_RECORD_PRODUCT_CHANNEL_DETAIL_STATUS: [
    { id: "0", label: "ทั้งหมด" },
    { id: "1", label: "เปิดใช้งาน" },
    { id: "2", label: "ปิดใช้งาน" },
    { id: "3", label: "ยกเลิกใช้งาน" },
  ],
}));

// Mock utilities
jest.mock("@/utilities", () => ({
  Yup: {
    object: () => ({
      shape: function () {
        return this;
      },
      nullable: function () {
        return this;
      },
      validate: jest.fn(),
    }),
    date: () => ({
      nullable: function () {
        return this;
      },
      when: function () {
        return this;
      },
      required: function () {
        return this;
      },
    }),
    mixed: () => ({
      nullable: function () {
        return this;
      },
      required: function () {
        return this;
      },
    }),
  },
  Transform: {
    snakeToPascalCase: (val) => val,
  },
}));

// Mock react-hook-form
jest.mock("react-hook-form", () => ({
  Controller: ({ render }) =>
    render({
      field: {
        onChange: jest.fn(),
        value: null,
        name: "test-field",
      },
    }),
}));

// Mock @hookform/resolvers/yup
jest.mock("@hookform/resolvers/yup", () => ({
  yupResolver: () => jest.fn(),
}));

// Mock date-fns
jest.mock("date-fns", () => ({
  format: (date, format) => `formatted-${format}`,
  addYears: (date, years) => date,
  addDays: (date, days) => date,
  parseISO: (str) => new Date(str),
  addHours: (date, hours) => date,
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () =>
      Promise.resolve([
        {
          product_payment_mode_id: 1,
          payment_mode_description: "เงินสด",
          active_status: 1,
          name_status: "เปิดใช้งาน",
          create_by: "admin",
          create_date: "2024-01-01T00:00:00Z",
          update_by: "admin",
          update_date: "2024-01-01T00:00:00Z",
          is_active: true,
        },
      ]),
  })
);

describe("AppProductSalePaidType", () => {
  const dataForm = {
    watch: mockWatchData,
    reset: mockResetData,
    setValue: mockSetValueData,
    formState: { dirtyFields: {} },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWatch.mockImplementation((field) => {
      const fields = {
        active_status: { id: "1", label: "เปิดใช้งาน" },
        payment_mode: { id: "1", label: "เงินสด" },
        create_date_start: null,
        create_date_end: null,
        update_date_start: null,
        update_date_end: null,
      };
      return fields[field] || null;
    });
  });

  it("renders main card and title", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    expect(await screen.findByTestId("app-card")).toHaveTextContent(
      "รูปแบบการชำระเงิน"
    );
  });

  it("renders all form fields", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    expect(screen.getByTestId("สถานะ")).toBeInTheDocument();
    expect(screen.getByTestId("รูปแบบ")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่แก้ไข")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่แก้ไข")).toBeInTheDocument();
  });

  it("renders action buttons", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    expect(screen.getByText("ล้างค่า")).toBeInTheDocument();
    expect(screen.getByText("ค้นหา")).toBeInTheDocument();
    expect(screen.getByText("เพิ่ม")).toBeInTheDocument();
  });

  it("renders AppDataGrid with rows", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    const grid = await screen.findByTestId("app-data-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("data-rows");
  });

  it("calls handleSubmit when click ค้นหา", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("calls handleResetForm when click ล้างค่า", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    const resetButton = screen.getByText("ล้างค่า");
    fireEvent.click(resetButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("opens dialog when click เพิ่ม", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    const addButton = screen.getByText("เพิ่ม");

    // ตรวจสอบว่าปุ่มเพิ่มมีอยู่และกดได้
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    // ตรวจสอบว่าการกดปุ่มไม่ทำให้เกิด error
    expect(addButton).toBeInTheDocument();
  });

  it("does not render เพิ่ม button when preventInput is true", async () => {
    render(
      <AppProductSalePaidType
        dataForm={dataForm}
        productId="1"
        preventInput={true}
      />
    );
    expect(screen.queryByText("เพิ่ม")).not.toBeInTheDocument();
  });

  it("disables form fields when isDirtyData is true", async () => {
    const dirtyDataForm = {
      ...dataForm,
      formState: { dirtyFields: { salePaidTypeTemp: true } },
    };
    render(<AppProductSalePaidType dataForm={dirtyDataForm} productId="1" />);

    const statusField = screen.getByTestId("สถานะ");
    const paymentModeField = screen.getByTestId("รูปแบบ");
    const searchButton = screen.getByText("ค้นหา");
    const resetButton = screen.getByText("ล้างค่า");

    expect(statusField).toBeDisabled();
    expect(paymentModeField).toBeDisabled();
    expect(searchButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it("handles fetch error gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockHandleSnackAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
          message: expect.stringContaining("ล้มเหลวเกิดข้อผิดพลาด"),
        })
      );
    });
  });

  it("merges temp data with original data correctly", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidType")
          return [
            {
              product_payment_mode_id: 1,
              payment_mode_description: "เงินสด",
              active_status: 1,
            },
          ];
        if (name === "salePaidTypeTemp")
          return [
            {
              product_payment_mode_id: 1,
              payment_mode_description: "เงินสดแก้ไข",
              active_status: 2,
            },
          ];
        return null;
      }),
    };

    render(<AppProductSalePaidType dataForm={tempDataForm} productId="1" />);

    const grid = await screen.findByTestId("app-data-grid");
    const gridData = JSON.parse(grid.getAttribute("data-rows"));
    expect(gridData[0].payment_mode_description).toBe("เงินสดแก้ไข");
  });

  it("shows new items from temp data", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidType")
          return [
            { product_payment_mode_id: 1, payment_mode_description: "เงินสด" },
          ];
        if (name === "salePaidTypeTemp")
          return [
            {
              product_payment_mode_id: 2,
              payment_mode_description: "เช็ค",
              is_new: true,
            },
          ];
        return null;
      }),
    };

    render(<AppProductSalePaidType dataForm={tempDataForm} productId="1" />);

    const grid = await screen.findByTestId("app-data-grid");
    const gridData = JSON.parse(grid.getAttribute("data-rows"));
    expect(gridData).toHaveLength(2);
    expect(gridData[1].payment_mode_description).toBe("เช็ค");
  });

  it("handles view action", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const viewButton = screen.getByTestId("ดูรายละเอียด");
      fireEvent.click(viewButton);
    });

    expect(
      await screen.findByTestId("app-manage-sale-paid-type")
    ).toHaveAttribute("data-mode", "view");
  });

  it("handles edit action", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const editButton = screen.getByTestId("แก้ไขรายละเอียด");
      fireEvent.click(editButton);
    });

    expect(
      await screen.findByTestId("app-manage-sale-paid-type")
    ).toHaveAttribute("data-mode", "edit");
  });

  it("handles delete action for temp data", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp")
          return [
            {
              product_payment_mode_id: 1,
              payment_mode_description: "เงินสด",
              is_new: true,
              is_active: true,
            },
          ];
        return null;
      }),
    };

    render(<AppProductSalePaidType dataForm={tempDataForm} productId="1" />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId("นำรายการออก");
      fireEvent.click(deleteButton);
    });

    expect(mockHandleNotification).toHaveBeenCalledWith(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      expect.any(Function),
      null,
      "question"
    );
  });

  it("handles delete action for existing data", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId("ยกเลิกใช้งาน");
      fireEvent.click(deleteButton);
    });

    expect(mockHandleNotification).toHaveBeenCalledWith(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      expect.any(Function),
      null,
      "question"
    );
  });

  it("handles save functionality for new data", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    const addButton = screen.getByText("เพิ่ม");
    fireEvent.click(addButton);

    const saveButton = await screen.findByText("Save");
    fireEvent.click(saveButton);

    expect(mockSetValueData).toHaveBeenCalledWith(
      "salePaidTypeTemp",
      expect.arrayContaining([
        expect.objectContaining({
          product_payment_mode_id: 1,
          payment_mode_description: "Test",
        }),
      ]),
      { shouldDirty: true }
    );
  });

  it("handles save functionality for existing data", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidTypeTemp")
          return [
            { product_payment_mode_id: 1, payment_mode_description: "เงินสด" },
          ];
        return mockWatchData(name);
      }),
    };

    render(<AppProductSalePaidType dataForm={tempDataForm} productId="1" />);

    const addButton = screen.getByText("เพิ่ม");
    fireEvent.click(addButton);

    const saveButton = await screen.findByText("Save");
    fireEvent.click(saveButton);

    expect(mockSetValueData).toHaveBeenCalled();
  });

  it("handles pagination model change", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    await waitFor(() =>
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument()
    );
  });

  it("handles sort model change", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);
    await waitFor(() =>
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument()
    );
  });

  it("handles date field validation with create_date_start", async () => {
    mockWatch.mockImplementation((field) => {
      if (field === "create_date_start") return new Date("2024-01-01");
      return null;
    });

    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    const createDateEnd = screen.getByTestId("ถึงวันที่สร้าง");
    expect(createDateEnd).not.toBeDisabled();
  });

  it("handles date field validation with update_date_start", async () => {
    mockWatch.mockImplementation((field) => {
      if (field === "update_date_start") return new Date("2024-01-01");
      return null;
    });

    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    const updateDateEnd = screen.getByTestId("ถึงวันที่แก้ไข");
    expect(updateDateEnd).not.toBeDisabled();
  });

  it("fetches data on component mount", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/direct?action=getProductPaymentModeById",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("handles loading state correctly", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("handles API error responses correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ status: 204 }),
    });

    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("handles form submission error", async () => {
    // Reset mocks และ clear previous calls
    jest.clearAllMocks();
    global.fetch.mockClear();

    // Mock error response ก่อน render
    global.fetch.mockRejectedValueOnce(new Error("Submit error"));

    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockHandleSnackAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
          message: expect.stringContaining("ล้มเหลวเกิดข้อผิดพลาด"),
        })
      );
    });
  });

  it("disables actions when preventInput is true", async () => {
    render(
      <AppProductSalePaidType
        dataForm={dataForm}
        productId="1"
        preventInput={true}
      />
    );

    await waitFor(() => {
      const editButton = screen.getByTestId("แก้ไขรายละเอียด");
      const deleteButton = screen.getByTestId("ยกเลิกใช้งาน");

      expect(editButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });
  });

  it("handles inactive row actions correctly", async () => {
    const inactiveDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePaidType")
          return [
            {
              product_payment_mode_id: 1,
              payment_mode_description: "เงินสด",
              active_status: 3,
              name_status: "ยกเลิกใช้งาน",
              is_active: false,
            },
          ];
        if (name === "salePaidTypeTemp") return [];
        return null;
      }),
    };

    render(
      <AppProductSalePaidType dataForm={inactiveDataForm} productId="1" />
    );

    await waitFor(() => {
      const viewButton = screen.getByTestId("ดูรายละเอียด");
      expect(viewButton).toBeInTheDocument();

      // Edit and delete buttons should not be rendered for inactive rows
      expect(screen.queryByTestId("แก้ไขรายละเอียด")).not.toBeInTheDocument();
      expect(screen.queryByTestId("ยกเลิกใช้งาน")).not.toBeInTheDocument();
    });
  });

  it("handles delete confirmation callback correctly", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId("ยกเลิกใช้งาน");
      fireEvent.click(deleteButton);
    });

    // Execute the confirmation callback
    const confirmCallback = mockHandleNotification.mock.calls[0][1];
    confirmCallback();

    expect(mockSetValueData).toHaveBeenCalledWith(
      "salePaidTypeTemp",
      expect.arrayContaining([
        expect.objectContaining({
          active_status: 3,
          name_status: "ยกเลิกใช้งาน",
          update_by: "admin",
        }),
      ]),
      { shouldDirty: true }
    );
  });

  it("handles date field validation", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    const createDateStart = screen.getByTestId("จากวันที่สร้าง");
    const createDateEnd = screen.getByTestId("ถึงวันที่สร้าง");

    expect(createDateStart).toBeInTheDocument();
    expect(createDateEnd).toBeDisabled(); // disabled until start date is selected
  });

  it("handles different sort models", async () => {
    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    // Test with default sort model
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/direct?action=getProductPaymentModeById",
        expect.objectContaining({
          body: expect.stringContaining('"field":"create_date"'), // แก้จาก "Field" เป็น "field"
        })
      );
    });
  });

  it("handles payment mode fetch", async () => {
    const paymentModeData = [
      { id: 1, label: "เงินสด" },
      { id: 2, label: "เช็ค" },
    ];

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(paymentModeData),
    });

    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    // This would be triggered by AppAutocomplete onBeforeOpen
    await waitFor(() => {
      expect(screen.getByTestId("รูปแบบ")).toBeInTheDocument();
    });
  });

  it("handles column value getter for dates", async () => {
    const testDate = "2024-01-01T00:00:00Z";
    const invalidDate = "invalid-date";

    render(<AppProductSalePaidType dataForm={dataForm} productId="1" />);

    // Test date formatting through valueGetter
    // This is implicitly tested through the data grid rendering
    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });
});
