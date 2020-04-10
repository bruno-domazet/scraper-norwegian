import { puppetOptions } from "./config";
import { launch, Page, Browser, connect } from "puppeteer";

// @link https://stackoverflow.com/questions/51175788/how-can-my-containerized-puppeteer-talk-to-my-host-machine-chrome#51184634
export const openPuppetConnection = async (
  withWebSocket: string | undefined
) => {
  const browser: Browser = withWebSocket
    ? await connect({
        browserWSEndpoint: withWebSocket,
      })
    : await launch(puppetOptions);

  // go incognito
  const ctx = await browser.createIncognitoBrowserContext();
  const page = await ctx.newPage();
  // TODO randomize user-agents (max 3)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
  );
  await page.setViewport({ width: 1680, height: 1050 });
  await page.setJavaScriptEnabled(true);

  // try to reopen browser (re-opens even on force close...)
  // browser.on("disconnected", openPuppetConnection);

  return { browser, page };
};

export const closePuppetConnection = async (browser: Browser|undefined, page: Page|undefined) => {
  page && (await page.close());
  browser && (await browser.disconnect());
};

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sleep = async (sec: number) =>
  new Promise((res) => {
    setTimeout(res, sec * 1000);
  });

export const sleepRandom = async (sec: number, noise: number) =>
  new Promise((res) => {
    setTimeout(res, sec * 1000 - noise + Math.random() * 2 * noise);
  });

export const resolveDockerHostNameOrIp = () => {
  return process.env.DOCKER_HOST_IP || "172.17.0.1";
};
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
