import { render } from "@utilities/jest";
import { AppCard } from "@components";

describe("AppCard Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe("Render Component", () => {
    it("should render with default props", async () => {
      // arrange
      const component = <AppCard />;

      // act
      await render(component);

      // assert
      expect(component).toBeDefined();
    });
  });
});
