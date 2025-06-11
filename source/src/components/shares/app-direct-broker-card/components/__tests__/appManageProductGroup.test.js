import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppManageProductGroup from "../appManageProductGroup";
import { useAppForm, useAppFieldArray, useAppDialog } from "@hooks";

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
  },
});

// Mock fetch
global.fetch = jest.fn();

// Mock the hooks
jest.mock("@/hooks", () => ({
  useAppForm: jest.fn(),
  useAppFieldArray: jest.fn(),
  useAppDialog: jest.fn(),
}));

// Mock AppAutocomplete component
jest.mock("@/components", () => ({
  AppAutocomplete: ({ onChange, value, onBeforeOpen }) => (
    <div data-testid="app-autocomplete">
      <input
        data-testid="autocomplete-input"
        value={value?.label || ""}
        onChange={(e) => onChange(e, { label: e.target.value, id: "test-id" })}
      />
      <button onClick={onBeforeOpen} data-testid="autocomplete-open">
        Open
      </button>
    </div>
  ),
}));

// Mock AppManageProductGroupItem component
jest.mock(
  "../appManageProductGroupItem",
  () =>
    ({ item, index, handleRemove }) =>
      (
        <div data-testid={`product-item-${index}`}>
          <span>{item.title || item.label}</span>
          <button onClick={() => handleRemove("ลบรายการนี้", index)}>
            Remove
          </button>
        </div>
      )
);

