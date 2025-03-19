import { render, act, screen, fireEvent } from "@utilities/jest";
import { AppCardProduct } from "@components";
import AppCardProductTopTag from "@components/shares/app-card-product/appCardProductTopTag";
import AppCardProductBottomTag from "@components/shares/app-card-product/appCardProductBottomTag";
import AppCardProductDescription from "@components/shares/app-card-product/appCardProductDescription";

describe("AppCardProduct Component", () => {
  let defaultProps = {
    title: {
      th: "",
      en: "",
    },
    description: {
      th: "",
      en: "",
    },
    handleMoreInfoClick: () => {},
    handleBuyNowClick: () => {},
    image: "",
    tag: {
      top: {
        show: false,
        title: {
          th: "",
          en: "",
        },
      },
      bottom: {
        show: false,
        topTitle: {
          th: "",
          en: "",
        },
        bottomTitle: {
          th: "",
          en: "",
        },
      },
    },
  };

  let consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe("Render Component", () => {
    it("should render without props", async () => {
      // arrange
      const component = <AppCardProduct />;

      // act
      await render(component);

      // assert
      expect(consoleErrorSpy).toHaveBeenCalledTimes(5);
    });

    it("should render with default props", async () => {
      // arrange
      const component = <AppCardProduct {...defaultProps} />;

      // act
      await render(component);

      // assert
      expect(component).toBeDefined();
    });

    it("should render with custom props", async () => {
      // arrange
      const props = {
        ...defaultProps,
        title: {
          th: "mock-title-th",
          en: "mock-title-en",
        },
      };
      const component = <AppCardProduct {...props} />;

      // act
      await render(component);

      // assert
      expect(component).toBeDefined();
    });
  });

  describe("User Event", () => {
    it("should handle click more info without props", async () => {
      // arrange
      const component = <AppCardProduct />;

      // act
      await render(component);
      const buttonMoreInfo = await screen.findByTestId("button-more-info");
      act(() => {
        fireEvent.click(buttonMoreInfo);
      });

      // assert
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
    });

    it("should handle click buy now without props", async () => {
      // arrange
      const component = <AppCardProduct />;

      // act
      await render(component);
      const buttonMoreInfo = await screen.findByTestId("button-buy-now");
      act(() => {
        fireEvent.click(buttonMoreInfo);
      });

      // assert
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
    });

    it("should handle click more info with custom props", async () => {
      // arrange
      const props = {
        ...defaultProps,
        handleMoreInfoClick: jest.fn(),
        handleBuyNowClick: jest.fn(),
      };
      const component = <AppCardProduct {...props} />;

      // act
      await render(component);
      const buttonMoreInfo = await screen.findByTestId("button-more-info");
      act(() => {
        fireEvent.click(buttonMoreInfo);
      });

      // assert
      expect(component).toBeDefined();
      expect(props.handleMoreInfoClick).toHaveBeenCalledTimes(1);
    });

    it("should handle click buy now with custom props", async () => {
      // arrange
      const props = {
        ...defaultProps,
        handleMoreInfoClick: jest.fn(),
        handleBuyNowClick: jest.fn(),
      };
      const component = <AppCardProduct {...props} />;

      // act
      await render(component);
      const buttonMoreInfo = await screen.findByTestId("button-buy-now");
      act(() => {
        fireEvent.click(buttonMoreInfo);
      });

      // assert
      expect(component).toBeDefined();
      expect(props.handleBuyNowClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("AppCardProductTopTag Subcomponent", () => {
    let _defaultProps = {
      ...defaultProps.tag.top,
    };

    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <AppCardProductTopTag />;

        // act
        await render(component);

        // assert
        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      });

      it("should render with default props", async () => {
        // arrange
        const component = <AppCardProductTopTag {..._defaultProps} />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });

      it("should render with custom props", async () => {
        // arrange
        const props = {
          ..._defaultProps,
          show: true,
          title: { th: "mock-title-th", en: "mock-title-en" },
        };
        const component = <AppCardProductTopTag {...props} />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });
  });

  describe("AppCardProductBottomTag Subcomponent", () => {
    let _defaultProps = {
      ...defaultProps.tag.bottom,
    };

    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <AppCardProductBottomTag />;

        // act
        await render(component);

        // assert
        expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
      });

      it("should render with default props", async () => {
        // arrange
        const component = <AppCardProductBottomTag {..._defaultProps} />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });

      it("should render with custom props", async () => {
        // arrange
        const props = {
          ..._defaultProps,
          show: true,
          topTitle: { th: "mock-topTitle-th", en: "mock-topTitle-en" },
          bottomTitle: { th: "mock-bottomTitle-th", en: "mock-bottomTitle-en" },
        };
        const component = <AppCardProductBottomTag {...props} />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });
  });

  describe("AppCardProductDescription Subcomponent", () => {
    let _defaultProps = {
      ...defaultProps,
    };

    describe("Render Component", () => {
      it("should render without props", async () => {
        // arrange
        const component = <AppCardProductDescription />;

        // act
        await render(component);

        // assert
        expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
      });

      it("should render with default props", async () => {
        // arrange
        const component = <AppCardProductDescription {..._defaultProps} />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });

      it("should render with custom props", async () => {
        // arrange
        const props = {
          ..._defaultProps,
          title: {
            th: "mock-title-th",
            en: "mock-title-en",
          },
          description: {
            th: "mock-description-th",
            en: "mock-description-en",
          },
          handleMoreInfoClick: jest.fn(),
          handleBuyNowClick: jest.fn(),
        };
        const component = <AppCardProductDescription {...props} />;

        // act
        await render(component);

        // assert
        expect(component).toBeDefined();
      });
    });

    describe("User Event", () => {
      it("should handle click more info without props", async () => {
        // arrange
        const component = <AppCardProductDescription />;

        // act
        await render(component);
        const buttonMoreInfo = await screen.findByTestId("button-more-info");
        act(() => {
          fireEvent.click(buttonMoreInfo);
        });

        // assert
        expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
      });

      it("should handle click buy now without props", async () => {
        // arrange
        const component = <AppCardProductDescription />;

        // act
        await render(component);
        const buttonMoreInfo = await screen.findByTestId("button-buy-now");
        act(() => {
          fireEvent.click(buttonMoreInfo);
        });

        // assert
        expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
      });

      it("should handle click more info with custom props", async () => {
        // arrange
        const props = {
          ...defaultProps,
          handleMoreInfoClick: jest.fn(),
          handleBuyNowClick: jest.fn(),
        };
        const component = <AppCardProductDescription {...props} />;

        // act
        await render(component);
        const buttonMoreInfo = await screen.findByTestId("button-more-info");
        act(() => {
          fireEvent.click(buttonMoreInfo);
        });

        // assert
        expect(component).toBeDefined();
        expect(props.handleMoreInfoClick).toHaveBeenCalledTimes(1);
      });

      it("should handle click buy now with custom props", async () => {
        // arrange
        const props = {
          ...defaultProps,
          handleMoreInfoClick: jest.fn(),
          handleBuyNowClick: jest.fn(),
        };
        const component = <AppCardProductDescription {...props} />;

        // act
        await render(component);
        const buttonMoreInfo = await screen.findByTestId("button-buy-now");
        act(() => {
          fireEvent.click(buttonMoreInfo);
        });

        // assert
        expect(component).toBeDefined();
        expect(props.handleBuyNowClick).toHaveBeenCalledTimes(1);
      });
    });
  });
});
