import { render, renderHook, act, within } from "@testing-library/react";
import { theme } from "@themes";
import { Provider } from "react-redux";
import { AppSnackBar, AppDialog, AppScrollTo } from "@components";
import {
  PageLayoutProvider,
  PageLayoutMainContent,
} from "@components/pages/page-layout/components";
import { Grid, ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import {
  StoreProvider,
  LanguageProvider,
  ReactQueryProvider,
  DateTimeProvider,
} from "@providers";
import { FormProvider } from "react-hook-form";
import makeStore from "@stores";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";

const loadedTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    },
  },
  colors: {
    orangeMain: "#000000",
  },
  palette: {
    common: {
      white: "#ffffff",
    },
    primary: {
      main: "#808080",
    },
  },
});

const Providers = ({ mockStore, children }) => {
  const generateMockStore = () => {
    return mockStore;
  };

  // เอา msal ออก
  return (
    <StoreProvider mockStore={generateMockStore}>
      <ThemeProvider theme={loadedTheme}>
        <ReactQueryProvider>
          <LanguageProvider>
            <DateTimeProvider>
              <CssBaseline />
              <AppSnackBar />
              <AppDialog />
              <AppScrollTo />
              <Grid container>
                <PageLayoutMainContent>{children}</PageLayoutMainContent>
              </Grid>
            </DateTimeProvider>
          </LanguageProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};

const generateStore = (mockStore) => {
  if (!mockStore) return makeStore();

  return mockStore;
};

const customRender = async (ui, options) => {
  let renderResult = null;
  let mockStore = generateStore(options?.mockStore);

  await act(() => {
    renderResult = render(ui, {
      wrapper: ({ children }) => (
        <Providers mockStore={mockStore}>{children}</Providers>
      ),
      ...options,
    });
  });

  return renderResult;
};

const customRenderHook = (hookFunction, options) => {
  let renderResult = null;
  let mockStore = generateStore(options?.mockStore);
  let formMethods = options?.formMethods;

  return (renderResult = renderHook(hookFunction, {
    wrapper: ({ children }) => (
      <Provider store={mockStore}>
        <ThemeProvider theme={loadedTheme}>
          <ReactQueryProvider>
            {formMethods ? (
              <FormProvider {...formMethods}>{children}</FormProvider>
            ) : (
              children
            )}
          </ReactQueryProvider>
        </ThemeProvider>
      </Provider>
    ),
    ...options,
  }));
};

const customRenderAfterHook = async (ui, options) => {
  let renderResult = null;
  let mockStore = generateStore(options?.mockStore);

  await act(() => {
    renderResult = render(ui, {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          <ThemeProvider theme={loadedTheme}>{children}</ThemeProvider>
        </Provider>
      ),
      ...options,
    });
  });

  return renderResult;
};

const createMatchMedia = (width) => {
  return (query) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {},
    removeListener: () => {},
  });
};

export {
  act,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
export {
  customRender as render,
  customRenderHook as renderHook,
  customRenderAfterHook as renderAfterHook,
};
export { userEvent, createMatchMedia };
