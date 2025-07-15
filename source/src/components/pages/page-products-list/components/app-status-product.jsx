"use client";

import { Chip } from "@mui/material";

const AppStatusProduct = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case "เปิดใช้งาน":
        return "success";
      case "ยกเลิกใช้งาน":
        return "error";
      case "แบบร่าง":
        return "info";
      default:
        return "info";
    }
  };

  return <Chip sx={{ width: "8rem" }} color={getColor()} label={status} />;
};

export default AppStatusProduct;
