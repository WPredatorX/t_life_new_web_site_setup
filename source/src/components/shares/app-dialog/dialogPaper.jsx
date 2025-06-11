"use client";

import { useRef } from "react";
import { Paper } from "@mui/material";
import Draggable from "react-draggable";

const DialogPaper = (props) => {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle={`#app-dialog`}
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  );
};

export default DialogPaper;
