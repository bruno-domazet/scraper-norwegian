# Scraper - Norwegian.com

Puppeteer based scraper + cheerio parser for norwegian.com

## Setup

- `./bin/build.sh` - rebuilds the nodejs app docker image
- `./bin/up.sh` - starts services and a `google-chrome` instance
- `./bin/down.sh` - stops services and `google-chrome`

## Service

- `/` - dashboard (TODO)
- `/health` - health status (+ metrics (TODO))
- `/scrape` - triggers a scrape

### Scraper

- Steps through 12 months ahead today, while passing the HTML on to the parser
- After parsing, store parsed data to DB

## Parser

- `cheerio` loads the HTML from the scrape results
- return mapped out data (date,price,origin)

## TODO

- abstract the scraper+parser setup, to support additional websites
- ~~add express~~
  - ~~setup mongodb, users and indices~~
  - ~~service lives forever, browser+db conn closed on each scrape~~
  - dashboard (maybe MongoDB Charts?)
  - service health + metrics
- daily cronjob triggers the scrapping
- add "human behavior" to puppeteer
- profit??

# FUTURE

- deploy to cloud (both services?)
  - linux VM, with chrome gui
  - setup DB
  - setup graphs
