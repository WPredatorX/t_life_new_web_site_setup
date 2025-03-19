import "@testing-library/jest-dom";
import "jest-canvas-mock";

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

self.__NEXT_DATA__ = {};
