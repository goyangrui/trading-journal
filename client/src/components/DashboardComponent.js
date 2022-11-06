import { useEffect, useState } from "react";

import Wrapper from "../assets/wrappers/DashboardComponent";
import { useAppContext } from "../context/appContext";
import { Loading } from ".";

import { faker } from "@faker-js/faker";
import { Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

// default line chart options
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
};

function DashboardComponent() {
  // local isLoading for loading trades
  const [isLoading, setIsLoading] = useState(true);

  // local and global state variables
  const { chartData, getChartData } = useAppContext();

  // useEffect
  // on initial render, send get request to get trades from server. Set isLoading to false once getTrades proccess has been completed.
  useEffect(() => {
    const loadData = async () => {
      await getChartData();
      // set isLoading to false (to display the trades list)
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <Wrapper>
        {/* CHARTS AND GRAPHS CONTAINER */}
        <div className="charts-container">
          {/*CUMULATIVE P&L STATS BLOCK */}
          <div className="chart-stat-container cumulative">
            {/* cumulative P&L stat */}
            <div className="chart-stat">
              <span>Cumulative P&L $</span>
              <span>{`$ ${chartData.stats.cumulativePL}`}</span>
            </div>

            {/* area graph of cumulative P&L */}
            <div className="chart-container">
              <Line
                options={{
                  ...lineChartOptions,
                  plugins: {
                    ...lineChartOptions.plugins,
                    title: {
                      ...lineChartOptions.plugins.title,
                      text: "Cumulative P&L",
                    },
                  },
                }}
                data={{
                  labels: Object.keys(chartData.cumulativePLObject),
                  datasets: [
                    {
                      fill: true,
                      label: "Cumulative P&L",
                      data: Object.values(chartData.cumulativePLObject),
                      borderColor: "#ff8906",
                      backgroundColor: "#ff890670",
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* DAILY AVERAGE P&L STATS BLOCK */}
          <div className="chart-stat-container daily-avg">
            {/* daily average P&L stat */}
            <div className="chart-stat">
              <span>Daily Average P&L $</span>
              <span>{`$ ${chartData.stats.dailyAvgPL}`}</span>
            </div>
            {/* area graph of daily average P&L */}
            <div className="chart-container">
              <Line
                options={{
                  ...lineChartOptions,
                  plugins: {
                    ...lineChartOptions.plugins,
                    title: {
                      ...lineChartOptions.plugins.title,
                      text: "Daily Average P&L",
                    },
                  },
                }}
                data={{
                  labels: Object.keys(chartData.averagePLObject),
                  datasets: [
                    {
                      fill: true,
                      label: "Daily Average P&L",
                      data: Object.values(chartData.averagePLObject),
                      borderColor: "#ff8906",
                      backgroundColor: "#ff890670",
                    },
                  ],
                }}
              />
            </div>
          </div>
          {/* PROFIT FACTOR STATS BLOCK */}
          <div className="chart-stat-container profit-factor">
            {/* overall profit factor */}
            <div className="chart-stat">
              <span>Profit Factor</span>
              <span>{`${chartData.stats.RR.toFixed(2)}`}</span>
            </div>
            {/* area graph of daily average P&L */}
            <div className="chart-container">
              <Line
                options={{
                  ...lineChartOptions,
                  plugins: {
                    ...lineChartOptions.plugins,
                    title: {
                      ...lineChartOptions.plugins.title,
                      text: "Profit Factor",
                    },
                  },
                }}
                data={{
                  labels: Object.keys(chartData.RRObject),
                  datasets: [
                    {
                      fill: true,
                      label: "Profit Factor",
                      data: Object.values(chartData.RRObject),
                      borderColor: "#ff8906",
                      backgroundColor: "#ff890670",
                    },
                  ],
                }}
              />
            </div>
          </div>
          {/* WIN LOSS PERCENTAGE STATS BLOCK */}
          <div className="chart-stat-container win-loss-percent">
            {/* win percentage */}
            <div className="chart-stat">
              <span>Win %</span>
              <span>{`${chartData.WLObject.winPercentage.toFixed(2)}`}</span>
            </div>
            {/* pie chart of win percentage */}
            <div className="chart-container">
              <Pie
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
                data={{
                  labels: ["Win percentage", "Loss percentage"],
                  datasets: [
                    {
                      data: Object.values(chartData.WLObject),
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default DashboardComponent;
