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
    case "GetDirectGeneralInfo":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetDirectGeneralInfo`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
        data = data.sort((a, b) => a.template_code - b.template_code);
      }
      return NextResponse.json(data);

    case "TestSendMail":
      body = await request.json();
      response = await axios.post(`${baseUrl}BackOffice/SendEmailTest`, body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        data = response.data;
      }
      return NextResponse.json(data);

    case "getAllProductSaleDirect":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetAllProductSaleDirect`,
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

    case "getProductSalePeriodById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Products/GetProductSalePeriodById`,
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

    case "getPaymentModeById":
      response = await axios.post(`${baseUrl}Payment/GetPaymentModeById`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        data = Array.from(response.data?.data || []).map((item) => {
          return {
            ...item,
            id: item.payment_mode_id,
            label: item.payment_mode_description,
          };
        });
      }

      if (response.status === 204) {
        return NextResponse.json({ status: 204, message: "ไม่พบข้อมูล" });
      }
      return NextResponse.json(data);
    case "getProductPaymentModeById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Payment/GetProductPaymentModeById`,
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

    case "getProductPaymentMethodsById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Payment/GetProductPaymentMethodsById`,
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

    case "getPaymentChannelById":
      response = await axios.post(`${baseUrl}Payment/GetPaymentChannelById`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        data = Array.from(response.data?.data || []).map((item) => {
          return {
            ...item,
            id: item.payment_id,
            label: item.payment_name,
          };
        });
      }

      if (response.status === 204) {
        return NextResponse.json({ status: 204, message: "ไม่พบข้อมูล" });
      }
      return NextResponse.json(data);

    case "getInstallmentTypeById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Payment/GetInstallmentTypeById`,
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

    case "getProductApplicationTemplateById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Products/GetProductApplicationTemplateById`,
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

    case "getApplicationTemplateById":
      response = await axios.post(
        `${baseUrl}Products/GetApplicationTemplateById`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        data = Array.from(response.data?.data || []).map((item) => {
          return {
            ...item,
            id: item.app_temp_id,
            label: item.app_temp_name,
          };
        });
      }

      if (response.status === 204) {
        return NextResponse.json({ status: 204, message: "ไม่พบข้อมูล" });
      }
      return NextResponse.json(data);

    case "AddOrUpdateDirect":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/AddOrUpdateDirect`,
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

    case "getSaleConditionByProductId":
      productId = url.searchParams.get("productId");
      body = {
        product_sale_channel_id: productId,
      };
      response = await axios.post(
        `${baseUrl}BackOffice/GetConditionProductSale`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "AddOrUpdateProductPlanByChannel":
      body = await request.json();

      response = await axios.post(
        `${baseUrl}Products/AddOrUpdateProductPlanByChannel`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        data = response.data?.data;
      }
      return NextResponse.json(data);

    case "AddOrUpdateProductSalePeriod":
      body = await request.json();
      console.log("AddOrUpdateProductSalePeriod", body);
      response = await axios.post(
        `${baseUrl}Products/AddOrUpdateProductSalePeriod`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      data = response.data?.data;
      return NextResponse.json(data);

    case "AddOrUpdateProductPaymentMode":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Payment/AddOrUpdateProductPaymentMode`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      data = response.data?.data;
      return NextResponse.json(data);

    case "AddOrUpdateProductPaymentMethods":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Payment/AddOrUpdateProductPaymentMethods`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      data = response.data?.data;
      return NextResponse.json(data);

    case "AddOrUpdateInstallmentType":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Payment/AddOrUpdateInstallmentType`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      data = response.data?.data;
      return NextResponse.json(data);

    case "AddOrUpdateProductApplicationTemplate":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}Products/AddOrUpdateProductApplicationTemplate`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      data = response.data?.data;
      return NextResponse.json(data);

    case "GetAllProductSaleGroupRider":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetAllProductSaleGroupRider`,
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

    case "GetAllProductSaleRiderDirect": //ไม่มีกลุ่ม
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetAllProductSaleRiderDirect`,
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

    case "GetListProductSaleRider":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetListProductSaleRider`,
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

    case "getProductFromDirectWithMultiParam":
      data = [
        {
          planCode: "04-02-11",
          name: "Super Saving 2/1",
          productDetail: [
            {
              id: "01",
              status: 3,
              statusText: "เปิดใช้งาน",
              channel: "Broker",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "03-01-12",
          name: "Super Saving 3/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              channel: "Broker",
              statusText: "รออนุมัติ",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "04-01-12",
          name: "Super Saving 4/1",
          productDetail: [
            {
              id: "04",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "05-01-12",
          name: "Super Saving 5/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "06-01-12",
          name: "Super Saving 6/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "07-01-12",
          name: "Super Saving 7/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "08-01-12",
          name: "Super Saving 8/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "09-01-12",
          name: "Super Saving 9/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "10-01-12",
          name: "Super Saving 10/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "11-01-12",
          name: "Super Saving 11/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          planCode: "12-01-12",
          name: "Super Saving 12/1",
          productDetail: [
            {
              id: "01",
              status: 1,
              statusText: "แบบร่าง",
              channel: "Direct",
              InsuredSumFrom: 100000.0,
              InsuredSumTo: 10000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "02",
              status: 4,
              statusText: "ยกเลิกใช้งาน",
              channel: "Direct",
              InsuredSumFrom: 0.0,
              InsuredSumTo: 0.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: "03",
              status: 2,
              statusText: "รออนุมัติ",
              channel: "Broker",
              InsuredSumFrom: 20000.0,
              InsuredSumTo: 2000000.0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
      ];
      return NextResponse.json(data);
    case "GetProductMain":
      data = [
        {
          id: 1,
          name: "Super Saving 2/1",
          status: 1,
          statusText: "แบบร่าง",
          minimumInsured: 0.0,
          maximumInsured: 0.0,
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          name: "Super Saving 3/1",
          status: 2,
          statusText: "รออนุมัติ",
          minimumInsured: 20000.0,
          maximumInsured: 2000000.0,
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(
        data.sort((a, b) => a.updateDate - b.updateDate)
      );
    case "GetProductMainAndSub":
      data = [
        {
          id: 1,
          name: "Super Saving 3/1",
          subData: [
            {
              id: 1,
              name: "Super Saving 3/1 (Package) 10 ปี",
              status: 1,
              statusText: "แบบร่าง",
              minimumInsured: 0.0,
              maximumInsured: 0.0,
              type: 2,
              Group: 1,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
            {
              id: 2,
              name: "Super Saving 3/1 (Package) 5 ปี",
              status: 1,
              statusText: "แบบร่าง",
              minimumInsured: 0.0,
              maximumInsured: 0.0,
              type: 2,
              Group: 1,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
        {
          id: 2,
          name: "ไม่มีกลุ่ม",
          subData: [
            {
              id: 1,
              name: "Super Saving 3/1 (Package) 15 ปี",
              status: 1,
              statusText: "แบบร่าง",
              minimumInsured: 0.0,
              maximumInsured: 0.0,
              type: 2,
              Group: 0,
              createBy: "admin",
              createDate: new Date(),
              updateBy: "admin",
              updateDate: new Date(),
            },
          ],
        },
      ];
      return NextResponse.json(
        data.sort((a, b) => a.updateDate - b.updateDate)
      );
    case "GetProfileByProductId":
      data = [
        {
          id: "01",
          name: "โปรไฟล์ V2",
          status: 2,
          statusText: "รออนุมัติ",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: "02",
          name: "โปรไฟล์ V1.5",
          status: 4,
          statusText: "ยกเลิกการใช้งาน",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: "03",
          name: "โปรไฟล์ V1.8",
          status: 4,
          statusText: "ยกเลิกการใช้งาน",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: "04",
          name: "โปรไฟล์ V1",
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
    case "GetProfileBannerById":
      data = [
        {
          id: 1,
          type: "Image",
          url: "Content.url",
          status: 4,
          statusText: "ยกเลิกการใช้งาน",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          type: "Image",
          url: "Content.url.1",
          status: 3,
          statusText: "เปิดใช้งาน",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 3,
          type: "Image",
          url: "Content.url.2",
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
    case "GetContactById":
      data = [
        {
          id: 1,
          name: "Broker 2 Line",
          icon: "",
          url: "line.url",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 2,
          name: "Broker 2 Facebook",
          icon: "",
          url: "Facebook.url",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 3,
          name: "Broker 2 Tiktok",
          icon: "",
          url: "Tiktok.url",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 4,
          name: "Broker 2 Instagram",
          icon: "",
          url: "Instagram.url",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: 5,
          name: "Broker 2 Youtube",
          icon: "",
          url: "Youtube.url",
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(
        data.sort((a, b) => a.updateDate - b.updateDate)
      );
    case "GetPromotionById":
      data = [
        {
          id: "promotion_0002",
          status: 3,
          statusText: "เปิดใช้งาน",
          type: "Percent",
          discountPer: 30.0,
          discount: 0,
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: "promotion_0001",
          status: 1,
          statusText: "แบบร่าง",
          type: "Percent",
          discountPer: 10.0,
          discount: 0,
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: "promotion_0003",
          status: 2,
          statusText: "รออนุมัติ",
          type: "Percent",
          discountPer: 20.0,
          discount: 0,
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
        {
          id: "promotion_0004",
          status: 4,
          statusText: "ยกเลิกการใช้งาน",
          type: "Amount",
          discountPer: 0,
          discount: 1000,
          createBy: "admin",
          createDate: new Date(),
          updateBy: "admin",
          updateDate: new Date(),
        },
      ];
      return NextResponse.json(
        data.sort((a, b) => a.updateDate - b.updateDate)
      );

    case "ProductRecordApprove":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/ProductRecordApprove`,
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

    case "GenerateReportByApplicationCode":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GenerateReportByApplicationCode`,
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

    case "GetProductSaleCardListById":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetProductSaleCardListById`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) data = response.data?.data;
      if (response.status === 204) data = [];
      return NextResponse.json(data);

    case "PreviewPolicy":
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
  }
}
