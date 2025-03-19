const themePalette = (theme) => {
  return {
    mode: theme?.customization?.navType,
    common: {
      black: theme.colors?.darkPaper,
    },
    primary: {
      light: theme.colors?.orangeLight,
      main: theme.colors?.orangeMain,
      dark: theme.colors?.orangeDark,
      300: theme.colors?.orange300,
      400: theme.colors?.orange400,
      500: theme.colors?.orange500,
      600: theme.colors?.orange600,
    },
    secondary: {
      light: theme.colors?.successLight,
      main: theme.colors?.successMain,
      dark: theme.colors?.successDark,
      200: theme.colors?.success200,
      800: theme.colors?.secondary800,
    },
    error: {
      light: theme.colors?.errorLight,
      main: theme.colors?.errorMain,
      dark: theme.colors?.errorDark,
    },
    warning: {
      light: theme.colors?.warningLight,
      main: theme.colors?.warningMain,
      dark: theme.colors?.warningDark,
    },
    success: {
      light: theme.colors?.successLight,
      200: theme.colors?.success200,
      main: theme.colors?.successMain,
      dark: theme.colors?.successDark,
    },
    grey: {
      50: theme.colors?.grey50,
      100: theme.colors?.grey100,
      500: theme.darkTextSecondary,
      600: theme.heading,
      700: theme.darkTextPrimary,
      900: theme.textDark,
    },
    dark: {
      light: theme.colors?.darkTextPrimary,
      main: theme.colors?.darkLevel1,
      dark: theme.colors?.darkLevel2,
      800: theme.colors?.darkBackground,
      900: theme.colors?.darkPaper,
    },
    text: {
      primary: theme.darkTextPrimary,
      secondary: theme.darkTextSecondary,
      dark: theme.textDark,
      hint: theme.colors?.grey100,
      white: theme.colors?.primaryLight,
    },
    background: {
      paper: theme.paper,
      default: theme.backgroundDefault,
      main: theme.colors?.orangeMain,
      orange: theme.colors?.orangeDark,
      orageLight: theme.colors?.orange500,
    },
  };
};

export default themePalette;
