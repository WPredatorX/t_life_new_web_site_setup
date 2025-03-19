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
    label: {
      th: "หน้าแรก",
      en: "Home",
    },
    href: "/",
    icon: <Home />,
  },
  {
    id: 1,
    key: "products",
    label: {
      th: "ผลิตภัณฑ์ทั้งหมด",
      en: "Products",
    },
    href: "/products",
    icon: <ShoppingBasket />,
  },
  {
    id: 2,
    key: "direct",
    label: {
      th: "ช่องทาง Direct",
      en: "Direct Channel",
    },
    href: "/direct",
    icon: <PointOfSale />,
  },
  {
    id: 3,
    key: "brokers",
    label: {
      th: "ช่องทาง Brokers",
      en: "Broker Channel",
    },
    href: "/brokerlist",
    icon: <StoreMallDirectory />,
  },
];
