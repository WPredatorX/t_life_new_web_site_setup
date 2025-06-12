import { POST } from "../direct/productSale/profile/route";
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
  default: {
    json: jest.fn((data) => ({ json: data })),
  },
}));

global.fetch = jest.fn();

describe("POST API route", () => {
  const mockRequest = (url, json = jest.fn()) => ({
    url,
    json,
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

  it("should handle GetBrokerProfiles", async () => {
    const url = `${baseUrl}?action=GetBrokerProfiles&brokerId=123`;
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 1 }] } });

    const result = await POST(mockRequest(url));

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetBrokerProfiles?brokerId=123`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([{ id: 1 }]);
    expect(result).toEqual({ json: [{ id: 1 }] });
  });

  it("should handle GetMainBodyById", async () => {
    const url = `${baseUrl}?action=GetMainBodyById`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [{ topic_mode: "label1", other: 1 }] },
    });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetMainBodyById`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([
      { topic_mode: "label1", other: 1, label: "label1" },
    ]);
    expect(result).toEqual({
      json: [{ topic_mode: "label1", other: 1, label: "label1" }],
    });
  });

  it("should handle GetSubBodyContentByMainBodyIdAndSaleId with 200", async () => {
    const url = `${baseUrl}?action=GetSubBodyContentByMainBodyIdAndSaleId&mainBodyId=1&SaleChannelId=2`;
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ foo: 1 }] } });

    const result = await POST(mockRequest(url));

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Home/GetSubBodyContentByMainBodyIdAndSaleId?mainBodyId=1&ProductSaleChannelId=2`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([{ foo: 1 }]);
    expect(result).toEqual({ json: [{ foo: 1 }] });
  });

  it("should handle GetSubBodyContentByMainBodyIdAndSaleId with 204", async () => {
    const url = `${baseUrl}?action=GetSubBodyContentByMainBodyIdAndSaleId&mainBodyId=1&SaleChannelId=2`;
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    axios.post.mockResolvedValue({ status: 204 });

    const result = await POST(mockRequest(url));

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result).toEqual({ json: { status: 204, message: "ไม่พบข้อมูล" } });
  });

  it("should handle GetContentSectionItemsById with 200", async () => {
    const url = `${baseUrl}?action=GetContentSectionItemsById`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1, 2] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetContentSectionItemsById`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result).toEqual({ json: [1, 2] });
  });

  it("should handle GetContentSectionItemsById with 204", async () => {
    const url = `${baseUrl}?action=GetContentSectionItemsById`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 204 });

    const result = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result).toEqual({ json: { status: 204, message: "ไม่พบข้อมูล" } });
  });

  it("should handle GetProductSaleCardByProductSaleId", async () => {
    const url = `${baseUrl}?action=GetProductSaleCardByProductSaleId`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetProductSaleCardByProductSaleId`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1]);
    expect(result).toEqual({ json: [1] });
  });
  it("should handle GetProductSaleCardByProductSaleId", async () => {
    const url = `${baseUrl}?action=GetProductSaleCardByProductSaleId`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetProductSaleCardByProductSaleId`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1]);
    expect(result).toEqual({ json: [1] });
  });

  it("should handle GetCopyProfileProductSaleCardId with 200", async () => {
    const url = `${baseUrl}?action=GetCopyProfileProductSaleCardId`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetCopyProfileProductSaleCardId`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1]);
    expect(result).toEqual({ json: [1] });
  });

  it("should handle GetCopyProfileProductSaleCardId with 204", async () => {
    const url = `${baseUrl}?action=GetCopyProfileProductSaleCardId`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 204 });

    const result = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith([]);
    expect(result).toEqual({ json: [] });
  });

  /*   it("should handle PreviewBrochure", async () => {
    const url = `${baseUrl}?action=PreviewBrochure`;
    const body = { fileName: "test.pdf", pdfUrl: "http://pdf" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    const blob = new Blob(["test"], { type: "application/pdf" });
    const fetchRes = { blob: jest.fn().mockResolvedValue(blob) };
    global.fetch.mockResolvedValue(fetchRes);

    const result = await POST(req);

    expect(global.fetch).toHaveBeenCalledWith("http://pdf");
    expect(fetchRes.blob).toHaveBeenCalled();
    expect(result.headers["Content-Type"]).toBe("application/pdf");
    expect(result.headers["Content-Disposition"]).toContain("test.pdf");
  }); */

  it("should handle GetMainProductSaleCardId with 200", async () => {
    const url = `${baseUrl}?action=GetMainProductSaleCardId`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetMainProductSaleCardId`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1]);
    expect(result).toEqual({ json: [1] });
  });

  it("should handle GetMainProductSaleCardId with 204", async () => {
    const url = `${baseUrl}?action=GetMainProductSaleCardId`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 204 });

    const result = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result).toEqual({ json: { status: 204, message: "ไม่พบข้อมูล" } });
  });

  it("should handle AddOrUpdateProfileProductSaleCard with 200", async () => {
    const url = `${baseUrl}?action=AddOrUpdateProfileProductSaleCard`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/AddOrUpdateProfileProductSaleCard`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1]);
    expect(result).toEqual({ json: [1] });
  });

  it("should handle AddOrUpdateProfileProductSaleCard with 204", async () => {
    const url = `${baseUrl}?action=AddOrUpdateProfileProductSaleCard`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 204 });

    const result = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result).toEqual({ json: { status: 204, message: "ไม่พบข้อมูล" } });
  });

  it("should handle AddOrUpdateContentSection with 200", async () => {
    const url = `${baseUrl}?action=AddOrUpdateContentSection`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/AddOrUpdateContentSection`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1]);
    expect(result).toEqual({ json: [1] });
  });

  it("should handle AddOrUpdateContentSection with 204", async () => {
    const url = `${baseUrl}?action=AddOrUpdateContentSection`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 204 });

    const result = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result).toEqual({ json: { status: 204, message: "ไม่พบข้อมูล" } });
  });

  it("should handle AddOrUpdateProductSaleStatusGroup with 200", async () => {
    const url = `${baseUrl}?action=AddOrUpdateProductSaleStatusGroup`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/AddOrUpdateProductSaleStatusGroup`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1]);
    expect(result).toEqual({ json: [1] });
  });

  it("should handle AddOrUpdateProductSaleStatusGroup with 204", async () => {
    const url = `${baseUrl}?action=AddOrUpdateProductSaleStatusGroup`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 204 });

    const result = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result).toEqual({ json: { status: 204, message: "ไม่พบข้อมูล" } });
  });

  it("should handle DeleteContentSection with 200", async () => {
    const url = `${baseUrl}?action=DeleteContentSection`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 200, data: { data: [1] } });

    const result = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/DeleteContentSection`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1]);
    expect(result).toEqual({ json: [1] });
  });

  it("should handle DeleteContentSection with 204", async () => {
    const url = `${baseUrl}?action=DeleteContentSection`;
    const body = { foo: "bar" };
    mockCookieStore.get.mockReturnValue({ value: accessToken });
    const req = mockRequest(url, jest.fn().mockResolvedValue(body));
    axios.post.mockResolvedValue({ status: 204 });

    const result = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({
      status: 204,
      message: "ไม่พบข้อมูล",
    });
    expect(result).toEqual({ json: { status: 204, message: "ไม่พบข้อมูล" } });
  });

  it("should use empty string if no access token in cookies", async () => {
    const url = `${baseUrl}?action=GetBrokerProfiles&brokerId=123`;
    mockCookieStore.get.mockReturnValue(undefined);
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 1 }] } });

    await POST(mockRequest(url));

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetBrokerProfiles?brokerId=123`,
      { headers: { Authorization: "Bearer " } }
    );
  });

  it("should return undefined if action is not handled", async () => {
    const url = `${baseUrl}?action=UnknownAction`;
    mockCookieStore.get.mockReturnValue({ value: accessToken });

    const result = await POST(mockRequest(url));

    expect(result).toBeUndefined();
  });
});
