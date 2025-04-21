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
  let brokerId = null;
  switch (action) {
    case "GetBrokerProfiles":
      brokerId = url.searchParams.get("brokerId");
      response = await axios.post(
        `${baseUrl}BackOffice/GetBrokerProfiles?brokerId=${brokerId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);
    case "GetMainBodyById":
      body = await request.json();
      response = await axios.post(`${baseUrl}BackOffice/GetMainBodyById`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      });
      if (response.status === 200) {
        data = Array.from(response.data?.data || []).map((item) => {
          return {
            ...item,
            label: item.topic_mode,
          };
        });
      }
      return NextResponse.json(data);
    case "GetSubBodyContentByMainBodyIdAndSaleId":
      let SaleChannelId = url.searchParams.get("SaleChannelId");
      let MainBodyId = url.searchParams.get("mainBodyId");
      response = await axios.post(
        `${baseUrl}Home/GetSubBodyContentByMainBodyIdAndSaleId?mainBodyId=${MainBodyId}&ProductSaleChannelId=${SaleChannelId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      if (response.status === 204) {
        return NextResponse.json({ status: 204, message: "ไม่พบข้อมูล" });
      }
      console.log(data);
      return NextResponse.json(data);
    case "GetContentSectionItemsById":
      body = await request.json();
      response = await axios.post(`${baseUrl}BackOffice/GetContentSectionItemsById`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      });
      if (response.status === 200) {
        data = response.data?.data;
        console.log(data)
      }
      if (response.status === 204) {
        return NextResponse.json({ status: 204, message: "ไม่พบข้อมูล" });
      }
      return NextResponse.json(data);
    case "AddOrUpdateContentSection":
      body = await request.json();
      response = await axios.post(`${baseUrl}BackOffice/AddOrUpdateContentSection`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      });
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);
  }
}
