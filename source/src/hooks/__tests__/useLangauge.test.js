import { renderHook, act } from "@utilities/jest";
import { useLanguage } from "@hooks";

describe("useLanguage", () => {
  describe("Hook Render", () => {
    it("should render without crashing", async () => {
      // arrange
      const { result } = renderHook(() => useLanguage(), {});

      // assert
      expect(result.current.language).toBe("th");
    });
  });

  describe("Hook Event", () => {
    it("should switch language after trigger handleChangeLanguage", async () => {
      // arrange
      const { result } = renderHook(() => useLanguage(), {});

      // act
      act(() => {
        result.current.handleChangeLanguage("en");
      });

      // assert
      expect(result.current.language).toBe("en");
    });
  });
});
