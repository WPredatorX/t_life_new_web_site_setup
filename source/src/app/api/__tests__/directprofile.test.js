import { POST } from "../direct/profile/route";
import { NextResponse } from "next/server";
import axios from "axios";

jest.mock("axios");
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));
jest.mock("next/server", () => {
  const mockConstructor = jest.fn().mockImplementation((data, init) => ({
    data,
    ...init,
  }));

  mockConstructor.json = jest.fn((data) => ({ json: data }));
  mockConstructor.redirect = jest.fn((url) => ({ redirect: url }));

  return {
    NextResponse: mockConstructor,
  };
});

const mockCookies = {
  get: jest.fn(() => ({ value: "mocked-token" })),
};

const mockRequest = (
  action,
  body = {},
  url = "http://localhost/api/direct/profile/route"
) => {
  const u = new URL(url + "?action=" + action);
  return {
    url: u.toString(),
    json: jest.fn().mockResolvedValue(body),
  };
};

beforeEach(() => {
  jest.clearAllMocks();
  require("next/headers").cookies.mockReturnValue(mockCookies);
  process.env.NEXT_PUBLIC_APPLICATION_TOKEN_COOKIES_NAME = "token";
  process.env.NEXT_PUBLIC_APPLICATION_API = "http://api/";
});

