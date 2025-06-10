import { POST } from "../direct/promotion/route";

import { NextResponse } from "next/server";
import axios from "axios";

// Mocks
jest.mock("axios");
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({ json: data })),
  },
}));

const mockCookies = {
  get: jest.fn(() => ({ value: "mock-token" })),
};

const createRequest = (action, body = {}, urlParams = "") => {
  const url = `http://localhost/api/direct/promotion/route?${urlParams}action=${action}`;
  return {
    url,
    json: jest.fn().mockResolvedValue(body),
  };
};

describe("POST /api/direct/promotion/route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("next/headers").cookies.mockReturnValue(mockCookies);
    process.env.NEXT_PUBLIC_APPLICATION_API = "http://mock-api/";
    process.env.NEXT_PUBLIC_APPLICATION_TOKEN_COOKIES_NAME = "token";
  });

  it("should handle getPromotion with 200", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [{ id: 1 }, { id: 2 }] },
    });
    const req = createRequest("getPromotion", { foo: "bar" }, "productId=123&");
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/Products/GetPromotionById",
      { foo: "bar" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(NextResponse.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    expect(res).toBeDefined();
  });

  it("should handle getPromotion with 204", async () => {
    axios.post.mockResolvedValue({
      status: 204,
      data: {},
    });
    const req = createRequest("getPromotion", { foo: "bar" }, "productId=123&");
    const res = await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith([]);
    expect(res).toBeDefined();
  });

  it("should handle AddOrUpdatePromotion", async () => {
    axios.post.mockResolvedValue({
      data: { data: { id: 99, name: "promo" } },
    });
    const req = createRequest("AddOrUpdatePromotion", { promo: "data" });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/Products/AddOrUpdatePromotion",
      { promo: "data" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 99, name: "promo" });
    expect(res).toBeDefined();
  });

  it("should return undefined for unknown action", async () => {
    const req = createRequest("unknownAction", {});
    const res = await POST(req);
    expect(res).toBeUndefined();
  });
});
