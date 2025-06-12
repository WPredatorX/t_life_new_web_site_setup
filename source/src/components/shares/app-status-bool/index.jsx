"use client";

import { Chip } from "@mui/material";
const AppStatusBool = ({ status, statusText }) => {
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

  return <Chip sx={{ width: "8rem" }} color={getColor()} label={statusText} />;
};

export default AppStatusBool;
