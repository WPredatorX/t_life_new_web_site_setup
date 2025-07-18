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
import PageDocumentSetting from "../components/pageDocumentSetting";

describe("PageDocumentSetting", () => {
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

  it("should render default", async () => {
    // arrange
    const component = <PageDocumentSetting />;

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
