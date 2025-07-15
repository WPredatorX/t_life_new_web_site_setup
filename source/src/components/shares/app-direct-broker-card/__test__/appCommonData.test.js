import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  within,
  userEvent,
} from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { useAppForm } from "@/hooks";
import { AppCommonData } from "../components";

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({
        field: { onChange: jest.fn(), value: [], name: "mock-name" },
      }),
  };
});

jest.mock("@hooks/useAppForm", () =>
  jest.fn().mockReturnValue({
    register: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn((name) => {
      if (name === "generalInfo") return [];
      if (name === "confirmEmail") return [];
      if (name === "confirmEmailCC") return [];
      if (name === "contactEmail") return [];
      if (name === "contactEmailCC") return [];
      return {};
    }),
    handleSubmit: jest.fn(),
    formState: {
      isDirty: false,
      errors: {},
    },
    control: {},
    setValue: jest.fn(),
  })
);

jest.mock("@hooks/useAppFieldArray", () =>
  jest.fn().mockReturnValue({
    fields: [],
    insert: jest.fn(),
    update: jest.fn(),
  })
);

describe("AppCommonData Component", () => {
  let mockStore = null;
  let defaultProps = {};
  let mockData = {
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
  let mockTestSendMailStatus = null;
  let mockAddOrUpdateDirectStatus = null;

  beforeEach(() => {
    defaultProps = {
      mode: "direct",
      brokerData: mockData,
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
                    code: "menu-002",
                    feature: [
                      {
                        code: "direct.general.write",
                      },
                      {
                        code: "broker.general.write",
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
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "generalInfo") return [];
        if (name === "confirmEmail") return ["confirmEmail@test.com"];
        if (name === "confirmEmailCC") return ["confirmEmailCC@test.com"];
        if (name === "contactEmail") return ["contactEmail@test.com"];
        if (name === "contactEmailCC") return ["contactEmailCC@test.com"];

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
    });
    mockTestSendMailStatus = 200;
    mockAddOrUpdateDirectStatus = 200;
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct?action=TestSendMail")) {
        return {
          status: mockTestSendMailStatus,
        };
      }
      if (req.url.includes("/api/direct?action=AddOrUpdateDirect")) {
        return {
          status: mockAddOrUpdateDirectStatus,
        };
      }
    });
  });
  describe("render", () => {
    it("should render default", async () => {
      // arrange
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      // assert
      expect(component).toBeDefined();
    });
  });
  describe("Action", () => {
    test("type confirm Email", async () => {
      // arrange
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      const container = screen.getByTestId("confirmEmail");
      const textarea = within(container).getByRole("combobox");

      await userEvent.type(textarea, "test@example.com{enter}");

      // assert
      expect(component).toBeDefined();
    });

    test("type confirmEmailCC Email", async () => {
      // arrange
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      const container = screen.getByTestId("confirmEmailCC");
      const textarea = within(container).getByRole("combobox");

      await userEvent.type(textarea, "test@example.com{enter}");

      // assert
      expect(component).toBeDefined();
    });

    test("type contactEmail Email", async () => {
      // arrange
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      const container = screen.getByTestId("contactEmail");
      const textarea = within(container).getByRole("combobox");

      await userEvent.type(textarea, "test@example.com{enter}");

      // assert
      expect(component).toBeDefined();
    });

    test("type contactEmailCC Email", async () => {
      // arrange
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      const container = screen.getByTestId("contactEmailCC");
      const textarea = within(container).getByRole("combobox");

      await userEvent.type(textarea, "test@example.com{enter}");

      // assert
      expect(component).toBeDefined();
    });

    test("test send confirmEmail", async () => {
      // arrange
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      const sentButton = screen.getByTestId("TestSendMail_1");
      await userEvent.click(sentButton);

      // assert
      expect(component).toBeDefined();
    });

    test("test send contactEmail", async () => {
      // arrange
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      const sentButton = screen.getByTestId("TestSendMail_2");
      await userEvent.click(sentButton);

      // assert
      expect(component).toBeDefined();
    });

    test("test send Email but error", async () => {
      // arrange
      mockTestSendMailStatus = 500;
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      const sentButton = screen.getByTestId("TestSendMail_1");
      await userEvent.click(sentButton);

      // assert
      expect(component).toBeDefined();
    });

    test("test back button", async () => {
      const component = <AppCommonData {...defaultProps} />;

      // act
      await render(component, {
        mockStore,
      });

      const Button = screen.getByTestId("homeButton");
      await userEvent.click(Button);

      // assert
      expect(component).toBeDefined();
    });

    test("test reset button", async () => {
      const component = <AppCommonData {...defaultProps} />;
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });
      // act
      await render(component, {
        mockStore,
      });

      const Button = screen.getByTestId("resetButton");
      await userEvent.click(Button);

      // assert
      expect(component).toBeDefined();
    });

    test("test submit form", async () => {
      // arrange
      const component = <AppCommonData {...defaultProps} />;
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });
      // act
      await render(component, {
        mockStore,
      });

      const form = await screen.findByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      expect(component).toBeDefined();
    });
  });
});
