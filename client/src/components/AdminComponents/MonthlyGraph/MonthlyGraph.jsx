// MonthlyStatusGraphs.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import './MonthlyGraph.css'

const MonthlyGraph = ({ data }) => {
  const { pendingChartData, inProcessChartData, processingChartData } = data;

  return (
    <div className="monthly-status-graphs">
      <div className="chart pending-approval-chart">
        <h3> Approval For Level-1(Monthly)</h3>
        <Bar
          data={pendingChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
          height={100}
          width={100}
        />
      </div>
      <div className="chart in-process-chart">
        <h3>Approval For Level-2(Monthly)</h3>
        <Bar
          data={inProcessChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
          height={100}
          width={100}
        />
      </div>
      <div className="chart processing-chart">
        <h3>Approval For Level-3 (Monthly)</h3>
        <Bar
          data={processingChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
          height={100}
          width={100}
        />
      </div>
    </div>
  );
};

export default MonthlyGraph;
