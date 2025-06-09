"use client";

import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppForm } from "@hooks";
import { TextField, FormHelperText } from "@mui/material";
import { Yup } from "@utilities";

const TestPageSub = ({ formMethods }) => {
  const {
    watch,
    register,
    formState: { errors },
  } = formMethods;

  return (
    <>
      <TextField
        required
        fullWidth
        label="ทดสอบ"
        margin="dense"
        size="small"
        id={`commonSetting.title`}
        {...register(`commonSetting.title`)}
        inputProps={{ maxLength: 100 }}
        InputLabelProps={watch(`commonSetting.title`) && { shrink: true }}
        error={Boolean(errors?.commonSetting?.title)}
      />
      <FormHelperText error={Boolean(errors?.commonSetting?.title)}>
        {errors?.commonSetting?.title?.message}
      </FormHelperText>
    </>
  );
};

const TestPage = () => {
  const validationSchema = Yup.object().shape({
    commonSetting: Yup.object().shape({
      title: Yup.string().required().preventSpace("ต้องไม่เป็นค่าว่าง"),
    }),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      commonSetting: {
        title: "",
      },
    },
  });

  const { reset } = formMethods;

  useEffect(() => {
    reset({
      commonSetting: {
        title: "xxxxx",
      },
    });
  }, []);

  return <TestPageSub formMethods={{ ...formMethods }} />;
};

export default TestPage;
