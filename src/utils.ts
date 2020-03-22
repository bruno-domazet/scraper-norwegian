import { puppetOptions } from "./config";
import { launch, Page, Browser } from "puppeteer";

export const openConnection = async () => {
  const browser = await launch(puppetOptions);
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
  );
  await page.setViewport({ width: 1680, height: 1050 });
  await page.setJavaScriptEnabled(true);
  return { browser, page };
};

export const closeConnection = async (browser: Browser, page: Page) => {
  page && (await page.close());
  browser && (await browser.close());
};

/**
 * Class: BrowserHandler
 *     Relaunch Browser when Closed
 *     Return false when Browser is Disconnected
 */

export class BrowserHandler {
  public browser: Browser | false = false;
  constructor() {
    const launch_browser = async () => {
      this.browser = await launch(puppetOptions);
      this.browser.on("disconnected", launch_browser);
    };

    (async () => {
      await launch_browser();
    })();
  }
}
