"use client";

import {
  Box,
  useTheme,
  CssBaseline,
  createTheme,
  GlobalStyles,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material";
import dynamic from "next/dynamic";
import colors from "../../../assets/styles/scss/_themes-vars.module.scss";
import themePalette from "@themes/palette";
import themeTypography from "@themes/typography";
import componentStyleOverrides from "@themes/compStyleOverride";

const RichTextEditor = dynamic(
  () => import("mui-tiptap").then((mod) => mod.RichTextEditor),
  { ssr: false }
);
const MenuButtonBold = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonBold),
  { ssr: false }
);
const MenuButtonItalic = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonItalic),
  { ssr: false }
);
const MenuControlsContainer = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuControlsContainer),
  { ssr: false }
);
const MenuDivider = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuDivider),
  { ssr: false }
);
const MenuSelectHeading = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuSelectHeading),
  { ssr: false }
);
const MenuButtonBulletedList = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonBulletedList),
  { ssr: false }
);
const MenuButtonUndo = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonUndo),
  { ssr: false }
);
const MenuButtonRedo = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonRedo),
  { ssr: false }
);
const MenuButtonUnderline = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonUnderline),
  { ssr: false }
);
const MenuButtonStrikethrough = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonStrikethrough),
  { ssr: false }
);
const MenuButtonTextColor = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonTextColor),
  { ssr: false }
);
const MenuButtonHighlightColor = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonHighlightColor),
  { ssr: false }
);
const MenuSelectFontSize = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuSelectFontSize),
  { ssr: false }
);
const MenuButtonOrderedList = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonOrderedList),
  { ssr: false }
);
const MenuButtonAlignLeft = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonAlignLeft),
  { ssr: false }
);
const MenuButtonAlignCenter = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonAlignCenter),
  { ssr: false }
);
const MenuButtonAlignRight = dynamic(
  () => import("mui-tiptap").then((mod) => mod.MenuButtonAlignRight),
  { ssr: false }
);

