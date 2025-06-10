import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppManageSaleTemplate from "../appManageSaleTemplate";
import React from "react";

// Mock dependencies
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Card: ({ children, sx }) => (
    <div data-testid="card" style={sx}>
      {children}
    </div>
  ),
  Grid: ({ children, ...props }) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, disabled, type, variant, color, ...props }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      data-variant={variant}
      data-color={color}
      {...props}
    >
      {children}
    </button>
  ),
  Dialog: ({ open, children, onClose, ...props }) =>
    open ? (
      <div data-testid="dialog" {...props}>
        <div onClick={() => onClose && onClose({}, "backdropClick")}>
          backdrop
        </div>
        {children}
      </div>
    ) : null,
  TextField: ({
    label,
    error,
    disabled,
    readOnly,
    type,
    InputProps,
    InputLabelProps,
    ...props
  }) => (
    <div>
      <input
        {...props}
        data-testid={label}
        data-error={error}
        disabled={disabled || readOnly}
        type={type}
        placeholder={label}
      />
      {InputProps?.endAdornment && <span>{InputProps.endAdornment}</span>}
    </div>
  ),
  InputLabel: ({ children, required }) => (
    <label data-required={required}>{children}</label>
  ),
  DialogTitle: ({ children }) => (
    <div data-testid="dialog-title">{children}</div>
  ),
  DialogContent: ({ children }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogActions: ({ children }) => (
    <div data-testid="dialog-actions">{children}</div>
  ),
  FormHelperText: ({ children, error }) =>
    error ? <div data-testid="error-text">{children}</div> : null,
  InputAdornment: ({ children, position }) => (
    <span data-position={position}>{children}</span>
  ),
  CircularProgress: ({ size }) => (
    <div data-testid="loading" data-size={size}>
      Loading...
    </div>
  ),
}));

jest.mock("@/utilities", () => ({
  Yup: {
    object: () => ({
      shape: jest.fn(() => ({})),
    }),
    mixed: () => ({
      nullable: () => ({ required: () => ({}) }),
    }),
    string: () => ({
      nullable: () => ({ required: () => ({}) }),
    }),
    number: () => ({
      typeError: () => ({
        required: () => ({
          nullable: () => ({
            min: () => ({
              max: () => ({
                test: () => ({}),
              }),
            }),
          }),
        }),
      }),
      nullable: () => ({
        min: () => ({
          required: () => ({
            test: () => ({}),
          }),
        }),
      }),
    }),
  },
}));

jest.mock("@hookform/resolvers/yup", () => ({
  yupResolver: jest.fn(() => ({})),
}));

jest.mock("react-hook-form", () => ({
  Controller: ({ render, name }) => {
    const field = {
      name,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: null,
      ref: jest.fn(),
    };
    return render({ field });
  },
}));

jest.mock("@/components", () => ({
  AppAutocomplete: ({
    label,
    options = [],
    onChange,
    disabled,
    error,
    required,
    value,
    ...props
  }) => (
    <div>
      <input
        {...props}
        data-testid={label}
        data-error={error}
        data-required={required}
        disabled={disabled}
        placeholder={label}
        onChange={(e) => {
          const selectedOption = options?.find(
            (opt) => opt.label === e.target.value
          );
          onChange && onChange(e, selectedOption || null);
        }}
      />
      <div data-testid={`${label}-options`}>
        <div
          data-testid="template-option-1"
          onClick={() =>
            onChange &&
            onChange(
              {},
              {
                app_temp_id: "1",
                app_temp_code: "T001",
                label: "Template 1",
              }
            )
          }
        >
          Template 1
        </div>
        <div
          data-testid="template-option-2"
          onClick={() =>
            onChange &&
            onChange(
              {},
              {
                app_temp_id: "2",
                app_temp_code: "T002",
                label: "Template 2",
              }
            )
          }
        >
          Template 2
        </div>
      </div>
    </div>
  ),
  AppLoadData: ({ children }) => (
    <div data-testid="app-load-data">{children}</div>
  ),
}));

