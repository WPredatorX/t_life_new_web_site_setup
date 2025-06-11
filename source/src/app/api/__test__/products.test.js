import { POST } from "../products/route";
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
  const url = `http://localhost/api/products/route?${urlParams}action=${action}`;
  return {
    url,
    json: jest.fn().mockResolvedValue(body),
  };
};

describe("POST /api/products/route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("next/headers").cookies.mockReturnValue(mockCookies);
    process.env.NEXT_PUBLIC_APPLICATION_API = "http://mock-api/";
    process.env.NEXT_PUBLIC_APPLICATION_TOKEN_COOKIES_NAME = "token";
  });

  it("should handle getProducts with 200", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [{ id: 1 }, { id: 2 }] },
    });
    const req = createRequest("getProducts", { foo: "bar" });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/GetAllProduct",
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

  it("should handle getInsurancePlan with 200", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [{ id: 3 }] },
    });
    const req = createRequest("getInsurancePlan", {}, "IPackage=123&");
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/GetAllInsurancePlans?IPackage=123",
      expect.any(Object)
    );
    expect(NextResponse.json).toHaveBeenCalledWith([{ id: 3 }]);
    expect(res).toBeDefined();
  });

  it("should handle getProductDocument", async () => {
    axios.post.mockResolvedValue({
      data: { data: [{ document_id: 1, document_name: "doc1" }] },
    });
    const req = createRequest("getProductDocument");
    const res = await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith([
      { document_id: 1, document_name: "doc1", id: 1, label: "doc1" },
    ]);
    expect(res).toBeDefined();
  });

  it("should handle AddOrUpdateProductOnShelf", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: { id: 10 } },
    });
    const req = createRequest("AddOrUpdateProductOnShelf", { foo: "bar" });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/AddOrUpdateProductOnShelf",
      { foo: "bar" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 10 });
    expect(res).toBeDefined();
  });

  it("should handle GetProductOnShelfById", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: { id: 11 } },
    });
    const req = createRequest("GetProductOnShelfById", { foo: "bar" });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/GetProductOnShelfById",
      { foo: "bar" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 11 });
    expect(res).toBeDefined();
  });

  it("should handle getAllInsuredCapital", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [{ id: 5 }] },
    });
    const req = createRequest("getAllInsuredCapital", {}, "IPackage=456&");
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/GetAllInsuredCapital?IPackage=456",
      expect.any(Object)
    );
    expect(NextResponse.json).toHaveBeenCalledWith([{ id: 5 }]);
    expect(res).toBeDefined();
  });

  it("should handle getDocumentAppDetailById", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: { id: 6 } },
    });
    const req = createRequest("getDocumentAppDetailById", { foo: "bar" });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/GetDocumentAppDetailById",
      { foo: "bar" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 6 });
    expect(res).toBeDefined();
  });

  /*   it("should handle PreviewReportByDocumentCode with PDF", async () => {
    const pdfBuffer = Buffer.from("PDFDATA");
    axios.post.mockResolvedValue({
      data: pdfBuffer,
      headers: { "content-type": "application/pdf" },
    });
    const req = createRequest("PreviewReportByDocumentCode", { foo: "bar" });
    const res = await POST(req);
    expect(res).toBeDefined();
    // Should return a NextResponse with PDF data
  }); */

  it("should handle PreviewReportByDocumentCode with non-PDF", async () => {
    axios.post.mockResolvedValue({
      data: {},
      headers: { "content-type": "application/json" },
    });
    const req = createRequest("PreviewReportByDocumentCode", { foo: "bar" });
    const res = await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "ไม่พบไฟล์ PDF" },
      { status: 400 }
    );
    expect(res).toBeDefined();
  });

  it("should handle AddOrUpdatePolicyholderDocuments", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: { id: 7 } },
    });
    const req = createRequest("AddOrUpdatePolicyholderDocuments", {
      foo: "bar",
    });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/AddOrUpdatePolicyholderDocuments",
      { foo: "bar" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 7 });
    expect(res).toBeDefined();
  });

  it("should handle addOrUpdateProductDocument", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: { id: 8 } },
    });
    const req = createRequest("addOrUpdateProductDocument", { foo: "bar" });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/AddOrUpdateDocumentAppDetail",
      { foo: "bar" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 8 });
    expect(res).toBeDefined();
  });

  it("should handle getSalePaidCategoryByProductId", async () => {
    const req = createRequest(
      "getSalePaidCategoryByProductId",
      {},
      "productId=1&"
    );
    const res = await POST(req);
    expect(NextResponse.json).toHaveBeenCalled();
    expect(res).toBeDefined();
  });

  it("should handle getPrepaymentByProductId", async () => {
    const req = createRequest("getPrepaymentByProductId", {}, "productId=1&");
    const res = await POST(req);
    expect(NextResponse.json).toHaveBeenCalled();
    expect(res).toBeDefined();
  });

  it("should handle getTemplateByProductId", async () => {
    const req = createRequest("getTemplateByProductId", {}, "productId=1&");
    const res = await POST(req);
    expect(NextResponse.json).toHaveBeenCalled();
    expect(res).toBeDefined();
  });

  it("should handle เetPolicyholderDocumentsById", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: { id: 9 } },
    });
    const req = createRequest("เetPolicyholderDocumentsById", { foo: "bar" });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-api/BackOffice/GetPolicyholderDocumentsById",
      { foo: "bar" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      })
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 9 });
    expect(res).toBeDefined();
  });

  it("should return undefined for unknown action", async () => {
    const req = createRequest("unknownAction", {});
    const res = await POST(req);
    expect(res).toBeUndefined();
  });
});
