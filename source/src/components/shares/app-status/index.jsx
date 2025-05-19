"use client";

import { Chip } from "@mui/material";

const AppStatus = ({ status, statusText, type = "1" }) => {
  // หน้าผลิตภัณพ์ท ี่ขาย
  const getColor = () => {
    let MainStatus = parseInt(status);
    switch (MainStatus) {
      case 1: // แบบร่าง
        return "info";
      case 2: // รออนุมัติ
        return "primary";
      case 3: // เปิดใช้งาน
        return "success";
      case 4: // ยกเลิกใช้งาน
      case 5: // ไม่อนุมัติ
        return "error";
      default: // แบบร่าง
        return "info";
    }
  };

  // หน้าผลิตภัณพ์ทั้งหมด
  const getColor2 = () => {
    let MainStatus = parseInt(status);
    switch (MainStatus) {
      case 1: // รออนุมัติ
        return "primary";
      case 2: // เปิดใช้งาน
        return "success";
      case 3: // ยกเลิกใช้งาน
        return "error";
      default: // รออนุมัติ
        return "primary";
    }
  };

  // หน้าโบรกเกอร์
  const getColor3 = () => {
    let MainStatus = parseInt(status);
    switch (MainStatus) {
      case 1: // แบบร่าง
        return "info";
      case 2: // เปิดใช้งาน
        return "success";
      case 3: // ยกเลิกใช้งาน
        return "error";
      default: // แบบร่าง
        return "info";
    }
  };

  // หน้าโปรไฟล์ผลิตภัณฑ์
  const getColor4 = () => {
    let MainStatus = parseInt(status);
    switch (MainStatus) {
      case 1: // แบบร่าง
        return "info";
      case 2: // รออนุมัติ
        return "primary";
      case 3: // เปิดใช้งาน
        return "success";
      case 4: // ยกเลิกใช้งาน
      case 5: // ไม่อนุมัติ
        return "error";
      default: // แบบร่าง
        return "info";
    }
  };

  const getColorFunction = () => {
    let colorResult = "info";

    switch (type) {
      case "1":
        colorResult = getColor();
        break;
      case "2":
        colorResult = getColor2();
        break;
      case "3":
        colorResult = getColor3();
        break;
      case "4":
        colorResult = getColor4();
        break;
      default:
        colorResult = getColor();
        break;
    }

    return colorResult;
  };

  return (
    <Chip
      sx={{ width: "8rem" }}
      color={getColorFunction()}
      label={statusText}
    />
  );
};

export default AppStatus;
