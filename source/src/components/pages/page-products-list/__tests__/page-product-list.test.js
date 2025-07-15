import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  userEvent,
} from "@utilities/jest";
import { PageProductsList } from "@/components";
import { APPLICATION_DEFAULT, APPLICATION_RECORD_STATUS } from "@constants";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
import { configureStore } from "@reduxjs/toolkit";
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
      if (name === "name") return null;
      if (name === "status")
        return {
          value: 0,
        };
      if (name === "create_date_start") return new Date();
      if (name === "create_date_end") return new Date();
      if (name === "update_date_start") return new Date();
      if (name === "update_date_end") return new Date();
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
    clearErrors: jest.fn(),
  })
);

jest.mock("@hooks/useAppSnackbar", () =>
  jest.fn().mockReturnValue({
    handleSnackAlert: jest.fn(),
  })
);

describe("PageProductList", () => {
  let mockStore = null;
  let mockGetProductStatusCode = null;
  let mockGetProductResponse = null;

  beforeEach(() => {
    mockGetProductStatusCode = 200;
    mockGetProductResponse = {};
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/products?action=getProducts")) {
        return {
          status: mockGetProductStatusCode,
          body: JSON.stringify(mockGetProductResponse),
        };
      }
    });
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
                      {
                        code: "product.setting.read",
                      },
                      {
                        code: "product.general.write",
                      },
                      {
                        code: "product.setting.write",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          activator: "mock-activator",
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
      const component = <PageProductsList />;

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

    it("should render default with response", async () => {
      // arrange
      mockGetProductStatusCode = 200;
      mockGetProductResponse = {
        total_records: 2,
        page_size: 1,
        current_page: 0,
        total_pages: 1,
        previous_page: "no",
        next_page: "no",
        products: [
          {
            i_package: "NP-00",
            plan_code: "10-01-05",
            product_name: "ชั่วระยะเวลา 5 ปี",
            c_plan: "10-01-05",
            promise_type: "ขายแบบเดี่ยว",
            is_active: true,
            active_status: "เปิดใช้งาน",
            create_by: "Peeranut.Anu",
            create_date: "2025-06-13T03:22:40.31",
            update_by: "Peeranut.Anu",
            update_date: "2025-06-13T03:49:42.483",
            product_plan_id: "43b03caa-bd38-4298-80b5-2bed15f72931",
            broker_list: null,
          },
          {
            i_package: "NP-01",
            plan_code: "10-01-10",
            product_name: "ชั่วระยะเวลา 10 ปี",
            c_plan: "10-01-10",
            promise_type: "ขายแบบกลุ่ม",
            is_active: null,
            active_status: "แบบร่าง",
            create_by: null,
            create_date: null,
            update_by: null,
            update_date: null,
            product_plan_id: null,
            broker_list: null,
          },
        ],
      };
      const component = <PageProductsList />;

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

    it("should render default with all status", async () => {
      // arrange
      mockGetProductStatusCode = 200;
      mockGetProductResponse = {
        total_records: 2,
        page_size: 1,
        current_page: 0,
        total_pages: 1,
        previous_page: "no",
        next_page: "no",
        products: [
          {
            i_package: "NP-00",
            plan_code: "10-01-05",
            product_name: "ชั่วระยะเวลา 5 ปี",
            c_plan: "10-01-05",
            promise_type: "ขายแบบเดี่ยว",
            is_active: true,
            active_status: "เปิดใช้งาน",
            create_by: "Peeranut.Anu",
            create_date: "2025-06-13T03:22:40.31",
            update_by: "Peeranut.Anu",
            update_date: "2025-06-13T03:49:42.483",
            product_plan_id: "43b03caa-bd38-4298-80b5-2bed15f72931",
            broker_list: null,
          },
          {
            i_package: "NP-01",
            plan_code: "10-01-10",
            product_name: "ชั่วระยะเวลา 10 ปี",
            c_plan: "10-01-10",
            promise_type: "ขายแบบกลุ่ม",
            is_active: null,
            active_status: "แบบร่าง",
            create_by: null,
            create_date: null,
            update_by: null,
            update_date: null,
            product_plan_id: null,
            broker_list: null,
          },
          {
            i_package: "NP-00",
            plan_code: "10-01-05",
            product_name: "ชั่วระยะเวลา 5 ปี",
            c_plan: "10-01-05",
            promise_type: "ขายแบบเดี่ยว",
            is_active: true,
            active_status: "เปิดใช้งาน",
            create_by: "Peeranut.Anu",
            create_date: "2025-06-13T03:22:40.31",
            update_by: "Peeranut.Anu",
            update_date: "2025-06-13T03:49:42.483",
            product_plan_id: "43b03caa-bd38-4298-80b5-2bed15f72931",
            broker_list: null,
          },
          {
            i_package: "NP-01",
            plan_code: "10-01-101",
            product_name: "ชั่วระยะเวลา 10 ปี",
            c_plan: "10-01-101",
            promise_type: "ขายแบบกลุ่ม",
            is_active: false,
            active_status: "ยกเลิกใช้งาน",
            create_by: null,
            create_date: null,
            update_by: null,
            update_date: null,
            product_plan_id: null,
            broker_list: null,
          },
          {
            i_package: "NP-01",
            plan_code: "10-01-102",
            product_name: "ชั่วระยะเวลา 10 ปี",
            c_plan: "10-01-102",
            promise_type: "ขายแบบกลุ่ม",
            is_active: false,
            active_status: "",
            create_by: null,
            create_date: null,
            update_by: null,
            update_date: null,
            product_plan_id: null,
            broker_list: null,
          },
        ],
      };
      const component = <PageProductsList />;

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

    it("should render default with error response", async () => {
      mockGetProductStatusCode = 500;
      mockGetProductResponse = [];
      // arrange
      const component = <PageProductsList />;

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
  describe("Action", () => {
    test("Change Status", async () => {
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const input = screen.getByRole("combobox", { name: /สถานะ/i });
      await userEvent.type(
        input,
        APPLICATION_RECORD_STATUS[0].label.slice(0, 2)
      );
      const option = await screen.findByText(
        APPLICATION_RECORD_STATUS[0].label
      );
      await userEvent.click(option);
      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Change Create date start and end", async () => {
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const currentDate = new Date();
      const dayOfMonth = currentDate.getDate();

      const create_date_start_picker = await screen.findByLabelText(
        "จากวันที่สร้าง"
      );
      await userEvent.click(create_date_start_picker);
      await userEvent.click(screen.getByText(`${dayOfMonth}`));

      const create_date_end_picker = await screen.findByLabelText(
        "ถึงวันที่สร้าง"
      );
      await userEvent.click(create_date_end_picker);
      await userEvent.click(screen.getByText(`${dayOfMonth}`));

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Change Update date start and end", async () => {
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const currentDate = new Date();
      const dayOfMonth = currentDate.getDate();

      const update_date_start_picker = await screen.findByLabelText(
        "จากวันที่แก้ไข"
      );
      await userEvent.click(update_date_start_picker);
      await userEvent.click(screen.getByText(`${dayOfMonth}`));

      const update_date_end_picker = await screen.findByLabelText(
        "ถึงวันที่แก้ไข"
      );
      await userEvent.click(update_date_end_picker);
      await userEvent.click(screen.getByText(`${dayOfMonth}`));

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Click change Search", async () => {
      mockGetProductStatusCode = 200;
      mockGetProductResponse = {
        total_records: 2,
        page_size: 1,
        current_page: 0,
        total_pages: 1,
        previous_page: "no",
        next_page: "no",
        products: [
          {
            i_package: "NP-00",
            plan_code: "10-01-05",
            product_name: "ชั่วระยะเวลา 5 ปี",
            c_plan: "10-01-05",
            promise_type: "ขายแบบเดี่ยว",
            is_active: true,
            active_status: "เปิดใช้งาน",
            create_by: "Peeranut.Anu",
            create_date: "2025-06-13T03:22:40.31",
            update_by: "Peeranut.Anu",
            update_date: "2025-06-13T03:49:42.483",
            product_plan_id: "43b03caa-bd38-4298-80b5-2bed15f72931",
            broker_list: null,
          },
          {
            i_package: "NP-01",
            plan_code: "10-01-10",
            product_name: "ชั่วระยะเวลา 10 ปี",
            c_plan: "10-01-10",
            promise_type: "ขายแบบกลุ่ม",
            is_active: null,
            active_status: "แบบร่าง",
            create_by: null,
            create_date: null,
            update_by: null,
            update_date: null,
            product_plan_id: null,
            broker_list: null,
          },
        ],
      };
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const button = await screen.findByText("ค้นหา");
      fireEvent.click(button);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Click change Search But return error", async () => {
      mockGetProductStatusCode = 500;
      mockGetProductResponse = {};
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const button = await screen.findByText("ค้นหา");
      fireEvent.click(button);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Click reset", async () => {
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const resetButton = await screen.findByText("ล้างค่า");
      await userEvent.click(resetButton);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Click change page", async () => {
      mockGetProductStatusCode = 200;
      mockGetProductResponse = {
        total_records: 2,
        page_size: 1,
        current_page: 0,
        total_pages: 1,
        previous_page: "no",
        next_page: "no",
        products: [
          {
            i_package: "NP-00",
            plan_code: "10-01-05",
            product_name: "ชั่วระยะเวลา 5 ปี",
            c_plan: "10-01-05",
            promise_type: "ขายแบบเดี่ยว",
            is_active: true,
            active_status: "เปิดใช้งาน",
            create_by: "Peeranut.Anu",
            create_date: "2025-06-13T03:22:40.31",
            update_by: "Peeranut.Anu",
            update_date: "2025-06-13T03:49:42.483",
            product_plan_id: "43b03caa-bd38-4298-80b5-2bed15f72931",
            broker_list: null,
          },
          {
            i_package: "NP-01",
            plan_code: "10-01-10",
            product_name: "ชั่วระยะเวลา 10 ปี",
            c_plan: "10-01-10",
            promise_type: "ขายแบบกลุ่ม",
            is_active: null,
            active_status: "แบบร่าง",
            create_by: null,
            create_date: null,
            update_by: null,
            update_date: null,
            product_plan_id: null,
            broker_list: null,
          },
        ],
      };
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const button = await screen.findByTestId("KeyboardArrowRightIcon");
      fireEvent.click(button);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Click change sort", async () => {
      mockGetProductStatusCode = 200;
      mockGetProductResponse = {
        total_records: 2,
        page_size: 1,
        current_page: 0,
        total_pages: 1,
        previous_page: "no",
        next_page: "no",
        products: [
          {
            i_package: "NP-00",
            plan_code: "10-01-05",
            product_name: "ชั่วระยะเวลา 5 ปี",
            c_plan: "10-01-05",
            promise_type: "ขายแบบเดี่ยว",
            is_active: true,
            active_status: "เปิดใช้งาน",
            create_by: "Peeranut.Anu",
            create_date: "2025-06-13T03:22:40.31",
            update_by: "Peeranut.Anu",
            update_date: "2025-06-13T03:49:42.483",
            product_plan_id: "43b03caa-bd38-4298-80b5-2bed15f72931",
            broker_list: null,
          },
          {
            i_package: "NP-01",
            plan_code: "10-01-10",
            product_name: "ชั่วระยะเวลา 10 ปี",
            c_plan: "10-01-10",
            promise_type: "ขายแบบกลุ่ม",
            is_active: null,
            active_status: "แบบร่าง",
            create_by: null,
            create_date: null,
            update_by: null,
            update_date: null,
            product_plan_id: null,
            broker_list: null,
          },
        ],
      };
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const button = await screen.findAllByTestId("ArrowUpwardIcon");
      fireEvent.click(button[0]);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Click view Product", async () => {
      mockGetProductStatusCode = 200;
      mockGetProductResponse = {
        total_records: 2,
        page_size: 1,
        current_page: 0,
        total_pages: 1,
        previous_page: "no",
        next_page: "no",
        products: [
          {
            i_package: "NP-00",
            plan_code: "10-01-05",
            product_name: "ชั่วระยะเวลา 5 ปี",
            c_plan: "10-01-05",
            promise_type: "ขายแบบเดี่ยว",
            is_active: true,
            active_status: "เปิดใช้งาน",
            create_by: "Peeranut.Anu",
            create_date: "2025-06-13T03:22:40.31",
            update_by: "Peeranut.Anu",
            update_date: "2025-06-13T03:49:42.483",
            product_plan_id: "43b03caa-bd38-4298-80b5-2bed15f72931",
            broker_list: null,
          },
        ],
      };
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const actionButton = await screen.findByTestId("MoreVertIcon");
      expect(actionButton).toBeInTheDocument();

      await userEvent.click(actionButton);

      const viewButton = await screen.findByTestId("viewButton");
      await userEvent.click(viewButton);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Click edit Product", async () => {
      mockGetProductStatusCode = 200;
      mockGetProductResponse = {
        total_records: 2,
        page_size: 1,
        current_page: 0,
        total_pages: 1,
        previous_page: "no",
        next_page: "no",
        products: [
          {
            i_package: "NP-00",
            plan_code: "10-01-05",
            product_name: "ชั่วระยะเวลา 5 ปี",
            c_plan: "10-01-05",
            promise_type: "ขายแบบเดี่ยว",
            is_active: true,
            active_status: "เปิดใช้งาน",
            create_by: "Peeranut.Anu",
            create_date: "2025-06-13T03:22:40.31",
            update_by: "Peeranut.Anu",
            update_date: "2025-06-13T03:49:42.483",
            product_plan_id: "43b03caa-bd38-4298-80b5-2bed15f72931",
            broker_list: null,
          },
        ],
      };
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const actionButton = await screen.findByTestId("MoreVertIcon");
      expect(actionButton).toBeInTheDocument();

      await userEvent.click(actionButton);

      const editButton = await screen.findByTestId("EditIcon");
      await userEvent.click(editButton);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    test("Click edit Product no product plan id", async () => {
      mockGetProductStatusCode = 200;
      mockGetProductResponse = {
        total_records: 2,
        page_size: 1,
        current_page: 0,
        total_pages: 1,
        previous_page: "no",
        next_page: "no",
        products: [
          {
            i_package: "NP-00",
            plan_code: "10-01-10",
            product_name: "ชั่วระยะเวลา 10 ปี",
            c_plan: "10-01-10",
            promise_type: "ขายแบบเดี่ยว",
            is_active: null,
            active_status: "แบบร่าง",
            create_by: null,
            create_date: null,
            update_by: null,
            update_date: null,
            product_plan_id: null,
            broker_list: null,
          },
        ],
      };
      // arrange
      const component = <PageProductsList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const actionButton = await screen.findByTestId("MoreVertIcon");
      expect(actionButton).toBeInTheDocument();

      await userEvent.click(actionButton);

      const editButton = await screen.findByTestId("EditIcon");
      await userEvent.click(editButton);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });
  });
});
