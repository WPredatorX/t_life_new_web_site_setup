import { fireEvent, render, screen } from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";

describe("AppCard", () => {
  let mockStore = null;
  beforeEach(() => {
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

  describe("Render", () => {
    it("should render without crashing", async () => {
      const component = <></>; // มีที่ provider แล้ว

      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
    });

    it("should render without crashing custom state", async () => {
      const component = <></>; // มีที่ provider แล้ว
      let mockRenderContent = jest.fn();
      let mockRenderAction = jest.fn();
      mockStore = configureStore({
        reducer: {
          global: globalSliceReducer,
        },
        preloadedState: {
          global: {
            ...globalInitialState,
            dialog: {
              ...globalInitialState.dialog,
              useDefaultBehavior: false,
              draggable: true,
              renderContent: mockRenderContent,
              renderAction: mockRenderAction,
            },
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

      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
      expect(mockRenderContent).toHaveBeenCalledTimes(1);
      expect(mockRenderAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("Event", () => {
    it("render default then click close", async () => {
      const component = <></>; // มีที่ provider แล้ว
      mockStore = configureStore({
        reducer: {
          global: globalSliceReducer,
        },
        preloadedState: {
          global: {
            ...globalInitialState,
            dialog: {
              ...globalInitialState.dialog,
              open: true,
              title: "mock-title",
              useDefaultBehavior: true,
            },
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

      await render(component, {
        mockStore,
      });

      const button = await screen.findAllByTestId("dialog-button-close");
      fireEvent.click(button[0]);

      const currentState = mockStore.getState().global.dialog;
      expect(component).toBeDefined();
      expect(currentState.open).toBe(false);
    });

    it("render default then click close then wait 300 milliseconds", async () => {
      jest.useFakeTimers();
      const component = <></>; // มีที่ provider แล้ว
      mockStore = configureStore({
        reducer: {
          global: globalSliceReducer,
        },
        preloadedState: {
          global: {
            ...globalInitialState,
            dialog: {
              ...globalInitialState.dialog,
              open: true,
              title: "mock-title",
              useDefaultBehavior: true,
            },
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

      await render(component, {
        mockStore,
      });

      const button = await screen.findAllByTestId("dialog-button-close");
      fireEvent.click(button[0]);
      jest.advanceTimersByTime(300);

      const currentState = mockStore.getState().global.dialog;
      expect(component).toBeDefined();
      expect(currentState.open).toBe(false);
    });
  });
});
