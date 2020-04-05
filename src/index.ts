// load envs
require("dotenv-flow").config();

import { default as express } from "express";
import { scrape } from "./scraper";

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("TODO: Dashboard!"));

app.get("/health", (req, res) => {
  // check mongodb + index
  return res.send("TODO: health + metrics");
});

// TODO: endpoint per airline/site
app.get("/scrape", async (req, res) => {
  const result = await scrape();
  return res.send(result.message);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
