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
    case "getPromotion":
      body = await request.json();
      productId = url.searchParams.get("productId") || null;
      response = await axios.post(`${baseUrl}Products/GetPromotionById`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        data = response.data?.data;
      }
      if (response.status === 204) {
        data = [];
      }
      return NextResponse.json(data);

    case "AddOrUpdatePromotion":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Products/AddOrUpdatePromotion`,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      data = response.data?.data;
      return NextResponse.json(data);
  }
}
