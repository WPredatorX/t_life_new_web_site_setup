import * as yup from "yup";
import { differenceInCalendarDays } from "date-fns";

// check if property value is unique
yup.addMethod(yup.object, "uniqueProperty", function (propertyName, message) {
  return this.test("unique", message, function (value) {
    if (!value || !value[propertyName]) {
      return true;
    }

    if (
      this.parent
        .filter((v) => v !== value)
        .some((v) => {
          if (v[propertyName]) {
            return (
              v[propertyName].toString().replace(/ /g, "").toUpperCase() ===
              value[propertyName].toString().replace(/ /g, "").toUpperCase()
            );
          }
        })
    ) {
      throw this.createError({
        path: `${this.path}.${propertyName}`,
      });
    }

    return true;
  });
});

// check if string property only contain space
yup.addMethod(yup.string, "preventSpace", function (message) {
  return this.test("preventSpace", message, function (value) {
    if (!value) return true;

    const isContainedOnlySpace = !value.replace(/\s/g, "").length;
    if (isContainedOnlySpace) {
      throw this.createError({
        path: `${this.path}`,
      });
    }
    return true;
  });
});

// check if date property only container future
yup.addMethod(yup.date, "preventPast", function (message) {
  return this.test("preventPast", message, function (value) {
    if (!value) return true;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let result = differenceInCalendarDays(today, value);
    if (result > 0) {
      throw this.createError({
        path: `${this.path}`,
      });
    }
    return true;
  });
});

// check if date property only container pass and today
yup.addMethod(yup.date, "preventFuture", function (message) {
  return this.test("preventFuture", message, function (value) {
    if (!value) return true;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let result = differenceInCalendarDays(today, value);
    if (result < 0) {
      throw this.createError({
        path: `${this.path}`,
      });
    }
    return true;
  });
});

// check if array has at least one item
yup.addMethod(yup.array, "atLeastOneObject", function (message) {
  return this.test("atLeastOneObject", message, function (value) {
    if (!value) {
      throw this.createError({
        path: `${this.path}`,
      });
    }

    if (value.length < 1) {
      throw this.createError({
        path: `${this.path}`,
      });
    }

    return true;
  });
});

// set locale
yup.setLocale({
  mixed: {
    required: `จำเป็นต้องระบุข้อมูลนี้`,
  },
});

export default yup;
