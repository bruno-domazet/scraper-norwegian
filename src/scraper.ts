import { openConnection, closeConnection } from "./utils";
import { default as moment } from "moment";

const url = new URL("https://www.norwegian.com/dk/booking/fly/lavpris");
const startDate = moment(); // now
const endDate = startDate.clone().endOf("month"); // end of current month

const params = new URLSearchParams({
  A_City: "ALC",
  AdultCount: "2",
  ChildCount: "3",
  CurrencyCode: "DKK",
  D_City: "CPH",
  D_Day: "01",
  D_Month: startDate.format("YYYYMM"), //"202003",
  D_SelectedDay: "01",
  IncludeTransit: "false",
  InfantCount: "0",
  R_Day: "25",
  R_Month: endDate.format("YYYYMM"), //"202003",
  R_SelectedDay: "25",
  TripType: "2",
  origin: "CPH",
  destination: "ALC",
  outbound: startDate.format("YYYY-MM"), //"2020-03",
  inbound: endDate.format("YYYY-MM"), //"2020-03",
  adults: "2",
  children: "3",
  currency: "DKK"
});

/// Selectors
const nextArr = ".nas-icon-arrow-right--arrow-right";

(async () => {
  let { browser, page } = await openConnection();
  try {
    await page.goto(url.toString() + "?" + params.toString(), {
      waitUntil: ["load", "networkidle2"],
      referer: "https://www.norwegian.com/dk/"
    });

    // TODO: navigate 12 times,
    // save html, on each step,
    // done


    const html = await page.evaluate(() => document.body.innerHTML);

    closeConnection(browser, page);
    return html;
  } catch (err) {
    console.error(err);
  }
})();
