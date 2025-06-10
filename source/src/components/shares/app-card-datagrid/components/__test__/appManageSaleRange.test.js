// appManageSaleRange.test.js
import {
  render,
  renderAfterHook,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import AppManageSaleRange from "../appManageSaleRange";
import { addDays } from "date-fns";

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
jest.mock("@hooks/useAppForm", () =>
  jest.fn().mockReturnValue({
    register: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn((name) => {
      switch (name) {
        case "sale_start_date":
          return new Date("2024-01-01");
        case "sale_end_date":
          return new Date("2024-01-31");
        default:
          return null;
      }
    }),
    handleSubmit: jest.fn((callback) => (e) => {
      e.preventDefault();
      callback();
    }),
    formState: {
      isDirty: true,
      errors: {},
    },
    control: {},
  })
);

jest.mock("@hooks/useAppDialog", () =>
  jest.fn().mockReturnValue({
    handleNotification: jest.fn((message, onConfirm) => {
      onConfirm();
    }),
  })
);

jest.mock("@hooks/useAppSelector", () =>
  jest.fn().mockReturnValue({
    activator: "mock-user",
  })
);

describe("AppManageSaleRange", () => {
  let mockStore = null;
  let defaultProps = {
    mode: "create",
    open: true,
    setOpen: jest.fn(),
    handleSave: jest.fn(),
    initialData: null,
  };

  beforeEach(() => {
    // Setup store
    mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      preloadedState: {
        global: {
          ...globalInitialState,
          auth: {
            activator: "mock-user",
          },
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Render", () => {
    it("should render create mode correctly", async () => {
      // Arrange
      const component = <AppManageSaleRange {...defaultProps} />;

      // Act
      await act(async () => {
        await render(component, { mockStore });
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText("จัดการระยะเวลาขาย")).toBeInTheDocument();
        expect(screen.getByText("วันที่เริ่มต้น")).toBeInTheDocument();
        expect(screen.getByText("วันที่สิ้นสุด")).toBeInTheDocument();
        expect(screen.getByText("ยกเลิก")).toBeInTheDocument();
        expect(screen.getByText("ตกลง")).toBeInTheDocument();
      });
    });

    it("should render edit mode correctly", async () => {
      // Arrange
      const props = {
        ...defaultProps,
        mode: "edit",
        initialData: {
          sale_period_id: "mock-id",
          sale_start_date: new Date("2024-01-01"),
          sale_end_date: new Date("2024-01-31"),
        },
      };

      // Act
      await act(async () => {
        await render(<AppManageSaleRange {...props} />, { mockStore });
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText("จัดการระยะเวลาขาย")).toBeInTheDocument();
        expect(screen.getByText("วันที่เริ่มต้น")).toBeInTheDocument();
        expect(screen.getByText("วันที่สิ้นสุด")).toBeInTheDocument();
      });
    });

    it("should render view mode correctly", async () => {
      // Arrange
      const props = {
        ...defaultProps,
        mode: "view",
        initialData: {
          sale_period_id: "mock-id",
          sale_start_date: new Date("2024-01-01"),
          sale_end_date: new Date("2024-01-31"),
        },
      };

      // Act
      await act(async () => {
        await render(<AppManageSaleRange {...props} />, { mockStore });
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText("จัดการระยะเวลาขาย")).toBeInTheDocument();
        expect(screen.getByText("วันที่เริ่มต้น")).toBeInTheDocument();
        expect(screen.getByText("วันที่สิ้นสุด")).toBeInTheDocument();
        expect(screen.queryByText("ตกลง")).not.toBeInTheDocument();
      });
    });
  });

  describe("Event", () => {
    it("should handle create mode submit", async () => {
      // Arrange
      const handleSave = jest.fn();
      const props = {
        ...defaultProps,
        handleSave,
      };

      // Act
      await act(async () => {
        await render(<AppManageSaleRange {...props} />, { mockStore });
      });

      const submitButton = screen.getByText("ตกลง");
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Assert
      await waitFor(() => {
        expect(handleSave).toHaveBeenCalledWith(
          expect.objectContaining({
            is_new: true,
            sale_period_id: expect.any(String),
            sale_start_date: expect.any(Date),
            sale_end_date: expect.any(Date),
            name_status: "รออนุมัติ",
            create_by: "mock-user",
            create_date: expect.any(Date),
          })
        );
      });
    });

    it("should handle edit mode submit", async () => {
      // Arrange
      const handleSave = jest.fn();
      const initialData = {
        sale_period_id: "mock-id",
        sale_start_date: new Date("2024-01-01"),
        sale_end_date: new Date("2024-01-31"),
      };
      const props = {
        ...defaultProps,
        mode: "edit",
        initialData,
        handleSave,
      };

      // Act
      await act(async () => {
        await render(<AppManageSaleRange {...props} />, { mockStore });
      });

      const submitButton = screen.getByText("ตกลง");
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Assert
      await waitFor(() => {
        expect(handleSave).toHaveBeenCalledWith(
          expect.objectContaining({
            ...initialData,
            active_status: null,
            sale_start_date: expect.any(Date),
            sale_end_date: expect.any(Date),
            name_status: "รออนุมัติ",
            update_by: "mock-user",
            update_date: expect.any(Date),
          })
        );
      });
    });

    it("should handle close with dirty form", async () => {
      // Arrange
      const setOpen = jest.fn();
      const props = {
        ...defaultProps,
        setOpen,
      };

      // Act
      await act(async () => {
        await render(<AppManageSaleRange {...props} />, { mockStore });
      });

      const cancelButton = screen.getByText("ยกเลิก");
      await act(async () => {
        fireEvent.click(cancelButton);
      });

      // Assert
      await waitFor(() => {
        expect(handleNotification).toHaveBeenCalledWith(
          "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
          expect.any(Function),
          null,
          "question"
        );
      });
    });

    it("should handle close without dirty form", async () => {
      // Arrange
      const setOpen = jest.fn();
      const props = {
        ...defaultProps,
        setOpen,
      };
      useAppForm.mockReturnValue({
        ...useAppForm(),
        formState: {
          isDirty: false,
        },
      });

      // Act
      await act(async () => {
        await render(<AppManageSaleRange {...props} />, { mockStore });
      });

      const cancelButton = screen.getByText("ยกเลิก");
      await act(async () => {
        fireEvent.click(cancelButton);
      });

      // Assert
      await waitFor(() => {
        expect(setOpen).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("Validation", () => {
    it("should show error for required start date", async () => {
      // Arrange
      useAppForm.mockReturnValue({
        ...useAppForm(),
        formState: {
          errors: {
            sale_start_date: {
              message: "กรุณาระบุวันที่เริ่มต้น",
            },
          },
        },
      });

      // Act
      await act(async () => {
        await render(<AppManageSaleRange {...defaultProps} />, { mockStore });
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText("กรุณาระบุวันที่เริ่มต้น")).toBeInTheDocument();
      });
    });
  });
});
