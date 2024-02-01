import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { HistoricalPrice, units } from "./data-fetcher";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  prices: HistoricalPrice[];
};

function PriceChart({ prices }: ChartProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString("en-US") +
      " " +
      date.toLocaleTimeString("en-US", { hour12: false, timeStyle: "short" })
    );
  };

  const options = {
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 12,
        },
        title: {
          display: true,
          text: "Date time (MM/DD/YYYY hh:mm)",
        },
      },
      y: {
        title: {
          display: true,
          text: "USD",
        },
      },
    },
  };

  const chartData = {
    labels: prices.map((price) => formatTimestamp(price.timestamp)) ?? [],
    datasets: [
      {
        label: "Price for 1GB (USD)",
        data: prices.map((price) => price.prices[units.GIGABYTE]["usd"]),
      },
    ],
  };
  return <Line options={options} data={chartData} />;
}

export default PriceChart;
