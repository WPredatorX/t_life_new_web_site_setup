import { render, screen } from "@testing-library/react";
import Home from "../page";
import { useAppFeatureCheck } from "@hooks";
import { AppLoadData } from "@components";

// Mock the hooks and components
jest.mock("@/hooks", () => ({
  useAppFeatureCheck: jest.fn(),
}));
jest.mock("@/components", () => ({
  AppLoadData: jest.fn(({ loadingState }) => <div>Loading {loadingState}</div>),
}));

describe("Home page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when feature is not valid", () => {
    useAppFeatureCheck.mockReturnValue({ validFeature: false });

    render(<Home />);
    expect(AppLoadData).toHaveBeenCalledWith(
      expect.objectContaining({ loadingState: 3 }),
      {}
    );
    expect(screen.getByText(/Loading 3/)).toBeInTheDocument();
  });

  it("renders Home main content when feature is valid", () => {
    useAppFeatureCheck.mockReturnValue({ validFeature: true });

    render(<Home />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
