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
      response = await axios.post(
        `${baseUrl}BackOffice/GetContentSectionItemsById`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      if (response.status === 204) {
        return NextResponse.json({ status: 204, message: "ไม่พบข้อมูล" });
      }
      return NextResponse.json(data);

    case "GetProductSaleCardByProductSaleId":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetProductSaleCardByProductSaleId`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetCopyProfileProductSaleCardId":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetCopyProfileProductSaleCardId`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      if (response.status === 204) {
        data = [];
      }
      return NextResponse.json(data);

    case "PreviewBrochure":
      body = await request.json();
      const fileName = body?.fileName;
      const pdfUrl = body?.pdfUrl;
      const res = await fetch(pdfUrl);
      const blob = await res.blob();
      return new NextResponse(blob, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
            fileName
          )}`,
        },
      });

    case "GetMainProductSaleCardId":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetMainProductSaleCardId`,
        body,
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
      return NextResponse.json(data);

    case "AddOrUpdateProfileProductSaleCard":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/AddOrUpdateProfileProductSaleCard`,
        body,
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
      return NextResponse.json(data);

    case "AddOrUpdateContentSection":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/AddOrUpdateContentSection`,
        body,
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
      return NextResponse.json(data);

    case "AddOrUpdateProductSaleStatusGroup":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/AddOrUpdateProductSaleStatusGroup`,
        body,
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
      return NextResponse.json(data);

    case "DeleteContentSection":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/DeleteContentSection`,
        body,
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
      return NextResponse.json(data);
  }
}
