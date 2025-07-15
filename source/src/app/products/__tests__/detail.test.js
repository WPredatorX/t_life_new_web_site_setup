import { screen } from "@testing-library/react";
import { renderAfterHook } from "@utilities/jest";
import ProductDetail from "../detail/page";

// Mock dependencies
jest.mock("@/components/pages/page-product-detail", () => ({
  __esModule: true,
  default: ({ productId, i_package, product_plan_id, mode, type }) => (
    <div data-testid="page-product-detail">
      <div data-testid="product-id">{productId}</div>
      <div data-testid="i-package">{i_package}</div>
      <div data-testid="product-plan-id">{product_plan_id}</div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="type">{type}</div>
    </div>
  ),
}));

describe("ProductDetail", () => {
  it("renders with all props", async () => {
    const searchParams = {
      mode: "edit",
      type: "general",
      i_package: "PKG001",
      plan_code: "PLAN001",
      product_plan_id: "123",
    };

    await renderAfterHook(<ProductDetail searchParams={searchParams} />);

    expect(screen.getByTestId("page-product-detail")).toBeInTheDocument();
    expect(screen.getByTestId("product-id")).toHaveTextContent("PLAN001");
    expect(screen.getByTestId("i-package")).toHaveTextContent("PKG001");
    expect(screen.getByTestId("product-plan-id")).toHaveTextContent("123");
    expect(screen.getByTestId("mode")).toHaveTextContent("edit");
    expect(screen.getByTestId("type")).toHaveTextContent("general");
  });

  it("renders with minimal props", async () => {
    const searchParams = {
      mode: "view",
      type: "general",
    };

    await renderAfterHook(<ProductDetail searchParams={searchParams} />);

    expect(screen.getByTestId("page-product-detail")).toBeInTheDocument();
    expect(screen.getByTestId("product-id")).toHaveTextContent("");
    expect(screen.getByTestId("i-package")).toHaveTextContent("");
    expect(screen.getByTestId("product-plan-id")).toHaveTextContent("");
    expect(screen.getByTestId("mode")).toHaveTextContent("view");
    expect(screen.getByTestId("type")).toHaveTextContent("general");
  });

  it("renders with undefined searchParams", async () => {
    await renderAfterHook(<ProductDetail searchParams={{}} />);

    expect(screen.getByTestId("page-product-detail")).toBeInTheDocument();
    expect(screen.getByTestId("product-id")).toHaveTextContent("");
    expect(screen.getByTestId("i-package")).toHaveTextContent("");
    expect(screen.getByTestId("product-plan-id")).toHaveTextContent("");
    expect(screen.getByTestId("mode")).toHaveTextContent("");
    expect(screen.getByTestId("type")).toHaveTextContent("");
  });
});
