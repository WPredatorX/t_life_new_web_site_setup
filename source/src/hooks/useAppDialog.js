import { Button, Grid, Typography, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setDialog, closeDialog } from "@stores/slices";
import { Check, Cancel } from "@mui/icons-material";

const useAppDialog = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);

  // ใช้สำหรับแสดง Dialog คำถาม
  const handleNotificationQuestion = (title, callback, content) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: title,
        useDefaultBehavior: false,
        renderContent: content,
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

                    if (callback) {
                      callback();
                    }
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "inherit",
                    }}
                    data-testid="dialogConfirm"
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

  // ใช้สำหรับแสดง Dialog Info
  const handleNotificationInfo = (title, callback, content, buttonMessage) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: title,
        useDefaultBehavior: false,
        renderContent: content,
        renderAction: () => {
          return (
            <Grid container rowGap={2} justifyContent={"center"} p={2}>
              <Grid item xs={"auto"}>
                <Button
                  variant="contained"
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: theme.palette.common.white,
                    paddingX: 3,
                  }}
                  onClick={() => {
                    dispatch(closeDialog());
                    if (callback) {
                      callback();
                    }
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "inherit",
                    }}
                  >
                    {buttonMessage}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          );
        },
      })
    );
  };

  // ใช้สำหรับแสดง Dialog Error
  const handleNotificationError = (title, callback, content) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: title,
        useDefaultBehavior: false,
        renderContent: content,
        renderAction: () => {
          return (
            <Grid container rowGap={2} justifyContent={"space-around"} p={2}>
              <Grid item xs={12} md={"auto"}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: theme.palette.common.white,
                    paddingX: 3,
                  }}
                  onClick={() => {
                    dispatch(closeDialog());
                    if (callback) {
                      callback();
                    }
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "inherit",
                    }}
                  >
                    ตกลง
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          );
        },
      })
    );
  };

  // ใช้สำหรับแสดง Dialog แบบ Custom Content
  const handleNotificationContent = (content) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        useDefaultBehavior: false,
        overrideContent: true,
        renderContent: content,
        renderAction: () => {},
      })
    );
  };

  const handleNotification = (
    title,
    callback,
    content,
    type = "question",
    buttonMessage = "กลับสู่หน้าหลัก"
  ) => {
    switch (type) {
      case "question":
        return handleNotificationQuestion(title, callback, content);
      case "info":
        return handleNotificationInfo(title, callback, content, buttonMessage);
      case "error":
        return handleNotificationError(title, callback, content);
    }
  };

  return { handleNotificationContent, handleNotification };
};

export default useAppDialog;
