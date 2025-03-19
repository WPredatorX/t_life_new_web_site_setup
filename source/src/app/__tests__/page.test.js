import { render } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer, globalInitialState } from "@stores/slices";
import HomePage from "@app/page";

describe("Home Page", () => {
  let mockStore = null;
  let defaultGlobalState = {
    ...globalInitialState,
    language: "th",
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
  });

  describe("Render Component", () => {
    it("Should render without crashing", async () => {
      // arrange
      const component = <HomePage />;

      // act
      await render(component);

      //assert
      expect(component).toBeDefined();
    });
  });
});
