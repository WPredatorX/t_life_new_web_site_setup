"use client";

import { useEffect, useState } from "react";
import {
  ReactQueryProvider,
  LanguageProvider,
  DateTimeProvider,
} from "@providers";
import { Grid, Typography, CssBaseline, CircularProgress } from "@mui/material";
import { AppSnackBar, AppDialog, AppScrollTo } from "@components";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { APPLICATION_MSAL_CONFIG } from "@constants";
import { PageLayoutAuthInitializer, PageLayoutUnAuth } from ".";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import "@assets/styles/css/globals.css";

const PageLayoutProvider = ({ children }) => {
  const [msalInstance, setMsalInstance] = useState(null);

  useEffect(() => {
    const instance = new PublicClientApplication(APPLICATION_MSAL_CONFIG);
    instance.initialize().then(() => {
      setMsalInstance(instance);
    });
  }, []);

  if (!msalInstance) {
    return (
      <Grid container mt={4} rowGap={2}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="primary" />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>กำลังโหลดข้อมูล...</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <PageLayoutAuthInitializer>
        <AuthenticatedTemplate>
          <ReactQueryProvider>
            <LanguageProvider>
              <DateTimeProvider>
                <CssBaseline />
                <AppSnackBar />
                <AppDialog />
                <AppScrollTo />
                <Grid container>{children}</Grid>
              </DateTimeProvider>
            </LanguageProvider>
          </ReactQueryProvider>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <PageLayoutUnAuth />
        </UnauthenticatedTemplate>
      </PageLayoutAuthInitializer>
    </MsalProvider>
  );
};

export default PageLayoutProvider;
