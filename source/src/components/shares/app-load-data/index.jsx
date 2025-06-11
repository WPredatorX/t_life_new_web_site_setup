"use client";

import { CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";

const AppLoadData = ({
  loadingState = 0, // 0 = loading, 1 = load failed
  message,
}) => {
  const theme = useTheme();
  const mappedData = [
    {
      state: 0,
      message: "กำลังโหลดข้อมูล...",
      component: <CircularProgress />,
    },
    {
      state: 1,
      message: "ไม่สามารถโหลดข้อมูลได้",
      component: (
        <HighlightOff
          fontSize="large"
          sx={{ fontSize: "5rem", color: theme.palette.primary.main }}
        />
      ),
    },
    {
      state: 2,
      message: "ไม่สามารถเข้าสู่ระบบได้",
      component: (
        <HighlightOff
          fontSize="large"
          sx={{ fontSize: "5rem", color: theme.palette.primary.main }}
        />
      ),
    },
    {
      state: 3,
      message: "ท่านไม่มีสิทธิ์การเข้าใช้งานส่วนนี้",
      component: (
        <HighlightOff
          fontSize="large"
          sx={{ fontSize: "5rem", color: theme.palette.primary.main }}
        />
      ),
    },
    {
      state: 4,
      message: "",
      component: (
        <HighlightOff
          fontSize="large"
          sx={{ fontSize: "5rem", color: theme.palette.primary.main }}
        />
      ),
    },
  ];
  const targetData = mappedData.find((item) => item.state === loadingState);

  return (
    <Grid
      container
      direction={"column"}
      my={40}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Grid item>{targetData.component}</Grid>
      <Grid item>
        <Typography variant="h2">
          {targetData.state === 4 ? message : targetData.message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AppLoadData;
