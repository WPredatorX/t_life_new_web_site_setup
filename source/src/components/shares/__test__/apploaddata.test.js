import { AppLoadData } from "@/components";
import { render } from "@testing-library/react";

describe("AppLoadData", () => {
  it("should render without crashing", async () => {
    render(<AppLoadData />);
  });
});
