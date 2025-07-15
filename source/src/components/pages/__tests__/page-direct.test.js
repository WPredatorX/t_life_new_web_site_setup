import { render } from "@/utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { PageDirect } from "@/components";

describe("Page Direct", () => {
  let mockStore = null;
  let defaultProps = {};
  beforeEach(() => {
    defaultProps = {
      tabIndex: "1",
      promotionCode: "1",
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

  it("should render default", async () => {
    const component = <PageDirect {...defaultProps} />;
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });
});
