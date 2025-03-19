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
} from "@mui/material";
import { AppCard } from "@/components";
import { useEffect, useState } from "react";
import { useAppSnackbar } from "@/hooks";

const AppCommonData = ({ mode }) => {
  const [GeneralInfo, SetGeneralInfo] = useState();
  const [ConfirmEmail, setConfirmEmail] = useState([]);
  const [ConfirmEmailCC, setConfirmEmailCC] = useState([]);
  const [ContactEmail, setContactEmail] = useState([]);
  const [ContactEmailCC, setContactEmailCC] = useState([]);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { handleSnackAlert } = useAppSnackbar();
  const handleFetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/direct?action=GetDirectGeneralInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      SetGeneralInfo(data[0]);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleFetchData();
  }, []);
  if (loading) {
    return (
      <Grid item xs={10.5} my={4} textAlign={"center"}>
        <CircularProgress />
      </Grid>
    );
  }
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
                value={GeneralInfo && GeneralInfo.i_subbusiness_line}
                variant="outlined"
                size="small"
                fullWidth
                sx={{ paddingTop: 1 }}
              />
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item xs={3}>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                ชื่อ
              </Typography>
              <TextField
                disabled
                value={GeneralInfo && GeneralInfo.c_subbusiness_line}
                variant="outlined"
                size="small"
                fullWidth
                sx={{ paddingTop: 1 }}
              />
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
                      style={{ border: "1px solid red" }}
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
                  <Grid item xs={12} md={2}>
                    <Button variant="outlined" fullWidth>
                      ยกเลิก
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button variant="outlined" fullWidth>
                      ล้างค่า
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.primary.main,
                      }}
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
