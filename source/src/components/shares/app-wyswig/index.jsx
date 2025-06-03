"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "@mui/material";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

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
import Color from "@tiptap/extension-color";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListKeymap from "@tiptap/extension-list-keymap";
import ListItem from "@tiptap/extension-list-item";

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

const ClientComponent = ({ value, onChange, editable }) => {
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

  const theme = createTheme({
    typography: {
      fontFamily: "PSLKandaModernPro",
    },
  });

  const themeMenu = createTheme({});

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RichTextEditor
        data-testid="rich-text-editor"
        onUpdate={(props) => {
          let _html = props.editor.getHTML();
          let parsed = HtmlParser(_html);
          onChange(parsed);
        }}
        editable={editable}
        extensions={extensions}
        content={value}
        renderControls={() => (
          <ThemeProvider theme={themeMenu}>
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
                swatchColors={[
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
              <MenuSelectFontSize />
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
    </ThemeProvider>
  );
};

export default ClientComponent;
