import React from "react";
import { render, act, renderHook, createMatchMedia } from "../jest";
import { screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";
import { useAppSelector } from "@hooks";

const TestComponent = () => {
  return <div>Test Rendered</div>;
};

describe("customRender", () => {
  let mockStore = null;

  beforeEach(() => {
    mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
  });

  it("should render a component inside all providers without auth", async () => {
    await act(async () => {
      render(<TestComponent />);
    });

    expect(screen.getByText("กำลังโหลดข้อมูล...")).toBeInTheDocument();
  });

  it("should render a component inside all providers without auth , with store", async () => {
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
    await act(async () => {
      render(<TestComponent />, {
        mockStore,
      });
    });

    expect(screen.getByText("กำลังโหลดข้อมูล...")).toBeInTheDocument();
  });
});

describe("customRenderHook", () => {
  it("should render a hook inside the Redux provider", () => {
    const useTestSelector = () => useAppSelector(() => "mocked state");

    const { result } = renderHook(useTestSelector, {
      mockStore: {
        getState: () => ({}),
        subscribe: jest.fn(),
        dispatch: jest.fn(),
        replaceReducer: jest.fn(),
      },
    });

    expect(result.current).toBe("mocked state");
  });
});

describe("createMatchMedia", () => {
  it("should return matchMedia mock with matching width", () => {
    const matchMedia = createMatchMedia(1024);
    const query = "(min-width: 768px)";
    const result = matchMedia(query);
    expect(result.matches).toBe(true);
    expect(typeof result.addListener).toBe("function");
    expect(typeof result.removeListener).toBe("function");
  });

  it("should return matchMedia mock with non-matching width", () => {
    const matchMedia = createMatchMedia(480);
    const query = "(min-width: 768px)";
    const result = matchMedia(query);
    expect(result.matches).toBe(false);
  });
});
