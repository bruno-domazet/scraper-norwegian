import { puppetOptions } from "./config";
import { launch, Page, Browser } from "puppeteer";

export const openPuppetConnection = async () => {
  const browser = await launch(puppetOptions);
  const page = await browser.newPage();
  // TODO randomize user-agents (max 3)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
  );
  await page.setViewport({ width: 1680, height: 1050 });
  await page.setJavaScriptEnabled(true);
  // try to reopen browser
  browser.on("disconnected", openPuppetConnection);
  return { browser, page };
};

export const closePuppetConnection = async (browser: Browser, page: Page) => {
  page && (await page.close());
  browser && (await browser.close());
};

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sleep = async (sec: number) =>
  new Promise(res => {
    setTimeout(res, sec * 1000);
  });

export const sleepRandom = async (sec: number, noise: number) =>
  new Promise(res => {
    setTimeout(res, sec * 1000 - noise + Math.random() * 2 * noise);
  });

/**
 * Class: BrowserHandler
 *     Relaunch Browser when Closed
 *     Return false when Browser is Disconnected
 */
/*
// TODO: implement something like this, to resume in case browser crashes
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
*/
