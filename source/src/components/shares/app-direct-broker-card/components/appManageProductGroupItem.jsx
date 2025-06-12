import {
  TextField,
  Switch,
  Button,
  Grid,
  FormControlLabel,
} from "@mui/material";
const AppManageProductGroupItem = ({ item, index, handleRemove }) => {
  return (
    <Grid container my={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="โหลดเอกสาจากรายการนี้"
        />
      </Grid>
      <Grid item xs={12} lg={8}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          disabled
          value={item?.title}
        />
      </Grid>
      <Grid item xs={12} lg={2} pl={2}>
        <Button
          size="small"
          variant="contained"
          onClick={() => handleRemove("คุณต้องการลบรายการนี้หรือไม่ ?", index)}
        >
          ลบออก
        </Button>
      </Grid>
    </Grid>
  );
};

export default AppManageProductGroupItem;
