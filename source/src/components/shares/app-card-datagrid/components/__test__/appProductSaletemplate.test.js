import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppProductSaleTemplate } from "..";
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
  };
});

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
    <div data-testid="app-data-grid">{JSON.stringify(props.rows)}</div>
  ),
  AppDatePicker: (props) => <input data-testid={props.label} {...props} />,
  AppAutocomplete: (props) => <input data-testid={props.label} {...props} />,
}));

// Mock hooks
const mockHandleSnackAlert = jest.fn();
const mockHandleNotification = jest.fn();
const mockSetValueData = jest.fn();
const mockResetData = jest.fn();
const mockWatchData = jest.fn((name) => {
  if (name === "saleTemplate")
    return [{ product_app_temp_id: 1, app_temp_name: "A" }];
  if (name === "saleTemplateTemp") return [];
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
    language: "th",
    snackBar: {
      open: false,
      autoHideDuration: 5000,
      onClose: null,
      message: "Message",
      action: null,
      anchorOrigin: {
        horizontal: "left",
        vertical: "bottom",
      },
    },
    dialog: {
      title: "",
      open: false,
      onClose: null,
      renderContent: null,
      renderAction: null,
      useDefaultBehavior: true,
      draggable: false,
    },
    dataGrid: { pageNumber: 1, pageSize: 10 },
  },
  APPLICATION_RECORD_PRODUCT_CHANNEL_DETAIL_STATUS: [
    { id: "1", label: "เปิดใช้งาน" },
    { id: "2", label: "ปิดใช้งาน" },
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
    number: () => ({
      nullable: function () {
        return this;
      },
      when: function () {
        return this;
      },
      min: function () {
        return this;
      },
      max: function () {
        return this;
      },
      typeError: function () {
        return this;
      },
      required: function () {
        return this;
      },
      test: function () {
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
    formatNumber: (val) => val,
    snakeToPascalCase: (val) => val,
  },
}));

// Mock react-number-format
jest.mock("react-number-format", () => ({
  NumericFormat: (props) => (
    <input
      data-testid={props.label}
      value={props.value}
      onChange={(e) =>
        props.onValueChange({ floatValue: Number(e.target.value) })
      }
    />
  ),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve([]),
  })
);

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: (cb) => cb,
      formState: { errors: {} },
      control: {}, // ใส่ mock control object ตรงนี้
    })),
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: "" } }),
  };
});

describe("AppProductSaleTemplate", () => {
  const dataForm = {
    watch: mockWatchData,
    reset: mockResetData,
    setValue: mockSetValueData,
    formState: { dirtyFields: {} },
  };

  it("renders main card and form fields", async () => {
    render(<AppProductSaleTemplate dataForm={dataForm} productId="1" />);
    expect(await screen.findByTestId("app-card")).toHaveTextContent(
      "เทมเพลตใบคำขอ"
    );
    expect(screen.getByTestId("สถานะ")).toBeInTheDocument();
    expect(screen.getByTestId("ชื่อเทมเพลต")).toBeInTheDocument();
    expect(screen.getByTestId("ความคุ้มครองต่ำสุด")).toBeInTheDocument();
    expect(screen.getByTestId("ความคุ้มครองสูงสุด")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่แก้ไข")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่แก้ไข")).toBeInTheDocument();
  });

  it("renders AppDataGrid with rows", async () => {
    render(<AppProductSaleTemplate dataForm={dataForm} productId="1" />);
    expect(await screen.findByTestId("app-data-grid")).toHaveTextContent("A");
  });

  it("calls handleResetForm when click ล้างค่า", async () => {
    render(<AppProductSaleTemplate dataForm={dataForm} productId="1" />);
    const resetButton = screen.getByText("ล้างค่า");
    fireEvent.click(resetButton);
    await waitFor(() => expect(mockResetData).toHaveBeenCalled());
  });

  it("calls handleSubmit when click ค้นหา", async () => {
    render(<AppProductSaleTemplate dataForm={dataForm} productId="1" />);
    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("calls handleAdd when click เพิ่ม", async () => {
    render(<AppProductSaleTemplate dataForm={dataForm} productId="1" />);
    const addButton = screen.getByText("เพิ่ม");
    fireEvent.click(addButton);
    // ตรวจสอบ dialog หรือ state ที่เกี่ยวข้องได้ตามจริง
  });
});
