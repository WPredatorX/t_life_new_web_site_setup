import { AppLoadData } from "@/components";
import { render } from "@testing-library/react";

describe("AppLoadData", () => {
  it("should render without crashing", async () => {
    render(<AppLoadData />);
  });

  it("should render without crashing with message", async () => {
    render(<AppLoadData loadingState={4} message={"mock-message"} />);
  });
});
