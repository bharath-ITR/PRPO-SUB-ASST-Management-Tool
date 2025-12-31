import React from 'react';
import { Line } from 'react-chartjs-2';
import './SummaryGraph.css';

const SummaryGraph = ({ monthlyChartData, height = 400, width = 600 }) => {
  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12 // Adjust label size
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12 // Adjust x-axis label size
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 12 // Adjust y-axis label size
          },
          stepSize: 5, // Adjust step size for y-axis ticks
          beginAtZero: true // Start y-axis at zero
        }
      }
    }
  };

  return (
    <div className="summary-graph-container">
      <h3 className="summary-graph-title">Monthly PRs Raised</h3>
      <Line data={monthlyChartData} height={height} width={width} options={options} />
    </div>
  );
};

export default SummaryGraph;
