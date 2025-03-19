import { render, screen, userEvent } from "@utilities/jest";
import { AppNavigationBar } from "@components";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer, globalInitialState } from "@stores/slices";
import NavigationBarAuthentication from "../app-navigationbar/navigationbarAuthentication";
import NavigationBarDrawer from "../app-navigationbar/navigationbarDrawer";
import NavigationBarLogo from "../app-navigationbar/navigationbarLogo";
import NavigationBarMenu from "../app-navigationbar/navigationbarMenu";
import NavigationBarMenuItem from "../app-navigationbar/navigationbarMenuItem";

describe("AppNavigationBar Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe("Render Component", () => {
    it("should render without crashing", async () => {
      const component = <></>; // Navigationbar is in provider

      // act
      await render(component);

      // assert
      expect(component).toBeDefined();
    });
  });

  describe("User Event", () => {
    it("should click hamburget then trigger open drawer", async () => {
      const component = <></>; // Navigationbar is in provider

      // act
      await render(component);
      const button = await screen.findByTestId("button-toggle-drawer");
      await userEvent.click(button);

      // assert
      const drawer = await screen.findByTestId("drawer");
      expect(component).toBeDefined();
      expect(drawer).toBeDefined();
    });
  });

  describe("NavigationBarAuthentication Subcomponent", () => {
    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <NavigationBarAuthentication />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });
  });

  describe("NavigationBarDrawer Subcomponent", () => {
    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <NavigationBarDrawer />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });
  });

  describe("NavigationBarLogo Subcomponent", () => {
    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <NavigationBarLogo />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });
  });

  describe("NavigationBarMenu Subcomponent", () => {
    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <NavigationBarMenu />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });
  });

  describe("NavigationBarMenuItem Subcomponent", () => {
    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <NavigationBarMenuItem />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });

    describe("User Event", () => {
      it("should handle click menu", async () => {
        // arrange
        let defaultGlobalState = {
          ...globalInitialState,
        };
        let mockStore = configureStore({
          reducer: {
            global: globalSliceReducer,
          },
          preloadedState: {
            global: defaultGlobalState,
          },
          middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }).concat([]),
        });
        const props = {
          item: {
            id: 0,
            href: "/",
            label: { th: "หน้าแรก", en: "Home" },
          },
        };
        const component = <></>; // Navigationbar is in provider

        // act
        await render(component, {
          mockStore,
        });
        const button = await screen.findAllByTestId("button-menu-0"); // found mobile menu and desktop menu
        await userEvent.click(button[0]);

        // assert
        const currentState = mockStore.getState().global.activeMenu;
        expect(component).toBeDefined();
        expect(currentState).toStrictEqual(props.item);
      });
    });
  });
});
