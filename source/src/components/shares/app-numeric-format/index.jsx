"use client";

import { forwardRef } from "react";
import { NumericFormat } from "react-number-format";

const AppNumericFormat = forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.floatValue,
          },
        });
      }}
      thousandSeparator
      fixedDecimalScale
      decimalScale={0}
    />
  );
});

export default AppNumericFormat;
