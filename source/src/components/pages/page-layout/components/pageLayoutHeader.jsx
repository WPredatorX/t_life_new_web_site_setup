"use client";

import { useState } from "react";
import {
  Grid,
  Box,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Inbox as InboxIcon,
  Mail as MailIcon,
  MenuOpen,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@hooks";
import { setOpenDrawer } from "@stores/slices";
import { useMsal } from "@azure/msal-react";

const PageLayoutHeader = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { openDrawer, userProfile, auth } = useAppSelector(
    (state) => state.global
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const { instance } = useMsal();
  const role = auth?.roles[0]?.role_name ?? "ไม่พบสิทธิ์";

  const handleLogout = async () => {
    await instance.logoutRedirect();
    handleClose();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDrawer = () => {
    dispatch(setOpenDrawer());
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleOpenDrawer}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Toolbar>
      <IconButton
        onClick={handleOpenDrawer}
        size="large"
        edge="start"
        color="inherit"
        sx={{ mr: 2 }}
      >
        {openDrawer ? <MenuOpen /> : <MenuIcon />}
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Online sale - Setup - {process.env.NEXT_PUBLIC_APPLICATION_VERSION}
      </Typography>
      {Boolean(userProfile) && (
        <div>
          <Grid
            container
            columnGap={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid item sx={{ border: "0px solid white" }}>
              <Typography variant="subtitle1" fontWeight={900}>
                {userProfile.name}
              </Typography>
              <Typography variant="subtitle2" fontWeight={100}>
                {role}
              </Typography>
            </Grid>
            <Grid item sx={{ border: "0px solid white" }}>
              <IconButton size="large" onClick={handleMenu} color="inherit">
                <AccountCircle sx={{ fontSize: 30 }} />
              </IconButton>
            </Grid>
          </Grid>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              marginTop: 6,
            }}
          >
            <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
          </Menu>
        </div>
      )}
    </Toolbar>
  );
};

export default PageLayoutHeader;
