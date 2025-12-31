import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const statusColors = {
  "Pending for Approval": "#FFA500", // Orange
  "In Process": "#1E90FF", // Blue
  Processing: "#32CD32", // Green
};

const ApprovalLevelsChart = ({
  dashboardData,
  timeRange: parentTimeRange,
  isDarkMode,
}) => {
  const [timeRange, setTimeRange] = useState(parentTimeRange || "monthly");
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        id: "approval-progress-chart",
        type: "area",
        height: 300,
        background: isDarkMode ? "#1f2937" : "#fff",
        toolbar: { show: false },
        dropShadow: {
          enabled: true,
          opacity: 0.15,
          blur: 6,
          left: 1,
          top: 1,
        },
      },
      theme: {
        mode: isDarkMode ? "dark" : "light",
      },
      colors: [
        statusColors["Pending for Approval"],
        statusColors["In Process"],
        statusColors["Processing"],
      ],
      dataLabels: { enabled: false },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.2,
          gradientToColors: [
            "#FFD580", // lighter orange gradient end
            "#63B3FF", // lighter blue gradient end
            "#86EFAC", // lighter green gradient end
          ],
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: [
          statusColors["Pending for Approval"],
          statusColors["In Process"],
          statusColors["Processing"],
        ],
      },
      markers: { size: 3 },
      tooltip: { shared: true, intersect: false },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: isDarkMode ? "#d1d5db" : "#4b5563",
          },
        },
        axisBorder: {
          show: true,
          color: isDarkMode ? "#374151" : "#e7e7e7",
        },
        axisTicks: {
          show: true,
          color: isDarkMode ? "#374151" : "#e7e7e7",
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode ? "#d1d5db" : "#4b5563",
          },
        },
      },
      grid: {
        borderColor: isDarkMode ? "#374151" : "#e7e7e7",
        strokeDashArray: 5,
      },
      legend: {
        labels: {
          colors: isDarkMode ? "#d1d5db" : "#4b5563",
        },
      },
    },
  });

  // Aggregate counts by status and time (same as your original function)
  const aggregateData = (status) => {
    if (!dashboardData || dashboardData.length === 0)
      return { categories: [], counts: [] };

    let categories = [];
    let counts = [];

    const statusLower = status.toLowerCase();

    if (timeRange === "monthly") {
      categories = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      counts = Array(12).fill(0);

      dashboardData.forEach((item) => {
        if ((item.status || "").toLowerCase() === statusLower) {
          const date = new Date(item.dateSent);
          counts[date.getMonth()] += 1;
        }
      });
    } else if (timeRange === "weekly") {
      categories = ["Week 1", "Week 2", "Week 3", "Week 4"];
      counts = Array(4).fill(0);

      dashboardData.forEach((item) => {
        if ((item.status || "").toLowerCase() === statusLower) {
          const date = new Date(item.dateSent);
          const week = Math.ceil(date.getDate() / 7) - 1;
          counts[week] += 1;
        }
      });
    } else if (timeRange === "daily") {
      categories = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
      counts = Array(30).fill(0);

      dashboardData.forEach((item) => {
        if ((item.status || "").toLowerCase() === statusLower) {
          const date = new Date(item.dateSent);
          counts[date.getDate() - 1] += 1;
        }
      });
    }

    return { categories, counts };
  };

  // Update chart data and options on timeRange, dashboardData or theme change
  useEffect(() => {
    const pending = aggregateData("Pending for Approval");
    const inProcess = aggregateData("In Process");
    const processing = aggregateData("Processing");

    setChartData((prev) => ({
      ...prev,
      series: [
        { name: "Level-1(Pending for Approvals)", data: pending.counts },
        { name: "Level-2(In Process)", data: inProcess.counts },
        { name: "Level-3(Processing)", data: processing.counts },
      ],
      options: {
        ...prev.options,
        xaxis: {
          ...prev.options.xaxis,
          categories: pending.categories,
          labels: {
            style: {
              colors: isDarkMode ? "#d1d5db" : "#4b5563",
            },
          },
          axisBorder: {
            color: isDarkMode ? "#374151" : "#e7e7e7",
          },
          axisTicks: {
            color: isDarkMode ? "#374151" : "#e7e7e7",
          },
        },
        yaxis: {
          ...prev.options.yaxis,
          labels: {
            style: {
              colors: isDarkMode ? "#d1d5db" : "#4b5563",
            },
          },
        },
        grid: {
          ...prev.options.grid,
          borderColor: isDarkMode ? "#374151" : "#e7e7e7",
        },
        legend: {
          ...prev.options.legend,
          labels: {
            colors: isDarkMode ? "#d1d5db" : "#4b5563",
          },
        },
        chart: {
          ...prev.options.chart,
          background: isDarkMode ? "#1f2937" : "#fff",
        },
        theme: {
          mode: isDarkMode ? "dark" : "light",
        },
      },
    }));
  }, [timeRange, dashboardData, isDarkMode]);

  return (
    <div
      className={`bg-white rounded-2xl p-4 transition-shadow duration-300
      ${
        isDarkMode
          ? "shadow-sm bg-gray-800"
          : "shadow-sm bg-white hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h2
          className={`text-md font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Approval Levels
        </h2>
        <select
          className={`border rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-400"
              : "border-gray-300 bg-white text-gray-700 focus:ring-blue-500"
          }`}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={300}
      />
    </div>
  );
};

export default ApprovalLevelsChart;
