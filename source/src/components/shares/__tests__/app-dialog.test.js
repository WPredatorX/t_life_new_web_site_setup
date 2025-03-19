import { act, fireEvent, render, screen } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer, globalInitialState } from "@stores/slices";

describe("AppDialog Component", () => {
  let mockStore = null;
  let defaultDialog = {
    ...globalInitialState.dialog,
    open: true,
    title: "mock-title",
    renderContent: () => {
      return <>mock-content</>;
    },
  };
  let defaultGlobalState = {
    ...globalInitialState,
    dialog: defaultDialog,
  };
  beforeEach(() => {
    mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      preloadedState: {
        global: defaultGlobalState,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe("Render Component", () => {
    it("should render with default state", async () => {
      // arrange
      jest.useFakeTimers();
      const component = <></>; // AppDialog is in the wrapper already

      // act
      await render(component, {
        mockStore,
      });

      // assert
      let currentState = mockStore.getState().global.dialog;
      let expectedState = {
        ...defaultDialog,
      };
      expect(currentState).toStrictEqual(expectedState);
    });

    it("should render with custom state", async () => {
      // arrange
      jest.useFakeTimers();
      const newDialogState = {
        ...defaultDialog,
        draggable: true,
        useDefaultBehavior: false,
        renderAction: () => {
          return <>mock-render-action</>;
        },
      };
      mockStore = configureStore({
        reducer: {
          global: globalSliceReducer,
        },
        preloadedState: {
          global: {
            ...defaultGlobalState,
            dialog: newDialogState,
          },
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({ serializableCheck: false }).concat([]),
      });
      const component = <></>; // AppDialog is in the wrapper already

      // act
      await render(component, {
        mockStore,
      });

      // assert
      let currentState = mockStore.getState().global.dialog;
      expect(currentState).toStrictEqual(newDialogState);
    });
  });

  describe("User Event", () => {
    it("click then hide dialog", async () => {
      // arrange
      const component = <></>; // AppDialog is in the wrapper already

      // act
      await render(component, {
        mockStore,
      });
      const closeButton = await screen.findByTestId("dialog-button-close");
      act(() => {
        fireEvent.click(closeButton);
      });

      // assert
      let currentState = mockStore.getState().global.dialog;
      let expectedState = {
        ...defaultDialog,
        open: false,
      };
      expect(currentState).toStrictEqual(expectedState);
    });

    it("click then hide dialog then after 300 milliseconds reset redux state", async () => {
      // arrange
      jest.useFakeTimers();
      const component = <></>; // AppDialog is in the wrapper already

      // act
      await render(component, {
        mockStore,
      });
      const closeButton = await screen.findByTestId("dialog-button-close");
      act(() => {
        fireEvent.click(closeButton);
        jest.advanceTimersByTime(300);
      });

      // assert
      let currentState = mockStore.getState().global.dialog;
      let expectedState = {
        ...globalInitialState.dialog,
      };
      expect(currentState).toStrictEqual(expectedState);
    });
  });
});
