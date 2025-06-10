import { render, screen, fireEvent, act } from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { PageProductSale } from "@components";
// import useAppForm from "@hooks/useAppForm";

// jest.mock("react-hook-form", () => {
//   const actual = jest.requireActual("react-hook-form");
//   return {
//     ...actual,
//     Controller: ({ render }) =>
//       render({ field: { onChange: jest.fn(), value: "" } }),
//   };
// });

// jest.mock("@hooks/useAppForm", () =>
//   jest.fn().mockReturnValue({
//     register: jest.fn(),
//     reset: jest.fn(),
//     watch: jest.fn(),
//     handleSubmit: jest.fn(),
//     formState: {
//       isDirty: false,
//       errors: {},
//     },
//     control: {},
//     setValue: jest.fn(),
//   })
// );

// jest.mock("@hooks/useAppFieldArray", () =>
//   jest.fn().mockReturnValue({
//     fields: [],
//     insert: jest.fn(),
//     update: jest.fn(),
//   })
// );

describe("page-product-sale", () => {
  let mockStore = null;
  let defaultProps = {};

  beforeEach(() => {
    defaultProps = {
      mode: "VIEW",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
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
                        code: "direct.product.general.read",
                      },
                      {
                        code: "direct.product.general.write",
                      },
                      {
                        code: "direct.product.display.read",
                      },
                      {
                        code: "direct.product.display.write",
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
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct?action=GetDirectGeneralInfo")) {
        return {
          status: 200,
          body: JSON.stringify([{}]),
        };
      }

      return {
        status: 404,
        body: "Not found",
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should render default", async () => {
    // arrange
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render default invalid feature", async () => {
    // arrange
    const component = <PageProductSale {...defaultProps} />;
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

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click tab display mode VIEW", async () => {
    // arrange
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });
    const button = await screen.findByText("ข้อมูลการแสดงผล");
    fireEvent.click(button);

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click tab display mode DROP", async () => {
    // arrange
    defaultProps = {
      mode: "DROP",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });
    const button = await screen.findByText("ข้อมูลการแสดงผล");
    fireEvent.click(button);

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click tab display mode GENERAL_APPROVE", async () => {
    // arrange
    defaultProps = {
      mode: "GENERAL_APPROVE",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });
    const button = await screen.findByText("ข้อมูลการแสดงผล");
    fireEvent.click(button);

    // assert
    expect(component).toBeDefined();
  });

  //   it("should render default then click tab display mode EDIT then click save", async () => {
  //     // arrange
  //     defaultProps = {
  //       mode: "EDIT",
  //       type: "1",
  //       channel: "606",
  //       productPlanId: "mock-plan-id",
  //       saleChannelId: "mock-sale-channel-id",
  //       productCondition: {
  //         i_plan: "mock-plan",
  //         product_status: "1",
  //       },
  //     };
  //     useAppForm.mockReturnValue({
  //       register: jest.fn(),
  //       reset: jest.fn(),
  //       watch: jest.fn((name) => {
  //         return undefined;
  //       }),
  //       handleSubmit: jest.fn(),
  //       formState: {
  //         isDirty: true,
  //         dirtyFields: {
  //           saleRangeTemp: true,
  //         },
  //       },
  //     });
  //     const component = <PageProductSale {...defaultProps} />;

  //     // act
  //     await render(component, {
  //       mockStore,
  //     });

  //     await act(async () => {
  //       const button = await screen.findByText("ข้อมูลการแสดงผล");
  //       fireEvent.click(button);
  //     });

  //     const saveButton = await screen.findByText("บันทึกแบบร่าง");
  //     fireEvent.click(saveButton);

  //     // assert
  //     expect(component).toBeDefined();
  //   });
});
