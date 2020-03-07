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

export const closeConnection = async (page:Page, browser:Browser) => {
  page && (await page.close());
  browser && (await browser.close());
};
