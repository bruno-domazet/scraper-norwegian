import { launch } from "puppeteer";
import { openConnection, closeConnection } from "./utils";
const url = new URL("https://www.norwegian.com/dk/booking/fly/lavpris");
const params = new URLSearchParams({
  A_City: "ALC",
  AdultCount: "2",
  ChildCount: "3",
  CurrencyCode: "DKK",
  D_City: "CPH",
  D_Day: "05",
  D_Month: "202003",
  D_SelectedDay: "05",
  IncludeTransit: "false",
  InfantCount: "0",
  R_Day: "05",
  R_Month: "202003",
  R_SelectedDay: "05",
  TripType: "2",
  origin: "CPH",
  destination: "ALC",
  outbound: "2020-03",
  selectedOutbound: "2020-03-07",
  inbound: "2020-03",
  selectedInbound: "2020-03-07",
  adults: "2",
  children: "3",
  currency: "DKK"
});

const init = async () => {
  let { browser, page } = await openConnection();
  try {
    await page.goto(url.toString(), {
      waitUntil: "load"
      //referer: "https://www.norwegian.com/dk/"
    });
    //page.waitForSelector('.something').then((el)=>{console.log(el)})
    await page.screenshot({ path: "example.png" });
  } catch (err) {
    console.error(err.message);
  } finally {
    await closeConnection(page, browser);
  }
}

init();
