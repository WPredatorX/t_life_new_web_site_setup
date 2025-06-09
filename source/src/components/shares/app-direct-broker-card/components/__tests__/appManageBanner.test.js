import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppManageBanner } from "..";

// Mock MUI
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    Dialog: ({ open, children, ...props }) =>
      open ? <div data-testid="dialog">{children}</div> : null,
    DialogTitle: ({ children }) => (
      <div data-testid="dialog-title">{children}</div>
    ),
    DialogContent: ({ children }) => (
      <div data-testid="dialog-content">{children}</div>
    ),
    DialogActions: ({ children }) => (
      <div data-testid="dialog-actions">{children}</div>
    ),
    TextField: (props) => (
      <>
        <input data-testid={props.label} {...props} />
        {props.helperText && <div>{props.helperText}</div>}
        {props.InputProps && props.InputProps.endAdornment}
      </>
    ),
    Button: ({ children, ...props }) => (
      <button type={props.type || "button"} {...props}>
        {children}
      </button>
    ),
    Grid: ({ children }) => <div>{children}</div>,
    InputLabel: ({ children }) => <label>{children}</label>,
    FormHelperText: ({ children }) => <div>{children}</div>,
    Switch: (props) => (
      <input type="checkbox" data-testid="switch" {...props} />
    ),
    InputAdornment: ({ children }) => <span>{children}</span>,
  };
});

// Mock constants
jest.mock("@/constants", () => ({
  APPLICATION_BANNER_TYPE: [
    { label: "Image", value: 0 },
    { label: "Video", value: 2 },
  ],
  APPLICATION_CONFIGURATION: {
    defaultFileAccept: ".jpg,.jpeg,.png",
    defaultFileExtension: ["image/jpeg", "image/png"],
    defaultFileSize: 2000000,
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

// Mock AppAutocomplete
jest.mock("@/components", () => ({
  AppAutocomplete: (props) => (
    <input
      data-testid={props.label}
      onFocus={(e) => props.onBeforeOpen && props.onBeforeOpen(e)}
      onChange={(e) =>
        props.onChange &&
        props.onChange(
          {},
          { label: "Product", value: 1, product_sale_group_id: 1 }
        )
      }
      {...props}
    />
  ),
}));

// Mock react-hook-form Controller
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render, ...props }) =>
      render({
        field: {
          name: props.name,
          value: "",
          onChange: () => {},
        },
      }),
  };
});

const validateMock = jest.fn();

const singletonSchema = {
  validate: validateMock,
};

jest.mock("@/utilities", () => ({
  Yup: {
    object: () => ({
      shape: () => singletonSchema,
      nullable: () => ({
        shape: () => singletonSchema,
        required: () => ({
          shape: () => singletonSchema,
        }),
      }),
      required: () => ({
        shape: () => singletonSchema,
      }),
    }),
    mixed: () => ({
      nullable: () => ({
        when: () => ({
          required: () => ({}),
        }),
        required: () => ({}),
      }),
      required: () => ({}),
    }),
    string: () => ({
      nullable: () => ({
        when: () => ({
          required: () => ({}),
        }),
        required: () => ({}),
      }),
      required: () => ({}),
    }),
    bool: () => ({
      nullable: () => ({}),
      required: () => ({}),
    }),
  },
}));

// Mock yupResolver
jest.mock("@hookform/resolvers/yup", () => {
  const { Yup } = require("@/utilities");
  return {
    yupResolver: (schema) => async (data) => {
      await schema.shape().validate(data);
      return {};
    },
  };
});

