import { render } from "@utilities/jest";
import { AppWyswig } from "@/components";

describe("app-wyswig", () => {
  it("should render default", async () => {
    // arrange
    const component = <AppWyswig />;

    // act
    await render(component);

    // assert
    expect(component).toBeDefined();
  });
});
