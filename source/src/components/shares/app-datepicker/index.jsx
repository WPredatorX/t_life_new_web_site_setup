"use client";

import { forwardRef } from "react";
import {
  DesktopDateTimePicker,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { TextField, useTheme, useMediaQuery } from "@mui/material";
import DatePickerActionBar from "./datepickerActionbar";
import PropTypes from "prop-types";

const AppDatePicker = forwardRef(
  (
    {
      id = null,
      name = null,
      label = null,
      value = null,
      onChange = null,
      error = null,
      helperText = null,
      placeholder = null,
      disableFuture = false,
      disablePast = false,
      disableInput = false,
      inputFormat = "dd/MM/yyyy",
      views = ["year", "month", "day"],
      margin = "none",
      placement = "auto",
      minDate = null,
      maxDate = null,
      ...otherProps
    },
    ref
  ) => {
    const theme = useTheme();
    const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
    const DatePickerComponent = matchUpLg
      ? DesktopDateTimePicker
      : MobileDateTimePicker;

    const defaultOnChange = () => {};

    return (
      <DatePickerComponent
        id={id}
        ref={ref}
        name={name}
        label={label}
        value={value}
        closeOnSelect
        minDate={minDate}
        maxDate={maxDate}
        inputFormat={inputFormat}
        views={views}
        onChange={onChange || defaultOnChange}
        disableFuture={disableFuture}
        disablePast={disablePast}
        PopperProps={{
          placement: placement,
          sx: {
            "&. MuiPickersCalendarHeader-label": {
              fontFamily: "PSLKandaModernPro",
              fontSize: "1.5rem",
              fontWeight: 700,
            },
            "& .MuiDayPicker-weekDayLabel": {
              fontFamily: "PSLKandaModernPro",
              fontSize: "1.5rem",
              fontWeight: 700,
            },
            "& .MuiPaper-root": {
              fontFamily: "PSLKandaModernPro",
              fontSize: "1.5rem",
              fontWeight: 700,
            },
            "& .MuiPickersDay-root": {
              fontFamily: "PSLKandaModernPro",
              fontSize: "1.5rem",
              fontWeight: 700,
              "&.MuiPickersDay-today": {
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-selected": {
                color: theme.palette.common.white,
              },
            },
            "& .MuiPickersToolbar-root": {
              fontFamily: "PSLKandaModernPro",
              fontSize: "1.5rem",
              fontWeight: 700,
            },
            "& .PrivatePickersYear-yearButton": {
              fontFamily: "PSLKandaModernPro",
              fontSize: "1.5rem",
              fontWeight: 700,
              height: "auto",
              "&.Mui-selected": {
                color: theme.palette.common.white,
              },
            },
            "& .PrivatePickersMonth-root": {
              fontFamily: "PSLKandaModernPro",
              fontSize: "1.5rem",
              fontWeight: 700,
              height: "auto",
              "&.Mui-selected": {
                color: theme.palette.common.white,
              },
            },
          },
        }}
        components={{
          ActionBar: DatePickerActionBar,
        }}
        componentsProps={{
          actionBar: {
            actions: ["today", "clear"],
            sx: {
              justifyContent: "space-around",
            },
          },
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              {...otherProps}
              id={id}
              name={name}
              margin={margin}
              error={error}
              helperText={helperText}
              inputProps={{
                ...params.inputProps,
                autoComplete: "off",
                placeholder: placeholder,
                disabled: disableInput,
              }}
            />
          );
        }}
        {...otherProps}
      />
    );
  }
);

AppDatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  disableInput: PropTypes.bool,
  inputFormat: PropTypes.string,
  views: PropTypes.arrayOf(PropTypes.string),
  margin: PropTypes.string,
  placement: PropTypes.string,
};

export default AppDatePicker;
