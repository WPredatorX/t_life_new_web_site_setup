import { useEffect, useRef, useState } from "react";
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
  Switch,
  InputAdornment,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
} from "@mui/material";
import { Yup } from "@utilities";
import {
  useAppForm,
  useAppFieldArray,
  useAppDialog,
  useAppSelector,
} from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppAutocomplete } from "@components";
import { Controller } from "react-hook-form";
import { APPLICATION_BANNER_TYPE, APPLICATION_CONFIGURATION } from "@constants";

const AppManageInsuranceGroupProduct = ({
  open,
  setOpen,
  addProduct,
  initialData,
}) => {
  const [defaultProduct, setDefaultProduct] = useState([
    {
      id: crypto.randomUUID(),
      name: "product 1",
      value: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "product 2",
      value: 2,
    },
  ]);

  const validationSchema = Yup.object().shape({
    selectProduct: Yup.array().of(Yup.object()),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      selectProduct: [],
    },
  });

  const {
    watch,
    control,
    register,
    reset,
    setValue,
    formState: { errors, isDirty },
    handleSubmit,
  } = formMethods;

  const onSubmit = (data, event) => {};

  const onError = (error, event) => console.error(error);

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

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>เพิ่มหรือลบผลิตภัณฑ์</DialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <FormControl sx={{ m: 1, minWidth: "100%", maxWidth: "100%" }}>
              <InputLabel shrink htmlFor="select-multiple-native">
                เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)
              </InputLabel>
              <Controller
                name="selectProduct"
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                  return (
                    <Select
                      fullWidth
                      multiple
                      native
                      {...field}
                      defaultValue={[]}
                      label="เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)"
                      inputProps={{
                        id: "select-multiple-native",
                      }}
                    >
                      {defaultProduct.map((defaultProductItem) => (
                        <MenuItem
                          value={defaultProductItem}
                          key={defaultProductItem?.id}
                        >
                          <ListItemText primary={defaultProductItem?.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  );
                }}
              />
            </FormControl>
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

export default AppManageInsuranceGroupProduct;
