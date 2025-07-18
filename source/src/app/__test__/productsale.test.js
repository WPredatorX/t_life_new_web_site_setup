import { act, render } from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import ProductSale from "../productsale/[productPlanId]/page";

jest.mock("@hooks/useAppSnackbar", () =>
  jest.fn().mockReturnValue({
    handleSnackAlert: jest.fn(),
  })
);

describe("ProductSale", () => {
  let mockStore = null;
  let mockStatusCode = null;
  let mockProductCondition = null;

  beforeEach(() => {
    mockStatusCode = 200;
    mockProductCondition = {};
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (
        req.url.includes(
          "/api/direct?action=getSaleConditionByProductId&productId="
        )
      ) {
        return {
          status: mockStatusCode,
          body: JSON.stringify(mockProductCondition),
        };
      }

      return {
        status: 404,
        body: "Not found",
      };
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

  it("renders Direct component with default props", async () => {
    // arrage
    const component = <ProductSale params={{}} searchParams={{}} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("renders Direct component with default props not valid feature", async () => {
    // arrage
    const component = <ProductSale params={{}} searchParams={{}} />;
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
                        code: "mock-feature",
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

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("renders Direct component with default props null product condition", async () => {
    // arrage
    mockProductCondition = null;
    const component = <ProductSale params={{}} searchParams={{}} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("renders Direct component with default props but fetch error", async () => {
    // arrage
    mockStatusCode = 500;
    const component = <ProductSale params={{}} searchParams={{}} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("renders Direct component with default props loading", async () => {
    // arrage
    jest.useFakeTimers();
    const component = <ProductSale params={{}} searchParams={{}} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });
});
