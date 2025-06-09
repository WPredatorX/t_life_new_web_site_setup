import { Yup as yup } from "../";
import { addDays, subDays } from "date-fns";

describe("Yup custom methods", () => {
  describe("string.preventSpace", () => {
    const schema = yup.string().preventSpace("No space only");

    it("should pass with normal text", async () => {
      await expect(schema.validate("Hello")).resolves.toBe("Hello");
    });

    it("should fail if input contains only spaces", async () => {
      await expect(schema.validate("     ")).rejects.toThrow();
    });

    it("should pass with empty string", async () => {
      await expect(schema.validate("")).resolves.toBe("");
    });
  });

  describe("object.uniqueProperty", () => {
    const schema = yup
      .array()
      .of(yup.object().uniqueProperty("name", "Duplicate name"));

    it("should pass if all names are unique", async () => {
      const data = [{ name: "A" }, { name: "B" }];
      await expect(schema.validate(data)).resolves.toEqual(data);
    });

    it("should fail if there are duplicate names (case and space insensitive)", async () => {
      const data = [{ name: "John Doe" }, { name: "john    doe" }];
      await expect(schema.validate(data)).rejects.toThrow();
    });

    it("should skip null or empty properties", async () => {
      const data = [{ name: "" }, { name: null }];
      await expect(schema.validate(data)).resolves.toEqual(data);
    });
  });

  describe("date.preventPast", () => {
    const schema = yup.date().nullable().preventPast("Must not be in the past");

    it("should pass with null", async () => {
      await expect(schema.validate(null)).resolves.toBe(null);
    });

    it("should pass with today or future date", async () => {
      await expect(schema.validate(new Date())).resolves.toBeInstanceOf(Date);
      await expect(
        schema.validate(addDays(new Date(), 1))
      ).resolves.toBeInstanceOf(Date);
    });

    it("should fail with past date", async () => {
      await expect(schema.validate(subDays(new Date(), 1))).rejects.toThrow();
    });
  });

  describe("date.preventFuture", () => {
    const schema = yup
      .date()
      .nullable()
      .preventFuture("Must not be in the future");

    it("should pass with null", async () => {
      await expect(schema.validate(null)).resolves.toBe(null);
    });

    it("should pass with today or past date", async () => {
      await expect(schema.validate(new Date())).resolves.toBeInstanceOf(Date);
      await expect(
        schema.validate(subDays(new Date(), 1))
      ).resolves.toBeInstanceOf(Date);
    });

    it("should fail with future date", async () => {
      await expect(schema.validate(addDays(new Date(), 1))).rejects.toThrow();
    });
  });

  describe("array.atLeastOneObject", () => {
    const schema = yup
      .array()
      .nullable()
      .atLeastOneObject("At least one item is required");

    it("should pass with at least one item", async () => {
      await expect(schema.validate([{ a: 1 }])).resolves.toEqual([{ a: 1 }]);
    });

    it("should fail with null", async () => {
      await expect(schema.validate(null)).rejects.toThrow();
    });

    it("should fail with empty array", async () => {
      await expect(schema.validate([])).rejects.toThrow();
    });

    it("should fail with null", async () => {
      await expect(schema.validate(null)).rejects.toThrow();
    });
  });
});
