import { flatten, snakeToPascalCase } from "../transform";

describe("Transform Utility", () => {
  it("shoudl handle flatten json", () => {
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

  it("shoudl handle flatten json with array props", () => {
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

  it("shoudl handle flatten json with array props and safe option", () => {
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

  it("shoudl handle flatten json with array props and maxDepth option", () => {
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
});
