import {
  flatten,
  snakeToPascalCase,
  formatNumber,
  formatHrefFromItemTitle,
} from "../transform";

describe("Transform Utility", () => {
  it("should handle flatten json", () => {
    // arrange
    const json = {
      id: 0,
      label: {
        th: "mock-label-th",
        en: "mock-label-en",
      },
    };

    // act
    const flattenResult = flatten(json);

    // assert
    expect(flattenResult).toStrictEqual({
      id: 0,
      "label.en": "mock-label-en",
      "label.th": "mock-label-th",
    });
  });

  it("should handle flatten json with array props", () => {
    // arrange
    const json = {
      id: 0,
      label: {
        th: "mock-label-th",
        en: "mock-label-en",
      },
      child: [
        {
          id: 0,
          label: {
            th: "mock-child-0-label-th",
            en: "mock-child-0-label-en",
          },
        },
        {
          id: 1,
          label: {
            th: "mock-child-1-label-th",
            en: "mock-child-1-label-en",
          },
        },
      ],
    };

    // act
    const flattenResult = flatten(json);

    // assert
    expect(flattenResult).toStrictEqual({
      id: 0,
      "label.en": "mock-label-en",
      "label.th": "mock-label-th",
      "child.0.id": 0,
      "child.0.label.en": "mock-child-0-label-en",
      "child.0.label.th": "mock-child-0-label-th",
      "child.1.id": 1,
      "child.1.label.en": "mock-child-1-label-en",
      "child.1.label.th": "mock-child-1-label-th",
    });
  });

  it("should handle flatten json with array props and safe option", () => {
    // arrange
    const json = {
      id: 0,
      label: {
        th: "mock-label-th",
        en: "mock-label-en",
      },
      child: [
        {
          id: 0,
          label: {
            th: "mock-child-0-label-th",
            en: "mock-child-0-label-en",
          },
        },
        {
          id: 1,
          label: {
            th: "mock-child-1-label-th",
            en: "mock-child-1-label-en",
          },
        },
      ],
    };

    // act
    const flattenResult = flatten(json, { safe: true });

    // assert
    expect(flattenResult).toStrictEqual({
      id: 0,
      "label.en": "mock-label-en",
      "label.th": "mock-label-th",
      child: [
        {
          id: 0,
          label: {
            th: "mock-child-0-label-th",
            en: "mock-child-0-label-en",
          },
        },
        {
          id: 1,
          label: {
            th: "mock-child-1-label-th",
            en: "mock-child-1-label-en",
          },
        },
      ],
    });
  });

  it("should handle flatten json with array props and maxDepth option", () => {
    // arrange
    const json = {
      id: 0,
      label: {
        th: "mock-label-th",
        en: "mock-label-en",
      },
      child: [
        {
          id: 0,
          label: {
            th: "mock-child-0-label-th",
            en: "mock-child-0-label-en",
          },
        },
        {
          id: 1,
          label: {
            th: "mock-child-1-label-th",
            en: "mock-child-1-label-en",
          },
        },
      ],
    };

    // act
    const flattenResult = flatten(json, { maxDepth: 1 });

    // assert
    expect(flattenResult).toStrictEqual({
      ...json,
    });
  });

  it("should transform snake case to pascal", () => {
    // arrange
    const input = "number_of_change";

    // act
    const transformResult = snakeToPascalCase(input);

    // assert
    expect(transformResult).toStrictEqual("NumberOfChange");
  });

  it("should format number with default 2 decimal places", () => {
    expect(formatNumber(1234.5)).toBe("1,234.50");
  });

  it("should format number with custom minimum and maximum fraction digits", () => {
    expect(formatNumber(1234.5678, 1, 3)).toBe("1,234.568");
    expect(formatNumber(1234, 0, 0)).toBe("1,234");
  });

  it("should round correctly", () => {
    expect(formatNumber(1.235, 2, 2)).toBe("1.24"); // rounded up
    expect(formatNumber(1.234, 2, 2)).toBe("1.23"); // rounded down
  });

  it("should pad with zeros if needed", () => {
    expect(formatNumber(1234.5, 3, 3)).toBe("1,234.500");
  });

  it("should handle negative numbers", () => {
    expect(formatNumber(-9876.543, 2, 2)).toBe("-9,876.54");
  });

  it("should handle zero properly", () => {
    expect(formatNumber(0)).toBe("0.00");
  });

  it("should convert text to lowercase and replace spaces with hyphens", () => {
    expect(formatHrefFromItemTitle("Hello World")).toBe("hello-world");
    expect(formatHrefFromItemTitle("React Component")).toBe("react-component");
  });

  it("should handle multiple spaces", () => {
    expect(formatHrefFromItemTitle("Multiple    Spaces")).toBe(
      "multiple-spaces"
    );
  });

  it("should return empty string if input is empty", () => {
    expect(formatHrefFromItemTitle("")).toBe("");
  });

  it("should handle strings with special characters", () => {
    expect(formatHrefFromItemTitle("Hello@World!")).toBe("hello@world!");
  });
});
