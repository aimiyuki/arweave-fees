import { useEffect, useState } from "react";
import "./App.css";

import {
  StoragePrices,
  getStoragePriceStats,
  unitSymbols,
} from "./data-fetcher";

function App() {
  const [stats, setStats] = useState<StoragePrices | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStoragePriceStats()
      .then(setStats)
      .catch(() => {
        setError("Could not fetch the data");
      });
  }, []);

  return (
    <>
      <h1>Arweave Storage Prices</h1>
      {!stats ? (
        error ? (
          <p>{error}</p>
        ) : (
          <p className="loading">Loading...</p>
        )
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
    </>
  );
}

export default App;
