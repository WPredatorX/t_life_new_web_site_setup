import {
  act,
  screen,
  waitFor,
  fireEvent,
  renderAfterHook,
  userEvent,
  createMatchMedia,
} from "@utilities/jest";
import { render } from "@testing-library/react";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("@themes", () => ({
  theme: jest.fn(() => "mocked-theme"),
}));

jest.mock("@providers", () => ({
  StoreProvider: ({ children }) => (
    <div data-testid="MockedStoreProvider">{children}</div>
  ),
}));

jest.mock("../page-layout/components", () => ({
  PageLayoutProvider: ({ children }) => (
    <div data-testid="MockedPageLayoutProvider">{children}</div>
  ),
  PageLayoutMainContent: ({ children }) => (
    <div data-testid="MockedPageLayoutMainContent">{children}</div>
  ),
}));

import PageLayout from "../page-layout";

describe("PageLayout", () => {
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
    it("wraps children with all providers", async () => {
      // arrange
      const component = (
        <PageLayout>
          <div>Test Content</div>
        </PageLayout>
      );

      // act
      await render(component);

      // assert
      expect(screen.getByTestId("MockedStoreProvider")).toBeInTheDocument();
      expect(
        screen.getByTestId("MockedPageLayoutProvider")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("MockedPageLayoutMainContent")
      ).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });
});
