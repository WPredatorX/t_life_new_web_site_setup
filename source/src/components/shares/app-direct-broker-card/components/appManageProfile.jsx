import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputLabel,
  FormHelperText,
  Box,
  useTheme,
  Typography,
} from "@mui/material";
import { Circle } from "@mui/icons-material";
import { Yup } from "@utilities";
import {
  useAppForm,
  useAppDialog,
  useAppSelector,
  useAppSnackbar,
} from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { AppAutocomplete } from "@components";
import { useEffect, useState } from "react";

// 1 เพิ่ม, 2 คัดลอก
const AppManageProfile = ({ mode, open, setOpen, handleSave }) => {
  const theme = useTheme();
  const { activator } = useAppSelector((state) => state.global);
  const { handleNotification } = useAppDialog();
  const { handleSnackAlert } = useAppSnackbar();
  const [ChannelOption, setChannelOption] = useState([]);
  const [VersionOption, setVersionOption] = useState([]);
  const validationSchema = Yup.object().shape({
    type: Yup.string(),
    channel: Yup.object()
      .nullable()
      .when("type", {
        is: "copy",
        then: (schema) => schema.required(),
      }),
    profile: Yup.object()
      .nullable()
      .when("type", {
        is: "copy",
        then: (schema) => schema.required(),
      }),
    name: Yup.string().nullable().preventSpace("ต้องไม่เป็นค่าว่าง").required(),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      type: mode,
      channel: null,
      profile: null,
      name: null,
    },
  });

  const {
    reset,
    watch,
    control,
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = formMethods;

  const handleClose = () => {
    if (isDirty && mode !== "view") {
      handleNotification(
        "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
        () => {
          reset();
          setOpen(false);
        },
        null,
        "question"
      );
    } else {
      reset();
      setOpen(false);
    }
  };

  const handleFetchChannel = async () => {
    try {
      const response = await fetch(
        `/api/direct/profile?action=GetAllBrokerDDL`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    }
  };

  const handleFetchVersion = async () => {
    try {
      const body = {
        broker_id: watch("channel")?.id,
      };
      const response = await fetch(
        `/api/direct/profile?action=GetAllBrokerProfile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      const mappingData = Array.from(data).map((item) => {
        return {
          ...item,
          id: item.broker_profile_id,
          label: item.title,
        };
      });

      return mappingData;
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
    }
  };

  const onSubmit = async (data, e) => {
    handleNotification(
      "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        handleSave(
          {
            is_new: true,
            is_copy: mode === "copy",
            copy_channel: watch("channel") && watch("channel").id,
            copy_version: watch("version") && watch("version").id,
            id: crypto.randomUUID(),
            active_status: null,
            title: data?.name,
            name_status: "รออนุมัติ",
            create_by: activator,
            create_date: new Date(),
          },
          mode
        );

        setOpen(false);
        reset();
      },
      null,
      "question"
    );
  };

  const onError = (error, event) => {
    alert("onError " + error.message);
  };

  useEffect(() => {
    if (open) {
      handleFetchChannel();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      maxWidth={"sm"}
      fullWidth
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>จัดการเวอร์ชั่นการแสดงผล</DialogTitle>
        <DialogContent>
          <Grid container>
            {mode === "copy" && (
              <>
                <Grid item xs={12}>
                  <Controller
                    name={`channel`}
                    control={control}
                    render={({ field }) => {
                      const { name, onChange, ...otherProps } = field;

                      return (
                        <>
                          <AppAutocomplete
                            required
                            fullWidth
                            id={name}
                            name={name}
                            disablePortal
                            label="ช่องทาง"
                            onChange={(event, value) => {
                              onChange(value);
                            }}
                            {...otherProps}
                            onBeforeOpen={handleFetchChannel}
                            error={Boolean(errors?.channel)}
                          />
                          <FormHelperText error={errors?.channel}>
                            {errors?.channel?.message}
                          </FormHelperText>
                        </>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`profile`}
                    control={control}
                    render={({ field }) => {
                      const { name, onChange, ...otherProps } = field;

                      return (
                        <>
                          <AppAutocomplete
                            required
                            fullWidth
                            id={name}
                            name={name}
                            disablePortal
                            label="เวอร์ชั่น"
                            disabled={!watch("channel")}
                            onChange={(event, value) => {
                              onChange(value);
                            }}
                            {...otherProps}
                            onBeforeOpen={handleFetchVersion}
                            renderOption={(props, option) => {
                              return (
                                <Box
                                  {...props}
                                  key={props.id}
                                  sx={{
                                    "&:hover": {
                                      cursor: "pointer",
                                      backgroundColor: theme.palette.grey.main,
                                      color: theme.palette.primary.main,
                                    },
                                  }}
                                  py={0.5}
                                  px={2}
                                >
                                  <Circle
                                    color={
                                      option?.profile_status === "3"
                                        ? "success"
                                        : "error"
                                    }
                                    sx={{ mr: 1 }}
                                  />
                                  <Typography variant="subtitle1">
                                    {option.label}
                                  </Typography>
                                </Box>
                              );
                            }}
                            error={Boolean(errors?.version)}
                          />
                          <FormHelperText error={errors?.version}>
                            {errors?.version?.message}
                          </FormHelperText>
                        </>
                      );
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                size="small"
                margin="dense"
                label="ชื่อ"
                {...register("name")}
                error={errors?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            ยกเลิก
          </Button>
          {mode !== "view" && (
            <Button
              disabled={mode === "view" || !isDirty}
              variant="contained"
              color="primary"
              type="submit"
            >
              ตกลง
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AppManageProfile;
