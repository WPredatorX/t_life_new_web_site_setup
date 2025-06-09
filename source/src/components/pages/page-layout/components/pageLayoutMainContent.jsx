"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppSelector } from "@hooks";
import {
  PageLayoutHeader,
  PageLayoutMain,
  PageLayoutDrawer,
  PageLayoutAppbar,
  PageLayoutDrawerHeader,
} from ".";
import { menuItem } from "@constants";

const PageLayoutMainContent = ({ children }) => {
  const { openDrawer, auth } = useAppSelector((state) => state.global);
  const header = useMemo(() => <PageLayoutHeader />, []);
  const authMenus = (auth?.roles || [])?.map((role) => role.menus).flat();
  const permissionMenu = menuItem?.filter((menu) =>
    Array.from(authMenus).some(
      (authMenu) => authMenu.code.toLowerCase() === menu?.code?.toLowerCase()
    )
  );

  if (auth === null) {
    return (
      <Grid container mt={4} rowGap={2}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>กำลังโหลดข้อมูล...</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        border: "0px solid red",
        width: "100%",
        height: "100%",
      }}
    >
      {permissionMenu.length < 0 && (
        <Grid container mt={4} rowGap={2}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Close color="error" />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography>
              ท่านไม่ได้รับสิทธิ์ในการใช้งานระบบ กรุณาติดต่อแอดมิน
            </Typography>
          </Grid>
        </Grid>
      )}
      {permissionMenu.length > -1 && (
        <>
          <PageLayoutAppbar position="fixed" open={openDrawer}>
            {header}
          </PageLayoutAppbar>
          <PageLayoutDrawer menuItem={permissionMenu} />
          <PageLayoutMain open={openDrawer}>
            <PageLayoutDrawerHeader />
            <Grid
              container
              sx={{ border: "0px solid red" }}
              mt={2}
              py={1}
              px={2}
            >
              <Grid item xs={12} sx={{ border: "0px solid red" }}>
                {children}
              </Grid>
            </Grid>
          </PageLayoutMain>
        </>
      )}
    </Box>
  );
};

export default PageLayoutMainContent;
