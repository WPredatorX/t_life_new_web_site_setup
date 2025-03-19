import { render, renderHook, act, within } from "@testing-library/react";
import { theme } from "@themes";
import { Provider } from "react-redux";
import { AppSnackBar, AppDialog, AppNavigationBar } from "@components";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  StoreProvider,
  LanguageProvider,
  ReactQueryProvider,
  DateTimeProvider,
} from "@providers";
import makeStore from "@stores";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";

const Providers = ({ mockStore, children }) => {
  // const loadedTheme = theme();

  const generateMockStore = () => {
    return mockStore;
  };

  return (
    <StoreProvider mockStore={generateMockStore}>
      <ReactQueryProvider>
        {/* <ThemeProvider theme={loadedTheme}> */}
        <LanguageProvider>
          <DateTimeProvider>
            <CssBaseline />
            <AppNavigationBar />
            <AppSnackBar />
            <AppDialog />
            {children}
          </DateTimeProvider>
        </LanguageProvider>
        {/* </ThemeProvider> */}
      </ReactQueryProvider>
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

  return (renderResult = renderHook(hookFunction, {
    wrapper: ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    ),
    ...options,
  }));
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

export { act, screen, fireEvent, within } from "@testing-library/react";
export { customRender as render, customRenderHook as renderHook };
export { userEvent, createMatchMedia };