describe("POST handler", () => {
  it("handles GetBrokersProfileById", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: { id: 1 } } });
    const req = mockRequest("GetBrokersProfileById", { brokerId: 1 });
    const res = await POST(req);
    expect(axios.post).toHaveBeenCalledWith(
      "http://api/DisplayProfile/GetBrokersProfileById",
      { brokerId: 1 },
      { headers: { Authorization: "Bearer mocked-token" } }
    );
    expect(NextResponse.json).toHaveBeenCalledWith({ id: 1 });
    expect(res.json).toEqual({ id: 1 });
  });

  it("handles GetAllBrokerDDL with 204", async () => {
    axios.post.mockResolvedValue({ status: 204 });
    const req = mockRequest("GetAllBrokerDDL");
    const res = await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith([]);
    expect(res.json).toEqual([]);
  });

  it("handles GetAllBrokerDDL with 200 data null", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: null } });
    const req = mockRequest("GetAllBrokerDDL");
    const res = await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith([]);
    expect(res.json).toEqual([]);
  });

  it("handles GetAllBrokerDDL with 200", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { data: [{ broker_id: 2, broker_name: "Test" }] },
    });
    const req = mockRequest("GetAllBrokerDDL");
    const res = await POST(req);
    expect(res.json).toEqual([
      { broker_id: 2, broker_name: "Test", id: 2, label: "Test" },
    ]);
  });

  it("handles GetSocial with 204", async () => {
    axios.post.mockResolvedValue({ status: 204 });
    const req = mockRequest("GetSocial", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetSocial with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 1 }] } });
    const req = mockRequest("GetSocial", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 1 }]);
  });

  it("handles GetDisplayProducts", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 2 }] } });
    const req = mockRequest("GetDisplayProducts", { brokerId: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 2 }]);
  });

  it("handles GetDisplayProducts with 204", async () => {
    axios.post.mockResolvedValue({ status: 204, data: { data: [{ id: 2 }] } });
    const req = mockRequest("GetDisplayProducts", { brokerId: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetBrokersProfile with 204", async () => {
    axios.post.mockResolvedValue({ status: 204 });
    const req = mockRequest("GetBrokersProfile", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetBrokersProfile with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 3 }] } });
    const req = mockRequest("GetBrokersProfile", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 3 }]);
  });

  it("handles GetBrokerProfileById", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: { id: 4 } } });
    const req = mockRequest("GetBrokerProfileById", { id: 4 });
    const res = await POST(req);
    expect(res.json).toEqual({ id: 4 });
  });

  it("handles GetMainContentById with 204", async () => {
    axios.post.mockResolvedValue({ status: 204 });
    const req = mockRequest("GetMainContentById", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetMainContentById with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 5 }] } });
    const req = mockRequest("GetMainContentById", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 5 }]);
  });

  it("handles PreviewBanner for png", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue("blobdata"),
    });
    const req = mockRequest("PreviewBanner", {
      fileName: "banner.png",
      fileUrlPreview: "http://file",
    });
    const res = await POST(req);
    expect(global.fetch).toHaveBeenCalledWith("http://file");
    expect(res.headers["Content-Type"]).toBe("image/png");
    expect(res.headers["Content-Disposition"]).toContain("banner.png");
  });

  it("handles PreviewBanner for jpg", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue("blobdata"),
    });
    const req = mockRequest("PreviewBanner", {
      fileName: "banner.jpg",
      fileUrlPreview: "http://file",
    });
    const res = await POST(req);
    expect(global.fetch).toHaveBeenCalledWith("http://file");
    expect(res.headers["Content-Type"]).toBe("image/jpeg");
    expect(res.headers["Content-Disposition"]).toContain("banner.jpg");
  });

  it("handles PreviewBanner for jpeg", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue("blobdata"),
    });
    const req = mockRequest("PreviewBanner", {
      fileName: "banner.jpeg",
      fileUrlPreview: "http://file",
    });
    const res = await POST(req);
    expect(global.fetch).toHaveBeenCalledWith("http://file");
    expect(res.headers["Content-Type"]).toBe("image/jpeg");
    expect(res.headers["Content-Disposition"]).toContain("banner.jpeg");
  });

  it("handles PreviewBanner for pdf", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue("blobdata"),
    });
    const req = mockRequest("PreviewBanner", {
      fileName: "banner.pdf",
      fileUrlPreview: "http://file",
    });
    const res = await POST(req);
    expect(global.fetch).toHaveBeenCalledWith("http://file");
    expect(res.headers["Content-Type"]).toBe("application/pdf");
    expect(res.headers["Content-Disposition"]).toContain("banner.pdf");
  });

  it("handles GetSocialById with 204", async () => {
    axios.post.mockResolvedValue({ status: 204 });
    const req = mockRequest("GetSocialById", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetSocialById with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 6 }] } });
    const req = mockRequest("GetSocialById", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 6 }]);
  });

  it("handles GetAllBrokerProfile with 204", async () => {
    axios.post.mockResolvedValue({ status: 204 });
    const req = mockRequest("GetAllBrokerProfile", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetAllBrokerProfile with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 7 }] } });
    const req = mockRequest("GetAllBrokerProfile", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 7 }]);
  });

  it("handles AddOrUpdateBrokersProfile", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: { id: 8 } } });
    const req = mockRequest("AddOrUpdateBrokersProfile", { id: 8 });
    const res = await POST(req);
    expect(res.json).toEqual({ id: 8 });
  });

  it("handles AddOrUpdateMainContent", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: { id: 9 } } });
    const req = mockRequest("AddOrUpdateMainContent", { id: 9 });
    const res = await POST(req);
    expect(res.json).toEqual({ id: 9 });
  });

  it("handles AddOrUpdateSocial", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: { id: 10 } } });
    const req = mockRequest("AddOrUpdateSocial", { id: 10 });
    const res = await POST(req);
    expect(res.json).toEqual({ id: 10 });
  });

  it("handles GetInsuranceGroup with 204", async () => {
    axios.post.mockResolvedValue({ status: 204 });
    const req = mockRequest("GetInsuranceGroup", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetInsuranceGroup with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 11 }] } });
    const req = mockRequest("GetInsuranceGroup", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 11 }]);
  });

  it("handles AddOrUpdateInsuranceGroup with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 11 }] } });
    const req = mockRequest("AddOrUpdateInsuranceGroup", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 11 }]);
  });

  it("handles AddOrUpdateInsuranceGroup with 204", async () => {
    axios.post.mockResolvedValue({ status: 204, data: { data: [{ id: 11 }] } });
    const req = mockRequest("AddOrUpdateInsuranceGroup", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetCopyMainContentById with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 11 }] } });
    const req = mockRequest("GetCopyMainContentById", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 11 }]);
  });

  it("handles GetCopyMainContentById with 204", async () => {
    axios.post.mockResolvedValue({ status: 204, data: { data: [{ id: 11 }] } });
    const req = mockRequest("GetCopyMainContentById", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });

  it("handles GetCopyInsuranceGroup with 200", async () => {
    axios.post.mockResolvedValue({ status: 200, data: { data: [{ id: 11 }] } });
    const req = mockRequest("GetCopyInsuranceGroup", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([{ id: 11 }]);
  });

  it("handles GetCopyInsuranceGroup with 204", async () => {
    axios.post.mockResolvedValue({ status: 204, data: { data: [{ id: 11 }] } });
    const req = mockRequest("GetCopyInsuranceGroup", { id: 1 });
    const res = await POST(req);
    expect(res.json).toEqual([]);
  });
});
