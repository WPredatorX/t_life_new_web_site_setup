import { AppAutocomplete, AppNumericFormat } from "@/components";
import {
  Button,
  Card,
  Grid,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import { Controller } from "react-hook-form";

const PageDocumentSetting = () => {
  const theme = useTheme();
  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item xs={11.8}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="สิทธิประโยชน์ตามกรมธรรม์"
              fullWidth
              size="small"
              inputProps={{
                allowNegative: false,
                fixedDecimalScale: true,
              }}
              InputProps={{
                inputComponent: AppNumericFormat,
                endAdornment: (
                  <InputAdornment position="end">อัพโหลด</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
            >
              ดูเอกสาร
            </Button>
          </Grid>
        </Grid>
        <Grid container mt={2}>
          <Grid item xs={8}>
            <Card sx={{ border: "1px solid grey" }}>
              <Grid container justifyContent={"center"}>
                <Grid item xs={11.5}>
                  <Grid container spacing={2} mb={2} mt={0.05}>
                    <Grid item xs={6}>
                      <AppAutocomplete
                        disablePortal
                        fullWidth
                        label="เทมเพลตใบเสนอราคา"
                        options={[
                          {
                            id: "1",
                            label: "template 1",
                          },
                          {
                            id: "2",
                            label: "template 2",
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={3} mt={0.7}>
                      <Button
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        }}
                      >
                        เพิ่มบรรทัด
                      </Button>
                    </Grid>
                    <Grid item xs={3} mt={0.7}>
                      <Button
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        }}
                      >
                        ลบออกทั้งหมด
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={9}>
                      <TextField label="บรรทัดที่ 1" fullWidth size="small" />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        }}
                      >
                        ลบออก
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={9}>
                      <TextField label="บรรทัดที่ 2" fullWidth size="small" />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        }}
                      >
                        ลบออก
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PageDocumentSetting;
