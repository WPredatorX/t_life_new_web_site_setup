import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppProductList from "../appProductList";
import React from "react";

// Mock hooks
const mockHandleSnackAlert = jest.fn();
const mockPush = jest.fn();
const mockUseAppForm = jest.fn();
const mockReset = jest.fn();
const mockHandleSubmit = jest.fn((onSubmit) => (e) => {
  e && e.preventDefault();
  onSubmit({}, e);
});

jest.mock("@/hooks", () => ({
  useAppForm: (...args) => mockUseAppForm(...args),
  useAppRouter: () => ({ push: mockPush }),
  useAppSnackbar: () => ({ handleSnackAlert: mockHandleSnackAlert }),
  useAppSelector: jest.fn(() => ({ activator: "admin" })),
  useAppFeatureCheck: jest.fn((features) => {
    // ให้ทุกสิทธิ์เป็น true เพื่อให้ทุก field แสดง
    return { validFeature: true };
  }),
}));

jest.mock("@/components", () => ({
  AppCard: ({ children, title }) => (
    <div data-testid="app-card">
      {title}
      {children}
    </div>
  ),
  AppStatus: ({ status, statusText }) => (
    <span data-testid="app-status">{statusText}</span>
  ),
  AppLoadData: ({ message }) => (
    <div data-testid="app-load-data">{message}</div>
  ),
  AppDataGrid: (props) => (
    <div data-testid="app-data-grid">{JSON.stringify(props.rows)}</div>
  ),
  AppDatePicker: (props) => <input data-testid={props.label} {...props} />,
  AppAutocomplete: (props) => <input data-testid={props.label} {...props} />,
}));

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    TextField: (props) => (
      <>
        <input data-testid={props.label} {...props} />
        {props.helperText && <div>{props.helperText}</div>}
      </>
    ),
    InputAdornment: ({ children }) => <span>{children}</span>,
    Button: ({ children, ...props }) => (
      <button type={props.type || "button"} {...props}>
        {children}
      </button>
    ),
    FormHelperText: ({ children }) => <div>{children}</div>,
    Card: ({ children }) => <div>{children}</div>,
    Tabs: ({ children, value, onChange }) => (
      <div>
        {React.Children.map(children, (child, idx) =>
          React.cloneElement(child, {
            selected: value === idx,
            onClick: () => onChange({}, idx),
          })
        )}
      </div>
    ),
    Tab: ({ label, selected, onClick }) => (
      <button
        data-testid={`tab-${label}`}
        aria-selected={selected}
        onClick={onClick}
      >
        {label}
      </button>
    ),
    Divider: () => <hr />,
    CardContent: ({ children }) => <div>{children}</div>,
    Grid: ({ children }) => <div>{children}</div>,
    Switch: (props) => (
      <input type="checkbox" data-testid="switch" {...props} />
    ),
    FormControlLabel: ({ control, label, ...props }) => (
      <label>
        {control}
        <span>{label}</span>
      </label>
    ),
    CircularProgress: () => <span>loading...</span>,
    Typography: ({ children }) => <span>{children}</span>,
  };
});
jest.mock("react-number-format", () => ({
  NumericFormat: (props) => <input data-testid={props.label} {...props} />,
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
  APPLICATION_RECORD_PRODUCT_CHANNEL_STATUS: [
    { id: "1", label: "เปิดใช้งาน" },
    { id: "2", label: "ปิดใช้งาน" },
  ],
  APPLICATION_RECORD_PRODUCT_DISPLAY_CHANNEL_STATUS: [
    { id: "1", label: "แสดง" },
    { id: "2", label: "ไม่แสดง" },
  ],
}));

