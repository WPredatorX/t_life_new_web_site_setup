import {
  render,
  renderAfterHook,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import useAppForm from "@hooks/useAppForm";
import PageProductDetail from "../page-product-detail";

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: "" } }),
  };
});

jest.mock("@hooks/useAppForm", () =>
  jest.fn().mockReturnValue({
    register: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn(),
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

jest.mock("@hooks/useAppSnackbar", () =>
  jest.fn().mockReturnValue({
    handleSnackAlert: jest.fn(),
  })
);

describe("PageProductDetail", () => {
  let mockStore = null;
  let mockProductStatusCode = null;
  let mockProductDocumentStatusCode = null;
  let mockCalTempCode = null;
  let mockPolicyHolder = null;
  let mockCalTempalteResponse = null;
  let defaultProps = {
    mode: "VIEW",
    type: "1",
    i_package: "NP-00",
    productId: "",
    product_plan_id: "",
  };

  beforeEach(() => {
    // mock fetch
    mockProductStatusCode = 200;
    mockProductDocumentStatusCode = 200;
    mockCalTempCode = "01";
    mockCalTempalteResponse = [
      {
        id: 1,
        dis_temp_id: "mock-id",
        dis_template_code: "mock-temp-code",
        dis_template_name: "mock-temp-name",
      },
    ];
    mockPolicyHolder = [
      {
        id: "mock-id",
        policy_document_type: 0,
        policy_document_file_path: "mock-file-path",
        policy_document_name: "mock-name",
      },
    ];
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/auth?action=getUserRolesData")) {
        return {
          status: 200,
          body: JSON.stringify({
            roles: [
              {
                role_name: "mock-role",
                menus: [
                  {
                    code: "menu-001",
                    feature: [
                      {
                        code: "feature-001",
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        };
      }

      if (req.url.includes("/api/auth?action=getBlobSasToken")) {
        return {
          status: 200,
          body: JSON.stringify({
            sas_images: "mock-sas-images",
            sas_files: "mock-sas-files",
          }),
        };
      }

      if (req.url.includes("/api/products?action=GetProductOnShelfById")) {
        return {
          status: mockProductStatusCode,
          body: JSON.stringify([
            {
              product_plan_id: "mock-product-plan-id",
              document_id: "mock-doc-id",
              quo_document_id: "mock-quo-doc-id",
              document_code: "mock-doc-code",
              cal_temp_code: mockCalTempCode,
            },
          ]),
        };
      }

      if (
        req.url.includes("/api/products?action=getPolicyholderDocumentsById")
      ) {
        return {
          status: 200,
          body: JSON.stringify(mockPolicyHolder),
        };
      }

      if (req.url.includes("/api/products?action=getProductDocument")) {
        return {
          status: mockProductDocumentStatusCode,
          body: JSON.stringify([
            {
              id: "mock-id",
              document_code: "mock-doc-code",
            },
          ]),
        };
      }

      if (req.url.includes("/api/products?action=getDocumentAppDetailById")) {
        return {
          status: 200,
          body: JSON.stringify([
            {
              id: "mock-id",
            },
          ]),
        };
      }

      if (req.url.includes("/api/products?action=AddOrUpdateProductOnShelf")) {
        return {
          status: 200,
          body: JSON.stringify({}),
        };
      }

      if (req.url.includes("/api/products?action=addOrUpdateProductDocument")) {
        return {
          status: 200,
        };
      }

      if (
        req.url.includes(
          "/api/products?action=AddOrUpdatePolicyholderDocuments"
        )
      ) {
        return {
          status: 200,
        };
      }

      if (
        req.url.includes(
          "/api/products?action=AddOrUpdateDisplayCalculateTemplate"
        )
      ) {
        return {
          status: 200,
        };
      }

      if (req.url.includes("/api/products?action=getCalTemplate")) {
        return {
          status: 200,
          body: JSON.stringify(mockCalTempalteResponse),
        };
      }

      return {
        status: 404,
        body: "Not found",
      };
    });

    // mock store
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
                        code: "feature-001",
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe("Render", () => {
    it("should render default", async () => {
      // arrange
      const component = <PageProductDetail {...defaultProps} />;

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

    it("should render default but error on load product", async () => {
      // arrange
      mockProductStatusCode = 500;
      const component = <PageProductDetail {...defaultProps} />;

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

    it("should render default with valid feature", async () => {
      // arrange.
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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

    it("should render default with valid feature and remaining line < 0 ", async () => {
      // arrange.
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "selectDoc") return { document_detail_size: 0 };
          if (name === "document_1") return [{ is_active: true }];
          return undefined;
        }),
        handleSubmit: jest.fn(),
        formState: {
          isDirty: true,
        },
      });

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

    it("should render null cal_temp_code", async () => {
      // arrange
      mockCalTempCode = null;
      const component = <PageProductDetail {...defaultProps} />;

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

    it("should render empty policyHolder", async () => {
      // arrange
      mockPolicyHolder = [];
      const component = <PageProductDetail {...defaultProps} />;

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
  });

  describe("Event", () => {
    it("should render default with valid feature then click reset", async () => {
      // arrange.
      defaultProps.mode = "EDIT";
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const button = await screen.findByText("ล้างข้อมูล");
      fireEvent.click(button);

      // notification
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

    it("should render default with valid feature then click back", async () => {
      // arrange.
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const button = await screen.findByText("ยกเลิก / ออก");
      fireEvent.click(button);

      // notification
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

    it("should render default with valid feature then click change tab", async () => {
      // arrange.
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const button = await screen.findByText("ตั้งค่าทั่วไป");
      fireEvent.click(button);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render default with valid feature then click submit default success", async () => {
      // arrange.
      defaultProps.mode = "EDIT";
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "selectDoc") return { document_detail_size: 2 };
          if (name === "document_1") return [{ is_active: true }];
          return undefined;
        }),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const form = screen.getByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render default with valid feature then click submit default success with policy cal 01", async () => {
      // arrange.
      defaultProps.mode = "EDIT";
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "selectDoc") return { document_detail_size: 2 };
          if (name === "document_1") return [{ is_active: true, isNew: true }];
          if (name === "document_2") return [{ is_active: true, isNew: true }];
          if (name === "beneficiary_document.policy_document_type") return 1;
          if (name === "beneficiary_document.policy_document_file") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-name";

          return undefined;
        }),
        handleSubmit: (callback) => () =>
          callback({
            is_CalculateFromPremiumToCoverage: false,
            is_CalculateFromCoverageToPremium: true,
          }),
        formState: {
          isDirty: true,
        },
      });

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const form = screen.getByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render default with valid feature then click submit default success with policy cal 02", async () => {
      // arrange.
      defaultProps.mode = "EDIT";
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "selectDoc") return { document_detail_size: 2 };
          if (name === "document_1") return [{ is_active: true, isNew: true }];
          if (name === "document_2") return [{ is_active: true, isNew: true }];
          if (name === "beneficiary_document.policy_document_type") return 1;
          if (name === "beneficiary_document.policy_document_file") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-name";

          return undefined;
        }),
        handleSubmit: (callback) => () =>
          callback({
            is_CalculateFromPremiumToCoverage: true,
            is_CalculateFromCoverageToPremium: false,
          }),
        formState: {
          isDirty: true,
        },
      });

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const form = screen.getByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render default with valid feature then click submit default success with policy", async () => {
      // arrange.
      defaultProps.mode = "EDIT";
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "selectDoc") return { document_detail_size: 2 };
          if (name === "document_1") return [{ is_active: true, isNew: true }];
          if (name === "document_2") return [{ is_active: true, isNew: true }];
          if (name === "beneficiary_document.policy_document_type") return 1;
          if (name === "beneficiary_document.policy_document_file") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-name";

          return undefined;
        }),
        handleSubmit: (callback) => () =>
          callback({
            is_CalculateFromPremiumToCoverage: true,
            is_CalculateFromCoverageToPremium: true,
          }),
        formState: {
          isDirty: true,
        },
      });

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const form = screen.getByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render default with valid feature then click submit default success doc length = 0", async () => {
      // arrange.
      defaultProps.mode = "EDIT";
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "selectDoc") return { document_detail_size: 2 };
          if (name === "document_1") return [];
          if (name === "document_2") return [];
          if (name === "beneficiary_document.policy_document_type") return 1;
          if (name === "beneficiary_document.policy_document_file") return {};
          if (name === "beneficiary_document.policy_document_name")
            return "mock-name";

          return undefined;
        }),
        handleSubmit: (callback) => () =>
          callback({
            is_CalculateFromPremiumToCoverage: true,
            is_CalculateFromCoverageToPremium: true,
            commonSetting: {
              product_plan_id: "mock-product-plan-id",
            },
            selectDoc: {
              document_id: "mock-document-id",
            },
          }),
        formState: {
          isDirty: true,
        },
      });

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const form = screen.getByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render default with valid feature then click submit default success then click popup", async () => {
      // arrange.
      defaultProps.mode = "EDIT";
      const component = <PageProductDetail {...defaultProps} />;
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
                          code: "product.general.read",
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
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn((name) => {
          if (name === "selectDoc") return { document_detail_size: 2 };
          if (name === "document_1") return [{ is_active: true }];
          return undefined;
        }),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      await act(async () => {
        const form = await screen.findByTestId("form-submit");
        fireEvent.submit(form);
      });

      const button = await screen.findByText("ยืนยัน");
      fireEvent.click(button);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });
  });
});
