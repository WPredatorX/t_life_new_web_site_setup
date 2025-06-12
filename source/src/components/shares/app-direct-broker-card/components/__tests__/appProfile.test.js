import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppProfile } from "..";
import React from "react";

// Mock hooks
const mockReset = jest.fn();
const mockSetValue = jest.fn();
const mockHandleNotification = jest.fn();
const mockHandleNotificationHook = jest.fn((msg, cb) => cb && cb());
const mockHandleSnackAlert = jest.fn();
const mockPush = jest.fn();

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

jest.mock("@/hooks", () => ({
  useAppForm: () => ({
    getValues: jest.fn(),
    setValue: mockSetValue,
    watch: jest.fn((name) => {
      if (name === "displayVersion") return [];
      if (name === "displayVersionTemp") return [];
    }),
    control: {},
    trigger: jest.fn(),
    register: jest.fn(() => ({ name: "mock" })),
    reset: mockReset,
    handleSubmit: (onSubmit) => (e) => {
      e && e.preventDefault();
      onSubmit({}, e);
    },
    formState: { errors: {}, isDirty: false },
  }),
  useAppRouter: () => ({ push: mockPush }),
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => ({
    dialog: {},
    brokerId: "B1",
    activator: "admin",
    sasToken: { sas_images: "" },
  }),
  useAppDialog: () => ({
    handleNotification: mockHandleNotification,
    handleNotificationHook: mockHandleNotificationHook,
  }),
  useAppSnackbar: () => ({ handleSnackAlert: mockHandleSnackAlert }),
  useAppFieldArray: () => ({
    fields: [],
    append: jest.fn(),
    remove: jest.fn(),
  }),
  useAppGridApiRef: () => ({ current: { getRow: jest.fn() } }),
  useAppFeatureCheck: () => ({ validFeature: true }),
  useAppScroll: () => ({ scrollToTop: jest.fn() }),
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
  APPLICATION_CONFIGURATION: {
    defaultFileAccept: [".png", ".jpg", ".jpeg"],
    defaultFileExtension: ["image/png", "image/jpeg"],
    defaultFileSize: 3 * 1024 * 1024,
  },
  APPLICATION_LOGO_ASPECT: [
    { id: "0", value: "1:1" },
    { id: "1", value: "16:9" },
  ],
  APPLICATION_DESCRIPTION_SIZE: [{ value: 12, label: "เต็ม" }],
  APPLICATION_DESCRIPTION_POSITION: [{ id: "3", value: "กลาง" }],
}));

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
    Card: ({ children }) => <div>{children}</div>,
    Grid: ({ children }) => <div>{children}</div>,
    Box: ({ children }) => <div>{children}</div>,
    Collapse: ({ in: open, children }) => (open ? <div>{children}</div> : null),
    Accordion: ({ children }) => <div>{children}</div>,
    AccordionSummary: ({ children }) => <div>{children}</div>,
    AccordionDetails: ({ children }) => <div>{children}</div>,
    Typography: ({ children }) => <span>{children}</span>,
    Select: (props) => <select {...props}>{props.children}</select>,
    InputLabel: (props) => <label {...props}>{props.children}</label>,
    FormControl: (props) => <div>{props.children}</div>,
    IconButton: ({ children, ...props }) => (
      <button {...props}>{children}</button>
    ),
    CircularProgress: () => <span>loading...</span>,
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  };
});
jest.mock("next/image", () => (props) => (
  <img alt={props.alt} src={props.src} />
));

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
  AppDataGrid: (props) => {
    return (
      <div data-testid="app-data-grid">
        {Array.isArray(props.rows) ? JSON.stringify(props.rows) : "no rows"}
      </div>
    );
  },
  AppAutocomplete: (props) => <input data-testid={props.label} {...props} />,
  AppReOrderDatagrid: (props) => (
    <div data-testid="app-reorder-datagrid">{JSON.stringify(props.rows)}</div>
  ),
  AppManageProfile: () => <div data-testid="app-manage-profile" />,
  AppManageBanner: () => <div data-testid="app-manage-banner" />,
  AppManageSocial: () => <div data-testid="app-manage-social" />,
  AppApproveProfile: () => <div data-testid="app-approve-profile" />,
  AppManageInsuraceGroupProduct: () => (
    <div data-testid="app-manage-insurance-group-product" />
  ),
}));
jest.mock("@mui/x-data-grid", () => ({
  DataGrid: (props) => (
    <div data-testid="mui-data-grid">
      {Array.isArray(props.rows) ? JSON.stringify(props.rows) : "no rows"}
    </div>
  ),
}));
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve([]),
    blob: () => Promise.resolve(new Blob(["test"], { type: "image/png" })),
  })
);

// Mock FileReader
class MockFileReader {
  readAsDataURL(file) {
    setTimeout(() => {
      this.onload({ target: { result: "data:image/png;base64,abc123" } });
    }, 0);
  }
  set onload(fn) {
    this._onload = fn;
  }
  get onload() {
    return this._onload;
  }
}
global.FileReader = MockFileReader;
global.URL.createObjectURL = jest.fn(() => "blob:url");

if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => "mock-uuid";
}

describe("AppProfile", () => {
  it("renders main card and form fields", async () => {
    render(<AppProfile mode="direct" channel="A" brokerData={{}} />);
  });
});
