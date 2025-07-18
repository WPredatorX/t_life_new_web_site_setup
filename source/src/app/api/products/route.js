import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { APPLICATION_DEFAULT } from "@/constants";

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
    case "getProducts":
      body = await request.json();
      data = {
        products: [],
        current_page: APPLICATION_DEFAULT.dataGrid.pageNumber,
        page_size: APPLICATION_DEFAULT.dataGrid.pageSize,
        total_records: 0,
      };

      response = await axios.post(`${baseUrl}BackOffice/GetAllProduct`, body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);
    case "getInsurancePlan":
      productId = url.searchParams.get("IPackage");
      response = await axios.post(
        `${baseUrl}BackOffice/GetAllInsurancePlans?IPackage=${productId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "getProductDocument":
      response = await axios.post(`${baseUrl}BackOffice/GetProductDocument`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      data = Array.from(response.data?.data || []).map((item) => {
        return { ...item, id: item.document_id, label: item.document_name };
      });

      return NextResponse.json(data);
    case "AddOrUpdateProductOnShelf":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/AddOrUpdateProductOnShelf`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "GetProductOnShelfById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetProductOnShelfById`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "getAllInsuredCapital":
      productId = url.searchParams.get("IPackage");
      response = await axios.post(
        `${baseUrl}BackOffice/GetAllInsuredCapital?IPackage=${productId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "getDocumentAppDetailById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetDocumentAppDetailById`,
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

    case "PreviewReportByDocumentCode":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/PreviewReportByDocumentCode`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          responseType: "arraybuffer",
        }
      );

      if (response.headers["content-type"]?.includes("application/pdf")) {
        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");
        return new NextResponse(response.data, {
          status: 200,
          headers: headers,
        });
      } else {
        return NextResponse.json({ error: "ไม่พบไฟล์ PDF" }, { status: 400 });
      }

    case "AddOrUpdatePolicyholderDocuments":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/AddOrUpdatePolicyholderDocuments`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "addOrUpdateProductDocument":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/AddOrUpdateDocumentAppDetail`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "getPolicyholderDocumentsById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetPolicyholderDocumentsById`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "getCalTemplate":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Products/GetDisplayTemplateById`,
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

    case "AddOrUpdateDisplayCalculateTemplate":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Products/AddOrUpdateDisplayCalculateTemplate`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);
  }
}
