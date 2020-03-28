# Scraper - Norwegian.com

Puppeteer based scraper + cheerio parser for norwegian.com

## Setup

- yarn build
- ./bin/scrape.sh
- ./bin/parse.sh

## Scraper

- Steps through 12 months ahead today, while passing the HTML on to the parser
- After parsing, store to DB

## Parser

- cheerio loads the HTML from the scrape results
- return mapped out date=>price

## TODO

- dockerize the app
  - setup mongodb, users and indices
  - service lives forever, browser+db conn closed on each scrape
- daily cronjob triggers the scrapping
- add "human behavior" to puppeteer
- profit??

# FUTURE

- deploy to cloud (both services?)
  - linux VM, with chrome gui
  - setup DB
  - setup graphs