// Mock utilities
jest.mock("@/utilities", () => ({
  Yup: {
    object: () => ({
      shape: () => ({
        validate: jest.fn(),
      }),
      nullable: () => ({
        shape: () => ({
          validate: jest.fn(),
        }),
      }),
    }),
    string: () => ({ nullable: () => ({}) }),
    number: () => ({
      nullable: () => ({
        min: () => ({
          when: () => ({}),
        }),
      }),
    }),
    date: () => ({
      nullable: () => ({
        when: () => ({}),
      }),
    }),
    bool: () => ({ nullable: () => ({}) }),
  },
  Transform: {
    formatNumber: (val) => val,
    snakeToPascalCase: (val) => val,
  },
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () =>
      Promise.resolve([
        {
          product_plan_id: "1",
          product_name: "ประกันชีวิต",
          product_status: "1",
          product_status_name: "เปิดใช้งาน",
          marketting_status: "1",
          marketting_status_name: "แสดง",
          min_coverage_amount: 10000,
          max_coverage_amount: 100000,
          create_by: "admin",
          create_date: "2023-01-01T00:00:00Z",
          update_by: "admin",
          update_date: "2023-01-02T00:00:00Z",
          sale_card_status: "2",
          sale_card_status_name: "รออนุมัติ",
          total_records: 1,
        },
      ]),
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
beforeEach(() => {
  jest.clearAllMocks();
  mockUseAppForm.mockReturnValue({
    watch: jest.fn(() => ""),
    reset: mockReset,
    control: {},
    register: jest.fn(() => ({ name: "mock" })),
    clearErrors: jest.fn(),
    handleSubmit: mockHandleSubmit,
    formState: { errors: {}, isDirty: true },
  });
});

describe("AppProductList", () => {
  it("renders main card and form fields", async () => {
    render(
      <AppProductList
        mode="direct"
        channel="A"
        brokerData={{
          generalInfo: [{ broker_id: "B1", c_subbusiness_line: "LINE" }],
        }}
      />
    );
    expect(await screen.findByTestId("app-card")).toHaveTextContent(
      "ผลิตภัณฑ์ที่ขายทั้งหมดของช่องทาง DIRECT"
    );
    expect(screen.getByTestId("ชื่อ")).toBeInTheDocument();
    expect(screen.getByTestId("สถานะ (โพรดักส์)")).toBeInTheDocument();
    expect(screen.getByTestId("สถานะ (การตลาด)")).toBeInTheDocument();
    expect(screen.getByTestId("จากทุนประกันต่ำสุด")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงทุนประกันต่ำสุด")).toBeInTheDocument();
    expect(screen.getByTestId("จากทุนประกันสูงสุด")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงทุนประกันสูงสุด")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่สร้าง")).toBeInTheDocument();
    expect(screen.getByTestId("จากวันที่แก้ไข")).toBeInTheDocument();
    expect(screen.getByTestId("ถึงวันที่แก้ไข")).toBeInTheDocument();
  });

  it("renders AppDataGrid with rows", async () => {
    render(
      <AppProductList
        mode="direct"
        channel="A"
        brokerData={{
          generalInfo: [{ broker_id: "B1", c_subbusiness_line: "LINE" }],
        }}
      />
    );
    expect(await screen.findByTestId("app-data-grid")).toHaveTextContent(
      "ประกันชีวิต"
    );
  });

  it("calls handleResetForm when click ล้างค่า", async () => {
    render(
      <AppProductList
        mode="direct"
        channel="A"
        brokerData={{
          generalInfo: [{ broker_id: "B1", c_subbusiness_line: "LINE" }],
        }}
      />
    );
    await screen.findByTestId("app-data-grid");
    const resetButton = screen.getByText("ล้างค่า");
    await waitFor(() => expect(resetButton).not.toBeDisabled());
    fireEvent.click(resetButton);
    expect(mockReset).toHaveBeenCalled();
  });
  it("calls handleSubmit when click ค้นหา", async () => {
    render(
      <AppProductList
        mode="direct"
        channel="A"
        brokerData={{
          generalInfo: [{ broker_id: "B1", c_subbusiness_line: "LINE" }],
        }}
      />
    );
    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("shows AppLoadData if brokerId is empty", () => {
    render(
      <AppProductList
        mode="direct"
        channel="A"
        brokerData={{ generalInfo: [{ broker_id: "" }] }}
      />
    );
    expect(screen.getByTestId("app-load-data")).toHaveTextContent(
      "ข้อมูลช่องทาง direct ยังไม่ถูกตั้งค่า"
    );
  });

  it("changes tab when click", () => {
    render(
      <AppProductList
        mode="direct"
        channel="A"
        brokerData={{
          generalInfo: [{ broker_id: "B1", c_subbusiness_line: "LINE" }],
        }}
      />
    );
    const tab = screen.getByTestId("tab-สัญญาหลัก");
    fireEvent.click(tab);
    expect(tab).toHaveAttribute("aria-selected", "true");
  });
});
