import { onSchedule } from "firebase-functions/v2/scheduler";
import { getStoragePriceStats } from "../../src/data-fetcher";
import admin from "firebase-admin";
import { getDatabase } from "firebase-admin/database";

admin.initializeApp();

export const fetchPrices = onSchedule("*/15 * * * *", async () => {
  const db = getDatabase();
  const prices = db.ref("prices");
  const storagePrices = await getStoragePriceStats();
  prices.push({
    prices: storagePrices,
    timestamp: Date.now(),
  });
});
