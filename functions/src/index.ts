import { onSchedule } from "firebase-functions/v2/scheduler";
import { getStoragePriceStats } from "../../src/data-fetcher";
import admin from "firebase-admin";
import { getDatabase } from "firebase-admin/database";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();

const ONE_DAY = 3600 * 24 * 1_000;

export const fetchPrices = onSchedule("*/15 * * * *", async () => {
  const db = getDatabase();
  const prices = db.ref("prices");
  const storagePrices = await getStoragePriceStats();
  prices.push({
    prices: storagePrices,
    timestamp: Date.now(),
  });
});

export const getPrices = onRequest({ cors: true }, async (_, res) => {
  const db = getDatabase();
  const prices = db.ref("prices");
  const start = Date.now() - ONE_DAY;
  const snapshot = await prices.orderByChild("timestamp").startAt(start).get();
  res.json(snapshot.val());
});
