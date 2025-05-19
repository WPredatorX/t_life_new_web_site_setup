"use client";

import { PageLayoutProvider, PageLayoutMainContent } from "./components";
import { StoreProvider } from "@providers";
import { ThemeProvider } from "@mui/material";
import { theme } from "@themes";

const PageLayout = ({ children }) => {
  const loadedTheme = theme();

  return (
    <StoreProvider>
      <ThemeProvider theme={loadedTheme}>
        <PageLayoutProvider>
          <PageLayoutMainContent>{children}</PageLayoutMainContent>
        </PageLayoutProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default PageLayout;
