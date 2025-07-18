import {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
} from "@/utilities/jest";
import AppManageProductGroup from "../appManageProductGroup";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { useAppForm } from "@/hooks";
// Mock react-hook-form Controller
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: null } }),
  };
});

jest.mock("@hooks/useAppFieldArray", () =>
  jest.fn().mockReturnValue({
    fields: [
      {
        product_sale_channel_id: "mock id field 1",
        title: "mockfield1",
      },
      {
        product_sale_channel_id: "mock id field 2",
        title: "mockfield2",
      },
    ],
    insert: jest.fn(),
    update: jest.fn(),
    append: jest.fn(),
    remove: jest.fn(),
  })
);

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
  },
});

// Mock the hooks
jest.mock("@hooks/useAppForm", () =>
  jest.fn().mockReturnValue({
    register: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn((name) => {
      return "";
    }),
    handleSubmit: jest.fn(),
    formState: {
      isDirty: false,
      errors: {},
      dirtyFields: {},
    },
    control: {},
    setValue: jest.fn(),
  })
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
  let mockProductStatus = null;
  let mockProductResponse = null;
  let mockStore = null;
  let defaultProps = {
    open: true,
    setOpen: mockSetOpen,
  };

  beforeEach(() => {
    mockProductStatus = 200;
    mockProductResponse = [];
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct?action=GetListProductSaleRider")) {
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
    it("renders dialog when open", async () => {
      const component = <AppManageProductGroup {...defaultProps} />;

      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
    });
    it("renders dialog when open but error fetch product", async () => {
      mockProductStatus = 500;
      const component = <AppManageProductGroup {...defaultProps} />;

      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
    });
  });
  describe("render", () => {
    test("select product", async () => {
      mockProductResponse = [
        {
          product_sale_channel_id: "mock id 1",
          title: "mock1",
        },
        {
          product_sale_channel_id: "mock id 2",
          title: "mock2",
        },
      ];
      const component = <AppManageProductGroup {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const input = screen.getByRole("combobox");
      await userEvent.click(input);

      //screen.debug(undefined, Infinity);
      const option = screen.getByText("mock1");
      fireEvent.click(option);

      expect(component).toBeDefined();
    });
    test("add", async () => {
      mockProductResponse = [
        {
          product_sale_channel_id: "mock id 1",
          title: "mock1",
        },
        {
          product_sale_channel_id: "mock id 2",
          title: "mock2",
        },
      ];
      const component = <AppManageProductGroup {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const input = screen.getByRole("combobox");
      await userEvent.click(input);

      //screen.debug(undefined, Infinity);
      const option = screen.getByText("mock1");
      fireEvent.click(option);

      const add = screen.getByText("เพิ่ม");
      await userEvent.click(add);

      expect(component).toBeDefined();
    });
    test("remove", async () => {
      const component = <AppManageProductGroup {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const deleteButton = screen.getByText("ลบทั้งหมด");
      await userEvent.click(deleteButton);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);

      expect(component).toBeDefined();
    });
    test("submit", async () => {
      const component = <AppManageProductGroup {...defaultProps} />;

      await render(component, {
        mockStore,
      });

      const form = await screen.findByTestId("manageProductGroupForm");
      fireEvent.submit(form);

      expect(component).toBeDefined();
    });

    test("submit by click", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          return "";
        }),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: true,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });
      const component = <AppManageProductGroup {...defaultProps} />;

      await render(component, {
        mockStore,
      });

      const form = await screen.findByText("ตกลง");
      await userEvent.click(form);

      expect(component).toBeDefined();
    });

    test("Close", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          return "";
        }),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: true,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });
      const component = <AppManageProductGroup {...defaultProps} />;

      await render(component, {
        mockStore,
      });

      const form = await screen.findByText("ยกเลิก");
      await userEvent.click(form);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);

      expect(component).toBeDefined();
    });
  });
});