import { Extension, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
// import Strike from "@tiptap/extension-strike";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
// import FontFamily from "@tiptap/extension-font-family";
// import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
// import ListKeymap from "@tiptap/extension-list-keymap";
// import ListItem from "@tiptap/extension-list-item";

const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

const rgbToHex = (rgb) => {
  const match = rgb.match(/\d+/g); // ดึงตัวเลขจาก rgb เช่น "rgb(255, 153, 0)" -> [255, 153, 0]
  if (match) {
    return `#${match
      .map((num) => parseInt(num, 10).toString(16).padStart(2, "0")) // แปลงแต่ละเลขเป็น base 16 และเติม 0 ด้านหน้า
      .join("")}`;
  }
  return rgb; // ถ้าไม่ใช่รูปแบบ rgb ให้คืนค่าตามเดิม
};

const HtmlParser = (htmlString) => {
  // แปลง HTML string เป็น DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // เลือกทุก <li> ในเอกสาร
  const liElements = doc.querySelectorAll("li");

  liElements.forEach((li) => {
    // หา <span> ที่อยู่ใกล้ที่สุดภายใน <li>
    const span = li.querySelector('span[style*="color"]');
    if (span) {
      // ดึงค่า color จาก style ของ <span>
      let color = span.style.color;

      // ถ้าค่าเป็น rgb ให้แปลงเป็น hex
      if (color.startsWith("rgb")) {
        color = rgbToHex(color);
      }

      // เพิ่ม attribute style="color" ให้กับ <li>
      li.setAttribute("style", `color: ${color};`);
    }
  });

  // แปลง DOM กลับเป็น HTML string
  const updatedHtmlString = doc.body.innerHTML;
  return updatedHtmlString;
};

const GlobalEditorStyles = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={(theme) => ({
        ".ProseMirror": {
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.grey.text,
          fontSize: theme.typography.body1.fontSize,
          lineHeight: theme.typography.body1.lineHeight,
        },

        // Paragraph
        ".ProseMirror p": {
          ...theme.typography.body1,
          marginBottom: theme.spacing(2),
          whiteSpace: "pre-line",
          fontWeight: 700,
        },

        // Headings (Responsive font size)
        ".ProseMirror h1": {
          fontWeight: `${theme.typography.h1.fontWeight} !important`,
          fontWeight: theme.typography.h1.fontWeight,
          lineHeight: theme.typography.h1.lineHeight,
          letterSpacing: theme.typography.h1.letterSpacing,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.h1.fontSize,
          [theme.breakpoints.up("sm")]: {
            fontSize: theme.typography.h1["@media (min-width:600px)"]?.fontSize,
          },
          [theme.breakpoints.up("md")]: {
            fontSize: `${theme.typography.h1["@media (min-width:900px)"]?.fontSize} !important`,
          },
          [theme.breakpoints.up("lg")]: {
            fontSize:
              theme.typography.h1["@media (min-width:1200px)"]?.fontSize,
          },
          ...(theme.components?.MuiTypography?.styleOverrides?.root || {}),
        },
        ".ProseMirror h2": {
          fontWeight: `${theme.typography.h2.fontWeight} !important`,
          lineHeight: theme.typography.h2.lineHeight,
          letterSpacing: theme.typography.h2.letterSpacing,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.h2.fontSize,
          [theme.breakpoints.up("sm")]: {
            fontSize: theme.typography.h2["@media (min-width:600px)"]?.fontSize,
          },
          [theme.breakpoints.up("md")]: {
            fontSize: `${theme.typography.h2["@media (min-width:900px)"]?.fontSize} !important`,
          },
          [theme.breakpoints.up("lg")]: {
            fontSize:
              theme.typography.h2["@media (min-width:1200px)"]?.fontSize,
          },
          ...(theme.components?.MuiTypography?.styleOverrides?.root || {}),
        },
        // ทำแบบเดียวกันสำหรับ h3 ถึง h6:
        ".ProseMirror h3": {
          fontWeight: `${theme.typography.h3.fontWeight} !important`,
          lineHeight: theme.typography.h3.lineHeight,
          letterSpacing: theme.typography.h3.letterSpacing,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.h3.fontSize,
          [theme.breakpoints.up("sm")]: {
            fontSize: theme.typography.h3["@media (min-width:600px)"]?.fontSize,
          },
          [theme.breakpoints.up("md")]: {
            fontSize: `${theme.typography.h3["@media (min-width:900px)"]?.fontSize} !important`,
          },
          [theme.breakpoints.up("lg")]: {
            fontSize:
              theme.typography.h3["@media (min-width:1200px)"]?.fontSize,
          },
          ...(theme.components?.MuiTypography?.styleOverrides?.root || {}),
        },
        ".ProseMirror h4": {
          fontWeight: `${theme.typography.h4.fontWeight} !important`,
          lineHeight: theme.typography.h4.lineHeight,
          letterSpacing: theme.typography.h4.letterSpacing,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.h4.fontSize,
          [theme.breakpoints.up("sm")]: {
            fontSize: theme.typography.h4["@media (min-width:600px)"]?.fontSize,
          },
          [theme.breakpoints.up("md")]: {
            fontSize: `${theme.typography.h4["@media (min-width:900px)"]?.fontSize} !important`,
          },
          [theme.breakpoints.up("lg")]: {
            fontSize:
              theme.typography.h4["@media (min-width:1200px)"]?.fontSize,
          },
          ...(theme.components?.MuiTypography?.styleOverrides?.root || {}),
        },
        ".ProseMirror h5": {
          fontWeight: `${theme.typography.h5.fontWeight} !important`,
          lineHeight: theme.typography.h5.lineHeight,
          letterSpacing: theme.typography.h5.letterSpacing,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.h5.fontSize,
          [theme.breakpoints.up("sm")]: {
            fontSize: theme.typography.h5["@media (min-width:600px)"]?.fontSize,
          },
          [theme.breakpoints.up("md")]: {
            fontSize: `${theme.typography.h5["@media (min-width:900px)"]?.fontSize} !important`,
          },
          [theme.breakpoints.up("lg")]: {
            fontSize:
              theme.typography.h5["@media (min-width:1200px)"]?.fontSize,
          },
          ...(theme.components?.MuiTypography?.styleOverrides?.root || {}),
        },
        ".ProseMirror h6": {
          fontWeight: `${theme.typography.h6.fontWeight} !important`,
          fontWeight: theme.typography.h6.fontWeight,
          lineHeight: theme.typography.h6.lineHeight,
          letterSpacing: theme.typography.h6.letterSpacing,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.h6.fontSize,
          [theme.breakpoints.up("sm")]: {
            fontSize: theme.typography.h6["@media (min-width:600px)"]?.fontSize,
          },
          [theme.breakpoints.up("md")]: {
            fontSize: `${theme.typography.h6["@media (min-width:900px)"]?.fontSize} !important`,
          },
          [theme.breakpoints.up("lg")]: {
            fontSize:
              theme.typography.h6["@media (min-width:1200px)"]?.fontSize,
          },
          ...(theme.components?.MuiTypography?.styleOverrides?.root || {}),
        },

        // Inline formatting
        ".ProseMirror strong": { fontWeight: theme.typography.fontWeightBold },
        ".ProseMirror b": { fontWeight: theme.typography.fontWeightBold },
        ".ProseMirror em": { fontStyle: "italic" },
        ".ProseMirror i": { fontStyle: "italic" },
        ".ProseMirror u": { textDecoration: "underline" },
        ".ProseMirror s": { textDecoration: "line-through" },

        // Text color
        '.ProseMirror span[style*="color"]': {
          color: "inherit",
        },

        // Highlight
        '.ProseMirror span[style*="background-color"]': {
          padding: "0.1em 0.3em",
          borderRadius: "0.2em",
        },

        // Font size inline
        '.ProseMirror span[style*="font-size"]': {
          lineHeight: 1.4,
        },

        // Text alignment
        '.ProseMirror div[style*="text-align: center"]': {
          textAlign: "center",
        },
        '.ProseMirror div[style*="text-align: right"]': {
          textAlign: "right",
        },
        '.ProseMirror div[style*="text-align: left"]': {
          textAlign: "left",
        },

        // Lists
        ".ProseMirror ul": {
          listStyle: "disc",
          paddingLeft: theme.spacing(3),
          marginBottom: theme.spacing(2),
        },
        ".ProseMirror ol": {
          listStyle: "decimal",
          paddingLeft: theme.spacing(3),
          marginBottom: theme.spacing(2),
        },
        ".ProseMirror li": {
          lineHeight: 1.6,
          marginBottom: theme.spacing(1),
        },

        // Line breaks
        ".ProseMirror br": {
          display: "block",
          content: '" "',
          marginBottom: theme.spacing(1),
        },
      })}
    />
  );
};

