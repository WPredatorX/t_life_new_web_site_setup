import { useState } from "react";
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
} from "@mui/material";
import { Yup } from "@utilities";
import { useAppForm, useAppFieldArray, useAppDialog } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppAutocomplete } from "@components";
import AppManageProductGroupItem from "./appManageProductGroupItem";

const AppManageProductGroup = ({ open, setOpen }) => {
  const [tempProduct, setTempProduct] = useState(null);
  const { handleNotification } = useAppDialog();
  const validationSchema = Yup.object().shape({
    groupName: Yup.string().required(),
    products: Yup.array()
      .of(
        Yup.object().shape({
          item_id: Yup.string().nullable(),
          product_sale_channel_id: Yup.string().nullable(),
          title: Yup.string(),
          is_download: Yup.bool().nullable(),
        })
      )
      .min(1, "จำเป็นต้องระบุข้อมูลนี้"),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      groupName: "",
      products: [],
    },
  });
  const {
    watch,
    control,
    register,
    reset,
    formState: { errors, isDirty },
    handleSubmit,
  } = formMethods;
  const { fields, append, remove } = useAppFieldArray({
    name: "products",
    control: control,
  });

  const handleFetchProduct = async () => {
    const request = {
      is_active: true,
    };
    const response = await fetch(`/api/direct?action=GetListProductSaleRider`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    const fetchedProduct = (data || []).map((item) => {
      return {
        ...item,
        id: item?.product_sale_channel_id,
        label: item?.title,
      };
    });

    // กรองผลิตภัณฑ์ที่เลือกแล้วออก
    const formValue = watch("products") || [];
    const _filteredProductOptions = fetchedProduct.map((item) => {
      const hasProductInForm = formValue.some(
        (formItem) =>
          formItem?.product_sale_channel_id.toLowerCase() ===
          item?.product_sale_channel_id.toLowerCase()
      );

      let disabledItem = true;
      if (!hasProductInForm) {
        disabledItem = false;
      }

      return {
        ...item,
        disabled: disabledItem,
      };
    });

    return _filteredProductOptions;
  };

  const handleClose = () => {
    handleNotification(
      "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        setOpen(false);
        reset();
      },
      null,
      "question"
    );
  };

  const handleRemove = (
    message = "คุณต้องการลบทั้งหมดหรือไม่ ?",
    index = -1
  ) => {
    handleNotification(
      message,
      () => (index > -1 ? remove(index) : remove()),
      null,
      "question"
    );
  };

  const onSubmit = async (data, e) => console.log(data, e);

  const onError = (errors, e) => console.log(errors, e);

  return (
    <Dialog
      open={open}
      maxWidth={"sm"}
      fullWidth
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            handleClose();
          },
        },
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        data-testid="manageProductGroupForm"
      >
        <DialogTitle>จัดการกลุ่มประกัน</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} lg={6}>
              <InputLabel required>ชื่อกลุ่มประกัน</InputLabel>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                data-testid="groupName"
                {...register("groupName")}
                error={Boolean(errors?.groupName)}
              />
              <FormHelperText error={Boolean(errors?.groupName)}>
                {errors?.groupName?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <InputLabel>แบบประกัน (เลือกได้หลายแบบประกัน)</InputLabel>
            </Grid>
            <Grid item xs={12} lg={6}>
              <AppAutocomplete
                disablePortal
                fullWidth
                onChange={(event, value) => {
                  setTempProduct(value);
                }}
                value={tempProduct}
                onBeforeOpen={handleFetchProduct}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={() => {
                  const value = tempProduct;
                  if (value) {
                    append(value, {
                      shouldFocus: true,
                    });
                    setTempProduct(null);
                  }
                }}
              >
                เพิ่ม
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={() => handleRemove()}
              >
                ลบทั้งหมด
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            mt={4}
            sx={{
              height: "15rem",
              overflowY: "scroll",
            }}
          >
            {fields.map((field, index) => {
              return (
                <AppManageProductGroupItem
                  key={index}
                  item={field}
                  index={index}
                  handleRemove={handleRemove}
                />
              );
            })}
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

export default AppManageProductGroup;
