import { AppStatus } from "@/components";
import { render } from "@testing-library/react";

describe("AppStatus", () => {
  it("should render with out crash", () => {
    render(<AppStatus type="default" />);
  });
  it("renderColor1 แบบร่าง", () => {
    render(<AppStatus status={1} type="1" statusText={"แบบร่าง"} />);
  });
  it("renderColor1 รออนุมัติ", () => {
    render(<AppStatus status={2} type="1" statusText={"รออนุมัติ"} />);
  });
  it("renderColor1 เปิดใช้งาน", () => {
    render(<AppStatus status={3} type="1" statusText={"เปิดใช้งาน"} />);
  });
  it("renderColor1 ยกเลิกใช้งาน", () => {
    render(<AppStatus status={4} type="1" statusText={"ยกเลิกใช้งาน"} />);
  });
  it("renderColor1 ไม่อนุมัติ", () => {
    render(<AppStatus status={5} type="1" statusText={"ไม่อนุมัติ"} />);
  });
  it("renderColor1 default", () => {
    render(<AppStatus type="1" statusText={"default"} />);
  });
  it("renderColor2 รออนุมัติ", () => {
    render(<AppStatus status={1} type="2" statusText={"รออนุมัติ"} />);
  });
  it("renderColor2 เปิดใช้งาน", () => {
    render(<AppStatus status={2} type="2" statusText={"เปิดใช้งาน"} />);
  });
  it("renderColor2 ยกเลิกใช้งาน", () => {
    render(<AppStatus status={3} type="2" statusText={"ยกเลิกใช้งาน"} />);
  });
  it("renderColor2 default", () => {
    render(<AppStatus type="2" statusText={"default"} />);
  });
  it("renderColor3 แบบร่าง", () => {
    render(<AppStatus status={1} type="3" statusText={"แบบร่าง"} />);
  });
  it("renderColor3 เปิดใช้งาน", () => {
    render(<AppStatus status={2} type="3" statusText={"เปิดใช้งาน"} />);
  });
  it("renderColor3 ยกเลิกใช้งาน", () => {
    render(<AppStatus status={3} type="3" statusText={"ยกเลิกใช้งาน"} />);
  });
  it("renderColor3 default", () => {
    render(<AppStatus type="3" statusText={"default"} />);
  });
  it("renderColor4 แบบร่าง", () => {
    render(<AppStatus status={1} type="4" statusText={"แบบร่าง"} />);
  });
  it("renderColor4 รออนุมัติ", () => {
    render(<AppStatus status={2} type="4" statusText={"รออนุมัติ"} />);
  });
  it("renderColor4 เปิดใช้งาน", () => {
    render(<AppStatus status={3} type="4" statusText={"เปิดใช้งาน"} />);
  });
  it("renderColor4 ยกเลิกใช้งาน", () => {
    render(<AppStatus status={4} type="4" statusText={"ยกเลิกใช้งาน"} />);
  });
  it("renderColor4 ไม่อนุมัติ", () => {
    render(<AppStatus status={5} type="4" statusText={"ไม่อนุมัติ"} />);
  });
  it("renderColor4 default", () => {
    render(<AppStatus type="4" statusText={"default"} />);
  });
});
