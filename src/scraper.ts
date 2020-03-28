import {
  openPuppetConnection,
  closePuppetConnection,
  getRandomInt
} from "./utils";
import { parse, Entry } from "./parser";
import { default as moment } from "moment";
import { getCollection, getDbClient, closeDb } from "./db";
import { dbConfig } from "./config";

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

const parseAndStore = async (
  html: string | Buffer,
  datePeriod: string
): Promise<any> => {
  if (!html) {
    return false;
  }

  const createdAt = moment().toISOString();
  const rows: Entry[] = parse(html, datePeriod).map(row => {
    return {
      ...row,
      createdAt
    };
  });

  if (rows.length) {
    return getDbClient().then(client => {
      return (
        getCollection(client)
          // continue on write errors
          .insertMany(rows, { ordered: true })
          .then(res => res)
          .catch(err => {
            console.error(err);
          })
      );
    });
  } else {
    console.log("## Nothing to insert!", datePeriod, rows);
  }
};

// initial run of service
const onStartup = () => {
  // setup DB name and collection and
  // setup unique compound indexes
  getDbClient().then(client => {
    client
      .db(dbConfig.db)
      .collection(dbConfig.collection)
      .createIndex({ flightDate: 1, price: 1, origin: 1 }, { unique: true })
      .catch(err => console.error(err));
  });
  // other scaffolding stuff..?
};

(async () => {
  const fromDate = moment();
  const toDate = fromDate.clone().add(1, "year");

  try {
    let { browser, page } = await openPuppetConnection();
    await page.goto(url.toString() + "?" + params.toString(), {
      waitUntil: ["load", "networkidle2"]
    });

    // navigate through the next 12 months
    // save html, on each step,
    for (let m = moment(fromDate); m.isBefore(toDate); m.add(1, "month")) {
      // get html and it write to file

      console.log(m.format("YYYY-MM"), "Scraping...");
      const html = await page.evaluate(() => document.body.innerHTML);

      // send html off to the parser
      parseAndStore(html, m.format("YYYY-MM"));

      // wait between 8-15 sec, before proceeding
      const waitSecs = getRandomInt(3, 8); // tweak for speed + "human behavior"
      await page.waitFor(waitSecs * 1000);
      // TODO select random days (simulate "human behavior")
      await page.click(nextArr, { delay: getRandomInt(20, 200) });
    }

    // close browser
    closePuppetConnection(browser, page);

    // close DB
    getDbClient().then(client => {
      closeDb(client);
    });

    console.log("Done in", moment().diff(fromDate, "s", true) + "s.");
  } catch (err) {
    console.error(err);
  }
})();
