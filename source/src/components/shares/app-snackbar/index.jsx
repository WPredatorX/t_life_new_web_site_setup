"use client";

import { useAppSelector, useAppDispatch } from "@hooks";
import { resetSnackBar, setSnackBar } from "@stores/slices";
import { Snackbar, Alert, Typography } from "@mui/material";

const AppSnackBar = () => {
  const dispatch = useAppDispatch();
  const { snackBar } = useAppSelector((state) => state.global);

  const defaultProps = {
    ...snackBar,
    onClose: () => {
      // hide snackbar first prevent message change display
      dispatch(
        setSnackBar({
          ...snackBar,
          open: false,
        })
      );

      // then reset
      setTimeout(() => {
        dispatch(resetSnackBar());
      }, 300);
    },
  };

  const alertProps = {
    message: snackBar.message,
    severity: snackBar.severity || "error",
    onClose: defaultProps.onClose,
  };

  return (
    <Snackbar data-testid="app-snackbar" {...defaultProps}>
      <Alert
        {...alertProps}
        variant="filled"
        sx={{
          width: "100%",
        }}
        icon={false}
      >
        <Typography variant="subtitle1">{alertProps.message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default AppSnackBar;
