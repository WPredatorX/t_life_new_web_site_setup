"use client";

import { useMemo } from "react";
import { Box, Grid, Breadcrumbs, Link } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { useAppSelector, useAppPathname } from "@hooks";
import {
  PageLayoutHeader,
  PageLayoutMain,
  PageLayoutDrawer,
  PageLayoutAppbar,
  PageLayoutDrawerHeader,
} from ".";
import { menuItem } from "@constants";

const PageLayoutMainContent = ({ children }) => {
  const pathname = useAppPathname();
  const splitted = pathname.split("/").filter((item) => item);
  const { openDrawer } = useAppSelector((state) => state.global);

  const header = useMemo(() => <PageLayoutHeader />, []);

  const breadcrumbs = Array.from(splitted).map((item, index) => {
    // ค้นชื่อจากเมนู ถ้าไม่เจอแปลว่าเป็น Id จาก Slug
    let menu = Array.from(menuItem).find(
      (menuRow) => menuRow.key.toLowerCase() === item.toLowerCase()
    ) || {
      label: {
        th: item,
        en: item,
      },
    };

    return (
      <Link
        key={index}
        underline="hover"
        variant="subtitle2"
        color={"inherit"}
        href={item}
        sx={{
          textTransform: "capitalize",
        }}
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        {menu?.label?.th}
      </Link>
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        border: "0px solid red",
        width: "100%",
        height: "100%",
      }}
    >
      <PageLayoutAppbar position="fixed" open={openDrawer}>
        {header}
      </PageLayoutAppbar>
      <PageLayoutDrawer />
      <PageLayoutMain open={openDrawer}>
        <PageLayoutDrawerHeader />
        <Grid container sx={{ border: "0px solid red" }} mt={2} py={1} px={2}>
          {/* <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"start"}
            sx={{ border: "0px solid red" }}
          >
            <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
              {breadcrumbs}
            </Breadcrumbs>
          </Grid> */}
          <Grid item xs={12} sx={{ border: "0px solid red" }}>
            {children}
          </Grid>
        </Grid>
      </PageLayoutMain>
    </Box>
  );
};

export default PageLayoutMainContent;
