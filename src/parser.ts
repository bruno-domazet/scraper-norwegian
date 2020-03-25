import { default as cheerio } from "cheerio";
import { getFiles } from "./utils";
import * as path from "path";
import * as fs from "fs";
import { default as moment } from "moment";

interface ParsedFlightData {
  flightDate: string;
  price: number;
  origin: string;
  currency: string;
}
interface Entry extends ParsedFlightData {
  createdAt: string;
}

export const parseAndStore = async (
  html: string | Buffer,
  datePeriod: string
): Promise<any> => {
  if (!html) {
    return false;
  }

  const createdAt = moment().toISOString();
  const data: Entry[] = parse(html, datePeriod).map(row => {
    return {
      // unique compound index
      ...row,
      createdAt
    };
  });

  return storeToDb(data);
};

const parse = (html: string | Buffer, datePeriod: string) => {
  const dom = cheerio.load(html);
  const data: ParsedFlightData[] = [];

  //// Selectors
  const calendarSel = ".lowfare-calendar";
  const wrapperCellSel = ".lowfare-calendar__cell";
  const priceSel = ".lowfare-calendar__price";
  const daySel = ".lowfare-calendar__date";

  // each calendar
  dom(calendarSel).each((calIdx, cal) => {
    // each cell
    dom(cal)
      .find(wrapperCellSel)
      .each((i, cell) => {
        dom(cell).each((i, cellContent) => {
          const price = parseInt(
            dom(cellContent)
              .find(priceSel)
              .html()
              ?.replace(".", "") || "",
            10
          );

          const day = parseInt(
            dom(cellContent)
              .find(daySel)
              .html()
              ?.replace(".", "") || "",
            10
          );

          const flightDate = moment(
            [datePeriod, day].join("-"),
            "YYYY-MM-DD"
          ).toISOString();

          // only prices plz
          if (!isNaN(price)) {
            data.push({
              flightDate,
              price,
              origin: calIdx === 0 ? "CPH" : "ALC",
              currency: "DKK"
            });
          }
        });
      });
  });

  return data;
};

// NoSQL
const storeToDb = (rows: Entry[]) => {};

(async () => {
  // TODO: switch out local file system with a cloud bucket
  // TODO: mark processed files as done (rename/move)

  // TODO: insert to DB!
  //const dbUrl = 'mongodb://localhost:27017';
  //const client = mongodb.connect(dbUrl)

  const files = getFiles("dumps", ".txt");
  console.log("files", files);
  files.forEach(file => {
    const fileBaseName = path.basename(file, ".txt");
    console.log("fileBaseName", fileBaseName);
    const parseDate = moment(fileBaseName, "YYYY-MM-DD-HH-mm-ss-SSS");
    console.log("parseDate", parseDate);

    const html = fs.readFileSync(file);

    const data = parse(html, "2020-03");

    console.log("data", data);
  });

  /*
  const html = fs.readFileSync(`${dumpPath}${path.sep}**${path.sep}*.txt`);
  const data = [];
  if (html) {
    
  }
  */
})();
