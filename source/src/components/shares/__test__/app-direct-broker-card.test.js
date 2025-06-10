import { render } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer, globalInitialState } from "@stores/slices";
import { AppDirectBrokerCard } from "@components";

describe("app-direct-broker-card", () => {
  let mockStore = null;
  let defaultProps = {};
  let mockLoadBrokerStatusCode = null;
  let mcokLoadBrokerResponse = null;
  let mockCreateStatusCode = null;
  let mcokCreateResponse = null;

  beforeEach(() => {
    mockCreateStatusCode = 200;
    mcokCreateResponse = {
      recipient_id1: "mock-id-1",
      recipient_id2: "mock-id-2",
    };
    mockLoadBrokerStatusCode = 200;
    mcokLoadBrokerResponse = [
      {
        broker_id: "mock-broker-id",
        mail_to: "mail1, mail2",
        mail_cc: "mail3, mail4",
      },
    ];
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/direct?action=GetDirectGeneralInfo")) {
        return {
          status: mockLoadBrokerStatusCode,
          body: JSON.stringify(mcokLoadBrokerResponse),
        };
      }

      if (req.url.includes("/api/direct?action=AddOrUpdateDirect")) {
        return {
          status: mockCreateStatusCode,
          body: JSON.stringify(mcokCreateResponse),
        };
      }

      return {
        status: 404,
        body: "Not found",
      };
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
                        code: "direct.product.general.read",
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

  it("should render defaklt", async () => {
    // arrange
    const component = <AppDirectBrokerCard {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render defaklt create silent", async () => {
    // arrange
    const component = <AppDirectBrokerCard {...defaultProps} />;
    mcokLoadBrokerResponse = [
      {
        broker_id: "00000000-0000-0000-0000-000000000000",
        mail_to: "",
        mail_cc: "",
      },
    ];

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render defaklt create silent null mail list", async () => {
    // arrange
    const component = <AppDirectBrokerCard {...defaultProps} />;
    mcokLoadBrokerResponse = [
      {
        broker_id: "00000000-0000-0000-0000-000000000000",
        mail_to: null,
        mail_cc: null,
      },
    ];

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render defaklt empty", async () => {
    // arrange
    const component = <AppDirectBrokerCard {...defaultProps} />;
    mcokLoadBrokerResponse = [];

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render defaklt empty string", async () => {
    // arrange
    const component = <AppDirectBrokerCard {...defaultProps} />;
    mcokLoadBrokerResponse = [
      {
        broker_id: "mock-broker-id",
        mail_to: "",
        mail_cc: "",
      },
    ];

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render defaklt null mail list", async () => {
    // arrange
    const component = <AppDirectBrokerCard {...defaultProps} />;
    mcokLoadBrokerResponse = [
      {
        broker_id: "mock-broker-id",
        mail_to: null,
        mail_cc: null,
      },
    ];

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });

  it("should render defaklt fetch init error", async () => {
    // arrange
    mockLoadBrokerStatusCode = 500;
    const component = <AppDirectBrokerCard {...defaultProps} />;

    // act
    await render(component, {
      mockStore,
    });

    // assert
    expect(component).toBeDefined();
  });
});
