import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
  FormHelperText,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Link,
  Card,
  Switch,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  AppCard,
  AppDataGrid,
  AppStatus,
  AppAutocomplete,
  AppDatePicker,
  AppCollapseCard,
  AppReOrderDatagrid,
} from "@/components";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup } from "@utilities";
import {
  useAppSnackbar,
  useAppRouter,
  useAppForm,
  useAppDispatch,
  useAppSelector,
} from "@hooks";
import { APPLICATION_DEFAULT } from "@constants";
import { format, addYears, addDays, parseISO } from "date-fns";
import {
  RemoveRedEye,
  Edit,
  Search,
  RestartAlt,
  ExpandMore,
  ArrowDropDown,
  Delete,
} from "@mui/icons-material";
import Image from "next/image";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { setDialog, closeDialog } from "@stores/slices";
const AppProfile = () => {
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);
  const theme = useTheme();
  const [ProfileData, setProfileData] = useState();
  const [ProfileBannerData, setProfileBannerData] = useState();
  const [ProfileContact, setProfileContact] = useState();
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

  const InsuranceGroup = [
    {
      title: "ออมทรัพย์",
      status: 3,
      statusText: "เปิดใช้งาน",
      icon1: "icon_2.icon",
      name1: "ออมทรัพย์",
      description1: "ให้ผลตอบแทนสูง",
      icon2: "icon_2.icon",
      name2: "MONEY SAVING",
      description2: "แบบประกันเพื่อนักลงทุน ชื่นชอบการเก็บออม",
      icon3: "icon_2.icon",
      name3: "MONEY SAVING",
      description3:
        "แบบประกันที่ให้ผลตอบแทนสูง ทั้งแบบออมสั้นและออมยาว ช่วยให้คุณบริหารการเงินได้อย่างมี ประสิทธิภาพแบบประกันที่ให้ความ คุ้มครองสูง หมดห่วงกับเหตุการณ์ และสามารถวางแผนอนาคตได้ง่ายๆ",
      product: [{ id: 1, name: "Super Saving 2/1" }],
    },
    {
      title: "คุ้มครอง",
      status: 3,
      statusText: "เปิดใช้งาน",
      icon1: "icon_1.icon",
      name1: "คุ้มครอง",
      description1: "ให้ความคุ้มครองสูง",
      icon2: "icon_1.icon",
      name2: "PROTECTION",
      description2: "แบบประกันคุ้มครองชีวิต เพื่ออนาคตของคนที่คุณรัก",
      icon3: "icon_1.icon",
      name3: "PROTECTION",
      description3:
        "แบบประกันที่ให้ผลตอบแทนสูง ทั้งแบบออมสั้นและออมยาว ช่วยให้คุณบริหารการเงินได้อย่างมี ประสิทธิภาพแบบประกันที่ให้ความ คุ้มครองสูง หมดห่วงกับเหตุการณ์ และสามารถวางแผนอนาคตได้ง่ายๆ",
      product: [{ id: 1, name: "Super Saving 2/1" }],
    },
  ];

  const productColumns = [
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
  ];

  const profileColumns = [
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
    {
      flex: 1,
      field: "actions",
      type: "actions",
      headerAlign: "center",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      getActions: (params) => {
        const id = params?.row?.id;
        let disabledView = false; // TODO: เช็คตามสิทธิ์
        let disabledEdit = false; // TODO: เช็คตามสิทธิ์
        let disabledDelete = false; // TODO: เช็คตามสิทธิ์
        let disabledApprove = false;
        const viewFunction = disabledView ? null : () => handleView();
        const editFunction = disabledEdit ? null : () => handleEdit();
        const deleteFunction = disabledDelete ? null : () => handleDelete();
        const ApproveFunction = disabledApprove ? null : () => handleApprove();
        const defaultProps = {
          showInMenu: true,
          sx: {
            "&.Mui-disabled": {
              pointerEvents: "all",
            },
          },
        };

        return [
          <GridActionsCellItem
            key={`view_${id}`}
            icon={<RemoveRedEye />}
            {...defaultProps}
            label="ดูรายละเอียด"
            disabled={disabledView}
            onClick={viewFunction}
          />,
          <GridActionsCellItem
            key={`delete_${id}`}
            icon={<Delete />}
            {...defaultProps}
            label="ลบ"
            disabled={disabledDelete}
            onClick={deleteFunction}
          />,
        ];
      },
    },
  ];
  const bannerColumns = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "type",
      type: "string",
      headerAlign: "center",
      headerName: "ประเภท",
      headerClassName: "header-main",
      align: "center",
      minWidth: 50,
    },
    {
      flex: 1,
      field: "url",
      type: "string",
      headerAlign: "center",
      headerName: "URL",
      headerClassName: "header-main",
      align: "center",
      minWidth: 50,
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

  const profileContactColumns = [
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
      align: "left",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "icon",
      type: "string",
      headerAlign: "center",
      headerName: "ไอคอน",
      headerClassName: "header-main",
      align: "center",
      minWidth: 50,
    },
    {
      flex: 1,
      field: "url",
      type: "string",
      headerAlign: "center",
      headerName: "ลิงค์",
      headerClassName: "header-main",
      align: "left",
      minWidth: 50,
      renderCell: (params) => <Link href="">{params.value}</Link>,
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

  const handleAddBanner = () => {
    const Content = (
      <Grid container>
        <Grid item xs={12}>
          <AppAutocomplete
            disablePortal
            fullWidth
            label="ผลิตภัณฑ์"
            options={[
              {
                id: "1",
                label: "Super Saving 2/1",
              },
              {
                id: "2",
                label: "Super Saving 3/1",
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Switch /> ใช้รูปภาพจากผลิตภัณฑ์
        </Grid>
        <Grid item xs={12}>
          <AppAutocomplete
            disablePortal
            fullWidth
            label="ประเภทแบนเนอร์"
            options={[
              {
                id: "1",
                label: "รูปภาพ",
              },
              {
                id: "2",
                label: "วีดีโอ",
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            label="รูปภาพแบนเนอร์ (2000 x 600 px)"
            //id={`other`}
            //{...register(`other`)}
            //error={Boolean(errors?.name)}
            inputProps={{ maxLength: 100 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            label="รูปภาพเพิ่มเติม"
            //id={`other`}
            //{...register(`other`)}
            //error={Boolean(errors?.name)}
            inputProps={{ maxLength: 100 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    );
    handleNotification("เพิ่มแบนเนอร์", Content, 30);
  };

  const handleAddProduct = () => {
    const Columns = ["Super Saving 2/1", "Super Saving 3/1"];
    const Content = (
      <Grid container>
        <Grid item xs={12}>
          <FormControl sx={{ m: 1, minWidth: "100%", maxWidth: "100%" }}>
            <InputLabel shrink htmlFor="select-multiple-native">
              เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)
            </InputLabel>
            <Select
              fullWidth
              multiple
              native
              //value={personName}
              //onChange={handleChangeMultiple}
              label="เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)"
              inputProps={{
                id: "select-multiple-native",
              }}
            >
              {Columns.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
    handleNotification("ผลิตภัณฑ์", Content, 30);
  };

  const handleAddSocial = () => {
    const Content = (
      <Grid container>
        <Grid item xs={12}>
          <Switch required /> สถานะ
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            label="ชื่อ"
            required
            //id={`other`}
            //{...register(`other`)}
            //error={Boolean(errors?.name)}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            label="ไอคอน"
            required
            //id={`other`}
            //{...register(`other`)}
            //error={Boolean(errors?.name)}
            inputProps={{ maxLength: 100 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            label="ลิ้งค์"
            required
            //id={`other`}
            //{...register(`other`)}
            //error={Boolean(errors?.name)}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>
      </Grid>
    );
    handleNotification("จัดการโซเชียล", Content, 30);
  };

  const handleNotification = (
    message,
    Content,
    dialogWidth,
    mode,
    callback
  ) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: message,
        width: dialogWidth,
        useDefaultBehavior: false,
        renderAction: () => {
          return (
            <Grid container justifyContent={"center"}>
              <Grid item xs={11}>
                {Content}
              </Grid>
              <Grid container justifyContent={"space-around"} mt={2}>
                <Grid item xs={11}>
                  <Grid container justifyContent={"end"} spacing={2}>
                    <Grid item xs={12} md="auto">
                      <Button
                        variant="outlined"
                        sx={{
                          fontSize: "1.8rem",
                          fontWeight: 700,
                        }}
                        onClick={() => {
                          dispatch(closeDialog());
                        }}
                      >
                        ยกเลิก
                      </Button>
                    </Grid>

                    <Grid item xs={12} md="auto">
                      <Button
                        variant="contained"
                        sx={{
                          fontSize: "1.8rem",
                          fontWeight: 700,
                          color: theme.palette.common.white,
                        }}
                        onClick={() => {
                          dispatch(closeDialog());
                        }}
                      >
                        บันทึก
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      })
    );
  };
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
  const handleFetchProfileBanner = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/direct?action=GetProfileBannerById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setProfileBannerData(data);
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };
  const handleFetchProfileContact = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/direct?action=GetContactById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setProfileContact(data);
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };
  const handleRowOrderChange = async (params) => {
    setLoading(true);
    const newRows = await updateRowPosition(
      params.oldIndex,
      params.targetIndex,
      rows
    );

    setRows(newRows);
    setLoading(false);
  };
  useEffect(() => {
    handleFetchProfile();
    handleFetchProfileBanner();
    handleFetchProfileContact();
  }, [pageNumber, pageSize]);

  const handlePageModelChange = (model, detail) => {
    setPageNumber(model.page);
    setPageSize(model.pageSize);
  };
  return (
    <Grid container>
      <Grid container justifyContent={"center"} my={2}>
        {
          //#region โปรไฟล์ทั้งหมด
        }
        <Grid item xs={11.6}>
          <AppCard
            title={`โปรไฟล์ทั้งหมด`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container>
              <Grid item xs={12} sx={{ height: "25rem" }} mt={1}>
                <AppDataGrid
                  rows={ProfileData}
                  rowCount={100}
                  columns={profileColumns}
                  hiddenColumn={hiddenColumn}
                  pageNumber={APPLICATION_DEFAULT.dataGrid.pageNumber}
                  pageSize={APPLICATION_DEFAULT.dataGrid.pageSize}
                  onPaginationModelChange={handlePageModelChange}
                />
              </Grid>
            </Grid>
          </AppCard>
        </Grid>
        {
          //#endregion
        }
        {
          //#region โปรไฟล์แสดงผล
        }
        <Grid item xs={11.6} mt={2}>
          <AppCard
            title={`โปรไฟล์แสดงผล`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} md={2}>
                    <Image
                      alt="banner"
                      src={"/images/600x600.png"}
                      width={100}
                      height={100}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                      }}
                    ></Image>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <TextField
                      fullWidth
                      label="โลโก้ (600 x 600 px, 1920 x 1080 px)"
                      margin="dense"
                      size="small"
                      //id={`banner`}
                      //error={Boolean(errors?.name)}
                      inputProps={{ maxLength: 100 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button sx={{ color: "GrayText" }}>อัพโหลด</Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <AppAutocomplete
                      disablePortal
                      fullWidth
                      label="อัตราส่วน"
                      options={[
                        {
                          id: "1",
                          label: "1:1",
                        },
                        {
                          id: "2",
                          label: "16:9",
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      disabled
                      label="ชื่อโปรไฟล์"
                      margin="dense"
                      size="small"
                      required
                      //id={`banner`}
                      //error={Boolean(errors?.name)}
                      inputProps={{ maxLength: 100 }}
                    />
                    {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <AppCard
                  title={`แบนเนอร์`}
                  cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
                >
                  <Grid container>
                    <Grid item xs={12} textAlign={"end"}>
                      <Button onClick={handleAddBanner} variant="contained">
                        เพิ่ม
                      </Button>
                    </Grid>
                    <Grid item xs={12} sx={{ height: "25rem" }} mt={1}>
                      <AppReOrderDatagrid
                        rows={ProfileBannerData}
                        rowCount={100}
                        columns={bannerColumns}
                        hiddenColumn={hiddenColumn}
                        pageNumber={APPLICATION_DEFAULT.dataGrid.pageNumber}
                        pageSize={APPLICATION_DEFAULT.dataGrid.pageSize}
                        onPaginationModelChange={handlePageModelChange}
                        loading={true}
                      />
                    </Grid>
                  </Grid>
                </AppCard>
              </Grid>
            </Grid>
          </AppCard>
        </Grid>
        {
          //#endregion
        }
        {
          //#region กลุ่มแบบประกัน
        }
        <Grid item xs={11.6} mt={2}>
          <AppCard
            title={`กลุ่มแบบประกัน`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container>
              {InsuranceGroup.map((value, index) => (
                <Grid item xs={12}>
                  <Accordion
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
                            defaultValue={value.title}
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
                          <Button variant="outlined">ยกเลิก</Button>
                        </Grid>
                        <Grid item xs="auto">
                          <Button variant="contained">บันทึก</Button>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ borderTop: "1px solid", borderColor: "#e7e7e7" }}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <AppStatus
                            status={value.status}
                            statusText={value.statusText}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="ไอคอน 1 (700 x 800 px)"
                            margin="dense"
                            size="small"
                            defaultValue={value.icon1}
                            //id={`banner`}
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
                            InputLabelProps={{ shrink: !!value.icon1 }}
                          />
                          {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="ชื่อ 1"
                            margin="dense"
                            size="small"
                            defaultValue={value.name1}
                            //id={`banner`}
                            //error={Boolean(errors?.name)}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{ shrink: !!value.name1 }}
                          />
                          {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="คำอธิบาย 1"
                            margin="dense"
                            size="small"
                            defaultValue={value.description1}
                            //id={`banner`}
                            //error={Boolean(errors?.name)}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{ shrink: !!value.description1 }}
                          />
                          {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="ไอคอน 2 (500 x 500 px)"
                            margin="dense"
                            size="small"
                            defaultValue={value.icon2}
                            //id={`banner`}
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
                            InputLabelProps={{ shrink: !!value.icon2 }}
                          />
                          {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="ชื่อ 2"
                            margin="dense"
                            size="small"
                            defaultValue={value.name2}
                            //id={`banner`}
                            //error={Boolean(errors?.name)}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{ shrink: !!value.name2 }}
                          />
                          {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="คำอธิบาย 2"
                            margin="dense"
                            size="small"
                            defaultValue={value.description2}
                            //id={`banner`}
                            //error={Boolean(errors?.name)}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{ shrink: !!value.description2 }}
                          />
                          {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Grid container>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="ไอคอน 3"
                                margin="dense"
                                size="small"
                                defaultValue={value.icon1}
                                //id={`banner`}
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
                                InputLabelProps={{ shrink: !!value.icon1 }}
                              />
                              {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="ชื่อ 3"
                                margin="dense"
                                size="small"
                                defaultValue={value.name1}
                                //id={`banner`}
                                //error={Boolean(errors?.name)}
                                inputProps={{ maxLength: 100 }}
                                InputLabelProps={{ shrink: !!value.name1 }}
                              />
                              {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                              <Grid item xs={12}>
                                <AppAutocomplete
                                  disablePortal
                                  fullWidth
                                  label="ขนาดช่องคำอธิบาย 3"
                                  options={[
                                    {
                                      id: "1",
                                      label: "แบบเล็ก",
                                    },
                                    {
                                      id: "2",
                                      label: "แบบครึ่ง",
                                    },
                                    {
                                      id: "3",
                                      label: "ไม่แสดง",
                                    },
                                  ]}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <AppAutocomplete
                                  disablePortal
                                  fullWidth
                                  label="ตำแหน่งแสดงคำอธิบาย 3"
                                  options={[
                                    {
                                      id: "1",
                                      label: "ซ้าย",
                                    },
                                    {
                                      id: "2",
                                      label: "ขวา",
                                    },
                                    {
                                      id: "3",
                                      label: "ไม่แสดง",
                                    },
                                  ]}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs>
                          <TextField
                            fullWidth
                            label="คำอธิบาย 3"
                            margin="dense"
                            size="small"
                            multiline
                            rows={8}
                            defaultValue={value.description1}
                            //id={`banner`}
                            //error={Boolean(errors?.name)}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{ shrink: !!value.description1 }}
                          />
                          {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={3.5}>
                          <Typography variant="h5" sx={{ fontWeight: 900 }}>
                            ผลิตภัณฑ์
                          </Typography>
                        </Grid>
                        <Grid item xs="auto">
                          <Button
                            variant="contained"
                            onClick={handleAddProduct}
                          >
                            เพิ่ม
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid container mt={2}>
                        <Grid item xs={4}>
                          <AppReOrderDatagrid
                            rows={value.product}
                            rowCount={0}
                            columns={productColumns}
                            hiddenColumn={hiddenColumn}
                            pageNumber={APPLICATION_DEFAULT.dataGrid.pageNumber}
                            pageSize={APPLICATION_DEFAULT.dataGrid.pageSize}
                            onPaginationModelChange={handlePageModelChange}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </AppCard>
        </Grid>
        {
          //#endregion
        }
        {
          //#region สอบถามข้อมูลเพิ่มเติม
        }
        <Grid item xs={11.6} mt={2}>
          <AppCard
            title={`สอบถามข้อมูลเพิ่มเติม`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="เบอร์โทร"
                      margin="dense"
                      size="small"
                      //id={`banner`}
                      //error={Boolean(errors?.name)}
                      inputProps={{ maxLength: 100 }}
                    />
                    {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                  </Grid>
                  <Grid item md></Grid>
                  <Grid item xs={12} md="auto">
                    <Button variant="contained" onClick={handleAddSocial}>
                      เพิ่ม
                    </Button>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} sx={{ height: "25rem" }} mt={1}>
                    <AppDataGrid
                      rows={ProfileContact}
                      rowCount={100}
                      columns={profileContactColumns}
                      hiddenColumn={hiddenColumn}
                      pageNumber={APPLICATION_DEFAULT.dataGrid.pageNumber}
                      pageSize={APPLICATION_DEFAULT.dataGrid.pageSize}
                      onPaginationModelChange={handlePageModelChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AppCard>
        </Grid>
        {
          //#endregion
        }
        {
          //#region ติดต่อเรา
        }
        <Grid item xs={11.6} mt={2}>
          <AppCard
            title={`ติดต่อเรา`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="เบอร์โทร"
                      margin="dense"
                      size="small"
                      //id={`banner`}
                      //error={Boolean(errors?.name)}
                      inputProps={{ maxLength: 100 }}
                    />
                    {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="อีเมล์"
                      margin="dense"
                      size="small"
                      //id={`banner`}
                      //error={Boolean(errors?.name)}
                      inputProps={{ maxLength: 100 }}
                    />
                    {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="เวลาทำการ"
                      margin="dense"
                      size="small"
                      multiline
                      rows={4}
                      //id={`banner`}
                      //error={Boolean(errors?.name)}
                      inputProps={{ maxLength: 100 }}
                    />
                    {/*  <FormHelperText error={errors?.name}>
                    {errors?.name?.message}
                  </FormHelperText> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AppCard>
        </Grid>
        {
          //#endregion
        }
      </Grid>
      <Grid container justifyContent={"center"} my={2}>
        <Grid item xs={11.6}>
          <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
            <Grid container spacing={2} justifyContent={"center"} mt={1}>
              <Grid item xs={11.3}>
                <Grid container justifyContent={"end"} spacing={2}>
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
                      ขออนุมัติ
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
                      บันทึก
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
            <Grid container justifyContent={"center"} my={2}>
              <Grid item xs={11.3}>
                <Grid container spacing={2} justifyContent={"end"}>
                  <Grid item xs={12} md="auto">
                    <Button
                      variant="contained"
                      sx={{
                        color: "white",
                        backgroundColor: theme.palette.error.dark,
                      }}
                    >
                      ไม่อนุมัติ
                    </Button>
                  </Grid>
                  <Grid item xs={12} md="auto">
                    <Button
                      variant="contained"
                      sx={{
                        color: "white",
                        background: "green",
                      }}
                    >
                      อนุมัติ
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
export default AppProfile;
