import React from "react";
import { render, screen } from "@testing-library/react";
import brokerList from "../brokerlist/page";
jest.mock("@/hooks", () => ({
  useAppFeatureCheck: jest.fn(),
}));
import * as hooks from "@hooks";
import { PageBrokerList, AppLoadData } from "@/components";

jest.mock("@/components", () => ({
  PageBrokerList: jest.fn(() => <div>PageBrokerList</div>),
  AppLoadData: jest.fn(({ loadingState }) => (
    <div>AppLoadData {loadingState}</div>
  )),
}));

describe("brokerList page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render AppLoadData and not PageBrokerList when feature is invalid", () => {
    hooks.useAppFeatureCheck.mockReturnValue({ validFeature: false });
    render(React.createElement(brokerList));
    expect(screen.getAllByText(/AppLoadData 3/)).toHaveLength(1);
    expect(screen.queryByText(/PageBrokerList/)).not.toBeInTheDocument();
    render(React.createElement(brokerList));
    expect(screen.getAllByText(/AppLoadData 3/)).toHaveLength(2);
    expect(screen.queryByText(/PageBrokerList/)).not.toBeInTheDocument();
  });

  it("should render PageBrokerList and not AppLoadData when feature is valid", () => {
    hooks.useAppFeatureCheck.mockReturnValue({ validFeature: true });
    render(React.createElement(brokerList));
    expect(screen.getByText(/PageBrokerList/)).toBeInTheDocument();
    expect(screen.queryByText(/AppLoadData/)).not.toBeInTheDocument();
    expect(screen.queryByText(/AppLoadData/)).not.toBeInTheDocument();
  });
});
