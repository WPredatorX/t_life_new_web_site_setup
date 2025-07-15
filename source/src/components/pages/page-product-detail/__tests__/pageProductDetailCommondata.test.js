import {
  act,
  screen,
  render,
  waitFor,
  fireEvent,
  renderAfterHook,
  userEvent,
  createMatchMedia,
} from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import PageProductDetailCommondata from "../components/pageProductDetailCommondata";

describe("PageProductDetailCommondata", () => {
  let mockStore = null;
  let defaultProps = null;

  beforeEach(() => {
    defaultProps = {
      type: "1",
      mode: "VIEW",
      i_package: "NP-00",
      productId: "mock-product-id",
      formMethods: {
        control: {},
        register: jest.fn(),
        watch: jest.fn(),
        formState: {
          errors: {},
        },
      },
    };
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
                        code: "broker.general.read",
                      },
                      {
                        code: "broker.general.write",
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
    jest.useRealTimers();
  });

  it("should render default", async () => {
    // arrange
    const component = <PageProductDetailCommondata {...defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render default with watch value", async () => {
    // arrange
    const _defaultProps = {
      ...defaultProps,
      formMethods: {
        control: {},
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "commonSetting.c_plan") return "mock-c_plan";
          if (name === "commonSetting.title") return "mock-title";
          if (name === "commonSetting.remark_marketing_name")
            return "mock-remark_marketing_name";
          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageProductDetailCommondata {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render type 0", async () => {
    // arrange
    const _defaultProps = {
      ...defaultProps,
      type: "0",
    };
    const component = <PageProductDetailCommondata {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });
});
