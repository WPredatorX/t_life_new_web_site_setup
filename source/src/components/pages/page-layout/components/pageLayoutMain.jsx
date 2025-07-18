"use client";

import { styled } from "@mui/material";
import { APPLICATION_DEFAULT } from "@constants";

const PageLayoutMain = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: "100%",
  width: "100%",
  marginLeft: `-${APPLICATION_DEFAULT.drawerWidth}px`,
  backgroundColor: theme.palette.grey[400],
  ...(open && {
    width: `calc(100% - ${APPLICATION_DEFAULT.drawerWidth}px)`,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default PageLayoutMain;
