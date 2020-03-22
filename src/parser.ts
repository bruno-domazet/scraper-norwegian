import { default as cheerio } from "cheerio";
import * as fs from "fs";
import * as path from "path";

//// Selectors
const wrapperCellSel = ".lowfare-calendar__cell";
const priceSel = ".lowfare-calendar__price";
const daySel = ".lowfare-calendar__date";

const dumpPath = "dumps";

(async () => {
  // TODO: read from buckets,
  // mark processed files as done (rename/move)
  const html = fs.readFileSync(`${dumpPath}${path.sep}lols.html`);
  const data = [];
  if (html) {
    const dom = cheerio.load(html);

    dom(wrapperCellSel).map((i, el) => {
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
  }
})();
