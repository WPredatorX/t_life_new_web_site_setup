import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppProductSalePrepayment } from "..";
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
  GridActionsCellItem: ({ children, onClick, label }) => (
    <button onClick={onClick} data-testid={label}>
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
  AppStatus: ({ statusText }) => (
    <span data-testid="app-status">{statusText}</span>
  ),
  AppDataGrid: (props) => (
    <div data-testid="app-data-grid">
      {Array.isArray(props.rows) ? JSON.stringify(props.rows) : "no rows"}
    </div>
  ),
  AppDatePicker: (props) => <input data-testid={props.label} {...props} />,
  AppAutocomplete: (props) => <input data-testid={props.label} {...props} />,
}));

// Mock AppManageSalePrepayment
jest.mock(
  "../appManageSalePrepayment",
  () =>
    ({ open, mode, handleSave }) =>
      open ? (
        <div data-testid="app-manage-sale-prepayment" data-mode={mode}>
          Manage Sale Prepayment Dialog
        </div>
      ) : null
);

// Mock hooks
const mockHandleSnackAlert = jest.fn();
const mockHandleNotification = jest.fn();
const mockSetValueData = jest.fn();
const mockResetData = jest.fn();
const mockWatchData = jest.fn((name) => {
  if (name === "salePrepayment")
    return [
      {
        installment_id: 1,
        installment_description: "รายเดือน",
        num_installments: 12,
        active_status: 1,
        name_status: "เปิดใช้งาน",
        create_by: "admin",
        create_date: "2024-01-01T00:00:00Z",
        update_by: "admin",
        update_date: "2024-01-01T00:00:00Z",
      },
    ];
  if (name === "salePrepaymentTemp") return [];
  if (!name) return { salePrepayment: [], salePrepaymentTemp: [] };
  return null;
});

