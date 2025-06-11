import { render, screen, fireEvent, act, waitFor } from "@utilities/jest";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
import { PageProductSale } from "@components";
import useAppForm from "@hooks/useAppForm";

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
    register: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn((name) => {
      if (name === "displayVersion") return [];
      if (name === "displayVersionDetail") return {};
      if (name === "isplayVersionDetail.brochureFile") return {};
      if (name === "displayVersionDetail.brochureFileName")
        return "mock-file-name";
      if (name === "displayVersionDetail.brochureFileUrl")
        return "mock-file-url";
      if (name === "displayVersionTemp") return [];
      if (name === "saleRange") return [];
      if (name === "saleRangeTemp") return [];
      if (name === "salePaidType") return [];
      if (name === "salePaidTypeTemp") return [];
      if (name === "salePaidCategory") return [];
      if (name === "salePaidCategoryTemp") return [];
      if (name === "salePrepayment") return [];
      if (name === "salePrepaymentTemp") return [];
      if (name === "saleTemplate") return [];
      if (name === "saleTemplateTemp") return [];
      if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
      if (name === "displayVersionDetail.cardImageUrlPreview") return "";
      if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

      return {};
    }),
    handleSubmit: jest.fn(),
    formState: {
      isDirty: false,
      errors: {},
      dirtyFields: {
        saleRangeTemp: false,
      },
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

describe("page-product-sale", () => {
  let mockStore = null;
  let defaultProps = {};
  let mockAddOrUpdateProductPlanByChannelStatus = null;
  let mockProductRecordApproveStatus = null;

  beforeEach(() => {
    mockAddOrUpdateProductPlanByChannelStatus = 200;
    mockProductRecordApproveStatus = 200;
    defaultProps = {
      mode: "VIEW",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
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
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct?action=GetDirectGeneralInfo")) {
        return {
          status: 200,
          body: JSON.stringify([{}]),
        };
      }

      if (
        req.url.includes(
          "/api/direct/productSale/profile?action=PreviewBrochure"
        )
      ) {
        return {
          status: 200,
          body: JSON.stringify([{}]),
        };
      }

      if (
        req.url.includes("/api/direct?action=AddOrUpdateProductPlanByChannel")
      ) {
        return {
          status: mockAddOrUpdateProductPlanByChannelStatus,
        };
      }

      if (req.url.includes("/api/direct?action=ProductRecordApprove")) {
        return {
          status: mockProductRecordApproveStatus,
        };
      }

      return {
        status: 404,
        body: "Not found",
      };
    });
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {};
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: false,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
  });

  afterEach(() => {
    useAppForm.mockReset();
    fetchMock.resetMocks();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should render default", async () => {
    // arrange
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode EDIT", async () => {
    // arrange
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode EDIT then save draft", async () => {
    // arrange
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRangeTemp: [],
          salePaidTypeTemp: [],
          salePaidCategoryTemp: [],
          salePrepaymentTemp: [],
          saleTemplateTemp: [],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    const button = await screen.findByText("บันทึกแบบร่าง");
    fireEvent.click(button);

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode EDIT then save draft with new data", async () => {
    // arrange
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("บันทึกแบบร่าง");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByText("ตกลง");
      fireEvent.click(button[0]);
    });

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then save draft with old data", async () => {
    // arrange
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRangeTemp: [
            {
              is_new: false,
              sale_period_id: "mock-sale_period_id",
              active_status: 3,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: false,
              product_payment_mode_id: "mock-product_payment_mode_id",
              active_status: 3,
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: false,
              product_payment_id: "mock-product_payment_id",
              active_status: 3,
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: false,
              installment_id: "mock-installment_id",
              active_status: 3,
            },
          ],
          saleTemplateTemp: [
            {
              is_new: false,
              product_app_temp_id: "mock-product_app_temp_id",
              active_status: 3,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("บันทึกแบบร่าง");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByText("ตกลง");
      fireEvent.click(button[0]);
    });

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render mode EDIT then save draft with new data and throw error", async () => {
    // arrange
    mockAddOrUpdateProductPlanByChannelStatus = 500;
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("บันทึกแบบร่าง");
      fireEvent.click(button);
    });

    // assert
    await waitFor(() => {
      expect(component).toBeDefined();
    });
  });

  it("should render default invalid feature", async () => {
    // arrange
    const component = <PageProductSale {...defaultProps} />;
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

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click tab display mode VIEW", async () => {
    // arrange
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });
    const button = await screen.findByText("ข้อมูลการแสดงผล");
    fireEvent.click(button);

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click tab display mode DROP", async () => {
    // arrange
    defaultProps = {
      mode: "DROP",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });
    const button = await screen.findByText("ข้อมูลการแสดงผล");
    fireEvent.click(button);

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click tab display mode GENERAL_APPROVE", async () => {
    // arrange
    defaultProps = {
      mode: "GENERAL_APPROVE",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });
    const button = await screen.findByText("ข้อมูลการแสดงผล");
    fireEvent.click(button);

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click back", async () => {
    // arrange
    jest.useFakeTimers();
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("ยกเลิก / ออก");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });
    jest.advanceTimersByTime(1000);

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click back broker mode", async () => {
    // arrange
    jest.useFakeTimers();
    defaultProps = {
      mode: "VIEW",
      type: "1",
      channel: "608",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("ยกเลิก / ออก");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });
    jest.advanceTimersByTime(1000);

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode EDIT then request for approve", async () => {
    // arrange
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("ขออนุมัติ");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    const currentState2 = mockStore.getState();
    const renderAction2 = currentState2.global.dialog.renderAction;
    await render(renderAction2, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByText("ตกลง");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode EDIT then request for approve then silent save error", async () => {
    // arrange
    mockAddOrUpdateProductPlanByChannelStatus = 500;
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("ขออนุมัติ");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode EDIT then request for approve error", async () => {
    // arrange
    mockProductRecordApproveStatus = 500;
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("ขออนุมัติ");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode GENERAL_APPROVE then click approve", async () => {
    // arrange
    defaultProps = {
      mode: "GENERAL_APPROVE",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
        product_status: "2",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRange: [
            {
              active_status: "1",
            },
          ],
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidType: [
            {
              active_status: "1",
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategory: [
            {
              active_status: "1",
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepayment: [
            {
              active_status: "1",
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplate: [
            {
              active_status: "1",
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("อนุมัติ");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    const currentState2 = mockStore.getState();
    const renderAction2 = currentState2.global.dialog.renderAction;
    await render(renderAction2, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByText("ตกลง");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode GENERAL_APPROVE then click approve delete table block", async () => {
    // arrange
    defaultProps = {
      mode: "GENERAL_APPROVE",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
        product_status: "2",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRange: [
            {
              active_status: "3",
              is_active: false,
            },
          ],
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidType: [
            {
              active_status: "3",
              is_active: false,
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategory: [
            {
              active_status: "3",
              is_active: false,
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepayment: [
            {
              active_status: "3",
              is_active: false,
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplate: [
            {
              active_status: "3",
              is_active: false,
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("อนุมัติ");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    const currentState2 = mockStore.getState();
    const renderAction2 = currentState2.global.dialog.renderAction;
    await render(renderAction2, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByText("ตกลง");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode GENERAL_APPROVE then click approve then update plan error", async () => {
    // arrange
    mockAddOrUpdateProductPlanByChannelStatus = 500;
    defaultProps = {
      mode: "GENERAL_APPROVE",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
        product_status: "2",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRange: [
            {
              active_status: "1",
            },
          ],
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidType: [
            {
              active_status: "1",
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategory: [
            {
              active_status: "1",
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepayment: [
            {
              active_status: "1",
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplate: [
            {
              active_status: "1",
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("อนุมัติ");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode GENERAL_APPROVE then click approve then email plan error", async () => {
    // arrange
    mockProductRecordApproveStatus = 500;
    defaultProps = {
      mode: "GENERAL_APPROVE",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
        product_status: "2",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRange: [
            {
              active_status: "1",
            },
          ],
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidType: [
            {
              active_status: "1",
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategory: [
            {
              active_status: "1",
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepayment: [
            {
              active_status: "1",
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplate: [
            {
              active_status: "1",
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("อนุมัติ");
      fireEvent.click(button);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;
    await render(renderAction, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode GENERAL_APPROVE then click reject then cancel", async () => {
    // arrange
    defaultProps = {
      mode: "GENERAL_APPROVE",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
        product_status: "2",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRange: [
            {
              active_status: "1",
            },
          ],
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidType: [
            {
              active_status: "1",
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategory: [
            {
              active_status: "1",
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepayment: [
            {
              active_status: "1",
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplate: [
            {
              active_status: "1",
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    await act(async () => {
      const button = await screen.findByText("ไม่อนุมัติ");
      fireEvent.click(button);
    });

    await act(async () => {
      const currentState = mockStore.getState();
      const renderAction = currentState.global.dialog.renderAction;
      await render(renderAction, {
        mockStore,
      });
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    await act(async () => {
      const button = await screen.findAllByTestId("btn-cancle");
      fireEvent.click(button[0]);
    });

    await act(async () => {
      const currentState = mockStore.getState();
      const renderAction = currentState.global.dialog.renderAction;
      await render(renderAction, {
        mockStore,
      });
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render mode GENERAL_APPROVE then click reject then confirm", async () => {
    // arrange
    defaultProps = {
      mode: "GENERAL_APPROVE",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
        product_status: "2",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion") return [];
        if (name === "displayVersionDetail") return {};
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {
          saleRange: [
            {
              active_status: "1",
            },
          ],
          saleRangeTemp: [
            {
              is_new: true,
              active_status: 1,
              sale_start_date: new Date(),
              sale_end_date: new Date(),
            },
          ],
          salePaidType: [
            {
              active_status: "1",
            },
          ],
          salePaidTypeTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePaidCategory: [
            {
              active_status: "1",
            },
          ],
          salePaidCategoryTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          salePrepayment: [
            {
              active_status: "1",
            },
          ],
          salePrepaymentTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
          saleTemplate: [
            {
              active_status: "1",
            },
          ],
          saleTemplateTemp: [
            {
              is_new: true,
              active_status: 1,
            },
          ],
        };
      }),
      handleSubmit: (callback) => () => callback({ reason: "mock-reason" }),
      formState: {
        isDirty: true,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    await act(async () => {
      const button = await screen.findByText("ไม่อนุมัติ");
      fireEvent.click(button);
    });

    await act(async () => {
      const currentState = mockStore.getState();
      const renderAction = currentState.global.dialog.renderAction;
      await render(renderAction, {
        mockStore,
      });
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    await act(async () => {
      const form = await screen.findByTestId("form-submit");
      fireEvent.submit(form);
    });

    await act(async () => {
      const currentState = mockStore.getState();
      const renderAction = currentState.global.dialog.renderAction;
      await render(renderAction, {
        mockStore,
      });
    });

    await act(async () => {
      const button = await screen.findAllByTestId("dialogConfirm");
      fireEvent.click(button[0]);
    });

    await act(async () => {
      const currentState = mockStore.getState();
      const renderAction = currentState.global.dialog.renderAction;
      await render(renderAction, {
        mockStore,
      });
    });

    await act(async () => {
      const button = await screen.findAllByText("ตกลง");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click tab display mode EDIT then click view version", async () => {
    // arrange
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion")
          return [
            {
              is_new: false,
              id: "mock-id-1",
              product_sale_card_id: "mock-id-1",
              version_name: "mock-version_name-1",
              sale_card_status: "1",
              sale_card_status_name: "mock-sale_card_status_name-1",
              create_by: "mock-create_by",
              create_date: "2025-01-01T00:00:00",
              update_by: "mock-update_by",
              update_date: "2025-01-01T00:00:00",
            },
            {
              is_new: true,
              id: "mock-id-2",
              product_sale_card_id: "mock-id-2",
              version_name: "mock-version_name-2",
              sale_card_status: "1",
              sale_card_status_name: "mock-sale_card_status_name-2",
              create_by: "mock-create_by",
              create_date: null,
              update_by: "mock-update_by",
              update_date: null,
            },
          ];
        if (name === "displayVersionDetail")
          return {
            _temp: {
              sale_card_status: "1",
            },
          };
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {};
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: false,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    await act(async () => {
      const button = await screen.findByText("ข้อมูลการแสดงผล");
      fireEvent.click(button);
    });

    await act(async () => {
      const button = await screen.findAllByTestId("RemoveRedEyeIcon");
      fireEvent.click(button[0]);
    });

    screen.debug(undefined, 1000000);

    // assert
    expect(component).toBeDefined();
  });

  it("should render default then click tab display mode EDIT then click edit version", async () => {
    // arrange
    defaultProps = {
      mode: "EDIT",
      type: "1",
      channel: "606",
      productPlanId: "mock-plan-id",
      saleChannelId: "mock-sale-channel-id",
      productCondition: {
        i_plan: "mock-plan",
      },
    };
    useAppForm.mockReturnValue({
      register: jest.fn(),
      reset: jest.fn(),
      watch: jest.fn((name) => {
        if (name === "displayVersion")
          return [
            {
              is_new: false,
              id: "mock-id-1",
              product_sale_card_id: "mock-id-1",
              version_name: "mock-version_name-1",
              sale_card_status: "1",
              sale_card_status_name: "mock-sale_card_status_name-1",
              create_by: "mock-create_by",
              create_date: "2025-01-01T00:00:00",
              update_by: "mock-update_by",
              update_date: "2025-01-01T00:00:00",
            },
            {
              is_new: true,
              id: "mock-id-2",
              product_sale_card_id: "mock-id-2",
              version_name: "mock-version_name-2",
              sale_card_status: "1",
              sale_card_status_name: "mock-sale_card_status_name-2",
              create_by: "mock-create_by",
              create_date: null,
              update_by: "mock-update_by",
              update_date: null,
            },
          ];
        if (name === "displayVersionDetail")
          return {
            _temp: {
              sale_card_status: "1",
            },
          };
        if (name === "isplayVersionDetail.brochureFile") return {};
        if (name === "displayVersionDetail.brochureFileName")
          return "mock-file-name";
        if (name === "displayVersionDetail.brochureFileUrl")
          return "mock-file-url";
        if (name === "displayVersionTemp") return [];
        if (name === "saleRange") return [];
        if (name === "saleRangeTemp") return [];
        if (name === "salePaidType") return [];
        if (name === "salePaidTypeTemp") return [];
        if (name === "salePaidCategory") return [];
        if (name === "salePaidCategoryTemp") return [];
        if (name === "salePrepayment") return [];
        if (name === "salePrepaymentTemp") return [];
        if (name === "saleTemplate") return [];
        if (name === "saleTemplateTemp") return [];
        if (name === "displayVersionDetail.bannerImageUrlPreview") return "";
        if (name === "displayVersionDetail.cardImageUrlPreview") return "";
        if (name === "displayVersionDetail.benefitImageUrlPreview") return "";

        return {};
      }),
      handleSubmit: jest.fn(),
      formState: {
        isDirty: false,
        errors: {},
        dirtyFields: {
          saleRangeTemp: false,
        },
      },
      control: {},
      setValue: jest.fn(),
    });
    const component = <PageProductSale {...defaultProps} />;

    // act
    await act(async () => {
      await render(component, {
        mockStore,
      });
    });

    await act(async () => {
      const button = await screen.findByText("ข้อมูลการแสดงผล");
      fireEvent.click(button);
    });

    await act(async () => {
      const button = await screen.findAllByTestId("EditIcon");
      fireEvent.click(button[0]);
    });

    // assert
    expect(component).toBeDefined();
  });
});
