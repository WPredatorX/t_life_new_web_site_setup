"use client";

import { useState, useRef, Fragment } from "react";
import { useAppSnackbar, useAppDialog, useAppSelector } from "@hooks";
import {
  Grid,
  Switch,
  Button,
  TextField,
  Typography,
  FormHelperText,
  InputAdornment,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { AppCard, AppAutocomplete } from "@/components";
import { Controller, useFieldArray } from "react-hook-form";
import { APPLICATION_CONFIGURATION } from "@constants";

const PageCommonSetting = ({
  mode,
  type,
  formMethods,
  handleFetchTemplate,
}) => {
  const policyDocRef = useRef();
  const { handleSnackAlert } = useAppSnackbar();
  const { handleNotification } = useAppDialog();
  const [occupationFile, setOccupationFile] = useState(null);
  const [loadTemplate, setIsLoadTemplate] = useState(false);
  const [loadPolicy, setLoadPolicy] = useState(false);
  const { sasToken, activator } = useAppSelector((state) => state.global);

  const { documentFileAccept, documentFileExtension } =
    APPLICATION_CONFIGURATION;

  const {
    watch,
    control,
    register,
    setValue,
    formState: { errors },
  } = formMethods;

  const {
    fields: _fieldsDocument1,
    insert: insertDocument1,
    update: updateDocument1,
  } = useFieldArray({
    control,
    name: "document_1",
  });

  const {
    fields: _fieldsDocument2,
    insert: insertDocument2,
    update: updateDocument2,
  } = useFieldArray({
    control,
    name: "document_2",
  });

  const fieldsDocument1 = _fieldsDocument1.filter((item) => item.is_active);
  const fieldsDocument2 = _fieldsDocument2.filter((item) => item.is_active);

  const AddCoument1 = () => {
    const _index = _fieldsDocument1.length;

    const newObj = {
      isNew: true,
      title: "",
      document_id: watch(`selectDoc.id`),
      product_plan_id: watch("commonSetting")?.product_plan_id,
      create_by: activator,
      create_date: new Date(),
      update_by: activator,
      update_date: new Date(),
      is_active: true,
      description: "",
      seq: _fieldsDocument1.length + 1,
      detail_type: 1,
    };

    debugger;

    insertDocument1(_index, newObj);
  };

  const RemoveAllDocument1 = () => {
    debugger;
    const currentDocs = [..._fieldsDocument1].map((item) => {
      return {
        ...item,
        is_active: false,
      };
    });
    setValue(`document_1`, currentDocs);
  };

  const DocumentExample = async (doc) => {
    setIsLoadTemplate(true);
    const currentValue = watch();

    try {
      const payload = {
        quo_document_id: currentValue?.commonSetting?.quo_document_id,
        document_code: doc?.document_code,
      };
      const response = await fetch(
        `/api/products?action=PreviewReportByDocumentCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/octet-stream",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const previewUrl = URL.createObjectURL(blob);
      const newWindow = window.open(previewUrl, "_blank");
      if (newWindow) {
        newWindow.focus();
      }
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ขออภัย เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง ${error.message}`,
      });
      return null;
    } finally {
      setIsLoadTemplate(false);
    }
  };

  const AddField_Disease = () => {
    if (_fieldsDocument2.length === 0) {
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
      document_id: watch(`selectDoc.id`),
      title: watch(`title`),
      create_by: activator,
      create_date: new Date(),
      update_by: activator,
      update_date: new Date(),
      is_active: true,
      description: "",
      seq: _fieldsDocument2.length + 1,
      detail_type: 2,
    };

    insertDocument2(_fieldsDocument2.length, data);
  };

  const handleBenefitFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      if (!documentFileExtension.includes(file.type)) {
        handleSnackAlert({
          open: true,
          message: "กรุณาอัปโหลดไฟล์ PDF เท่านั้น",
          severity: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        setValue("beneficiary_document.policy_document_file", base64String);
        setValue("beneficiary_document.policy_document_name", file.name);
        setValue("beneficiary_document.policy_document_type", 1);
      };
      reader.readAsDataURL(file);

      setValue("beneficiary_document.policy_document_file_blob", file);
    }
  };

  const BeneficiaryDocumentExample = async () => {
    setLoadPolicy(true);
    try {
      let fileUrl = "";
      if (watch("beneficiary_document.policy_document_file_blob")) {
        fileUrl = URL.createObjectURL(
          watch("beneficiary_document.policy_document_file_blob")
        );
      } else {
        const payload = {
          fileName: watch("beneficiary_document.policy_document_name"),
          pdfUrl:
            watch("beneficiary_document.policy_document_file") +
            sasToken?.sas_files,
        };
        const response = await fetch(`/api/direct?action=PreviewPolicy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        fileUrl = blobUrl;
      }

      window.open(fileUrl, "_blank");
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    } finally {
      setLoadPolicy(false);
    }
  };

  const handleOccupationFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      if (!documentFileExtension.includes(file.type)) {
        handleSnackAlert({
          open: true,
          message: "กรุณาอัปโหลดไฟล์ PDF หรือรูปภาพเท่านั้น",
          severity: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        setValue("occupation_document.policy_document_file", base64String);
        setValue("occupation_document.policy_document_name", file.name);
        setValue("occupation_document.policy_document_type", 2);
      };
      reader.readAsDataURL(file);
      setOccupationFile(file);
    }
  };

  const OccupationDocumentExample = async () => {
    const fileURL = URL.createObjectURL(occupationFile);
    window.open(fileURL, "_blank");
    URL.revokeObjectURL(fileURL);
  };

  const renderDocument1 = () => {
    return (
      <>
        {_fieldsDocument1.map((item, index) => {
          if (item.is_active) {
            return (
              <Fragment key={item.id}>
                <Grid container spacing={2}>
                  <Grid item xs={11}>
                    <Controller
                      control={control}
                      name={`document_1.${index}.description`}
                      defaultValue={item.description}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label={`ระบุข้อความ (สูงสุด 140 ตัวอักษร)`}
                          margin="dense"
                          size="small"
                          disabled={mode === "VIEW"}
                          inputProps={{ maxLength: 140 }} // ให้ตรงกับรายงาน RDLC
                          InputLabelProps={item.description && { shrink: true }}
                          {...field}
                          error={Boolean(errors?.document_1?.[index])}
                        />
                      )}
                    />
                    <FormHelperText
                      error={Boolean(errors?.document_1?.[index]?.description)}
                    >
                      {errors?.document_1?.[index]?.description?.message}
                    </FormHelperText>
                  </Grid>
                  {mode !== "VIEW" && (
                    <Grid item xs={1}>
                      <Grid container spacing={2} justifyContent={"end"}>
                        <Grid item xs="auto" mt={1}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleNotification(
                                "คุณต้องการลบรายการนี้หรือไม่ ?",
                                () => {
                                  updateDocument1(index, {
                                    ...item,
                                    is_active: false,
                                  });
                                },
                                null,
                                "question"
                              );
                            }}
                          >
                            ลบออก
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Fragment>
            );
          }
        })}
      </>
    );
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
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
                          }
                          label="จ่ายงวดต่อ"
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name={`commonSetting.is_tax`}
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                    name={`is_CalculateFromPremiumToCoverage`}
                    control={control}
                    disabled={mode === "VIEW"}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={value}
                                onChange={onChange}
                                {...otherProps}
                              />
                            }
                            label="คำนวณจากเบี้ยไปทุน"
                          />
                          <FormHelperText
                            error={Boolean(
                              errors?.is_CalculateFromPremiumToCoverage
                            )}
                          >
                            {errors?.is_CalculateFromPremiumToCoverage?.message}
                          </FormHelperText>
                        </>
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
                        <>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={value}
                                onChange={onChange}
                                {...otherProps}
                              />
                            }
                            label="คำนวณจากทุนไปเบี้ย"
                          />
                          <FormHelperText
                            error={Boolean(
                              errors?.is_CalculateFromCoverageToPremium
                            )}
                          >
                            {errors?.is_CalculateFromCoverageToPremium?.message}
                          </FormHelperText>
                        </>
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
                            <Switch
                              checked={value}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                      name={`commonSetting.ordinary_class`}
                      control={control}
                      defaultValue={
                        watch("commonSetting.ordinary_class") &&
                        Number(watch("commonSetting.ordinary_class")) > 0
                          ? {
                              id: Number(watch("commonSetting.ordinary_class")),
                              label: `ขั้นที่ ${watch(
                                "commonSetting.ordinary_class"
                              )}`,
                            }
                          : null
                      }
                      render={({ field }) => {
                        const { name, onChange, value, ...otherProps } = field;

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
                              value={
                                value
                                  ? {
                                      id: Number(
                                        typeof value === "object"
                                          ? value.id
                                          : value
                                      ),
                                      label: `ขั้นที่ ${
                                        typeof value === "object"
                                          ? value.id
                                          : value
                                      }`,
                                    }
                                  : null
                              }
                              onChange={(event, newValue) => {
                                onChange(newValue);
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
              title={`อัปโหลดเอกสาร`}
              cardstyle={{
                border: "1px solid",
                borderColor: "#e7e7e7",
                minHeight: "20rem",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <TextField
                    label="เอกสารสิทธิประโยชน์ตามกรมธรรม์"
                    fullWidth
                    size="small"
                    disabled={mode === "VIEW"}
                    {...register("beneficiary_document.policy_document_name")}
                    InputProps={{
                      readOnly: true,
                      disabled: mode === "VIEW",
                      endAdornment: (
                        <InputAdornment position="end">
                          <input
                            ref={policyDocRef}
                            type="file"
                            id="benefit-file-upload"
                            style={{ display: "none" }}
                            accept={documentFileAccept.join(",")}
                            onChange={handleBenefitFileUpload}
                          />
                          <label htmlFor="benefit-file-upload">
                            <Button
                              disabled={mode === "VIEW"}
                              component="span"
                              sx={{ color: "GrayText" }}
                            >
                              อัปโหลด
                            </Button>
                          </label>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: !!watch(
                        `beneficiary_document.policy_document_name`
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={"auto"}>
                  <Button
                    disabled={
                      loadPolicy ||
                      !watch(`beneficiary_document.policy_document_name`)
                    }
                    onClick={() => {
                      BeneficiaryDocumentExample();
                    }}
                    variant="contained"
                  >
                    ดูเอกสาร
                    {loadPolicy ? (
                      <CircularProgress sx={{ marginLeft: 2 }} size={20} />
                    ) : null}
                  </Button>
                </Grid>
              </Grid>
              {type === "0" && (
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={10}>
                    <TextField
                      label="เอกสารขั้นอาชีพ"
                      fullWidth
                      size="small"
                      {...register("occupation_document.policy_document_name")}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.gif"
                              style={{ display: "none" }}
                              id="occupation-file-upload"
                              onChange={handleOccupationFileUpload}
                            />
                            <label htmlFor="occupation-file-upload">
                              <Button
                                component="span"
                                sx={{ color: "GrayText" }}
                              >
                                อัปโหลด
                              </Button>
                            </label>
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        shrink: !!watch(
                          `occupation_document.policy_document_name`
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      disabled={
                        !watch(`occupation_document.policy_document_name`)
                      }
                      onClick={() => {
                        OccupationDocumentExample();
                      }}
                      variant="contained"
                    >
                      ดูเอกสาร
                    </Button>
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
                            <Switch
                              checked={value}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                            <Switch
                              checked={value}
                              onChange={onChange}
                              {...otherProps}
                            />
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
                    name={`selectDoc`}
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
                            disabled={mode === "VIEW"}
                            label="เทมเพลตใบเสนอราคา"
                            onChange={(event, newValue) => {
                              debugger;
                              const currentDoc1 = watch("document_1") || [];
                              const tempValue = [...currentDoc1].map((item) => {
                                return {
                                  ...item,
                                  document_id: newValue?.document_id,
                                };
                              });
                              onChange(newValue);
                              setValue("document_1", tempValue);
                            }}
                            {...otherProps}
                            error={Boolean(errors?.selectDoc)}
                            onBeforeOpen={handleFetchTemplate}
                          />
                          <FormHelperText error={errors?.selectDoc}>
                            {errors?.selectDoc?.message}
                          </FormHelperText>
                        </>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={2} mt={0.7}>
                  <Button
                    disabled={!watch("selectDoc") || loadTemplate}
                    variant="contained"
                    onClick={() => {
                      DocumentExample(watch(`selectDoc`));
                    }}
                  >
                    ดูเอกสาร
                    {loadTemplate ? (
                      <CircularProgress sx={{ marginLeft: 2 }} size={20} />
                    ) : null}
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
                          {mode !== "VIEW" && (
                            <Grid container spacing={2} justifyContent={"end"}>
                              <Grid item xs="auto">
                                <Button
                                  disabled={
                                    !watch("selectDoc") ||
                                    fieldsDocument1?.length ===
                                      (watch("selectDoc")
                                        ?.document_detail_size ?? 0)
                                  }
                                  variant="contained"
                                  onClick={() => {
                                    AddCoument1();
                                  }}
                                >
                                  เพิ่มบรรทัด{" "}
                                  {watch("selectDoc")
                                    ? `(${
                                        (watch("selectDoc")
                                          ?.document_detail_size ?? 0) -
                                        fieldsDocument1?.length
                                      })`
                                    : null}
                                </Button>
                              </Grid>
                              <Grid item xs="auto">
                                <Button
                                  disabled={fieldsDocument1.length === 0}
                                  variant="contained"
                                  onClick={() => {
                                    handleNotification(
                                      "คุณต้องการลบรายการทั้งหมดหรือไม่ ?",
                                      () => RemoveAllDocument1(),
                                      null,
                                      "question"
                                    );
                                  }}
                                >
                                  ลบทั้งหมด
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    }
                    cardstyle={{
                      border: "1px solid",
                      borderColor: "#e7e7e7",
                    }}
                  >
                    {renderDocument1()}
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
                          {mode !== "VIEW" && (
                            <Grid item xs={4}>
                              <Grid
                                container
                                spacing={2}
                                justifyContent={"end"}
                              >
                                <Grid item xs="auto">
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      AddField_Disease(fieldsDocument2.length);
                                    }}
                                  >
                                    เพิ่มบรรทัด
                                  </Button>
                                </Grid>
                                <Grid item xs="auto">
                                  <Button
                                    disabled={fieldsDocument2.length === 0}
                                    variant="contained"
                                    onClick={() => {
                                      handleNotification(
                                        "คุณต้องการลบรายการทั้งหมดหรือไม่ ?",
                                        () => {
                                          const currentDocs = [
                                            ..._fieldsDocument2,
                                          ].map((item) => {
                                            return {
                                              ...item,
                                              is_active: false,
                                            };
                                          });
                                          setValue(`document_2`, currentDocs);
                                        },
                                        null,
                                        "question"
                                      );
                                    }}
                                  >
                                    ลบทั้งหมด
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      }
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      {fieldsDocument2.map(
                        (doc, docindex) =>
                          doc.detail_type === 2 && (
                            <Grid container spacing={2} key={doc.id}>
                              <Grid item xs={11}>
                                <Controller
                                  control={control}
                                  name={`document_2.${docindex}.description`}
                                  defaultValue={doc.description}
                                  render={({ field }) => (
                                    <TextField
                                      fullWidth
                                      label={`บรรทัดที่ ${
                                        docindex + 1
                                      } (100 ตัวอักษร)`}
                                      margin="dense"
                                      size="small"
                                      disabled={mode === "VIEW"}
                                      inputProps={{ maxLength: 100 }}
                                      InputLabelProps={
                                        doc.description && { shrink: true }
                                      }
                                      {...field}
                                      error={Boolean(
                                        errors?.document_2?.[docindex]
                                          ?.description
                                      )}
                                    />
                                  )}
                                />
                                <FormHelperText
                                  error={Boolean(
                                    errors?.document_2?.[docindex]?.description
                                  )}
                                >
                                  {
                                    errors?.document_2?.[docindex]?.description
                                      ?.message
                                  }
                                </FormHelperText>
                              </Grid>
                              {mode !== "VIEW" && (
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
                                          handleNotification(
                                            "คุณต้องการลบรายการนี้หรือไม่ ?",
                                            () => {
                                              updateDocument2(docindex, {
                                                ...doc,
                                                is_active: false,
                                              });
                                            },
                                            null,
                                            "question"
                                          );
                                        }}
                                      >
                                        ลบออก
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              )}
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