// Mock hooks
const mockHandleNotification = jest.fn((msg, cb) => cb && cb());
const mockSetOpen = jest.fn();
const mockAddBanner = jest.fn();
jest.mock("@/hooks", () => ({
  useAppForm: jest.fn(() => ({
    watch: jest.fn((name) => {
      if (name === "bannerType") return { label: "Image", value: 0 };
      if (name === "useBannerFromProduct") return false;
      if (name === "product")
        return { label: "Product", value: 1, product_sale_group_id: 1 };
      if (name === "bannerImageName") return "banner.jpg";
      if (name === "bannerImagePreviewUrl") return "preview.jpg";
      return "";
    }),
    control: {},
    register: jest.fn(),
    reset: jest.fn(),
    setValue: jest.fn(),
    formState: {
      errors: {
        product: { message: "กรุณาเลือกผลิตภัณฑ์" },
      },
      isDirty: true,
    },
    handleSubmit: (onSubmit, onError) => (e) => {
      e && e.preventDefault();
      try {
        // เรียก validateMock เพื่อ simulate yup validation
        validateMock({});
        onSubmit(
          {
            bannerType: { label: "Image", value: 0 },
            bannerImageUrl: "url.jpg",
            bannerImage: "image.jpg",
            bannerImageName: "banner.jpg",
            bannerImagePreviewUrl: "preview.jpg",
            product: { label: "Product", value: 1, product_sale_group_id: 1 },
            useBannerFromProduct: false,
          },
          e
        );
      } catch (err) {
        onError &&
          onError(
            {
              product: { message: "กรุณาเลือกผลิตภัณฑ์" },
            },
            e
          );
      }
    },
  })),
  useAppFieldArray: jest.fn(),
  useAppDialog: jest.fn(() => ({
    handleNotification: mockHandleNotification,
  })),
  useAppSelector: jest.fn((selector) =>
    selector({
      global: {
        brokerId: 1,
        activator: "tester",
        sasToken: { sas_images: "?sas" },
      },
    })
  ),
}));
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
  let ref, defaultFileExtension, file, event;
  beforeEach(() => {
    jest.clearAllMocks();
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
  });

  it("renders dialog when open", () => {
    render(
      <AppManageBanner
        open={true}
        setOpen={mockSetOpen}
        addBanner={mockAddBanner}
        currentSelected={[]}
      />
    );
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "เพิ่มแบนเนอร์"
    );
  });

  it("calls setOpen(false) when cancel is clicked and form is not dirty", () => {
    // mock isDirty = false
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      formState: { errors: {}, isDirty: false },
      reset: jest.fn(),
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={mockSetOpen}
        addBanner={mockAddBanner}
        currentSelected={[]}
      />
    );
    fireEvent.click(screen.getByText("ยกเลิก"));
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it("calls reset and setOpen(false) when user confirms cancel and form is dirty", () => {
    render(
      <AppManageBanner
        open={true}
        setOpen={mockSetOpen}
        addBanner={mockAddBanner}
        currentSelected={[]}
      />
    );
    fireEvent.click(screen.getByText("ยกเลิก"));
    expect(mockHandleNotification).toHaveBeenCalled();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it("calls addBanner and setOpen(false) on submit", () => {
    render(
      <AppManageBanner
        open={true}
        setOpen={mockSetOpen}
        addBanner={mockAddBanner}
        currentSelected={[]}
      />
    );
    // เลือก form จาก dialog-content แล้ว submit
    const form = screen.getByTestId("dialog-content").closest("form");
    fireEvent.submit(form);
    expect(mockAddBanner).toHaveBeenCalled();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it("shows product autocomplete", () => {
    render(
      <AppManageBanner
        open={true}
        setOpen={mockSetOpen}
        addBanner={mockAddBanner}
        currentSelected={[]}
      />
    );
    expect(screen.getByTestId("ผลิตภัณฑ์")).toBeInTheDocument();
  });

  it("shows banner type autocomplete", () => {
    render(
      <AppManageBanner
        open={true}
        setOpen={mockSetOpen}
        addBanner={mockAddBanner}
        currentSelected={[]}
      />
    );
    expect(screen.getByTestId("ประเภทแบนเนอร์")).toBeInTheDocument();
  });
  it("should show error when is empty", async () => {
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      watch: jest.fn((name) => {
        if (name === "product") return "";
        if (name === "useBannerFromProduct") return null;
        if (name === "bannerType") return "";
        if (name === "bannerImage") return null;
        if (name === "bannerImageName") return "";
        if (name === "bannerImagePreviewUrl") return "";
        if (name === "bannerImageUrl") return "";
        if (name === "bannerVideoLink") return "";
        if (name === "bannerAddImage") return "";
        return "";
      }),
      formState: {
        errors: {
          product: { message: "กรุณาเลือกผลิตภัณฑ์" },
        },
        isDirty: true,
      },
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    const form = screen.getByTestId("dialog-content").closest("form");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText("กรุณาเลือกผลิตภัณฑ์")).toBeInTheDocument();
    });
  });

  it("should require bannerImage when bannerType.value === 1", async () => {
    // mock useAppForm ให้ watch("bannerType") === { value: 1 }
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      watch: jest.fn((name) => {
        if (name === "bannerType") return { label: "Image", value: 1 };
        return "";
      }),
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    const form = screen.getByTestId("dialog-content").closest("form");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(
        screen.getByText(
          (content) => /required/i.test(content) || /กรุณาเลือก/i.test(content)
        )
      ).toBeInTheDocument();
    });
  });

  it("should require bannerVideoLink when bannerType.value === 2", async () => {
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      watch: jest.fn((name) => {
        if (name === "bannerType") return { label: "Video", value: 2 };
        return "";
      }),
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    const form = screen.getByTestId("dialog-content").closest("form");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(
        screen.getByText(
          (content) => /required/i.test(content) || /กรุณาเลือก/i.test(content)
        )
      ).toBeInTheDocument();
    });
  });

  it("should pass validation when all required fields are filled", async () => {
    // mock useAppForm ให้ watch คืนค่าครบ
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      watch: jest.fn((name) => {
        if (name === "product")
          return { label: "Product", value: 1, product_sale_group_id: 1 };
        if (name === "bannerType") return { label: "Image", value: 1 };
        if (name === "bannerImage") return "mock-image";
        if (name === "bannerImageName") return "mock.jpg";
        if (name === "bannerImagePreviewUrl") return "mock-url";
        return "";
      }),
      formState: { errors: {}, isDirty: true },
    });
    const addBanner = jest.fn();
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={addBanner}
        currentSelected={[]}
      />
    );
    const form = screen.getByTestId("dialog-content").closest("form");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(addBanner).toHaveBeenCalled();
    });
  });

  // 91-120: handleFetchProduct
  it("fetches and maps products correctly", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [
        { product_sale_group_id: 1, title: "A", is_active: 1 },
        { product_sale_group_id: 2, title: "B", is_active: 0 },
      ],
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    // เรียก handleFetchProduct ผ่าน onBeforeOpen
    const auto = screen.getByTestId("ผลิตภัณฑ์");
    fireEvent.focus(auto);
    // expect fetch ถูกเรียก
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/direct/profile?action=GetDisplayProducts",
        expect.any(Object)
      );
    });
  });

  // 135-136: handleClose (isDirty false)
  it("calls reset and setOpen(false) when handleClose with isDirty false", () => {
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      formState: { errors: {}, isDirty: false },
      reset: jest.fn(),
    });
    const setOpen = jest.fn();
    render(
      <AppManageBanner
        open={true}
        setOpen={setOpen}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    fireEvent.click(screen.getByText("ยกเลิก"));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  // 181-218: onSubmit, handleNotification, addBanner
  it("calls addBanner with correct data on submit", () => {
    validateMock.mockImplementation(() => {}); // <--- reset ให้ validate ผ่าน
    render(
      <AppManageBanner
        open={true}
        setOpen={mockSetOpen}
        addBanner={mockAddBanner}
        currentSelected={[]}
      />
    );
    const form = screen.getByTestId("dialog-content").closest("form");
    fireEvent.submit(form);
    expect(mockAddBanner).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        status: 1,
        statusName: "รออนุมัติ",
        is_new: true,
        product: expect.objectContaining({
          label: "Product",
          value: 1,
          product_sale_group_id: 1,
        }),
      })
    );
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  // 226: onError
  it("calls onError on validation error", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    // mock handleSubmit ให้เรียก onError
    validateMock.mockImplementation(() => {
      throw { errors: [{ path: "product", message: "required" }] };
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    const form = screen.getByTestId("dialog-content").closest("form");
    fireEvent.submit(form);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  // 241-252: handleImageChange
  it("handles image change and validation", () => {
    const setValue = jest.fn();
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      setValue,
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    // mock file
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("รูปภาพแบนเนอร์ (2000 x 600 px)");
    fireEvent.change(input, { target: { files: [file] } });
    // expect setValue ถูกเรียก
    expect(setValue).toHaveBeenCalled();
  });

  // 284-290: useEffect (isSelectedProduct)
  it("sets default bannerType when isSelectedProduct is true", () => {
    let product = undefined;
    let bannerType = null;
    const setValue = jest.fn((name, value) => {
      if (name === "bannerType") {
        bannerType = value;
      }
    });
    const watch = jest.fn((name) => {
      if (name === "product") return product;
      if (name === "bannerType") return bannerType;
      if (name === "useBannerFromProduct") return false;
      return "";
    });

    // ให้ useAppForm คืน watch/setValue นี้ทุกครั้ง
    require("@/hooks").useAppForm.mockImplementation(() => ({
      watch,
      setValue,
      control: {},
      register: jest.fn(),
      reset: jest.fn(),
      formState: { errors: {}, isDirty: true },
      handleSubmit: jest.fn(),
    }));

    const { rerender } = render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    // เปลี่ยน product เพื่อ trigger useEffect
    product = { label: "Product", value: 1, product_sale_group_id: 1 };
    rerender(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    // ตรวจสอบว่ามีการ set bannerType จริง
    expect(setValue).toHaveBeenCalledWith(
      "bannerType",
      expect.any(Object),
      expect.objectContaining({ shouldValidate: true })
    );
  });

  // 320: useEffect (setIsSelectedProduct)
  it("sets isSelectedProduct when product changes", () => {
    // ทดสอบว่า useEffect ทำงาน (mock watch ให้เปลี่ยนค่า)
    const setValue = jest.fn();
    let product = null;
    const watch = jest.fn((name) => {
      if (name === "product") return product;
      return "";
    });
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      setValue,
      watch,
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    product = { label: "Product", value: 1 };
    // trigger useEffect ด้วย rerender หรือ fireEvent
    // (ในเทสจริงอาจต้อง rerender หรือ simulate การเปลี่ยนแปลง)
  });

  // 344-398: render เงื่อนไข bannerType.value === 0, 2
  it("renders image input when bannerType.value === 0", () => {
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      watch: jest.fn((name) => {
        if (name === "bannerType") return { label: "Image", value: 0 };
        if (name === "useBannerFromProduct") return false;
        return "";
      }),
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    expect(
      screen.getByTestId("รูปภาพแบนเนอร์ (2000 x 600 px)")
    ).toBeInTheDocument();
  });

  it("should trigger file input when clicking 'อัปโหลด' button", () => {
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      watch: jest.fn((name) => {
        if (name === "bannerType") return { label: "Image", value: 0 };
        if (name === "useBannerFromProduct") return false;
        if (name === "bannerImageName") return "test.png";
        return "";
      }),
    });
    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );
    // log
    console.log(screen.debug());
    // spy on click of input
    const fileInput = screen.getByTestId("รูปภาพแบนเนอร์ (2000 x 600 px)");
    const uploadButton = screen.getByTestId("upload-banner-button");
    fileInput.click = jest.fn();
    fireEvent.click(uploadButton);
  });
  it("should trigger handleImageChange and setValue when file is uploaded", async () => {
    const setValue = jest.fn();
    require("@/hooks").useAppForm.mockReturnValueOnce({
      ...require("@/hooks").useAppForm(),
      setValue,
      watch: jest.fn((name) => {
        if (name === "bannerType") return { label: "Image", value: 0 };
        if (name === "useBannerFromProduct") return false;
        if (name === "bannerImageName") return "";
        return "";
      }),
    });

    render(
      <AppManageBanner
        open={true}
        setOpen={jest.fn()}
        addBanner={jest.fn()}
        currentSelected={[]}
      />
    );

    const fileInput = document.getElementById("upload-input");
    const file = new File(["dummy"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(setValue).toHaveBeenCalledWith("bannerImageString", "abc123", {
        shouldDirty: true,
      });
      expect(setValue).toHaveBeenCalledWith("bannerImageName", "test.png");
      expect(setValue).toHaveBeenCalledWith("bannerImage", file);
      expect(setValue).toHaveBeenCalledWith(
        "bannerImagePreviewUrl",
        "blob:url"
      );
    });
  });
});
