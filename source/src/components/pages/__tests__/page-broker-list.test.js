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
import { APPLICATION_RECORD_BROKER_STATUS } from "@constants";
import { Controller } from "react-hook-form";
import PageBrokerList from "../page-broker-list";
import useAppForm from "@hooks/useAppForm";

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: ({ render }) =>
      render({
        field: { onChange: jest.fn(), value: null, name: "mock-name" },
      }),
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

jest.mock("@hooks/useAppSnackbar", () =>
  jest.fn().mockReturnValue({
    handleSnackAlert: jest.fn(),
  })
);

describe("PageBrokerList", () => {
  let mockStore = null;
  let mockGetBrokerStatusCode = null;
  let mockGetBrokerResponse = null;

  beforeEach(() => {
    mockGetBrokerStatusCode = 200;
    mockGetBrokerResponse = { rows: [], totalRows: 0 };
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/broker?action=getBroker")) {
        return {
          status: mockGetBrokerStatusCode,
          body: JSON.stringify(mockGetBrokerResponse),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe("Render", () => {
    it("should render default", async () => {
      // arrange
      const component = <PageBrokerList />;

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
      mockGetBrokerResponse = [
        {
          id: "mock-id",
          i_subbusiness_line: "mock-i_subbusiness_line",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 1,
        },
      ];
      const component = <PageBrokerList />;

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
      // arrange
      mockGetBrokerStatusCode = 500;
      mockGetBrokerResponse = [
        {
          id: "mock-id",
          i_subbusiness_line: "mock-i_subbusiness_line",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 1,
        },
      ];
      const component = <PageBrokerList />;

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

    it("should render default with response null date", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id",
          i_subbusiness_line: "mock-i_subbusiness_line",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: null,
          update_by: "mock-update_by",
          update_date: null,
          total_records: 1,
        },
      ];
      const component = <PageBrokerList />;

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
    it("should render with response then click copy", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id",
          i_subbusiness_line: "mock-i_subbusiness_line",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 1,
        },
      ];
      const component = <PageBrokerList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const button = await screen.findByTestId("ContentCopyIcon");
      fireEvent.click(button);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          "mock-broker_url"
        );
      });
    });

    it("should render with response then click more and view", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id",
          i_subbusiness_line: "mock-i_subbusiness_line",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 1,
        },
      ];
      const component = <PageBrokerList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const button = await screen.findByTestId("MoreVertIcon");
      fireEvent.click(button);

      const viewButton = await screen.findByText("ดูรายละเอียด");
      fireEvent.click(viewButton);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render with response then click more and edit", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id",
          i_subbusiness_line: "mock-i_subbusiness_line",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 1,
        },
      ];
      const component = <PageBrokerList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const button = await screen.findByTestId("MoreVertIcon");
      fireEvent.click(button);

      const editButton = await screen.findByText("แก้ไข");
      fireEvent.click(editButton);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render with response then click change page", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id-1",
          i_subbusiness_line: "mock-i_subbusiness_line-1",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-2",
          i_subbusiness_line: "mock-i_subbusiness_line-2",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-3",
          i_subbusiness_line: "mock-i_subbusiness_line-3",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-4",
          i_subbusiness_line: "mock-i_subbusiness_line-4",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-5",
          i_subbusiness_line: "mock-i_subbusiness_line-5",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-6",
          i_subbusiness_line: "mock-i_subbusiness_line-6",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
      ];
      const component = <PageBrokerList />;

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

    it("should render with response then click change sort", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id-1",
          i_subbusiness_line: "mock-i_subbusiness_line-1",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-2",
          i_subbusiness_line: "mock-i_subbusiness_line-2",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-3",
          i_subbusiness_line: "mock-i_subbusiness_line-3",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-4",
          i_subbusiness_line: "mock-i_subbusiness_line-4",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-5",
          i_subbusiness_line: "mock-i_subbusiness_line-5",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-6",
          i_subbusiness_line: "mock-i_subbusiness_line-6",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
      ];
      const component = <PageBrokerList />;

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

    it("should render with response then click reset", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id-1",
          i_subbusiness_line: "mock-i_subbusiness_line-1",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-2",
          i_subbusiness_line: "mock-i_subbusiness_line-2",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-3",
          i_subbusiness_line: "mock-i_subbusiness_line-3",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-4",
          i_subbusiness_line: "mock-i_subbusiness_line-4",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-5",
          i_subbusiness_line: "mock-i_subbusiness_line-5",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-6",
          i_subbusiness_line: "mock-i_subbusiness_line-6",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
      ];
      const component = <PageBrokerList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const button = await screen.findByText("ล้างค่า");
      fireEvent.click(button);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render with response then click search", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id-1",
          i_subbusiness_line: "mock-i_subbusiness_line-1",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-2",
          i_subbusiness_line: "mock-i_subbusiness_line-2",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-3",
          i_subbusiness_line: "mock-i_subbusiness_line-3",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-4",
          i_subbusiness_line: "mock-i_subbusiness_line-4",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-5",
          i_subbusiness_line: "mock-i_subbusiness_line-5",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-6",
          i_subbusiness_line: "mock-i_subbusiness_line-6",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
      ];
      const component = <PageBrokerList />;

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

    it("should render with response then submit form", async () => {
      // arrange
      mockGetBrokerResponse = [
        {
          id: "mock-id-1",
          i_subbusiness_line: "mock-i_subbusiness_line-1",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-2",
          i_subbusiness_line: "mock-i_subbusiness_line-2",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-3",
          i_subbusiness_line: "mock-i_subbusiness_line-3",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-4",
          i_subbusiness_line: "mock-i_subbusiness_line-4",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-5",
          i_subbusiness_line: "mock-i_subbusiness_line-5",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
        {
          id: "mock-id-6",
          i_subbusiness_line: "mock-i_subbusiness_line-6",
          c_subbusiness_line: "mock-c_subbusiness_line",
          broker_email: "mock-broker_email",
          broker_license_number: "mock-broker_license_number",
          broker_url: "mock-broker_url",
          active_status: "mock-active_status",
          name_status: "mock-name_status",
          create_by: "mock-create_by",
          create_date: new Date(),
          update_by: "mock-update_by",
          update_date: new Date(),
          total_records: 6,
        },
      ];
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });
      const component = <PageBrokerList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });
      const form = await screen.findByTestId("form-submit");
      fireEvent.submit(form);

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });

    it("should render with response then change form", async () => {
      // arrange
      window.matchMedia = createMatchMedia(1920);
      mockGetBrokerResponse = [];
      useAppForm.mockReturnValue({
        register: jest.fn(),
        reset: jest.fn(),
        watch: jest.fn(),
        handleSubmit: (callback) => () => callback(),
        formState: {
          isDirty: true,
        },
      });
      const component = <PageBrokerList />;

      // act
      await act(async () => {
        await render(component, {
          mockStore,
        });
      });

      const input = screen.getByRole("combobox", { name: /สถานะ/i });
      await userEvent.type(
        input,
        APPLICATION_RECORD_BROKER_STATUS[0].label.slice(0, 2)
      );
      const option = await screen.findByText(
        APPLICATION_RECORD_BROKER_STATUS[0].label
      );
      await userEvent.click(option);

      const dates = await screen.findAllByTestId("input-date");
      for (let index = 0; index < dates.length; index++) {
        const element = dates[index];
        fireEvent.mouseDown(element);
        fireEvent.change(element, {
          target: { value: "01/01/2568" },
        });
      }

      // assert
      await waitFor(() => {
        expect(component).toBeDefined();
      });
    });
  });
});
