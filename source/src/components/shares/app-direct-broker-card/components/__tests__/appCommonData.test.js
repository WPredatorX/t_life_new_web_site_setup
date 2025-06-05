import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppCommonData } from "..";
import { useTheme } from "@mui/material";
import * as hooks from "@/hooks";
import * as utilities from "@/utilities";

// Mock MUI theme
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useTheme: jest.fn(() => ({
      palette: {
        text: { secondary: "#000" },
        common: { white: "#fff" },
        primary: { main: "#1976d2" },
      },
    })),
  };
});
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: jest.fn(() => ({
      register: jest.fn(() => ({})),
      handleSubmit: (onSubmit, onError) => (e) => {
        e && e.preventDefault();
        onSubmit({}, e);
      },
      reset: jest.fn(),
      watch: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn(),
      control: {},
      formState: { errors: {}, isDirty: true },
      trigger: jest.fn(),
    })),
    useFieldArray: jest.fn(() => ({
      fields: [],
      append: jest.fn(),
      remove: jest.fn(),
    })),
  };
});
// Mock hooks
jest.mock("@/hooks", () => ({
  useAppForm: jest.fn(),
  useAppSnackbar: jest.fn(),
  useAppDialog: jest.fn(),
  useAppRouter: jest.fn(),
  useAppFeatureCheck: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("@/utilities", () => {
  // Create a chainable mock for Yup methods
  const chain = () =>
    new Proxy(() => chain(), {
      get: () => chain,
      apply: () => chain(),
    });

  const Yup = {
    object: chain,
    array: chain,
    mixed: chain,
    string: chain,
    number: chain,
    boolean: chain,
    date: chain,
    ref: chain,
    reach: chain,
    addMethod: jest.fn(),
    setLocale: jest.fn(),
    ValidationError: jest.fn(),
  };

  return {
    __esModule: true,
    default: { Yup },
    Yup,
  };
});

jest.mock("@hookform/resolvers/yup", () => ({
  yupResolver: jest.fn(),
}));

// Mock AppCard and AppLoadData
jest.mock("@/components", () => ({
  AppCard: ({ children, ...props }) => <div>{children}</div>,
  AppLoadData: ({ loadingState }) => (
    <div data-testid="loading">Loading...</div>
  ),
}));

const mockFormMethods = {
  reset: jest.fn(),
  watch: jest.fn((name) => {
    if (name === "confirmEmail") return [];
    if (name === "contactEmail") return [];
    if (name === undefined) return {};
    return "";
  }),
  register: jest.fn(() => ({})),
  control: {},
  handleSubmit: (onSubmit, onError) => (e) => {
    e && e.preventDefault();
    onSubmit({}, e);
  },
  formState: { errors: {}, isDirty: true },
};

const mockHandleNotification = jest.fn();
const mockHandleSnackAlert = jest.fn();
const mockRouterPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  hooks.useAppForm.mockReturnValue(mockFormMethods);
  hooks.useAppSnackbar.mockReturnValue({
    handleSnackAlert: mockHandleSnackAlert,
  });
  hooks.useAppDialog.mockReturnValue({
    handleNotification: mockHandleNotification,
  });
  hooks.useAppRouter.mockReturnValue({ push: mockRouterPush });
  hooks.useAppFeatureCheck.mockReturnValue({ validFeature: true });
  hooks.useAppSelector.mockReturnValue({ activator: "tester" });
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    json: jest.fn().mockResolvedValue({}),
  });
});

afterEach(() => {
  // ลบ fetch หลังจบแต่ละเทส
  delete global.fetch;
});

describe("AppCommonData", () => {
  it("renders loading state", () => {
    // Simulate loading
    let setLoading;
    hooks.useAppForm.mockImplementation(() => {
      const [loading, _setLoading] = React.useState(true);
      setLoading = _setLoading;
      return { ...mockFormMethods, loading, setLoading };
    });
    render(<AppCommonData mode="direct" brokerData={null} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders form fields and buttons", () => {
    render(<AppCommonData mode="direct" brokerData={null} />);
    expect(screen.getByText(/ช่องทาง DIRECT/)).toBeInTheDocument();
    expect(screen.getByText(/อีเมลยืนยันการชำระค่าเบี้ย/)).toBeInTheDocument();
    expect(
      screen.getByText(/อีเมลเพื่อให้เจ้าหน้าที่ติดต่อกลับ/)
    ).toBeInTheDocument();
    expect(screen.getByText(/กลับหน้าหลัก/)).toBeInTheDocument();
    expect(screen.getByText(/ล้างค่า/)).toBeInTheDocument();
    expect(screen.getByText(/บันทึก/)).toBeInTheDocument();
  });

  it("calls handleNotification when clicking back", () => {
    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getByText(/กลับหน้าหลัก/));
    expect(mockHandleNotification).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      null,
      "question"
    );
  });

  it("calls handleNotification when clicking reset", () => {
    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getByText(/ล้างค่า/));
    expect(mockHandleNotification).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      null,
      "question"
    );
  });

  it("calls onSubmit and shows notification on success", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });
    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getByText(/บันทึก/));
    await waitFor(() =>
      expect(mockHandleNotification).toHaveBeenCalledWith(
        "บันทึกข้อมูลสำเร็จ",
        null,
        null,
        "info",
        "ตกลง"
      )
    );
  });

  it("shows error snackbar on submit error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("fail"));
    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getByText(/บันทึก/));
    await waitFor(() =>
      expect(mockHandleSnackAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
          message: expect.stringContaining("เกิดข้อผิดพลาดในการบันทึกข้อมูล"),
          severity: "error",
        })
      )
    );
  });

  it("calls handleTestSendMail when clicking test email button", async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });
    mockFormMethods.watch = jest.fn((name) => {
      if (name === "confirmEmail") return ["test@example.com"];
      if (name === "confirmEmailCC") return [];
      if (name === "contactEmail") return ["contact@example.com"];
      if (name === "contactEmailCC") return [];
      return "";
    });
    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getAllByText(/ทดสอบส่งอีเมล/)[0]);
    await waitFor(() =>
      expect(mockHandleNotification).toHaveBeenCalledWith(
        "ส่งอีเมลสำเร็จ",
        null,
        null,
        "info",
        "ตกลง"
      )
    );
  });

  it("shows error snackbar on test email error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("fail"));
    mockFormMethods.watch = jest.fn((name) => {
      if (name === "confirmEmail") return ["test@example.com"];
      if (name === "confirmEmailCC") return [];
      return "";
    });
    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getAllByText(/ทดสอบส่งอีเมล/)[0]);
    await waitFor(() =>
      expect(mockHandleSnackAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
          message: expect.stringContaining("เกิดข้อผิดพลาดในการบันทึกข้อมูล"),
          severity: "error",
        })
      )
    );
  });

  it("calls reset with brokerData on brokerData change", () => {
    const brokerData = { generalInfo: [{ i_subbusiness_line: "123" }] };
    render(<AppCommonData mode="direct" brokerData={brokerData} />);
    expect(mockFormMethods.reset).toHaveBeenCalledWith(
      expect.objectContaining(brokerData)
    );
  });
});
