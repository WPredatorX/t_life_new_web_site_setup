const keyIdentity = (key) => {
  return key;
};

export const flatten = (target, opts) => {
  opts = opts || {};

  const delimiter = opts.delimiter || ".";
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output = {};

  const step = (object, prev, currentDepth) => {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach((key) => {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isobject = type === "[object Object]" || type === "[object Array]";

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key);

      if (
        !isarray &&
        isobject &&
        Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)
      ) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
    });
  };

  step(target);

  return output;
};
export const formatNumber = (
  number,
  _minimumFractionDigits = 2,
  _maximumFractionDigits = 2
) => {
  const formatOption = {
    maximumFractionDigits: _maximumFractionDigits,
    minimumFractionDigits: _minimumFractionDigits,
  };

  return new Intl.NumberFormat("en-US", formatOption).format(number);
};

export const formatHrefFromItemTitle = (inputText) => {
  const lowerCaseText = inputText.toLowerCase();
  const transformedText = lowerCaseText.replace(/\s+/g, "-");
  return transformedText;
};
