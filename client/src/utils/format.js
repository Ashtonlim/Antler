export const currF = (val, currency = "USD") => {
  if (val === undefined) return 0;

  // rounds the val
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(val);
};
// --RMV--
export const dollarsToCents = (val) => {
  val = (val + "").replace(/[^\d.-]/g, "");
  if (val && val.includes(".")) {
    val = val.substring(0, val.indexOf(".") + 4);
  }
  return val ? Math.round(parseFloat(val) * 100) : 0;
};
