import { useEffect, useRef } from "react";
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
import { APPLICATION_CONFIGURATION } from "@constants";

const AppManageSocial = ({ mode, open, setOpen, addSocial, form }) => {
  const { userProfile, sasToken } = useAppSelector((state) => state.global);
  const { activator } = useAppSelector((state) => state.global);
  const { handleNotification } = useAppDialog();
  const iconRef = useRef();

  const { defaultFileAccept, defaultFileExtension, defaultFileSize } =
    APPLICATION_CONFIGURATION;

  const validationSchema = Yup.object().shape({
    name: Yup.string().nullable().required(),
    icon: Yup.mixed().nullable().required(),
    iconName: Yup.string().nullable().required(),
    iconString: Yup.string().nullable(),
    iconUrl: Yup.string().nullable(),
    iconUrlPreview: Yup.string().nullable(),
    link: Yup.string().nullable().required(),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: null,
      icon: null,
      iconName: "",
      iconString: "",
      iconUrl: "",
      iconUrlPreview: "",
      link: null,
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
      () => {
        if (mode === "create") {
          addSocial({
            is_new: true,
            id: crypto.randomUUID(),
            title: data.name,
            icon: data?.iconName,
            iconName: data?.iconName,
            iconUrl: data?.iconUrl,
            iconFile: data?.iconString,
            iconImageUrlPreview: data?.iconUrlPreview,
            url: data.link,
            is_active: null,
            statusName: "รออนุมัติ",
            createBy: activator,
            createDate: new Date().toISOString(),
          });
        } else if (mode === "edit") {
          addSocial({
            ...form,
            title: data?.name,
            icon: data?.iconName,
            iconName: data?.iconName,
            iconFile: data?.iconString,
            iconUrl: data?.iconUrl,
            iconImageUrlPreview: data?.iconUrlPreview,
            url: data.link,
            is_active: null,
            statusName: "รออนุมัติ",
            updateBy: activator,
            updateDate: new Date().toISOString(),
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

      // validate size
      if (selectedFileSize > defaultFileSize) {
        handleNotification("ขนาดไฟล์ต้องไม่เกิน 3Mb.", null, null, "error");
        throw new Error("ขนาดไฟล์ต้องไม่เกิน 3Mb.");
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
    if (open) {
      if (mode === "create") {
        reset({
          name: null,
          icon: null,
          iconName: "",
          iconString: "",
          iconUrl: "",
          iconUrlPreview: "",
          link: null,
        });
      } else if (form) {
        reset({
          name: form?.title ? form.title : null,
          icon: form?.icon ? form.icon : null,
          iconName: form?.icon ?? form?.iconName,
          iconString: form?.iconFile ?? "",
          iconUrl: form?.iconUrl ?? "",
          iconUrlPreview: form?.iconImageUrlPreview ?? "",
          link: form?.url ? form.url : null,
        });
      }
    }
  }, [open]);

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>จัดการโซเชียล</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                margin="dense"
                size="small"
                label="ชื่อ"
                inputProps={{ maxLength: 100 }}
                InputLabelProps={{
                  shrink: !!watch(`name`),
                }}
                {...register(`name`)}
                error={Boolean(errors?.name)}
              />
              <FormHelperText error={Boolean(errors?.name)}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <input
                ref={iconRef}
                accept="image/*"
                type="file"
                id="upload-input"
                style={{ display: "none" }}
                onChange={(e) =>
                  handleImageChange(
                    e,
                    iconRef,
                    "iconName",
                    "iconString",
                    "icon",
                    "iconUrlPreview"
                  )
                }
              />
              <TextField
                required
                fullWidth
                margin="dense"
                size="small"
                value={watch("iconName")}
                label={`ไอคอน (500 x 500px)`}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={{
                  shrink: !!watch(`iconName`),
                }}
                error={Boolean(errors?.iconName)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        sx={{ color: "GrayText" }}
                        onClick={() => {
                          if (iconRef.current) {
                            iconRef.current.click();
                          }
                        }}
                      >
                        อัปโหลด
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText error={Boolean(errors?.iconName)}>
                {errors?.iconName?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                margin="dense"
                size="small"
                label="ลิ้งค์"
                inputProps={{ maxLength: 100 }}
                InputLabelProps={{
                  shrink: !!watch(`link`),
                }}
                {...register(`link`)}
                error={Boolean(errors?.link)}
              />
              <FormHelperText error={Boolean(errors?.link)}>
                {errors?.link?.message}
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

export default AppManageSocial;
