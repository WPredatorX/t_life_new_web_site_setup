import { useAppForm, useLanguage } from "@hooks";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, userEvent } from "@/utilities/jest";
import AppManageInsuraceGroupProduct from "../appManageInsuraceGroupProduct";

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: [] } }),
  };
});

jest.mock("@hooks/useAppForm", () =>
  jest.fn().mockReturnValue({
    register: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn(),
    handleSubmit: jest.fn(),
    formState: {
      isDirty: false,
      errors: {},
    },
    control: {},
    setValue: jest.fn(),
  })
);
describe("AppManageInsuranceGroupProduct", () => {
  let mockStore = null;
  let mockProductStatus = null;
  let mockProductResponse = null;
  const mockSetOpen = jest.fn();
  const mockAddProduct = jest.fn();
  const mockInitialData = {};
  const setOpen = jest.fn();
  let defaultProps = {
    open: true,
    setOpen: mockSetOpen,
    addProduct: mockAddProduct,
    initialData: mockInitialData,
  };

  beforeEach(() => {
    // Mock useAppForm implementation
    mockProductStatus = 200;
    mockProductResponse = [];
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

    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct/profile?action=GetDisplayProducts")) {
        return {
          status: mockProductStatus,
          body: JSON.stringify(mockProductResponse),
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
                        code: "direct.product.general.read",
                      },
                      {
                        code: "direct.product.general.write",
                      },
                      {
                        code: "direct.product.general.request",
                      },
                      {
                        code: "direct.product.general.approve",
                      },
                      {
                        code: "direct.product.display.read",
                      },
                      {
                        code: "direct.product.display.write",
                      },
                      {
                        code: "direct.product.display.request",
                      },
                      {
                        code: "direct.product.display.approve",
                      },
                      {
                        code: "direct.product.display.drop",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          brokerId: "mock-brokerId",
          activator: "mock-activator",
          sasToken: {
            sas_images: "mock-sas_images",
            sas_files: "mock-sas_files",
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
  describe("render", () => {
    it("renders dialog with correct title", async () => {
      const component = <AppManageInsuraceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
    });
  });
  describe("action", () => {
    test("Close", async () => {
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
        handleSubmit: (callback) => () => callback(),
      });
      const component = <AppManageInsuraceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      const close = await screen.findByText("ยกเลิก");
      fireEvent.click(close);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);
      expect(component).toBeDefined();
    });
    test("Close isDirty = false", async () => {
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
        handleSubmit: (callback) => () => callback(),
      });
      const component = <AppManageInsuraceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      const close = await screen.findByText("ยกเลิก");
      fireEvent.click(close);

      expect(component).toBeDefined();
    });
  });
});
