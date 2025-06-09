import { render } from "@utilities/jest";
import userEvent from "@testing-library/user-event";
import AppManageInsuranceGroupProduct from "../appManageInsuranceGroupProduct";
import { useAppForm } from "@hooks";

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
  },
});

// Mock useState
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn((initial) => [initial, jest.fn()]),
}));

// Mock the hooks
jest.mock("@/hooks", () => ({
  useAppForm: jest.fn(),
  useAppFieldArray: jest.fn(),
  useAppDialog: () => ({
    handleNotification: jest.fn(),
  }),
  useAppSelector: jest.fn(),
}));

describe("AppManageInsuranceGroupProduct", () => {
  const mockSetOpen = jest.fn();
  const mockAddProduct = jest.fn();
  const mockInitialData = {};
  const setOpen = jest.fn();
  const defaultProps = {
    open: true,
    setOpen: mockSetOpen,
    addProduct: mockAddProduct,
    initialData: mockInitialData,
  };

  beforeEach(() => {
    // Mock useAppForm implementation
    useAppForm.mockReturnValue({
      watch: jest.fn(),
      control: {},
      register: jest.fn(),
      reset: jest.fn(),
      setValue: jest.fn(),
      formState: {
        errors: {},
        isDirty: false,
      },
      handleSubmit: jest.fn((fn) => fn),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title", async () => {
    await render(
      <AppManageInsuranceGroupProduct open={true} setOpen={setOpen} />
    );

    //expect(screen.getByText("เพิ่มหรือลบผลิตภัณฑ์")).toBeInTheDocument();
  });

  /*   it("renders product selection dropdown", () => {
    render(<AppManageInsuranceGroupProduct {...defaultProps} />);
    expect(
      screen.getByLabelText("เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)")
    ).toBeInTheDocument();
  });

  it("renders cancel and confirm buttons", () => {
    render(<AppManageInsuranceGroupProduct {...defaultProps} />);
    expect(screen.getByText("ยกเลิก")).toBeInTheDocument();
    expect(screen.getByText("ตกลง")).toBeInTheDocument();
  });

  it("calls setOpen when cancel button is clicked", () => {
    render(<AppManageInsuranceGroupProduct {...defaultProps} />);
    fireEvent.click(screen.getByText("ยกเลิก"));
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it("disables confirm button when form is not dirty", () => {
    render(<AppManageInsuranceGroupProduct {...defaultProps} />);
    const confirmButton = screen.getByText("ตกลง");
    expect(confirmButton).toBeDisabled();
  });

  it("enables confirm button when form is dirty", () => {
    useAppForm.mockReturnValue({
      watch: jest.fn(),
      control: {},
      register: jest.fn(),
      reset: jest.fn(),
      setValue: jest.fn(),
      formState: {
        errors: {},
        isDirty: true,
      },
      handleSubmit: jest.fn((fn) => fn),
    });

    render(<AppManageInsuranceGroupProduct {...defaultProps} />);
    const confirmButton = screen.getByText("ตกลง");
    expect(confirmButton).not.toBeDisabled(); */
  //});
});
