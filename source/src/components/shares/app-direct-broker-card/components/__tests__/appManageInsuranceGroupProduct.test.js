import { fireEvent, render, screen, userEvent } from "@/utilities/jest";
import AppManageInsuranceGroupProduct from "../appManageInsuranceGroupProduct";
import { useAppForm, useLanguage } from "@hooks";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
  },
});

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
      const component = <AppManageInsuranceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
    });
    it("renders dialog with error fetch product", async () => {
      mockProductResponse = {};
      mockProductStatus = 500;
      const component = <AppManageInsuranceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
    });
    it("renders dialog with initialData = null", async () => {
      defaultProps = {
        open: true,
        setOpen: mockSetOpen,
        addProduct: mockAddProduct,
        initialData: null,
      };
      mockProductResponse = {};
      mockProductStatus = 500;
      const component = <AppManageInsuranceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
    });
  });
  describe("action", () => {
    test("select product", async () => {
      mockProductResponse = [
        {
          product_sale_group_id: "dc262047-f4bd-4332-89b6-9b16193330a5",
          title: "เอ็ม บี เค แฮปปี้ เพนชั่น โกลด์ 85/1 (บำนาญแบบลดหย่อนได้)",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161152.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "c63466f4-c376-4b66-ab51-edf15174886c",
        },
      ];
      const component = <AppManageInsuranceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      const input = screen.getByRole("combobox", {
        name: /เลือกผลิตภัณฑ์/i,
      });
      await userEvent.click(input);
      await userEvent.type(
        input,
        "เอ็ม บี เค แฮปปี้ เพนชั่น โกลด์ 85/1 (บำนาญแบบลดหย่อนได้)"
      );

      const option = screen.getByText(
        "เอ็ม บี เค แฮปปี้ เพนชั่น โกลด์ 85/1 (บำนาญแบบลดหย่อนได้)"
      );
      fireEvent.click(option);
      expect(component).toBeDefined();
    });
    test("submit", async () => {
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

      const component = <AppManageInsuranceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      const form = await screen.findByTestId("form-submit");
      fireEvent.submit(form);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);

      expect(component).toBeDefined();
    });
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
      const component = <AppManageInsuranceGroupProduct {...defaultProps} />;
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
      const component = <AppManageInsuranceGroupProduct {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      const close = await screen.findByText("ยกเลิก");
      fireEvent.click(close);

      expect(component).toBeDefined();
    });
  });
});
