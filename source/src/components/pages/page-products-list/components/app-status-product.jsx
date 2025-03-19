"use client";

import { Chip } from "@mui/material";

const AppStatusProduct = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case true:
        return "success";
      case false:
        return "error";
      default:
        return "primary";
    }
  };

  const getText = () => {
    switch (status) {
      case true:
        return "เปิดใช้งาน";
      case false:
        return "ยกเลิกการใช้งาน";
      default:
        return "แบบร่าง";
    }
  };
  return (
    <Chip
      sx={{ width: "8rem", color: "white" }}
      color={getColor()}
      label={getText()}
    />
  );
};

export default AppStatusProduct;
