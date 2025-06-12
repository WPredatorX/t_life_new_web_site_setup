import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderAfterHook } from "@utilities/jest";
import PageCommonSetting from "../page-product-detail/components/pageCommonSetting";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { APPLICATION_CONFIGURATION } from "@constants";
import { useFieldArray } from "react-hook-form";

// Mock dependencies
jest.mock("@/hooks", () => ({
  useAppSnackbar: () => ({
    handleSnackAlert: jest.fn(),
  }),
  useAppDialog: () => ({
    handleNotification: jest.fn(),
  }),
  useAppSelector: jest.fn((selector) => ({
    sasToken: { sas_files: "?token=123" },
    activator: "test_user",
  })),
  useAppFieldArray: () => ({
    fields: [],
    append: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    insert: jest.fn(),
  }),
}));

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useFieldArray: ({ control, name }) => {
      const mockFunctions = {
        fields: [],
        append: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        insert: jest.fn(),
      };

      if (name === "document_1") {
        return {
          ...mockFunctions,
          fields: [{ id: "1", title: "Test Document 1" }],
        };
      }

      if (name === "document_2") {
        return {
          ...mockFunctions,
          fields: [{ id: "2", title: "Test Document 2" }],
        };
      }

      return mockFunctions;
    },
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: "" } }),
  };
});

