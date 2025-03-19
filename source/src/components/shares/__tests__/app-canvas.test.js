import { render } from "@utilities/jest";
import { AppCanvas } from "@components";

describe("AppCanvas Component", () => {
  describe("Render Component", () => {
    it("should render widouth crashing", async () => {
      // arrange
      const component = <AppCanvas />;

      // act
      await render(component);

      //assert
      expect(component).toBeDefined();
    });
  });
});
