import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(
    process.env.NEXT_PUBLIC_APPLICATION_TOKEN_COOKIES_NAME
  )?.value;
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
    case "GetBrokersProfileById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetBrokersProfileById`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetAllBrokerDDL":
      response = await axios.post(`${baseUrl}BackOffice/GetAllBrokerDDL`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = Array.from(response.data?.data || []).map((item) => {
          return {
            ...item,
            id: item.broker_id,
            label: item.broker_name,
          };
        });
      }
      return NextResponse.json(data);

    case "GetSocial":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetSocialById`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetDisplayProducts":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetDisplayProducts`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetBrokersProfile":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetBrokersProfile`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetBrokerProfileById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetBrokerProfileById`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetMainContentById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetMainContentById`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "PreviewBanner":
      body = await request.json();
      const fileName = body?.fileName;
      const fileUrlPreview = body?.fileUrlPreview;
      const ext = fileName.split(".").pop()?.toLowerCase();
      let mimeType = "application/pdf";
      switch (ext) {
        case "png":
          mimeType = "image/png";
          break;
        case "jpg":
        case "jpeg":
          mimeType = "image/jpeg";
          break;
        default:
          mimeType = "application/pdf";
          break;
      }
      const res = await fetch(fileUrlPreview);
      const blob = await res.blob();
      return new NextResponse(blob, {
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
            fileName
          )}`,
        },
      });

    case "GetSocialById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetSocialById`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetAllBrokerProfile":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetAllBrokerProfile`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "AddOrUpdateBrokersProfile":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/AddOrUpdateBrokersProfile`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "AddOrUpdateMainContent":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/AddOrUpdateMainContent`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "AddOrUpdateSocial":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/AddOrUpdateSocial`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetInsuranceGroup":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetInsuranceGroup`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "AddOrUpdateInsuranceGroup":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/AddOrUpdateInsuranceGroup`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetCopyMainContentById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetCopyMainContentById`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetCopyInsuranceGroup":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}DisplayProfile/GetCopyInsuranceGroup`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 204) {
        data = [];
      }
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);
  }
}
