import { useEffect, useState } from "react";
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
import { AppAutocomplete } from "@components";

const AppManageSalePaidType = ({
  mode,
  open,
  setOpen,
  handleSave,
  initialData,
  handleFetchPaymentMode,
  productId,
  currentSelected,
}) => {
  const { activator } = useAppSelector((state) => state.global);
  const { handleNotification } = useAppDialog();
  const [paymentModes, setPaymentMode] = useState([]);

  const validationSchema = Yup.object().shape({
    payment_mode: Yup.mixed().nullable().required(),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      payment_mode: null,
    },
  });

  const {
    reset,
    control,
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
            payment_mode_id: data?.payment_mode?.payment_mode_id,
            payment_mode_description:
              data?.payment_mode?.payment_mode_description,
            payment_mode_divide: data?.payment_mode?.payment_mode_divide,
            payment_mode_multiple: data?.payment_mode?.payment_mode_multiple,
            active_status: null,
            name_status: "รออนุมัติ",
            product_payment_mode_id: crypto.randomUUID(),
            product_sale_channel_id: productId,
            is_active: null,
            create_date: new Date(),
            create_by: activator,
          });
        } else if (mode === "edit") {
          handleSave({
            ...initialData,
            payment_mode_id: data?.payment_mode?.payment_mode_id,
            payment_mode_description:
              data?.payment_mode?.payment_mode_description,
            payment_mode_divide: data?.payment_mode?.payment_mode_divide,
            payment_mode_multiple: data?.payment_mode?.payment_mode_multiple,
            active_status: null,
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

  const hanelInitLoad = async () => {
    let options = await handleFetchPaymentMode();
    options = options.map((item) => {
      let disabled = currentSelected.some(
        (cs) => cs.payment_mode_id === item.payment_mode_id
      );
      return {
        ...item,
        disabled: disabled,
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
          payment_mode: null,
        });
      } else if (initialData && paymentModes) {
        let findObject = paymentModes.find(
          (item) => item.payment_mode_id === initialData.payment_mode_id
        );
        reset({
          payment_mode: findObject,
        });
      }
    }
  }, [open, paymentModes]);

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
        <DialogTitle>จัดการรูปแบบการชำระเงิน</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid container justifyContent={"center"}>
              <Grid item xs={11}>
                <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                  <Grid container justifyContent={"center"}>
                    <Grid item xs={11}>
                      <Controller
                        name={`payment_mode`}
                        control={control}
                        render={({ field }) => {
                          const { name, onChange, ...otherProps } = field;

                          return (
                            <>
                              <AppAutocomplete
                                id={name}
                                name={name}
                                disablePortal
                                fullWidth
                                label="รูปแบบ"
                                disabled={mode === "view"}
                                onChange={(event, value) => {
                                  onChange(value);
                                }}
                                {...otherProps}
                                options={paymentModes}
                                error={Boolean(errors?.payment_mode)}
                              />
                              <FormHelperText error={errors?.payment_mode}>
                                {errors?.payment_mode?.message}
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

export default AppManageSalePaidType;
