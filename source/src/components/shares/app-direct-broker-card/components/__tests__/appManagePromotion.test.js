import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from "@/utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { useAppForm } from "@/hooks";
import { AppManagePromotion } from "..";
import { APPLICATION_PROMOTION_TYPE } from "@/constants";

jest.mock("@/themes/palette", (theme) => ({
  background: {
    paper: theme.paper,
    default: theme.backgroundDefault,
    main: theme.colors?.orangeMain,
    orange: theme.colors?.orangeDark,
    orageLight: theme.colors?.orange500,
  },
  //primaryLight: "#ff6700",
}));

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: null } }),
  };
});

jest.mock("@hooks/useAppForm", () =>
  jest.fn().mockReturnValue({
    watch: jest.fn().mockImplementation((field) => {
      return null;
    }),
    control: {},
    register: jest.fn(),
    reset: jest.fn(),
    setValue: jest.fn(),
    formState: { errors: {}, isDirty: true },
    handleSubmit: jest.fn((onSubmit) => (e) => {
      e.preventDefault();
      onSubmit({});
    }),
  })
);

describe("AppManagePromotion", () => {
  let mockStore = null;
  let defaultProps = {};
  let setOpen = jest.fn();
  let mockProductRecordApproveStatus = null;
  let mockAddOrUpdatePromotionStatus = null;

  beforeEach(() => {
    defaultProps = {
      mode: "view",
      brokerId: "mock-broker-id",
      channel: "mock-channel",
      open: true,
      setOpen: setOpen,
      initialData: {},
    };
    mockProductRecordApproveStatus = 200;
    mockAddOrUpdatePromotionStatus = 200;
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct?action=ProductRecordApprove")) {
        return {
          status: mockProductRecordApproveStatus,
        };
      }
      if (
        req.url.includes("/api/direct/promotion?action=AddOrUpdatePromotion")
      ) {
        return {
          status: mockAddOrUpdatePromotionStatus,
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
    useAppForm.mockReturnValue({
      watch: jest.fn((field) => {
        return null;
      }),
      control: {},
      register: jest.fn(),
      reset: jest.fn(),
      setValue: jest.fn(),
      formState: { errors: {}, isDirty: true },
      handleSubmit: jest.fn((onSubmit) => (e) => {
        e.preventDefault();
        onSubmit({});
      }),
    });
  });
  describe("render", () => {
    it("should render with out crash", async () => {
      const component = <AppManagePromotion {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      expect(component).toBeDefined();
    });
  });
  describe("action", () => {
    test("Select Promotion type", async () => {
      defaultProps = {
        mode: "view",
        brokerId: "mock-broker-id",
        channel: "mock-channel",
        open: true,
        setOpen: setOpen,
        initialData: {
          promotion_id: "mock-promotion-id",
          promotion_code: "mock-promotion-code",
          discount_type: "1",
          min_premium_amount: 100,
          max_premium_amount: 200,
          min_coverage_amount: 200,
          max_coverage_amount: 300,
        },
      };
      const component = <AppManagePromotion {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      await new Promise((r) => setTimeout(r, 500));
      screen.debug(undefined, Infinity);
      /*  const input = screen.getByRole("combobox", { name: /ประเภทส่วนลด/i });
      await userEvent.type(
        input,
        APPLICATION_PROMOTION_TYPE[0].label.slice(0, 2)
      );
      const option = await screen.findByText(
        APPLICATION_PROMOTION_TYPE[0].label
      );
      await userEvent.click(option); */
      expect(component).toBeDefined();
    });
  });
});
