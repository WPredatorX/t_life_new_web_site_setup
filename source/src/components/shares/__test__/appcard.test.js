import { AppCard } from "@/components";
import { render } from "@testing-library/react";

describe("AppCard", () => {
  it("should render without crashing", async () => {
    render(<AppCard />);
  });
});
