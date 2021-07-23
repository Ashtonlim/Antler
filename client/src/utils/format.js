export const currencyF = (val, { currency = "USD" } = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(val);
