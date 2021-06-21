import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc"); // dependent on utc plugin
var timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// export const fullDT = () => {
//   return dayjs().format('LLL')
// }

export const convertYr = (unix) => {
  const d = new Date(unix * 1000);
  const day = d.toLocaleString("default", { weekday: "short" });
  const mth = d.toLocaleString("default", { month: "short" });
  return `${day} ${mth}`;
};

export const convert = (t, tz = "America/New_York", range = "1d") => {
  let f = "D MMM YY";
  switch (range) {
    case "1d":
    case "5d":
      f = "D MMM: H:mm";
      break;
    default:
      f = "D MMM: H:mm";
  }
  return dayjs(t * 1000)
    .tz(tz)
    .format(f);
};

export const convert5d1m = (t, range) => {
  let f = "MMM YY";
  switch (range.toLowerCase()) {
    case "1d":
    case "5d":
    case "3mo":
    case "6mo":
      f = "D MMM";
      break;
    default:
      f = "D MMM";
  }

  return dayjs(t * 1000).format(f);

  // const d = new Date(unix * 1000)
  // const day = d.getDay()
  // const mth = d.toLocaleString('default', { month: 'short' })
  // return `${day} ${mth}`
};

// unused
export const ConvertRegMktTime = (time) => {
  return dayjs(time).format("HH:mm");
};

// getDate()	Get the day as a number (1-31)
// getDay()	Get the weekday as a number (0-6)
// getFullYear()	Get the four digit year (yyyy)
// getHours()	Get the hour (0-23)
// getMilliseconds()	Get the milliseconds (0-999)
// getMinutes()	Get the minutes (0-59)
// getMonth()	Get the month (0-11)
// getSeconds()	Get the seconds (0-59)
// getTime()	Get the time (milliseconds since January 1, 1970)
// const mth = d.toLocaleString('default', { month: 'short' }) get month Jan, Feb...
// const day = d.toLocaleString('default', { weekday: 'short' }) get day Mon, Tue...
// const day = d.toLocaleString('default', {
//   hour: 'numeric',
//   hour12: true,
// })
