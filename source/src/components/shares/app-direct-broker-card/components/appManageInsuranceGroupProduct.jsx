import { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Chip,
  Select,
  Dialog,
  Button,
  MenuItem,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { Yup } from "@utilities";
import { useAppForm, useAppDialog, useAppSnackbar } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppAutocomplete } from "@components";
import { Controller } from "react-hook-form";

const appManageInsuranceGroupProduct = ({
  open,
  setOpen,
  addProduct,
  brokerId,
  initialData,
  disabledProduct, // อาเรย์ที่มีแต่ id
}) => {
  const { handleNotification } = useAppDialog();
  const { handleSnackAlert } = useAppSnackbar();
  const [defaultProduct, setDefaultProduct] = useState([]);

  const validationSchema = Yup.object().shape({
    selectProduct: Yup.array().of(Yup.mixed()),
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

  const onSubmit = (data, event) => {
    // console.log("onSubmit", { data });
    // const selectedProductIds = data?.selectProduct;
    // const products = defaultProduct?.filter((item) =>
    //   selectedProductIds.includes(item?.id)
    // );
    const produts = data?.selectProduct;
    handleNotification(
      "คุณต้องการยืนยันการบันทึกข้อมูลหรือไม่ ?",
      () => {
        addProduct(produts);
        setOpen(false);
        reset();
      },
      null,
      "question"
    );
  };

  const onError = (error, event) => console.error(error);

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

  const getProductLabel = (productId) => {
    if (productId) {
      const product = defaultProduct?.find(
        (item) => item?.id?.toLowerCase() === productId?.toLowerCase()
      );

      if (product) {
        return product?.name;
      }

      return "";
    }

    return "";
  };

  const handleFetchProduct = async () => {
    try {
      const payload = {
        broker_id: brokerId,
      };
      const response = await fetch(
        `/api/direct/profile?action=GetDisplayProducts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      const mappedData = data.map((item) => {
        const itemDisabled = disabledProduct?.includes(
          item?.product_sale_group_id?.toLowerCase()
        );
        return {
          _temp: { ...item },
          id: item?.product_sale_group_id,
          name: item?.title,
          label: `${item?.title}${itemDisabled ? "(อยู่ในกลุ่มอื่น)" : ""}`,
          value: item,
          disabled: itemDisabled,
        };
      });

      setDefaultProduct(mappedData);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    }
  };

  useEffect(() => {
    if (open) {
      handleFetchProduct();
      if (initialData) {
        // const initialDataIds = initialData?.map((item) => item?.id);
        reset({
          selectProduct: initialData,
        });
      } else {
        reset();
      }
    }
  }, [open]);

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>เพิ่มหรือลบผลิตภัณฑ์</DialogTitle>
        <DialogContent>
          {/* <Grid item xs={12}>
            <InputLabel sx={{ marginBottom: 1 }}>
              เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)
            </InputLabel>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id={"multiple-select-label"}>เลือก</InputLabel>
              <Controller
                name="selectProduct"
                control={control}
                render={({ field }) => {
                  const { value, onChange } = field;

                  return (
                    <Select
                      labelId="multiple-select-label"
                      id="multiple-select"
                      multiple
                      value={value}
                      onChange={(event) => {
                        const {
                          target: { value },
                        } = event;
                        onChange(value);
                      }}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={getProductLabel(value)} />
                          ))}
                        </Box>
                      )}
                    >
                      {defaultProduct.map((item) => {
                        const disabled = disabledProduct
                          ?.map((id) => id.toLowerCase())
                          .includes(item?.id?.toLowerCase());
                        return (
                          <MenuItem
                            key={item?.id}
                            value={item?.id}
                            disabled={disabled}
                            sx={{
                              height: 48,
                            }}
                          >
                            {item?.name}{" "}
                            {disabled ? `(อยู่ในกลุ่มอื่นแล้ว)` : null}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  );
                }}
              />
            </FormControl>
          </Grid> */}
          <Grid item xs={12}>
            <Controller
              name="selectProduct"
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
                      label="เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)"
                      multiple
                      getOptionLabel={(option) => {
                        return option.label || option.name;
                      }}
                      onChange={(event, value) => {
                        onChange(value);
                      }}
                      {...otherProps}
                      renderTags={(value, props) =>
                        value.map((option, index) => (
                          <Chip
                            label={option?.name}
                            {...props({ index })}
                            style={{ margin: 5 }}
                            key={index}
                          />
                        ))
                      }
                      options={defaultProduct}
                      error={Boolean(errors?.selectProduct)}
                    />
                    <FormHelperText error={errors?.selectProduct}>
                      {errors?.selectProduct?.message}
                    </FormHelperText>
                  </>
                );
              }}
            />
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

export default appManageInsuranceGroupProduct;
