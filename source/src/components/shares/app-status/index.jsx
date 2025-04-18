"use client";

import { Chip } from "@mui/material";

const AppStatus = ({ status, statusText }) => {
  const getColor = () => {
    let MainStatus = parseInt(status);
    switch (MainStatus) {
      case 1:
        return "primary";
      case 2:
        return "warning";
      case 3:
        return "success";
      case 4:
        return "error";
      case 5:
        return "primary";
      default:
        return "info";
    }
  };

  return <Chip sx={{ width: "8rem" }} color={getColor()} label={statusText} />;
};

export default AppStatus;
