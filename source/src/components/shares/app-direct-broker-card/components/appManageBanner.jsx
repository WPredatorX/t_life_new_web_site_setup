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

const AppManageBanner = ({ open, setOpen, addBanner, currentSelected }) => {
  const { brokerId, activator, sasToken } = useAppSelector(
    (state) => state.global
  );
  const { defaultFileAccept, defaultFileExtension, defaultFileSize } =
    APPLICATION_CONFIGURATION;
  const { handleNotification } = useAppDialog();
  const [isSelectedProduct, setIsSelectedProduct] = useState(false);
  const inputBannerRef = useRef(null);

  const validationSchema = Yup.object().shape({
    product: Yup.object().nullable().required(),
    useBannerFromProduct: Yup.bool().nullable(),
    bannerType: Yup.object().nullable().required(),
    bannerImage: Yup.mixed()
      .nullable()
      .when("bannerType.value", {
        is: 1,
        then: (schema) => schema.required(),
      }),
    bannerImageString: Yup.string().nullable(),
    bannerImageName: Yup.mixed().nullable().required(),
    bannerImageUrl: Yup.string().nullable(),
    bannerImagePreviewUrl: Yup.string().nullable().required(),
    bannerVideoLink: Yup.string()
      .nullable()
      .when("bannerType.value", {
        is: 2,
        then: (schema) => schema.required(),
      }),
    bannerAddImage: Yup.mixed().nullable(),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product: null,
      useBannerFromProduct: false,
      bannerType: null,
      bannerImage: null,
      bannerImageString: "",
      bannerImageName: "",
      bannerImageUrl: "",
      bannerImagePreviewUrl: "",
      bannerVideoLink: null,
      bannerAddImage: null,
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

  const handleFetchProduct = async () => {
    const request = {
      broker_id: brokerId,
    };
    const response = await fetch(
      `/api/direct/profile?action=GetDisplayProducts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      }
    );

    const data = await response.json();
    const fetchedProduct = (data || []).map((item) => {
      const currentSelectedActive = currentSelected.filter(
        (item) => item?.is_active || item?.status === 1
      );
      let disabled = currentSelectedActive.some(
        (cs) => cs.product_sale_group_id === item.product_sale_group_id
      );

      return {
        ...item,
        id: item?.product_sale_group_id,
        label: item?.title,
        disabled: disabled,
      };
    });

    return fetchedProduct;
  };

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
        addBanner({
          id: crypto.randomUUID(),
          product: data?.product,
          product_sale_group_id: data?.product?.product_sale_group_id,
          type: data?.bannerType?.label,
          fileUrlPreview: data?.bannerImagePreviewUrl ?? "",
          fileName: data?.bannerImageName ?? "",
          fileUrl: data?.bannerImageUrl ?? "",
          fileString: data?.bannerImageString,
          url:
            data?.bannerType.value === 1
              ? data?.bannerImageUrl
              : data?.bannerImage,
          status: 1,
          statusName: "รออนุมัติ",
          createBy: activator,
          createDate: new Date().toISOString(),
          is_newImage: !watch("useBannerFromProduct"),
          is_new: true,
        });
        setOpen(false);
      },
      null,
      "question"
    );
  };

  const onError = (errors, e) => console.log(errors, e);

  const handleImageChange = (
    event,
    ref,
    nameProp,
    base64Prop,
    blobProp,
    previewProp
  ) => {
    try {
      const file = event.target.files[0];
      ref.current.value = null;

      // validate has file
      if (!file) return;
      const selectedFileType = file.type;
      const selectedFileSize = file.size;

      // validate type
      if (!defaultFileExtension.includes(selectedFileType)) {
        handleNotification(
          "ประเภทไฟล์ไม่ถูกต้อง (รองรับ .png, .jpg, .jpeg)",
          null,
          null,
          "error"
        );
        throw new Error("ประเภทไฟล์ไม่ถูกต้อง (รองรับ .png, .jpg, .jpeg)");
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];

        setValue(`${base64Prop}`, base64String, {
          shouldDirty: true,
        });
        setValue(`${nameProp}`, file.name);
      };
      reader.readAsDataURL(file);

      const blobUrl = URL.createObjectURL(file);
      setValue(`${blobProp}`, file);
      setValue(`${previewProp}`, blobUrl);
    } catch (error) {
      let message = "ทำรายการไม่สำเร็จ กรุณาเข้าทำรายการใหม่อีกครั้ง";
      if (error.message) message = error.message;
    }
  };

  useEffect(() => {
    if (isSelectedProduct) {
      const currentValue = watch("bannerType");
      if (!currentValue && APPLICATION_BANNER_TYPE.length > 0) {
        setValue("bannerType", APPLICATION_BANNER_TYPE[0], {
          shouldValidate: true,
        });
      }
    }
  }, [isSelectedProduct]);

  const selectedProduct = watch("product");
  useEffect(() => {
    setIsSelectedProduct(!!selectedProduct);
  }, [selectedProduct]);

  const useBannerFromProduct = watch("useBannerFromProduct");
  useEffect(() => {
    if (useBannerFromProduct) {
      const product = watch("product");
      const sasImage = sasToken.sas_images ?? "";
      if (product) {
        setValue(
          "bannerImageName",
          product?.content_url_banner_product_name || ""
        );
        setValue(
          "bannerImageUrl",
          `${product?.content_url_banner_product}` || ""
        );
        setValue(
          "bannerImagePreviewUrl",
          `${product?.content_url_banner_product}${sasImage}` || ""
        );
      }
    } else {
      setValue("bannerImageName", "");
      setValue("bannerImageUrl", "");
      setValue("bannerImagePreviewUrl", "");
    }
  }, [useBannerFromProduct, watch("product")]);

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        data-testid="form-submit"
      >
        <DialogTitle>เพิ่มแบนเนอร์</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Controller
                name="product"
                control={control}
                render={({ field }) => {
                  const { name, onChange, ...other } = field;
                  return (
                    <>
                      <AppAutocomplete
                        id={name}
                        name={name}
                        required
                        disablePortal
                        onChange={(e, v) => {
                          onChange(v);
                          setValue("bannerImage", null);
                          setValue("bannerImageName", null);
                          setValue("bannerImageString", null);
                          setValue("bannerImageUrl", null);
                          setValue("bannerImagePreviewUrl", null);
                          setValue("useBannerFromProduct", false);
                        }}
                        fullWidth
                        label="ผลิตภัณฑ์"
                        onBeforeOpen={handleFetchProduct}
                        error={Boolean(errors?.[name])}
                        {...other}
                      />
                      <FormHelperText error={Boolean(errors?.[name])}>
                        {errors?.[name]?.message}
                      </FormHelperText>
                    </>
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="useBannerFromProduct"
                control={control}
                disabled={!isSelectedProduct}
                render={({ field }) => {
                  const { name, value, onChange, ...other } = field;
                  return (
                    <>
                      <FormControlLabel
                        control={
                          <Switch name={name} checked={value} {...other} />
                        }
                        onChange={(event, check) => {
                          onChange(check);
                        }}
                        label="ใช้รูปภาพจากผลิตภัณฑ์"
                      />
                    </>
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="bannerType"
                control={control}
                disabled={!isSelectedProduct}
                render={({ field }) => {
                  const { name, onChange, ...other } = field;
                  return (
                    <>
                      <AppAutocomplete
                        required
                        id={name}
                        name={name}
                        fullWidth
                        disablePortal
                        onChange={(event, value) => onChange(value)}
                        label="ประเภทแบนเนอร์"
                        options={APPLICATION_BANNER_TYPE}
                        error={Boolean(errors?.[name])}
                        {...other}
                      />
                      <FormHelperText error={Boolean(errors?.[name])}>
                        {errors?.[name]?.message}
                      </FormHelperText>
                    </>
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {watch("bannerType") && (
                <>
                  {watch("bannerType").value === 0 && (
                    <>
                      <input
                        ref={inputBannerRef}
                        accept="image/*"
                        type="file"
                        id="upload-input"
                        data-testid="upload-input"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          handleImageChange(
                            event,
                            inputBannerRef,
                            "bannerImageName",
                            "bannerImageString",
                            "bannerImage",
                            "bannerImagePreviewUrl"
                          );
                        }}
                      />
                      <TextField
                        fullWidth
                        margin="dense"
                        size="small"
                        disabled={watch("useBannerFromProduct")}
                        label="รูปภาพแบนเนอร์ (2000 x 600 px)"
                        value={watch("bannerImageName") ?? ""}
                        inputProps={{ maxLength: 100 }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                data-testid="upload-banner-button"
                                disabled={watch("useBannerFromProduct")}
                                sx={{ color: "GrayText" }}
                                onClick={() => {
                                  if (inputBannerRef.current) {
                                    inputBannerRef.current.click();
                                  }
                                }}
                              >
                                อัปโหลด
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(errors?.bannerImage)}
                      />
                      <FormHelperText error={Boolean(errors?.bannerImage)}>
                        {errors?.bannerImage?.message}
                      </FormHelperText>
                    </>
                  )}

                  {watch("bannerType").value === 2 && (
                    <>
                      <TextField
                        fullWidth
                        margin="dense"
                        size="small"
                        label="กรอก URL ของ Youtube"
                        inputProps={{ maxLength: 100 }}
                        {...register("bannerVideoLink")}
                        error={Boolean(errors?.bannerVideoLink)}
                      />
                      <FormHelperText error={Boolean(errors?.bannerVideoLink)}>
                        {errors?.bannerVideoLink?.message}
                      </FormHelperText>
                    </>
                  )}
                </>
              )}
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

export default AppManageBanner;
