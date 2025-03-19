import { screen, render } from "@utilities/jest";
import { setupJestCanvasMock } from "jest-canvas-mock";
import CanvasPage from "@app/components/canvas/page";

describe("Canvas Page", () => {
  beforeEach(() => {
    global.Image = class {
      constructor() {
        this.onload = null;
        this.src = "";
      }

      set src(value) {
        this._src = value;
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 1000);
      }

      get src() {
        return this._src;
      }
    };

    global.CanvasRenderingContext2D = class {
      beginPath = jest.fn();
      moveTo = jest.fn();
      lineTo = jest.fn();
      arc = jest.fn();
      fill = jest.fn();
      stroke = jest.fn();
      closePath = jest.fn();
      fillText = jest.fn();
      drawImage = jest.fn();
      getImageData = jest.fn();
      putImageData = jest.fn();
      createLinearGradient = jest.fn();
      createPattern = jest.fn();
      createRadialGradient = jest.fn();
      clearRect = jest.fn();
      strokeRect = jest.fn();
      fillRect = jest.fn();
      drawImage = jest.fn();
    };
  });

  afterEach(() => {
    delete global.Image;
    delete global.CanvasRenderingContext2D;
    jest.clearAllMocks();
    jest.useRealTimers();
    setupJestCanvasMock();
  });

  describe("Render Component", () => {
    it("should render widout crashing", async () => {
      //   arrange
      jest.useFakeTimers();
      const component = <CanvasPage />;

      // act
      await render(component);

      //assert
      /** @type {HTMLCanvasElement} */
      const canvas = await screen.findByTestId("canvas");
      /** @type {RenderingContext} */
      const canvasContext = canvas.getContext("2d");

      jest.advanceTimersByTime(1000);
      expect(component).toBeDefined();
      expect(canvasContext.beginPath).toHaveBeenCalled();
      expect(canvasContext.drawImage).toHaveBeenCalled();
    });
  });
});
