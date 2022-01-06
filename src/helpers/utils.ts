import bs from 'black-scholes';
import volatility from 'volatility';

// Used to round user's balance (OHM, SLP, etc) that won't cause contract overflow issues.
export function roundBalance(value) {
  return Math.floor(value * Math.pow(10, 15)) / Math.pow(10, 15);
}

export function trim(number, precision) {
  if (number == undefined) {
    number = 0;
  }
  const array = number.toString().split('.');
  if (array.length === 1)
    return number.toString();

  array.push(array.pop().substring(0, precision));
  const trimmedNumber = array.join('.');
  return trimmedNumber;
}

export function trimNumber(number, precision) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: precision }).format(number);
}

export function formatTs(ts) {
  if (!ts) return '';
  const date = new Date(ts * 1000);
  return date.toISOString().split('T')[0];
}

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export async function getMarketChartFromCoinGecko(coingeckoId) {
  const ratePerDay = {};
  const uri = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=31`;
  const marketChart = await fetch(uri).then(res => res.json());
  marketChart.prices.forEach(p => {
    const date = new Date();
    date.setTime(p[0]);
    const day = date.toISOString().split('T')[0];
    ratePerDay[day] = p[1];
  });
  return ratePerDay;
}

export async function getVolatility(coingeckoId, fromDay) {
  const fromDate = new Date(fromDay);
  fromDate.setDate(fromDate.getDate() - 2);
  const pricePerDay = await getMarketChartFromCoinGecko(coingeckoId);
  const pricePerDayValid = {};
  Object.entries(pricePerDay).forEach(price => {
    if (new Date(price[0]) > fromDate) pricePerDayValid[price[0]] = price[1];
  });
  console.log('Price per day', pricePerDayValid);
  let prevPrice;
  const priceArr = [];
  Object.entries(pricePerDayValid).forEach(priceValid => {
    // @ts-ignore
    if (prevPrice) priceArr.push(Math.log(priceValid[1] / prevPrice));
    prevPrice = priceValid[1];
  });
  console.log('Price array', priceArr);
  console.log('coingeckoId', coingeckoId);
  return Math.sqrt(365) * volatility(priceArr);
}

export async function getBS(coingeckoId, fromDay, k, s, t) {
  const v = await getVolatility(coingeckoId, fromDay);
  console.log('v:', v); // Volatility between minting and liquidation
  console.log('s:', s); // Price at minting
  console.log('k:', k); // Strike price
  console.log('t:', t); // Time between minting and liquidation
  const BS = bs.blackScholes(s, k, t, v, 0, 'put');
  console.log('BS =', BS);
  return BS;
}

export function getMinDay(mintDay) {
  const ms = new Date().getTime() + 86400000 * 5;
  const minDay = new Date(ms);
  return mintDay > minDay ? mintDay : minDay;
}
