import { POST } from "../direct/productSale/common/route";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

jest.mock("axios");
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({ json: data })),
  },
}));

describe("POST API route", () => {
  const mockRequest = (url) => ({
    url,
  });

  const mockCookieStore = {
    get: jest.fn(),
  };

  const baseUrl = "https://mock-api/";
  const tokenName = "MOCK_TOKEN_COOKIE";
  const accessToken = "mock-access-token";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_APPLICATION_API = baseUrl;
    process.env.NEXT_PUBLIC_APPLICATION_TOKEN_COOKIES_NAME = tokenName;
    jest.clearAllMocks();
    cookies.mockReturnValue(mockCookieStore);
  });

  it("should call GetDirectGeneralInfo and return sorted data", async () => {
    const url = `${baseUrl}?action=GetDirectGeneralInfo`;
    mockCookieStore.get.mockReturnValue({ value: accessToken });

    const unsortedData = [
      { template_code: 2, name: "B" },
      { template_code: 1, name: "A" },
    ];
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: unsortedData },
    });

    const result = await POST(mockRequest(url));

    expect(cookies).toHaveBeenCalled();
    expect(mockCookieStore.get).toHaveBeenCalledWith(tokenName);
    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetDirectGeneralInfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([
      { template_code: 1, name: "A" },
      { template_code: 2, name: "B" },
    ]);
    expect(result).toEqual({
      json: [
        { template_code: 1, name: "A" },
        { template_code: 2, name: "B" },
      ],
    });
  });

  it("should return undefined if response status is not 200", async () => {
    const url = `${baseUrl}?action=GetDirectGeneralInfo`;
    mockCookieStore.get.mockReturnValue({ value: accessToken });

    axios.post.mockResolvedValue({
      status: 500,
      data: {},
    });

    const result = await POST(mockRequest(url));

    expect(NextResponse.json).toHaveBeenCalledWith(null);
    expect(result).toEqual({ json: null });
  });

  it("should return undefined if action is not handled", async () => {
    const url = `${baseUrl}?action=UnknownAction`;
    mockCookieStore.get.mockReturnValue({ value: accessToken });

    const result = await POST(mockRequest(url));

    // No axios call, no NextResponse.json call
    expect(axios.post).not.toHaveBeenCalled();
    expect(NextResponse.json).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should use empty string if no access token in cookies", async () => {
    const url = `${baseUrl}?action=GetDirectGeneralInfo`;
    mockCookieStore.get.mockReturnValue(undefined);

    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [] },
    });

    await POST(mockRequest(url));

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetDirectGeneralInfo`,
      {
        headers: { Authorization: "Bearer " },
      }
    );
  });
});
