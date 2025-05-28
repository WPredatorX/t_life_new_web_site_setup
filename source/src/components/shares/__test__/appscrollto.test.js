import { AppScrollTo } from "@/components";
import { fireEvent, render, screen } from "@testing-library/react";

describe("AppScrollTo", () => {
  it("Should Render with out crash", () => {
    render(<AppScrollTo />);
  });
  it("Click Event", () => {
    render(<AppScrollTo />);
    const clicked = screen.getByTestId("test-box");
    fireEvent.click(clicked);
  });
});
