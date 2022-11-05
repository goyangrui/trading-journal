import { useEffect, useState } from "react";

import Wrapper from "../assets/wrappers/DashboardComponent";
import { useAppContext } from "../context/appContext";
import { Loading } from ".";

import { faker } from "@faker-js/faker";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// const data = {
//   labels,
//   datasets: [
//     {
//       fill: true,
//       label: "Dataset 2",
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     },
//   ],
// };

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
    console.log(Object.keys(chartData.cumulativePLObject));
    return (
      <Wrapper>
        {/* area graph of cumulative P&L */}
        <div className="cumulative-container">
          <Line
            options={options}
            data={{
              labels: Object.keys(chartData.cumulativePLObject),
              datasets: [
                {
                  fill: true,
                  label: "Dataset 2",
                  data: Object.values(chartData.cumulativePLObject),
                  borderColor: "rgb(53, 162, 235)",
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
              ],
            }}
          />
        </div>

        {/* area graph of daily average P&L */}
        <div className="daily-avg-container">
          <Line
            options={options}
            data={{
              labels: Object.keys(chartData.averagePLObject),
              datasets: [
                {
                  fill: true,
                  label: "Dataset 2",
                  data: Object.values(chartData.averagePLObject),
                  borderColor: "rgb(53, 162, 235)",
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
              ],
            }}
          />
        </div>
      </Wrapper>
    );
  }
}

export default DashboardComponent;
