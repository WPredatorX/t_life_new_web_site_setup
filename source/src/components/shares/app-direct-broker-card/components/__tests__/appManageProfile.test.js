import { fireEvent, render, screen, userEvent } from "@/utilities/jest";
import { AppManageProfile } from "..";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
const mockUseAppSelector = require("@/hooks").useAppSelector;
const mockUseAppDialog = require("@/hooks").useAppDialog;
const mockUseAppForm = require("@/hooks").useAppForm;

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
    watch: jest.fn().mockImplementation((field) => {
      if (field === "bannerType") return { value: 0, label: "Image" };
      if (field === "useBannerFromProduct") return false;
      return null;
    }),
    control: {},
    register: jest.fn(),
    reset: jest.fn(),
    setValue: jest.fn(),
    formState: { errors: {}, isDirty: true },
    handleSubmit: jest.fn((onSubmit) => (e) => {
      e.preventDefault();
      onSubmit({});
    }),
  })
);

describe("appManageProfile", () => {
  let mockStore = null;
  let defaultProps = {};
  let mockChannelStatus = null;
  let mockChannelResponse = null;
  let mockVersionStatus = null;
  let mockVersionResponse = null;
  let handleSave = jest.fn();
  let setOpen = jest.fn();

  beforeEach(() => {
    mockChannelStatus = 200;
    mockChannelResponse = [];
    mockVersionStatus = 200;
    mockVersionResponse = [];
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct/profile?action=GetAllBrokerDDL")) {
        return {
          status: mockChannelStatus,
          body: JSON.stringify(mockChannelResponse),
        };
      }
      if (req.url.includes("/api/direct/profile?action=GetAllBrokerProfile")) {
        return {
          status: mockVersionStatus,
          body: JSON.stringify(mockVersionResponse),
        };
      }
    });
    defaultProps = {
      open: true,
      mode: "view",
      setOpen: setOpen,
      handleSave: handleSave,
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

    mockUseAppForm.mockReturnValue({
      watch: jest.fn((field) => {
        if (field === "bannerType") return { value: 0, label: "Image" };
        if (field === "useBannerFromProduct") return false;
        return null;
      }),
      control: {},
      register: jest.fn(),
      reset: jest.fn(),
      setValue: jest.fn(),
      formState: { errors: {}, isDirty: true },
      handleSubmit: jest.fn((onSubmit) => (e) => {
        e.preventDefault();
        onSubmit({});
      }),
    });
  });

  describe("render", () => {
    it("should render with out crash", async () => {
      const component = <AppManageProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      expect(component).toBeDefined();
    });
  });

  describe("action", () => {
    test("Select Channel", async () => {
      defaultProps = {
        open: true,
        mode: "copy",
      };
      mockUseAppForm.mockReturnValue({
        watch: jest.fn().mockImplementation((field) => {
          if (field === "bannerType") return { value: 0, label: "Image" };
          if (field === "useBannerFromProduct") return false;
          return null;
        }),
        control: {},
        register: jest.fn(),
        reset: jest.fn(),
        setValue: jest.fn(),
        formState: { errors: {}, isDirty: true },
        handleSubmit: jest.fn((onSubmit) => (e) => {
          e.preventDefault();
          onSubmit({});
        }),
      });
      mockChannelResponse = [
        {
          id: "1eafd06b-d47f-4fa8-aa47-581eca2cc45e",
          label: "Electronic Sales",
          broker_id: "1eafd06b-d47f-4fa8-aa47-581eca2cc45e",
          broker_profile_id: "eef1812a-8e5c-4a68-b522-3610ef0fab67",
          broker_name: "Electronic Sales",
          title: "V2",
          profile_status: "4",
          name_status: "ยกเลิกใช้งาน",
        },
        {
          id: "b901db9b-ec26-4b2a-9267-0108dfcc4e38",
          label: "ศรีกรุงประกันชีวิตโบรคเกอร์",
          broker_id: "b901db9b-ec26-4b2a-9267-0108dfcc4e38",
          broker_profile_id: "ece47b78-3d91-4033-b16d-aecadbc9a3e7",
          broker_name: "ศรีกรุงประกันชีวิตโบรคเกอร์",
          title: "V1",
          profile_status: "3",
          name_status: "เปิดใช้งาน",
        },
      ];
      const component = <AppManageProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      const input = screen.getByRole("combobox", { name: /ช่องทาง/i });
      await userEvent.click(input);
      await userEvent.type(input, "ศรีกรุงประกันชีวิตโบรคเกอร์");

      const option = screen.getByText("ศรีกรุงประกันชีวิตโบรคเกอร์");
      fireEvent.click(option);

      expect(component).toBeDefined();
    });

    test("Select profile", async () => {
      defaultProps = {
        open: true,
        mode: "copy",
        setOpen: setOpen,
        handleSave: handleSave,
      };
      mockUseAppForm.mockReturnValue({
        watch: jest.fn((field) => {
          if (field === "bannerType") return { value: 0, label: "Image" };
          if (field === "useBannerFromProduct") return false;
          if (field === "channel")
            return "1eafd06b-d47f-4fa8-aa47-581eca2cc45e";
          return null;
        }),
        control: {},
        register: jest.fn(),
        reset: jest.fn(),
        setValue: jest.fn(),
        formState: { errors: {}, isDirty: true },
        handleSubmit: jest.fn((onSubmit) => (e) => {
          e.preventDefault();
          onSubmit({});
        }),
      });
      mockVersionResponse = [
        {
          broker_id: "1eafd06b-d47f-4fa8-aa47-581eca2cc45e",
          broker_profile_id: "eef1812a-8e5c-4a68-b522-3610ef0fab67",
          broker_name: "Electronic Sales",
          title: "V2",
          profile_status: "4",
          name_status: "ยกเลิกใช้งาน",
        },
        {
          broker_id: "1eafd06b-d47f-4fa8-aa47-581eca2cc45e",
          broker_profile_id: "095a1681-881e-487f-b521-4c9838cb1a3e",
          broker_name: "Electronic Sales",
          title: "V3",
          profile_status: "4",
          name_status: "ยกเลิกใช้งาน",
        },
        {
          broker_id: "1eafd06b-d47f-4fa8-aa47-581eca2cc45e",
          broker_profile_id: "5b5191dc-e930-44ab-9acb-96197cab4079",
          broker_name: "Electronic Sales",
          title: "V5",
          profile_status: "3",
          name_status: "เปิดใช้งาน",
        },
        {
          broker_id: "b901db9b-ec26-4b2a-9267-0108dfcc4e38",
          broker_profile_id: "ece47b78-3d91-4033-b16d-aecadbc9a3e7",
          broker_name: "ศรีกรุงประกันชีวิตโบรคเกอร์",
          title: "V1",
          profile_status: "3",
          name_status: "เปิดใช้งาน",
        },
        {
          broker_id: "1eafd06b-d47f-4fa8-aa47-581eca2cc45e",
          broker_profile_id: "ae08a625-f0ae-47f9-a308-c93602c9c9fc",
          broker_name: "Electronic Sales",
          title: "V1",
          profile_status: "4",
          name_status: "ยกเลิกใช้งาน",
        },
        {
          broker_id: "1eafd06b-d47f-4fa8-aa47-581eca2cc45e",
          broker_profile_id: "4eb87479-0888-4088-8c98-cc20f60ec6a9",
          broker_name: "Electronic Sales",
          title: "V4",
          profile_status: "4",
          name_status: "ยกเลิกใช้งาน",
        },
      ];
      const component = <AppManageProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });

      const input = screen.getByRole("combobox", { name: /เวอร์ชั่น/i });
      await userEvent.click(input);

      const option = screen.getByText("V2");
      fireEvent.click(option);

      expect(component).toBeDefined();
    });

    test("submit", async () => {
      defaultProps = {
        open: true,
        mode: "copy",
        setOpen: setOpen,
        handleSave: handleSave,
      };
      mockUseAppForm.mockReturnValue({
        watch: jest.fn((field) => {
          if (field === "bannerType") return { value: 0, label: "Image" };
          if (field === "useBannerFromProduct") return false;
          if (field === "channel")
            return "1eafd06b-d47f-4fa8-aa47-581eca2cc45e";
          if (field === "profile")
            return "ae08a625-f0ae-47f9-a308-c93602c9c9fc";
          return null;
        }),
        control: {},
        register: jest.fn(),
        reset: jest.fn(),
        setValue: jest.fn(),
        formState: { errors: {}, isDirty: true },
        handleSubmit: jest.fn((onSubmit) => (e) => {
          e.preventDefault();
          onSubmit({});
        }),
      });
      const component = <AppManageProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      const form = await screen.findByTestId("form-submit");
      fireEvent.submit(form);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);
      expect(component).toBeDefined();
    });

    test("close", async () => {
      defaultProps = {
        open: true,
        mode: "copy",
        setOpen: setOpen,
        handleSave: handleSave,
      };

      const component = <AppManageProfile {...defaultProps} />;
      await render(component, {
        mockStore,
      });
      const close = await screen.findByText("ยกเลิก");
      fireEvent.click(close);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);
      expect(component).toBeDefined();
    });
  });
});
