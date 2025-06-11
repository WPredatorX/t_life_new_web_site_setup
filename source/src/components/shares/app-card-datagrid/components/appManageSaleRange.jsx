import { useEffect } from "react";
import {
  Card,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
} from "@mui/material";
import { Yup } from "@utilities";
import { useAppForm, useAppDialog, useAppSelector } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { AppDatePicker } from "@components";

const AppManageSaleRange = ({
  mode,
  open,
  setOpen,
  handleSave,
  initialData,
}) => {
  const { activator } = useAppSelector((state) => state.global);
  const { handleNotification } = useAppDialog();

  const validationSchema = Yup.object().shape({
    sale_start_date: Yup.date().nullable().required(),
    sale_end_date: Yup.date().nullable(),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      sale_start_date: null,
      sale_end_date: null,
    },
  });

  const {
    reset,
    watch,
    control,
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

  const onSubmit = async (data, e) => {
    handleNotification(
      "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        if (mode === "create") {
          handleSave({
            is_new: true,
            sale_period_id: crypto.randomUUID(),
            active_status: null,
            sale_start_date: watch("sale_start_date"),
            sale_end_date: watch("sale_end_date"),
            name_status: "รออนุมัติ",
            create_by: activator,
            create_date: new Date(),
          });
        } else if (mode === "edit") {
          handleSave({
            ...initialData,
            active_status: null,
            sale_start_date: watch("sale_start_date"),
            sale_end_date: watch("sale_end_date"),
            name_status: "รออนุมัติ",
            update_by: activator,
            update_date: new Date(),
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

  useEffect(() => {
    if (open) {
      if (mode === "create") {
        reset({
          sale_start_date: null,
          sale_end_date: null,
        });
      } else if (initialData) {
        reset({
          sale_start_date: initialData?.sale_start_date
            ? new Date(initialData?.sale_start_date)
            : null,
          sale_end_date: initialData?.sale_end_date
            ? new Date(initialData?.sale_end_date)
            : null,
        });
      }
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
      <form
        data-testid="form-submit"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <DialogTitle>จัดการระยะเวลาขาย</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid container justifyContent={"center"}>
              <Grid item xs={11}>
                <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                  <Grid container justifyContent={"center"}>
                    <Grid item xs={11}>
                      <Controller
                        name={`sale_start_date`}
                        control={control}
                        render={({ field }) => {
                          const { name, onChange, ...otherProps } = field;

                          return (
                            <>
                              <AppDatePicker
                                id={name}
                                name={name}
                                label="วันที่เริ่มต้น"
                                required
                                disabled={mode === "view"}
                                readOnly={mode === "view"}
                                fullWidth
                                margin="dense"
                                size="small"
                                disablePast
                                onChange={(date) => {
                                  onChange(date);
                                }}
                                error={Boolean(errors?.sale_start_date)}
                                {...otherProps}
                              />
                              <FormHelperText error={errors?.sale_start_date}>
                                {errors?.sale_start_date?.message}
                              </FormHelperText>
                            </>
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={11} mb={2}>
                      <Controller
                        name={`sale_end_date`}
                        control={control}
                        disabled={mode === "view" ? true : false}
                        render={({ field }) => {
                          const { name, onChange, ...otherProps } = field;

                          return (
                            <>
                              <AppDatePicker
                                id={name}
                                name={name}
                                label="วันที่สิ้นสุด"
                                fullWidth
                                margin="dense"
                                size="small"
                                disablePast
                                disabled={mode === "view"}
                                readOnly={mode === "view"}
                                onChange={(date) => {
                                  onChange(date);
                                }}
                                error={Boolean(errors?.sale_end_date)}
                                {...otherProps}
                              />
                              <FormHelperText error={errors?.sale_end_date}>
                                {errors?.sale_end_date?.message}
                              </FormHelperText>
                            </>
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
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

export default AppManageSaleRange;
