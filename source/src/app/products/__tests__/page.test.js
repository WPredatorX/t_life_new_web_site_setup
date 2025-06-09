import { screen } from "@testing-library/react";
import { renderAfterHook } from "@utilities/jest";
import Products from "../page";

// Mock dependencies
jest.mock("@/components", () => ({
  PageProductsList: () => (
    <div data-testid="page-products-list">Products List</div>
  ),
  AppLoadData: ({ loadingState }) => (
    <div data-testid="app-load-data" data-loading-state={loadingState}>
      Loading...
    </div>
  ),
}));

const mockUseAppFeatureCheck = jest.fn();
jest.mock("@/hooks", () => ({
  useAppFeatureCheck: (features) => {
    mockUseAppFeatureCheck(features);
    return { validFeature: true };
  },
}));

describe("Products", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when features are not valid", async () => {
    jest
      .spyOn(require("@/hooks"), "useAppFeatureCheck")
      .mockReturnValueOnce({ validFeature: false });

    await renderAfterHook(<Products />);
    expect(screen.getByTestId("app-load-data")).toBeInTheDocument();
    expect(screen.getByTestId("app-load-data")).toHaveAttribute(
      "data-loading-state",
      "3"
    );
  });

  it("renders PageProductsList when features are valid", async () => {
    await renderAfterHook(<Products />);
    expect(screen.getByTestId("page-products-list")).toBeInTheDocument();
  });

  it("calls useAppFeatureCheck with correct features", async () => {
    await renderAfterHook(<Products />);
    expect(mockUseAppFeatureCheck).toHaveBeenCalledWith([
      "product.query",
      "product.general.read",
      "product.general.write",
      "product.setting.read",
      "product.setting.write",
    ]);
  });
});
