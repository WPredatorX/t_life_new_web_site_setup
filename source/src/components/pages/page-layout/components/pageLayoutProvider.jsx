"use client";

import {
  StoreProvider,
  ReactQueryProvider,
  LanguageProvider,
  DateTimeProvider,
} from "@providers";
import { Grid, ThemeProvider, CssBaseline } from "@mui/material";
import { AppSnackBar, AppDialog } from "@components";
import { theme } from "@themes";

const PageLayoutProvider = ({ children }) => {
  const loadedTheme = theme();

  return (
    <StoreProvider>
      <ReactQueryProvider>
        <ThemeProvider theme={loadedTheme}>
          <LanguageProvider>
            <DateTimeProvider>
              <CssBaseline />
              <AppSnackBar />
              <AppDialog />
              <Grid container>{children}</Grid>
            </DateTimeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </StoreProvider>
  );
};

export default PageLayoutProvider;
