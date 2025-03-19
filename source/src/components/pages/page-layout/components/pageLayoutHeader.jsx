"use client";

import { useState } from "react";
import {
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

const PageLayoutHeader = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { auth, openDrawer } = useAppSelector((state) => state.global);
  const [anchorEl, setAnchorEl] = useState(null);

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
        Online sale - Setup
      </Typography>
      {Boolean(auth) && (
        <div>
          <IconButton size="large" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>
        </div>
      )}
    </Toolbar>
  );
};

export default PageLayoutHeader;
