import {
  Button,
  Grid,
  InputLabel,
  TextField,
  Typography,
  useTheme,
  Autocomplete,
  Chip,
  Card,
  FormHelperText,
} from "@mui/material";
import { AppCard, AppLoadData } from "@/components";
import { useEffect, useState } from "react";
import {
  useAppForm,
  useAppSnackbar,
  useAppDialog,
  useAppRouter,
  useAppFeatureCheck,
} from "@/hooks";
import { Yup } from "@/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks";
import { Controller } from "react-hook-form";

const AppCommonData = ({ mode, brokerData }) => {
  const theme = useTheme();
  const router = useAppRouter();
  const channelName =
    mode === "direct"
      ? "DIRECT"
      : brokerData?.generalInfo[0]?.c_subbusiness_line;
  const { activator } = useAppSelector((state) => state.global);
  const { validFeature: grantCommonEdit } = useAppFeatureCheck([
    "direct.general.write",
    "broker.general.write",
  ]);
  const { handleNotification } = useAppDialog();
  const { handleSnackAlert } = useAppSnackbar();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    generalInfo: Yup.array().of(Yup.mixed()),
    confirmEmail: Yup.array()
      .of(Yup.string().email())
      .min(1, "จำเป็นต้องระบุข้อมูลนี้"),
    confirmEmailCC: Yup.array().of(Yup.string().email()),
    contactEmail: Yup.array()
      .of(Yup.string().email())
      .min(1, "จำเป็นต้องระบุข้อมูลนี้"),
    contactEmailCC: Yup.array().of(Yup.string().email()),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      generalInfo: [
        {
          i_subbusiness_line: "",
          c_subbusiness_line: "",
          i_business_line: "",
          broker_id: "",
          broker_name: "",
          broker_logo: "",
          broker_license_number: "",
          broker_email: "",
          broker_url: "",
          recipient_id: "",
          mail_to: "",
          mail_cc: "",
          template_code: "",
        },
      ],
      confirmEmail: [],
      confirmEmailCC: [],
      contactEmail: [],
      contactEmailCC: [],
    },
  });

  const {
    reset,
    watch,
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = formMethods;
  const baseName = "generalInfo";

  const getEmailErrorByName = (name) => {
    return (
      Array.from(errors?.[name] || []).find((item) => item?.message)?.message ||
      null
    );
  };

  const handleTestSendMail = async (template_code) => {
    setLoading(true);

    try {
      let dataBody;
      if (template_code === 1) {
        dataBody = {
          mail_to: watch("confirmEmail").join(";"),
          mail_cc: watch("confirmEmailCC").join(";"),
          template_code: "01",
        };
        const response = await fetch(`/api/direct?action=TestSendMail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBody),
        });
        if (response.status === 200) {
          handleNotification("ส่งอีเมลสำเร็จ", null, null, "info", "ตกลง");
        }
      } else if (template_code === 2) {
        dataBody = {
          mail_to: watch("contactEmail").join(";"),
          mail_cc: watch("contactEmailCC").join(";"),
          template_code: "02",
        };
        const response = await fetch(`/api/direct?action=TestSendMail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBody),
        });
        if (response.status === 200) {
          handleNotification("ส่งอีเมลสำเร็จ", null, null, "info", "ตกลง");
        }
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`,
        severity: "error",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data, event) => {
    setLoading(true);

    try {
      let generalInfo = [
        {
          i_subbusiness_line: watch(`${baseName}.0.i_subbusiness_line`),
          c_subbusiness_line: watch(`${baseName}.0.c_subbusiness_line`),
          i_business_line: watch(`${baseName}.0.i_business_line`),
          broker_id: watch(`${baseName}.0.broker_id`),
          broker_name: watch(`${baseName}.0.broker_name`),
          broker_logo: watch(`${baseName}.0.broker_logo`),
          broker_license_number: watch(`${baseName}.0.broker_license_number`),
          broker_email: watch(`${baseName}.0.broker_email`),
          broker_url: watch(`${baseName}.0.broker_url`),
          recipient_id: watch(`${baseName}.0.recipient_id`),
          mail_to:
            watch("confirmEmail")?.length > 0
              ? watch("confirmEmail").join(";")
              : "",
          mail_cc:
            watch("confirmEmailCC")?.length > 0
              ? watch("confirmEmailCC").join(";")
              : "",
          template_code: "01",
          update_by: activator,
          update_date: new Date().toISOString(),
        },
        {
          i_subbusiness_line: watch(`${baseName}.1.i_subbusiness_line`),
          c_subbusiness_line: watch(`${baseName}.1.c_subbusiness_line`),
          i_business_line: watch(`${baseName}.1.i_business_line`),
          broker_id: watch(`${baseName}.1.broker_id`),
          broker_name: watch(`${baseName}.1.broker_name`),
          broker_logo: watch(`${baseName}.1.broker_logo`),
          broker_license_number: watch(`${baseName}.1.broker_license_number`),
          broker_email: watch(`${baseName}.1.broker_email`),
          broker_url: watch(`${baseName}.1.broker_url`),
          recipient_id: watch(`${baseName}.1.recipient_id`),
          mail_to:
            watch("contactEmail")?.length > 0
              ? watch("contactEmail").join(";")
              : "",
          mail_cc:
            watch("contactEmailCC")?.length > 0
              ? watch("contactEmailCC").join(";")
              : "",
          template_code: "02",
          update_by: activator,
          update_date: new Date().toISOString(),
        },
      ];

      let dataBody = generalInfo;
      const response = await fetch(`/api/direct?action=AddOrUpdateDirect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBody),
      });

      if (response.status === 200) {
        await response.json();
        handleNotification("บันทึกข้อมูลสำเร็จ", null, null, "info", "ตกลง");
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`,
        severity: "error",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onError = (error, event) => {
    console.error(error);
  };

  const onReset = () => {
    handleNotification(
      "คุณต้องการล้างค่าการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        reset();
      },
      null,
      "question"
    );
  };

  const handleBack = () => {
    handleNotification(
      "คุณต้องการกลับสู่หน้าจอหลักหรือไม่ ?",
      () => {
        router.push("/");
      },
      null,
      "question"
    );
  };

  useEffect(() => {
    if (brokerData) {
      const currentValue = watch();
      reset({
        ...currentValue,
        ...brokerData,
      });
    }
  }, [brokerData]);

  if (loading) {
    return <AppLoadData loadingState={0} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Grid container justifyContent={"center"} my={2}>
        <Grid item xs={11.6}>
          <AppCard
            title={`ช่องทาง ${channelName}`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container>
              <Grid item xs={3}>
                <Typography sx={{ color: theme.palette.text.secondary }}>
                  Sub-Business
                </Typography>
                <TextField
                  disabled
                  value={
                    watch(`${baseName}.0.i_subbusiness_line`) &&
                    watch(`${baseName}.0.i_subbusiness_line`)
                  }
                  variant="outlined"
                  size="small"
                  id={`${baseName}.0.i_subbusiness_line`}
                  {...register(`${baseName}.0.i_subbusiness_line`)}
                  fullWidth
                  sx={{ paddingTop: 1 }}
                  error={Boolean(errors?.name)}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
            </Grid>
            <Grid container mt={2}>
              <Grid item xs={3}>
                <Typography sx={{ color: theme.palette.text.secondary }}>
                  ชื่อ
                </Typography>
                <TextField
                  disabled
                  value={
                    watch(`${baseName}.0.c_subbusiness_line`) &&
                    watch(`${baseName}.0.c_subbusiness_line`)
                  }
                  variant="outlined"
                  size="small"
                  id={`${baseName}.0.c_subbusiness_line`}
                  {...register(`${baseName}.0.c_subbusiness_line`)}
                  fullWidth
                  sx={{ paddingTop: 1 }}
                  error={Boolean(errors?.name)}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </AppCard>
        </Grid>
        <Grid item xs={11.6} mt={2}>
          <AppCard
            title={`อีเมลยืนยันการชำระค่าเบี้ย`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="confirmEmail"
                  control={control}
                  render={({ field: { name, onChange, ...otherProps } }) => {
                    return (
                      <>
                        <InputLabel required>อีเมล TO</InputLabel>
                        <Autocomplete
                          clearIcon={false}
                          options={[]}
                          freeSolo
                          multiple
                          readOnly={!grantCommonEdit}
                          onChange={(e, v, r) => {
                            onChange(v);
                          }}
                          {...otherProps}
                          renderTags={(value, props) =>
                            value.map((option, index) => (
                              <Chip
                                label={option}
                                {...props({ index })}
                                style={{ margin: 5 }}
                                key={index}
                              />
                            ))
                          }
                          renderInput={(params) => {
                            return (
                              <>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  multiline
                                  sx={{
                                    paddingTop: 1,
                                  }}
                                  rows={9}
                                  {...params}
                                  error={errors?.[name]}
                                />
                              </>
                            );
                          }}
                          slotProps={{
                            paper: {
                              sx: {
                                marginTop: 0,
                              },
                            },
                            popper: {
                              sx: {
                                marginTop: 0,
                              },
                            },
                          }}
                          sx={{
                            "& .MuiAutocomplete-tag": {
                              marginTop: 0,
                            },
                            alignItems: "flex-start",
                            "& .MuiInputBase-root": {
                              alignItems: "flex-start",
                            },
                            "& .MuiOutlinedInput-input": {
                              border: "0px solid red",
                            },
                          }}
                        />
                        <FormHelperText error={errors?.[name]}>
                          {errors?.[name]?.message || getEmailErrorByName(name)}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="confirmEmailCC"
                  control={control}
                  render={({ field: { name, onChange, ...otherProps } }) => {
                    return (
                      <>
                        <InputLabel>อีเมล CC</InputLabel>
                        <Autocomplete
                          clearIcon={false}
                          options={[]}
                          freeSolo
                          multiple
                          readOnly={!grantCommonEdit}
                          onChange={(e, v, r) => {
                            onChange(v);
                          }}
                          {...otherProps}
                          renderTags={(value, props) =>
                            value.map((option, index) => (
                              <Chip
                                label={option}
                                {...props({ index })}
                                style={{ margin: 5 }}
                                key={index}
                              />
                            ))
                          }
                          renderInput={(params) => {
                            return (
                              <>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  multiline
                                  sx={{
                                    paddingTop: 1,
                                  }}
                                  rows={9}
                                  {...params}
                                  error={errors?.[name]}
                                />
                              </>
                            );
                          }}
                          slotProps={{
                            paper: {
                              sx: {
                                marginTop: 0,
                              },
                            },
                            popper: {
                              sx: {
                                marginTop: 0,
                              },
                            },
                          }}
                          sx={{
                            "& .MuiAutocomplete-tag": {
                              marginTop: 0,
                            },
                            alignItems: "flex-start",
                            "& .MuiInputBase-root": {
                              alignItems: "flex-start",
                            },
                            "& .MuiOutlinedInput-input": {
                              border: "0px solid red",
                            },
                          }}
                        />
                        <FormHelperText error={errors?.[name]}>
                          {errors?.[name]?.message || getEmailErrorByName(name)}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>

              {grantCommonEdit && (
                <Grid item xs={12} textAlign={"end"}>
                  <Button
                    disabled={watch("confirmEmail")?.length === 0}
                    color="primary"
                    variant="contained"
                    sx={{
                      width: "15rem",
                    }}
                    onClick={() => {
                      handleTestSendMail(1);
                    }}
                  >
                    ทดสอบส่งอีเมล
                  </Button>
                </Grid>
              )}
            </Grid>
          </AppCard>
        </Grid>
        <Grid item xs={11.6} mt={2}>
          <AppCard
            title={`อีเมลเพื่อให้เจ้าหน้าที่ติดต่อกลับ`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="contactEmail"
                  control={control}
                  render={({ field: { name, onChange, ...otherProps } }) => {
                    return (
                      <>
                        <InputLabel required>อีเมล TO</InputLabel>
                        <Autocomplete
                          clearIcon={false}
                          options={[]}
                          freeSolo
                          multiple
                          readOnly={!grantCommonEdit}
                          onChange={(e, v, r) => {
                            onChange(v);
                          }}
                          {...otherProps}
                          renderTags={(value, props) =>
                            value.map((option, index) => (
                              <Chip
                                label={option}
                                {...props({ index })}
                                style={{ margin: 5 }}
                                key={index}
                              />
                            ))
                          }
                          renderInput={(params) => {
                            return (
                              <>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  multiline
                                  sx={{
                                    paddingTop: 1,
                                  }}
                                  rows={9}
                                  {...params}
                                  error={errors?.[name]}
                                />
                              </>
                            );
                          }}
                          slotProps={{
                            paper: {
                              sx: {
                                marginTop: 0,
                              },
                            },
                            popper: {
                              sx: {
                                marginTop: 0,
                              },
                            },
                          }}
                          sx={{
                            "& .MuiAutocomplete-tag": {
                              marginTop: 0,
                            },
                            alignItems: "flex-start",
                            "& .MuiInputBase-root": {
                              alignItems: "flex-start",
                            },
                            "& .MuiOutlinedInput-input": {
                              border: "0px solid red",
                            },
                          }}
                        />
                        <FormHelperText error={errors?.[name]}>
                          {errors?.[name]?.message || getEmailErrorByName(name)}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="contactEmailCC"
                  control={control}
                  render={({ field: { name, onChange, ...otherProps } }) => {
                    return (
                      <>
                        <InputLabel>อีเมล CC</InputLabel>
                        <Autocomplete
                          clearIcon={false}
                          options={[]}
                          freeSolo
                          multiple
                          readOnly={!grantCommonEdit}
                          onChange={(e, v, r) => {
                            onChange(v);
                          }}
                          {...otherProps}
                          renderTags={(value, props) =>
                            value.map((option, index) => (
                              <Chip
                                label={option}
                                {...props({ index })}
                                style={{ margin: 5 }}
                                key={index}
                              />
                            ))
                          }
                          renderInput={(params) => {
                            return (
                              <>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  multiline
                                  sx={{
                                    paddingTop: 1,
                                  }}
                                  rows={9}
                                  {...params}
                                  error={errors?.[name]}
                                />
                              </>
                            );
                          }}
                          slotProps={{
                            paper: {
                              sx: {
                                marginTop: 0,
                              },
                            },
                            popper: {
                              sx: {
                                marginTop: 0,
                              },
                            },
                          }}
                          sx={{
                            "& .MuiAutocomplete-tag": {
                              marginTop: 0,
                            },
                            alignItems: "flex-start",
                            "& .MuiInputBase-root": {
                              alignItems: "flex-start",
                            },
                            "& .MuiOutlinedInput-input": {
                              border: "0px solid red",
                            },
                          }}
                        />
                        <FormHelperText error={errors?.[name]}>
                          {errors?.[name]?.message || getEmailErrorByName(name)}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>

              {grantCommonEdit && (
                <Grid item xs={12} textAlign={"end"}>
                  <Button
                    disabled={watch("contactEmail")?.length === 0}
                    color="primary"
                    variant="contained"
                    sx={{
                      width: "15rem",
                    }}
                    onClick={() => {
                      handleTestSendMail(2);
                    }}
                  >
                    ทดสอบส่งอีเมล
                  </Button>
                </Grid>
              )}
            </Grid>
          </AppCard>
        </Grid>
        <Grid container justifyContent={"center"} my={2}>
          <Grid item xs={11.6}>
            <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
              <Grid
                container
                spacing={2}
                justifyContent={"center"}
                mt={1}
                mb={3}
              >
                <Grid item xs={11.6}>
                  <Grid container justifyContent={"end"} spacing={2}>
                    <Grid item xs="auto">
                      <Button
                        color="inherit"
                        variant="outlined"
                        onClick={handleBack}
                      >
                        กลับหน้าหลัก
                      </Button>
                    </Grid>
                    {grantCommonEdit && (
                      <>
                        <Grid item xs="auto">
                          <Button
                            disabled={!isDirty}
                            variant="outlined"
                            onClick={onReset}
                          >
                            ล้างค่า
                          </Button>
                        </Grid>
                        <Grid item xs="auto">
                          <Button
                            type="submit"
                            disabled={!isDirty}
                            variant="contained"
                            sx={{
                              color: theme.palette.common.white,
                              backgroundColor: theme.palette.primary.main,
                            }}
                          >
                            บันทึก
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default AppCommonData;
