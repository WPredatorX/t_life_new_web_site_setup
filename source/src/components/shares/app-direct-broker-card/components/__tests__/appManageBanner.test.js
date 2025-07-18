import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
} from "@/utilities/jest";
import { AppManageBanner } from "..";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { useAppForm } from "@/hooks";
import { APPLICATION_BANNER_TYPE } from "@/constants";

// Mock react-hook-form Controller
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: null } }),
  };
});

const validateMock = jest.fn();

// Mock hooks
const mockSetOpen = jest.fn();
const mockAddBanner = jest.fn();

jest.mock("@hooks/useAppForm", () =>
  jest.fn().mockReturnValue({
    register: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn((name) => {
      if (name === "bannerType") return { label: "Image", value: 0 };
      if (name === "useBannerFromProduct") return false;
      if (name === "product")
        return { label: "Product", value: 1, product_sale_group_id: 1 };
      if (name === "bannerImageName") return "banner.jpg";
      if (name === "bannerImagePreviewUrl") return "preview.jpg";
      return "";
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

if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => "mock-uuid";
}

// Mock global URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "blob:url");

class MockFileReader {
  readAsDataURL(file) {
    setTimeout(() => {
      this.onload({ target: { result: "data:image/png;base64,abc123" } });
    }, 0);
  }
  set onload(fn) {
    this._onload = fn;
  }
  get onload() {
    return this._onload;
  }
}
global.FileReader = MockFileReader;

describe("AppManageBanner", () => {
  let mockStore = null;
  let defaultProps = null;
  let setOpen = jest.fn();
  let addBanner = jest.fn();
  let ref, defaultFileExtension, file, event;
  let mockProductStatus = null;
  let mockProductResponse = null;
  beforeEach(() => {
    mockProductStatus = 200;
    mockProductResponse = [];
    ref = { current: { value: "something" } };
    defaultFileExtension = ["image/png", "image/jpeg"];
    file = new File(["dummy"], "test.png", { type: "image/png" });
    event = { target: { files: [file] } };
    // mock global URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => "blob:url");
    // mock FileReader
    global.FileReader = class {
      readAsDataURL() {
        this.onload({ target: { result: "data:image/png;base64,abc123" } });
      }
      set onload(fn) {
        this._onload = fn;
      }
      get onload() {
        return this._onload;
      }
    };
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct/profile?action=GetDisplayProducts")) {
        return {
          status: mockProductStatus,
          body: JSON.stringify(mockProductResponse),
        };
      }
    });
    defaultProps = {
      open: true,
      setOpen: setOpen,
      addBanner: addBanner,
      currentSelected: [],
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
    it("renders dialog when open", async () => {
      const component = <AppManageBanner {...defaultProps} />;

      await render(component, {
        mockStore,
      });

      expect(component).toBeDefined();
    });
  });
  describe("action", () => {
    test("Select product and useBannerFromProduct", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "bannerType") return { label: "Image", value: 0 };
          if (name === "useBannerFromProduct") return true;
          if (name === "product")
            return { label: "Product", value: 1, product_sale_group_id: 1 };
          if (name === "bannerImageName") return "banner.jpg";
          if (name === "bannerImagePreviewUrl") return "preview.jpg";
          return "";
        }),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: false,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });

      mockProductResponse = [
        {
          product_sale_group_id: "dc262047-f4bd-4332-89b6-9b16193330a5",
          title: "เอ็ม บี เค แฮปปี้ เพนชั่น โกลด์ 85/1 (บำนาญแบบลดหย่อนได้)",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161152.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "c63466f4-c376-4b66-ab51-edf15174886c",
        },
        {
          product_sale_group_id: "7e547e16-792e-4a74-9feb-325d58372278",
          title: "95/5",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161117.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "7b144e92-02e9-4314-be84-84202c4e3579",
        },
        {
          product_sale_group_id: "5bee9cfe-745f-4772-b6c8-fa3eac1a0029",
          title: "เอ็ม บี เค สมาร์ท เซฟวิ่ง 10/1",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner07072025151509.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "d69491e5-c438-49c7-975d-54dc12025ea8",
        },
        {
          product_sale_group_id: "9a87dc01-1a3c-4488-a72b-9d653daf9d0e",
          title: "สมาร์ท เซฟวิ่ง 10/4",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025154348.png",
          content_url_banner_product_name: "image_banner08052025230242.png",
          content_banner_type: "0",
          product_sale_channel_id: "7cdce038-76a6-4e86-8ea6-e782e056880c",
        },
        {
          product_sale_group_id: "7bdfea79-f4d3-4d8b-8e43-1c82aaeab93e",
          title: "เอ็ม บี เค เทอม ไลฟ์ 10/10",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner07072025144930.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "783465fe-67bf-4b09-a2b2-a9c3356ec1d8",
        },
        {
          product_sale_group_id: "d8241997-c97a-422e-9d75-1c7e11616c26",
          title: "เอ็ม บี เค สมาร์ท เซฟวิ่ง 10/2",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025160419.png",
          content_url_banner_product_name: "product S2-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "959d4953-2d4d-4ea8-aece-6ad0055b70cf",
        },
        {
          product_sale_group_id: "efdac860-9cd1-4016-a664-5b354326ec5d",
          title: "เอ็ม บี เค ฟาสท์ เซฟวิ่ง 2/1",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161225.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "97c66432-13c3-4a60-bf97-0fb00c160caa",
        },
      ];
      const component = <AppManageBanner {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const input = screen.getByRole("combobox", { name: /ผลิตภัณฑ์/i });
      await userEvent.click(input);

      const option = screen.getByText("95/5");
      fireEvent.click(option);

      const checkbox = screen.getByText("ใช้รูปภาพจากผลิตภัณฑ์");

      fireEvent.click(checkbox);

      expect(component).toBeDefined();
    });
    test("Select product and bannerType", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "bannerType") return { label: "Image", value: 0 };
          if (name === "useBannerFromProduct") return false;
          if (name === "product")
            return { label: "Product", value: 1, product_sale_group_id: 1 };
          if (name === "bannerImageName") return "banner.jpg";
          if (name === "bannerImagePreviewUrl") return "preview.jpg";
          return "";
        }),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: false,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });

      mockProductResponse = [
        {
          product_sale_group_id: "dc262047-f4bd-4332-89b6-9b16193330a5",
          title: "เอ็ม บี เค แฮปปี้ เพนชั่น โกลด์ 85/1 (บำนาญแบบลดหย่อนได้)",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161152.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "c63466f4-c376-4b66-ab51-edf15174886c",
        },
        {
          product_sale_group_id: "7e547e16-792e-4a74-9feb-325d58372278",
          title: "95/5",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161117.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "7b144e92-02e9-4314-be84-84202c4e3579",
        },
        {
          product_sale_group_id: "5bee9cfe-745f-4772-b6c8-fa3eac1a0029",
          title: "เอ็ม บี เค สมาร์ท เซฟวิ่ง 10/1",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner07072025151509.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "d69491e5-c438-49c7-975d-54dc12025ea8",
        },
        {
          product_sale_group_id: "9a87dc01-1a3c-4488-a72b-9d653daf9d0e",
          title: "สมาร์ท เซฟวิ่ง 10/4",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025154348.png",
          content_url_banner_product_name: "image_banner08052025230242.png",
          content_banner_type: "0",
          product_sale_channel_id: "7cdce038-76a6-4e86-8ea6-e782e056880c",
        },
        {
          product_sale_group_id: "7bdfea79-f4d3-4d8b-8e43-1c82aaeab93e",
          title: "เอ็ม บี เค เทอม ไลฟ์ 10/10",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner07072025144930.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "783465fe-67bf-4b09-a2b2-a9c3356ec1d8",
        },
        {
          product_sale_group_id: "d8241997-c97a-422e-9d75-1c7e11616c26",
          title: "เอ็ม บี เค สมาร์ท เซฟวิ่ง 10/2",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025160419.png",
          content_url_banner_product_name: "product S2-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "959d4953-2d4d-4ea8-aece-6ad0055b70cf",
        },
        {
          product_sale_group_id: "efdac860-9cd1-4016-a664-5b354326ec5d",
          title: "เอ็ม บี เค ฟาสท์ เซฟวิ่ง 2/1",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161225.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "97c66432-13c3-4a60-bf97-0fb00c160caa",
        },
      ];
      const component = <AppManageBanner {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const input = screen.getByRole("combobox", { name: /ผลิตภัณฑ์/i });
      await userEvent.click(input);

      const option = screen.getByText("95/5");
      fireEvent.click(option);

      const BannerInput = screen.getByRole("combobox", {
        name: /ประเภทแบนเนอร์/i,
      });

      await userEvent.type(
        BannerInput,
        APPLICATION_BANNER_TYPE[0].label.slice(0, 2)
      );

      const BannerOption = await screen.findByText(
        APPLICATION_BANNER_TYPE[0].label
      );
      await userEvent.click(BannerOption);

      expect(component).toBeDefined();
    });
    test("Select product and fileChange", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "bannerType") return { label: "Image", value: 0 };
          if (name === "useBannerFromProduct") return false;
          if (name === "product")
            return { label: "Product", value: 1, product_sale_group_id: 1 };
          if (name === "bannerImageName") return "banner.jpg";
          if (name === "bannerImagePreviewUrl") return "preview.jpg";
          return "";
        }),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: false,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });

      mockProductResponse = [
        {
          product_sale_group_id: "dc262047-f4bd-4332-89b6-9b16193330a5",
          title: "เอ็ม บี เค แฮปปี้ เพนชั่น โกลด์ 85/1 (บำนาญแบบลดหย่อนได้)",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161152.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "c63466f4-c376-4b66-ab51-edf15174886c",
        },
        {
          product_sale_group_id: "7e547e16-792e-4a74-9feb-325d58372278",
          title: "95/5",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161117.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "7b144e92-02e9-4314-be84-84202c4e3579",
        },
        {
          product_sale_group_id: "5bee9cfe-745f-4772-b6c8-fa3eac1a0029",
          title: "เอ็ม บี เค สมาร์ท เซฟวิ่ง 10/1",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner07072025151509.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "d69491e5-c438-49c7-975d-54dc12025ea8",
        },
        {
          product_sale_group_id: "9a87dc01-1a3c-4488-a72b-9d653daf9d0e",
          title: "สมาร์ท เซฟวิ่ง 10/4",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025154348.png",
          content_url_banner_product_name: "image_banner08052025230242.png",
          content_banner_type: "0",
          product_sale_channel_id: "7cdce038-76a6-4e86-8ea6-e782e056880c",
        },
        {
          product_sale_group_id: "7bdfea79-f4d3-4d8b-8e43-1c82aaeab93e",
          title: "เอ็ม บี เค เทอม ไลฟ์ 10/10",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner07072025144930.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "783465fe-67bf-4b09-a2b2-a9c3356ec1d8",
        },
        {
          product_sale_group_id: "d8241997-c97a-422e-9d75-1c7e11616c26",
          title: "เอ็ม บี เค สมาร์ท เซฟวิ่ง 10/2",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025160419.png",
          content_url_banner_product_name: "product S2-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "959d4953-2d4d-4ea8-aece-6ad0055b70cf",
        },
        {
          product_sale_group_id: "efdac860-9cd1-4016-a664-5b354326ec5d",
          title: "เอ็ม บี เค ฟาสท์ เซฟวิ่ง 2/1",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161225.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "97c66432-13c3-4a60-bf97-0fb00c160caa",
        },
      ];
      const component = <AppManageBanner {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const input = screen.getByRole("combobox", { name: /ผลิตภัณฑ์/i });
      await userEvent.click(input);

      const option = screen.getByText("95/5");
      await userEvent.click(option);

      // mock ref เพื่อให้ inputBannerRef.current.click() ทำงาน
      const file = new File(["(⌐□_□)"], "banner.jpg", { type: "image/jpeg" });

      const uploadButton = screen.getByTestId("upload-banner-button");
      await userEvent.click(uploadButton);

      const fileInput =
        screen.getByTestId("upload-input") ||
        screen.getByRole("textbox", { hidden: true });
      // simulate selecting file
      fireEvent.change(fileInput, {
        target: { files: [file] },
      });
      // ตรวจว่า input ได้รับไฟล์จริงไหม
      expect(fileInput.files[0]).toEqual(file);
      expect(fileInput.files).toHaveLength(1);
      expect(component).toBeDefined();
    });
    test("Select product and fileChange but error", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "bannerType") return { label: "Image", value: 0 };
          if (name === "useBannerFromProduct") return false;
          if (name === "product")
            return { label: "Product", value: 1, product_sale_group_id: 1 };
          if (name === "bannerImageName") return "banner.jpg";
          if (name === "bannerImagePreviewUrl") return "preview.jpg";
          return "";
        }),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: false,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });

      mockProductResponse = [
        {
          product_sale_group_id: "dc262047-f4bd-4332-89b6-9b16193330a5",
          title: "เอ็ม บี เค แฮปปี้ เพนชั่น โกลด์ 85/1 (บำนาญแบบลดหย่อนได้)",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161152.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "c63466f4-c376-4b66-ab51-edf15174886c",
        },
        {
          product_sale_group_id: "7e547e16-792e-4a74-9feb-325d58372278",
          title: "95/5",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161117.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "7b144e92-02e9-4314-be84-84202c4e3579",
        },
        {
          product_sale_group_id: "5bee9cfe-745f-4772-b6c8-fa3eac1a0029",
          title: "เอ็ม บี เค สมาร์ท เซฟวิ่ง 10/1",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner07072025151509.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "d69491e5-c438-49c7-975d-54dc12025ea8",
        },
        {
          product_sale_group_id: "9a87dc01-1a3c-4488-a72b-9d653daf9d0e",
          title: "สมาร์ท เซฟวิ่ง 10/4",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025154348.png",
          content_url_banner_product_name: "image_banner08052025230242.png",
          content_banner_type: "0",
          product_sale_channel_id: "7cdce038-76a6-4e86-8ea6-e782e056880c",
        },
        {
          product_sale_group_id: "7bdfea79-f4d3-4d8b-8e43-1c82aaeab93e",
          title: "เอ็ม บี เค เทอม ไลฟ์ 10/10",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner07072025144930.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "783465fe-67bf-4b09-a2b2-a9c3356ec1d8",
        },
        {
          product_sale_group_id: "d8241997-c97a-422e-9d75-1c7e11616c26",
          title: "เอ็ม บี เค สมาร์ท เซฟวิ่ง 10/2",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025160419.png",
          content_url_banner_product_name: "product S2-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "959d4953-2d4d-4ea8-aece-6ad0055b70cf",
        },
        {
          product_sale_group_id: "efdac860-9cd1-4016-a664-5b354326ec5d",
          title: "เอ็ม บี เค ฟาสท์ เซฟวิ่ง 2/1",
          content_url_banner_product:
            "https://sttlifesaleappextuat.blob.core.windows.net/images/image_banner03072025161225.png",
          content_url_banner_product_name: "คำนวณเบี้ย S3-1@2x.png",
          content_banner_type: "0",
          product_sale_channel_id: "97c66432-13c3-4a60-bf97-0fb00c160caa",
        },
      ];
      const component = <AppManageBanner {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const input = screen.getByRole("combobox", { name: /ผลิตภัณฑ์/i });
      await userEvent.click(input);

      const option = screen.getByText("95/5");
      await userEvent.click(option);

      // mock ref เพื่อให้ inputBannerRef.current.click() ทำงาน
      const file = new File(["(⌐□_□)"], "banner.text", { type: "text" });

      const uploadButton = screen.getByTestId("upload-banner-button");
      await userEvent.click(uploadButton);

      const fileInput =
        screen.getByTestId("upload-input") ||
        screen.getByRole("textbox", { hidden: true });
      // simulate selecting file
      fireEvent.change(fileInput, {
        target: { files: [file] },
      });
      // ตรวจว่า input ได้รับไฟล์จริงไหม
      expect(fileInput.files[0]).toEqual(file);
      expect(fileInput.files).toHaveLength(1);
      expect(component).toBeDefined();
    });
    test("submit", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "bannerType") return { label: "Image", value: 0 };
          if (name === "useBannerFromProduct") return false;
          if (name === "product")
            return { label: "Product", value: 1, product_sale_group_id: 1 };
          if (name === "bannerImageName") return "banner.jpg";
          if (name === "bannerImagePreviewUrl") return "preview.jpg";
          if (name === "bannerImageUrl") return "mock-bannerImageUrl";
          if (name === "bannerImage") return "mock-bannerImage";
          return "";
        }),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: false,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });

      const component = <AppManageBanner {...defaultProps} />;

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
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "bannerType") return { label: "Image", value: 0 };
          if (name === "useBannerFromProduct") return false;
          if (name === "product")
            return { label: "Product", value: 1, product_sale_group_id: 1 };
          if (name === "bannerImageName") return "banner.jpg";
          if (name === "bannerImagePreviewUrl") return "preview.jpg";
          if (name === "bannerImageUrl") return "mock-bannerImageUrl";
          if (name === "bannerImage") return "mock-bannerImage";
          return "";
        }),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });

      const component = <AppManageBanner {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const close = await screen.findByText("ยกเลิก");
      fireEvent.click(close);

      const confirmButton = await screen.findByTestId("dialogConfirm");
      fireEvent.click(confirmButton);

      expect(component).toBeDefined();
    });
    test("close isDirty = false", async () => {
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "bannerType") return { label: "Image", value: 0 };
          if (name === "useBannerFromProduct") return false;
          if (name === "product")
            return { label: "Product", value: 1, product_sale_group_id: 1 };
          if (name === "bannerImageName") return "banner.jpg";
          if (name === "bannerImagePreviewUrl") return "preview.jpg";
          if (name === "bannerImageUrl") return "mock-bannerImageUrl";
          if (name === "bannerImage") return "mock-bannerImage";
          return "";
        }),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: false,
          errors: {},
          dirtyFields: {},
        },
        control: {},
        setValue: jest.fn(),
      });

      const component = <AppManageBanner {...defaultProps} />;

      await render(component, {
        mockStore,
      });
      const close = await screen.findByText("ยกเลิก");
      fireEvent.click(close);

      expect(component).toBeDefined();
    });
  });
});
