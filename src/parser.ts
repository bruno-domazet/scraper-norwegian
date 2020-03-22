import { default as cheerio } from "cheerio";
import { getFiles } from "./utils";
import * as path from "path";
import * as fs from "fs";
import { default as moment } from "moment";
import { default as mongodb } from "mongodb";

//// Selectors
const wrapperCellSel = ".lowfare-calendar__cell";
const priceSel = ".lowfare-calendar__price";
const daySel = ".lowfare-calendar__date";

const dumpPath = "dumps";
const fileExt = ".txt";

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
    const dom = cheerio.load(html);

    dom(wrapperCellSel).each((i, el) => {
      const day = parseInt(
        dom(el)
          .find(daySel)
          .html() || ""
      );
      const price = parseInt(
        dom(el)
          .find(priceSel)
          .html() || ""
      );
      console.log("day => price", day, price);
    });
  });
  /*
  const html = fs.readFileSync(`${dumpPath}${path.sep}**${path.sep}*.txt`);
  const data = [];
  if (html) {
    
  }
  */
})();
