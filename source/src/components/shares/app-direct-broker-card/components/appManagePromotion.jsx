import { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  Button,
  Dialog,
  useTheme,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import { AppWyswig, AppAutocomplete, AppLoadData } from "@components";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup } from "@utilities";
import {
  useAppForm,
  useAppDialog,
  useAppSnackbar,
  useAppSelector,
} from "@hooks";
import {
  APPLICATION_CONFIGURATION,
  APPLICATION_PROMOTION_TYPE,
} from "@constants";
import { AppRejectPromotion } from ".";
import NextImage from "next/image";

const AppManagePromotion = ({ mode, open, setOpen, initialData }) => {
  const theme = useTheme();
  const bannerRef = useRef();
  const { activator, sasToken } = useAppSelector((state) => state.global);
  const { handleSnackAlert } = useAppSnackbar();
  const { handleNotification } = useAppDialog();
  const [loading, setLoading] = useState(true);
  const [openReject, setOpenReject] = useState(false);
  const { defaultFileAccept, defaultFileExtension } = APPLICATION_CONFIGURATION;
  const disabledInput = useMemo(() => {
    return mode === "view" || mode === "approve" || mode === "drop";
  });
  const openForApprove = useMemo(() => {
    return mode === "approve" || initialData?.promotion_status === 2;
  });
  const openForDrop = useMemo(() => {
    return mode === "drop";
  });

  const validationSchema = Yup.object().shape({
    promotionId: Yup.string(),
    promotionCode: Yup.string(),
    promotionType: Yup.object().nullable().required(),
    promotionDiscountPercent: Yup.number().nullable(),
    promotionDiscountBaht: Yup.number().nullable(),
    promotionCondition: Yup.object().shape({
      minimumPremium: Yup.number()
        .min(0, "ต้องไม่ต่ำว่า 0")
        .nullable()
        .required(),
      maximumPremium: Yup.number()
        .min(Yup.ref("minimumPremium"), "ต้องมากกว่าหรือเท่ากับ 'เบี้ยต่ำสุด'")
        .nullable()
        .required(),
      minimumCoverage: Yup.number()
        .min(0, "ต้องไม่ต่ำว่า 0")
        .nullable()
        .required(),
      maximumCoverage: Yup.number()
        .min(Yup.ref("minimumCoverage"), "ต้องมากกว่าหรือเท่ากับ 'ทุนต่ำสุด'")
        .nullable()
        .required(),
    }),
    promotionDisplay: Yup.object().shape({
      cardText: Yup.string().required(),
      calculateText: Yup.string().required(),
      bannerImage: Yup.mixed().nullable(),
      bannerImageString: Yup.string(),
      bannerImageName: Yup.string().required(),
      bannerImageUrl: Yup.string().nullable(),
      bannerImageUrlPreview: Yup.string(),
      description: Yup.string().required(),
    }),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      promotionCode: "",
      promotionType: null,
      promotionDiscountPercent: 0,
      promotionDiscountBaht: 0,
      promotionCondition: {
        minimumPremium: 0,
        maximumPremium: 0,
        minimumCoverage: 0,
        maximumCoverage: 0,
      },
      promotionDisplay: {
        cardText: "",
        calculateText: "",
        bannerImage: null,
        bannerImageString: "",
        bannerImageName: "",
        bannerImageUrl: "",
        bannerImageUrlPreview: "",
        description: "",
      },
    },
  });

  const {
    reset,
    watch,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
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
    handleNotification(
      "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      async () => {
        await handleSave(data);
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

  const handleRequestForApprove = async () => {
    setLoading(true);

    try {
      // บันทึกข้อมูลปรับสถานะขออนุมัติ
      const currentData = watch();
      const silentSave = await handleSave(currentData, true);
      if (silentSave) {
        const payload = {
          mode: "PROMOTION_APPROVE",
          template_code: "01",
          promotion_id: watch("promotionId"),
        };
        const response = await fetch(
          `/api/direct?action=ProductRecordApprove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (response.status !== 200) {
          throw new Error("");
        }
        const data = await response.json();
        handleNotification(
          "บันทึกและขออนุมัติสำเร็จ",
          () => setOpen(false),
          null,
          "info",
          "ตกลง"
        );
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleSave = async (
    data,
    silent = false,
    status = null,
    statusMessage = null
  ) => {
    setLoading(true);

    try {
      const _status = silent ? status ?? 2 : 1;
      const payload = {
        ...initialData,
        is_active: true,
        create_by: activator,
        update_by: activator,
        discount_type: data?.promotionType?.id,
        content_name: data?.promotionDisplay?.bannerImageName,
        content_url: data?.promotionDisplay?.bannerImageUrl,
        file_content_item: data?.promotionDisplay?.bannerImageString,
        promotion_status: _status,
        promotion_status_message: statusMessage,
        min_premium_amount: data?.promotionCondition?.minimumPremium,
        max_premium_amount: data?.promotionCondition?.maximumPremium,
        min_coverage_amount: data?.promotionCondition?.minimumCoverage,
        max_coverage_amount: data?.promotionCondition?.maximumCoverage,
        condition_content: data?.promotionDisplay?.description,
        tag_promotion: data?.promotionDisplay?.cardText,
        remark_promotion_name: data?.promotionDisplay?.calculateText,
      };
      const response = await fetch(
        `/api/direct/promotion?action=AddOrUpdatePromotion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.status !== 200) {
        throw new Error("");
      }
      if (!silent) {
        handleNotification(
          "บันทึกสำเร็จ",
          () => setOpen(false),
          null,
          "info",
          "ตกลง"
        );
      } else {
        return true;
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      // silent อัพเดตสถานะเป็น เปิดใช้งาน
      const currentData = watch();
      const silent = await handleSave(currentData, true, 3);
      if (silent) {
        // ส่งเมลอนุมัติ
        const payload = {
          mode: "PROMOTION_APPROVE",
          template_code: "02",
          promotion_id: watch("promotionId"),
        };
        const response = await fetch(
          `/api/direct?action=ProductRecordApprove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (response.status !== 200) {
          throw new Error("");
        }
        handleNotification(
          "บันทึกการอนุมัติสำเร็จ",
          () => setOpen(false),
          null,
          "info",
          "ตกลง"
        );
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleReject = async (data) => {
    setLoading(true);
    try {
      // silent อัพเดตสถานะเป็น ไม่อนุมัติ
      const currentData = watch();
      const silent = await handleSave(currentData, true, 5, data?.reason);
      if (silent) {
        // ส่งเมลไม่อนุมัติ
        const payload = {
          mode: "PROMOTION_APPROVE",
          template_code: "03",
          promotion_id: watch("promotionId"),
        };
        const response = await fetch(
          `/api/direct?action=ProductRecordApprove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (response.status !== 200) {
          throw new Error("");
        }
        handleNotification(
          "ปฏิเสธการขออนุมัติสำเร็จ",
          () => setOpen(false),
          null,
          "info",
          "ตกลง"
        );
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleDrop = async () => {
    setLoading(true);
    try {
      // silent อัพเดตสถานะเป็น ยกเลิกใช้งาน
      const currentData = watch();
      const silent = await handleSave(currentData, true, 4);
      if (silent) {
        // ส่งเมลยกเลิกใช้งาน
        const payload = {
          mode: "PROMOTION_APPROVE",
          template_code: "04",
          promotion_id: watch("promotionId"),
        };
        const response = await fetch(
          `/api/direct?action=ProductRecordApprove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (response.status !== 200) {
          throw new Error("");
        }
        handleNotification(
          "ยกเลิกใช้งานสำเร็จ",
          () => setOpen(false),
          null,
          "info",
          "ตกลง"
        );
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleInitiateData = async () => {
    setLoading(true);

    try {
      if (initialData) {
        const sasImage = sasToken?.sas_images;
        const preparedData = {
          promotionId: initialData?.promotion_id,
          promotionCode: initialData?.promotion_code,
          promotionType: initialData?.discount_type
            ? APPLICATION_PROMOTION_TYPE.find(
                (typeItem) => typeItem?.id === initialData?.discount_type
              )
            : null,
          promotionDiscountPercent: 0,
          promotionDiscountBaht: 0,
          promotionCondition: {
            minimumPremium: initialData?.min_premium_amount ?? 0,
            maximumPremium: initialData?.max_premium_amount ?? 0,
            minimumCoverage: initialData?.min_coverage_amount ?? 0,
            maximumCoverage: initialData?.max_coverage_amount ?? 0,
          },
          promotionDisplay: {
            cardText: initialData?.tag_promotion ?? "",
            calculateText: initialData?.remark_promotion_name ?? "",
            bannerImage: null,
            bannerImageString: "",
            bannerImageName: initialData?.content_name,
            bannerImageUrl: initialData?.content_url,
            bannerImageUrlPreview: initialData?.content_url
              ? `${initialData?.content_url}${sasImage}`
              : "",
            description: initialData?.condition_content,
          },
        };

        reset({
          ...preparedData,
        });
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (open) {
      handleInitiateData();
    }
  }, [open]);

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
      <AppRejectPromotion
        open={openReject}
        setOpen={setOpenReject}
        handleReject={handleReject}
      />
      {loading ? (
        <AppLoadData loadingState={0} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <DialogTitle>จัดการโปรโมชั่น</DialogTitle>
          <DialogContent>
            <Grid container justifyContent={"center"}>
              {initialData?.promotion_status === 5 && (
                <Grid item xs={12}>
                  <Grid container justifyContent={"space-around"}>
                    <Grid item xs={11}>
                      <TextField
                        required
                        fullWidth
                        disabled
                        multiline
                        rows={5}
                        label="เหตุผลการปฏิเสธคำขออนุมัติ"
                        margin="dense"
                        size="small"
                        value={initialData?.promotion_status_message ?? ""}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Grid item xs={12}>
                <Grid container justifyContent={"space-around"}>
                  <Grid item xs={5}>
                    <TextField
                      required
                      fullWidth
                      disabled
                      label="รหัสโปรโมชั่น"
                      margin="dense"
                      size="small"
                      {...register("promotionCode")}
                      InputLabelProps={{
                        shrink: !!watch("promotionCode"),
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Controller
                      name={`promotionType`}
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
                              required
                              disabled={disabledInput}
                              label="ประเภทส่วนลด"
                              options={APPLICATION_PROMOTION_TYPE}
                              onChange={(event, value) => {
                                onChange(value);
                              }}
                              {...otherProps}
                              error={Boolean(errors?.promotionType)}
                            />
                            <FormHelperText error={errors?.promotionType}>
                              {errors?.promotionType?.message}
                            </FormHelperText>
                          </>
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent={"space-around"}>
                  <Grid item xs={5}>
                    <TextField
                      required
                      fullWidth
                      disabled
                      label="ส่วนลด (%)"
                      margin="dense"
                      size="small"
                      {...register("promotionDiscountPercent")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      required
                      fullWidth
                      disabled
                      label="ส่วนลด (บาท)"
                      margin="dense"
                      size="small"
                      {...register("promotionDiscountPercent")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                  <DialogTitle>เงื่อนไขการใช้งาน</DialogTitle>
                </Card>
                <Card
                  sx={{
                    border: "1px solid",
                    borderColor: "#e7e7e7",
                    padding: 2,
                  }}
                >
                  <Grid container justifyContent={"space-around"}>
                    <Grid item xs={5}>
                      <TextField
                        required
                        fullWidth
                        disabled={disabledInput}
                        label="เบี้ยต่ำสุด (บาท)"
                        margin="dense"
                        size="small"
                        type="number"
                        {...register("promotionCondition.minimumPremium")}
                        InputLabelProps={{
                          shrink:
                            watch("promotionCondition.minimumPremium") != null,
                        }}
                        error={errors?.promotionCondition?.minimumPremium}
                      />
                      <FormHelperText
                        error={errors?.promotionCondition?.minimumPremium}
                      >
                        {errors?.promotionCondition?.minimumPremium?.message}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        required
                        fullWidth
                        disabled={disabledInput}
                        label="เบี้ยสูงสุด (บาท)"
                        margin="dense"
                        size="small"
                        type="number"
                        {...register("promotionCondition.maximumPremium")}
                        InputLabelProps={{
                          shrink:
                            watch("promotionCondition.maximumPremium") != null,
                        }}
                        error={errors?.promotionCondition?.maximumPremium}
                      />
                      <FormHelperText
                        error={errors?.promotionCondition?.maximumPremium}
                      >
                        {errors?.promotionCondition?.maximumPremium?.message}
                      </FormHelperText>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent={"space-around"}>
                    <Grid item xs={5}>
                      <TextField
                        required
                        fullWidth
                        disabled={disabledInput}
                        label="ทุนต่ำสุด (บาท)"
                        margin="dense"
                        size="small"
                        type="number"
                        {...register("promotionCondition.minimumCoverage")}
                        InputLabelProps={{
                          shrink:
                            watch("promotionCondition.minimumCoverage") != null,
                        }}
                        error={errors?.promotionCondition?.minimumCoverage}
                      />
                      <FormHelperText
                        error={errors?.promotionCondition?.minimumCoverage}
                      >
                        {errors?.promotionCondition?.minimumCoverage?.message}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        required
                        fullWidth
                        disabled={disabledInput}
                        label="ทุนสูงสุด (บาท)"
                        margin="dense"
                        size="small"
                        type="number"
                        {...register("promotionCondition.maximumCoverage")}
                        InputLabelProps={{
                          shrink:
                            watch("promotionCondition.maximumCoverage") != null,
                        }}
                        error={errors?.promotionCondition?.maximumCoverage}
                      />
                      <FormHelperText
                        error={errors?.promotionCondition?.maximumCoverage}
                      >
                        {errors?.promotionCondition?.maximumCoverage?.message}
                      </FormHelperText>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                  <DialogTitle>การแสดงผล</DialogTitle>
                </Card>
                <Card
                  sx={{
                    border: "1px solid",
                    borderColor: "#e7e7e7",
                    padding: 2,
                  }}
                >
                  <Grid container justifyContent={"space-around"}>
                    <Grid item xs={5}>
                      <TextField
                        required
                        fullWidth
                        disabled={disabledInput}
                        label="ข้อความ (แสดงมุมบนซ้ายของการ์ด)"
                        margin="dense"
                        size="small"
                        {...register("promotionDisplay.cardText")}
                        inputProps={{ maxLength: 100 }}
                        InputLabelProps={{
                          shrink: watch("promotionDisplay.cardText") != null,
                        }}
                        error={errors?.promotionDisplay?.cardText}
                      />
                      <FormHelperText
                        error={errors?.promotionDisplay?.cardText}
                      >
                        {errors?.promotionDisplay?.cardText?.message}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        required
                        fullWidth
                        disabled={disabledInput}
                        label="ข้อความ (แสดงด้านล่างโปรโมชั่นหน้าคำนวณ)"
                        margin="dense"
                        size="small"
                        {...register("promotionDisplay.calculateText")}
                        inputProps={{ maxLength: 100 }}
                        InputLabelProps={{
                          shrink:
                            watch("promotionDisplay.calculateText") != null,
                        }}
                        error={errors?.promotionDisplay?.calculateText}
                      />
                      <FormHelperText
                        error={errors?.promotionDisplay?.calculateText}
                      >
                        {errors?.promotionDisplay?.calculateText?.message}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={11}>
                      <input
                        ref={bannerRef}
                        accept={defaultFileAccept.join(",")}
                        type="file"
                        id="upload-input"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          handleImageChange(
                            event,
                            bannerRef,
                            "promotionDisplay.bannerImageName",
                            "promotionDisplay.bannerImageString",
                            "promotionDisplay.bannerImage",
                            "promotionDisplay.bannerImageUrlPreview"
                          );
                        }}
                      />
                      <TextField
                        required
                        fullWidth
                        margin="dense"
                        size="small"
                        disabled={disabledInput}
                        label="รูปภาพแบนเนอร์ (1600 x 2000 px)"
                        {...register("promotionDisplay.bannerImageName")}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                disabled={disabledInput}
                                sx={{ color: "GrayText" }}
                                onClick={() => {
                                  if (bannerRef.current) {
                                    bannerRef.current.click();
                                  }
                                }}
                              >
                                อัปโหลด
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink:
                            watch("promotionDisplay.bannerImageName") != null,
                        }}
                        error={Boolean(
                          errors?.promotionDisplay?.bannerImageName
                        )}
                      />
                      <FormHelperText
                        error={Boolean(
                          errors?.promotionDisplay?.bannerImageName
                        )}
                      >
                        {errors?.promotionDisplay?.bannerImageName?.message}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={11} my={1}>
                      <Box
                        sx={{
                          aspectRatio: 1600 / 2000,
                          border: "0px solid red",
                        }}
                      >
                        <NextImage
                          alt="promotion"
                          src={
                            watch(
                              "promotionDisplay.bannerImageUrlPreview"
                            )?.trim()
                              ? watch("promotionDisplay.bannerImageUrlPreview")
                              : "/images/1600x2000.png"
                          }
                          width={1600}
                          height={2000}
                          style={{
                            aspectRatio: 1600 / 2000,
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={11}>
                      <Controller
                        name={`promotionDisplay.description`}
                        control={control}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <AppWyswig
                              editable={!disabledInput}
                              value={value}
                              onChange={(value) => {
                                onChange(value);
                              }}
                            />
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              ยกเลิก
            </Button>
            {openForApprove && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleNotification(
                      "คุณต้องการยืนยันการไม่อนุมัติหรือไม่ ?",
                      () => {
                        setOpenReject(true);
                      },
                      null,
                      "question"
                    );
                  }}
                >
                  ไม่อนุมัติ
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleNotification(
                      "คุณต้องการยืนยันการอนุมัติหรือไม่ ?",
                      async () => await handleApprove(),
                      null,
                      "question"
                    );
                  }}
                >
                  อนุมัติ
                </Button>
              </>
            )}
            {openForDrop && (
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleNotification(
                    "คุณต้องการยืนยันการยกเลิกใช้งานหรือไม่ ?",
                    async () => await handleDrop(),
                    null,
                    "question"
                  );
                }}
              >
                ยกเลิกใช้งาน
              </Button>
            )}
            {disabledInput ? null : (
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  handleNotification(
                    "คุณต้องการยืนยันการบันทึกและขออนุมัติใช้งานหรือไม่ ?",
                    async () => await handleRequestForApprove(),
                    null,
                    "question"
                  );
                }}
              >
                ขออนุมัติ
              </Button>
            )}
            {disabledInput ? null : (
              <Button
                disabled={!isDirty}
                variant="contained"
                color="primary"
                type="submit"
              >
                บันทึก
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleSnackAlert({
                  open: true,
                  message: "ทำรายการไม่สำเร็จ",
                });
              }}
            >
              ดูตัวอย่าง
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default AppManagePromotion;
