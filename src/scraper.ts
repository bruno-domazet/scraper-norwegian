import {
  openPuppetConnection,
  closePuppetConnection,
  getRandomInt,
  resolveDockerHostNameOrIp,
} from "./utils";
import { parse } from "./parser";
import { default as moment } from "moment";
import { getCollection, getDbClient, closeDb } from "./db";
import { default as fetch } from "node-fetch";

/*
{
  "flightDate": "2020-03-01T00:00:00Z",
  "prices": [
      {
          "createdAt": "2020-03-01T00:00:00Z",
          "price": 200
      }, {

          "createdAt": "2020-03-01T02:00:00Z",
          "price": 400,
      }
  ],
  "airport": "CPH",
  "airline": "norwegian.com",
}
*/
export interface PriceEntity {
  createdAt: string;
  price: number;
}

export interface Entry {
  flightDate: string;
  airport: string;
  airline: string;
}

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
  R_Month: moment().endOf("month").format("YYYYMM"), //"202003",
  R_SelectedDay: "25",
  TripType: "2",
  origin: "CPH",
  destination: "ALC",
  outbound: moment().format("YYYY-MM"), //"2020-03",
  inbound: moment().endOf("month").format("YYYY-MM"), //"2020-03",
  adults: "2",
  children: "3",
  currency: "DKK",
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
  const parsed = parse(html, datePeriod);

  const findQueries = parsed.map((row) => {
    return {
      flightDate: row.flightDate,
      airport: row.airport,
      airline: row.airline,
    };
  });
  const updateStms = parsed.map((row) => {
    return {
      $push: {
        prices: {
          createdAt: moment().toDate(),
          price: row.price,
        },
      },
    };
  });

  // console.log("findQueries", findQueries);
  // console.log("updateStms", JSON.stringify(updateStms));

  if (findQueries.length) {
    return getDbClient().then((client) => {
      const col = getCollection(client);

      return findQueries.forEach((filter, i) => {
        const updateStm = updateStms[i];

        col
          .findOneAndUpdate(filter, updateStm, { upsert: true })
          .then((res) => res)
          .catch((err) => {
            console.error(err.message);
            return false;
          });
      });
    });
  } else {
    console.log("## Nothing to insert!", datePeriod);
    return false;
  }
};

export const scrape = async () => {
  const fromDate = moment();
  const toDate = fromDate.clone().add(1, "year");
  const dockerHost = resolveDockerHostNameOrIp();

  // get chrome debugging WebSocket url
  const webSocketUrl: string | undefined = await fetch(
    `http://${dockerHost}:${process.env.WS_PORT || 9221}/json/version`
  )
    .then((d) =>
      d
        .json()
        .then((b) =>
          b.webSocketDebuggerUrl.replace(/127.0.0.1/g, `${dockerHost}`)
        )
        .catch((err) => {
          console.error(err);
        })
    )
    .catch((err) => {
      console.error(err);
    });

  // close DB
  try {
    const client = await getDbClient();
    if (!client.isConnected()) {
      console.error("NO DB Connection");
      return { ok: false, message: "NO DB Connection" };
    }
  } catch (err) {
    console.error(err);
    return { ok: false, message: err.message };
  }

  try {
    let { browser, page } = await openPuppetConnection(webSocketUrl);

    await page.goto(url.toString() + "?" + params.toString(), {
      waitUntil: ["load", "networkidle2"],
    });

    // navigate through the next 12 months
    // save html, on each step,
    for (let m = moment(fromDate); m.isBefore(toDate); m.add(1, "month")) {
      // wait a bit, before proceeding (also animations)
      const waitSecs = getRandomInt(1, 3); // tweak for speed & "human behavior"
      await page.waitFor(waitSecs * 1000);

      // get html and it write to file
      console.log(m.format("YYYY-MM"), "Scraping...");
      if (process.env.NODE_ENV === "dev") {
        await page.screenshot({
          path: `screens/dev-${m.format("YYYY-MM")}.png`,
        });
      }
      const html = await page.evaluate(() => document.body.innerHTML);

      // capture screenshot, if next selector is missing
      const nextSel = await page.evaluate(
        (nextArr) => document.querySelector(nextArr),
        nextArr
      );
      if (!nextSel) {
        await page.screenshot({
          path: `screens/err-${m.format("YYYY-MM")}.png`,
          fullPage: true,
        });
      }

      // send html+current year-month off to the parser
      const res = await parseAndStore(html, m.format("YYYY-MM"));

      // capture screenshot, if no results
      if (!res) {
        await page.screenshot({
          path: `screens/empty-${m.format("YYYY-MM")}.png`,
          fullPage: true,
        });
      }

      // TODO select random days (simulate "human behavior")

      // proceed
      await page.click(nextArr, { delay: getRandomInt(50, 100) });
    }

    // close page, disconnect from browser, window still open
    closePuppetConnection(browser, page);

    // close DB
    getDbClient().then((client) => {
      closeDb(client);
    });

    console.log(`Done in ${moment().diff(fromDate, "s", true)}s.`);
    return {
      ok: true,
      message: `Done in ${moment().diff(fromDate, "s", true)}s.`,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, message: err.message };
  }
};
