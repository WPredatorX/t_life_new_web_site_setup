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
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetBrokerGeneralInfoList`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
        return NextResponse.json(data);
      }
      if (response.status === 204) {
        return NextResponse.json([]);
      }
  }
}
