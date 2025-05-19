import { useEffect, useState } from "react";
import { AppCard, AppNumericFormat } from "@/components";
import { useAppForm } from "@/hooks";
import { Yup } from "@/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  FormHelperText,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useFieldArray, Controller } from "react-hook-form";

const PageProductDetailCommonData = ({
  formMethods,
  productId,
  i_package,
  mode,
  type,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = formMethods;

  const {
    fields: packageFields,
    append: appendPackage,
    remove: removePackage,
  } = useFieldArray({
    control,
    name: "IPlan",
  });

  const {
    fields: CapitalFields,
    append: appendCapital,
    remove: removeCapital,
  } = useFieldArray({
    control,
    name: "ICapital",
  });

  if (type === "0") {
    return (
      <Grid container justifyContent={"center"}>
        <Grid item xs={11.8}>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                disabled
                fullWidth
                label="รหัสแพคเกจ"
                margin="dense"
                size="small"
                id={`commonSetting.i_package`}
                defaultValue={watch(`commonSetting.i_package`)}
                {...register(`commonSetting.i_package`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.i_package`) && { shrink: true }
                }
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                fullWidth
                disabled
                label="ชื่อแพคเกจ"
                margin="dense"
                size="small"
                id={`commonSetting.c_package`}
                defaultValue={
                  watch(`commonSetting.c_package`)
                    ? watch(`commonSetting.c_package`)
                    : ""
                }
                {...register(`commonSetting.c_package`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.c_package`) && { shrink: true }
                }
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                required
                fullWidth
                label="ชื่อสำหรับแสดงหน้าคำนวณเพื่อเลือกระยะเวลาเอาประกัน"
                margin="dense"
                size="small"
                id={`commonSetting.item_name`}
                {...register(`commonSetting.item_name`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.item_name`) && { shrink: true }
                }
                error={Boolean(errors?.commonSetting?.item_name)}
              />
              <FormHelperText error={errors?.commonSetting?.item_name}>
                {errors?.commonSetting?.item_name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                required
                fullWidth
                label="ชื่อทางการตลาด"
                margin="dense"
                size="small"
                id={`commonSetting.title`}
                {...register(`commonSetting.title`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.title`) && { shrink: true }
                }
                error={Boolean(errors?.commonSetting?.title)}
              />
              <FormHelperText error={Boolean(errors?.commonSetting?.title)}>
                {errors?.commonSetting?.title?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="หมายเหตุ"
                margin="dense"
                size="small"
                id={`commonSetting.remark_marketing_name`}
                {...register(`commonSetting.remark_marketing_name`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.remark_marketing_name`) && {
                    shrink: true,
                  }
                }
                error={Boolean(errors?.commonSetting?.remark_marketing_name)}
              />
              <FormHelperText
                error={Boolean(errors?.commonSetting?.remark_marketing_name)}
              >
                {errors?.commonSetting?.remark_marketing_name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container mt={2} spacing={2}>
            <Grid item xs={8}>
              <AppCard
                title={`แผนประกันทั้งหมด`}
                cardstyle={{
                  border: "1px solid",
                  borderColor: "#e7e7e7",
                  minHeight: "13.8rem",
                }}
              >
                {packageFields &&
                  packageFields.map((IPlan, IPlanIndex) => (
                    <Grid
                      container
                      justifyContent={"center"}
                      key={IPlanIndex}
                      mt={IPlanIndex !== 0 ? 2 : 0}
                    >
                      <Grid item xs={11.8}>
                        <Card
                          sx={{ border: "1px solid", borderColor: "#e7e7e7" }}
                        >
                          <Grid container justifyContent={"center"}>
                            <Grid item xs={11.5}>
                              <Grid
                                container
                                spacing={2}
                                justifyContent={"center"}
                                mt={0.1}
                                mb={2}
                              >
                                <Grid item xs={4}>
                                  <TextField
                                    disabled
                                    value={IPlan.plan_code}
                                    fullWidth
                                    label="รหัสแบบประกัน"
                                    margin="dense"
                                    size="small"
                                    inputProps={{ maxLength: 100 }}
                                    InputLabelProps={
                                      IPlan.plan_code && { shrink: true }
                                    }
                                    {...register(
                                      `IPlan.${IPlanIndex}.plan_code`
                                    )}
                                    error={Boolean(errors?.name)}
                                  />
                                  <FormHelperText error={errors?.name}>
                                    {errors?.name?.message}
                                  </FormHelperText>
                                </Grid>
                                <Grid item xs>
                                  <TextField
                                    disabled
                                    value={IPlan.c_plan}
                                    fullWidth
                                    label="ชื่อแบบประกัน"
                                    margin="dense"
                                    size="small"
                                    inputProps={{ maxLength: 100 }}
                                    InputLabelProps={
                                      IPlan.c_plan && { shrink: true }
                                    }
                                    {...register(`IPlan.${IPlanIndex}.c_plan`)}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  ))}
              </AppCard>
            </Grid>
            <Grid item xs>
              <AppCard
                title={`ทุนประกันทั้งหมด`}
                cardstyle={{
                  border: "1px solid",
                  borderColor: "#e7e7e7",
                  minHeight: "13.8rem",
                }}
              >
                <Grid container justifyContent={"center"}>
                  <Grid item xs={11.8}>
                    {CapitalFields &&
                      CapitalFields.map((Capital, CapitalIndex) => (
                        <Card
                          sx={{ border: "1px solid", borderColor: "#e7e7e7" }}
                          key={Capital.id}
                        >
                          <Grid container justifyContent={"center"}>
                            <Grid item xs={11}>
                              <Grid
                                container
                                spacing={2}
                                justifyContent={"center"}
                                mt={0.1}
                                mb={2}
                              >
                                <Grid item xs={12}>
                                  <Controller
                                    control={control}
                                    name={`Capital.${CapitalIndex}.m_sa`}
                                    defaultValue={Capital.m_sa}
                                    render={({ field }) => (
                                      <TextField
                                        fullWidth
                                        label={`ทุนประกัน`}
                                        margin="dense"
                                        size="small"
                                        disabled
                                        InputLabelProps={
                                          Capital.m_sa && { shrink: true }
                                        }
                                        {...field}
                                        InputProps={{
                                          inputComponent: AppNumericFormat,
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              บาท
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    )}
                                  />

                                  {/* <TextField
                                    disabled
                                    label="ทุนประกัน"
                                    fullWidth
                                    size="small"
                                    inputProps={{
                                      allowNegative: false,
                                      fixedDecimalScale: true,
                                    }}
                                    InputProps={{
                                      inputComponent: AppNumericFormat,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          บาท
                                        </InputAdornment>
                                      ),
                                    }}
                                  ></TextField> */}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                  </Grid>
                </Grid>
              </AppCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                disabled
                label="รหัสแบบประกัน"
                value={productId}
                margin="dense"
                size="small"
                inputProps={{ maxLength: 100 }}
                InputLabelProps={productId && { shrink: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                disabled
                label="ชื่อแบบประกัน"
                margin="dense"
                size="small"
                {...register(`commonSetting.c_plan`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.c_plan`) && { shrink: true }
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="ชื่อทางการตลาด"
                margin="dense"
                size="small"
                id={`commonSetting.title`}
                required
                {...register(`commonSetting.title`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.title`) && { shrink: true }
                }
                error={Boolean(errors?.commonSetting?.title)}
              />
              <FormHelperText error={Boolean(errors?.commonSetting?.title)}>
                {errors?.commonSetting?.title?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="หมายเหตุ"
                margin="dense"
                size="small"
                id={`commonSetting.remark_marketing_name`}
                {...register(`commonSetting.remark_marketing_name`)}
                inputProps={{ maxLength: 200 }}
                InputLabelProps={
                  watch(`commonSetting.remark_marketing_name`) && {
                    shrink: true,
                  }
                }
                error={Boolean(errors?.commonSetting?.remark_marketing_name)}
              />
              <FormHelperText
                error={Boolean(errors?.commonSetting?.remark_marketing_name)}
              >
                {errors?.commonSetting?.remark_marketing_name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};
export default PageProductDetailCommonData;
