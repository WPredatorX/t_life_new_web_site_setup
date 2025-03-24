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
  const [checkedCal, setcheckedCal] = useState(true);
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
  const handleCalChange = () => {
    setcheckedCal((prev) => !prev);
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

  const baseName = "document";
  const baseErrors = errors?.[baseName];
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: baseName,
  });

  const AddField_Note = (length) => {
    if (fields.length === 0) {
      register(`document.detail_id`);
      register(`document.document_id`);
      register(`document.quo_document_id`);
      register(`document.product_plan_id`);
      register(`document.create_by`);
      register(`document.create_date`);
      register(`document.update_by`);
      register(`document.update_date`);
      register(`document.is_active`);
      register(`document.description`);
      register(`document.seq`);
      register(`document.detail_type`);
    }

    let data = {
      detail_id: watch(`_document.id`),
      document_id: watch(`_document.id`),
      quo_document_id: watch(`_document.id`),
      product_plan_id: watch(`_document.id`),
      title: watch(`title`),
      create_by: "admin",
      create_date: new Date(),
      update_by: "admin",
      update_date: new Date(),
      is_active: true,
      description: "",
      seq: length + 1,
      detail_type: 1,
    };

    insert(fields.length, data);

    const w = watch();
    console.log(w);
  };

  const DeleteField = (row) => {
    console.log(row);
    remove(row);
  };

  const DocumentExample = async (docCode) => {
    try {
      const response = await fetch(
        `/api/products?action=PreviewReportByDocumentCode&DocumentCode=${docCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/octet-stream",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();

      // ตรวจสอบว่าเป็น PDF หรือไม่
      /*       if (!blob.type.includes("pdf")) {
        throw new Error("ไม่พบไฟล์ PDF");
      } */

      const previewUrl = URL.createObjectURL(blob);

      // เปิด preview ในแท็บใหม่
      const newWindow = window.open(previewUrl, "_blank");
      if (newWindow) {
        newWindow.focus();
      }

      // ลบ URL เมื่อปิดหน้าต่าง
      setTimeout(() => {
        URL.revokeObjectURL(previewUrl);
      }, 1000);

      return previewUrl;
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ขออภัย เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง ${error.message}`,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const AddField_Disease = (length) => {
    if (fields.length === 0) {
      register(`document.detail_id`);
      register(`document.document_id`);
      register(`document.quo_document_id`);
      register(`document.product_plan_id`);
      register(`document.create_by`);
      register(`document.create_date`);
      register(`document.update_by`);
      register(`document.update_date`);
      register(`document.is_active`);
      register(`document.description`);
      register(`document.seq`);
      register(`document.detail_type`);
    }

    let data = {
      detail_id: watch(`_document.id`),
      document_id: watch(`_document.id`),
      quo_document_id: watch(`_document.id`),
      product_plan_id: watch(`_document.id`),
      title: watch(`title`),
      create_by: "admin",
      create_date: new Date(),
      update_by: "admin",
      update_date: new Date(),
      is_active: true,
      description: "",
      seq: length + 1,
      detail_type: 2,
    };

    insert(fields.length, data);

    const w = watch();
    console.log(w);
  };

  const DeleteAll = (detail_type) => {
    let DataForRemove = fields
      .map((item, index) => (item.detail_type === detail_type ? index : -1))
      .filter((index) => index !== -1);
    DataForRemove.sort((a, b) => b - a).forEach((index) => remove(index));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = watch();

      // เตรียมข้อมูลสำหรับส่งไป API
      const payload = {
        product_id: productId,
        common_setting: {
          is_check_fatca: formData.commonSetting?.is_check_fatca || false,
          is_fatca: formData.commonSetting?.is_fatca || false,
          is_sale_fatca: formData.commonSetting?.is_sale_fatca || false,
          is_crs: formData.commonSetting?.is_crs || false,
          is_sale_crs: formData.commonSetting?.is_sale_crs || false,
          is_health: formData.commonSetting?.is_health || false,
          is_refund: formData.commonSetting?.is_refund || false,
          is_recurring: formData.commonSetting?.is_recurring || false,
          is_tex: formData.commonSetting?.is_tex || false,
          is_CalculateFromCoverageToPremium:
            formData.commonSetting?.is_CalculateFromCoverageToPremium || false,
          is_factor: formData.commonSetting?.is_factor || false,
          ordinary_class: formData.commonSetting?.ordinary_class?.id || null,
          cal_temp_code: checkedCal ? "01" : "02",
        },
        document: {
          document_id: formData._document?.id,
          document_code: formData._document?.document_code,
          title: formData.title,
          details: fields.map((field) => ({
            detail_id: field.detail_id,
            document_id: field.document_id,
            description: field.description,
            seq: field.seq,
            detail_type: field.detail_type,
            is_active: field.is_active,
            createBy: field.createBy,
            createDate: field.createDate,
            updateBy: field.updateBy,
            updateDate: field.updateDate,
          })),
        },
      };

      const response = await fetch(
        "/api/products?action=AddOrUpdateProductOnShelf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      handleSnackAlert({
        open: true,
        message: "บันทึกข้อมูลสำเร็จ",
        severity: "success",
      });

      return result;
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
                    name={`commonSetting.is_check_fatca`}
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
                    name={`commonSetting.is_fatca`}
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
                    name={`commonSetting.is_sale_fatca`}
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
                    name={`commonSetting.is_crs`}
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
                    name={`commonSetting.is_sale_crs`}
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
                    name={`commonSetting.is_health`}
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
                    name={`commonSetting.is_refund`}
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
                    name={`commonSetting.is_recurring`}
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
                    name={`commonSetting.is_tex`}
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
                    name={`is_CalculateFromCoverageToPremium`}
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={checkedCal}
                              onChange={(val) => {
                                handleCalChange();
                              }}
                            />
                          }
                          label="คำนวณจากเบี้ยไปทุน"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`is_CalculateFromCoverageToPremium`}
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!checkedCal}
                              onChange={(val) => {
                                handleCalChange();
                              }}
                            />
                          }
                          label="คำนวณจากทุนไปเบี้ย"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`commonSetting.is_factor`}
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
                      name={`ordinary_class`}
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
                                  id: 1,
                                  label: "ขั้นที่ 1",
                                },
                                {
                                  id: 2,
                                  label: "ขั้นที่ 2",
                                },
                                {
                                  id: 3,
                                  label: "ขั้นที่ 3",
                                },
                                {
                                  id: 4,
                                  label: "ขั้นที่ 4",
                                },
                                {
                                  id: 5,
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
                        </InputAdornment>
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
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
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
                    name={`commonSetting.is_send_sms`}
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
                    name={`commonSetting.is_send_mail`}
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
                    name={`_document`}
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
                  <Button
                    variant="contained"
                    onClick={() => {
                      DocumentExample(watch(`_document.document_code`));
                    }}
                  >
                    ดูเอกสาร
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1}>
                {type === "0" && (
                  <Grid item xs={7}>
                    <TextField
                      label="ชื่อสำหรับแสดงบนหัวกระดาษของสัญญาเพิ่มเติม"
                      fullWidth
                      size="small"
                      id={`title`}
                      defaultValue={watch(`title`) ? watch(`title`) : ""}
                      {...register(`title`)}
                      inputProps={{ maxLength: 100 }}
                      InputLabelProps={watch(`title`) && { shrink: true }}
                      error={Boolean(errors?.name)}
                    />
                    <FormHelperText error={errors?.name}>
                      {errors?.name?.message}
                    </FormHelperText>
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
                              <Button
                                variant="contained"
                                onClick={() => {
                                  AddField_Note(
                                    fields.filter(
                                      (item) => item.detail_type === 1
                                    ).length
                                  );
                                }}
                              >
                                เพิ่มบรรทัด
                              </Button>
                            </Grid>
                            <Grid item xs="auto">
                              <Button
                                variant="contained"
                                onClick={() => {
                                  DeleteAll(1);
                                }}
                              >
                                ลบทั้งหมด
                              </Button>
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
                    {fields.map(
                      (doc, docindex) =>
                        doc.detail_type === 1 && (
                          <Grid container spacing={2} key={docindex}>
                            <Grid item xs={11}>
                              <TextField
                                fullWidth
                                label={`บรรทัดที่ ${doc.seq}`}
                                margin="dense"
                                size="small"
                                inputProps={{ maxLength: 100 }}
                                InputLabelProps={
                                  doc.description && { shrink: true }
                                }
                                {...register(
                                  `${baseName}.${docindex}.description`
                                )}
                                error={Boolean(errors?.name)}
                              />
                              <FormHelperText error={errors?.name}>
                                {errors?.name?.message}
                              </FormHelperText>
                            </Grid>
                            <Grid item xs={1}>
                              <Grid
                                container
                                spacing={2}
                                justifyContent={"end"}
                              >
                                <Grid item xs="auto" mt={1}>
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      DeleteField(docindex);
                                    }}
                                  >
                                    ลบออก
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        )
                    )}
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
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    AddField_Disease(
                                      fields.filter(
                                        (item) => item.detail_type === 2
                                      ).length
                                    );
                                  }}
                                >
                                  เพิ่มบรรทัด
                                </Button>
                              </Grid>
                              <Grid item xs="auto">
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    DeleteAll(2);
                                  }}
                                >
                                  ลบทั้งหมด
                                </Button>
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
                      {fields.map(
                        (doc, docindex) =>
                          doc.detail_type === 2 && (
                            <Grid container spacing={2} key={docindex}>
                              <Grid item xs={11}>
                                <TextField
                                  fullWidth
                                  label={`บรรทัดที่ ${doc.seq}`}
                                  margin="dense"
                                  size="small"
                                  inputProps={{ maxLength: 100 }}
                                  InputLabelProps={
                                    doc.description && { shrink: true }
                                  }
                                  {...register(
                                    `${baseName}.${docindex}.description`
                                  )}
                                  error={Boolean(errors?.name)}
                                />
                                <FormHelperText error={errors?.name}>
                                  {errors?.name?.message}
                                </FormHelperText>
                              </Grid>
                              <Grid item xs={1}>
                                <Grid
                                  container
                                  spacing={2}
                                  justifyContent={"end"}
                                >
                                  <Grid item xs="auto" mt={1}>
                                    <Button
                                      variant="contained"
                                      onClick={() => {
                                        DeleteField(docindex);
                                      }}
                                    >
                                      ลบออก
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          )
                      )}
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
