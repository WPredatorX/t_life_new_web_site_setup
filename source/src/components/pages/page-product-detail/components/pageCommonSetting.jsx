"use client";
import { useState, useEffect } from "react";
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import { Yup } from "@/utilities";
import {
  Grid,
  TextField,
  Typography,
  FormHelperText,
  Switch,
  FormControlLabel,
  Button,
  Card,
  useTheme,
  InputAdornment,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AppAutocomplete,
  AppCard,
  AppCardWithTab,
  AppNumericFormat,
} from "@/components";
import { Controller, useFieldArray } from "react-hook-form";
import { setDialog } from "@stores/slices";
import { useAppDispatch, useAppSelector } from "@hooks";
const PageCommonSetting = ({ formMethods, productId, mode, type }) => {
  const [loading, setLoading] = useState(true);
  const { handleSnackAlert } = useAppSnackbar();
  const validationSchema = Yup.object().shape();
  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    handleFetchProduct();
  }, []);

  const handleFetchProduct = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
      } catch (error) {
        handleSnackAlert({
          open: true,
          message: `ขออภัย เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง ${error}`,
        });
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const handleFetchTemplate = async () => {
    try {
      const response = await fetch(`/api/products?action=getProductDocument`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const dataDocument = await response.json();
      return dataDocument;
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ขออภัย เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Grid container spacing={2} justifyContent={"center"}>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={7}>
            <AppCard
              title={`การกรอกใบคำขอ`}
              cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    name="FatcaCrs"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="กรอง FATCA / CRS"
                        />
                      );
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="AskFatca"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="ถามคำถาม Fatca"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="SellFatca"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="ขายผู้ติดเงื่อนไข Fatca"
                        />
                      );
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="AskCrs"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="ถามคำถาม Crs"
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="SellCrs"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="ขายผู้ติดเงื่อนไข Crs"
                        />
                      );
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    name="AskHealth"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="ถามคำถามสุขภาพ"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="has_return_amount"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="เงินคืน"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="next_installment"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="จ่ายงวดต่อ"
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="tax_deduction"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="ลดหย่อนภาษี"
                        />
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </AppCard>
          </Grid>
          <Grid item xs={5}>
            <AppCard
              title={`การคำนวณเบี้ยและการขาย`}
              cardstyle={{
                border: "1px solid",
                borderColor: "#e7e7e7",
                height: "100%",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    name="CalculateFromPremiumToCoverage"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="คำนวณจากเบี้ยไปทุน"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="CalculateFromCoverageToPremium"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="คำนวณจากทุนไปเบี้ย"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="Calculate_factor"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="คิด Factor"
                        />
                      );
                    }}
                  />
                </Grid>
                {type === "0" && (
                  <Grid item xs={12}>
                    <Controller
                      name={`status`}
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
                              label="ขั้นอาชีพต่ำสุดที่ซื้อได้"
                              options={[
                                {
                                  id: "1",
                                  label: "ขั้นที่ 1",
                                },
                                {
                                  id: "2",
                                  label: "ขั้นที่ 2",
                                },
                                {
                                  id: "3",
                                  label: "ขั้นที่ 3",
                                },
                                {
                                  id: "4",
                                  label: "ขั้นที่ 4",
                                },
                                {
                                  id: "5",
                                  label: "ขั้นที่ 5",
                                },
                              ]}
                              onChange={(event, value) => {
                                onChange(value);
                              }}
                              {...otherProps}
                              error={Boolean(errors?.status)}
                            />
                            <FormHelperText error={errors?.status}>
                              {errors?.status?.message}
                            </FormHelperText>
                          </>
                        );
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </AppCard>
          </Grid>
        </Grid>

        <Grid container spacing={1} mt={0.2}>
          <Grid item xs={7}>
            <AppCard
              title={`อัพโหลดเอกสาร`}
              cardstyle={{
                border: "1px solid",
                borderColor: "#e7e7e7",
                minHeight: "20rem",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <TextField
                    label="เอกสารสิทธิประโยชน์ตามกรมธรรม์"
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
                  <Button variant="contained">ดูเอกสาร</Button>
                </Grid>
              </Grid>
              {type === "0" && (
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={10}>
                    <TextField
                      label="เอกสารขั้นอาชีพ"
                      fullWidth
                      size="small"
                      inputProps={{
                        allowNegative: false,
                        fixedDecimalScale: true,
                      }}
                      InputProps={{
                        inputComponent: AppNumericFormat,
                        endAdornment: (
                          <InputAdornment position="end">
                            อัพโหลด
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button variant="contained">ดูเอกสาร</Button>
                  </Grid>
                </Grid>
              )}
            </AppCard>
          </Grid>
          <Grid item xs={5}>
            <AppCard
              title={`การแจ้งเตือนและส่งเอกสาร`}
              cardstyle={{
                border: "1px solid",
                borderColor: "#e7e7e7",
                height: "100%",
              }}
            >
              <Grid container spacing={2} my={1}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="send_sms"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="ส่ง Sms"
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="send_email"
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch checked={value} onChange={onChange} />
                          }
                          label="ส่ง Email"
                        />
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </AppCard>
          </Grid>
        </Grid>
        <Grid container mt={1}>
          <Grid item xs={12}>
            <AppCard
              title={`ใบเสนอราคา`}
              cardstyle={{
                border: "1px solid",
                borderColor: "#e7e7e7",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <Controller
                    name={`ProductDocument`}
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
                            label="เทมเพลตใบเสนอราคา"
                            on
                            onChange={(event, value) => {
                              onChange(value);
                            }}
                            onBeforeOpen={handleFetchTemplate}
                            {...otherProps}
                            error={Boolean(errors?.status)}
                          />
                          <FormHelperText error={errors?.status}>
                            {errors?.status?.message}
                          </FormHelperText>
                        </>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={2} mt={0.7}>
                  <Button variant="contained">ดูเอกสาร</Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1}>
                {type === "0" && (
                  <Grid item xs={7}>
                    <TextField
                      label="ชื่อสำหรับแสดงบนหัวกระดาษของสัญญาเพิ่มเติม"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container mt={2}>
                <Grid item xs={12}>
                  <AppCard
                    title={
                      <Grid container>
                        <Grid item xs={8}>
                          <Typography variant="h5" sx={{ fontWeight: 900 }}>
                            ข้อความหมายเหตุ
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Grid container spacing={2} justifyContent={"end"}>
                            <Grid item xs="auto">
                              <Button variant="contained">เพิ่มบรรทัด</Button>
                            </Grid>
                            <Grid item xs="auto">
                              <Button variant="contained">ลบทั้งหมด</Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                    cardstyle={{
                      border: "1px solid",
                      borderColor: "#e7e7e7",
                    }}
                  >
                    {/*                     <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <TextField label="บรรทัดที่ 1" fullWidth size="small" />
                      </Grid>
                      <Grid item xs={1}>
                        <Button  variant="contained">
                          ลบออก
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={11}>
                        <TextField label="บรรทัดที่ 2" fullWidth size="small" />
                      </Grid>
                      <Grid item xs={1}>
                        <Button  variant="contained">
                          ลบออก
                        </Button>
                      </Grid>
                    </Grid> */}
                  </AppCard>
                </Grid>
              </Grid>
              {type === "0" && (
                <Grid container mt={2}>
                  <Grid item xs={12}>
                    <AppCard
                      title={
                        <Grid container>
                          <Grid item xs={8}>
                            <Typography variant="h5" sx={{ fontWeight: 900 }}>
                              ข้อความรายละเอียดโรค
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Grid container spacing={2} justifyContent={"end"}>
                              <Grid item xs="auto">
                                <Button variant="contained">เพิ่มบรรทัด</Button>
                              </Grid>
                              <Grid item xs="auto">
                                <Button variant="contained">ลบทั้งหมด</Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      }
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      {/*                     <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <TextField label="บรรทัดที่ 1" fullWidth size="small" />
                      </Grid>
                      <Grid item xs={1}>
                        <Button  variant="contained">
                          ลบออก
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={11}>
                        <TextField label="บรรทัดที่ 2" fullWidth size="small" />
                      </Grid>
                      <Grid item xs={1}>
                        <Button  variant="contained">
                          ลบออก
                        </Button>
                      </Grid>
                    </Grid> */}
                    </AppCard>
                  </Grid>
                </Grid>
              )}
            </AppCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PageCommonSetting;