jest.mock("react-number-format", () => ({
  NumericFormat: ({
    label,
    onValueChange,
    customInput,
    value,
    error,
    disabled,
    InputProps,
    InputLabelProps,
    ...props
  }) => (
    <div>
      <input
        {...props}
        data-testid={label}
        data-error={error}
        disabled={disabled}
        value={value || ""}
        placeholder={label}
        onChange={(e) => {
          const floatValue = parseFloat(e.target.value) || null;
          onValueChange && onValueChange({ floatValue });
        }}
      />
      {InputProps?.endAdornment && <span>{InputProps.endAdornment}</span>}
    </div>
  ),
}));

// Mock hooks
const mockWatch = jest.fn();
const mockReset = jest.fn();
const mockHandleSubmit = jest.fn();
const mockRegister = jest.fn();
const mockHandleNotification = jest.fn();
const mockHandleSnackAlert = jest.fn();
const mockHandleSave = jest.fn();
const mockHandleFetchTemplate = jest.fn();
const mockSetOpen = jest.fn();

jest.mock("@/hooks", () => ({
  useAppForm: () => ({
    watch: mockWatch,
    reset: mockReset,
    control: {},
    formState: { errors: {}, isDirty: false },
    handleSubmit: mockHandleSubmit,
    register: mockRegister,
  }),
  useAppDialog: () => ({ handleNotification: mockHandleNotification }),
  useAppSelector: () => ({ activator: "admin" }),
  useAppSnackbar: () => ({ handleSnackAlert: mockHandleSnackAlert }),
}));

// Mock global functions
global.fetch = jest.fn();

// ใช้ jest.spyOn แทนการ assign ตรงๆ
const mockCreateObjectURL = jest.fn(() => "blob:mock-url");
const mockRevokeObjectURL = jest.fn();
const mockWindowOpen = jest.fn(() => ({ focus: jest.fn() }));

// Setup spies
Object.defineProperty(URL, "createObjectURL", {
  value: mockCreateObjectURL,
  writable: true,
});

Object.defineProperty(URL, "revokeObjectURL", {
  value: mockRevokeObjectURL,
  writable: true,
});

Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

// Mock crypto
const mockRandomUUID = jest.fn(() => "mock-uuid");

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: mockRandomUUID,
  },
  configurable: true,
});

// Export for test use

// Export mocks สำหรับใช้ใน test
global.mockCreateObjectURL = mockCreateObjectURL;
global.mockRevokeObjectURL = mockRevokeObjectURL;
global.mockWindowOpen = mockWindowOpen;
global.mockRandomUUID = mockRandomUUID;

