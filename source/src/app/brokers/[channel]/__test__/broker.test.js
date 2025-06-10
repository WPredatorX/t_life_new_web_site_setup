import React from "react";
import { render, screen } from "@testing-library/react";
import Brokers from "../page";
import { useAppFeatureCheck } from "@hooks";
import { PageBroker, AppLoadData } from "@/components";

// Mock dependencies
jest.mock("@/components", () => ({
  PageBroker: jest.fn(({ channel, tabIndex }) => (
    <div data-testid="page-broker">
      {channel}-{tabIndex}
    </div>
  )),
  AppLoadData: jest.fn(({ loadingState }) => (
    <div data-testid="app-load-data">{loadingState}</div>
  )),
}));

jest.mock("@/hooks", () => ({
  useAppFeatureCheck: jest.fn(),
}));

describe("Brokers page", () => {
  const defaultParams = { channel: "test-channel" };
  const defaultSearchParams = { tabIndex: "2" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders AppLoadData when validFeature is false", () => {
    useAppFeatureCheck.mockReturnValue({ validFeature: false });

    render(
      <Brokers params={defaultParams} searchParams={defaultSearchParams} />
    );

    expect(screen.getByTestId("app-load-data")).toHaveTextContent("3");
    expect(AppLoadData).toHaveBeenCalledWith(
      expect.objectContaining({ loadingState: 3 }),
      {}
    );
    expect(PageBroker).not.toHaveBeenCalled();
  });

  it("renders PageBroker with correct props when validFeature is true and tabIndex is provided", () => {
    useAppFeatureCheck.mockReturnValue({ validFeature: true });

    render(
      <Brokers params={defaultParams} searchParams={defaultSearchParams} />
    );

    expect(PageBroker).toHaveBeenCalledWith(
      expect.objectContaining({ channel: "test-channel", tabIndex: 2 }),
      {}
    );
    expect(screen.getByTestId("page-broker")).toHaveTextContent(
      "test-channel-2"
    );
    expect(AppLoadData).not.toHaveBeenCalled();
  });

  it("renders PageBroker with tabIndex 0 when tabIndex is not provided", () => {
    useAppFeatureCheck.mockReturnValue({ validFeature: true });

    render(<Brokers params={defaultParams} searchParams={{}} />);

    expect(PageBroker).toHaveBeenCalledWith(
      expect.objectContaining({ channel: "test-channel", tabIndex: 0 }),
      {}
    );
    expect(screen.getByTestId("page-broker")).toHaveTextContent(
      "test-channel-0"
    );
  });
});
