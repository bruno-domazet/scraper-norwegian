import { openConnection, closeConnection } from "./utils";
import { default as moment } from "moment";
import { default as cheerio } from "cheerio";
import * as fs from "fs";
import * as path from "path";

const url = new URL("https://www.norwegian.com/dk/booking/fly/lavpris");
const startDate = moment().add(1,'month'); // now
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

//// Selectors
const wrapperCellSel = ".lowfare-calendar__cell";
const priceSel = ".lowfare-calendar__price";
const daySel = ".lowfare-calendar__date";
const nextArr = ".nas-icon-arrow-right--arrow-right";

const dumpPath = "../dumps";

const saveHTML = async () => {
  let { browser, page } = await openConnection();
  try {
    await page.goto(url.toString() + "?" + params.toString(), {
      waitUntil: ["load", "networkidle2"],
      referer: "https://www.norwegian.com/dk/"
    });

    //await page.waitForSelector(wrapperCellSel, { timeout: 30 });
    await page.screenshot({ path: "example.png" });
    // save HTML from page
    const dom = await page.evaluate(() => document.body.innerHTML);

    await browser.close();
    return dom;
  } catch (err) {
    console.error(err);
  }
};

// process data with cheerio
const processHtml = async () => {
  const html = fs.readFileSync("dumps/lols.html");
  const data = [];
  if (html) {
    const dom = cheerio.load(html);

    dom(wrapperCellSel).map((i, el) => {
      const day = parseInt(dom(el).find(daySel).html()||'')
      const price = parseInt(dom(el).find(priceSel).html()||'')
      console.log('object',day,price)
    });
  }
};

(async () => {
  const html = await saveHTML();
  fs.writeFileSync("dumps/lols.html", html);

  await processHtml();
})();
