import React, { useState, useMemo } from "react";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const PROverview = ({ dashboardData = [] }) => {
  const [selected, setSelected] = useState("approved");
  const navigate = useNavigate();

  // ✅ Filtered + Sorted data
  const filteredData = useMemo(() => {
    let data = [];
    switch (selected) {
      case "approved":
        data = dashboardData.filter((d) =>
          [
            d.status === "Ready For Purchase",
            d.isPOcreated,
            d.poDone,
            d.poInvoice,
          ].some((x) => x)
        );
        break;

      case "grDone":
        data = dashboardData.filter((d) => d.invoiceFully && d.grFully);
        break;
      case "payment":
        data = dashboardData.filter((d) => d.paymentprocessType === "fully");
        break;

      case "deviation":
        data = dashboardData.filter((d) => {
          const approx = parseFloat(
            (d.body?.approxCost || "").replace(/[^\d.]/g, "")
          );
          const receipt = parseFloat(d.receiptAmount || 0);
          return (
            d.receiptAmount &&
            !isNaN(approx) &&
            !isNaN(receipt) &&
            approx > receipt
          );
        });
        break;
      default:
        data = [];
    }

    // ✅ Sort by recently updated, fallback to createdAt
    return data.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    );
  }, [selected, dashboardData]);

  // ✅ Labels
  const getStatusLabel = (key) => {
    switch (key) {
      case "approved":
        return "Approved";
      case "grDone":
        return "GR Done";
      case "payment":
        return "Payment Completed";
      case "deviation":
        return "Deviation";
      default:
        return "";
    }
  };

  // ✅ Badge Colors
  const getStatusClassName = (key) => {
    switch (key) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "grDone":
        return "bg-blue-100 text-blue-700";
      case "payment":
        return "bg-purple-100 text-purple-700";
      case "deviation":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Icons
  const getStatusIcon = (key, isActive) => {
    const iconProps = { fontSize: "small" };
    const colorMap = {
      approved: "text-green-600",
      grDone: "text-blue-500",
      payment: "text-purple-500",
      deviation: "text-yellow-500",
    };
    const activeColor = "text-white";

    switch (key) {
      case "approved":
        return (
          <CheckCircleIcon
            {...iconProps}
            className={isActive ? activeColor : colorMap.approved}
          />
        );
      case "grDone":
        return (
          <LocalShippingIcon
            {...iconProps}
            className={isActive ? activeColor : colorMap.grDone}
          />
        );
      case "payment":
        return (
          <PaymentsIcon
            {...iconProps}
            className={isActive ? activeColor : colorMap.payment}
          />
        );
      case "deviation":
        return (
          <WarningAmberIcon
            {...iconProps}
            className={isActive ? activeColor : colorMap.deviation}
          />
        );
      default:
        return null;
    }
  };

  const toggleItems = [
    { key: "approved", label: "Approved" },
    { key: "grDone", label: "GR Done" },
    { key: "payment", label: "Payment" },
    { key: "deviation", label: "Deviation" },
  ];

  // ✅ Currency formatter
  const formatCurrency = (value, currency = "USD") => {
    if (isNaN(value)) return "N/A";
    const symbol = currency === "INR" ? "₹" : currency === "AED" ? "د.إ" : "$";
    return `${symbol}${value.toFixed(2)}`;
  };

  // ✅ Navigate to Approvers
  const handleViewMore = () => navigate("/approvers");

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-md font-semibold text-gray-800 mb-3">
        Recent Purchase Request Overview
      </h2>

      {/* ✅ Toggle Buttons */}
      <div className="flex gap-3 mb-4">
        {toggleItems.map((item) => {
          const isActive = selected === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setSelected(item.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-300 transform ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 scale-105 shadow-sm"
                  : "bg-white text-gray-700 border-gray-100 hover:bg-blue-50 hover:scale-105"
              }`}
            >
              {getStatusIcon(item.key, isActive)}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="py-2 px-3 text-left">PR No</th>
              <th className="py-2 px-3 text-left">Requester</th>
              <th className="py-2 px-3 text-left">Product</th>
              <th className="py-2 px-3 text-left">Approx Cost</th>
              {selected === "deviation" && (
                <>
                  <th className="py-2 px-3 text-left">Receipt Amount</th>
                  <th className="py-2 px-3 text-left">Deviation Amount</th>
                </>
              )}
              <th className="py-2 px-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.slice(0, 5).map((item, index) => {
              const approx = parseFloat(
                (item.body?.approxCost || "").replace(/[^\d.]/g, "")
              );
              const receipt = parseFloat(item.receiptAmount || 0);
              const deviation = approx - receipt;
              const currency = item.body?.currency || "USD";

              return (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <td className="py-2 px-3">{item.PR_no}</td>
                  <td className="py-2 px-3">
                    <Tooltip title={item.body?.sender_name || "N/A"} arrow>
                      <span>
                        {item.body?.sender_name
                          ? item.body.sender_name.split(" ")[0]
                          : "N/A"}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="py-2 px-3 truncate max-w-[150px]">
                    {item.body?.productName || "N/A"}
                  </td>
                  <td className="py-2 px-3">
                    {formatCurrency(approx, currency)}
                  </td>
                  {selected === "deviation" && (
                    <>
                      <td className="py-2 px-3">
                        {formatCurrency(receipt, currency)}
                      </td>
                      <td className="py-2 px-3 text-red-600 font-medium">
                        -{formatCurrency(deviation, currency)}
                      </td>
                    </>
                  )}
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusClassName(
                        selected
                      )}`}
                    >
                      {getStatusLabel(selected)}
                    </span>
                  </td>
                </tr>
              );
            })}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={selected === "deviation" ? 7 : 5}
                  className="py-3 text-center text-gray-500"
                >
                  No data found for {getStatusLabel(selected)}.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ View More Button */}
        {filteredData.length > 5 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleViewMore}
              className="px-3 py-2 text-xs font-semibold text-white rounded-md 
             bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
             shadow-sm transition-all duration-300 
              "
            >
              View More →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PROverview;
