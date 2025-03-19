import { act, render } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer, globalInitialState } from "@stores/slices";
import { AppSnackBar } from "@components";
import { APPLICATION_DEFAULT } from "@constants";

describe("AppSnackBar Component", () => {
  let mockStore = null;
  let defaultSnackBar = {
    ...globalInitialState.snackBar,
    open: true,
    message: "mock-message",
  };
  let defaultGlobalState = {
    ...globalInitialState,
    snackBar: defaultSnackBar,
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
    it("should show on render", async () => {
      // arrange
      jest.useFakeTimers();
      const component = <AppSnackBar />;

      // act
      await render(component, {
        mockStore,
      });

      // assert
      let currentState = mockStore.getState().global.snackBar;
      let expectedState = {
        ...defaultSnackBar,
        open: true,
      };
      expect(currentState).toStrictEqual(expectedState);
    });

    it("should hide after X seconds", async () => {
      // arrange
      jest.useFakeTimers();
      const component = <AppSnackBar />;

      // act
      await render(component, {
        mockStore,
      });
      act(() => {
        jest.advanceTimersByTime(APPLICATION_DEFAULT.snackBar.autoHideDuration);
      });

      // assert
      let currentState = mockStore.getState().global.snackBar;
      let expectedState = {
        ...defaultSnackBar,
        open: false,
        message: "mock-message",
      };
      expect(currentState).toStrictEqual(expectedState);
    });

    it("should reset after X seconds + 300 millisec", async () => {
      // arrange
      jest.useFakeTimers();
      const component = <AppSnackBar />;

      // act
      await render(component, {
        mockStore,
      });
      act(() => {
        jest.advanceTimersByTime(
          parseInt(APPLICATION_DEFAULT.snackBar.autoHideDuration) + 300
        );
      });

      // assert
      let currentState = mockStore.getState().global.snackBar;
      let expectedState = {
        ...globalInitialState.snackBar,
      };
      expect(currentState).toStrictEqual(expectedState);
    });
  });
});
