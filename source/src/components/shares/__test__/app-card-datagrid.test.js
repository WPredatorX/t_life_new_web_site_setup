import { AppCardDataGrid } from "@/components";

import { render } from "@testing-library/react";

describe("AppCardDataGrid", () => {
  it("should render without crashing", async () => {
    render(<AppCardDataGrid />);
  });
});
