import { useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Button,
  Dialog,
  useTheme,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
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

const PageProductDisplayVersionManage = ({
  mode,
  open,
  setOpen,
  handleSave,
  productData,
}) => {
  const theme = useTheme();
  const { activator } = useAppSelector((state) => state.global);
  const { handleNotification } = useAppDialog();
  const { handleSnackAlert } = useAppSnackbar();

  const validationSchema = Yup.object().shape({
    type: Yup.string(),
    channel: Yup.object()
      .nullable()
      .when("type", {
        is: "copy",
        then: (schema) => schema.required(),
      }),
    version: Yup.object()
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
      type: null,
      channel: null,
      version: null,
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
      const payload = {
        plan_code: productData?.i_plan,
      };
      const response = await fetch(
        `/api/direct/productSale/profile?action=GetCopyProfileProductSaleCardId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      const mappedData = Array.from(data).map((item) => {
        return {
          _temp: { ...item },
          id: item?.i_subbusiness_line,
          label: `${item?.i_subbusiness_line} - ${item?.broker_name}`,
          value: item?.i_subbusiness_line,
        };
      });
      const uniqueMapped = [
        ...new Map(mappedData.map((item) => [item.id, item])).values(),
      ];
      return uniqueMapped;
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    }
  };

  const handleFetchVersion = async () => {
    try {
      const payload = {
        plan_code: productData?.i_plan,
        i_subbusiness_line: watch("channel")?.value?.toString() ?? null,
      };
      const response = await fetch(
        `/api/direct/productSale/profile?action=GetCopyProfileProductSaleCardId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      const mappedData = Array.from(data).map((item) => {
        return {
          _temp: { ...item },
          id: item?.product_sale_card_id,
          label: `${item?.version_name}`,
          value: item?.product_sale_card_id,
          status: item?.sale_card_status,
        };
      });
      const uniqueMapped = [
        ...new Map(mappedData.map((item) => [item.id, item])).values(),
      ];
      return uniqueMapped;
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    }
  };

  const onSubmit = async (data, e) => {
    handleNotification(
      "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        handleSave(
          {
            is_new: true,
            product_sale_card_id: crypto.randomUUID(),
            is_copy: mode === "copy",
            copy_channel: data?.channel,
            copy_version: data?.version,
            version_name: data?.name,
            sale_card_status: "1",
            sale_card_status_name: "แบบร่าง",
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

  const onError = (error, event) => console.error(error);

  useEffect(() => {
    if (open) {
      reset({
        type: mode,
        channel: null,
        version: null,
        name: null,
      });
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label="ผลิตภัณฑ์"
                disabled
                value={productData?.title}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
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
                    name={`version`}
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
                              const { key, ...restProps } = props;

                              return (
                                <Box
                                  key={option.id}
                                  {...restProps}
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
                                      option?.status === "3"
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

export default PageProductDisplayVersionManage;
