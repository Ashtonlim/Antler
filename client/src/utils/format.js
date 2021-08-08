export const currF = (val, currency = "USD") => {
  if (val === undefined) return 0;

  // rounds the val
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(val);
};
