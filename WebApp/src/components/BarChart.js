import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const BarChart = ({plot}) => {
  const data = {
    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
    datasets: [
      {
        label: 'Values',
        data: [30, 60, 45, 80, 50],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // This makes the bars horizontal
    responsive: true,
    scales: {
      x: {
        min: 0, // Define the min range
        max: 100, // Define the max range
        ticks: {
          stepSize: 20, // Control the tick interval
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Disable legend for a clean plot
      },
    },
    elements: {
      bar: {
        borderRadius: 5, // Round the bar edges for better visualization
      },
    },
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
