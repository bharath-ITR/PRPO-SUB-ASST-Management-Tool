

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestForDashboard } from "../../redux/Action";

import CurrencyWidgets from "./CurrencyWidgets";
import ApprovalLevelsChart from "./ApprovalLevelsChart";
import PROverview from "./PROverview";
import StatusPieChart from "./StatusPieChart";
import StatusSummary from "./StatusSummary";

const AdminHome = () => {
  const dispatch = useDispatch();
  const { statusCounts, monthlyStatusCounts, dashboardData } = useSelector(
    (state) => state.getDashboardRequest
  );

  const [selectedLevel, setSelectedLevel] = useState(3);
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    dispatch(getRequestForDashboard());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="flex justify-between items-center mb-4 space-x-4 mt-12">
        <p className="text-xl font-semibold text-blue-900">
          Track PR/PO approvals, processing status, and monthly trends
        </p>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedLevel === level
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Level {level}
            </button>
          ))}
        </div>
      </div>

      <CurrencyWidgets
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        dashboardData={dashboardData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ApprovalLevelsChart
          dashboardData={dashboardData}
          timeRange={timeRange}
        />
        <PROverview dashboardData={dashboardData} timeRange={timeRange} />
      </div>

    </div>
  );
};

export default AdminHome;
