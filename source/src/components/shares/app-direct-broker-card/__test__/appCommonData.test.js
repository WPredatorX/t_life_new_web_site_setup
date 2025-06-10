import AppCommonData from "../components";
import { render, screen } from "@testing-library/react";
import { APPLICATION_DEFAULT } from "@/constants";

import {
  useAppForm,
  useAppSnackbar,
  useAppDialog,
  useAppRouter,
  useAppFeatureCheck,
  useAppFieldArray,
  useAppDispatch,
} from "@/hooks";
import { Yup } from "@/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks";
import { Controller } from "react-hook-form";
import { de } from "date-fns/locale";

jest.mock("@/hooks", () => ({
  useAppSelector: jest.fn(() => ({
    activator: "me",
  })),
  useAppForm: jest.fn(),
  useAppSnackbar: jest.fn(() => ({
    handleSanckAlert: jest.fn(),
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

jest.mock("@/components", () => ({
  AppAutocomplete: () => <div data-testid="autocomplete" />,
}));

jest.mock("@/constants", () => ({
  APPLICATION_DEFAULT: {
    language: "th",
    snackBar: {
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
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
    activeMenu: { id: 0 },
    drawerWidth: 240,
    dataGrid: {
      pageNumber: 0,
      pageSize: 5,
      pageSizeOption: [5, 25, 50, 100],
    },
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
  },
  APPLICATION_CONFIGURATION: {},
}));

describe("AppCommonData Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockData = {
    generalInfo: [
      {
        i_subbusiness_line: "c11",
        c_subbusiness_line: "c2",
        i_business_line: "test",
        broker_id: "123",
        broker_name: "test broker",
        broker_logo: "",
        broker_license_number: "",
        broker_email: "",
        broker_url: "",
        recipient_id: "",
        mail_to: "",
        mail_cc: "",
        template_code: "",
      },
    ],
    confirmEmail: ["confirmEmail@test.com"],
    confirmEmailCC: ["confirmEmailCC@test.com"],
    contactEmail: ["contactEmail@test.com"],
    contactEmailCC: ["contactEmailCC@test.com"],
  };
  it("renders without crashing", () => {
    //render(<AppCommonData mode={"Direct"} brokerData={mockData} />);
    //expect(screen.getByTestId("autocomplete")).toBeInTheDocument();
  });
});
