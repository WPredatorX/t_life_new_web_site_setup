import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderAfterHook } from "@utilities/jest";
import PageProductsDetail from "../page-product-detail/index";
import { format } from "date-fns";

// Mock dependencies
jest.mock("@/hooks", () => ({
  useAppSnackbar: () => ({
    handleSnackAlert: jest.fn(),
  }),
  useAppRouter: () => ({
    push: jest.fn(),
  }),
  useAppForm: () => ({
    reset: jest.fn(),
    control: {},
    register: jest.fn(),
    handleSubmit: (fn) => fn,
    clearErrors: jest.fn(),
    formState: { errors: {}, isDirty: false },
    watch: jest.fn().mockImplementation((name) => {
      if (name === "document_1") return [];
      if (name === "selectDoc") return { document_detail_size: 10 };
      return null;
    }),
  }),
  useAppFeatureCheck: () => ({
    validFeature: true,
  }),
  useAppSelector: jest.fn((selector) => ({
    dialog: { open: false },
    activator: "test_user",
  })),
  useAppDispatch: () => jest.fn(),
  useAppDialog: () => ({
    handleNotification: jest.fn(),
  }),
}));

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: (cb) => cb,
      formState: { errors: {}, isDirty: false },
      control: {},
      watch: jest.fn().mockReturnValue(null),
      reset: jest.fn(),
    })),
    useFieldArray: () => ({
      fields: [],
      append: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    }),
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: "" } }),
  };
});

jest.mock("@/components", () => ({
  AppLoadData: ({ loadingState }) => (
    <div data-testid="app-load-data" data-loading-state={loadingState}>
      {loadingState ? "Loading..." : null}
    </div>
  ),
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
      <option value="1">Active</option>
      <option value="0">Inactive</option>
    </select>
  ),
  AppDatePicker: ({ label, onChange }) => (
    <input
      type="date"
      data-testid="app-date-picker"
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

// Mock fetch
global.fetch = jest.fn();

describe("PageProductsDetail", () => {
  const mockProps = {
    mode: "EDIT",
    type: "0",
    i_package: "NP-00",
    productId: "TEST001",
    product_plan_id: "123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve([]),
    });

    jest.spyOn(require("@/hooks"), "useAppForm").mockReturnValue({
      reset: jest.fn(),
      control: {},
      register: jest.fn(),
      handleSubmit: (fn) => fn,
      clearErrors: jest.fn(),
      formState: { errors: {}, isDirty: false },
      watch: jest.fn().mockReturnValue(undefined),
    });
  });

  it("renders loading state initially", async () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));
    await renderAfterHook(<PageProductsDetail {...mockProps} />);
    expect(screen.getByTestId("app-load-data")).toBeInTheDocument();
  });

  it("renders the component with initial data", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve([
          {
            product_plan_id: "123",
            title: "Test Product",
            description: "Test Description",
            is_active: true,
            create_date: new Date(),
            create_by: "test_user",
          },
        ]),
    });

    await renderAfterHook(<PageProductsDetail {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText("ข้อมูลทั่วไป")).toBeInTheDocument();
      expect(screen.getByText("ตั้งค่าทั่วไป")).toBeInTheDocument();
    });
  });

  it("handles form submission", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              product_plan_id: "123",
              title: "Test Product",
              description: "Test Description",
              is_active: true,
            },
          ]),
      })
    );

    const mockWatch = jest.fn().mockImplementation((name) => {
      if (name === "document_1") return [];
      if (name === "selectDoc") return { document_detail_size: 10 };
      return {
        title: "Test Product",
        description: "Test Description",
        is_active: true,
      };
    });

    jest.spyOn(require("@/hooks"), "useAppForm").mockReturnValue({
      reset: jest.fn(),
      control: {},
      register: jest.fn(),
      handleSubmit: (fn) => fn,
      clearErrors: jest.fn(),
      formState: { errors: {}, isDirty: true },
      watch: mockWatch,
    });

    await renderAfterHook(<PageProductsDetail {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText("บันทึก")).toBeInTheDocument();
    });

    const submitButton = screen.getByText("บันทึก");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products?action=GetProductOnShelfById"),
        expect.any(Object)
      );
    });
  });

  it("handles form reset", async () => {
    const mockHandleNotification = jest.fn();
    jest.spyOn(require("@/hooks"), "useAppDialog").mockReturnValue({
      handleNotification: mockHandleNotification,
    });

    jest.spyOn(require("@/hooks"), "useAppForm").mockReturnValue({
      reset: jest.fn(),
      control: {},
      register: jest.fn(),
      handleSubmit: (fn) => fn,
      clearErrors: jest.fn(),
      formState: { errors: {}, isDirty: true },
      watch: jest.fn().mockReturnValue(null),
    });

    await renderAfterHook(<PageProductsDetail {...mockProps} />);

    const resetButton = screen.getByText("ล้างข้อมูล");
    fireEvent.click(resetButton);

    expect(mockHandleNotification).toHaveBeenCalled();
  });

  it("handles back button click", async () => {
    const mockHandleNotification = jest.fn();
    jest.spyOn(require("@/hooks"), "useAppDialog").mockReturnValue({
      handleNotification: mockHandleNotification,
    });

    await renderAfterHook(<PageProductsDetail {...mockProps} />);

    const backButton = screen.getByText("ยกเลิก / ออก");
    fireEvent.click(backButton);

    expect(mockHandleNotification).toHaveBeenCalled();
  });

  it("handles tab change", async () => {
    await renderAfterHook(<PageProductsDetail {...mockProps} />);

    const settingsTab = screen.getByText("ตั้งค่าทั่วไป");
    fireEvent.click(settingsTab);

    await waitFor(() => {
      expect(screen.getByText("ตั้งค่าทั่วไป")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  it("handles error state", async () => {
    global.fetch.mockRejectedValueOnce(new Error("API Error"));

    await renderAfterHook(<PageProductsDetail {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("app-load-data")).toBeInTheDocument();
    });
  });

  it("disables save button when form is not dirty", async () => {
    jest.spyOn(require("@/hooks"), "useAppForm").mockReturnValue({
      reset: jest.fn(),
      control: {},
      register: jest.fn(),
      handleSubmit: (fn) => fn,
      clearErrors: jest.fn(),
      formState: { errors: {}, isDirty: false },
      watch: jest.fn().mockReturnValue(null),
    });

    await renderAfterHook(<PageProductsDetail {...mockProps} />);

    const saveButton = screen.getByText("บันทึก");
    expect(saveButton).toBeDisabled();
  });

  it("handles document template fetch", async () => {
    const mockTemplateData = [{ id: 1, title: "Template 1" }];
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockTemplateData),
    });

    await renderAfterHook(<PageProductsDetail {...mockProps} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products?action=getProductDocument"),
        expect.any(Object)
      );
    });
  });
});
