"use client";

import { createTheme } from "@mui/material/styles";
import colors from "../assets/styles/scss/_themes-vars.module.scss";
import componentStyleOverrides from "./compStyleOverride";
import themePalette from "./palette";

export const theme = (customization) => {
  const color = colors;

  const themeOption = {
    colors: color,
    heading: color.grey900,
    paper: color.paper,
    backgroundDefault: color.paper,
    background: color.primaryLight,
    darkTextPrimary: color.grey700,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: color.primaryLight,
    menuSelectedBack: color.orange200,
    divider: color.grey200,
  };

  const themeOptions = {
    direction: "ltr",
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: "48px",
        padding: "5px",
        "@media (min-width: 600px)": {
          minHeight: "48px",
        },
      },
    },
  };

  let themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
