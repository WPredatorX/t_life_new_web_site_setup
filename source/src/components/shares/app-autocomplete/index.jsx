"use client";

import { useState, forwardRef } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Typography,
  TextField,
  useTheme,
} from "@mui/material";
import { useAppMutation } from "@hooks";

const AppAutocomplete = forwardRef(
  (
    {
      id = null,
      name = null,
      value = null,
      options = [],
      margin = "dense",
      size = "small",
      onBeforeOpen = null,
      label = null,
      required = false,
      error = false,
      helperText = "",
      disabled = false,
      renderOption = null,
      ...otherProps
    },
    ref
  ) => {
    const theme = useTheme();
    const [optionAsync, setOptionAsync] = useState([]);

    const { mutate: mutateOption, isLoading: loading } = useAppMutation({
      mutationFn: async () => {
        if (onBeforeOpen) return await onBeforeOpen();

        return [];
      },
      onSuccess: (res) => {
        setOptionAsync(res);
      },
    });

    const handleOpen = async () => {
      mutateOption();
    };

    const asyncProp = {
      id: id,
      name: name,
      ["data-testid"]: "autocomplete",
      size: size,
      value: value,
      disabled: disabled,
      required: required,
      ref: ref,
      options: onBeforeOpen ? optionAsync : options,
      loading: loading,
      noOptionsText: "ไม่พบข้อมูล",
      onOpen: handleOpen,
      loadingText: "กำลังโหลด",
      isOptionEqualToValue: (option, value) =>
        option.id.toString().toLowerCase() ===
        value.id.toString().toLowerCase(),
      getOptionLabel: (option) => {
        return option.label;
      },
      getOptionDisabled: (option) => {
        return option.disabled;
      },
      renderOption: renderOption
        ? renderOption
        : (props, option) => {
            return (
              <Box
                {...props}
                key={props.id}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: theme.palette.grey.main,
                    color: theme.palette.primary.main,
                  },
                }}
                py={0.5}
                px={2}
              >
                <Typography variant="subtitle1">{option.label}</Typography>
              </Box>
            );
          },
      renderTags: (tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={
                <Typography variant="h5" color={"inherit"}>
                  {option.label}
                </Typography>
              }
              color="primary"
              sx={{
                fontSize: "2rem",
                fontWeight: 700,
                color: theme.palette.common.white,
              }}
              {...tagProps}
            />
          );
        }),
      renderInput: (params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          margin={margin}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      ),
      ...otherProps,
    };

    return <Autocomplete {...asyncProp} />;
  }
);

export default AppAutocomplete;
