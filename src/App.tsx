import { useEffect, useState } from "react";
import "./App.css";

import {
  HistoricalPrice,
  StoragePrices,
  getHistoricalPriceStats,
  getStoragePriceStats,
  unitSymbols,
} from "./data-fetcher";
import PriceChart from "./PriceChart";

function ErrorOrLoading({ error }: { error?: string }) {
  return error ? <p>{error}</p> : <p className="loading">Loading...</p>;
}

function App() {
  const [stats, setStats] = useState<StoragePrices | null>(null);
  const [historicalPrices, setHistoricalPrices] = useState<HistoricalPrice[]>();
  const [error, setError] = useState("");

  useEffect(() => {
    getStoragePriceStats()
      .then(setStats)
      .catch(() => {
        setError("Could not fetch current price data");
      });

    getHistoricalPriceStats()
      .then(setHistoricalPrices)
      .catch(() => {
        setError("Could not fetch historical price data");
      });
  }, []);

  return (
    <>
      <h1>Arweave Storage Prices</h1>
      {!stats ? (
        <ErrorOrLoading error={error} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Price AR</th>
              <th>Price USD</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats).map(([unit, stats]) => {
              return (
                <tr key={unit}>
                  <td>1 {unitSymbols[parseInt(unit)]}</td>
                  <td>{stats.ar.toPrecision(4)} AR</td>
                  <td>{stats.usd.toPrecision(4)} USD</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {!historicalPrices ? (
        <ErrorOrLoading error={error} />
      ) : (
        <section>
          <h2>Historical prices</h2>
          <PriceChart prices={historicalPrices} />
        </section>
      )}
    </>
  );
}

export default App;
