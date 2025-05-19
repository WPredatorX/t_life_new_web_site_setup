import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Button,
  Dialog,
  TextField,
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Yup } from "@utilities";
import {
  useAppForm,
  useAppDialog,
  useAppSelector,
  useAppSnackbar,
} from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { AppAutocomplete, AppLoadData } from "@components";
import { NumericFormat } from "react-number-format";

const AppManageSaleTemplate = ({
  mode,
  open,
  setOpen,
  productId,
  handleSave,
  initialData,
  handleFetchTemplate,
}) => {
  const { activator } = useAppSelector((state) => state.global);
  const { handleNotification } = useAppDialog();
  const { handleSnackAlert } = useAppSnackbar();
  const [templateMaster, setTemplateMaster] = useState([]);
  const [loadPreview, setLoadPreview] = useState(false);
  const [init, setInit] = useState(false);

  const validationSchema = Yup.object().shape({
    template_master: Yup.mixed().nullable().required(),
    app_temp_name: Yup.string().nullable().required(),
    min_age_years: Yup.number()
      .typeError("จำเป็นต้องระบุข้อมูลนี้")
      .required()
      .nullable()
      .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
      .max(150, "ต้องมีค่าไม่เกิน 150"),
    min_age_months: Yup.number()
      .typeError("จำเป็นต้องระบุข้อมูลนี้")
      .required()
      .nullable()
      .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
      .max(12, "ต้องมีค่าไม่เกิน 12"),
    min_age_days: Yup.number()
      .typeError("จำเป็นต้องระบุข้อมูลนี้")
      .required()
      .nullable()
      .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
      .max(31, "ต้องมีค่าไม่เกิน 31"),
    max_age_years: Yup.number()
      .typeError("จำเป็นต้องระบุข้อมูลนี้")
      .required()
      .nullable()
      .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
      .max(150, "ต้องมีค่าไม่เกิน 150"),
    max_age_months: Yup.number()
      .typeError("จำเป็นต้องระบุข้อมูลนี้")
      .required()
      .nullable()
      .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
      .max(12, "ต้องมีค่าไม่เกิน 12"),
    max_age_days: Yup.number()
      .typeError("จำเป็นต้องระบุข้อมูลนี้")
      .required()
      .nullable()
      .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
      .max(31, "ต้องมีค่าไม่เกิน 31"),
    min_coverage_amount: Yup.number()
      .nullable()
      .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
      .required()
      .test(
        "min-less-than-max",
        "คุ้มครองต่ำสุดต้องไม่เกินคุ้มครองสูงสุด",
        function (value) {
          const { max_coverage_amount } = this.parent;
          if (value === undefined || max_coverage_amount === undefined) {
            return true;
          }
          return value <= max_coverage_amount;
        }
      ),
    max_coverage_amount: Yup.number()
      .nullable()
      .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
      .required()
      .test(
        "max-greater-than-min",
        "คุ้มครองสูงสุดต้องมากกว่าหรือเท่ากับคุ้มครองต่ำสุด",
        function (value) {
          const { min_coverage_amount } = this.parent;
          if (value === undefined || min_coverage_amount === undefined) {
            return true;
          }
          return value >= min_coverage_amount;
        }
      ),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      template_master: null,
      app_temp_name: "",
      min_coverage_amount: null,
      max_coverage_amount: null,
      min_age_years: null,
      min_age_months: null,
      min_age_days: null,
      max_age_years: null,
      max_age_months: null,
      max_age_days: null,
    },
  });

  const {
    watch,
    reset,
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
  } = formMethods;

  const handleClose = () => {
    if (isDirty) {
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

  const onSubmit = async (data, e) => {
    handleNotification(
      "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        if (mode === "create") {
          handleSave({
            is_new: true,
            product_app_temp_id: crypto.randomUUID(),
            app_temp_id: data?.template_master?.app_temp_id,
            app_temp_name_master: data?.template_master?.app_temp_name,
            app_temp_name: data?.app_temp_name,
            min_coverage_amount: data?.min_coverage_amount,
            max_coverage_amount: data?.max_coverage_amount,
            min_age_years: data?.min_age_years,
            min_age_months: data?.min_age_months,
            min_age_days: data?.min_age_days,
            max_age_years: data?.max_age_years,
            max_age_months: data?.max_age_months,
            max_age_days: data?.max_age_days,
            active_status: null,
            name_status: "รออนุมัติ",
            product_sale_channel_id: productId,
            is_active: null,
            create_date: new Date(),
            create_by: activator,
          });
        } else if (mode === "edit") {
          handleSave({
            ...initialData,
            app_temp_id: data?.template_master?.app_temp_id,
            app_temp_name_master: data?.template_master?.app_temp_name,
            app_temp_name: data?.app_temp_name,
            min_coverage_amount: data?.min_coverage_amount,
            max_coverage_amount: data?.max_coverage_amount,
            min_age_years: data?.min_age_years,
            min_age_months: data?.min_age_months,
            min_age_days: data?.min_age_days,
            max_age_years: data?.max_age_years,
            max_age_months: data?.max_age_months,
            max_age_days: data?.max_age_days,
            active_status: null,
            name_status: "รออนุมัติ",
            update_date: new Date(),
            update_by: activator,
          });
        }

        setOpen(false);
        reset();
      },
      null,
      "question"
    );
  };

  const onError = (errors, e) => console.log(errors, e);

  const hanelInitLoad = async () => {
    let options = await handleFetchTemplate();
    options = options.map((item) => {
      return {
        ...item,
      };
    });
    setTemplateMaster(options);
  };

  const handlePreviewApplication = async () => {
    setLoadPreview(true);

    try {
      const payload = {
        app_code: watch("template_master")?.app_temp_code,
      };
      const response = await fetch(
        "/api/direct?action=GenerateReportByApplicationCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/octet-stream",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error();
      }
      const blob = await response.blob();
      const previewUrl = URL.createObjectURL(blob);
      const newWindow = window.open(previewUrl, "_blank");
      if (newWindow) {
        newWindow.focus();
      }
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "เกิดข้อผิดพลาดบางประการ",
      });
    } finally {
      setLoadPreview(false);
    }
  };

  useEffect(() => {
    if (open) {
      hanelInitLoad();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (mode === "create") {
        reset({
          template_master: null,
          app_temp_name: null,
          min_coverage_amount: null,
          max_coverage_amount: null,
          min_age_years: null,
          min_age_months: null,
          min_age_days: null,
          max_age_years: null,
          max_age_months: null,
          max_age_days: null,
        });
      } else if (initialData && templateMaster) {
        let findObject = templateMaster.find(
          (item) => item.app_temp_id === initialData.app_temp_id
        );
        reset({
          ...initialData,
          template_master: findObject,
        });
      }
    }
  }, [open, templateMaster]);

  return (
    <Dialog
      open={open}
      maxWidth={"md"}
      fullWidth
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>จัดการเทมเพลตใบคำขอ</DialogTitle>
        <DialogContent>
          <Grid container justifyContent={"center"}>
            <Grid item xs={12}>
              <Card
                sx={{ border: "1px solid", borderColor: "#e7e7e7", padding: 1 }}
              >
                <Grid container columnGap={2} justifyContent={"start"}>
                  <Grid item xs={9}>
                    <Controller
                      name={`template_master`}
                      control={control}
                      render={({ field }) => {
                        const { name, onChange, ...otherProps } = field;

                        return (
                          <>
                            <AppAutocomplete
                              required
                              id={name}
                              name={name}
                              disablePortal
                              fullWidth
                              label="เทมแพลตมาสเตอร์"
                              onChange={(event, value) => {
                                onChange(value);
                              }}
                              {...otherProps}
                              disabled={mode === "view"}
                              options={templateMaster}
                              error={Boolean(errors?.template_master)}
                            />
                            <FormHelperText error={errors?.template_master}>
                              {errors?.template_master?.message}
                            </FormHelperText>
                          </>
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} pt={1}>
                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      onClick={handlePreviewApplication}
                      disabled={!watch("template_master") || loadPreview}
                    >
                      ดูตัวอย่าง
                      {loadPreview ? (
                        <CircularProgress sx={{ marginLeft: 2 }} size={20} />
                      ) : null}
                    </Button>
                  </Grid>
                </Grid>
                <Grid container justifyContent={"start"} columnGap={2}>
                  <Grid item xs={9}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      margin="dense"
                      label="ชื่อ*"
                      disabled={mode === "view"}
                      readOnly={mode === "view"}
                      {...register("app_temp_name")}
                      error={Boolean(errors?.app_temp_name)}
                    />
                    <FormHelperText error={Boolean(errors?.app_temp_name)}>
                      {errors?.app_temp_name?.message}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <Grid container justifyContent={"start"} columnGap={1}>
                  <Grid item xs={4.44}>
                    <Controller
                      control={control}
                      name="min_coverage_amount"
                      render={({
                        field: { onChange, onBlur, value, name, ref },
                      }) => (
                        <NumericFormat
                          required
                          value={value ?? null}
                          onValueChange={(values) => {
                            onChange(values.floatValue ?? null);
                          }}
                          thousandSeparator
                          customInput={TextField}
                          label="ความคุ้มครองต่ำสุด"
                          fullWidth
                          margin="dense"
                          size="small"
                          name={name}
                          inputRef={ref}
                          onBlur={onBlur}
                          disabled={mode === "view"}
                          InputLabelProps={value ? { shrink: true } : undefined}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                บาท
                              </InputAdornment>
                            ),
                          }}
                          error={errors?.min_coverage_amount}
                        />
                      )}
                    />
                    <FormHelperText
                      error={Boolean(errors?.min_coverage_amount)}
                    >
                      {errors?.min_coverage_amount?.message}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={4.44}>
                    <Controller
                      control={control}
                      name="max_coverage_amount"
                      render={({
                        field: { onChange, onBlur, value, name, ref },
                      }) => (
                        <NumericFormat
                          required
                          value={value ?? null}
                          onValueChange={(values) => {
                            onChange(values.floatValue ?? null);
                          }}
                          thousandSeparator
                          customInput={TextField}
                          label="ความคุ้มครองสูงสุด"
                          fullWidth
                          margin="dense"
                          size="small"
                          name={name}
                          disabled={mode === "view"}
                          inputRef={ref}
                          onBlur={onBlur}
                          InputLabelProps={value ? { shrink: true } : undefined}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                บาท
                              </InputAdornment>
                            ),
                          }}
                          error={errors?.max_coverage_amount}
                        />
                      )}
                    />
                    <FormHelperText
                      error={Boolean(errors?.max_coverage_amount)}
                    >
                      {errors?.max_coverage_amount?.message}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent={"start"}
                  alignItems={"center"}
                >
                  <Grid item xs={2}>
                    <InputLabel required>อายุต่ำสุด</InputLabel>
                  </Grid>
                  <Grid item xs={2.35}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      margin="dense"
                      type="number"
                      disabled={mode === "view"}
                      readOnly={mode === "view"}
                      {...register("min_age_years")}
                      error={Boolean(errors?.min_age_years)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">ปี</InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error={Boolean(errors?.min_age_years)}>
                      {errors?.min_age_years?.message}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={2.35}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      margin="dense"
                      type="number"
                      disabled={mode === "view"}
                      readOnly={mode === "view"}
                      {...register("min_age_months")}
                      error={Boolean(errors?.min_age_months)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">เดือน</InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error={Boolean(errors?.min_age_months)}>
                      {errors?.min_age_months?.message}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={2.35}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      margin="dense"
                      type="number"
                      disabled={mode === "view"}
                      readOnly={mode === "view"}
                      {...register("min_age_days")}
                      error={Boolean(errors?.min_age_days)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">วัน</InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error={Boolean(errors?.min_age_days)}>
                      {errors?.min_age_days?.message}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  justifyContent={"start"}
                  alignItems={"center"}
                >
                  <Grid item xs={2}>
                    <InputLabel required>อายุสูงสุด</InputLabel>
                  </Grid>
                  <Grid item xs={2.35}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      margin="dense"
                      type="number"
                      disabled={mode === "view"}
                      readOnly={mode === "view"}
                      {...register("max_age_years")}
                      error={Boolean(errors?.max_age_years)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">ปี</InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error={Boolean(errors?.max_age_years)}>
                      {errors?.max_age_years?.message}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={2.35}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      margin="dense"
                      type="number"
                      disabled={mode === "view"}
                      readOnly={mode === "view"}
                      {...register("max_age_months")}
                      error={Boolean(errors?.max_age_months)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">เดือน</InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error={Boolean(errors?.max_age_months)}>
                      {errors?.max_age_months?.message}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={2.35}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      margin="dense"
                      type="number"
                      disabled={mode === "view"}
                      readOnly={mode === "view"}
                      {...register("max_age_days")}
                      error={Boolean(errors?.max_age_days)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">วัน</InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error={Boolean(errors?.max_age_days)}>
                      {errors?.max_age_days?.message}
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Card>
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

export default AppManageSaleTemplate;
