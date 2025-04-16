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
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { AppCard } from "@/components";
import { useEffect, useState } from "react";
import { useAppForm, useAppSnackbar } from "@/hooks";
import { Yup } from "@/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setBrokerId } from "@/stores/slices";

const AppCommonData = ({ mode }) => {
  const dispatch = useAppDispatch();
  const brokerId = useAppSelector((state) => state.global.brokerId);
  const [GeneralInfo, SetGeneralInfo] = useState();
  const [ConfirmEmail, setConfirmEmail] = useState([]);
  const [ConfirmEmailCC, setConfirmEmailCC] = useState([]);
  const [ContactEmail, setContactEmail] = useState([]);
  const [ContactEmailCC, setContactEmailCC] = useState([]);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { handleSnackAlert } = useAppSnackbar();
  const validationSchema = Yup.array().of(Yup.object().shape({}));
  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      GeneralInfo: [
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
    },
  });

  const {
    reset,
    watch,
    setValue,
    register,
    formState: { errors },
  } = formMethods;
  const baseName = "GeneralInfo";
  const baseErrors = errors?.[baseName];

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/direct?action=GetDirectGeneralInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const result = Array.from(data || []).map((item) => {
        return {
          ...item,
          mail_to: item.mail_to.split(";"),
          mail_cc: item.mail_cc.split(";"),
        };
      });
      reset({ GeneralInfo: result });

      SetGeneralInfo(data[0]);
      dispatch(setBrokerId(data[0].broker_id));
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด ${error}`,
      });
    } finally {
      setLoading(false);
      setConfirmEmail(watch(`${baseName}.0.mail_to`));
      setConfirmEmailCC(watch(`${baseName}.0.mail_cc`));
      setContactEmail(watch(`${baseName}.1.mail_to`));
      setContactEmailCC(watch(`${baseName}.1.mail_cc`));
    }
  };
  useEffect(() => {
    handleFetchData();
  }, []);

  const onSubmit = async () => {
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
          mail_to: ConfirmEmail.join(";"),
          mail_cc: ConfirmEmailCC.join(";"),
          template_code: watch(`${baseName}.0.template_code`),
          update_by: "admin",
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
          mail_to: ContactEmail.join(";"),
          mail_cc: ContactEmailCC.join(";"),
          template_code: watch(`${baseName}.1.template_code`),
          update_by: "admin",
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
        alert("บันทึกข้อมูลสำเร็จ");
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

  const onReset = () => {
    reset();
    setConfirmEmail(watch(`${baseName}.0.mail_to`));
    setConfirmEmailCC(watch(`${baseName}.0.mail_cc`));
    setContactEmail(watch(`${baseName}.1.mail_to`));
    setContactEmailCC(watch(`${baseName}.1.mail_cc`));
  };

  if (loading) {
    return (
      <Grid item xs={10.5} my={4} textAlign={"center"}>
        <CircularProgress />
      </Grid>
    );
  }

  const handleTestSendMail = async (template_code) => {
    setLoading(true);
    try {
      let dataBody;
      if (template_code === 1) {
        dataBody = {
          mail_to: ConfirmEmail.join(";"),
          mail_cc: ConfirmEmailCC.join(";"),
          template_code: "01",
        };
        const response = await fetch(`/api/direct?action=TestSendMail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBody),
        });
        if (response.status === 200) {
          alert("ส่งเมลล์สำเร็จ");
        }
      } else if (template_code === 2) {
        dataBody = {
          mail_to: ContactEmail.join(";"),
          mail_cc: ContactEmailCC.join(";"),
          template_code: "02",
        };
        const response = await fetch(`/api/direct?action=TestSendMail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBody),
        });
        if (response.status === 200) {
          alert("ส่งเมลล์สำเร็จ");
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

  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item xs={11.6}>
        <AppCard
          title={`ช่องทาง${mode}`}
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
          title={`เมล์ยืนยันการชำระค่าเบี้ย`}
          cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputLabel required>อีเมล์ TO</InputLabel>
              <Autocomplete
                value={ConfirmEmail}
                clearIcon={false}
                options={[]}
                freeSolo
                multiple
                onChange={(e, v, r) => {
                  return setConfirmEmail(v);
                }}
                renderTags={(value, props) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...props({ index })}
                      style={{ margin: "auto" }}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    sx={{ paddingTop: 1 }}
                    rows={9}
                    placeholder="user1@email.com; user2@email.com;"
                    {...params}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                อีเมล์ CC
              </Typography>
              <Autocomplete
                value={ConfirmEmailCC}
                clearIcon={false}
                options={[]}
                freeSolo
                multiple
                onChange={(e, v, r) => {
                  return setConfirmEmailCC(v);
                }}
                renderTags={(value, props) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...props({ index })}
                      style={{ margin: "auto" }}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ paddingTop: 1 }}
                    multiline
                    rows={9}
                    placeholder="user1@email.com; user2@email.com;"
                    {...params}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} textAlign={"end"}>
              <Button
                sx={{
                  width: "15rem",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                }}
                onClick={() => {
                  handleTestSendMail(1);
                }}
              >
                ทดสอบส่งเมลล์
              </Button>
            </Grid>
          </Grid>
        </AppCard>
      </Grid>
      <Grid item xs={11.6} mt={2}>
        <AppCard
          title={`เมล์เพื่อให้เจ้าหน้าที่ติดต่อกลับ`}
          cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputLabel required>อีเมล์ TO</InputLabel>
              <Autocomplete
                value={ContactEmail}
                clearIcon={false}
                options={[]}
                freeSolo
                multiple
                onChange={(e, v, r) => {
                  return setContactEmail(v);
                }}
                renderTags={(value, props) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...props({ index })}
                      style={{ margin: "auto" }}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ paddingTop: 1 }}
                    multiline
                    rows={9}
                    placeholder="user1@email.com; user2@email.com;"
                    {...params}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                อีเมล์ CC
              </Typography>
              <Autocomplete
                value={ContactEmailCC}
                clearIcon={false}
                options={[]}
                freeSolo
                multiple
                onChange={(e, v, r) => {
                  return setContactEmailCC(v);
                }}
                renderTags={(value, props) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...props({ index })}
                      style={{ margin: "auto" }}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ paddingTop: 1 }}
                    multiline
                    rows={9}
                    placeholder="user1@email.com; user2@email.com;"
                    {...params}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} textAlign={"end"}>
              <Button
                sx={{
                  width: "15rem",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                }}
                onClick={() => {
                  handleTestSendMail(2);
                }}
              >
                ทดสอบส่งเมลล์
              </Button>
            </Grid>
          </Grid>
        </AppCard>
      </Grid>
      <Grid container justifyContent={"center"} my={2}>
        <Grid item xs={11.6}>
          <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
            <Grid container spacing={2} justifyContent={"center"} mt={1} mb={3}>
              <Grid item xs={11.6}>
                <Grid container justifyContent={"end"} spacing={2}>
                  <Grid item xs="auto">
                    <Button variant="outlined">ยกเลิก</Button>
                  </Grid>
                  <Grid item xs="auto">
                    <Button variant="outlined" onClick={onReset}>
                      ล้างค่า
                    </Button>
                  </Grid>
                  <Grid item xs="auto">
                    <Button
                      variant="contained"
                      sx={{
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.primary.main,
                      }}
                      onClick={onSubmit}
                    >
                      บันทึก
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AppCommonData;
