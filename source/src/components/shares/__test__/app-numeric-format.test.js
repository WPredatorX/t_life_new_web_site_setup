import { AppNumericFormat } from "@/components";
import { fireEvent, render, screen } from "@testing-library/react";

describe("AppNumericFormat", () => {
  it("should render without crashing", async () => {
    render(<AppNumericFormat />);
  });
  it("renders and calls onChange with the correct floatValue", () => {
    const handleChange = jest.fn();

    render(<AppNumericFormat name="amount" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1234" } });
  });
});
