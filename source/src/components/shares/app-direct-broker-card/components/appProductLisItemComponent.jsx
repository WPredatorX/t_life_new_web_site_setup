import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  ArrowDropDown,
  Check,
  Delete,
  Edit,
  RemoveRedEye,
} from "@mui/icons-material";
import { AppDataGrid, AppStatus } from "@/components";
import { useAppRouter } from "@hooks";
import AppManageProductGroup from "./appManageProductGroup";

const AppProductListItemComponent = ({
  item,
  index,
  subColumn,
  hiddenColumn,
  pageNumber,
  pageSize,
  handlePageModelChange,
}) => {
  const router = useAppRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogGroupOpen, setDialogGroupOpen] = useState(false);
  const open = Boolean(anchorEl);

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

  return (
    <Accordion
      key={index}
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
              {item?.product_sale_group_name}
            </Typography>
          </Grid>
          <Grid item xs></Grid>
          <Grid item xs={1}>
            <AppManageProductGroup
              group={null}
              open={dialogGroupOpen}
              setOpen={setDialogGroupOpen}
            />
            <Button
              fullWidth
              variant="outlined"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => {
                handleClick(e, item.id);
              }}
            >
              จัดการ
            </Button>
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
                จัดการกลุ่มประกัน
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
      <AccordionDetails sx={{ borderTop: "1px solid", borderColor: "#e7e7e7" }}>
        <Grid container>
          <Grid item xs={12} sx={{ height: "25rem" }}>
            <AppDataGrid
              rows={item.product_sale_responses}
              rowCount={item.total_records}
              columns={subColumn}
              hiddenColumn={hiddenColumn}
              pageNumber={pageNumber}
              getRowId={(row) => row.item_id}
              pageSize={pageSize}
              onPaginationModelChange={handlePageModelChange}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default AppProductListItemComponent;
