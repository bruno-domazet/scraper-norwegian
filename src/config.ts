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
    "--deterministic-fetch"
  ]
};

// @link https://stackoverflow.com/questions/51175788/how-can-my-containerized-puppeteer-talk-to-my-host-machine-chrome#51184634
// `google-chrome --remote-debugging-port=9222`
export const puppetWSOptions: ConnectOptions = {
  browserWSEndpoint: process.env.WS_ENDPOINT || undefined
};

export const dbConfig = {
  host: process.env.DB_HOST || "mongodb://localhost:27017",
  db: process.env.DB_NAME || "scraper",
  collection: process.env.DB_COLLECTION_NAME || "flightPrices"
};

export const dbClientOptions: MongoClientOptions = {
  auth: {
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "example"
  },
  validateOptions: true
};
