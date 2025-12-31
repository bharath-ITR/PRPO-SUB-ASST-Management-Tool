import React from 'react';
import { Bar } from 'react-chartjs-2';
import './StatusGraph.css'; // Import CSS for styling

const StatusGraph = ({ data }) => {
  const options = {
    scales: {
      y: {
        ticks: {
          stepSize: 5, // Adjust step size for y-axis ticks
          beginAtZero: true, // Start y-axis at zero
        },
      },
    },
  };

  return (
    <div className="status-graph-container">
      <h3 className="status-graph-title">Monthly Ready For Purchase Count</h3>
      <Bar
        data={data}
        options={options}
      />
    </div>
  );
};

export default StatusGraph;
