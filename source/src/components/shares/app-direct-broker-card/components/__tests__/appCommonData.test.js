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
      register: jest.fn(),
      handleSubmit: (cb) => cb,
      formState: { errors: {} },
      control: {}, // ใส่ mock control object ตรงนี้
    })),
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: "" } }),
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
    if (
      mockFormMethods.formState.errors &&
      Object.keys(mockFormMethods.formState.errors).length > 0
    ) {
      onError(mockFormMethods.formState.errors, e);
    } else {
      onSubmit({}, e);
    }
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
  hooks.useAppSelector.mockImplementation((selector) =>
    selector({ global: { activator: "unit-test-activator" } })
  );
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
  it("shows loading state when sending mail", async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    // ต้องเซ็ต watch ก่อน render!
    mockFormMethods.watch = jest.fn((name) => {
      if (name === "confirmEmail") return ["test@example.com"];
      if (name === "confirmEmailCC") return [];
      if (name === "contactEmail") return [];
      if (name === "contactEmailCC") return [];
      return "";
    });
    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getAllByText(/ทดสอบส่งอีเมล/)[0]);
    expect(await screen.findByTestId("loading")).toBeInTheDocument();
  });

  it("shows loading state when submitting form", async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getByText(/บันทึก/));
    expect(await screen.findByTestId("loading")).toBeInTheDocument();
  });

  it("should use activator from useAppSelector in onSubmit", async () => {
    // Mock activator
    hooks.useAppSelector.mockReturnValue({ activator: "unit-test-activator" });

    // Mock fetch ให้สำเร็จ
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    // Mock watch ให้มีค่าที่จำเป็นสำหรับ submit
    mockFormMethods.watch = jest.fn((name) => {
      if (name === "confirmEmail") return ["test@example.com"];
      if (name === "confirmEmailCC") return [];
      if (name === "contactEmail") return ["contact@example.com"];
      if (name === "contactEmailCC") return [];
      // สำหรับ generalInfo
      if (name?.startsWith("generalInfo")) return "";
      return "";
    });

    render(<AppCommonData mode="direct" brokerData={null} />);
    // ทำให้ปุ่มบันทึก enabled
    mockFormMethods.formState.isDirty = true;

    // กดปุ่มบันทึก
    fireEvent.click(screen.getByTestId("saveButton"));

    await waitFor(() => {
      // ตรวจสอบว่า fetch ถูกเรียกด้วย body ที่มี update_by เป็น activator ที่ mock ไว้
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining("unit-test-activator"),
        })
      );
    });
  });
  /*   it("renders form fields and buttons", () => {
    render(<AppCommonData mode="direct" brokerData={null} />);
    expect(screen.getByTestId("ChannelName")).toBeInTheDocument();
    expect(screen.getByText("ConfirmEmail")).toBeInTheDocument();
    expect(screen.getByText("ContactEmail")).toBeInTheDocument();
    expect(screen.getByText("homeButton")).toBeInTheDocument();
    expect(screen.getByText("resetButton")).toBeInTheDocument();
    expect(screen.getByText("saveButton")).toBeInTheDocument();
  }); */

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

  it("should use activator from state.global in onSubmit", async () => {
    // mock fetch ให้สำเร็จ
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    // mock watch ให้มีค่าที่จำเป็น
    mockFormMethods.watch = jest.fn((name) => {
      if (name === "confirmEmail") return ["test@example.com"];
      if (name === "confirmEmailCC") return [];
      if (name === "contactEmail") return ["contact@example.com"];
      if (name === "contactEmailCC") return [];
      if (typeof name === "string" && name.startsWith("generalInfo")) return "";
      return "";
    });

    // ทำให้ปุ่มบันทึก enabled
    mockFormMethods.formState.isDirty = true;

    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getByTestId("saveButton"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining("unit-test-activator"),
        })
      );
    });
  });
  it("shows error message from errors array for confirmEmail (integration)", () => {
    mockFormMethods.formState.errors = {
      confirmEmail: [{ message: "อีเมลผิด" }],
    };
    mockFormMethods.watch = jest.fn((name) => {
      if (name === "confirmEmail") return ["test@example.com"];
      return [];
    });
    render(<AppCommonData mode="direct" brokerData={null} />);
    expect(screen.getByTestId("confirmEmailError")).toBeInTheDocument();
  });

  it("calls fetch and handleNotification when handleTestSendMail is called with template_code 2", async () => {
    // Mock fetch ให้สำเร็จ
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    // Mock watch ให้ contactEmail และ contactEmailCC มีค่า
    mockFormMethods.watch = jest.fn((name) => {
      if (name === "contactEmail")
        return ["contact1@example.com", "contact2@example.com"];
      if (name === "contactEmailCC") return ["cc1@example.com"];
      return [];
    });

    render(<AppCommonData mode="direct" brokerData={null} />);
    // กดปุ่มทดสอบส่งอีเมลฝั่ง contactEmail (template_code 2)
    fireEvent.click(screen.getAllByText(/ทดสอบส่งอีเมล/)[1]);

    await waitFor(() => {
      // ตรวจสอบว่า fetch ถูกเรียกด้วย body ที่ถูกต้อง
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/direct?action=TestSendMail",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mail_to: "contact1@example.com;contact2@example.com",
            mail_cc: "cc1@example.com",
            template_code: "02",
          }),
        })
      );
      // ตรวจสอบว่า handleNotification ถูกเรียก
      expect(mockHandleNotification).toHaveBeenCalledWith(
        "ส่งอีเมลสำเร็จ",
        null,
        null,
        "info",
        "ตกลง"
      );
    });
  });
  it("calls console.error in onError when form is invalid", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    // mock errors ให้มี error
    mockFormMethods.formState.errors = {
      confirmEmail: [{ message: "อีเมลผิด" }],
    };
    // mock watch ให้ confirmEmail ว่าง (เพื่อให้ invalid)
    mockFormMethods.watch = jest.fn((name) => {
      if (name === "confirmEmail") return [];
      return [];
    });

    render(<AppCommonData mode="direct" brokerData={null} />);
    // กดปุ่มบันทึก (submit)
    fireEvent.click(screen.getByTestId("saveButton"));

    // รอให้ console.error ถูกเรียก
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
    spy.mockRestore();
  });
  it("calls reset when user confirms reset in dialog", () => {
    // mock handleNotification ให้เรียก callback ทันที (simulate user กด "ตกลง")
    hooks.useAppDialog.mockReturnValue({
      handleNotification: (msg, callback) => {
        if (callback) callback();
      },
    });

    // ทำให้ปุ่ม reset enabled
    mockFormMethods.formState.isDirty = true;

    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getByTestId("resetButton"));

    expect(mockFormMethods.reset).toHaveBeenCalled();
  });
  it("calls router.push('/') when user confirms back in dialog", () => {
    // mock handleNotification ให้เรียก callback ทันที (simulate user กดยืนยัน)
    hooks.useAppDialog.mockReturnValue({
      handleNotification: (msg, callback) => {
        if (callback) callback();
      },
    });

    render(<AppCommonData mode="direct" brokerData={null} />);
    fireEvent.click(screen.getByTestId("homeButton"));

    expect(mockRouterPush).toHaveBeenCalledWith("/");
  });
});
