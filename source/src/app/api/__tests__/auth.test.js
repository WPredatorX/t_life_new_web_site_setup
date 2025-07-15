import { POST } from "../auth/route.js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

jest.mock("next/headers");
jest.mock("axios");
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({ json: data })),
  },
}));

describe("POST", () => {
  const mockRequest = (url, jsonData = {}) => ({
    url,
    json: jest.fn().mockResolvedValue(jsonData),
  });

  const mockCookieStore = (token) => ({
    get: jest.fn(() => (token ? { value: token } : undefined)),
  });

  const baseUrl = "https://mock-api/";
  const tokenName = "MOCK_TOKEN_COOKIE";
  const accessToken = "mock-access-token";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_APPLICATION_API = baseUrl;
    process.env.NEXT_PUBLIC_APPLICATION_TOKEN_COOKIES_NAME = tokenName;
    cookies.mockReturnValue(mockCookieStore(accessToken));
  });

  it("should handle getUserRolesData with 200 response", async () => {
    const reqBody = { userId: 1 };
    const url = `http://localhost/api/auth/route?action=getUserRolesData`;
    const mockData = { foo: "bar" };
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: mockData },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(request.json).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetUserRolesData`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockData);
    expect(result.json).toEqual(mockData);
  });

  it("should handle getUserRolesData with 204 response", async () => {
    const reqBody = { userId: 1 };
    const url = `http://localhost/api/auth/route?action=getUserRolesData`;
    axios.post.mockResolvedValue({
      status: 204,
      data: {},
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result.json).toEqual({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
  });

  it("should handle getBlobSasToken with 200 response", async () => {
    const url = `http://localhost/api/auth/route?action=getBlobSasToken`;
    const mockData = { token: "blob-token" };
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: mockData },
    });

    const request = mockRequest(url);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetBlobSasToken`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockData);
    expect(result.json).toEqual(mockData);
  });

  it("should handle getBlobSasToken with 204 response", async () => {
    const url = `http://localhost/api/auth/route?action=getBlobSasToken`;
    axios.post.mockResolvedValue({
      status: 204,
      data: {},
    });

    const request = mockRequest(url);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result.json).toEqual({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
  });

  it("should use empty string if no access token cookie", async () => {
    cookies.mockReturnValue(mockCookieStore(undefined));
    const url = `http://localhost/api/auth/route?action=getBlobSasToken`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: { foo: "bar" } },
    });

    const request = mockRequest(url);
    await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetBlobSasToken`,
      { headers: { Authorization: "Bearer " } }
    );
  });
});