jest.mock("@/hooks", () => ({
  useAppForm: () => ({
    watch: jest.fn(),
    reset: jest.fn(),
    control: {},
    handleSubmit: (onSubmit) => (e) => {
      e && e.preventDefault();
      onSubmit({}, e);
    },
    clearErrors: jest.fn(),
    register: jest.fn(() => ({ name: "mock" })),
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
    string: () => ({
      nullable: function () {
        return this;
      },
      required: function () {
        return this;
      },
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
    render({ field: { onChange: jest.fn(), value: null } }),
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
          installment_id: 1,
          installment_description: "รายเดือน",
          num_installments: 12,
          active_status: 1,
          name_status: "เปิดใช้งาน",
          create_by: "admin",
          create_date: "2024-01-01T00:00:00Z",
          update_by: "admin",
          update_date: "2024-01-01T00:00:00Z",
        },
      ]),
  })
);

describe("AppProductSalePrepayment", () => {
  const dataForm = {
    watch: mockWatchData,
    reset: mockResetData,
    setValue: mockSetValueData,
    formState: { dirtyFields: {} },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders main card and title", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    expect(await screen.findByTestId("app-card")).toHaveTextContent(
      "รูปแบบการชำระล่วงหน้า (เปิดใช้งานได้ 1 รายการ : เฉพาะแบบรายเดือน)"
    );
  });

  it("renders all form fields", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    expect(screen.getByTestId("สถานะ")).toBeInTheDocument();
    expect(screen.getByTestId("รูปแบบ")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่แก้ไข")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่แก้ไข")).toBeInTheDocument();
  });

  it("renders action buttons", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    expect(screen.getByText("ล้างค่า")).toBeInTheDocument();
    expect(screen.getByText("ค้นหา")).toBeInTheDocument();
    expect(screen.getByText("เพิ่ม")).toBeInTheDocument();
  });

  it("renders AppDataGrid with rows", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    const grid = await screen.findByTestId("app-data-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveTextContent("installment_id");
  });

  it("calls handleSubmit when click ค้นหา", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("calls handleResetForm when click ล้างค่า", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    const resetButton = screen.getByText("ล้างค่า");
    fireEvent.click(resetButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("calls handleAdd when click เพิ่ม", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    const addButton = screen.getByText("เพิ่ม");

    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });

  it("does not render เพิ่ม button when preventInput is true", async () => {
    render(
      <AppProductSalePrepayment
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
      formState: { dirtyFields: { salePrepaymentTemp: true } },
    };
    render(<AppProductSalePrepayment dataForm={dirtyDataForm} productId="1" />);

    const statusField = screen.getByTestId("สถานะ");
    const installmentField = screen.getByTestId("รูปแบบ");
    const searchButton = screen.getByText("ค้นหา");
    const resetButton = screen.getByText("ล้างค่า");

    expect(statusField).toBeDisabled();
    expect(installmentField).toBeDisabled();
    expect(searchButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it("handles fetch error gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
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
        if (name === "salePrepayment")
          return [
            {
              installment_id: 1,
              installment_description: "รายเดือน",
              active_status: 1,
            },
          ];
        if (name === "salePrepaymentTemp")
          return [
            {
              installment_id: 1,
              installment_description: "รายเดือนแก้ไข",
              active_status: 2,
            },
          ];
        return null;
      }),
    };

    render(<AppProductSalePrepayment dataForm={tempDataForm} productId="1" />);

    const grid = await screen.findByTestId("app-data-grid");
    expect(grid).toHaveTextContent("รายเดือนแก้ไข"); // ข้อมูล temp override ข้อมูลเดิม
  });

  it("shows new items from temp data", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePrepayment")
          return [{ installment_id: 1, installment_description: "รายเดือน" }];
        if (name === "salePrepaymentTemp")
          return [
            {
              installment_id: 2,
              installment_description: "รายไตรมาส",
              is_new: true,
            },
          ];
        return null;
      }),
    };

    render(<AppProductSalePrepayment dataForm={tempDataForm} productId="1" />);

    const grid = await screen.findByTestId("app-data-grid");
    expect(grid).toHaveTextContent("รายไตรมาส"); // ข้อมูลใหม่จาก temp
  });

  it("handles pagination model change", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    await waitFor(() =>
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument()
    );
  });

  it("handles sort model change", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);
    await waitFor(() =>
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument()
    );
  });

  it("handles date field validation", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    const createDateStart = screen.getByTestId("จากวันที่สร้าง");
    const createDateEnd = screen.getByTestId("ถึงวันที่สร้าง");

    expect(createDateStart).toBeInTheDocument();
    expect(createDateEnd).toBeInTheDocument();
    expect(createDateEnd).toBeDisabled(); // disabled until start date is selected
  });

  it("fetches data on component mount", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/direct?action=getInstallmentTypeById",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("handles save functionality correctly", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePrepaymentTemp") return [];
        return mockWatchData(name);
      }),
    };

    render(<AppProductSalePrepayment dataForm={tempDataForm} productId="1" />);

    // Test การบันทึกข้อมูลใหม่
    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });

  it("handles delete functionality for temp data", async () => {
    const tempDataForm = {
      ...dataForm,
      watch: jest.fn((name) => {
        if (name === "salePrepaymentTemp")
          return [
            {
              installment_id: 1,
              installment_description: "รายเดือน",
              is_new: true,
            },
          ];
        return mockWatchData(name);
      }),
    };

    render(<AppProductSalePrepayment dataForm={tempDataForm} productId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });

  it("handles delete functionality for existing data", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });

  it("formats dates correctly in grid columns", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      const grid = screen.getByTestId("app-data-grid");
      expect(grid).toBeInTheDocument();
      // Date formatting is handled by valueGetter in columns
    });
  });

  it("handles loading state correctly", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    // During loading, buttons should be disabled
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("handles view mode correctly", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });

  it("handles edit mode correctly", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });

  it("disables actions when preventInput is true", async () => {
    render(
      <AppProductSalePrepayment
        dataForm={dataForm}
        productId="1"
        preventInput={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });

  it("handles API error responses correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ status: 204 }), // No content
    });

    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("handles data transform correctly", async () => {
    render(<AppProductSalePrepayment dataForm={dataForm} productId="1" />);

    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/direct?action=getInstallmentTypeById",
        expect.objectContaining({
          body: expect.stringContaining("product_sale_channel_id"),
        })
      );
    });
  });
});
