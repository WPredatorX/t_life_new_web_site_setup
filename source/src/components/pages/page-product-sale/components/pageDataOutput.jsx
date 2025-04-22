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
  CircularProgress,
} from "@mui/material";
import {
  AppCard,
  AppDataGrid,
  AppStatus,
  AppAutocomplete,
  AppDatePicker,
  AppCollapseCard,
  AppWyswig,
  AppStatusBool,
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
const PageDataOutput = ({ saleChannelId }) => {
  const { handleSnackAlert } = useAppSnackbar();
  const brokerId = useAppSelector((state) => state.global.brokerId);
  const validationSchema = Yup.object().shape({
    id: Yup.string().nullable(),
    InsuranceGroup: Yup.string().nullable(),
    SubBodyContent: Yup.object().shape({
      id: Yup.string().required("Required"),
      main_id: Yup.string().required("Required"),
      product_sale_group_id: Yup.string().required("Required"),
      product_sale_group_type: Yup.string().required("Required"),
      product_sale_channel_id: Yup.string().required("Required"),
      seq_content: Yup.number().nullable(),
      icon: Yup.string().nullable(),
      title: Yup.string().nullable(),
      sub_title: Yup.string().nullable(),
      description: Yup.string().nullable(),
      tag_promotion: Yup.string().nullable(),
      tag_sale: Yup.string().nullable(),
      more_link_url: Yup.string().nullable().url("Must be a valid URL"),
      buy_link_url: Yup.string().nullable().url("Must be a valid URL"),
      content_additional_url: Yup.string()
        .nullable()
        .url("Must be a valid URL"),
      description_placement: Yup.string().nullable(),
      content_url: Yup.string().nullable(),
      content_1: Yup.string().nullable(),
      content_2: Yup.string().nullable(),
    }),
    ContentSection: Yup.object().shape({
      item_id: Yup.string().required("Required"),
      title_item: Yup.string().required("Required"),
      section_content_item: Yup.string().required("Required"),
      content_item_file_name: Yup.string().nullable(),
      content_item_file_type: Yup.string().nullable(),
      section_condition_id: Yup.string().nullable(),
      condition_title: Yup.string().nullable(),
      description: Yup.string().nullable(),
      section_id: Yup.string().required("Required"),
      product_sale_channel_id: Yup.string().required("Required"),
      seq_content: Yup.number().nullable(),
      section_name: Yup.string().required("Required"),
      section_content: Yup.string().nullable(),
      section_content_name: Yup.string().nullable(),
      section_content_type: Yup.string().nullable(),
      tag_promotion: Yup.string().nullable(),
      is_full: Yup.boolean().nullable(),
      is_active: Yup.boolean().nullable(),
      create_date: Yup.date().required(),
      create_by: Yup.string().nullable(),
      update_date: Yup.date().required(),
      update_by: Yup.string().nullable(),
    }),
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
      SubBodyContent: {
        id: "",
        main_id: "",
        product_sale_group_id: "",
        product_sale_group_type: "",
        product_sale_channel_id: "",
        seq_content: null,
        icon: "",
        title: "",
        sub_title: "",
        description: "",
        tag_promotion: "",
        tag_sale: "",
        more_link_url: null,
        buy_link_url: null,
        content_additional_url: null,
        description_placement: null,
        content_url: "",
        content_1: "",
        content_2: "",
      },
      ContentSection: {
        item_id: "",
        title_item: "",
        section_content_item: "",
        content_item_file_name: null,
        content_item_file_type: null,
        section_condition_id: null,
        condition_title: null,
        description: null,
        section_id: "",
        product_sale_channel_id: "",
        seq_content: null,
        section_name: "",
        section_content: null,
        section_content_name: null,
        section_content_type: null,
        tag_promotion: null,
        is_full: false,
        is_active: true,
        create_date: new Date(),
        create_by: null,
        update_date: new Date(),
        update_by: null,
      },
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
  const [contentSection, setContentSection] = useState([]);


  const theme = useTheme();
  const [ProfileData, setProfileData] = useState();
  const [ProfileOption, setProfileOption] = useState([]);

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
      field: "title",
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
        <AppStatusBool
          status={params.row.is_active}
          statusText={params.row.name_status}
        />
      ),
    },
    {
      flex: 1,
      field: "create_by",
      type: "string",
      headerAlign: "center",
      headerName: "สร้างโดย",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "create_date",
      type: "string",
      headerAlign: "center",
      headerName: "สร้างเมื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      valueGetter: (value) => {
        if (!value) return "";
        try {
          let date;
          date = typeof value === "string" ? parseISO(value) : new Date(value);
          if (isNaN(date.getTime())) return value;
          let formattedValue = format(addYears(date, 543), "dd/MM/yyyy");
          return formattedValue;
        } catch (error) {
          return value;
        }
      },
    },
    {
      flex: 1,
      field: "update_by",
      type: "string",
      headerAlign: "center",
      headerName: "แก้ไขโดย",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "update_date",
      type: "string",
      headerAlign: "center",
      headerName: "แก้ไขเมื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      valueGetter: (value) => {
        if (!value) return "";
        try {
          let date;
          date = typeof value === "string" ? parseISO(value) : new Date(value);
          if (isNaN(date.getTime())) return value;
          let formattedValue = format(addYears(date, 543), "dd/MM/yyyy");
          return formattedValue;
        } catch (error) {
          return value;
        }
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
      const response = await fetch(
        `/api/direct/productSale/profile?action=GetBrokerProfiles&brokerId=${brokerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      setProfileData(data);
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  const handleOnRowClick = async (e) => {
    setLoading(true);
    try {
      let body = JSON.stringify({
        broker_profile_id: e.id,
        page_content: "HOME",
      });
      const response = await fetch(
        `/api/direct/productSale/profile?action=GetMainBodyById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
        }
      );
      const data = await response.json();
      setProfileOption(data);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด : " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubBody = async (e) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/direct/productSale/profile?action=GetSubBodyContentByMainBodyIdAndSaleId&mainBodyId=${e.id}&SaleChannelId=${saleChannelId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      const resetData = watch();
      if (data.tag_sale) {
        reset({ ...resetData, Popularity: true });
      }
      reset({ ...resetData, SubBodyContent: { ...data } });
      const subBodyContent = watch("SubBodyContent")
      console.log(subBodyContent)
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด : " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContentSection = async (e) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/direct/productSale/profile?action=GetContentSectionItemsById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_sale_channel_id: saleChannelId,
          }),
        }
      );
      const data = await response.json();
      setContentSection(data);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด : " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      let body = JSON.stringify({
        is_active: contentSection.is_active,
        create_by: contentSection.create_by,
        update_by: contentSection.update_by,
        product_sale_channel_id: contentSection.product_sale_channel_id,
        section_name: contentSection.section_name,
        section_content: contentSection.section_content,
        section_content_name: contentSection.section_content_name,
        section_content_type: contentSection.section_content_type,
        tag_promotion: contentSection.tag_promotion,
        is_full: contentSection.is_full,
        seq_content: contentSection.seq_content,
        title_item: contentSection.title_item,
        section_content_item: contentSection.section_content_item,
        content_item_file_name: contentSection.content_item_file_name,
        content_item_file_type: contentSection.content_item_file_type,
        condition_title: contentSection.condition_title,
        description: contentSection.description,
        sub_description: contentSection.sub_description,
        file_content_item: contentSection.file_content_item
      });
      const response = await fetch(`/api/direct/productSale/profile?action=AddOrUpdateContentSection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      const data = await response.json();
      console.log(data);
      alert("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด : " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProfile();
    handleContentSection();
  }, [pageNumber, pageSize]);
  const handlePageModelChange = (model, detail) => {
    setPageNumber(model.page);
    setPageSize(model.pageSize);
  };
  if (loading) {
    return <CircularProgress />;
  }
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
            onRowClick={handleOnRowClick}
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
                        options={ProfileOption}
                        onChange={(event, value) => {
                          onChange(value);
                          handleSubBody(value);
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
                  disabled
                  fullWidth
                  label="ชื่อ"
                  margin="dense"
                  size="small"
                  value={watch("SubBodyContent.title") && watch("SubBodyContent.title")}
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
                  disabled
                  fullWidth
                  label="แคปชั่น"
                  margin="dense"
                  size="small"
                  value={watch("SubBodyContent.sub_title") && watch("SubBodyContent.sub_title")}
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
                  value={watch("SubBodyContent.description") && watch("SubBodyContent.description")}
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
                  value={watch("SubBodyContent.tag_promotion") && watch("SubBodyContent.tag_promotion")}
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
                  value={watch("SubBodyContent.description_placement") && watch("SubBodyContent.description_placement")}
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
                  value={watch("SubBodyContent.buy_link_url") && watch("SubBodyContent.buy_link_url")}
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
                  value={watch("SubBodyContent.more_link_url") && watch("SubBodyContent.more_link_url")}
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
                  value={watch("SubBodyContent.content_additional_url") && watch("SubBodyContent.content_additional_url")}
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
            {contentSection.map((value, index) => (
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
                        value={value.title_item}
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
                          <Switch checked={value.is_full} onChange={() => {
                            setContentSection(contentSection.map(item => item.id === value.id ? { ...item, is_full: !item.is_full } : item))
                          }} /> <Typography>แสดงแบบเต็มกล่อง</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography sx={{ fontWeight: 900 }}>
                                ประเภท
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              {/*   <AppAutocomplete
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
                                value={value.content_item_file_type || { id: '', label: '' }}
                                onChange={(e, value) => {
                                  setContentSection(contentSection.map(item => item.id === value.id ? { ...item, content_item_file_type: value } : item))
                                }}
                              /> */}
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
                                value={value.section_content_item && value.section_content_item}
                                onChange={(e) => {
                                  setContentSection(contentSection.map(item => item.id === value.id ? { ...item, section_content_item: e.target.value } : item))
                                }}
                                //id={`other`}
                                //{...register(`other`)}
                                //error={Boolean(errors?.name)}
                                inputProps={{ maxLength: 100 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Button sx={{ color: "GrayText" }} onClick={() => {
                                        const input = document.createElement("input");
                                        input.type = "file";
                                        input.accept = "image/*";
                                        input.onchange = (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                              setContentSection(contentSection.map(item =>
                                                item.id === value.id ?
                                                  { ...item, section_content_item: reader.result } :
                                                  item
                                              ));
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        };
                                        input.click();
                                        alert("อัพโหลดสำเร็จ");
                                      }}>
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
                            value={value.condition_title}
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
                      <AppWyswig value={value.description} onChange={(e) => {
                        setContentSection(contentSection.map(item => item.id === value.id ? { ...item, description: e.target.value } : item))
                      }} />
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
      <Grid item xs={12} mt={2}>
        <Card>
          <Grid container spacing={2} justifyContent={"end"}>
            <Grid item xs={11.3}>
              <Grid container justifyContent={"end"} spacing={2}>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    ขออนุมัติ
                  </Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button variant="outlined">ยกเลิก</Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button variant="outlined">ล้างค่า</Button>
                </Grid>

                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    บันทึกแบบร่าง
                  </Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    ดูตัวอย่าง
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PageDataOutput;