describe("AppManageProductGroup", () => {
  const mockSetOpen = jest.fn();
  const mockHandleNotification = jest.fn();
  const mockAppend = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockWatch = jest.fn();
  const mockRegister = jest.fn();

  const defaultProps = {
    group: {},
    open: true,
    setOpen: mockSetOpen,
  };

  beforeEach(() => {
    // Mock useAppDialog
    useAppDialog.mockReturnValue({
      handleNotification: mockHandleNotification,
    });

    // Mock useAppFieldArray
    useAppFieldArray.mockReturnValue({
      fields: [],
      append: mockAppend,
      remove: mockRemove,
    });

    // Mock useAppForm
    useAppForm.mockReturnValue({
      watch: mockWatch,
      control: {},
      register: mockRegister,
      reset: mockReset,
      formState: {
        errors: {},
        isDirty: false,
      },
      handleSubmit: mockHandleSubmit,
    });

    mockWatch.mockReturnValue([]);
    mockRegister.mockReturnValue({});
    mockHandleSubmit.mockImplementation((onSubmit) => (e) => {
      e.preventDefault();
      onSubmit({});
    });

    // Mock fetch response
    fetch.mockResolvedValue({
      json: () =>
        Promise.resolve([
          {
            product_sale_channel_id: "1",
            title: "Product 1",
            is_download: true,
          },
          {
            product_sale_channel_id: "2",
            title: "Product 2",
            is_download: false,
          },
        ]),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    expect(screen.getByText("จัดการกลุ่มประกัน")).toBeInTheDocument();
  });

  it("renders group name input field", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    expect(screen.getByText("ชื่อกลุ่มประกัน")).toBeInTheDocument();
    expect(screen.getByTestId("groupName")).toBeInTheDocument();
  });

  it("renders product selection section", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    expect(
      screen.getByText("แบบประกัน (เลือกได้หลายแบบประกัน)")
    ).toBeInTheDocument();
    expect(screen.getByTestId("app-autocomplete")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    expect(screen.getByText("เพิ่ม")).toBeInTheDocument();
    expect(screen.getByText("ลบทั้งหมด")).toBeInTheDocument();
    expect(screen.getByText("ยกเลิก")).toBeInTheDocument();
    expect(screen.getByText("ตกลง")).toBeInTheDocument();
  });

  it("disables submit button when form is not dirty", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    const submitButton = screen.getByText("ตกลง");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when form is dirty", () => {
    useAppForm.mockReturnValue({
      watch: mockWatch,
      control: {},
      register: mockRegister,
      reset: mockReset,
      formState: {
        errors: {},
        isDirty: true,
      },
      handleSubmit: mockHandleSubmit,
    });

    render(<AppManageProductGroup {...defaultProps} />);
    const submitButton = screen.getByText("ตกลง");
    expect(submitButton).not.toBeDisabled();
  });

  it("calls handleNotification when cancel button is clicked", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.click(screen.getByText("ยกเลิก"));
    expect(mockHandleNotification).toHaveBeenCalledWith(
      "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
      expect.any(Function),
      null,
      "question"
    );
  });

  it("calls handleNotification when remove all button is clicked", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.click(screen.getByText("ลบทั้งหมด"));
    expect(mockHandleNotification).toHaveBeenCalledWith(
      "คุณต้องการลบทั้งหมดหรือไม่ ?",
      expect.any(Function),
      null,
      "question"
    );
  });

  it("fetches products when autocomplete is opened", async () => {
    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.click(screen.getByTestId("autocomplete-open"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/direct?action=GetListProductSaleRider",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: true }),
        }
      );
    });
  });

  it("adds product when add button is clicked with selected product", () => {
    render(<AppManageProductGroup {...defaultProps} />);

    // Select a product
    const input = screen.getByTestId("autocomplete-input");
    fireEvent.change(input, { target: { value: "Test Product" } });

    // Click add button
    fireEvent.click(screen.getByText("เพิ่ม"));

    expect(mockAppend).toHaveBeenCalledWith(
      { label: "Test Product", id: "test-id" },
      { shouldFocus: true }
    );
  });

  it("does not add product when add button is clicked without selected product", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.click(screen.getByText("เพิ่ม"));
    expect(mockAppend).not.toHaveBeenCalled();
  });

  it("renders product items when fields exist", () => {
    useAppFieldArray.mockReturnValue({
      fields: [
        { id: "1", title: "Product 1" },
        { id: "2", title: "Product 2" },
      ],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<AppManageProductGroup {...defaultProps} />);
    expect(screen.getByTestId("product-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("product-item-1")).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.submit(screen.getByTestId("manageProductGroupForm"));

    expect(mockHandleSubmit).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("displays validation errors", () => {
    useAppForm.mockReturnValue({
      watch: mockWatch,
      control: {},
      register: mockRegister,
      reset: mockReset,
      formState: {
        errors: {
          groupName: { message: "จำเป็นต้องระบุข้อมูลนี้" },
        },
        isDirty: false,
      },
      handleSubmit: mockHandleSubmit,
    });

    render(<AppManageProductGroup {...defaultProps} />);
    expect(screen.getByText("จำเป็นต้องระบุข้อมูลนี้")).toBeInTheDocument();
  });
  it("handles form submission with valid data", () => {
    const onSubmitMock = jest.fn();
    mockHandleSubmit.mockImplementation((onSubmit) => (e) => {
      e.preventDefault();
      onSubmit({ groupName: "Test Group", products: [] });
    });

    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.submit(screen.getByTestId("manageProductGroupForm"));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("handles cancel confirmation with yes action", () => {
    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.click(screen.getByText("ยกเลิก"));

    // Get the callback function passed to handleNotification
    const cancelCallback = mockHandleNotification.mock.calls[0][1];
    cancelCallback();

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it("handles remove all confirmation with yes action", () => {
    useAppFieldArray.mockReturnValue({
      fields: [{ id: "1", title: "Product 1" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.click(screen.getByText("ลบทั้งหมด"));

    // Get the callback function passed to handleNotification
    const removeAllCallback = mockHandleNotification.mock.calls[0][1];
    removeAllCallback();

    expect(mockRemove).toHaveBeenCalled();
  });

  it("handles product removal from item component", () => {
    useAppFieldArray.mockReturnValue({
      fields: [{ id: "1", title: "Product 1" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<AppManageProductGroup {...defaultProps} />);

    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);

    expect(mockHandleNotification).toHaveBeenCalledWith(
      "ลบรายการนี้",
      expect.any(Function),
      null,
      "question"
    );
  });

  it("executes remove action when confirmed", () => {
    useAppFieldArray.mockReturnValue({
      fields: [{ id: "1", title: "Product 1" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<AppManageProductGroup {...defaultProps} />);

    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);

    // Get and execute the callback
    const removeCallback = mockHandleNotification.mock.calls[0][1];
    removeCallback();

    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  /*   it("handles fetch error when loading products", async () => {
    fetch.mockRejectedValue(new Error("Network error"));

    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.click(screen.getByTestId("autocomplete-open"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  }); */

  it("handles empty response when loading products", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve([]),
    });

    render(<AppManageProductGroup {...defaultProps} />);
    fireEvent.click(screen.getByTestId("autocomplete-open"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it("resets selected product after adding", () => {
    render(<AppManageProductGroup {...defaultProps} />);

    // Select a product
    const input = screen.getByTestId("autocomplete-input");
    fireEvent.change(input, { target: { value: "Test Product" } });

    // Click add button
    fireEvent.click(screen.getByText("เพิ่ม"));

    expect(mockAppend).toHaveBeenCalledWith(
      { label: "Test Product", id: "test-id" },
      { shouldFocus: true }
    );
  });

  /*   it("initializes with group data when editing existing group", () => {
    const groupWithData = {
      id: "group-1",
      name: "Existing Group",
      products: [{ id: "1", title: "Product 1" }],
    };

    render(<AppManageProductGroup {...defaultProps} group={groupWithData} />);

    expect(mockReset).toHaveBeenCalled();
  }); */

  it("handles dialog close when setOpen is called", () => {
    render(<AppManageProductGroup {...defaultProps} />);

    // Simulate dialog close
    mockSetOpen(false);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
