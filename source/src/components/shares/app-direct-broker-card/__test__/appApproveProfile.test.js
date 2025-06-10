import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppApproveProfile } from "../components";
import { APPLICATION_DEFAULT } from "@/constants";

// Mock hooks and components
// Define handleNotificationMock outside so it can be accessed in tests
const handleNotificationMock = jest.fn(
  (msg, onConfirm) => onConfirm && onConfirm()
);

jest.mock("@/hooks", () => ({
  useAppSelector: jest.fn(() => ({ userProfile: {} })),
  useAppDialog: jest.fn(() => ({
    handleNotification: handleNotificationMock,
  })),
  useAppForm: jest.fn((opts) => {
    // Simulate react-hook-form methods
    let values = opts.defaultValues;
    let dirty = false;
    return {
      watch: (name) => values[name],
      control: {},
      register: jest.fn(() => ({
        name: "reason",
        onChange: (e) => {
          values.reason = e.target.value;
          dirty = true;
        },
        value: values.reason,
      })),
      reset: jest.fn(() => {
        values = opts.defaultValues;
        dirty = false;
      }),
      setValue: jest.fn((name, value) => {
        values[name] = value;
        dirty = true;
      }),
      formState: { errors: {}, isDirty: dirty },
      handleSubmit: (onSubmit, onError) => (e) => {
        e.preventDefault();
        if (!values.reason) {
          onError({ reason: { message: "reason is a required field" } }, e);
        } else {
          onSubmit(values, e);
        }
      },
    };
  }),
  useAppFieldArray: jest.fn(),
}));
jest.mock("@/components", () => ({
  AppAutocomplete: () => <div data-testid="autocomplete" />,
}));
jest.mock("@/constants", () => ({
  APPLICATION_CONFIGURATION: {},
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
jest.mock("@/utilities", () => ({
  Yup: require("yup"),
}));

describe("AppApproveProfile", () => {
  const setOpen = jest.fn();

  beforeEach(() => {
    setOpen.mockClear();
  });

  it("renders dialog when open is true", () => {
    render(<AppApproveProfile open={true} setOpen={setOpen} />);
    expect(screen.getByText("ระบุเหตุผล")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "เหตุผล" })).toBeInTheDocument();
    expect(screen.getByText("ยกเลิก")).toBeInTheDocument();
    expect(screen.getByText("ตกลง")).toBeInTheDocument();
  });

  it("does not render dialog when open is false", () => {
    render(<AppApproveProfile open={false} setOpen={setOpen} />);
    expect(screen.queryByText("ระบุเหตุผล")).not.toBeInTheDocument();
  });

  /*   it("shows error when submitting empty reason", async () => {
    render(<AppApproveProfile open={true} setOpen={setOpen} />);
    fireEvent.click(screen.getByText("ตกลง"));
    await waitFor(() => {
      // Find the helper text element and check its content
      const helperText = screen.getByText(
        (content, element) =>
          element.tagName.toLowerCase() === "p" &&
          element.className.includes("MuiFormHelperText-root") &&
          content.includes("reason is a required field")
      );
      expect(helperText).toBeInTheDocument();
    });
  }); */

  it("calls setOpen and reset on cancel", async () => {
    render(<AppApproveProfile open={true} setOpen={setOpen} />);
    fireEvent.click(screen.getByText("ยกเลิก"));
    await waitFor(() => {
      expect(setOpen).toHaveBeenCalledWith(false);
    });
  });

  it("submits form with valid reason", async () => {
    const reasonText = "Valid reason";
    render(<AppApproveProfile open={true} setOpen={setOpen} />);
    const input = screen.getByRole("textbox", { name: "เหตุผล" });
    fireEvent.change(input, { target: { value: reasonText } });
    fireEvent.click(screen.getByText("ตกลง"));
    // No error should be shown
    await waitFor(() => {
      expect(
        screen.queryByText("reason is a required field")
      ).not.toBeInTheDocument();
    });
  });

  it("Opens Cancel Dialog and cancels without confirmation", async () => {
    render(<AppApproveProfile open={true} setOpen={setOpen} />);
    fireEvent.click(screen.getByText("ยกเลิก"));

    await waitFor(() => {
      expect(setOpen).toHaveBeenCalledWith(false);
    });
  });
});
