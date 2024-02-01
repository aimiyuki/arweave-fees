import axios from "axios";

const AR_PRICE_ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=arweave";

export const units = {
  KILOBYTE: 1024,
  MEGABYTE: 1024 * 1024,
  GIGABYTE: 1024 * 1024 * 1024,
};

export const unitSymbols = {
  [units.KILOBYTE]: "KB",
  [units.MEGABYTE]: "MB",
  [units.GIGABYTE]: "GB",
};

const WINSTON_DECIMALS = 12;

export type StoragePrices = Record<number, Record<string, number>>;

/**
 * Retrieves the AR token prices from CoinGecko.
 * @return {Promise<number>} the Price of an AR token in USD
 */
export async function getArPrice(): Promise<number> {
  const r = await axios.get(AR_PRICE_ENDPOINT);
  return r.data["arweave"]["usd"];
}

/**
 * Returns the price of storing `dataSizeInBytes` to Arweave
 * @param {number} dataSizeInBytes
 * @return {Promise<number>} the amount of AR tokens requried
 */
export async function getStoragePriceInAr(dataSizeInBytes: number): Promise<number> {
  const r = await axios.get(`https://arweave.net/price/${dataSizeInBytes}`, {
    responseType: "text",
  });
  return Number(r.data) / Math.pow(10, WINSTON_DECIMALS);
}

/**
 * Fetches information about storage prices
 * @return {StoragePrices} an aggregate of storage prices
 */
export async function getStoragePriceStats(): Promise<StoragePrices> {
  const arTokenPrice = await getArPrice();
  const unitEntries = Object.entries(units);
  const storagePrices = await Promise.all(unitEntries.map((v) => getStoragePriceInAr(v[1])));
  const makeEntry = (i: number) => ({ ar: storagePrices[i], usd: storagePrices[i] * arTokenPrice });
  const entries = unitEntries.map((v, i) => [v[1], makeEntry(i)]);
  return Object.fromEntries(entries);
}
