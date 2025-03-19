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
import { useAppSelector, useAppDispatch, useAppRouter } from "@hooks";
import { setOpenDrawer } from "@stores/slices";
import { APPLICATION_DEFAULT, menuItem } from "@constants";
import { PageLayoutDrawerHeader } from ".";

const PageLayoutDrawer = () => {
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const { openDrawer } = useAppSelector((state) => state.global);

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
        {menuItem.map((item, index) => (
          <ListItem
            key={item.id}
            disablePadding
            onClick={() => handleRedirect(item.href)}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label.th} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default PageLayoutDrawer;
