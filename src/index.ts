import * as cheerio from 'cheerio';
import { http } from './utils';

const url = new URL('https://www.norwegian.com/dk/booking/fly/lavpris');
const params = new URLSearchParams({
  'A_City': 'ALC',
  'AdultCount': '2',
  'ChildCount': '3',
  'CurrencyCode': 'DKK',
  'D_City': 'CPH',
  'D_Day': '05',
  'D_Month': '202003',
  'D_SelectedDay': '05',
  'IncludeTransit': 'false',
  'InfantCount': '0',
  'R_Day': '05',
  'R_Month': '202003',
  'R_SelectedDay': '05',
  'TripType': '2',
  'origin': 'CPH',
  'destination': 'ALC',
  'outbound': '2020-03',
  'selectedOutbound': '2020-03-07',
  'inbound': '2020-03',
  'selectedInbound': '2020-03-07',
  'adults': '2',
  'children': '3',
  'currency': 'DKK'
})
// TODO: choose one at random
const agents: String[] = [
  // chrome
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
  // IE
  'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko',
  // Iphone
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1'
];

// used for fetch()
const fetchOpts = {
  url: `${url}?${params.toString()}`,
  credentials: 'include',
  headers: {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en;q=0.9,da;q=0.8',
    'cache-control': 'max-age=0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    //'User-Agent': agents[Math.floor(Math.random() * agents.length)].toString()
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
  },
  referrerPolicy: 'no-referrer-when-downgrade',
  method: 'GET',
  mode: 'cors'
};
const init = async () => {

  // fetch implementation - DOESN'T WORK, CLOUDFLARE PROTECTED
  const resp = await http(url, fetchOpts);
  console.log('resp', resp);


  // const cDom = cheerio.load(resp.toString());
  //cDom('.lowfare-calendar-combo__item ')
  //  .find('.lowfare-calendar__date')
  //  .map(el => console.log('el', el));
};

init();
