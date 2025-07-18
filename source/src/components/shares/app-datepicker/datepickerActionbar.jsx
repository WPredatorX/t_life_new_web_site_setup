"use client";

import { Grid, Button } from "@mui/material";
import { Today, RestartAlt } from "@mui/icons-material";
import PropTypes from "prop-types";

const DatePickerActionBar = ({ onClear, onSetToday }) => {
  return (
    <Grid container p={2}>
      <Grid item xs={5}>
        <Button
          fullWidth
          type="button"
          variant="contained"
          onClick={onSetToday}
          startIcon={<Today />}
        >
          วันนี้
        </Button>
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid item xs={5}>
        <Button
          fullWidth
          type="button"
          variant="outlined"
          onClick={onClear}
          startIcon={<RestartAlt />}
        >
          ล้างค่า
        </Button>
      </Grid>
    </Grid>
  );
};

DatePickerActionBar.propTypes = {
  onClear: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
};

export default DatePickerActionBar;
