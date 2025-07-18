import { renderHook, act } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";
import useAppScroll from "../useAppScroll";

describe("useAppScroll", () => {
  let scrollIntoViewMock;
  let scrollByMock;
  let getElementByIdMock;

  const mockStore = configureStore({
    reducer: {
      global: globalSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat([]),
  });

  beforeEach(() => {
    scrollIntoViewMock = jest.fn();
    const fakeElement = {
      scrollIntoView: scrollIntoViewMock,
    };

    getElementByIdMock = jest
      .spyOn(document, "getElementById")
      .mockReturnValue(fakeElement);

    scrollByMock = jest.spyOn(window, "scrollBy").mockImplementation(jest.fn());

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should scroll to the default element and then scroll by offset", () => {
    const { result } = renderHook(() => useAppScroll(), {
      mockStore,
    });

    act(() => {
      result.current.handleScrollTo();
    });

    expect(getElementByIdMock).toHaveBeenCalledWith("top-anchor");
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: "center",
      behavior: "smooth",
    });

    // Fast-forward timer
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(scrollByMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should scroll to the element and then scroll by offset", () => {
    const { result } = renderHook(() => useAppScroll(), {
      mockStore,
    });

    act(() => {
      result.current.handleScrollTo("test-anchor", 100);
    });

    expect(getElementByIdMock).toHaveBeenCalledWith("test-anchor");
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: "center",
      behavior: "smooth",
    });

    // Fast-forward timer
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(scrollByMock).toHaveBeenCalledWith({
      top: 100,
      behavior: "smooth",
    });
  });

  it("should do nothing if element is not found", () => {
    getElementByIdMock.mockReturnValueOnce(null);

    const { result } = renderHook(() => useAppScroll(), {
      mockStore,
    });

    act(() => {
      result.current.handleScrollTo("missing-anchor", 50);
    });

    expect(getElementByIdMock).toHaveBeenCalledWith("missing-anchor");
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
    expect(scrollByMock).not.toHaveBeenCalled();
  });
});
