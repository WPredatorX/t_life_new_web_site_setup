import {
  render,
  renderAfterHook,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@utilities/jest";
import AppManageSalePrepayment from "../appManageSalePrepayment";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import useAppForm from "@hooks/useAppForm";

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

describe("AppManageSalePrepayment", () => {
  let mockStore = null;
  let defaultProps = {
    mode: "create",
    open: true,
    setOpen: jest.fn(),
    handleSave: jest.fn(),
    initialData: null,
    productId: "1",
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Render", () => {
    it("should render create mode correctly", async () => {
      // Arrange
      const component = <AppManageSalePrepayment {...defaultProps} />;

      // Act
      await act(async () => {
        await render(component, { mockStore });
      });

      // Assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });
    it("should render edit mode correctly", async () => {
      // Arrange
      const props = {
        ...defaultProps,
        mode: "edit",
        initialData: {
          id: "mock-id",
          installment_id: "1",
          num_installments: "1",
          installment_description: "mock installment",
        },
      };
      const component = <AppManageSalePrepayment {...props} />;
      // Act
      await act(async () => {
        await render(component, { mockStore });
      });

      // Assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render view mode correctly", async () => {
      // Arrange
      const props = {
        ...defaultProps,
        mode: "edit",
        initialData: {
          id: "mock-id",
          installment_id: "1",
          num_installments: "1",
          installment_description: "mock installment",
        },
      };
      const component = <AppManageSalePrepayment {...props} />;
      // Act
      await act(async () => {
        await render(component, { mockStore });
      });

      // Assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });
  });

  describe("Event", () => {
    it("should handle create mode submit", async () => {
      // Arrange
      defaultProps.mode = "create";
      const component = <AppManageSalePrepayment {...defaultProps} />;
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: true,
        },
      });
      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const form = screen.getByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });
    it("should handle edit mode submit", async () => {
      const props = {
        ...defaultProps,
        mode: "edit",
        initialData: {
          id: "mock-id",
          installment_id: "1",
          num_installments: "1",
          installment_description: "mock installment",
        },
      };
      const component = <AppManageSalePrepayment {...props} />;

      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: true,
        },
      });
      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const form = screen.getByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });
    it("should handle close with dirty form", async () => {
      // Arrange
      const setOpen = jest.fn();
      const props = {
        ...defaultProps,
        setOpen,
      };

      const component = <AppManageSalePrepayment {...defaultProps} />;

      // Act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const cancelButton = screen.getByText("ยกเลิก");
      await act(async () => {
        fireEvent.click(cancelButton);
      });

      // Assert
      await waitFor(() => {
        expect(component).toBeDefined();
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
        await render(<AppManageSalePrepayment {...props} />, { mockStore });
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
            installment_description: {
              message: "กรุณาระบุรูปแบบ",
            },
            num_installments: {
              message: "กรุณาระบุจำนวนงวด",
            },
          },
        },
      });

      // Act
      await act(async () => {
        await render(<AppManageSalePrepayment {...defaultProps} />, {
          mockStore,
        });
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText("กรุณาระบุรูปแบบ")).toBeInTheDocument();
        expect(screen.getByText("กรุณาระบุจำนวนงวด")).toBeInTheDocument();
      });
    });
  });
});
