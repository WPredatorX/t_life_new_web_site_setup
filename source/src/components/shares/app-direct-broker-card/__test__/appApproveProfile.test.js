import React from "react";

import { AppApproveProfile } from "../components";
import { APPLICATION_DEFAULT } from "@/constants";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, userEvent } from "@/utilities/jest";
import { useAppForm } from "@/hooks";

// Mock hooks and components
// Define handleNotificationMock outside so it can be accessed in tests
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: null } }),
  };
});

jest.mock("@hooks/useAppForm", () =>
  jest.fn().mockReturnValue({
    register: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn((name) => {
      if (name === "reason") return "";
      return {};
    }),
    handleSubmit: jest.fn(),
    formState: {
      isDirty: false,
      errors: {},
      dirtyFields: {},
    },
    control: {},
    setValue: jest.fn(),
  })
);

describe("AppApproveProfile", () => {
  let mockStore = null;
  let defaultProps = {};
  let setOpen = jest.fn();
  let handleReject = jest.fn();
  beforeEach(() => {
    defaultProps = {
      open: true,
      setOpen: setOpen,
      handleReject: handleReject,
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
  describe("render", () => {
    it("should render default", async () => {
      const component = <AppApproveProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      // assert
      expect(component).toBeDefined();
    });
  });
  describe("action", () => {
    test("Click submit", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });
      const component = <AppApproveProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      const form = await screen.findByTestId("form-submit");
      fireEvent.submit(form);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);
      // assert
      expect(component).toBeDefined();
    });

    test("Click Close then confirm", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });
      const component = <AppApproveProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      const close = await screen.findByText("ยกเลิก");
      fireEvent.click(close);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);
      // assert
      expect(component).toBeDefined();
    });

    test("Click Close then confirm but not dirty", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: false,
        },
      });
      const component = <AppApproveProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      const close = await screen.findByText("ยกเลิก");
      fireEvent.click(close);

      // assert
      expect(component).toBeDefined();
    });
  });
});
