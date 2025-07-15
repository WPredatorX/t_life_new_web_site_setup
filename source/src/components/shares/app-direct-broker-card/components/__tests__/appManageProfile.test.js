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
  let setOpen = jest.fn();
  let handleReject = jest.fn();
  beforeEach(() => {
    defaultProps = {
      open: true,
      mode: "view",
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

  /*   it("create mode", () => {
    // render(<AppManageProfile mode={"create"} open={true} />);
  });
  it("close not view mode", async () => {
    render(<AppManageProfile mode={"create"} open={true} />);
    const closeButton = screen.getByText("ยกเลิก");
    fireEvent.click(closeButton); 
  });
   it("copy mode", () => {
    render(<AppManageProfile mode={"copy"} open={true} />);
  });  */
});
