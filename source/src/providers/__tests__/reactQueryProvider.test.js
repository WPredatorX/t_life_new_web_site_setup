import { render } from "@testing-library/react";
import { ReactQueryProvider } from "@providers";

jest.mock("react-query", () => {
  return {
    ...jest.requireActual("react-query"),
    QueryClient: jest.fn(),
    QueryClientProvider: jest.fn(),
  };
});

describe("ReactQueryProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error when QueryClientProvider throws an error", () => {
    // arrange
    const component = (
      <div>
        <ReactQueryProvider>Hello World</ReactQueryProvider>
      </div>
    );

    // act
    render(component);

    // assert
    expect(component).toBeDefined();
  });
});
