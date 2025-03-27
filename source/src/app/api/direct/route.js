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
  switch (action) {
    case "GetDirectGeneralInfo":
      response = await axios.post(`${baseUrl}BackOffice/GetDirectGeneralInfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        data = response.data?.data;
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
    case "getProductFromDirectWithMultiParam":
      //productId = url.searchParams.get("productId");
      /* response = await axios.post(
          `${baseUrl}Products/GetProductById?SaleChannelId=${productId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        data = response.data?.data; */
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
  }
}
