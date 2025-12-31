import React from 'react';
import { Pie } from 'react-chartjs-2';
import './StatusChart.css'; // Import CSS for styling

const StatusChart = ({ data }) => {
  return (
    <div className="status-chart-container">
      {/* <h3 className="status-chart-title">Status Distribution</h3> */}
      <Pie
        data={data}
        width={300}  // Adjust width as needed
        height={300} // Adjust height as needed
      />
    </div>
  );
};

export default StatusChart;
