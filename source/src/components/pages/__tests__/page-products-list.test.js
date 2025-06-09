import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderAfterHook } from "@utilities/jest";
import PageProductsList from "../page-products-list/index";

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
  useAppSelector: () => ({
    activator: "test_user",
  }),
}));

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

    const datePicker = screen.getByTestId("app-date-picker");
    fireEvent.change(datePicker, { target: { value: "2024-03-20" } });

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
});
