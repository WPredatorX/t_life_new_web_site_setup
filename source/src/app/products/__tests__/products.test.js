import React from "react";
import { render, screen } from "@testing-library/react";
import Products from "../page";
import { PageProductsList, AppLoadData } from "@components";
import { Provider } from "react-redux";
import { store } from "../../../stores"; // Adjust the import path to your actual store location

jest.mock("@/hooks", () => ({
  useAppFeatureCheck: jest.fn(() => ({ validFeature: false })),
}));

describe("Products Page", () => {
  it("should render AppLoadData when validFeature is false", () => {
    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );
    expect(screen.getByText("ค้นหา")).toBeInTheDocument();
  });
});
