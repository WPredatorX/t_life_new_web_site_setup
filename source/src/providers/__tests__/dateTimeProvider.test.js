import { render, act } from "@testing-library/react";
import { LanguageProvider, StoreProvider, DateTimeProvider } from "@providers";

describe("StoreProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", async () => {
    // arrange
    const component = (
      <StoreProvider>
        <LanguageProvider>
          <DateTimeProvider></DateTimeProvider>
        </LanguageProvider>
      </StoreProvider>
    );

    // act
    await act(() => {
      render(component);
    });

    // assert
    expect(component).toBeDefined();
  });
});
