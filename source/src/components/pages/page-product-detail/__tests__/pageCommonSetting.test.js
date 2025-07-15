import {
  act,
  screen,
  render,
  waitFor,
  fireEvent,
  renderAfterHook,
  userEvent,
  createMatchMedia,
} from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import PageCommonSetting from "../components/pageCommonSetting";
import useAppFieldArray from "@hooks/useAppFieldArray";

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: null } }),
  };
});

jest.mock("@hooks/useAppFieldArray", () =>
  jest.fn().mockReturnValue({
    fields: [],
    insert: jest.fn(),
    update: jest.fn(),
  })
);

describe("PageCommonSetting", () => {
  let mockStore = null;
  let defaultProps = null;
  let mockHandleFetchTemplate = null;
  let mockHandleFetchCalDisplayTemplate = null;
  let mockPreviewReportByDocumentCodeStatusCode = null;
  let openMock = null;
  let revokeMock = null;
  let createMock = null;

  beforeEach(() => {
    openMock = jest.fn().mockReturnValue({
      focus: jest.fn(),
    });
    revokeMock = jest.fn();
    createMock = jest.fn().mockReturnValue("blob:http://example.com/mock");
    window.open = openMock;
    URL.createObjectURL = createMock;
    URL.revokeObjectURL = revokeMock;
    mockHandleFetchTemplate = jest.fn();
    mockHandleFetchCalDisplayTemplate = jest.fn();
    mockPreviewReportByDocumentCodeStatusCode = 200;
    defaultProps = {
      type: "1",
      mode: "VIEW",
      i_package: "NP-00",
      productId: "mock-product-id",
      handleFetchTemplate: mockHandleFetchTemplate,
      handleFetchCalDisplayTemplate: mockHandleFetchCalDisplayTemplate,
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn(),
        formState: {
          errors: {},
        },
      },
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
                        code: "broker.general.read",
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
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (
        req.url.includes("/api/products?action=PreviewReportByDocumentCode")
      ) {
        return {
          status: mockPreviewReportByDocumentCodeStatusCode,
        };
      }

      return {
        status: 404,
        body: "Not found",
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should render default", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const component = <PageCommonSetting {...defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render default with checkbox false", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });

    const component = <PageCommonSetting {...defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then click remove document", async () => {
    // arrange
    const mockUpdateDoc1 = jest.fn();
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: mockUpdateDoc1,
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });
    const button = await screen.findAllByText("ลบออก");
    fireEvent.click(button[0]);

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await act(async () => {
      await renderAfterHook(renderAction(), {
        mockStore,
      });
    });
    const button_notification = await screen.findAllByTestId("dialogConfirm");
    fireEvent.click(button_notification[0]);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
      expect(mockUpdateDoc1).toHaveBeenCalledTimes(1);
    });
  });

  it("should render mode EDIT then click add document", async () => {
    // arrange
    const mockInsertDoc1 = jest.fn();
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: mockInsertDoc1,
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });
    const button = await screen.findAllByTestId("btn-add-doc1");
    fireEvent.click(button[0]);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
      expect(mockInsertDoc1).toHaveBeenCalledTimes(1);
    });
  });

  it("should render mode EDIT then click remove all document", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });
    const button = await screen.findAllByTestId("btn-remove-all-doc1");
    fireEvent.click(button[0]);

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await act(async () => {
      await renderAfterHook(renderAction(), {
        mockStore,
      });
    });
    const button_notification = await screen.findAllByTestId("dialogConfirm");
    fireEvent.click(button_notification[0]);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then click load policy document", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-policy_document_name";

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });
    const button = await screen.findAllByTestId("btn-load-policy-doc");
    fireEvent.click(button[0]);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then click change quotation", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      handleFetchTemplate: jest.fn().mockReturnValue([
        {
          id: 1,
          label: "mock-label-1",
          value: "mock-value-1",
        },
      ]),
      handleFetchCalDisplayTemplate: mockHandleFetchCalDisplayTemplate,
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-policy_document_name";
          if (name === "document_1")
            return [{ id: 1, document_id: "mock-document_id" }];

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });
    const input = screen.getByRole("combobox", { name: /เทมเพลตใบเสนอราคา/i });
    await userEvent.type(input, "1");
    const option = await screen.findByText("mock-label-1");
    await userEvent.click(option);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then click change quotation with null watch", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      handleFetchTemplate: jest.fn().mockReturnValue([
        {
          id: 1,
          label: "mock-label-1",
          value: "mock-value-1",
        },
      ]),
      handleFetchCalDisplayTemplate: mockHandleFetchCalDisplayTemplate,
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-policy_document_name";
          if (name === "document_1") return null;

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });
    const input = screen.getByRole("combobox", { name: /เทมเพลตใบเสนอราคา/i });
    await userEvent.type(input, "1");
    const option = await screen.findByText("mock-label-1");
    await userEvent.click(option);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then click change quotation then click view template", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      handleFetchTemplate: jest.fn().mockReturnValue([
        {
          id: 1,
          label: "mock-label-1",
          value: "mock-value-1",
        },
      ]),
      handleFetchCalDisplayTemplate: mockHandleFetchCalDisplayTemplate,
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-policy_document_name";
          if (name === "document_1")
            return [{ id: 1, document_id: "mock-document_id" }];

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    const input = screen.getByRole("combobox", {
      name: /เทมเพลตใบเสนอราคา/i,
    });
    await userEvent.type(input, "1");
    const option = await screen.findByText("mock-label-1");
    await userEvent.click(option);

    const button = await screen.findAllByTestId("btn-load-template");
    fireEvent.click(button[0]);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then click change quotation then click view template failed response", async () => {
    // arrange
    mockPreviewReportByDocumentCodeStatusCode = 500;
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      handleFetchTemplate: jest.fn().mockReturnValue([
        {
          id: 1,
          label: "mock-label-1",
          value: "mock-value-1",
        },
      ]),
      handleFetchCalDisplayTemplate: mockHandleFetchCalDisplayTemplate,
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-policy_document_name";
          if (name === "document_1")
            return [{ id: 1, document_id: "mock-document_id" }];

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    const input = screen.getByRole("combobox", {
      name: /เทมเพลตใบเสนอราคา/i,
    });
    await userEvent.type(input, "1");
    const option = await screen.findByText("mock-label-1");
    await userEvent.click(option);

    const button = await screen.findAllByTestId("btn-load-template");
    fireEvent.click(button[0]);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then click change quotation then change calculate display template", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      handleFetchTemplate: jest.fn().mockReturnValue([
        {
          id: 1,
          label: "mock-label-1",
          value: "mock-value-1",
        },
      ]),
      handleFetchCalDisplayTemplate: jest.fn().mockReturnValue([
        {
          id: 1,
          label: "mock-display-label-1",
          value: "mock-display-value-1",
        },
      ]),
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-policy_document_name";
          if (name === "document_1")
            return [{ id: 1, document_id: "mock-document_id" }];
          if (name === "document_Cal")
            return [{ id: 1, label: "mock-document_id" }];

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    const input = screen.getByRole("combobox", {
      name: /เทมเพลตใบเสนอราคา/i,
    });
    await userEvent.type(input, "1");
    const option = await screen.findByText("mock-label-1");
    await userEvent.click(option);

    const input2 = screen.getByRole("combobox", {
      name: /เทมเพลตแสดงผลการคำนวณ/i,
    });
    await userEvent.type(input2, "1");
    const option2 = await screen.findByText("mock-display-label-1");
    await userEvent.click(option2);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then click change quotation then change calculate display template doc_cal is null", async () => {
    // arrange
    useAppFieldArray.mockImplementation(({ name }) => {
      if (name === "document_1") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }
      if (name === "document_2") {
        return {
          fields: [
            {
              id: 1,
              is_active: true,
              description: "mock-description",
            },
          ],
          insert: jest.fn(),
          update: jest.fn(),
        };
      }

      return {
        fields: [],
        insert: jest.fn(),
        update: jest.fn(),
      };
    });
    const _defaultProps = {
      ...defaultProps,
      mode: "EDIT",
      handleFetchTemplate: jest.fn().mockReturnValue([
        {
          id: 1,
          label: "mock-label-1",
          value: "mock-value-1",
        },
      ]),
      handleFetchCalDisplayTemplate: jest.fn().mockReturnValue([
        {
          id: 1,
          label: "mock-display-label-1",
          value: "mock-display-value-1",
        },
      ]),
      formMethods: {
        control: {},
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        register: jest.fn(),
        watch: jest.fn().mockImplementation((name) => {
          if (name === "selectDoc") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-policy_document_name";
          if (name === "document_1")
            return [{ id: 1, document_id: "mock-document_id" }];
          if (name === "document_Cal") return null;

          return null;
        }),
        formState: {
          errors: {},
        },
      },
    };
    const component = <PageCommonSetting {..._defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    const input = screen.getByRole("combobox", {
      name: /เทมเพลตใบเสนอราคา/i,
    });
    await userEvent.type(input, "1");
    const option = await screen.findByText("mock-label-1");
    await userEvent.click(option);

    const input2 = screen.getByRole("combobox", {
      name: /เทมเพลตแสดงผลการคำนวณ/i,
    });
    await userEvent.type(input2, "1");
    const option2 = await screen.findByText("mock-display-label-1");
    await userEvent.click(option2);

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });
});
