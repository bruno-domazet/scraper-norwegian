# Scraper - Norwegian.com

Puppeteer based scraper + cheerio parser for norwegian.com

## Setup

- yarn build
- ./bin/scrape.sh
- ./bin/parse.sh

## Scraper

- Steps through 12 months ahead, while saving the HTML on every navigation
  - file structure: "{scrapeDate}/{navigationYM}.txt"

## Parser

- cheerio loads the HTML from the scrape results
- maps out date=>price
- save data to DB

## TODO

- separate scraping from parsing into different services
- scraper: step through 12 months ahead, while saving the HTML on every navigation
- parser: map date=>price from HTML, save to external DB

# OPTIMIZATIONS

- deploy to cloud (both services?)
  - linux VM, with chrome gui
  - setup cloud buckets
  - setup a DB
  - setup graphs
