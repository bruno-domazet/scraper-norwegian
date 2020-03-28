import { default as cheerio } from "cheerio";
import { default as moment } from "moment";

export interface ParsedFlightData {
  flightDate: string;
  price: number;
  origin: string;
  currency: string;
}
export interface Entry extends ParsedFlightData {
  createdAt: string;
}

export const parse = (
  html: string | Buffer,
  datePeriod: string
): ParsedFlightData[] => {
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
