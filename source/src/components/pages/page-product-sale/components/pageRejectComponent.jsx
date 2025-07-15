import { useEffect } from "react";
import {
  Grid,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
} from "@mui/material";
import { Yup } from "@utilities";
import { useAppForm, useAppDialog, useAppSnackbar } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";

const PageRejectComponent = ({ open, setOpen, handleReject }) => {
  const { handleNotification } = useAppDialog();
  const { handleSnackAlert } = useAppSnackbar();

  const validationSchema = Yup.object().shape({
    reason: Yup.string()
      .nullable()
      .required()
      .max(250, "ระบุไม่เกิน 250 ตัวอักษร"),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      reason: null,
    },
  });

  const {
    reset,
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = formMethods;

  const handleSave = async (data) => {
    const reason = data?.reason;
    setOpen(false);
    await handleReject(reason);
    reset();
  };

  const onSubmit = (data, event) => {
    handleNotification(
      "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      () => handleSave(data),
      null,
      "question"
    );
  };

  const onError = (error, event) => console.log(errors, e);

  const handleClose = () => {
    handleNotification(
      "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        reset();
        setOpen(false);
      },
      null,
      "question"
    );
  };

  return (
    <Dialog
      open={open}
      maxWidth={"sm"}
      fullWidth
      disableEscapeKeyDown
      onClose={null}
    >
      <form
        data-testid="form-submit"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <DialogTitle>ระบุเหตุผล</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="เหตุผล"
                margin="dense"
                size="small"
                multiline
                rows={5}
                data-testid="reason-input"
                {...register(`reason`)}
                error={Boolean(errors?.reason)}
                inputProps={{ maxLength: 250 }}
              />
              <FormHelperText error={Boolean(errors?.reason)}>
                {errors?.reason?.message}
              </FormHelperText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            data-testid="btn-cancle"
            variant="contained"
            color="inherit"
            onClick={handleClose}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isDirty}
          >
            ตกลง
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PageRejectComponent;
