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
} from "@mui/material";
import { Yup } from "@utilities";
import { useAppForm, useAppDialog, useAppSelector } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { AppAutocomplete } from "@components";
import { NumericFormat } from "react-number-format";

const AppManageSalePaidCategory = ({
  mode,
  open,
  setOpen,
  productId,
  handleSave,
  initialData,
  handleFetchPaymentType,
}) => {
  const { activator } = useAppSelector((state) => state.global);
  const { handleNotification } = useAppDialog();
  const [paymentModes, setPaymentMode] = useState([]);

  const validationSchema = Yup.object().shape({
    payment_channel: Yup.mixed().nullable().required(),
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
      payment_channel: null,
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
    reset,
    control,
    register,
    formState: { errors, isDirty },
    handleSubmit,
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
            product_payment_id: crypto.randomUUID(),
            payment_id: data?.payment_channel?.payment_id,
            payment_code: data?.payment_channel?.payment_code,
            payment_name: data?.payment_channel?.payment_name,
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
            payment_id: data?.payment_channel?.payment_id,
            payment_code: data?.payment_channel?.payment_code,
            payment_name: data?.payment_channel?.payment_name,
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
    let options = await handleFetchPaymentType();
    options = options.map((item) => {
      return {
        ...item,
      };
    });
    setPaymentMode(options);
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
          payment_channel: null,
          min_coverage_amount: null,
          max_coverage_amount: null,
          min_age_years: null,
          min_age_months: null,
          min_age_days: null,
          max_age_years: null,
          max_age_months: null,
          max_age_days: null,
        });
      } else if (initialData && paymentModes) {
        let findObject = paymentModes.find(
          (item) => item.payment_id === initialData.payment_id
        );
        reset({
          ...initialData,
          payment_channel: findObject,
        });
      }
    }
  }, [open, paymentModes]);

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
        <DialogTitle>จัดการประเภทการชำระเงิน</DialogTitle>
        <DialogContent>
          <Grid container justifyContent={"center"}>
            <Grid item xs={12}>
              <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                <Grid container justifyContent={"start"}>
                  <Grid item xs={9}>
                    <Controller
                      name={`payment_channel`}
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
                              label="ประเภท"
                              disabled={mode === "view"}
                              onChange={(event, value) => {
                                onChange(value);
                              }}
                              {...otherProps}
                              options={paymentModes}
                              error={Boolean(errors?.payment_channel)}
                            />
                            <FormHelperText error={errors?.payment_channel}>
                              {errors?.payment_channel?.message}
                            </FormHelperText>
                          </>
                        );
                      }}
                    />
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
                          value={value ?? ""}
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
                          value={value ?? ""}
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

export default AppManageSalePaidCategory;
