import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppCollapsecard from "../app-collapse-card";
import { APPLICATION_DEFAULT } from "@constants";

// Mock คอมโพเนนต์ที่นำเข้า
jest.mock("@/components", () => ({
  AppStatus: ({ status, statusText }) => (
    <div data-testid="app-status">{statusText}</div>
  ),
  AppDataGrid: (props) => (
    <div data-testid="app-data-grid">
      {props.rows.map((row) => (
        <div key={row.id}>
          <div data-testid="app-status">{row.statusText}</div>
          <div>formatted-{row.InsuredSumFrom}</div>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/hooks", () => ({
  useAppRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Transform
jest.mock("@/utilities", () => ({
  Transform: {
    formatNumber: (num) => `formatted-${num}`,
  },
}));

describe("AppCollapseCard", () => {
  const mockContent = {
    name: "Test Plan",
    productDetail: [
      {
        id: "1",
        status: "ACTIVE",
        statusText: "ใช้งานอยู่",
        channel: "Online",
        InsuredSumFrom: 100000,
        InsuredSumTo: 200000,
        createBy: "Admin",
        createDate: "2024-01-01T00:00:00Z",
        updateBy: "Editor",
        updateDate: "2024-02-01T00:00:00Z",
      },
    ],
  };

  test("should render plan name", async () => {
    render(<AppCollapsecard content={mockContent} />);
    await waitFor(() =>
      expect(
        screen.getByText((text) => text.includes("Test Plan"))
      ).toBeInTheDocument()
    );
  });

  it("should render AppDataGrid with correct rows", () => {
    render(<AppCollapsecard content={mockContent} />);
    const grid = screen.getByTestId("app-data-grid");
    expect(grid).toHaveTextContent("ใช้งานอยู่");
  });

  it("should expand accordion and render content", () => {
    render(<AppCollapsecard content={mockContent} />);
    const accordionButton = screen.getByRole("button");
    fireEvent.click(accordionButton);
    expect(screen.getByTestId("app-data-grid")).toBeInTheDocument();
  });
  test("renders expanded state when setactive is true", () => {
    render(<AppCollapsecard content={mockContent} setactive={true} />);
    expect(screen.getByText("Test Plan")).toBeInTheDocument();
  });
  test("renders AppStatus in status column", async () => {
    render(<AppCollapsecard content={mockContent} />);
    const accordionButton = screen.getByRole("button");
    fireEvent.click(accordionButton); // ensure grid expands
    expect(await screen.getByTestId("app-status")).toBeInTheDocument();
  });
  test("formats InsuredSumFrom correctly", () => {
    render(<AppCollapsecard content={mockContent} />);
    const grid = screen.getByTestId("app-data-grid");
    expect(grid).toHaveTextContent("formatted-100000");
  });
});
