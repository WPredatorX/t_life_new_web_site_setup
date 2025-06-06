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

  switch (action) {
    case "getUserRolesData":
      body = await request.json();
      response = await axios.post(
        `${baseUrl}BackOffice/GetUserRolesData`,
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

    case "getBlobSasToken":
      response = await axios.post(`${baseUrl}BackOffice/GetBlobSasToken`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        data = response.data?.data;
      }
      if (response.status === 204) {
        return NextResponse.json({ status: 204, message: "ไม่พบข้อมูล" });
      }
      return NextResponse.json(data);
  }
}
