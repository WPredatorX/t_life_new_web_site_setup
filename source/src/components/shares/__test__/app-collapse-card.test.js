import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  userEvent,
} from "@utilities/jest";
import AppCollapsecard from "../app-collapse-card";
import { APPLICATION_DEFAULT } from "@constants";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";

describe("AppCollapseCard", () => {
  let mockStore = null;
  const mockContent = {
    name: "ข้อมูลแบบประกัน",
    productDetail: [
      {
        id: "1",
        status: "ACTIVE",
        statusText: "ใช้งานอยู่",
        channel: "Online",
        InsuredSumFrom: 100000,
        InsuredSumTo: 200000,
        createBy: "Admin",
        createDate: "2024-01-01T00:00:00Z",
        updateBy: "Editor",
        updateDate: "2024-02-01T00:00:00Z",
      },
    ],
  };
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

  describe("Render", () => {
    it("Should render default", async () => {
      // arrange
      const component = <AppCollapsecard content={mockContent} />;

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
    it("Should render set active true", async () => {
      // arrange
      const component = (
        <AppCollapsecard content={mockContent} setactive={true} />
      );

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
    it("Should render with empty content", async () => {
      // arrange
      const component = <AppCollapsecard content={{}} setactive={true} />;

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

  describe("Action", () => {
    test("Click view button", async () => {
      // arrange
      const component = <AppCollapsecard content={mockContent} />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const accordionToggle = screen.getByRole("button", {
        name: "ข้อมูลแบบประกัน",
      });
      await userEvent.click(accordionToggle);
      await waitFor(() => {
        expect(screen.getByText("ชื่อแบบประกัน")).toBeInTheDocument();
      });

      const actionButton = screen.getByTestId("MoreVertIcon");
      expect(actionButton).toBeInTheDocument();

      await userEvent.click(actionButton);

      const viewButton = screen.getByTestId("view-button");
      await userEvent.click(viewButton);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });
    test("Pagination", async () => {
      const component = <AppCollapsecard content={mockContent} />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const accordionToggle = screen.getByRole("button", {
        name: "ข้อมูลแบบประกัน",
      });
      await userEvent.click(accordionToggle);
      await waitFor(() => {
        expect(screen.getByText("ชื่อแบบประกัน")).toBeInTheDocument();
      });
      //screen.debug(undefined, Infinity);
      const nextButton = screen.getByTestId("KeyboardArrowRightIcon");
      await userEvent.click(nextButton);
    });
  });
});
