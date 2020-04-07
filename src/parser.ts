import { default as cheerio } from "cheerio";
import { default as moment } from "moment";

export interface ParsedFlightData {
  flightDate: Date;
  price: number;
  airport: string;
  airline: string;
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
            dom(cellContent).find(priceSel).html()?.replace(".", "") || "",
            10
          );

          const day = parseInt(
            dom(cellContent).find(daySel).html()?.replace(".", "") || "",
            10
          );

          // only valid data plz
          if (!isNaN(price) && !isNaN(day)) {
            // HACK! adding time to fix tz issues
            const dateString = [datePeriod, day, "14:00"].join("-");
            const flightDate = moment(
              dateString,
              "YYYY-MM-DD-HH:mm"
            ).toDate();

            data.push({
              flightDate,
              price,
              airport: calIdx === 0 ? "CPH" : "ALC",
              airline: "norwegian.com", // hard connection to parse/scraper logic
            });
          }
        });
      });
  });

  return data;
};
