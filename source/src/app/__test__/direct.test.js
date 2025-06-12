import { screen } from "@testing-library/react";
import PageDireact from "../direct/page";
import { renderAfterHook } from "@utilities/jest";

// Mock the Direct component
jest.mock("../direct/components", () => {
  return {
    Direct: ({ tabIndex, promotionCode }) => (
      <div data-testid="direct-component">
        <div data-testid="tab-index">{tabIndex}</div>
        <div data-testid="promotion-code">{promotionCode}</div>
      </div>
    ),
  };
});

describe("PageDireact", () => {
  it("renders Direct component with default props", async () => {
    await renderAfterHook(<PageDireact searchParams={{}} />);

    expect(screen.getByTestId("direct-component")).toBeInTheDocument();
    expect(screen.getByTestId("tab-index")).toHaveTextContent("");
    expect(screen.getByTestId("promotion-code")).toHaveTextContent("");
  });

  it("renders Direct component with provided props", async () => {
    const testProps = {
      searchParams: {
        tabIndex: "1",
        promotionCode: "PROMO123",
      },
    };

    await renderAfterHook(<PageDireact {...testProps} />);

    expect(screen.getByTestId("direct-component")).toBeInTheDocument();
    expect(screen.getByTestId("tab-index")).toHaveTextContent("1");
    expect(screen.getByTestId("promotion-code")).toHaveTextContent("PROMO123");
  });
});
