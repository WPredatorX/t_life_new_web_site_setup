import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(request) {
  const cookieStore = cookies();
  const accessToken =
    cookieStore.get(process.env.NEXT_PUBLIC_APPLICATION_TOKEN_COOKIES_NAME)
      ?.value || "";
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const baseUrl = process.env.NEXT_PUBLIC_APPLICATION_API;
  let response = null;
  let data = null;
  let body = null;
  let start = null;
  let limit = null;
  let productId = null;

  switch (action) {
    case "getProducts":
      start = url.searchParams.get("pageNumber");
      limit = url.searchParams.get("pageSize");
      response = await axios.get(
        `${baseUrl}todos?_start=${start}&_limit=${limit}`
      );
      data = response.data;
      return NextResponse.json(data);
    case "getBroker":
      /* response = await axios.post(
        `${baseUrl}Products/GetProductById?SaleChannelId=${productId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      data = response.data?.data; */
      data = [
        {
          id: 1,
          name: "ศรีกรุงประกันชีวิตโบรคเกอร์",
          email: "broker2@email.com",
          registerId: "12345",
          url: "https://broker_1.com",
          status: 3,
          statusText: "เปิดใช้งาน",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          name: "ทีโบรกเกอร์",
          email: "broker1@email.com",
          registerId: "67890",
          url: "https://broker_1.com",
          status: 3,
          statusText: "เปิดใช้งาน",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(
        data.sort((a, b) => a.updateDate - b.updateDate)
      );
  }
}
