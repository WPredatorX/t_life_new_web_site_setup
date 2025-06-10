import { POST } from "../direct/route";
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

describe("POST /api/direct/route", () => {
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

  it("should handle GetDirectGeneralInfo with 200 response and sort data", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetDirectGeneralInfo`;
    const unsorted = [{ template_code: 2 }, { template_code: 1 }];
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: unsorted },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(request.json).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetDirectGeneralInfo`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([
      { template_code: 1 },
      { template_code: 2 },
    ]);
    expect(result.json).toEqual([{ template_code: 1 }, { template_code: 2 }]);
  });

  it("should handle TestSendMail with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=TestSendMail`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { test: "ok" },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/SendEmailTest`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ test: "ok" });
    expect(result.json).toEqual({ test: "ok" });
  });

  it("should handle getAllProductSaleDirect with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getAllProductSaleDirect`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2, 3] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetAllProductSaleDirect`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2, 3]);
    expect(result.json).toEqual([1, 2, 3]);
  });

  it("should handle getAllProductSaleDirect with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getAllProductSaleDirect`;
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

  it("should handle getProductSalePeriodById with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getProductSalePeriodById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Products/GetProductSalePeriodById`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle getProductSalePeriodById with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getProductSalePeriodById`;
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

  it("should handle getPaymentModeById with 200 response", async () => {
    const url = `http://localhost/api/direct/route?action=getPaymentModeById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        data: [{ payment_mode_id: 1, payment_mode_description: "desc" }],
      },
    });

    const request = mockRequest(url);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/GetPaymentModeById`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([
      {
        payment_mode_id: 1,
        payment_mode_description: "desc",
        id: 1,
        label: "desc",
      },
    ]);
    expect(result.json).toEqual([
      {
        payment_mode_id: 1,
        payment_mode_description: "desc",
        id: 1,
        label: "desc",
      },
    ]);
  });

  it("should handle getPaymentModeById with 204 response", async () => {
    const url = `http://localhost/api/direct/route?action=getPaymentModeById`;
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

  it("should handle getProductPaymentModeById with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getProductPaymentModeById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/GetProductPaymentModeById`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle getProductPaymentModeById with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getProductPaymentModeById`;
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

  it("should handle getProductPaymentMethodsById with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getProductPaymentMethodsById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/GetProductPaymentMethodsById`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle getProductPaymentMethodsById with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getProductPaymentMethodsById`;
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

  it("should handle getPaymentChannelById with 200 response", async () => {
    const url = `http://localhost/api/direct/route?action=getPaymentChannelById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [{ payment_id: 1, payment_name: "name" }] },
    });

    const request = mockRequest(url);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/GetPaymentChannelById`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([
      { payment_id: 1, payment_name: "name", id: 1, label: "name" },
    ]);
    expect(result.json).toEqual([
      { payment_id: 1, payment_name: "name", id: 1, label: "name" },
    ]);
  });

  it("should handle getPaymentChannelById with 204 response", async () => {
    const url = `http://localhost/api/direct/route?action=getPaymentChannelById`;
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
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getProductPaymentModeById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/GetProductPaymentModeById`,
      reqBody,
      { headers: { Authorization: "Bearer " } }
    );
  });

  it("should handle getInstallmentTypeById with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getInstallmentTypeById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/GetInstallmentTypeById`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle getInstallmentTypeById with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=getInstallmentTypeById`;
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

  it("should handle AddOrUpdateDirect with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=AddOrUpdateDirect`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/AddOrUpdateDirect`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle AddOrUpdateDirect with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=AddOrUpdateDirect`;
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

  it("should handle getSaleConditionByProductId with 200 response", async () => {
    const url = `http://localhost/api/direct/route?action=getSaleConditionByProductId&productId=123`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetConditionProductSale`,
      { product_sale_channel_id: "123" },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle AddOrUpdateProductPlanByChannel with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=AddOrUpdateProductPlanByChannel`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Products/AddOrUpdateProductPlanByChannel`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle AddOrUpdateProductSalePeriod with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=AddOrUpdateProductSalePeriod`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Products/AddOrUpdateProductSalePeriod`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle AddOrUpdateProductPaymentMode with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=AddOrUpdateProductPaymentMode`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/AddOrUpdateProductPaymentMode`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle AddOrUpdateProductPaymentMethods with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=AddOrUpdateProductPaymentMethods`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/AddOrUpdateProductPaymentMethods`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle AddOrUpdateInstallmentType with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=AddOrUpdateInstallmentType`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Payment/AddOrUpdateInstallmentType`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle AddOrUpdateProductApplicationTemplate with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=AddOrUpdateProductApplicationTemplate`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Products/AddOrUpdateProductApplicationTemplate`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle GetAllProductSaleGroupRider with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetAllProductSaleGroupRider`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetAllProductSaleGroupRider`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle GetAllProductSaleGroupRider with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetAllProductSaleGroupRider`;
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

  it("should handle GetAllProductSaleRiderDirect with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetAllProductSaleRiderDirect`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetAllProductSaleRiderDirect`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle GetAllProductSaleRiderDirect with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetAllProductSaleRiderDirect`;
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

  it("should handle GetListProductSaleRider with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetListProductSaleRider`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetListProductSaleRider`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle GetListProductSaleRider with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetListProductSaleRider`;
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

  it("should handle getProductFromDirectWithMultiParam returns mock data", async () => {
    const url = `http://localhost/api/direct/route?action=getProductFromDirectWithMultiParam`;
    const request = mockRequest(url);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalled();
    expect(Array.isArray(result.json)).toBe(true);
    expect(result.json.length).toBeGreaterThan(0);
    expect(result.json[0]).toHaveProperty("planCode");
    expect(result.json[0]).toHaveProperty("productDetail");
  });

  it("should handle GetProductMain returns sorted mock data", async () => {
    const url = `http://localhost/api/direct/route?action=GetProductMain`;
    const request = mockRequest(url);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalled();
    expect(Array.isArray(result.json)).toBe(true);
    expect(result.json[0]).toHaveProperty("id");
    expect(result.json[0]).toHaveProperty("name");
  });

  it("should handle GetProductMainAndSub returns sorted mock data", async () => {
    const url = `http://localhost/api/direct/route?action=GetProductMainAndSub`;
    const request = mockRequest(url);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalled();
    expect(Array.isArray(result.json)).toBe(true);
    expect(result.json[0]).toHaveProperty("id");
    expect(result.json[0]).toHaveProperty("subData");
  });

  it("should handle GetProfileByProductId returns sorted mock data", async () => {
    const url = `http://localhost/api/direct/route?action=GetProfileByProductId`;
    const request = mockRequest(url);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalled();
    expect(Array.isArray(result.json)).toBe(true);
    expect(result.json[0]).toHaveProperty("id");
    expect(result.json[0]).toHaveProperty("name");
  });

  it("should handle GetProfileBannerById returns sorted mock data", async () => {
    const url = `http://localhost/api/direct/route?action=GetProfileBannerById`;
    const request = mockRequest(url);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalled();
    expect(Array.isArray(result.json)).toBe(true);
    expect(result.json[0]).toHaveProperty("id");
    expect(result.json[0]).toHaveProperty("type");
  });

  it("should handle GetContactById returns sorted mock data", async () => {
    const url = `http://localhost/api/direct/route?action=GetContactById`;
    const request = mockRequest(url);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalled();
    expect(Array.isArray(result.json)).toBe(true);
    expect(result.json[0]).toHaveProperty("id");
    expect(result.json[0]).toHaveProperty("name");
  });

  it("should handle GetPromotionById returns sorted mock data", async () => {
    const url = `http://localhost/api/direct/route?action=GetPromotionById`;
    const request = mockRequest(url);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalled();
    expect(Array.isArray(result.json)).toBe(true);
    expect(result.json[0]).toHaveProperty("id");
    expect(result.json[0]).toHaveProperty("type");
  });

  it("should handle ProductRecordApprove with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=ProductRecordApprove`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/ProductRecordApprove`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle ProductRecordApprove with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=ProductRecordApprove`;
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

  /*   it("should handle GenerateReportByApplicationCode with PDF response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GenerateReportByApplicationCode`;
    axios.post.mockResolvedValue({
      status: 200,
      data: "pdf-data",
      headers: { "content-type": "application/pdf" },
    });

    // Patch NextResponse to allow instantiation for this test
    const RealNextResponse = jest.requireActual("next/server").NextResponse;
    global.Headers = jest.fn(() => ({
      set: jest.fn(),
    }));

    jest.spyOn(global, "Headers").mockImplementation(() => {
      return {
        set: jest.fn(),
      };
    });

    // Patch NextResponse constructor for this test
    const nextResponseSpy = jest.spyOn(require("next/server"), "NextResponse");

    const request = mockRequest(url, reqBody);
    await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GenerateReportByApplicationCode`,
      reqBody,
      expect.objectContaining({
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "arraybuffer",
      })
    );
    nextResponseSpy.mockRestore();
  }); */

  it("should handle GenerateReportByApplicationCode with non-PDF response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GenerateReportByApplicationCode`;
    axios.post.mockResolvedValue({
      status: 200,
      data: "not-pdf",
      headers: { "content-type": "application/json" },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "ไม่พบไฟล์ PDF" },
      { status: 400 }
    );
    expect(result.json).toEqual({ error: "ไม่พบไฟล์ PDF" });
  });

  it("should handle GetProductSaleCardListById with 200 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetProductSaleCardListById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [1, 2] },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}BackOffice/GetProductSaleCardListById`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([1, 2]);
    expect(result.json).toEqual([1, 2]);
  });

  it("should handle GetProductSaleCardListById with 204 response", async () => {
    const reqBody = { foo: "bar" };
    const url = `http://localhost/api/direct/route?action=GetProductSaleCardListById`;
    axios.post.mockResolvedValue({
      status: 204,
      data: {},
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith([]);
    expect(result.json).toEqual([]);
  });

  /*   it("should handle PreviewPolicy returns PDF response", async () => {
    const reqBody = { fileName: "test.pdf", pdfUrl: "http://mock.pdf" };
    const url = `http://localhost/api/direct/route?action=PreviewPolicy`;

    // Mock fetch and blob
    const mockBlob = new Blob(["test"], { type: "application/pdf" });
    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    // Patch NextResponse constructor for this test
    const RealNextResponse = jest.requireActual("next/server").NextResponse;
    const nextResponseSpy = jest.spyOn(require("next/server"), "NextResponse");

    const request = mockRequest(url, reqBody);
    await POST(request);

    expect(global.fetch).toHaveBeenCalledWith("http://mock.pdf");
    nextResponseSpy.mockRestore();
  });*/

  it("should handle getProductApplicationTemplateById with 200 response", async () => {
    const reqBody = { productId: 123 };
    const url = `http://localhost/api/direct/route?action=getProductApplicationTemplateById`;
    const mockData = { foo: "bar" };
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: mockData },
    });

    const request = mockRequest(url, reqBody);
    const result = await POST(request);

    expect(request.json).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Products/GetProductApplicationTemplateById`,
      reqBody,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockData);
    expect(result.json).toEqual(mockData);
  });

  it("should handle getProductApplicationTemplateById with 204 response", async () => {
    const reqBody = { productId: 123 };
    const url = `http://localhost/api/direct/route?action=getProductApplicationTemplateById`;
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

  it("should use empty string if no access token cookie", async () => {
    cookies.mockReturnValue(mockCookieStore(undefined));
    const reqBody = { productId: 123 };
    const url = `http://localhost/api/direct/route?action=getProductApplicationTemplateById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: { foo: "bar" } },
    });

    const request = mockRequest(url, reqBody);
    await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Products/GetProductApplicationTemplateById`,
      reqBody,
      { headers: { Authorization: "Bearer " } }
    );
  });
  it("should handle getApplicationTemplateById with 200 response", async () => {
    const url = `http://localhost/api/direct/route?action=getApplicationTemplateById`;
    const mockApiData = [
      { app_temp_id: 1, app_temp_name: "Template 1" },
      { app_temp_id: 2, app_temp_name: "Template 2" },
    ];
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: mockApiData },
    });

    const request = mockRequest(url);
    const result = await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Products/GetApplicationTemplateById`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith([
      {
        app_temp_id: 1,
        app_temp_name: "Template 1",
        id: 1,
        label: "Template 1",
      },
      {
        app_temp_id: 2,
        app_temp_name: "Template 2",
        id: 2,
        label: "Template 2",
      },
    ]);
    expect(result.json).toEqual([
      {
        app_temp_id: 1,
        app_temp_name: "Template 1",
        id: 1,
        label: "Template 1",
      },
      {
        app_temp_id: 2,
        app_temp_name: "Template 2",
        id: 2,
        label: "Template 2",
      },
    ]);
  });

  it("should handle getApplicationTemplateById with 204 response", async () => {
    const url = `http://localhost/api/direct/route?action=getApplicationTemplateById`;
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
    const url = `http://localhost/api/direct/route?action=getApplicationTemplateById`;
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [] },
    });

    const request = mockRequest(url);
    await POST(request);

    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}Products/GetApplicationTemplateById`,
      { headers: { Authorization: "Bearer " } }
    );
  });
});
