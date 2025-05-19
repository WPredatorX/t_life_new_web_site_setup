"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  useAppSelector,
  useAppDispatch,
  useAppRouter,
  useAppPathname,
  useAppSearchParams,
} from "@hooks";
import { setOpenDrawer } from "@stores/slices";
import { APPLICATION_DEFAULT } from "@constants";
import { PageLayoutDrawerHeader } from ".";
import { useMemo } from "react";

const PageLayoutDrawer = ({ menuItem = [] }) => {
  const router = useAppRouter();
  const pathName = useAppPathname();
  const searchParams = useAppSearchParams();
  const dispatch = useAppDispatch();
  const { openDrawer } = useAppSelector((state) => state.global);
  const first = useMemo(
    () => pathName?.split("/").filter((item) => item)[0] ?? ""
  );

  const handleOpenDrawer = () => {
    dispatch(setOpenDrawer());
  };

  const handleRedirect = (url) => {
    router.push(url);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={openDrawer}
      ModalProps={{
        keepMounted: false,
      }}
      onClose={handleOpenDrawer}
      sx={{
        marginTop: "100px",
        width: APPLICATION_DEFAULT.drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: APPLICATION_DEFAULT.drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <PageLayoutDrawerHeader />
      <Divider />
      <List>
        {menuItem.map((item, index) => {
          const channel =
            searchParams.get("channel") === "606" ? "direct" : "brokers";
          const match = item?.select?.includes(
            first === "productsale" ? channel : first
          );
          return (
            <ListItem
              key={item.id}
              disablePadding
              onClick={() => handleRedirect(item.href)}
            >
              <ListItemButton selected={match}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label.th} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </Drawer>
  );
};

export default PageLayoutDrawer;
