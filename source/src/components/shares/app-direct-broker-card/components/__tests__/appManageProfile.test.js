import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AppManageProfile } from "..";
import { configureStore } from "@reduxjs/toolkit";
const mockUseAppSelector = require("@/hooks").useAppSelector;
const mockUseAppDialog = require("@/hooks").useAppDialog;
const mockUseAppForm = require("@/hooks").useAppForm;

jest.mock("@/hooks", () => ({
  useAppSelector: jest.fn(() => ({
    activator: "me",
  })),
  useAppForm: jest.fn(),
  useAppSnackbar: jest.fn(() => ({
    handleSnackAlert: jest.fn(),
  })),
  useAppDialog: jest.fn(() => ({
    handleNotification: jest.fn(),
    handleConfirm: jest.fn(),
    handleClose: jest.fn(),
  })),
  useAppRouter: jest.fn(),
  useAppFeatureCheck: jest.fn(() => ({ validFeature: true })),
  useAppForm: jest.fn(() => ({
    watch: jest.fn(),
    control: jest.fn(),
    register: jest.fn(),
    reset: jest.fn(),
    setValue: jest.fn(),
    formState: { errors: {}, isDirty: false },
    handleSubmit: jest.fn(),
  })),
}));

jest.mock("@/constants", () => ({
  APPLICATION_BANNER_TYPE: [
    { value: 0, label: "Image" },
    { value: 1, label: "Upload" },
    { value: 2, label: "Video" },
  ],
  APPLICATION_CONFIGURATION: {
    defaultFileAccept: [".png", ".jpg", ".jpeg"],
    defaultFileExtension: ["image/png", "image/jpg", "image/jpeg"],
    defaultFileSize: 5000000,
  },
  APPLICATION_DEFAULT: {
    language: "th",
    snackBar: {
      open: false,
      autoHideDuration: 5000,
      onClose: null,
      message: "Message",
      action: null,
      anchorOrigin: {
        horizontal: "left",
        vertical: "bottom",
      },
    },
    dialog: {
      title: "",
      open: false,
      onClose: null,
      renderContent: null,
      renderAction: null,
      useDefaultBehavior: true,
      draggable: false,
    },
  },
}));

describe("appManageProfile", () => {
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore({
      reducer: {
        global: (
          state = {
            brokerId: "test-broker",
            activator: "test-user",
            sasToken: { sas_images: "test-sas" },
          }
        ) => state,
      },
    });

    mockUseAppSelector.mockReturnValue({
      brokerId: "test-broker",
      activator: "test-user",
      sasToken: { sas_images: "test-sas" },
    });

    mockUseAppDialog.mockReturnValue({
      handleNotification: jest.fn(),
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
  it("should render with out crash", async () => {
    await render(<AppManageProfile mode={"view"} open={true} />);
  });
  it("create mode", () => {
    render(<AppManageProfile mode={"create"} open={true} />);
  });
  it("close not view mode", async () => {
    render(<AppManageProfile mode={"create"} open={true} />);
    const closeButton = screen.getByText("ยกเลิก");
    fireEvent.click(closeButton);
  });
  it("copy mode", () => {
    render(<AppManageProfile mode={"copy"} open={true} />);
  });
});
