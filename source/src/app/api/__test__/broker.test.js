import { POST } from "../broker/route.js";
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

describe("POST /api/broker/route", () => {
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

  it("should handle getProducts and return data", async () => {
    const pageNumber = "2";
    const pageSize = "10";
    const url = `http://localhost/api/broker/route?action=getProducts&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const mockData = [{ id: 1, name: "Product" }];
    axios.get.mockResolvedValue({ data: mockData });

    const request = mockRequest(url);
    const result = await POST(request);

    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}todos?_start=${pageNumber}&_limit=${pageSize}`
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockData);
    expect(result.json).toEqual(mockData);
  });

  it("should handle getBroker with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/broker/route?action=getBroker`;
    const mockData = [{ id: 1, broker: "Broker" }];
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: mockData },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(request.json).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetBrokerGeneralInfoList`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockData);
    expect(result.json).toEqual(mockData);
  });

  it("should handle getBroker with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/broker/route?action=getBroker`;
    axios.post.mockResolvedValue({
      status: 204,
      data: {},
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith([]);
    expect(result.json).toEqual([]);
  });

  it("should use empty string if no access token cookie for getBroker", async () => {
    cookies.mockReturnValue(mockCookieStore(undefined));
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/broker/route?action=getBroker`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [{ id: 2 }] },
    });

    const request = mockRequest(url, reqBody);
    await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetBrokerGeneralInfoList`,
      reqBody,
      { headers: { Authorization: "Bearer " } }
    );
  });
});
