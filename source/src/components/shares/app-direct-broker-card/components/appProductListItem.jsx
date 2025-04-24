import { AppDataGrid, AppStatus } from "@/components";
import { APPLICATION_DEFAULT } from "@/constants";
import { Transform } from "@/utilities";
import {
  ArrowDropDown,
  Check,
  Delete,
  Edit,
  RemoveRedEye,
} from "@mui/icons-material";
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { format, addYears, addDays, parseISO } from "date-fns";
const AppProductListItem = ({ hiddenColumn, formMethods }) => {
  const router = useAppRouter();
  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const [dataSub, setDataSub] = useState({
    rows: [],
    details: [],
    groupType: 0,
    totalRows: 0,
  });
  const [dataSubNoGroup, setDataSubNoGroup] = useState({
    rows: [],
    details: [],
    groupType: 0,
    totalRows: 0,
  });
  const handlePageModelChange = (model, detail) => {
    setPageNumber(model.page);
    setPageSize(model.pageSize);
  };
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
    handleFetchProductSub();
  }, [pageNumber, pageSize]);
  const handleFetchProductSub = async () => {
    setLoading(true);
    try {
      const body = {
        is_active: true,
        product_status: watch("status")
          ? watch("status").id === "0"
            ? null
            : watch("status").id
          : null,
        c_plan: watch(`name`) ? watch(`name`) : null,

        min_coverage_amount_start: watch(`min_coverage_amount_start`),
        min_coverage_amount_end: watch(`min_coverage_amount_end`),
        max_coverage_amount_start: watch(`max_coverage_amount_start`),
        max_coverage_amount_end: watch(`max_coverage_amount_end`),
        create_date_start: watch(`create_date_start`),
        create_date_end: watch(`create_date_end`),
        update_date_start: watch(`update_date_start`),
        update_date_end: watch(`update_date_end`),
      };

      const response = await fetch(
        `/api/direct?action=GetAllProductSaleGroupRider`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      const mapData = data.map((item) => {
        return {
          ...item,
          id: item.item_id,
        };
      });
      setDataSub({
        rows: data,
        details: mapData,
        groupType: data.product_sale_group_type,
        totalRows: data.total_records,
      });

      const responseNoGroup = await fetch(
        `/api/direct?action=GetAllProductSaleRiderDirect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const dataNoGroup = await responseNoGroup.json();
      const mapDataNoGroup = dataNoGroup.map((item) => {
        return {
          ...item,
          id: item.item_id,
        };
      });
      setDataSubNoGroup({
        rows: dataNoGroup,
        details: mapDataNoGroup,
        groupType: dataNoGroup.product_sale_group_type,
        totalRows: dataNoGroup.total_records,
      });
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };
  const subColumn = [
    {
      field: "id",
    },

    {
      flex: 1,
      field: "title",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อผลิตภัณฑ์",
      headerClassName: "header-main",
      align: "left",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "product_status",
      type: "string",
      headerAlign: "center",
      headerName: "สถานะ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
      renderCell: (params) => (
        <AppStatus
          status={params.value}
          statusText={params.row.product_status_name}
        />
      ),
    },
    {
      flex: 1,
      field: "min_coverage_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ทุนประกันต่ำสุด",
      headerClassName: "header-main",
      align: "right",
      minWidth: 200,
      renderCell: (params) => Transform.formatNumber(params.value),
    },
    {
      flex: 1,
      field: "max_coverage_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ทุนประกันต่ำสุด",
      headerClassName: "header-main",
      align: "right",
      minWidth: 200,
      renderCell: (params) => Transform.formatNumber(params.value),
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
        let formattedValue = format(
          addYears(parseISO(value), 543),
          "dd/MM/yyyy"
        );
        return formattedValue;
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
        let formattedValue = format(
          addYears(parseISO(value), 543),
          "dd/MM/yyyy"
        );
        return formattedValue;
      },
    },
    {
      flex: 1,
      field: "type",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อผลิตภัณฑ์",
      headerClassName: "header-main",
      align: "right",
      minWidth: 50,
    },
    {
      flex: 1,
      field: "Group",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อผลิตภัณฑ์",
      headerClassName: "header-main",
      align: "right",
      minWidth: 50,
    },
  ];
  let disabledView = false; // TODO: Check permissions
  let disabledEdit = false; // TODO: Check permissions

  const handleClick = (event, id) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleView = (id) => {
    router.push(`/productsale/1?mode=VIEW&type=1`);
    setAnchorEl(null);
  };

  const handleEdit = (id) => {
    router.push(`/productsale/1?mode=EDIT&type=1`);
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log("anchorEl", anchorEl);
  console.log("open", open);
  return (
    <Grid item xs={12}>
      <Accordion
        aria-controls="panel1-content"
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
            <Grid item xs="auto">
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {data.product_sale_group_name}
              </Typography>
            </Grid>
            <Grid item xs></Grid>
            <Grid item xs={1}>
              {data.id !== 2 && (
                <Button
                  fullWidth
                  variant="outlined"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(e) => {
                    handleClick(e, data.id);
                  }}
                >
                  จัดการ
                </Button>
              )}

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleView}>
                  <RemoveRedEye />
                  ดูรายละเอียด
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                  <Edit />
                  จัดการข้อมูล
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                  <Edit />
                  แก้ไขข้อมูล
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Check />
                  อนุมัติข้อมูลทั่วไป
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Check />
                  อนุมัติข้อมูลการแสดงผล
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Delete />
                  ยกเลิกการใช้งาน
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          sx={{ borderTop: "1px solid", borderColor: "#e7e7e7" }}
        >
          <Grid container>
            <Grid item xs={12} sx={{ height: "25rem" }}>
              <AppDataGrid
                rows={dataSub.details}
                rowCount={dataSub.total_records}
                columns={subColumn}
                hiddenColumn={hiddenColumn}
                pageNumber={pageNumber}
                pageSize={pageSize}
                onPaginationModelChange={handlePageModelChange}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default AppProductListItem;