describe("AppManageSaleTemplate", () => {
  const defaultProps = {
    mode: "create",
    open: true,
    setOpen: mockSetOpen,
    productId: "1",
    handleSave: mockHandleSave,
    initialData: null,
    handleFetchTemplate: mockHandleFetchTemplate,
  };

  const mockTemplateData = [
    {
      app_temp_id: "1",
      app_temp_name: "Template 1",
      app_temp_code: "T001",
      label: "Template 1",
    },
    {
      app_temp_id: "2",
      app_temp_name: "Template 2",
      app_temp_code: "T002",
      label: "Template 2",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockWatch.mockImplementation((field) => {
      if (field === "template_master") {
        return { app_temp_code: "T001" };
      }
      return null;
    });

    mockHandleSubmit.mockImplementation((onSubmit, onError) => (e) => {
      e && e.preventDefault();
      onSubmit(
        {
          template_master: {
            app_temp_id: "1",
            app_temp_name: "Template 1",
          },
          app_temp_name: "Test Template",
          min_coverage_amount: 1000,
          max_coverage_amount: 100000,
          min_age_years: 18,
          min_age_months: 0,
          min_age_days: 0,
          max_age_years: 65,
          max_age_months: 0,
          max_age_days: 0,
        },
        e
      );
    });

    mockRegister.mockReturnValue({
      name: "test-field",
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn(),
    });

    mockHandleFetchTemplate.mockResolvedValue(mockTemplateData);
  });

  it("renders dialog when open is true", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "จัดการเทมเพลตใบคำขอ"
    );
  });

  it("does not render dialog when open is false", () => {
    render(<AppManageSaleTemplate {...defaultProps} open={false} />);

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("renders all form fields", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    expect(screen.getByTestId("เทมแพลตมาสเตอร์")).toBeInTheDocument();
    expect(screen.getByTestId("ชื่อ*")).toBeInTheDocument();
    expect(screen.getByTestId("ความคุ้มครองต่ำสุด")).toBeInTheDocument();
    expect(screen.getByTestId("ความคุ้มครองสูงสุด")).toBeInTheDocument();
    expect(screen.getByText("อายุต่ำสุด")).toBeInTheDocument();
    expect(screen.getByText("อายุสูงสุด")).toBeInTheDocument();
  });

  it("renders preview button", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    const previewButton = screen.getByText("ดูตัวอย่าง");
    expect(previewButton).toBeInTheDocument();
  });

  it("renders action buttons", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    expect(screen.getByText("ยกเลิก")).toBeInTheDocument();
    expect(screen.getByText("ตกลง")).toBeInTheDocument();
  });

  it("does not render submit button in view mode", async () => {
    render(<AppManageSaleTemplate {...defaultProps} mode="view" />);

    expect(screen.getByText("ยกเลิก")).toBeInTheDocument();
    expect(screen.queryByText("ตกลง")).not.toBeInTheDocument();
  });

  it("disables fields in view mode", async () => {
    render(<AppManageSaleTemplate {...defaultProps} mode="view" />);

    expect(screen.getByTestId("เทมแพลตมาสเตอร์")).toBeDisabled();
    expect(screen.getByTestId("ชื่อ*")).toBeDisabled();
  });

  it("calls handleFetchTemplate on open", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    await waitFor(() => {
      expect(mockHandleFetchTemplate).toHaveBeenCalled();
    });
  });

  it("handles template master selection", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    const templateField = screen.getByTestId("เทมแพลตมาสเตอร์");
    const templateOption = screen.getByTestId("template-option-1");

    fireEvent.click(templateOption);

    expect(templateField).toBeInTheDocument();
    expect(templateOption).toBeInTheDocument();
  });

  it("handles preview button click successfully", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob()),
    });

    render(<AppManageSaleTemplate {...defaultProps} />);

    const previewButton = screen.getByText("ดูตัวอย่าง");
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/direct?action=GenerateReportByApplicationCode",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/octet-stream",
          },
          body: JSON.stringify({ app_code: "T001" }),
        })
      );
    });

    expect(global.mockWindowOpen).toHaveBeenCalledWith(
      "blob:mock-url",
      "_blank"
    );
    expect(global.mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("handles preview button click with error", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AppManageSaleTemplate {...defaultProps} />);

    const previewButton = screen.getByText("ดูตัวอย่าง");
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(mockHandleSnackAlert).toHaveBeenCalledWith({
        open: true,
        message: "เกิดข้อผิดพลาดบางประการ",
      });
    });
  });

  it("disables preview button when no template selected", async () => {
    mockWatch.mockReturnValue(null);

    render(<AppManageSaleTemplate {...defaultProps} />);

    const previewButton = screen.getByText("ดูตัวอย่าง");
    expect(previewButton).toBeDisabled();
  });

  it("shows loading indicator when previewing", async () => {
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                ok: true,
                blob: () => Promise.resolve(new Blob()),
              }),
            100
          );
        })
    );

    render(<AppManageSaleTemplate {...defaultProps} />);

    const previewButton = screen.getByText("ดูตัวอย่าง");
    fireEvent.click(previewButton);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("handles form submission in create mode", async () => {
    const { container } = render(
      <AppManageSaleTemplate {...defaultProps} mode="create" />
    );

    const form = container.querySelector("form");
    fireEvent.submit(form);

    expect(mockHandleNotification).toHaveBeenCalledWith(
      "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      expect.any(Function),
      null,
      "question"
    );

    // Execute confirmation callback
    const confirmCallback = mockHandleNotification.mock.calls[0][1];
    confirmCallback();

    expect(mockHandleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        is_new: true,
        product_app_temp_id: "mock-uuid",
        app_temp_name: "Test Template",
        active_status: null,
        name_status: "รออนุมัติ",
        create_by: "admin",
      })
    );
  });

  it("handles form submission in edit mode", async () => {
    const initialData = {
      product_app_temp_id: "existing-id",
      app_temp_id: "1",
      existing_field: "existing_value",
    };

    const { container } = render(
      <AppManageSaleTemplate
        {...defaultProps}
        mode="edit"
        initialData={initialData}
      />
    );

    const form = container.querySelector("form");
    fireEvent.submit(form);

    const confirmCallback = mockHandleNotification.mock.calls[0][1];
    confirmCallback();

    expect(mockHandleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        ...initialData,
        app_temp_name: "Test Template",
        active_status: null,
        name_status: "รออนุมัติ",
        update_by: "admin",
      })
    );
  });

  it("handles cancel button click without dirty form", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    const cancelButton = screen.getByText("ยกเลิก");
    fireEvent.click(cancelButton);

    expect(mockReset).toHaveBeenCalled();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  /*   it("handles cancel button click with dirty form", async () => {
    const mockFormMethods = {
      watch: mockWatch,
      reset: mockReset,
      control: {},
      formState: { errors: {}, isDirty: true },
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
    };

    jest.mocked(require("@hooks").useAppForm).mockReturnValue(mockFormMethods);

    render(<AppManageSaleTemplate {...defaultProps} />);

    const cancelButton = screen.getByText("ยกเลิก");
    fireEvent.click(cancelButton);

    expect(mockHandleNotification).toHaveBeenCalledWith(
      "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
      expect.any(Function),
      null,
      "question"
    );

    // Execute confirmation callback
    const confirmCallback = mockHandleNotification.mock.calls[0][1];
    confirmCallback();

    expect(mockReset).toHaveBeenCalled();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  }); */

  it("handles dialog close with backdrop click prevention", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    const backdrop = screen.getByText("backdrop");
    fireEvent.click(backdrop);

    // Should not close the dialog on backdrop click
    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  it("resets form for create mode when opened", async () => {
    render(<AppManageSaleTemplate {...defaultProps} mode="create" />);

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        template_master: null,
        app_temp_name: null,
        min_coverage_amount: null,
        max_coverage_amount: null,
        min_age_years: null,
        min_age_months: null,
        min_age_days: null,
        max_age_years: null,
        max_age_months: null,
        max_age_days: null,
      });
    });
  });

  it("loads initial data for edit mode", async () => {
    const initialData = {
      app_temp_id: "1",
      app_temp_name: "Existing Template",
      min_coverage_amount: 5000,
    };

    render(
      <AppManageSaleTemplate
        {...defaultProps}
        mode="edit"
        initialData={initialData}
      />
    );

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith(
        expect.objectContaining({
          ...initialData,
          template_master: expect.objectContaining({
            app_temp_id: "1",
          }),
        })
      );
    });
  });

  it("handles numeric field changes", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    const minCoverageField = screen.getByTestId("ความคุ้มครองต่ำสุด");
    const maxCoverageField = screen.getByTestId("ความคุ้มครองสูงสุด");

    fireEvent.change(minCoverageField, { target: { value: "1000" } });
    fireEvent.change(maxCoverageField, { target: { value: "100000" } });

    expect(minCoverageField).toBeInTheDocument();
    expect(maxCoverageField).toBeInTheDocument();
  });

  it("handles age field inputs", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    // Find age input fields by their InputAdornment text
    const yearInputs = screen.getAllByText("ปี");
    const monthInputs = screen.getAllByText("เดือน");
    const dayInputs = screen.getAllByText("วัน");

    expect(yearInputs).toHaveLength(2); // min and max age years
    expect(monthInputs).toHaveLength(2); // min and max age months
    expect(dayInputs).toHaveLength(2); // min and max age days
  });

  /*   it("displays validation errors", async () => {
    const mockFormWithErrors = {
      watch: mockWatch,
      reset: mockReset,
      control: {},
      formState: {
        errors: {
          template_master: { message: "Template is required" },
          app_temp_name: { message: "Name is required" },
          min_coverage_amount: { message: "Min coverage is required" },
        },
        isDirty: false,
      },
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
    };

    jest
      .mocked(require("@hooks").useAppForm)
      .mockReturnValue(mockFormWithErrors);

    render(<AppManageSaleTemplate {...defaultProps} />);

    expect(screen.getByText("Template is required")).toBeInTheDocument();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Min coverage is required")).toBeInTheDocument();
  }); */

  it("handles form submission with validation errors", async () => {
    const mockOnError = jest.fn();
    mockHandleSubmit.mockImplementation((onSubmit, onError) => (e) => {
      e && e.preventDefault();
      const errors = { template_master: { message: "Required" } };
      onError(errors, e);
    });

    const { container } = render(<AppManageSaleTemplate {...defaultProps} />);

    const form = container.querySelector("form");
    fireEvent.submit(form);

    // The onError should be called internally
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("disables submit button when form is not dirty", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    const submitButton = screen.getByText("ตกลง");
    expect(submitButton).toBeDisabled();
  });

  /*   it("enables submit button when form is dirty", async () => {
    const mockFormWithDirty = {
      watch: mockWatch,
      reset: mockReset,
      control: {},
      formState: { errors: {}, isDirty: true },
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
    };

    jest
      .mocked(require("@hooks").useAppForm)
      .mockReturnValue(mockFormWithDirty);

    render(<AppManageSaleTemplate {...defaultProps} />);

    const submitButton = screen.getByText("ตกลง");
    expect(submitButton).not.toBeDisabled();
  }); */

  it("handles successful fetch without response error", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<AppManageSaleTemplate {...defaultProps} />);

    const previewButton = screen.getByText("ดูตัวอย่าง");
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(mockHandleSnackAlert).toHaveBeenCalledWith({
        open: true,
        message: "เกิดข้อผิดพลาดบางประการ",
      });
    });
  });

  it("handles window.open failure", async () => {
    global.window.open.mockReturnValue(null);
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob()),
    });

    render(<AppManageSaleTemplate {...defaultProps} />);

    const previewButton = screen.getByText("ดูตัวอย่าง");
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  it("handles template master options correctly", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    await waitFor(() => {
      const optionsContainer = screen.getByTestId("เทมแพลตมาสเตอร์-options");
      expect(optionsContainer).toBeInTheDocument();
    });
  });

  it("handles component state changes correctly", async () => {
    const { rerender } = render(
      <AppManageSaleTemplate {...defaultProps} open={false} />
    );

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();

    rerender(<AppManageSaleTemplate {...defaultProps} open={true} />);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("handles missing template master data", async () => {
    mockHandleFetchTemplate.mockResolvedValue([]);

    render(<AppManageSaleTemplate {...defaultProps} />);

    await waitFor(() => {
      expect(mockHandleFetchTemplate).toHaveBeenCalled();
    });
  });

  it("handles form field registration", async () => {
    render(<AppManageSaleTemplate {...defaultProps} />);

    expect(mockRegister).toHaveBeenCalledWith("app_temp_name");
    expect(mockRegister).toHaveBeenCalledWith("min_age_years");
    expect(mockRegister).toHaveBeenCalledWith("min_age_months");
    expect(mockRegister).toHaveBeenCalledWith("min_age_days");
    expect(mockRegister).toHaveBeenCalledWith("max_age_years");
    expect(mockRegister).toHaveBeenCalledWith("max_age_months");
    expect(mockRegister).toHaveBeenCalledWith("max_age_days");
  });
});
