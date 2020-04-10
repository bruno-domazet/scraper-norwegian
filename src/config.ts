import { MongoClientOptions } from "mongodb";
import { LaunchOptions, ConnectOptions } from "puppeteer-core";

// TODO: conf per ENV, dev + cloud
export const puppetOptions: LaunchOptions = {
  executablePath: process.env.PATH_TO_CHROME || "/usr/bin/google-chrome",
  headless: false,
  slowMo: 200, // maybe needed?
  args: [
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--timeout=30000",
    "--no-first-run",
    "--no-sandbox",
    "--no-zygote",
    //'--single-process', // breaks on DEV
    "--proxy-server='direct://'",
    "--proxy-bypass-list=*",
    "--deterministic-fetch",
  ],
};

export const dbConfig = {
  host: `mongodb://${process.env.DB_HOST || "localhost"}:${
    process.env.DB_PORT || 27017
  }`,
  db: process.env.DB_NAME || "scraper",
  collection: process.env.DB_COLLECTION_NAME || "flightPrices",
};

export const dbClientOptions: MongoClientOptions = {
  auth: {
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "example",
  },
  validateOptions: true,
};
