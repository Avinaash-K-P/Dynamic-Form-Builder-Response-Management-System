import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import type { FormResponseSummary } from "../../services/dashboardService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResponseChartProps {
  data: FormResponseSummary[];
}

const ResponseChart = ({
  data,
}: ResponseChartProps) => {
  const chartData = {
    labels: data.map(
      (item) => item.form_title
    ),

    datasets: [
      {
        label: "Responses",
        data: data.map(
          (item) => item.response_count
        ),
        backgroundColor: "#22C55E",
        borderColor: "#166534",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },

      title: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="response-chart">
      <Bar
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default ResponseChart;
