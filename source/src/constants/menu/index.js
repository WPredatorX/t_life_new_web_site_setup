import {
  Home,
  ShoppingBasket,
  PointOfSale,
  StoreMallDirectory,
} from "@mui/icons-material";

export const menuItem = [
  {
    id: 0,
    key: "home",
    code: "home",
    label: {
      th: "หน้าแรก",
      en: "Home",
    },
    href: "/",
    icon: <Home />,
    select: ["", "home"],
  },
  {
    id: 1,
    key: "product",
    code: "product",
    label: {
      th: "ผลิตภัณฑ์ทั้งหมด",
      en: "Products",
    },
    href: "/products",
    icon: <ShoppingBasket />,
    select: ["products"],
  },
  {
    id: 2,
    key: "direct",
    code: "direct",
    label: {
      th: "ช่องทาง Direct",
      en: "Direct Channel",
    },
    href: "/direct",
    icon: <PointOfSale />,
    select: ["direct"],
  },
  {
    id: 3,
    key: "broker",
    code: "broker",
    label: {
      th: "ช่องทาง Brokers",
      en: "Broker Channel",
    },
    href: "/brokerlist",
    icon: <StoreMallDirectory />,
    select: ["brokerlist", "brokers"],
  },
];
