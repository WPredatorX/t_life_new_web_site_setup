import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { AppManageBanner } from "../components";
import { Yup } from "@utilities";
import { yupResolver } from "@hookform/resolvers/yup";
const mockUseAppSelector = require("@/hooks").useAppSelector;
const mockUseAppDialog = require("@/hooks").useAppDialog;
const mockUseAppForm = require("@/hooks").useAppForm;

// Mock dependencies
jest.mock("@/hooks", () => ({
  useAppForm: jest.fn(),
  useAppFieldArray: jest.fn(),
  useAppDialog: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("@/components", () => ({
  AppAutocomplete: jest.fn(({ children, ...props }) => (
    <div data-testid={`autocomplete-${props.name}`} {...props}>
      {children}
    </div>
  )),
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

// Validation schema from the component
const validationSchema = Yup.object().shape({
  product: Yup.object().nullable().required(),
  useBannerFromProduct: Yup.bool().nullable(),
  bannerType: Yup.object().nullable().required(),
  bannerImage: Yup.mixed()
    .nullable()
    .when("bannerType.value", {
      is: 1,
      then: (schema) => schema.required(),
    }),
  bannerImageString: Yup.string().nullable(),
  bannerImageName: Yup.mixed().nullable().required(),
  bannerImageUrl: Yup.string().nullable(),
  bannerImagePreviewUrl: Yup.string().nullable().required(),
  bannerVideoLink: Yup.string()
    .nullable()
    .when("bannerType.value", {
      is: 2,
      then: (schema) => schema.required(),
    }),
  bannerAddImage: Yup.mixed().nullable(),
});

describe("AppManageBanner Validation Schema Tests", () => {
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

  describe("Product validation", () => {
    it("should require product field", async () => {
      const testData = {
        product: null,
        bannerType: { value: 0, label: "Image" },
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).rejects.toThrow();
    });

    it("should pass with valid product", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });
  });

  describe("Banner type validation", () => {
    it("should require bannerType field", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).rejects.toThrow();
    });

    it("should pass with valid bannerType", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });
  });

  describe("Banner image validation when bannerType.value is 1", () => {
    it("should require bannerImage when bannerType.value is 1", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 1, label: "Upload" },
        bannerImage: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).rejects.toThrow();
    });

    it("should pass with bannerImage when bannerType.value is 1", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 1, label: "Upload" },
        bannerImage: new File(["test"], "test.jpg"),
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });

    it("should not require bannerImage when bannerType.value is not 1", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImage: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });
  });

  describe("Banner video link validation when bannerType.value is 2", () => {
    it("should require bannerVideoLink when bannerType.value is 2", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 2, label: "Video" },
        bannerVideoLink: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).rejects.toThrow();
    });

    it("should pass with bannerVideoLink when bannerType.value is 2", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 2, label: "Video" },
        bannerVideoLink: "https://youtube.com/watch?v=test",
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });

    it("should not require bannerVideoLink when bannerType.value is not 2", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerVideoLink: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });
  });

  describe("Banner image name validation", () => {
    it("should require bannerImageName field", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImageName: null,
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).rejects.toThrow();
    });

    it("should pass with valid bannerImageName", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });
  });

  describe("Banner image preview URL validation", () => {
    it("should require bannerImagePreviewUrl field", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: null,
      };

      await expect(validationSchema.validate(testData)).rejects.toThrow();
    });

    it("should pass with valid bannerImagePreviewUrl", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });
  });

  describe("Optional fields validation", () => {
    it("should allow nullable useBannerFromProduct", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        useBannerFromProduct: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });

    it("should allow nullable bannerImageString", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImageString: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });

    it("should allow nullable bannerImageUrl", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerImageUrl: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });

    it("should allow nullable bannerAddImage", async () => {
      const testData = {
        product: { id: 1, label: "Test Product" },
        bannerType: { value: 0, label: "Image" },
        bannerAddImage: null,
        bannerImageName: "test.jpg",
        bannerImagePreviewUrl: "test-url",
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });
  });

  describe("Component rendering and interaction tests", () => {
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

    it("should render component with mocked store", () => {
      const mockProps = {
        open: true,
        setOpen: jest.fn(),
        addBanner: jest.fn(),
        currentSelected: [],
      };

      render(
        <Provider store={mockStore}>
          <AppManageBanner {...mockProps} />
        </Provider>
      );

      expect(screen.getByText("เพิ่มแบนเนอร์")).toBeInTheDocument();
    });

    it("should handle close dialog when form is dirty", () => {
      const mockSetOpen = jest.fn();
      const mockProps = {
        open: true,
        setOpen: mockSetOpen,
        addBanner: jest.fn(),
        currentSelected: [],
      };

      render(
        <Provider store={mockStore}>
          <AppManageBanner {...mockProps} />
        </Provider>
      );

      const closeButton = screen.getByText("ยกเลิก");
      fireEvent.click(closeButton);

      expect(mockUseAppDialog().handleNotification).toHaveBeenCalledWith(
        "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
        expect.any(Function),
        null,
        "question"
      );
    });

    it("should handle close dialog when form is not dirty", () => {
      mockUseAppForm.mockReturnValue({
        watch: jest.fn(),
        control: {},
        register: jest.fn(),
        reset: jest.fn(),
        setValue: jest.fn(),
        formState: { errors: {}, isDirty: false },
        handleSubmit: jest.fn(),
      });

      const mockSetOpen = jest.fn();
      const mockProps = {
        open: true,
        setOpen: mockSetOpen,
        addBanner: jest.fn(),
        currentSelected: [],
      };

      render(
        <Provider store={mockStore}>
          <AppManageBanner {...mockProps} />
        </Provider>
      );

      const closeButton = screen.getByText("ยกเลิก");
      fireEvent.click(closeButton);

      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });

    it("should handle form submission", async () => {
      const mockAddBanner = jest.fn();
      const mockSetOpen = jest.fn();
      const mockProps = {
        open: true,
        setOpen: mockSetOpen,
        addBanner: mockAddBanner,
        currentSelected: [],
      };

      render(
        <Provider store={mockStore}>
          <AppManageBanner {...mockProps} />
        </Provider>
      );

      const submitButton = screen.getByText("ตกลง");
      fireEvent.click(submitButton);

      expect(mockUseAppDialog().handleNotification).toHaveBeenCalledWith(
        "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
        expect.any(Function),
        null,
        "question"
      );
    });

    it("should handle product selection", async () => {
      const mockSetValue = jest.fn();
      mockUseAppForm.mockReturnValue({
        watch: jest.fn(),
        control: {},
        register: jest.fn(),
        reset: jest.fn(),
        setValue: mockSetValue,
        formState: { errors: {}, isDirty: true },
        handleSubmit: jest.fn(),
      });

      const mockProps = {
        open: true,
        setOpen: jest.fn(),
        addBanner: jest.fn(),
        currentSelected: [],
      };

      render(
        <Provider store={mockStore}>
          <AppManageBanner {...mockProps} />
        </Provider>
      );

      const productAutocomplete = screen.getByTestId("autocomplete-product");
      fireEvent.change(productAutocomplete, {
        target: { value: "Test Product" },
      });

      expect(mockSetValue).toHaveBeenCalledWith("bannerImage", null);
      expect(mockSetValue).toHaveBeenCalledWith("bannerImageName", null);
      expect(mockSetValue).toHaveBeenCalledWith("bannerImageString", null);
      expect(mockSetValue).toHaveBeenCalledWith("bannerImageUrl", null);
      expect(mockSetValue).toHaveBeenCalledWith("bannerImagePreviewUrl", null);
      expect(mockSetValue).toHaveBeenCalledWith("useBannerFromProduct", false);
    });

    it("should handle banner type selection", async () => {
      const mockProps = {
        open: true,
        setOpen: jest.fn(),
        addBanner: jest.fn(),
        currentSelected: [],
      };

      render(
        <Provider store={mockStore}>
          <AppManageBanner {...mockProps} />
        </Provider>
      );

      const bannerTypeAutocomplete = screen.getByTestId(
        "autocomplete-bannerType"
      );
      fireEvent.change(bannerTypeAutocomplete, { target: { value: "Image" } });

      expect(screen.getByText("ประเภทแบนเนอร์")).toBeInTheDocument();
    });
  });

  describe("Complex validation scenarios", () => {
    it("should validate complete form data for image banner", async () => {
      const testData = {
        product: { id: 1, label: "Test Product", product_sale_group_id: 1 },
        useBannerFromProduct: false,
        bannerType: { value: 1, label: "Upload" },
        bannerImage: new File(["test"], "test.jpg"),
        bannerImageString: "base64string",
        bannerImageName: "test.jpg",
        bannerImageUrl: "https://example.com/image.jpg",
        bannerImagePreviewUrl: "https://example.com/preview.jpg",
        bannerVideoLink: null,
        bannerAddImage: null,
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });

    it("should validate complete form data for video banner", async () => {
      const testData = {
        product: { id: 1, label: "Test Product", product_sale_group_id: 1 },
        useBannerFromProduct: false,
        bannerType: { value: 2, label: "Video" },
        bannerImage: null,
        bannerImageString: null,
        bannerImageName: "video-thumbnail.jpg",
        bannerImageUrl: null,
        bannerImagePreviewUrl: "https://example.com/video-preview.jpg",
        bannerVideoLink: "https://youtube.com/watch?v=test123",
        bannerAddImage: null,
      };

      await expect(validationSchema.validate(testData)).resolves.toBeDefined();
    });
  });
});
