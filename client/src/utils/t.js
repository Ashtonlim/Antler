const d = require("dayjs");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
d.extend(utc);
d.extend(timezone);

const t = (x) => {
  console.log(
    d(new Date() + "")
      .tz("Asia/Singapore")
      .format("YYYY MMM DD hh:mmA")
  );
};
t();
