import "@testing-library/jest-dom";
import "jest-canvas-mock";
import fetchMock from "jest-fetch-mock";

jest.mock("swiper/react", () => ({
  Swiper: () => null,
  SwiperSlide: () => null,
}));

jest.mock("swiper/modules", () => ({
  Autoplay: () => null,
  Navigation: () => null,
  Pagination: () => null,
  Scrollbar: () => null,
  A11y: () => null,
}));

jest.mock("@azure/msal-browser", () => {
  return {
    PublicClientApplication: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(undefined),
      getAllAccounts: jest.fn(() => []),
      ssoSilent: jest.fn(() => Promise.resolve()),
    })),
  };
});

jest.mock("@azure/msal-react", () => ({
  MsalProvider: ({ children }) => (
    <div data-testid="msal-provider">{children}</div>
  ),
  UnauthenticatedTemplate: ({ children }) => (
    <div data-testid="unauth-template">{children}</div>
  ),
  AuthenticatedTemplate: ({ children }) => (
    <div data-testid="auth-template">{children}</div>
  ),
  useMsal: () => ({
    instance: {
      getAllAccounts: () => [],
      ssoSilent: jest.fn(() => Promise.resolve()),
    },
    accounts: [],
  }),
}));

jest.mock("@hooks/useAppRouter", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
}));

jest.mock("@hooks/useAppPathname", () => ({
  __esModule: true,
  default: () => "/",
}));

jest.mock("@hooks/useAppSearchParams", () => ({
  __esModule: true,
  default: () => new URLSearchParams(),
}));

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "mocked-uuid",
    getRandomValues: (arr) => arr.map(() => 1),
    subtle: {},
  },
});

Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn(),
  },
  writable: true,
});

fetchMock.enableMocks();

self.__NEXT_DATA__ = {};
