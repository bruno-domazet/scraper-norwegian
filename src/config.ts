import { MongoClientOptions } from "mongodb";
import { LaunchOptions } from "puppeteer-core";

// TODO: conf per ENV, dev + cloud
export const puppetOptions: LaunchOptions = {
  executablePath: process.env.pathToChrome || "/usr/bin/google-chrome",
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
    "--deterministic-fetch"
  ]
};

export const dbConfig = {
  host: process.env.dbHost || "mongodb://localhost:27017",
  db: process.env.dbName || "scraper",
  collection: process.env.dbCollection || "norwegian.com"
};

export const dbClientOptions: MongoClientOptions = {
  auth: {
    user: process.env.dbUser || "root",
    password: process.env.dbUser || "example"
  },
  validateOptions: true
};
