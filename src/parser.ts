import { default as cheerio } from "cheerio";
import { getFiles } from "./utils";
import * as path from "path";
import * as fs from "fs";
import { default as moment } from "moment";

//// Selectors
const calendarSel = ".lowfare-calendar";
const originSel = "#nas-airport-select-dropdown-input-0";
const destinationSel = "#nas-airport-select-dropdown-input-1";
const wrapperCellSel = ".lowfare-calendar__cell";
const priceSel = ".lowfare-calendar__price";
const daySel = ".lowfare-calendar__date";

const dumpPath = "dumps";
const fileExt = ".txt";

export const parseAndStore = async (
  html: string | Buffer,
  datePeriod: string
): Promise<Boolean> => {
  if (!html) {
    return false;
  }
  const d = parse(html, datePeriod);

  const p = {
    _id: "1",
    scraped: moment().toISOString(),
    // unique compound index
    flightDate:"2",
    price:2,
    origin: "CPH",
    currency: "DKK"
  };
  return true;
};

const parse = (html: string | Buffer, datePeriod: string) => {
  const dom = cheerio.load(html);
  const data = [];
  let row;

  // TODO: separate between inbound and outbound flights
  // each calendar
  dom(calendarSel).each((i, cal) => {
    // each cell
    dom(cal)
      .find(wrapperCellSel)
      .each((i, cell) => {
        dom(cell).each((i, cellContent) => {
          const day = parseInt(
            dom(cellContent)
              .find(daySel)
              .html()
              ?.replace(".", "") || ""
          );
          const price = parseInt(
            dom(cellContent)
              .find(priceSel)
              .html()
              ?.replace(".", "") || ""
          );
          console.log("day => price", day, price);
        });
      });
  });
};

// NoSQL
const storeToDb = (data: any) => {};

(async () => {
  // TODO: switch out local file system with a cloud bucket
  // TODO: mark processed files as done (rename/move)

  // TODO: insert to DB!
  //const dbUrl = 'mongodb://localhost:27017';
  //const client = mongodb.connect(dbUrl)

  const files = getFiles(dumpPath, fileExt);
  console.log("files", files);
  files.forEach(file => {
    const fileBaseName = path.basename(file, fileExt);
    console.log("fileBaseName", fileBaseName);
    const parseDate = moment(fileBaseName, "YYYY-MM-DD-HH-mm-ss-SSS");
    console.log("parseDate", parseDate);

    const html = fs.readFileSync(file);

    const data = parse(html, "31");

    console.log("day => price", data);
  });
  /*
  const html = fs.readFileSync(`${dumpPath}${path.sep}**${path.sep}*.txt`);
  const data = [];
  if (html) {
    
  }
  */
})();
