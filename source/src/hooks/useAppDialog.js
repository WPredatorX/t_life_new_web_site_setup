import { Button, Grid, Typography, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setDialog, closeDialog } from "@stores/slices";
import { Check, Cancel } from "@mui/icons-material";

const useAppDialog = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);

  const handleNotification = (message, callback) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: message,
        useDefaultBehavior: false,
        renderAction: () => {
          return (
            <Grid
              container
              rowGap={2}
              columnGap={1}
              justifyContent={"space-around"}
              p={2}
            >
              <Grid item xs={12} md={"auto"}>
                <Button
                  fullWidth
                  startIcon={<Check />}
                  variant="contained"
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: theme.palette.common.white,
                    paddingX: 3,
                  }}
                  onClick={() => {
                    dispatch(closeDialog());
                    callback();
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "inherit",
                    }}
                  >
                    ยืนยัน
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={12} md={"auto"}>
                <Button
                  fullWidth
                  startIcon={<Cancel />}
                  variant="outlined"
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    paddingX: 3,
                  }}
                  onClick={() => {
                    dispatch(closeDialog());
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "inherit",
                    }}
                  >
                    ยกเลิก
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          );
        },
      })
    );
  };

  return { handleNotification };
};

export default useAppDialog;
