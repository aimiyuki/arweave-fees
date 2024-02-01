import {
  getArPrice,
  getStoragePriceInAr,
  getStoragePriceStats,
  units,
} from "../src/data-fetcher.ts";

import { expect } from "chai";

describe("data-fetcher", () => {
  describe("getArPrice", () => {
    it("should return the AR token price", async () => {
      const price = await getArPrice();
      expect(price).to.be.within(3, 30);
    });
  });

  describe("getStoragePriceInAr", () => {
    it("should return the price in AR", async () => {
      const price = await getStoragePriceInAr(1024 * 1024 * 1024);
      expect(price).to.be.within(0.1, 5);
    });
  });

  describe("getStoragePriceStats", () => {
    it("should return aggregate prices", async () => {
      const stats = await getStoragePriceStats();

      const priceOneKb = stats[units.KILOBYTE]["usd"];
      const priceOneMb = stats[units.MEGABYTE]["usd"];
      const priceOneGb = stats[units.GIGABYTE]["usd"];

      expect(priceOneGb).to.be.within(1, 10);
      expect(priceOneMb).to.be.within(
        (priceOneGb / 1000) * 0.9,
        (priceOneGb / 1000) * 1.1
      );

      //  smallest unit possible is 256kb, hence the cost of 1kb = cost 256kb =~ cost 1mb / 4
      expect(priceOneKb).to.be.within(
        (priceOneMb / 4) * 0.9,
        (priceOneMb / 4) * 1.1
      );
    });
  });
});