jest.mock("@/components", () => ({
  AppCard: ({ children, title }) => (
    <div data-testid="app-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
  AppAutocomplete: ({ label, onChange }) => (
    <select
      data-testid="app-autocomplete"
      onChange={(e) => onChange(e, { value: e.target.value })}
    >
      <option value="">{label}</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  ),
}));

// Mock fetch
global.fetch = jest.fn();

describe("PageCommonSetting", () => {
  let mockStore = null;
  let mockProductStatusCode = null;
  const mockProps = {
    mode: "EDIT",
    type: "0",
    formMethods: {
      watch: jest.fn(),
      control: {
        _formValues: {},
        _formState: {},
        _defaultValues: {},
        _formFields: {},
        _getDirty: jest.fn(),
        _updateValid: jest.fn(),
        _updateFieldArray: jest.fn(),
      },
      register: jest.fn(),
      setValue: jest.fn(),
      formState: { errors: {} },
    },
    handleFetchTemplate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
      ok: true,
    });
    mockProductStatusCode = 200;
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (
        req.url.includes("/api/products?action=PreviewReportByDocumentCode")
      ) {
        return {
          status: 200,
          body: JSON.stringify({
            quo_document_id: "Mock quo id",
            document_code: "mock doc code",
          }),
        };
      }
    });
    mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      preloadedState: {
        global: {
          ...globalInitialState,
          auth: {
            roles: [
              {
                role_name: "mock-role",
                menus: [
                  {
                    code: "menu-001",
                    feature: [
                      {
                        code: "feature-001",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
  });

  it("renders all sections correctly", async () => {
    mockProps.formMethods.watch.mockImplementation((name) => {
      if (name === "document_1") return [];
      if (name === "document_2") return [];
      if (name === "selectDoc") return { document_detail_size: 2 };
      return null;
    });

    await renderAfterHook(<PageCommonSetting {...mockProps} />);

    expect(screen.getByText("การกรอกใบคำขอ")).toBeInTheDocument();
    expect(screen.getByText("การคำนวณเบี้ยและการขาย")).toBeInTheDocument();
    expect(screen.getByText("อัปโหลดเอกสาร")).toBeInTheDocument();
    expect(screen.getByText("การแจ้งเตือนและส่งเอกสาร")).toBeInTheDocument();
    expect(screen.getByText("ใบเสนอราคา")).toBeInTheDocument();
  });

  /* it("handles document template operations", async () => {
    const mockInsert = jest.fn();
    mockProps.formMethods.watch.mockImplementation((name) => {
      if (name === "document_1")
        return [{ id: "1", title: "Test Document 1", document_code: "DOC001" }];
      if (name === "selectDoc")
        return { document_detail_size: 2, document_id: "DOC001" };
      if (name === "title") return "Test Title";
      return null;
    });

    jest.spyOn(require("react-hook-form"), "useFieldArray").mockReturnValue({
      fields: [],
      insert: mockInsert,
      remove: jest.fn(),
      update: jest.fn(),
    });

    await renderAfterHook(<PageCommonSetting {...mockProps} />);

    // Test adding document
    const addButtons = screen.getAllByText(/เพิ่มบรรทัด/);
    fireEvent.click(addButtons[0]);
    expect(mockInsert).toHaveBeenCalled();

    // Test removing document
    const { remove } = useFieldArray({
      control: mockProps.formMethods.control,
      name: "document_1",
    });
    remove(0);

    // Test removing all documents
    const removeAllButtons = screen.getAllByText("ลบทั้งหมด");
    fireEvent.click(removeAllButtons[0]);

    // Test document preview
    const previewButtons = screen.getAllByText("ดูเอกสาร");
    fireEvent.click(previewButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/products?action=PreviewReportByDocumentCode"
        ),
        expect.any(Object)
      );
    });
  }); */

  /* it("handles file uploads and previews", async () => {
    const mockFile = new File(["test"], "test.pdf", {
      type: "application/pdf",
    });

    mockProps.formMethods.watch.mockImplementation((name) => {
      if (name === "document_1") return [];
      if (name === "selectDoc") return { document_detail_size: 2 };
      if (name === "beneficiary_document.policy_document_name")
        return "test.pdf";
      if (name === "beneficiary_document.policy_document_file")
        return "base64string";
      return null;
    });

    await renderAfterHook(<PageCommonSetting {...mockProps} />);

    // Test beneficiary document upload
    const beneficiaryInput = screen.getByLabelText(
      "เอกสารสิทธิประโยชน์ตามกรมธรรม์"
    );
    fireEvent.change(beneficiaryInput, { target: { files: [mockFile] } });

    // Test beneficiary document preview
    const previewButtons = screen.getAllByText("ดูเอกสาร");
    fireEvent.click(previewButtons[1]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/direct?action=PreviewPolicy"),
        expect.any(Object)
      );
    });
  }); */

  it("handles form switches and controls", async () => {
    mockProps.formMethods.watch.mockImplementation((name) => {
      if (name === "document_1") return [];
      if (name === "selectDoc") return { document_detail_size: 2 };
      if (name === "commonSetting.is_check_fatca") return true;
      if (name === "commonSetting.is_fatca") return true;
      if (name === "commonSetting.is_sale_fatca") return true;
      if (name === "commonSetting.is_crs") return true;
      if (name === "commonSetting.is_sale_crs") return true;
      if (name === "commonSetting.is_health") return true;
      if (name === "commonSetting.is_refund") return true;
      if (name === "commonSetting.is_recurring") return true;
      if (name === "commonSetting.is_tax") return true;
      if (name === "commonSetting.is_send_sms") return true;
      if (name === "commonSetting.is_send_mail") return true;
      return null;
    });

    await renderAfterHook(<PageCommonSetting {...mockProps} />);

    // Test all switches
    const switches = screen.getAllByRole("checkbox");
    switches.forEach((switch_) => {
      fireEvent.click(switch_);
    });
  });

  /* it("handles disease document operations", async () => {
    mockProps.formMethods.watch.mockImplementation((name) => {
      if (name === "document_2") return [];
      if (name === "selectDoc") return { document_id: "DOC001" };
      if (name === "title") return "Test Title";
      return null;
    });

    await renderAfterHook(<PageCommonSetting {...mockProps} />);

    // Test adding disease document
    const addButtons = screen.getAllByText(/เพิ่มบรรทัด/);
    fireEvent.click(addButtons[1]);

    // Test removing disease document
    const removeButton = screen.getByText("ลบออก");
    fireEvent.click(removeButton);

    // Test removing all disease documents
    const removeAllButton = screen.getByText("ลบทั้งหมด");
    fireEvent.click(removeAllButton);
  }); */

  /* it("handles invalid file uploads", async () => {
    const mockFile = new File(["test"], "test.txt", { type: "text/plain" });

    mockProps.formMethods.watch.mockImplementation((name) => {
      if (name === "document_1") return [];
      if (name === "selectDoc") return { document_detail_size: 2 };
      return null;
    });

    await renderAfterHook(<PageCommonSetting {...mockProps} />);

    // Test invalid file upload
    const beneficiaryInput = screen.getByLabelText(
      "เอกสารสิทธิประโยชน์ตามกรมธรรม์"
    );
    fireEvent.change(beneficiaryInput, { target: { files: [mockFile] } });

    // Should show error message
    expect(
      screen.getByText("กรุณาอัปโหลดไฟล์ PDF เท่านั้น")
    ).toBeInTheDocument();
  }); */

  /* it("handles view mode correctly", async () => {
    const viewModeProps = {
      ...mockProps,
      mode: "VIEW",
    };

    mockProps.formMethods.watch.mockImplementation((name) => {
      if (name === "document_1") return [];
      if (name === "selectDoc") return { document_detail_size: 2 };
      return null;
    });

    await renderAfterHook(<PageCommonSetting {...viewModeProps} />);

    // Check if all inputs are disabled
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("readonly");
    });

    // Check if all switches are disabled
    const switches = screen.getAllByRole("checkbox");
    switches.forEach((switch_) => {
      expect(switch_).toBeDisabled();
    });

    // Check if all buttons are disabled
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  }); */
});
