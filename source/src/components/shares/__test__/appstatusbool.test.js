import { AppStatusBool } from "@/components";
import { render } from "@testing-library/react";
describe("AppStatusBool", () => {
  it("Should render with out crash", () => {
    render(<AppStatusBool />);
  });
  it("render true", () => {
    render(<AppStatusBool status={true} statusText={"true"} />);
  });
  it("render false", () => {
    render(<AppStatusBool status={false} statusText={"false"} />);
  });
});
