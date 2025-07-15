import { useRef } from "react";
import {
  Grid,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
} from "@mui/material";
import { Yup } from "@utilities";
import { useAppForm, useAppDialog } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";

const AppRejectPromotion = ({ open, setOpen, handleReject }) => {
  const { handleNotification } = useAppDialog();

  const validationSchema = Yup.object().shape({
    reason: Yup.string().nullable().required(),
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
    watch,
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = formMethods;

  const handleClose = () => {
    if (isDirty) {
      handleNotification(
        "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
        () => {
          setOpen(false);
          reset();
        },
        null,
        "question"
      );
    } else {
      setOpen(false);
      reset();
    }
  };

  const onSubmit = async (data, e) => {
    setOpen(false);
    handleReject(data);
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>ระบุเหตุผล</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                margin="dense"
                size="small"
                label="เหตุผล"
                multiline
                rows={5}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={{
                  shrink: !!watch(`reason`),
                }}
                {...register(`reason`)}
                error={Boolean(errors?.reason)}
              />
              <FormHelperText error={Boolean(errors?.reason)}>
                {errors?.reason?.message}
              </FormHelperText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            type="submit"
          >
            ตกลง
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AppRejectPromotion;
