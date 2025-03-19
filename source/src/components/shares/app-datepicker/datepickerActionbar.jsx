"use client";

import { Grid, Button } from "@mui/material";
import { Today, RestartAlt } from "@mui/icons-material";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";

const DatePickerActionBar = ({ onClear = null, onSetToday = null }) => {
  const intl = useIntl();

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
          {intl.formatMessage({ id: "component.date-picker.action.today" })}
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
          {intl.formatMessage({ id: "component.date-picker.action.clear" })}
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
