import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import PageProductsList from "../page-products-list";

// Mock useRouter:
jest.mock("@/hooks", () => ({
  useAppSnackbar: jest.fn(),
  useAppRouter: jest.fn(),
  useAppForm: jest.fn(),
  useAppSelector: jest.fn(),
  useAppFeatureCheck: jest.fn(() => ({ validFeature: true })),
}));

describe("PageProductsList", () => {
  beforeEach(() => {
    const useAppFormMock = {
      reset: jest.fn(),
      control: {
        defaultValues: {
          statusList: [],
          status: null,
          name: "",
          create_date_start: null,
          create_date_end: null,
          update_date_start: null,
          update_date_end: null,
        },
      },
      register: () => ({}),
      handleSubmit: (fn) => (e) => fn(e),
      clearErrors: jest.fn(),
      formState: { errors: {} },
      watch: jest.fn(() => null),
    };

    require("@/hooks").useAppSnackbar.mockReturnValue({
      handleSnackAlert: jest.fn(),
    });
    require("@/hooks").useAppRouter.mockReturnValue({ push: jest.fn() });
    require("@/hooks").useAppSelector.mockReturnValue({
      activator: "admin",
      someArray: [], // Mock the 'array' property or any required data
    });
    require("@/hooks").useAppForm.mockReturnValue(useAppFormMock);
  });

  it("should render the page and form controls", async () => {
    //console.log(PageProductsList.toString());
    render(<PageProductsList />);
    /*     expect(screen.getByText("ค้นหา")).toBeInTheDocument();
    expect(screen.getByText("ล้างค่า")).toBeInTheDocument();
    expect(screen.getByTestId("data-grid")).toBeInTheDocument(); */
  });

  /*   it("should call fetch when search button is clicked", async () => {
    render(<PageProductsList />);
    fireEvent.click(screen.getByText("ค้นหา"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/products?action=getProducts",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it('should reset form when clicking "ล้างค่า"', async () => {
    const resetMock = jest.fn();

    render(<PageProductsList />);
    fireEvent.click(screen.getByText("ล้างค่า"));

    await waitFor(() => {
      expect(resetMock).toHaveBeenCalled();
    });
  }); */
});
