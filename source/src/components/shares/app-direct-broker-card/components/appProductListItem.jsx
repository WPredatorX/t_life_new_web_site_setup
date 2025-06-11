import { AppDataGrid, AppStatus } from "@/components";
import { APPLICATION_DEFAULT } from "@/constants";
import { Transform } from "@/utilities";
import { ArrowDropDown } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { format, addYears, parseISO } from "date-fns";
import AppManageProductGroup from "./appManageProductGroup";
import AppProductListItemComponent from "./appProductLisItemComponent";

const AppProductListItem = ({ hiddenColumn, formMethods }) => {
  const [dialogGroupOpen, setDialogGroupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const [dataSub, setDataSub] = useState([]);
  const [dataSubNoGroup, setDataSubNoGroup] = useState([]);
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
  ];

  const {
    watch,
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
          id: item.product_sale_group_id,
        };
      });
      setDataSub(mapData);

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
          id: item.product_sale_channel_id,
        };
      });
      setDataSubNoGroup(mapDataNoGroup);
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  const handlePageModelChange = (model, detail) => {
    setPageNumber(model.page);
    setPageSize(model.pageSize);
  };

  const handleOpenGroupModal = () => {
    setDialogGroupOpen(true);
  };

  return (
    <Grid container>
      <AppManageProductGroup
        group={null}
        open={dialogGroupOpen}
        setOpen={setDialogGroupOpen}
      />
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "end",
          border: "0px solid red",
        }}
      >
        <Button onClick={handleOpenGroupModal} variant="contained">
          เพิ่มกลุ่ม
        </Button>
      </Grid>
      <Grid item xs={12}>
        {dataSub.map((item, index) => {
          return (
            <AppProductListItemComponent
              key={index}
              item={item}
              index={index}
              subColumn={subColumn}
              hiddenColumn={hiddenColumn}
              pageNumber={pageNumber}
              pageSize={pageSize}
              handlePageModelChange={handlePageModelChange}
            />
          );
        })}
        <Accordion
          defaultExpanded
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
                  ไม่มีกลุ่ม
                </Typography>
              </Grid>
              <Grid item xs></Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails
            sx={{ borderTop: "1px solid", borderColor: "#e7e7e7" }}
          >
            <Grid container>
              <Grid item xs={12} sx={{ height: "25rem" }}>
                <AppDataGrid
                  rows={dataSubNoGroup}
                  rowCount={dataSubNoGroup?.[0]?.total_records || 0}
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
    </Grid>
  );
};

export default AppProductListItem;
