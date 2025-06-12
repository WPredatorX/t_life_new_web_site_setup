import { screen } from "@testing-library/react";
import { renderAfterHook } from "@utilities/jest";
import Direct from "../Direct";

// Mock dependencies
jest.mock("@/components", () => ({
  PageDirect: ({ tabIndex, promotionCode }) => (
    <div data-testid="page-direct">
      <div data-testid="tab-index">{tabIndex}</div>
      <div data-testid="promotion-code">{promotionCode}</div>
    </div>
  ),
  AppLoadData: ({ loadingState }) => (
    <div data-testid="app-load-data" data-loading-state={loadingState}>
      Loading...
    </div>
  ),
}));

const mockUseAppFeatureCheck = jest
  .fn()
  .mockReturnValue({ validFeature: true });
jest.mock("@/hooks", () => ({
  useAppFeatureCheck: () => mockUseAppFeatureCheck(),
}));

describe("Direct", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when features are not valid", async () => {
    mockUseAppFeatureCheck.mockReturnValueOnce({ validFeature: false });

    await renderAfterHook(<Direct />);
    expect(screen.getByTestId("app-load-data")).toBeInTheDocument();
    expect(screen.getByTestId("app-load-data")).toHaveAttribute(
      "data-loading-state",
      "3"
    );
  });

  it("renders PageDirect with default props", async () => {
    await renderAfterHook(<Direct />);
    expect(screen.getByTestId("page-direct")).toBeInTheDocument();
    expect(screen.getByTestId("tab-index")).toHaveTextContent("0");
    expect(screen.getByTestId("promotion-code")).toHaveTextContent("");
  });

  it("renders PageDirect with provided props", async () => {
    const props = {
      tabIndex: "1",
      promotionCode: "PROMO123",
    };

    await renderAfterHook(<Direct {...props} />);
    expect(screen.getByTestId("page-direct")).toBeInTheDocument();
    expect(screen.getByTestId("tab-index")).toHaveTextContent("1");
    expect(screen.getByTestId("promotion-code")).toHaveTextContent("PROMO123");
  });
});
