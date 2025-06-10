import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderAfterHook, renderHook } from "@utilities/jest";
import PageProductsList from "../page-products-list/index";
import { format } from "date-fns";
import { configureStore } from "@reduxjs/toolkit";
import { addHours } from "date-fns";
import { globalInitialState, globalSliceReducer } from "@stores/slices";
// Mock dependencies
jest.mock("@/hooks", () => ({
  useAppSnackbar: () => ({
    handleSnackAlert: jest.fn(),
  }),
  useAppRouter: () => ({
    push: jest.fn(),
  }),
  useAppForm: () => ({
    reset: jest.fn(),
    control: {},
    register: jest.fn(),
    handleSubmit: (fn) => fn,
    clearErrors: jest.fn(),
    formState: { errors: {} },
    watch: jest.fn().mockReturnValue(null),
  }),
  useAppFeatureCheck: () => ({
    validFeature: true,
  }),
  useAppSelector: jest.fn((selector) => ({
    activator: "test_user",
  })),
}));

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: (cb) => cb,
      formState: { errors: {} },
      control: {}, // ใส่ mock control object ตรงนี้
    })),
    Controller: ({ render }) =>
      render({ field: { onChange: jest.fn(), value: "" } }),
  };
});

jest.mock("@/components", () => ({
  AppCard: ({ children, title }) => (
    <div data-testid="app-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
  AppDataGrid: ({ rows, loading }) => (
    <div data-testid="app-data-grid" data-loading={loading}>
      {rows?.map((row) => (
        <div key={row.id} data-testid="grid-row">
          {row.plan_code}
          {row.create_date && (
            <span>
              {require("date-fns").format(
                new Date(row.create_date),
                "dd/MM/yyyy HH:mm:ss"
              )}
            </span>
          )}
        </div>
      ))}
    </div>
  ),
  AppAutocomplete: ({ label, onChange }) => (
    <select
      data-testid="app-autocomplete"
      onChange={(e) => onChange(e, { value: e.target.value })}
    >
      <option value="">{label}</option>
      <option value="1">Active</option>
      <option value="0">Inactive</option>
    </select>
  ),
  AppDatePicker: ({ label, onChange }) => (
    <input
      type="date"
      data-testid="app-date-picker"
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

// Mock fetch
global.fetch = jest.fn();

describe("PageProductsList", () => {
  let mockStore = null;
  let mockProducts = null;
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          products: [
            {
              plan_code: "TEST001",
              product_name: "Test Product",
              i_package: "NP-00",
              active_status: "1",
            },
          ],
          current_page: 1,
          page_size: 10,
          total_records: 1,
        }),
    });
    // Mock products data
    mockProducts = {
      products: [
        {
          id: 1,
          product_name: "Product 1",
          i_package: "NP-00",
          is_active: true,
        },
        {
          id: 2,
          product_name: "Product 2",
          i_package: "NP-01",
          is_active: false,
        },
      ],
      current_page: 1,
      page_size: 10,
      total_records: 2,
    };
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes("/api/products?action=getProducts")) {
        return {
          status: 200,
          body: JSON.stringify(mockProducts),
        };
      }
      return {
        status: 404,
        body: "Not found",
      };
    });

    // Setup store
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
    });
  });

  it("renders the component with initial state", async () => {
    await renderAfterHook(<PageProductsList />);

    expect(screen.getByTestId("app-card")).toBeInTheDocument();
    expect(screen.getByText("ผลิตภัณฑ์ทั้งหมด")).toBeInTheDocument();
    expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    await renderAfterHook(<PageProductsList />);

    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products?action=getProducts"),
        expect.any(Object)
      );
    });
  });

  it("handles form reset", async () => {
    await renderAfterHook(<PageProductsList />);

    const resetButton = screen.getByText("ล้างค่า");
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("handles status filter change", async () => {
    const mockWatch = jest.fn().mockReturnValue({ value: "1" });
    jest.spyOn(require("@/hooks"), "useAppForm").mockReturnValue({
      reset: jest.fn(),
      control: {},
      register: jest.fn(),
      handleSubmit: (fn) => fn,
      clearErrors: jest.fn(),
      formState: { errors: {} },
      watch: mockWatch,
    });

    await renderAfterHook(<PageProductsList />);

    const statusSelect = screen.getByTestId("app-autocomplete");
    fireEvent.change(statusSelect, { target: { value: "1" } });

    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products?action=getProducts"),
        expect.objectContaining({
          body: expect.stringContaining('"is_active":"1"'),
        })
      );
    });
  });

  it("handles date filter changes", async () => {
    await renderAfterHook(<PageProductsList />);

    const datePickers = screen.getAllByTestId("app-date-picker");
    fireEvent.change(datePickers[0], { target: { value: "2024-03-20" } });

    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("displays loading state", async () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    await renderAfterHook(<PageProductsList />);

    expect(screen.getByTestId("app-data-grid")).toHaveAttribute(
      "data-loading",
      "true"
    );
  });

  it("handles error state", async () => {
    global.fetch.mockRejectedValueOnce(new Error("API Error"));

    await renderAfterHook(<PageProductsList />);

    await waitFor(() => {
      expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
    });
  });

  it("uses activator from global state", async () => {
    const mockActivator = "test_user_123";
    jest
      .spyOn(require("@/hooks"), "useAppSelector")
      .mockImplementation((selector) => {
        if (selector.toString().includes("state.global")) {
          return { activator: mockActivator };
        }
        return {};
      });

    await renderAfterHook(<PageProductsList />);

    const searchButton = screen.getByText("ค้นหา");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products?action=getProducts"),
        expect.any(Object)
      );
    });
  });

  it("handles create product with activator", async () => {
    const mockActivator = "test_user_123";
    jest
      .spyOn(require("@/hooks"), "useAppSelector")
      .mockImplementation((selector) => ({
        activator: mockActivator,
      }));

    await renderAfterHook(<PageProductsList />);

    // Simulate create product action
    const mockProduct = {
      plan_code: "TEST001",
      product_name: "Test Product",
      i_package: "NP-00",
    };

    const response = await fetch(
      "/api/products?action=AddOrUpdateProductOnShelf",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...mockProduct, create_by: mockActivator }),
      }
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/products?action=AddOrUpdateProductOnShelf"
        ),
        expect.objectContaining({
          body: expect.stringContaining(`"create_by":"${mockActivator}"`),
        })
      );
    });
  });
});
