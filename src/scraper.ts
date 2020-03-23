import { openConnection, closeConnection, getRandomInt } from "./utils";
import { parseAndStore } from "./parser";
import { default as moment } from "moment";

const params = new URLSearchParams({
  A_City: "ALC",
  AdultCount: "2",
  ChildCount: "3",
  CurrencyCode: "DKK",
  D_City: "CPH",
  D_Day: "01",
  D_Month: moment().format("YYYYMM"), //"202003",
  D_SelectedDay: "01",
  IncludeTransit: "false",
  InfantCount: "0",
  R_Day: "25",
  R_Month: moment()
    .endOf("month")
    .format("YYYYMM"), //"202003",
  R_SelectedDay: "25",
  TripType: "2",
  origin: "CPH",
  destination: "ALC",
  outbound: moment().format("YYYY-MM"), //"2020-03",
  inbound: moment()
    .endOf("month")
    .format("YYYY-MM"), //"2020-03",
  adults: "2",
  children: "3",
  currency: "DKK"
});

const url = new URL("https://www.norwegian.com/dk/booking/fly/lavpris");

/// Selectors
const nextArr = ".nas-icon-arrow-right--arrow-right";

(async () => {
  const fromDate = moment();
  const toDate = fromDate.clone().add(1, "year");

  try {
    let { browser, page } = await openConnection();
    console.log("goto");
    await page.goto(url.toString() + "?" + params.toString(), {
      waitUntil: ["load", "networkidle2"]
    });
    console.log("goto::done");

    // navigate through the next 12 months
    // save html, on each step,
    console.log("loop");
    for (let m = moment(fromDate); m.isBefore(toDate); m.add(1, "month")) {
      // get html and it write to file

      console.log(m.format("YYYY-MM"), "Scraping...");
      const html = await page.evaluate(() => document.body.innerHTML);

      // // TODO: Replace with a cloud bucket, instead of local storage
      // const dumpDir = "dumps/" + fromDate.format("YYYY-MM-DD");
      // if (!fs.existsSync(dumpDir)) {
      //   fs.mkdirSync(dumpDir);
      // }
      // fs.writeFileSync(dumpDir + "/" + m.format("YYYY-MM-DD-HH-mm-ss-SSS") + ".txt", html);

      // send html off to the parser
      parseAndStore(html, m.format("YYYY-MM"));

      // wait between 8-15 sec, before proceeding
      const waitSecs = getRandomInt(8, 15);
      console.log("Waiting...", waitSecs);
      await page.waitFor(waitSecs * 1000);
      console.log("Navigating...");
      await page.click(nextArr, { delay: getRandomInt(20, 200) });
    }

    console.log("loop::done");

    await closeConnection(browser, page);

    console.log("Done in", moment().diff(fromDate, "s", true) + "s.");
  } catch (err) {
    console.error(err);
  }
})();
