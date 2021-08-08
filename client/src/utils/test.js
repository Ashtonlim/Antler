const d = require("dayjs");

// ===== required =====
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
d.extend(utc);
d.extend(timezone);
// ===== required =====

const t = (x) => {
  console.log(
    d(new Date() + "")
      .tz("Asia/Singapore")
      .format("YYYY MMM DD hh:mmA")
  );
};
t();
