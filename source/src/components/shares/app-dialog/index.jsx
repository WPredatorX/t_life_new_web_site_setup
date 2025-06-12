"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "@hooks";
import { setDialog, resetDialog } from "@stores/slices";
import DialogPaper from "./dialogPaper";

const AppDialog = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {
    dialog,
    dialog: {
      title,
      open,
      onClose,
      draggable,
      renderContent,
      renderAction,
      useDefaultBehavior,
      width = 20,
    },
  } = useAppSelector((state) => state.global);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const defaultHandleClose = () => {
    // hide dialog
    dispatch(
      setDialog({
        ...dialog,
        open: false,
      })
    );

    // then reset
    setTimeout(() => {
      dispatch(resetDialog());
    }, 300);
  };

  const defaultRenderAction = () => {
    return (
      <Button
        data-testid="dialog-button-close"
        autoFocus
        onClick={defaultHandleClose}
      >
        Close
      </Button>
    );
  };

  return (
    <Dialog
      data-testid="app-dialog"
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      PaperComponent={draggable ? DialogPaper : null}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: `${width}%`,
        },
      }}
    >
      <DialogTitle
        id={"app-dialog"}
        data-testid="dialog-title"
        sx={{
          "&.MuiDialogTitle-root": {
            cursor: draggable ? "move" : "pointer",
          },
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent data-testid="dialog-content">
        <DialogContentText data-testid="dialog-content-text">
          {renderContent ? renderContent() : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions data-testid="dialog-action">
        {useDefaultBehavior ? defaultRenderAction() : renderAction()}
      </DialogActions>
    </Dialog>
  );
};

export default AppDialog;