const AppWyswig = ({ value, onChange, onBlur, editable, error }) => {
  const extensions = [
    StarterKit,
    Color,
    Underline,
    TextStyle,
    Highlight,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    FontSize,
    BulletList.configure({
      HTMLAttributes: {
        class: "ml-6",
      },
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: "ml-6",
      },
    }),
  ];

  const color = colors;
  const themeOption = {
    colors: color,
    customization: {
      fontFamily: "PSLKandaModernPro",
    },
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
    typography: themeTypography(themeOption),
  };

  let theme = createTheme(themeOptions);
  theme = responsiveFontSizes(theme);
  theme.components = componentStyleOverrides(themeOption);

  let themesMenu = createTheme({});

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalEditorStyles />
      <Box
        sx={{
          "&& .MuiTiptap-FieldContainer-notchedOutline": {
            borderColor: error ? "red" : null,
          },
        }}
      >
        <RichTextEditor
          data-testid="rich-text-editor"
          onBlur={onBlur}
          onUpdate={(props) => {
            const _text = props.editor.getText();
            let parsed = "";
            if (_text.trim() !== "") {
              const _html = props.editor.getHTML();
              parsed = HtmlParser(_html);
            }
            onChange(parsed);
          }}
          editable={editable}
          extensions={extensions}
          content={value}
          renderControls={() => (
            <ThemeProvider theme={themesMenu}>
              <MenuControlsContainer>
                <MenuButtonUndo />
                <MenuButtonRedo />
                <MenuDivider />
                <MenuButtonBold />
                <MenuButtonItalic />
                <MenuButtonUnderline />
                <MenuButtonStrikethrough />
                <MenuButtonTextColor
                  data-testid="button-text-color"
                  defaultTextColor="#888585"
                  swatchColors={[
                    { value: "#888585", label: "Default" },
                    { value: "#F37021", label: "Thanachart" },
                    { value: "#000000", label: "Black" },
                    { value: "#ffffff", label: "White" },
                    { value: "#888888", label: "Grey" },
                    { value: "#ff0000", label: "Red" },
                    { value: "#ff9900", label: "Orange" },
                    { value: "#ffff00", label: "Yellow" },
                    { value: "#00d000", label: "Green" },
                    { value: "#0000ff", label: "Blue" },
                  ]}
                />
                <MenuButtonHighlightColor
                  data-testid="button-highlight-color"
                  swatchColors={[
                    { value: "#595959", label: "Dark grey" },
                    { value: "#dddddd", label: "Light grey" },
                    { value: "#ffa6a6", label: "Light red" },
                    { value: "#ffd699", label: "Light orange" },
                    { value: "#ffff00", label: "Yellow" },
                    { value: "#99cc99", label: "Light green" },
                    { value: "#90c6ff", label: "Light blue" },
                    { value: "#8085e9", label: "Light purple" },
                  ]}
                />
                <MenuDivider />
                <MenuSelectFontSize
                  data-testid="button-font-size"
                  defaultValue="20"
                  options={[
                    { value: "8px", label: "8" },
                    { value: "9px", label: "9" },
                    { value: "10px", label: "10" },
                    { value: "11px", label: "11" },
                    { value: "12px", label: "12" },
                    { value: "14px", label: "14" },
                    { value: "16px", label: "16" },
                    { value: "18px", label: "18" },
                    { value: "20px", label: "20" },
                    { value: "24px", label: "24" },
                    { value: "30px", label: "30" },
                    { value: "36px", label: "36" },
                    { value: "48px", label: "48" },
                    { value: "60px", label: "60" },
                    { value: "72px", label: "72" },
                    { value: "96px", label: "96" },
                  ]}
                />
                <MenuSelectHeading />
                <MenuButtonBulletedList />
                <MenuButtonOrderedList />
                <MenuButtonAlignLeft />
                <MenuButtonAlignCenter />
                <MenuButtonAlignRight />
              </MenuControlsContainer>
            </ThemeProvider>
          )}
        />
      </Box>
    </ThemeProvider>
  );
};

export default AppWyswig;
