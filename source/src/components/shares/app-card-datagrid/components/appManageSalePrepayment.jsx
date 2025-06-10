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
  TextField,
} from "@mui/material";
import { Yup } from "@utilities";
import { useAppForm, useAppDialog, useAppSelector } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";

const AppManageSalePrepayment = ({
  mode,
  open,
  setOpen,
  handleSave,
  initialData,
  productId,
}) => {
  const { activator } = useAppSelector((state) => state.global);
  const { handleNotification } = useAppDialog();

  const validationSchema = Yup.object().shape({
    installment_description: Yup.string().nullable().required(),
    num_installments: Yup.number().nullable().required(),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      installment_description: "",
      num_installments: null,
    },
  });

  const {
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
            installment_id: crypto.randomUUID(),
            installment_description: data?.installment_description,
            num_installments: data?.num_installments,
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
            installment_description: data?.installment_description,
            num_installments: data?.num_installments,
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

  useEffect(() => {
    if (open) {
      if (mode === "create") {
        reset({
          payment_mode: null,
        });
      } else if (initialData) {
        reset(initialData);
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
        <DialogTitle>จัดการรูปแบบการชำระเงิน</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid container justifyContent={"center"}>
              <Grid item xs={11}>
                <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                  <Grid container justifyContent={"center"}>
                    <Grid item xs={11}>
                      <TextField
                        required
                        fullWidth
                        size="small"
                        margin="dense"
                        label="รูปแบบ"
                        disabled={mode === "view"}
                        {...register("installment_description")}
                        error={errors?.installment_description}
                      />
                      <FormHelperText error={errors?.installment_description}>
                        {errors?.installment_description?.message}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        size="small"
                        margin="dense"
                        label="จำนวนงวด"
                        disabled={mode === "view"}
                        {...register("num_installments")}
                        error={errors?.num_installments}
                      />
                      <FormHelperText error={errors?.num_installments}>
                        {errors?.num_installments?.message}
                      </FormHelperText>
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

export default AppManageSalePrepayment;
