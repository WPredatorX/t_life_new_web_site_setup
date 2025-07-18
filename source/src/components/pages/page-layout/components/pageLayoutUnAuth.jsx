"use client";

import { Button, Grid, Typography } from "@mui/material";
import { APPLICATION_LOGIN_REQUEST } from "@constants";
import { useMsal } from "@azure/msal-react";

const PageLayoutUnAuth = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    instance.loginRedirect(APPLICATION_LOGIN_REQUEST);
  };

  return (
    <Grid container mt={4}>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Typography>ท่านยังไม่ได้เข้าสู่ระบบ</Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Button color="primary" variant="contained" onClick={handleLogin}>
          เข้าสู่ระบบ
        </Button>
      </Grid>
    </Grid>
  );
};

export default PageLayoutUnAuth;
