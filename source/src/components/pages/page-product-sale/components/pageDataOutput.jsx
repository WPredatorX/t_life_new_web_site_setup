import {
  Box,
  Button,
  Card,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  useTheme,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import {
  AppCard,
  AppDataGrid,
  AppStatus,
  AppAutocomplete,
  AppDatePicker,
  AppCollapseCard,
  AppWyswig,
} from "@/components";
import { useAppDispatch, useAppFieldArray, useAppSelector } from "@hooks";
import { useState, useEffect } from "react";
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { setDialog } from "@stores/slices";
import { Yup } from "@utilities";
import { APPLICATION_DEFAULT } from "@constants";
import { format, addYears, addDays, parseISO } from "date-fns";
import Image from "next/image";
import { ArrowDropDown } from "@mui/icons-material";
const PageDataOutput = () => {
  const validationSchema = Yup.object().shape({
    id: Yup.string().nullable(),
    InsuranceGroup: Yup.string().nullable(),
    name: Yup.string().nullable(),
    Popularity: Yup.mixed().nullable(),
    caption: Yup.string().nullable(),
    detail: Yup.string().nullable(),
    cardDetail: Yup.string().nullable(),
    link: Yup.string().nullable(),
    parameterLink: Yup.string().nullable(),
    createBy: Yup.string().nullable(),
    createDate: Yup.date().nullable(),
    updateBy: Yup.string().nullable(),
    updateDate: Yup.date().nullable(),
    picture: Yup.object().shape({
      banner: Yup.string().nullable(),
      bannerPic: Yup.string().nullable(),
      card: Yup.string().nullable(),
      cardPic: Yup.string().nullable(),
      other: Yup.string().nullable(),
      otherPic: Yup.string().nullable(),
    }),
    content: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().nullable(),
        fullOutput: Yup.mixed().nullable(),
        fileType: Yup.string().nullable(),
        file: Yup.string().nullable(),
        detail: Yup.string().nullable(),
      })
    ),
  });
  const {
    reset,
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: "",
      InsuranceGroup: null,
      name: "",
      Popularity: false,
      caption: "",
      detail: "",
      cardDetail: "",
      link: "",
      parameterLink: "",
      createBy: "",
      createDate: new Date(),
      updateBy: "",
      updateDate: new Date(),
      picture: {
        banner: "",
        bannerPic: "",
        card: "",
        cardPic: "",
        other: "",
        otherPic: "",
      },
      content: [
        { name: "", fullOutput: false, fileType: "", file: "", detail: "" },
      ],
    },
  });
  const content = [
    {
      name: "จุดเด่นแบบประกัน",
      fullOutput: false,
      fileType: "",
      file: "",
      detail: "",
    },
    {
      name: "ข้อมูลแบบประกัน",
      fullOutput: false,
      fileType: "",
      file: "",
      detail: "",
    },
    {
      name: "CLIP VDO",
      fullOutput: false,
      fileType: "",
      file: "",
      detail: "",
    },
    {
      name: "วัตถุประสงค์ของแบบประกัน",
      fullOutput: false,
      fileType: "",
      file: "",
      detail: "",
    },
    {
      name: "ข้อยกเว้นความคุ้มครอง",
      fullOutput: false,
      fileType: "",
      file: "",
      detail: "",
    },
  ];
  const theme = useTheme();
  const [ProfileData, setProfileData] = useState();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const hiddenColumn = {
    id: false,
  };
  const columns = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "name",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "status",
      type: "string",
      headerAlign: "center",
      headerName: "สถานะ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
      renderCell: (params) => (
        <AppStatus status={params.value} statusText={params.row.statusText} />
      ),
    },
    {
      flex: 1,
      field: "createBy",
      type: "string",
      headerAlign: "center",
      headerName: "สร้างโดย",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "createDate",
      type: "string",
      headerAlign: "center",
      headerName: "สร้างเมื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      valueGetter: (value) => {
        let date;
        date = typeof value === "string" ? parseISO(value) : new Date(value);
        let formattedValue = format(addYears(date, 543), "dd/MM/yyyy");
        return formattedValue;
      },
    },
    {
      flex: 1,
      field: "updateBy",
      type: "string",
      headerAlign: "center",
      headerName: "แก้ไขโดย",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "updateDate",
      type: "string",
      headerAlign: "center",
      headerName: "แก้ไขเมื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      valueGetter: (value) => {
        let date;
        date = typeof value === "string" ? parseISO(value) : new Date(value);
        let formattedValue = format(addYears(date, 543), "dd/MM/yyyy");
        return formattedValue;
      },
    },
  ];
  const baseName = "content";
  const baseErrors = errors?.[baseName];
  const { fields, insert, remove } = useAppFieldArray({
    control,
    name: baseName,
  });
  const handleFetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/direct?action=GetProfileByProductId`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProfile();
  }, [pageNumber, pageSize]);
  const handlePageModelChange = (model, detail) => {
    setPageNumber(model.page);
    setPageSize(model.pageSize);
  };
  return (
    <Grid container mt={2}>
      <Grid container spacing={2} justifyContent={"end"}>
        <Grid item xs="auto">
          <Button variant="contained">คัดลอก</Button>
        </Grid>
        <Grid item xs="auto">
          <Button variant="contained">เพิ่ม</Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sx={{ height: "25rem" }} mt={1}>
          <AppDataGrid
            rows={ProfileData}
            rowCount={100}
            columns={columns}
            hiddenColumn={hiddenColumn}
            pageNumber={APPLICATION_DEFAULT.dataGrid.pageNumber}
            pageSize={APPLICATION_DEFAULT.dataGrid.pageSize}
            onPaginationModelChange={handlePageModelChange}
          />
        </Grid>
      </Grid>
      {
        //#region Main Form
      }
      <Grid container>
        <Grid item xs={12}>
          <Grid container>
            <Grid item>
              <Controller
                name="Popularity"
                control={control}
                render={({ field }) => {
                  const { name, onChange, value, ...otherProps } = field;
                  return (
                    <FormControlLabel
                      control={<Switch checked={value} onChange={onChange} />}
                      label="ยอดนิยม"
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Controller
                name={`InsuranceGroup`}
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
                        label="กลุ่มแบบประกัน"
                        options={[
                          {
                            id: "1",
                            label: "ออมทรัพย์",
                          },
                          {
                            id: "2",
                            label: "คุ้มครอง",
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
          </Grid>
        </Grid>
        {/* ชื่อ */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  margin="dense"
                  size="small"
                  id={`name`}
                  {...register(`name`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* แคปชั่น */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="แคปชั่น"
                  margin="dense"
                  size="small"
                  id={`caption`}
                  {...register(`caption`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* รายละเอียด */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="รายละเอียด"
                  margin="dense"
                  size="small"
                  id={`detail`}
                  {...register(`detail`)}
                  multiline
                  rows={5}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* รายละเอียดบน card */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="รายละเอียดบนการ์ด"
                  margin="dense"
                  size="small"
                  id={`cardDetail`}
                  {...register(`cardDetail`)}
                  multiline
                  rows={5}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* หมายเหตุ */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  fullWidth
                  label="หมายเหตุ"
                  margin="dense"
                  size="small"
                  id={`cardDetail`}
                  {...register(`cardDetail`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* ลิ้งเข้าถึงผลิตภัณฑ์ */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="ลิ้งเข้าถึงผลิตภัณฑ์"
                  margin="dense"
                  size="small"
                  id={`link`}
                  {...register(`link`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button sx={{ color: "GrayText" }}>คัดลอก</Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs="auto" mt={1}>
                <Button variant="contained">สร้างลิงค์</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* ลิ้งเข้าถึงผลิตภัณฑ์แบบมีพารามิเตอร์ */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label="ลิ้งเข้าถึงผลิตภัณฑ์แบบมีพารามิเตอร์"
                  margin="dense"
                  size="small"
                  id={`link`}
                  {...register(`parameterLink`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button sx={{ color: "GrayText" }}>คัดลอก</Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs="auto" mt={1}>
                <Button variant="contained">สร้างลิงค์</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* เอกสารโบรชัวร์ */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label="เอกสารโบรชัวร์"
                  margin="dense"
                  size="small"
                  id={`link`}
                  {...register(`BrochureLink`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs="auto" mt={1}>
                <Button variant="contained">ดูตัวเอกสาร</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {
        //#endregion
      }
      {
        //#region picture
      }
      <Grid container>
        <Grid item xs={12}>
          <AppCard
            title={`รูปภาพ`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Image
                      alt="banner"
                      src={"/images/2000x600.png"}
                      width={2000}
                      height={600}
                      style={{
                        aspectRatio: 2000 / 600,
                        border: "2px dashed #e7e7e7",
                        objectFit: "contain",
                      }}
                    ></Image>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="รูปแบนเนอร์ (2000 × 600 px)"
                      margin="dense"
                      size="small"
                      id={`banner`}
                      {...register(`banner`)}
                      error={Boolean(errors?.name)}
                      inputProps={{ maxLength: 100 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error={errors?.name}>
                      {errors?.name?.message}
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Image
                          alt="banner"
                          src={"/images/1000x1200.png"}
                          width={1000}
                          height={1200}
                          style={{
                            aspectRatio: 1000 / 1200,
                            border: "2px dashed #e7e7e7",
                            objectFit: "contain",
                          }}
                        ></Image>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <TextField
                          fullWidth
                          label="รูปการ์ด (1000 × 1200 px)"
                          margin="dense"
                          size="small"
                          id={`card`}
                          {...register(`card`)}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button sx={{ color: "GrayText" }}>
                                  อัพโหลด
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Image
                          alt="banner"
                          src={"/images/600x200.png"}
                          width={600}
                          height={200}
                          style={{
                            aspectRatio: 600 / 200,
                            border: "2px dashed #e7e7e7",
                            objectFit: "contain",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <TextField
                          disabled
                          fullWidth
                          label="รูปภาพเพิ่มเติม (ด้านซ้ายของแบนเนอร์) (600 × 200 px)"
                          margin="dense"
                          size="small"
                          id={`other`}
                          {...register(`other`)}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button sx={{ color: "GrayText" }}>
                                  อัพโหลด
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Image
                      alt="banner"
                      src={"/images/2000x1000.png"}
                      width={2000}
                      height={1000}
                      style={{
                        aspectRatio: 2000 / 1000,
                        border: "2px dashed #e7e7e7",
                        objectFit: "contain",
                      }}
                    ></Image>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="รูปตัวอย่างผลประโยชน์ (2000 × 1000 px)"
                      margin="dense"
                      size="small"
                      id={`Profit`}
                      {...register(`Profit`)}
                      error={Boolean(errors?.name)}
                      inputProps={{ maxLength: 100 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error={errors?.name}>
                      {errors?.name?.message}
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AppCard>
        </Grid>
      </Grid>
      {
        //#endregion
      }
      {
        //#region content
      }
      <Grid container mt={2}>
        <Grid item xs={12}>
          <AppCard
            title={`คอนเท้น`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container spacing={2} justifyContent={"end"}>
              <Grid item xs="auto">
                <Button variant="contained">ลบทั้งหมด</Button>
              </Grid>
              <Grid item xs="auto">
                <Button variant="contained">เพิ่ม</Button>
              </Grid>
            </Grid>
            {content.map((value, index) => (
              <Accordion
                aria-controls="panel1-content"
                key={index}
                sx={{
                  border: "1px solid",
                  borderColor: "#e7e7e7",
                  borderRadius: 2,
                  "&:before": {
                    display: "none",
                  },
                  marginTop: 2,
                }}
              >
                <AccordionSummary expandIcon={<ArrowDropDown />}>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        margin="dense"
                        size="small"
                        defaultValue={value.name}
                        //id={`other`}
                        //{...register(`other`)}
                        //error={Boolean(errors?.name)}
                        inputProps={{ maxLength: 100 }}
                      />
                      {/*                   <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                    </Grid>
                    <Grid item xs></Grid>
                    <Grid item xs="auto">
                      <Button variant="contained">ลบ</Button>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ borderTop: "1px solid", borderColor: "#e7e7e7" }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Switch /> <Typography>แสดงแบบเต็มกล่อง</Typography>
                          {/*  <Controller
                            name="Popularity"
                            control={control}
                            render={({ field }) => {
                              const { name, onChange, value, ...otherProps } =
                                field;
                              return (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={value}
                                      onChange={onChange}
                                    />
                                  }
                                  label="ยอดนิยม"
                                />
                              );
                            }}
                          /> */}
                        </Grid>
                        <Grid item xs={6}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography sx={{ fontWeight: 900 }}>
                                ประเภท
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <AppAutocomplete
                                disablePortal
                                fullWidth
                                label="ประเภท"
                                options={[
                                  {
                                    id: "1",
                                    label: "รูปภาพ",
                                  },
                                  {
                                    id: "2",
                                    label: "วิดีโอ",
                                  },
                                  {
                                    id: "3",
                                    label: "Youtube Link",
                                  },
                                ]}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography sx={{ fontWeight: 900 }}>
                                ไฟล์ / Url (1920 x 1080 px)
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                margin="dense"
                                size="small"
                                //id={`other`}
                                //{...register(`other`)}
                                //error={Boolean(errors?.name)}
                                inputProps={{ maxLength: 100 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Button sx={{ color: "GrayText" }}>
                                        อัพโหลด
                                      </Button>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Image
                        alt="banner"
                        src={"/images/1920x1080.png"}
                        width={1920}
                        height={1080}
                        style={{
                          aspectRatio: 1920 / 1080,
                          border: "2px dashed #e7e7e7",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="h6">ชื่อคำอธิบาย</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            margin="dense"
                            size="small"
                            //id={`other`}
                            //{...register(`other`)}
                            //error={Boolean(errors?.name)}
                            inputProps={{ maxLength: 100 }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {/*to do => ทำตรงนี้เป็น wywig */}
                      <Typography variant="h5" mt={2}>
                        คำอธิบาย
                      </Typography>
                      <AppWyswig />
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container justifyContent={"end"}>
                        <Grid item xs="auto">
                          <Button variant="contained">ดูตัวอย่าง</Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </AppCard>
        </Grid>
      </Grid>
      {
        //#endregion
      }
    </Grid>
  );
};

export default PageDataOutput;
