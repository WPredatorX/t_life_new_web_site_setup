"use client";

import { useState } from "react";
import {
  Card,
  Grid,
  Button,
  Collapse,
  Typography,
  useTheme,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import {
  ExpandMore,
  RemoveRedEye,
  Edit,
  Search,
  RestartAlt,
} from "@mui/icons-material";
import { AppStatus, AppDataGrid } from "@/components";
import { APPLICATION_DEFAULT } from "@constants";
import { format, addYears, addDays, parseISO } from "date-fns";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useAppRouter } from "@hooks";
import { Transform } from "@/utilities";
const AppCollapsecard = ({ content, setactive = false }) => {
  const router = useAppRouter();
  const [expand, setExpand] = useState(setactive);
  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const columns = [
    {
      field: "id",
    },

    {
      flex: 1,
      field: "planName",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อแบบประกัน",
      headerClassName: "header-main",
      align: "left",
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
      field: "channel",
      type: "string",
      headerAlign: "center",
      headerName: "ช่องทาง",
      headerClassName: "header-main",
      align: "left",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "InsuredSumFrom",
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
      field: "InsuredSumTo",
      type: "string",
      headerAlign: "center",
      headerName: "ทุนประกันสูงสุด",
      headerClassName: "header-main",
      align: "right",
      minWidth: 200,
      renderCell: (params) => Transform.formatNumber(params.value),
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
        let formattedValue = format(
          addYears(parseISO(value), 543),
          "dd/MM/yyyy HH:mm:ss"
        );
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
        let formattedValue = format(
          addYears(parseISO(value), 543),
          "dd/MM/yyyy HH:mm:ss"
        );
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
        const viewFunction = disabledView
          ? null
          : () => router.push(`/productsale/${id}?mode=VIEW`);

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
            data-testid={`view-button`}
            role="button"
            key={`view_${id}`}
            icon={<RemoveRedEye />}
            {...defaultProps}
            label="ดูรายละเอียด"
            disabled={disabledView}
            onClick={viewFunction}
          />,
        ];
      },
    },
  ];
  const handlePageModelChange = (model, detail) => {
    setPageNumber(model.page);
    setPageSize(model.pageSize);
  };
  const hiddenColumn = {
    id: false,
  };
  const dataRows = content.productDetail
    ? Array.from(content.productDetail).map((item) => {
        return {
          ...item,
          planName: content.name,
        };
      })
    : [];

  const theme = useTheme();
  return (
    <Card>
      <Grid
        container
        justifyContent={"center"}
        rowGap={2}
        my={0.5}
        alignItems={"center"}
        sx={{ border: "2px solid grey" }}
      >
        <Grid item xs={12}>
          <Accordion disableGutters>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {content.name && content.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12} sx={{ height: "25rem" }}>
                <AppDataGrid
                  data-testid="app-data-grid"
                  rows={dataRows}
                  rowCount={100}
                  columns={columns}
                  hiddenColumn={hiddenColumn}
                  pageNumber={pageNumber}
                  pageSize={pageSize}
                  onPaginationModelChange={handlePageModelChange}
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AppCollapsecard;
