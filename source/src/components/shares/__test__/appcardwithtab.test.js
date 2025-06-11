import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppCardWithTab } from "@/components";
import "@testing-library/jest-dom";

describe("AppCardWithTabs", () => {
  const tabLabels = ["Tab 1", "Tab 2", "Tab 3"];
  const tabContent = [
    <div key="1">Content for Tab 1</div>,
    <div key="2">Content for Tab 2</div>,
    <div key="3">Content for Tab 3</div>,
  ];

  it("renders all tab labels", () => {
    render(<AppCardWithTab tabLabels={tabLabels} tabContent={tabContent} />);
    tabLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("displays content for the first tab by default", () => {
    render(<AppCardWithTab tabLabels={tabLabels} tabContent={tabContent} />);
    expect(screen.getByText("Content for Tab 1")).toBeInTheDocument();
  });

  it("switches content when different tab is clicked", () => {
    render(<AppCardWithTab tabLabels={tabLabels} tabContent={tabContent} />);

    const tab2 = screen.getByText("Tab 2");
    fireEvent.click(tab2);

    expect(screen.getByText("Content for Tab 2")).toBeInTheDocument();
    expect(screen.queryByText("Content for Tab 1")).not.toBeInTheDocument();
  });

  it("does not render content for inactive tabs", () => {
    render(<AppCardWithTab tabLabels={tabLabels} tabContent={tabContent} />);
    expect(screen.queryByText("Content for Tab 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Content for Tab 3")).not.toBeInTheDocument();
  });
});
