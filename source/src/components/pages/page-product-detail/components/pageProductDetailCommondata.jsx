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
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

const PageProductDetailCommonData = ({
  formMethods,
  productId,
  i_package,
  mode,
  type,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
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
  const w = watch();
  console.log(w);
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
                //value={i_package}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.i_package`) && { shrink: true }
                }
                error={Boolean(errors?.name)}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                fullWidth
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
                error={Boolean(errors?.name)}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="ชื่อสำหรับแสดงหน้าคำนวณเพื่อเลือกระยะเวลาเอาประกัน"
                margin="dense"
                size="small"
                id={`commonSetting.item_name`}
                defaultValue={
                  watch(`commonSetting.item_name`)
                    ? watch(`commonSetting.item_name`)
                    : ""
                }
                {...register(`commonSetting.item_name`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.item_name`) && { shrink: true }
                }
                error={Boolean(errors?.name)}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="ชื่อทางการตลาด"
                margin="dense"
                size="small"
                id={`commonSetting.title`}
                defaultValue={
                  watch(`commonSetting.title`)
                    ? watch(`commonSetting.title`)
                    : ""
                }
                {...register(`commonSetting.title`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.title`) && { shrink: true }
                }
                error={Boolean(errors?.name)}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <TextField
                disabled
                fullWidth
                label="หมายเหตุ"
                margin="dense"
                size="small"
                id={`commonSetting.remark_marketing_name`}
                defaultValue={
                  watch(`commonSetting.remark_marketing_name`)
                    ? watch(`commonSetting.remark_marketing_name`)
                    : ""
                }
                {...register(`commonSetting.remark_marketing_name`)}
                inputProps={{ maxLength: 100 }}
                InputLabelProps={
                  watch(`commonSetting.remark_marketing_name`) && {
                    shrink: true,
                  }
                }
                error={Boolean(errors?.name)}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
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
                    <Grid container justifyContent={"center"} key={IPlanIndex}>
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
                                      `data.${IPlanIndex}.plan_code`
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
                                    value={IPlan.product_name}
                                    fullWidth
                                    label="ชื่อแบบประกัน"
                                    margin="dense"
                                    size="small"
                                    inputProps={{ maxLength: 100 }}
                                    InputLabelProps={
                                      IPlan.product_name && { shrink: true }
                                    }
                                    {...register(
                                      `data.${IPlanIndex}.plan_code`
                                    )}
                                    error={Boolean(errors?.name)}
                                  />
                                  <FormHelperText error={errors?.name}>
                                    {errors?.name?.message}
                                  </FormHelperText>
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
                          key={CapitalIndex}
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
                                  <TextField
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
                                  ></TextField>
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
                label="ชื่อแบบประกัน"
                margin="dense"
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="ชื่อทางการตลาด"
                margin="dense"
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="หมายเหตุ"
                margin="dense"
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};
export default PageProductDetailCommonData;
