import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { APPLICATION_DEFAULT } from "@/constants";

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
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);
    case "PreviewReportByDocumentCode":
      let docCode = url.searchParams.get("DocumentCode");
      response = await axios.post(
        `${baseUrl}BackOffice/PreviewReportByDocumentCode?DocumentCode=${docCode}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          responseType: "arraybuffer",
        }
      );

      if (response.headers["content-type"]?.includes("application/pdf")) {
        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");
        //headers.set("Content-Disposition", "inline; filename=document.pdf");
        //headers.set("Cache-Control", "no-cache");

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
    case "getSaleConditionByProductId":
      productId = url.searchParams.get("productId");
      data = {
        MinimumAgeYear: 1,
        MinimumAgeMonth: 2,
        MinimumAgeDay: 3,
        MaximumAgeYear: 60,
        MaximumAgeMonth: 10,
        MaximumAgeDay: 12,
        MinimumCoverage: 20000,
        MaximumCoverage: 2000000,
      };
      return NextResponse.json(data);
    case "getSaleRangeByProductId":
      productId = url.searchParams.get("productId");
      data = [
        {
          id: 1,
          status: 2,
          statusText: "รายการใหม่",
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          status: 3,
          statusText: "เปิดใช้งาน",
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(data);
    case "getSalePaidTypeByProductId":
      productId = url.searchParams.get("productId");
      data = [
        {
          id: 1,
          paidType: "รายเดือน",
          status: 1,
          statusText: "แบบร่าง",
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          paidType: "รายปี",
          status: 2,
          statusText: "รายการใหม่",
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 3,
          paidType: "ราย 6 เดือน",
          status: 3,
          statusText: "เปิดใช้งาน",
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(data);
    case "getSalePaidCategoryByProductId":
      productId = url.searchParams.get("productId");
      data = [
        {
          id: 1,
          paidCategory: "Qr Code",
          status: 2,
          statusText: "รายการใหม่",
          minimumCoverage: 20000,
          maximumCoverage: 20000000,
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          paidCategory: "Credit Card",
          status: 2,
          statusText: "รายการใหม่",
          minimumCoverage: 2000,
          maximumCoverage: 2000000,
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 3,
          paidCategory: "Billpayment",
          status: 2,
          statusText: "รายการใหม่",
          minimumCoverage: 200,
          maximumCoverage: 20000000,
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 4,
          paidCategory: "เงินสด",
          status: 3,
          statusText: "เปิดใช้งาน",
          minimumCoverage: 0,
          maximumCoverage: 0,
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(data);
    case "getPrepaymentByProductId":
      productId = url.searchParams.get("productId");
      data = [
        {
          id: 1,
          PrepaymentForm: "ชำระล่วงหน้า 1 งวด",
          NumberOfInstallments: 1,
          status: 2,
          statusText: "รายการใหม่",
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          PrepaymentForm: "ชำระล่วงหน้า 3 งวด",
          NumberOfInstallments: 3,
          status: 3,
          statusText: "เปิดใช้งาน",
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(data);
    case "getTemplateByProductId":
      productId = url.searchParams.get("productId");
      data = [
        {
          id: 1,
          TemplateName: "Template 1",
          status: 2,
          statusText: "รายการใหม่",
          minimumCoverage: 100,
          maximumCoverage: 10000000,
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          TemplateName: "Template 2 (expire)",
          status: 3,
          statusText: "เปิดใช้งาน",
          minimumCoverage: 200,
          maximumCoverage: 2000000,
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 3,
          TemplateName: "template ใหม่",
          status: 1,
          statusText: "แบบร่าง",
          minimumCoverage: 0,
          maximumCoverage: 0,
          StartDate: new Date(),
          EndDate: new Date(),
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(data);
  }
}
